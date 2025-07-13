import React from 'react';
import { useLocation } from 'wouter';
import AIFeatureDiscovery from '@/components/AIFeatureDiscovery';

export default function AIFeatureDiscoveryWrapper() {
  const [location] = useLocation();

  const getUserRole = () => {
    // Determine user role based on current page URL
    if (location.includes('/admin')) return 'admin';
    if (location.includes('/technician') || location.includes('/service-provider')) return 'service_provider';
    return 'customer';
  };

  const handleFeatureComplete = (featureId: string) => {
    console.log(`Feature completed: ${featureId}`);
    // Track completion analytics
  };

  return (
    <AIFeatureDiscovery
      userRole={getUserRole()}
      currentPage={location}
      onFeatureComplete={handleFeatureComplete}
    />
  );
}