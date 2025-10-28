import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUnifiedAuth } from './UnifiedAuthProvider';
import { apiRequest } from '@/lib/queryClient';

interface CrossRoleData {
  // Customer Data
  customerProfile?: any;
  customerJobs?: any[];
  customerTickets?: any[];
  
  // Service Provider Data
  providerProfile?: any;
  providerJobs?: any[];
  providerEarnings?: any;
  
  // Admin Data
  platformStats?: any;
  systemMetrics?: any;
  allUsers?: any[];
  
  // Shared Data
  notifications?: any[];
  systemMessages?: any[];
}

interface DataBridgeContextType {
  data: CrossRoleData;
  loading: boolean;
  refreshData: () => Promise<void>;
  sendNotification: (target: 'customer' | 'service_provider' | 'admin', message: any) => Promise<void>;
  createTicket: (ticketData: any) => Promise<void>;
  updateJobStatus: (jobId: number, status: string, role: string) => Promise<void>;
}

const DataBridgeContext = createContext<DataBridgeContextType | null>(null);

export function CrossRoleDataBridge({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useUnifiedAuth();
  const [data, setData] = useState<CrossRoleData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshData();
    }
  }, [isAuthenticated, user]);

  const refreshData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const newData: CrossRoleData = {};

      // Load role-specific data
      switch (user.userType) {
        case 'customer':
          await loadCustomerData(newData);
          break;
        case 'service_provider':
          await loadServiceProviderData(newData);
          break;
        case 'admin':
          await loadAdminData(newData);
          break;
      }

      // Load shared data for all roles
      await loadSharedData(newData);
      
      setData(newData);
    } catch (error) {
      console.error('Failed to load cross-role data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerData = async (dataObj: CrossRoleData) => {
    if (!user) return;
    
    try {
      const [profileRes, jobsRes, ticketsRes] = await Promise.all([
        apiRequest('GET', `/api/customer/profile/${user.id}`),
        apiRequest('GET', `/api/customer/jobs/${user.id}`),
        apiRequest('GET', `/api/customer/tickets/${user.id}`)
      ]);

      dataObj.customerProfile = await profileRes.json();
      dataObj.customerJobs = await jobsRes.json();
      dataObj.customerTickets = await ticketsRes.json();
    } catch (error) {
      console.error('Failed to load customer data:', error);
    }
  };

  const loadServiceProviderData = async (dataObj: CrossRoleData) => {
    if (!user) return;
    
    try {
      const [profileRes, jobsRes, earningsRes] = await Promise.all([
        apiRequest('GET', `/api/service-provider/profile/${user.id}`),
        apiRequest('GET', `/api/service-provider/jobs/${user.id}`),
        apiRequest('GET', `/api/service-provider/earnings/${user.id}`)
      ]);

      dataObj.providerProfile = await profileRes.json();
      dataObj.providerJobs = await jobsRes.json();
      dataObj.providerEarnings = await earningsRes.json();
    } catch (error) {
      console.error('Failed to load service provider data:', error);
    }
  };

  const loadAdminData = async (dataObj: CrossRoleData) => {
    try {
      const [statsRes, metricsRes, usersRes] = await Promise.all([
        apiRequest('GET', '/api/admin/platform-stats'),
        apiRequest('GET', '/api/admin/system-metrics'),
        apiRequest('GET', '/api/admin/users')
      ]);

      dataObj.platformStats = await statsRes.json();
      dataObj.systemMetrics = await metricsRes.json();
      dataObj.allUsers = await usersRes.json();
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  const loadSharedData = async (dataObj: CrossRoleData) => {
    if (!user) return;
    
    try {
      const [notificationsRes, messagesRes] = await Promise.all([
        apiRequest('GET', `/api/notifications/${user.id}`),
        apiRequest('GET', '/api/system-messages')
      ]);

      dataObj.notifications = await notificationsRes.json();
      dataObj.systemMessages = await messagesRes.json();
    } catch (error) {
      console.error('Failed to load shared data:', error);
    }
  };

  const sendNotification = async (target: 'customer' | 'service_provider' | 'admin', message: any) => {
    try {
      await apiRequest('POST', '/api/notifications/send', {
        target,
        message,
        senderId: user?.id
      });
      
      // Refresh notifications
      await refreshData();
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  };

  const createTicket = async (ticketData: any) => {
    try {
      const response = await apiRequest('POST', '/api/tickets', {
        ...ticketData,
        userId: user?.id
      });
      
      const newTicket = await response.json();
      
      // Update local data
      if (data.customerTickets) {
        setData(prev => ({
          ...prev,
          customerTickets: [newTicket, ...(prev.customerTickets || [])]
        }));
      }
      
      return newTicket;
    } catch (error) {
      console.error('Failed to create ticket:', error);
      throw error;
    }
  };

  const updateJobStatus = async (jobId: number, status: string, role: string) => {
    try {
      await apiRequest('PATCH', `/api/jobs/${jobId}/status`, {
        status,
        updatedBy: user?.id,
        updatedRole: role
      });
      
      // Refresh relevant data
      await refreshData();
    } catch (error) {
      console.error('Failed to update job status:', error);
      throw error;
    }
  };

  const contextValue: DataBridgeContextType = {
    data,
    loading,
    refreshData,
    sendNotification,
    createTicket,
    updateJobStatus
  };

  return (
    <DataBridgeContext.Provider value={contextValue}>
      {children}
    </DataBridgeContext.Provider>
  );
}

export function useDataBridge() {
  const context = useContext(DataBridgeContext);
  if (!context) {
    throw new Error('useDataBridge must be used within CrossRoleDataBridge');
  }
  return context;
}