import React from 'react';
import { useAuth } from './UserAuthProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  User, 
  Settings, 
  Shield, 
  Briefcase, 
  Users,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useLocation } from 'wouter';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
  description?: string;
}

const navigationItems: NavigationItem[] = [
  // Customer Navigation
  {
    label: "AI Chat Support",
    path: "/chat",
    icon: <User className="h-4 w-4" />,
    roles: ["customer"],
    description: "Free AI assistance"
  },
  {
    label: "My Dashboard",
    path: "/dashboard",
    icon: <Settings className="h-4 w-4" />,
    roles: ["customer"],
    description: "View your services"
  },
  {
    label: "Request Service Provider",
    path: "/technician-request",
    icon: <Briefcase className="h-4 w-4" />,
    roles: ["customer"],
    description: "Book professional help"
  },
  
  // Service Provider Navigation
  {
    label: "Provider Chat",
    path: "/service-provider-chat-page",
    icon: <Briefcase className="h-4 w-4" />,
    roles: ["service_provider"],
    description: "AI assistant and dashboard"
  },
  {
    label: "Provider Dashboard",
    path: "/technician-dashboard",
    icon: <Settings className="h-4 w-4" />,
    roles: ["service_provider"],
    description: "Manage jobs and earnings"
  },
  {
    label: "Earnings & Payments",
    path: "/technician-earnings",
    icon: <Settings className="h-4 w-4" />,
    roles: ["service_provider"],
    description: "Track income and payouts"
  },
  {
    label: "Profile Visibility",
    path: "/profile-visibility",
    icon: <User className="h-4 w-4" />,
    roles: ["service_provider"],
    description: "Optimize your profile"
  },
  {
    label: "Service Provider Home",
    path: "/technician-home",
    icon: <Briefcase className="h-4 w-4" />,
    roles: ["service_provider"],
    description: "Service provider portal"
  },
  {
    label: "Registration",
    path: "/technician-registration",
    icon: <Settings className="h-4 w-4" />,
    roles: ["service_provider"],
    description: "Update profile"
  },
  
  // Admin Navigation
  {
    label: "Admin Dashboard",
    path: "/admin",
    icon: <Shield className="h-4 w-4" />,
    roles: ["admin"],
    description: "Platform management"
  },
  {
    label: "User Management",
    path: "/admin?tab=users",
    icon: <Users className="h-4 w-4" />,
    roles: ["admin"],
    description: "Manage all users"
  },
  {
    label: "System Monitoring",
    path: "/admin?tab=system-monitoring",
    icon: <Settings className="h-4 w-4" />,
    roles: ["admin"],
    description: "Monitor platform health"
  }
];

export default function RoleBasedNavigation() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) return null;

  // Use userType from the authenticated user
  const userType = user.userType || 'customer';
  const userNavigationItems = navigationItems.filter(item => 
    item.roles.includes(userType)
  );

  const handleRoleSwitch = async (newRole: 'customer' | 'service_provider' | 'admin') => {
    console.log('Switching to role:', newRole);
    // Navigate to the appropriate home page for the role
    switch (newRole) {
      case 'customer':
        setLocation('/chat');
        break;
      case 'service_provider':
        setLocation('/service-provider-chat-page');
        break;
      case 'admin':
        setLocation('/admin');
        break;
      default:
        setLocation('/');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'service_provider': return 'bg-green-100 text-green-800';
      case 'customer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-3 w-3" />;
      case 'service_provider': return <Briefcase className="h-3 w-3" />;
      case 'customer': return <User className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Role-Based Quick Navigation */}
      <div className="hidden md:flex items-center gap-2">
        {userNavigationItems.slice(0, 3).map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="sm"
            onClick={() => setLocation(item.path)}
            className="flex items-center gap-2"
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </div>

      {/* User Menu with Role Switching */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={getRoleColor(userType)}>
                {getRoleIcon(userType)}
                {userType.replace('_', ' ').toUpperCase()}
              </Badge>
              <span className="font-medium">{user.fullName || user.username}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{user.fullName || user.username}</span>
              <span className="text-xs text-gray-500 font-normal">{user.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Role-Based Navigation */}
          <DropdownMenuLabel className="text-xs text-gray-500">
            Quick Access
          </DropdownMenuLabel>
          {userNavigationItems.map((item) => (
            <DropdownMenuItem
              key={item.path}
              onClick={() => {
                console.log('Navigating to:', item.path);
                setLocation(item.path);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              {item.icon}
              <div className="flex flex-col">
                <span>{item.label}</span>
                {item.description && (
                  <span className="text-xs text-gray-500">{item.description}</span>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          {/* Role Switching (if user has multiple roles) */}
          <DropdownMenuLabel className="text-xs text-gray-500">
            Switch Role
          </DropdownMenuLabel>
          {userType !== 'customer' && (
            <DropdownMenuItem
              onClick={() => handleRoleSwitch('customer')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <User className="h-4 w-4" />
              Switch to Customer
            </DropdownMenuItem>
          )}
          {userType !== 'service_provider' && (
            <DropdownMenuItem
              onClick={() => handleRoleSwitch('service_provider')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="h-4 w-4" />
              Switch to Service Provider
            </DropdownMenuItem>
          )}
          {userType !== 'admin' && (
            <DropdownMenuItem
              onClick={() => handleRoleSwitch('admin')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Shield className="h-4 w-4" />
              Switch to Admin
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              console.log('Signing out user');
              logout();
            }}
            className="flex items-center gap-2 text-red-600 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}