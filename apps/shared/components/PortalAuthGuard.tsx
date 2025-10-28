import React from 'react';
import { useAuth } from './UserAuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, User, Briefcase, LogIn, UserPlus, LogOut } from 'lucide-react';

interface PortalAuthGuardProps {
  children: React.ReactNode;
  requiredPortal: 'customer' | 'service_provider' | 'admin';
  fallbackMessage?: string;
}

export function PortalAuthGuard({ 
  children, 
  requiredPortal, 
  fallbackMessage 
}: PortalAuthGuardProps) {
  const { user, isAuthenticated, currentPortal, isUserAllowedInPortal, setCurrentPortal, logout } = useAuth();

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <LogIn className="h-12 w-12 text-blue-500" />
            </div>
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please log in to access the {requiredPortal.replace('_', ' ')} portal.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => window.location.href = '/login'} 
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is authenticated but not allowed in the required portal
  if (!isUserAllowedInPortal(requiredPortal)) {
    const getPortalInfo = (portal: string) => {
      switch (portal) {
        case 'customer':
          return { name: 'Customer Portal', icon: User, color: 'bg-blue-500' };
        case 'service_provider':
          return { name: 'Service Provider Portal', icon: Briefcase, color: 'bg-green-500' };
        case 'admin':
          return { name: 'Admin Portal', icon: Shield, color: 'bg-purple-500' };
        default:
          return { name: 'Portal', icon: User, color: 'bg-gray-500' };
      }
    };

    const currentPortalInfo = getPortalInfo(currentPortal);
    const requiredPortalInfo = getPortalInfo(requiredPortal);
    const userPortalInfo = getPortalInfo(user?.userType || 'customer');

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-2xl w-full mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-red-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {fallbackMessage || `You don't have permission to access the ${requiredPortalInfo.name}. You are currently signed in as a ${user?.userType?.replace('_', ' ')} and can only access the ${userPortalInfo.name}.`}
              </AlertDescription>
            </Alert>
            
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p><strong>Options:</strong></p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>Continue to your authorized portal</li>
                <li>Sign in as a different user with access to {requiredPortalInfo.name}</li>
                <li>Create a new account with the appropriate role</li>
                <li>Sign out and return to the login page</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${userPortalInfo.color} text-white`}>
                    <userPortalInfo.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Your Account Type</p>
                    <p className="text-sm text-gray-600">{user?.userType?.replace('_', ' ')}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Authenticated
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${requiredPortalInfo.color} text-white`}>
                    <requiredPortalInfo.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Required Access</p>
                    <p className="text-sm text-gray-600">{requiredPortalInfo.name}</p>
                  </div>
                </div>
                <Badge variant="destructive">
                  Access Denied
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => {
                  // Redirect to user's appropriate portal
                  if (user?.userType === 'service_provider') {
                    setCurrentPortal('service_provider');
                    window.location.href = '/service-provider-chat-page';
                  } else if (user?.userType === 'admin') {
                    setCurrentPortal('admin');
                    window.location.href = '/admin';
                  } else {
                    setCurrentPortal('customer');
                    window.location.href = '/chat';
                  }
                }}
                className="w-full"
              >
                Go to Your Portal ({userPortalInfo.name})
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/login'}
                  className="flex-1"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In as Different User
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/register'}
                  className="flex-1"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  Return to Home
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    logout();
                    window.location.href = '/login';
                  }}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is authenticated and allowed in the portal, show the content
  return <>{children}</>;
}