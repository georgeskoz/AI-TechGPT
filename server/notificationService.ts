import { WebSocket } from 'ws';
import type { 
  JobDispatchRequest, 
  InsertJobDispatchRequest, 
  Technician,
  InsertProviderResponseAnalytics,
  InsertProviderRecommendation
} from '@shared/schema';
import { providerMatchingService } from './providerMatching';

interface WebSocketConnection {
  ws: WebSocket;
  technicianId: number;
  isActive: boolean;
  lastSeen: Date;
}

interface JobDispatchNotification {
  id: number;
  ticketId: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  serviceType: 'onsite' | 'remote' | 'phone';
  category: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  
  customerLocation: {
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    zipCode: string;
  };
  
  estimates: {
    cost: number;
    duration: number;
    distance: number;
    eta: number;
    trafficFactor: number;
  };
  
  responseDeadline: string;
  createdAt: string;
}

export class NotificationService {
  private connections = new Map<number, WebSocketConnection>();
  private pendingRequests = new Map<number, {
    dispatchRequest: JobDispatchRequest;
    currentTechnicianIndex: number;
    recommendedTechnicians: number[];
    timeout: NodeJS.Timeout;
  }>();

  /**
   * Register a technician's WebSocket connection
   */
  registerConnection(technicianId: number, ws: WebSocket): void {
    // Close existing connection if any
    const existing = this.connections.get(technicianId);
    if (existing) {
      existing.ws.close();
    }

    this.connections.set(technicianId, {
      ws,
      technicianId,
      isActive: true,
      lastSeen: new Date()
    });

    ws.on('close', () => {
      this.connections.delete(technicianId);
    });

    ws.on('pong', () => {
      const connection = this.connections.get(technicianId);
      if (connection) {
        connection.lastSeen = new Date();
      }
    });

    console.log(`Technician ${technicianId} connected to notification service`);
  }

  /**
   * Remove a technician's connection
   */
  removeConnection(technicianId: number): void {
    const connection = this.connections.get(technicianId);
    if (connection) {
      connection.ws.close();
      this.connections.delete(technicianId);
    }
  }

  /**
   * Check if a technician is online
   */
  isTechnicianOnline(technicianId: number): boolean {
    const connection = this.connections.get(technicianId);
    if (!connection) return false;

    // Check if connection is still active (within last 30 seconds)
    const thirtySecondsAgo = new Date(Date.now() - 30000);
    return connection.isActive && connection.lastSeen > thirtySecondsAgo;
  }

  /**
   * Send notification to a specific technician
   */
  private sendNotificationToTechnician(
    technicianId: number, 
    notification: JobDispatchNotification
  ): boolean {
    const connection = this.connections.get(technicianId);
    if (!connection || !this.isTechnicianOnline(technicianId)) {
      return false;
    }

    try {
      const message = JSON.stringify({
        type: 'job_dispatch_request',
        data: notification
      });

      connection.ws.send(message);
      console.log(`Sent job notification to technician ${technicianId}`);
      return true;
    } catch (error) {
      console.error(`Failed to send notification to technician ${technicianId}:`, error);
      return false;
    }
  }

