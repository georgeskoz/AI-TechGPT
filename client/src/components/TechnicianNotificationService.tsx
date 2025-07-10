import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProviderNotificationPopup from './ProviderNotificationPopup';
import { Bell, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';

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

interface TechnicianNotificationServiceProps {
  technicianId: number;
  isActive?: boolean;
}

export default function TechnicianNotificationService({ 
  technicianId, 
  isActive = true 
}: TechnicianNotificationServiceProps) {
  const [currentNotification, setCurrentNotification] = useState<JobDispatchNotification | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const responseStartTimeRef = useRef<Date>();

  // Check technician online status
  const { data: technicianStatus } = useQuery({
    queryKey: ['/api/providers', technicianId, 'status'],
    enabled: !!technicianId,
    refetchInterval: 30000, // Check status every 30 seconds
  });

  // Initialize WebSocket connection
  useEffect(() => {
    if (!isActive || !technicianId) return;

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [technicianId, isActive]);

  const connectWebSocket = () => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        
        // Register technician for job notifications
        ws.send(JSON.stringify({
          type: 'register_technician',
          technicianId: technicianId
        }));

        console.log(`Technician ${technicianId} connected to notification service`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        
        if (isActive) {
          console.log('WebSocket connection closed, attempting to reconnect...');
          // Attempt to reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error occurred');
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to connect to notification service');
    }
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'technician_registered':
        console.log('Technician registered for notifications:', data);
        break;
        
      case 'job_dispatch_request':
        // New job notification received
        const notification = data.data as JobDispatchNotification;
        setCurrentNotification(notification);
        setShowPopup(true);
        setNotificationCount(prev => prev + 1);
        responseStartTimeRef.current = new Date();
        
        // Play notification sound (if permissions allow)
        try {
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(() => {
            // Fallback to system notification sound or vibration
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
          });
        } catch (error) {
          console.log('Could not play notification sound');
        }
        
        // Show browser notification (if permissions granted)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Job Request', {
            body: `${notification.category} - ${notification.customerLocation.city}`,
            icon: '/favicon.ico',
            tag: `job-${notification.id}`,
          });
        }
        break;
        
      case 'job_taken':
        // Another technician accepted the job
        if (currentNotification && data.data.dispatchRequestId === currentNotification.id) {
          setCurrentNotification(null);
          setShowPopup(false);
        }
        break;
        
      case 'job_response_confirmed':
        console.log('Job response confirmed:', data);
        break;
        
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  };

  const handleAcceptJob = async (notificationId: number) => {
    if (!responseStartTimeRef.current || !wsRef.current) return;
    
    const responseTime = Math.floor((new Date().getTime() - responseStartTimeRef.current.getTime()) / 1000);
    
    try {
      // Send response via WebSocket
      wsRef.current.send(JSON.stringify({
        type: 'job_response',
        dispatchRequestId: notificationId,
        action: 'accepted',
        responseTimeSeconds: responseTime,
        deviceInfo: {
          deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          userAgent: navigator.userAgent
        }
      }));
      
      // Also send via HTTP API for reliability
      await apiRequest('POST', '/api/providers/response', {
        dispatchRequestId: notificationId,
        technicianId,
        action: 'accepted',
        responseTimeSeconds: responseTime,
        deviceInfo: {
          deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          userAgent: navigator.userAgent
        }
      });
      
      setShowPopup(false);
      
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  const handleRejectJob = async (notificationId: number) => {
    if (!responseStartTimeRef.current || !wsRef.current) return;
    
    const responseTime = Math.floor((new Date().getTime() - responseStartTimeRef.current.getTime()) / 1000);
    
    try {
      // Send response via WebSocket
      wsRef.current.send(JSON.stringify({
        type: 'job_response',
        dispatchRequestId: notificationId,
        action: 'rejected',
        responseTimeSeconds: responseTime,
        deviceInfo: {
          deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          userAgent: navigator.userAgent
        }
      }));
      
      // Also send via HTTP API for reliability
      await apiRequest('POST', '/api/providers/response', {
        dispatchRequestId: notificationId,
        technicianId,
        action: 'rejected',
        responseTimeSeconds: responseTime,
        deviceInfo: {
          deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          userAgent: navigator.userAgent
        }
      });
      
      setCurrentNotification(null);
      setShowPopup(false);
      
    } catch (error) {
      console.error('Error rejecting job:', error);
    }
  };

  const handleTimeoutJob = async (notificationId: number) => {
    // Timeout occurred - notification will be handled by the server
    console.log(`Job ${notificationId} timed out`);
    setCurrentNotification(null);
    setShowPopup(false);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  // Request notification permissions on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  if (!isActive) {
    return null;
  }

  return (
    <>
      {/* Connection Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg border ${
          isConnected 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">
                {connectionError || 'Reconnecting...'}
              </span>
            </>
          )}
          
          {notificationCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              <Bell className="h-3 w-3 mr-1" />
              {notificationCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Test Notification Button (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => {
              // Simulate a test notification
              const testNotification: JobDispatchNotification = {
                id: Math.floor(Math.random() * 1000),
                ticketId: 12345,
                customerId: 1,
                customerName: 'Test Customer',
                customerPhone: '(555) 123-4567',
                serviceType: 'onsite',
                category: 'Hardware Issues',
                description: 'Computer won\'t turn on, needs diagnostic',
                urgency: 'medium',
                customerLocation: {
                  address: '123 Main St',
                  latitude: 45.4215,
                  longitude: -75.6972,
                  city: 'Ottawa',
                  state: 'ON',
                  zipCode: 'K1A 0A6'
                },
                estimates: {
                  cost: 85,
                  duration: 90,
                  distance: 5.2,
                  eta: 15,
                  trafficFactor: 1.2
                },
                responseDeadline: new Date(Date.now() + 60000).toISOString(),
                createdAt: new Date().toISOString()
              };
              
              setCurrentNotification(testNotification);
              setShowPopup(true);
              responseStartTimeRef.current = new Date();
            }}
            variant="outline"
            size="sm"
          >
            Test Notification
          </Button>
        </div>
      )}

      {/* Job Notification Popup */}
      <ProviderNotificationPopup
        notification={currentNotification}
        isOpen={showPopup}
        onAccept={handleAcceptJob}
        onReject={handleRejectJob}
        onTimeout={handleTimeoutJob}
      />
    </>
  );
}