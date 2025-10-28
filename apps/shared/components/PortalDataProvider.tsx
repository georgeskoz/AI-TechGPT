import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './UserAuthProvider';
import { useQuery } from '@tanstack/react-query';

interface PortalDataContextType {
  userData: any;
  isLoading: boolean;
  error: any;
  refetch: () => void;
  hasAccess: boolean;
}

const PortalDataContext = createContext<PortalDataContextType | undefined>(undefined);

interface PortalDataProviderProps {
  children: ReactNode;
  portal: 'customer' | 'service_provider' | 'admin';
}

export function PortalDataProvider({ children, portal }: PortalDataProviderProps) {
  const { user, isAuthenticated, currentPortal, isUserAllowedInPortal } = useAuth();
  
  // Check if user has access to this portal
  const hasAccess = isAuthenticated && isUserAllowedInPortal(portal);
  
  // Only fetch data if user has access and current portal matches
  const shouldFetch = hasAccess && currentPortal === portal;
  
  const { data: userData, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/portal/${portal}/user-data`, user?.id],
    queryFn: async () => {
      if (!shouldFetch) return null;
      
      // Fetch portal-specific data based on user type and portal
      const endpoints = {
        customer: `/api/users/${user?.username}`,
        service_provider: `/api/service-providers/${user?.username}`, 
        admin: `/api/admin/users/${user?.username}`
      };
      
      const response = await fetch(endpoints[portal]);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${portal} data`);
      }
      
      return response.json();
    },
    enabled: shouldFetch,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <PortalDataContext.Provider value={{
      userData: shouldFetch ? userData : null,
      isLoading: shouldFetch ? isLoading : false,
      error: shouldFetch ? error : null,
      refetch,
      hasAccess
    }}>
      {children}
    </PortalDataContext.Provider>
  );
}

export function usePortalData() {
  const context = useContext(PortalDataContext);
  if (context === undefined) {
    throw new Error('usePortalData must be used within a PortalDataProvider');
  }
  return context;
}