  /**
   * Create and dispatch a job request to optimal technicians
   */
  async dispatchJobRequest(
    jobRequest: {
      customerId: number;
      ticketId: number;
      serviceType: 'onsite' | 'remote' | 'phone';
      category: string;
      description: string;
      urgency: 'low' | 'medium' | 'high' | 'urgent';
      customerLocation: {
        address: string;
        latitude: number;
        longitude: number;
        city: string;
        state: string;
        zipCode: string;
      };
    },
    availableTechnicians: Technician[]
  ): Promise<{ success: boolean; dispatchRequestId?: number; message: string }> {
    try {
      // Get AI recommendations for optimal technicians
      const recommendations = await providerMatchingService.findOptimalProviders(
        jobRequest,
        availableTechnicians
      );

      if (recommendations.length === 0) {
        return {
          success: false,
          message: 'No available technicians found for this job'
        };
      }

      // Create dispatch request for the top-recommended technician
      const topTechnician = recommendations[0].technician;
      const dispatchRequest = await providerMatchingService.createDispatchRequest(
        jobRequest,
        topTechnician
      );

      // Mock storing in database (replace with actual database call)
      const dispatchRequestId = Math.floor(Math.random() * 10000);
      const fullDispatchRequest: JobDispatchRequest = {
        id: dispatchRequestId,
        ...dispatchRequest,
        status: 'pending',
        notificationSentAt: new Date(),
        viewedAt: null,
        respondedAt: null,
        responseTimeSeconds: null,
        reassignmentCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store pending request for timeout handling
      this.pendingRequests.set(dispatchRequestId, {
        dispatchRequest: fullDispatchRequest,
        currentTechnicianIndex: 0,
        recommendedTechnicians: recommendations.map(r => r.technicianId),
        timeout: setTimeout(() => {
          this.handleTimeout(dispatchRequestId);
        }, 60000) // 60 seconds timeout
      });

      // Create notification object
      const notification: JobDispatchNotification = {
        id: dispatchRequestId,
        ticketId: jobRequest.ticketId,
        customerId: jobRequest.customerId,
        customerName: 'John Smith', // Mock data - get from database
        customerPhone: '(555) 123-4567', // Mock data - get from database
        serviceType: jobRequest.serviceType,
        category: jobRequest.category,
        description: jobRequest.description,
        urgency: jobRequest.urgency,
        customerLocation: jobRequest.customerLocation,
        estimates: {
          cost: parseFloat(dispatchRequest.estimatedCost || '0'),
          duration: dispatchRequest.estimatedDuration || 90,
          distance: parseFloat(dispatchRequest.estimatedDistance || '0'),
          eta: dispatchRequest.estimatedETA || 30,
          trafficFactor: parseFloat(dispatchRequest.trafficFactor || '1.0')
        },
        responseDeadline: dispatchRequest.responseDeadline!.toISOString(),
        createdAt: new Date().toISOString()
      };

      // Send notification to the technician
      const sent = this.sendNotificationToTechnician(topTechnician.id!, notification);

      if (!sent) {
        // If can't send to top technician, try next one
        this.reassignToNextTechnician(dispatchRequestId);
      }

      return {
        success: true,
        dispatchRequestId,
        message: `Job dispatched to ${recommendations.length} recommended technician(s)`
      };

    } catch (error) {
      console.error('Error dispatching job request:', error);
      return {
        success: false,
        message: 'Failed to dispatch job request'
      };
    }
  }

  /**
   * Handle technician response (accept/reject)
   */
  async handleTechnicianResponse(
    dispatchRequestId: number,
    technicianId: number,
    action: 'accepted' | 'rejected',
    responseTimeSeconds: number,
    deviceInfo?: { deviceType?: string; userAgent?: string }
  ): Promise<{ success: boolean; message: string }> {
    const pendingRequest = this.pendingRequests.get(dispatchRequestId);
    if (!pendingRequest) {
      return {
        success: false,
        message: 'Request not found or already processed'
      };
    }

    // Clear timeout
    clearTimeout(pendingRequest.timeout);

    // Log analytics
    const analytics = await providerMatchingService.logProviderResponse(
      dispatchRequestId,
      technicianId,
      action,
      responseTimeSeconds,
      deviceInfo
    );

    // Mock storing analytics (replace with actual database call)
    console.log('Provider response analytics:', analytics);

    if (action === 'accepted') {
      // Remove from pending requests
      this.pendingRequests.delete(dispatchRequestId);

      // Notify other technicians that job was taken
      this.notifyJobTaken(dispatchRequestId, technicianId);

      return {
        success: true,
        message: 'Job accepted successfully'
      };
    } else {
      // Rejected - try next technician
      this.reassignToNextTechnician(dispatchRequestId);

      return {
        success: true,
        message: 'Job rejected, reassigning to next available technician'
      };
    }
  }

  /**
   * Handle timeout (no response within 60 seconds)
   */
  private async handleTimeout(dispatchRequestId: number): Promise<void> {
    const pendingRequest = this.pendingRequests.get(dispatchRequestId);
    if (!pendingRequest) return;

    const currentTechnicianId = pendingRequest.recommendedTechnicians[pendingRequest.currentTechnicianIndex];

    // Log timeout analytics
    const analytics = await providerMatchingService.logProviderResponse(
      dispatchRequestId,
      currentTechnicianId,
      'timeout',
      60, // 60 seconds timeout
    );

    console.log('Provider timeout analytics:', analytics);

    // Try next technician
    this.reassignToNextTechnician(dispatchRequestId);
  }

  /**
   * Reassign job to next available technician
   */
  private reassignToNextTechnician(dispatchRequestId: number): void {
    const pendingRequest = this.pendingRequests.get(dispatchRequestId);
    if (!pendingRequest) return;

    pendingRequest.currentTechnicianIndex++;

    // Check if we have more technicians to try
    if (pendingRequest.currentTechnicianIndex >= pendingRequest.recommendedTechnicians.length) {
      // No more technicians available
      this.pendingRequests.delete(dispatchRequestId);
      console.log(`Job ${dispatchRequestId} could not be assigned - no more available technicians`);
      
      // Notify customer/admin about failed assignment
      this.notifyFailedAssignment(dispatchRequestId);
      return;
    }

    // Get next technician
    const nextTechnicianId = pendingRequest.recommendedTechnicians[pendingRequest.currentTechnicianIndex];
    
    // Update dispatch request
    pendingRequest.dispatchRequest.reassignmentCount = (pendingRequest.dispatchRequest.reassignmentCount || 0) + 1;
    pendingRequest.dispatchRequest.status = 'pending';

    // Create new notification with updated info
    const notification: JobDispatchNotification = {
      id: dispatchRequestId,
      ticketId: pendingRequest.dispatchRequest.ticketId,
      customerId: pendingRequest.dispatchRequest.customerId,
      customerName: 'John Smith', // Mock data
      customerPhone: '(555) 123-4567', // Mock data
      serviceType: pendingRequest.dispatchRequest.serviceType as any,
      category: pendingRequest.dispatchRequest.category,
      description: pendingRequest.dispatchRequest.description,
      urgency: pendingRequest.dispatchRequest.urgency as any,
      customerLocation: pendingRequest.dispatchRequest.customerLocation as any,
      estimates: {
        cost: parseFloat(pendingRequest.dispatchRequest.estimatedCost || '0'),
        duration: pendingRequest.dispatchRequest.estimatedDuration || 90,
        distance: parseFloat(pendingRequest.dispatchRequest.estimatedDistance || '0'),
        eta: pendingRequest.dispatchRequest.estimatedETA || 30,
        trafficFactor: parseFloat(pendingRequest.dispatchRequest.trafficFactor || '1.0')
      },
      responseDeadline: new Date(Date.now() + 60000).toISOString(), // New 60-second deadline
      createdAt: new Date().toISOString()
    };

    // Set new timeout
    pendingRequest.timeout = setTimeout(() => {
      this.handleTimeout(dispatchRequestId);
    }, 60000);

    // Send to next technician
    const sent = this.sendNotificationToTechnician(nextTechnicianId, notification);
    
    if (!sent) {
      // If can't send, try next one immediately
      this.reassignToNextTechnician(dispatchRequestId);
    }

    console.log(`Job ${dispatchRequestId} reassigned to technician ${nextTechnicianId}`);
  }

  /**
   * Notify other technicians that job was taken
   */
  private notifyJobTaken(dispatchRequestId: number, acceptedByTechnicianId: number): void {
    this.connections.forEach((connection, technicianId) => {
      if (technicianId !== acceptedByTechnicianId && this.isTechnicianOnline(technicianId)) {
        try {
          connection.ws.send(JSON.stringify({
            type: 'job_taken',
            data: {
              dispatchRequestId,
              acceptedBy: acceptedByTechnicianId
            }
          }));
        } catch (error) {
          console.error(`Failed to notify technician ${technicianId} about job taken:`, error);
        }
      }
    });
  }

  /**
   * Notify about failed assignment
   */
  private notifyFailedAssignment(dispatchRequestId: number): void {
    // In a real application, this would notify admins/customer service
    console.log(`ALERT: Job ${dispatchRequestId} failed to be assigned to any technician`);
    
    // Could send notification to admin dashboard, email alerts, etc.
  }

  /**
   * Get active connections count
   */
  getActiveConnectionsCount(): number {
    return Array.from(this.connections.values()).filter(conn => 
      this.isTechnicianOnline(conn.technicianId)
    ).length;
  }

  /**
   * Get pending requests count
   */
  getPendingRequestsCount(): number {
    return this.pendingRequests.size;
  }

  /**
   * Cleanup expired connections
   */
  cleanup(): void {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    
    for (const [technicianId, connection] of this.connections.entries()) {
      if (connection.lastSeen < oneMinuteAgo) {
        connection.ws.close();
        this.connections.delete(technicianId);
        console.log(`Cleaned up expired connection for technician ${technicianId}`);
      }
    }
  }
}

export const notificationService = new NotificationService();

// Cleanup expired connections every minute
setInterval(() => {
  notificationService.cleanup();
}, 60000);