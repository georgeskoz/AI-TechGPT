import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/components/UserAuthProvider';

export default function RoleBasedRedirect() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user type
      if (user.userType === 'service_provider' || user.userType === 'technician') {
        setLocation('/service-provider-dashboard');
      } else if (user.userType === 'admin') {
        setLocation('/admin');
      } else {
        // Default to customer dashboard
        setLocation('/customer-dashboard');
      }
    } else {
      // If not authenticated, show chat page
      setLocation('/chat');
    }
  }, [isAuthenticated, user, setLocation]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 border-solid rounded-full"></div>
    </div>
  );
}