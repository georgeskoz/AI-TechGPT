import React from 'react';
import { useAuth } from '@/components/UserAuthProvider';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Wrench, Shield, LogOut, RotateCcw } from 'lucide-react';

interface DevRoleSwitcherProps {
  className?: string;
}

const DevRoleSwitcher: React.FC<DevRoleSwitcherProps> = ({ className = '' }) => {
  const { user, login, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const roles = [
    { 
      id: 'customer', 
      label: 'Customer', 
      icon: User, 
      color: 'bg-blue-500 hover:bg-blue-600',
      route: '/chat',
      description: 'Customer portal with AI chat and support'
    },
    { 
      id: 'service_provider', 
      label: 'Service Provider', 
      icon: Wrench, 
      color: 'bg-green-500 hover:bg-green-600',
      route: '/technician-dashboard',
      description: 'Service provider dashboard and tools'
    },
    { 
      id: 'admin', 
      label: 'Admin', 
      icon: Shield, 
      color: 'bg-purple-500 hover:bg-purple-600',
      route: '/admin',
      description: 'Administrative control panel'
    }
  ];

  const switchRole = (roleId: string) => {
    if (!user) return;

    const newUser = { ...user, userType: roleId };
    
    // Update user in context and localStorage
    login(newUser);
    
    // Navigate to appropriate route
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setLocation(role.route);
    }
  };

  const clearSession = () => {
    logout();
  };

  if (!user) {
    return (
      <Card className={`fixed top-4 right-4 z-50 w-64 ${className}`}>
        <CardContent className="p-4">
          <div className="text-center text-sm text-gray-500">
            Not authenticated - please log in first
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`fixed top-4 right-4 z-50 w-80 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Dev Role Switcher</h3>
          <Badge variant="outline" className="text-xs">
            {user.userType || 'customer'}
          </Badge>
        </div>
        
        <div className="text-xs text-gray-500 mb-3">
          User: {user.username || 'Unknown'}
        </div>

        <div className="space-y-2">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = user.userType === role.id;
            
            return (
              <Button
                key={role.id}
                onClick={() => switchRole(role.id)}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={`w-full justify-start h-auto p-2 ${
                  isActive ? role.color : 'hover:bg-gray-50'
                }`}
                disabled={isActive}
              >
                <Icon className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">{role.label}</div>
                  <div className="text-xs opacity-75">{role.description}</div>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t space-y-2">
          <Button
            onClick={clearSession}
            variant="outline"
            size="sm"
            className="w-full justify-start text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Clear Session
          </Button>
          
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh App
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevRoleSwitcher;