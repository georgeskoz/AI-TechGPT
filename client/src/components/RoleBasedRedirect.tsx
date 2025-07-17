import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/components/UserAuthProvider';

export default function RoleBasedRedirect() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const performRedirect = async () => {
      // Add a small delay to ensure auth context is fully loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (isAuthenticated && user) {
        console.log('User authenticated, redirecting based on role:', user.userType);
        
        // Redirect based on user type
        switch (user.userType) {
          case 'service_provider':
          case 'technician':
            setLocation('/service-provider-chat-page');
            break;
          case 'admin':
            setLocation('/admin');
            break;
          case 'customer':
          default:
            setLocation('/chat');
            break;
        }
      } else {
        console.log('User not authenticated, redirecting to chat');
        // If not authenticated, show chat page (public access)
        setLocation('/chat');
      }
      
      setIsRedirecting(false);
    };

    performRedirect();
  }, [isAuthenticated, user, setLocation]);

  // Show loading while redirecting
  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 border-solid rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}