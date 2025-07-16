import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Wrench, 
  Shield, 
  User,
  Phone,
  MessageSquare,
  Settings,
  DollarSign,
  BarChart3,
  UserPlus,
  Globe
} from 'lucide-react';

type UserRole = 'customer' | 'service_provider' | 'admin';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const roles = [
    {
      id: 'customer' as UserRole,
      name: 'Customer',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
      activeColor: 'bg-blue-600',
      textColor: 'text-blue-600',
      description: 'Get technical support and services'
    },
    {
      id: 'service_provider' as UserRole,
      name: 'Service Provider',
      icon: Wrench,
      color: 'bg-green-500 hover:bg-green-600',
      activeColor: 'bg-green-600',
      textColor: 'text-green-600',
      description: 'Provide technical services and support'
    },
    {
      id: 'admin' as UserRole,
      name: 'Administrator',
      icon: Shield,
      color: 'bg-purple-500 hover:bg-purple-600',
      activeColor: 'bg-purple-600',
      textColor: 'text-purple-600',
      description: 'Manage platform and users'
    }
  ];

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900">TechGPT Platform</h1>
            <Badge variant="outline" className="text-xs">
              Multi-Role Interface
            </Badge>
          </div>
          
          <div className="flex items-center space-x-1">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = currentRole === role.id;
              
              return (
                <Button
                  key={role.id}
                  onClick={() => onRoleChange(role.id)}
                  variant={isActive ? "default" : "outline"}
                  className={`
                    flex items-center space-x-2 px-4 py-2 transition-all duration-200
                    ${isActive 
                      ? `${role.activeColor} text-white` 
                      : `hover:${role.color} hover:text-white border-gray-300`
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{role.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Customer Interface Component
export function CustomerInterface() {
  const customerStats = {
    totalSessions: 12,
    activeSupport: 0,
    favoriteServices: 3,
    totalSpent: 450
  };

  const customerServices = [
    {
      name: "AI Chat Support",
      description: "Get instant AI-powered technical assistance",
      icon: MessageSquare,
      status: "Available",
      price: "Free"
    },
    {
      name: "Phone Support",
      description: "Talk directly with technical experts",
      icon: Phone,
      status: "Available",
      price: "From $25/hr"
    },
    {
      name: "On-Site Support",
      description: "Get technicians to come to your location",
      icon: User,
      status: "Available",
      price: "From $85/visit"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Portal</h2>
        <p className="text-gray-600">Access technical support services and manage your account</p>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{customerStats.totalSessions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{customerStats.activeSupport}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Favorite Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{customerStats.favoriteServices}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${customerStats.totalSpent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Available Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Available Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customerServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <Badge variant="outline" className="text-xs text-green-600">
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">{service.price}</span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Get Support
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Service Provider Interface Component
export function ServiceProviderInterface() {
  const providerStats = {
    totalEarnings: 2850,
    completedJobs: 24,
    averageRating: 4.8,
    activeJobs: 2
  };

  const providerServices = [
    {
      name: "Remote Support",
      description: "Provide technical assistance remotely",
      hourlyRate: "$45-75/hr",
      availability: "Available"
    },
    {
      name: "Phone Support",
      description: "Offer phone-based technical support",
      hourlyRate: "$35-65/hr",
      availability: "Available"
    },
    {
      name: "On-Site Support",
      description: "Visit customers for hands-on assistance",
      hourlyRate: "$85-150/hr",
      availability: "Available"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Provider Portal</h2>
        <p className="text-gray-600">Manage your services, earnings, and customer interactions</p>
      </div>

      {/* Provider Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${providerStats.totalEarnings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{providerStats.completedJobs}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{providerStats.averageRating}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{providerStats.activeJobs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Service Offerings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Your Service Offerings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providerServices.map((service, index) => (
              <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">{service.hourlyRate}</div>
                  <Badge variant="outline" className="text-xs text-green-600 mt-1">
                    {service.availability}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Administrator Interface Component
export function AdministratorInterface() {
  const adminStats = {
    totalUsers: 1247,
    activeProviders: 89,
    totalRevenue: 45600,
    systemHealth: 98.5
  };

  const adminModules = [
    {
      name: "User Management",
      description: "Manage customer accounts and permissions",
      icon: UserPlus,
      count: "1,247 users"
    },
    {
      name: "Provider Management",
      description: "Oversee service providers and their performance",
      icon: Wrench,
      count: "89 providers"
    },
    {
      name: "Revenue Analytics",
      description: "Track platform revenue and financial metrics",
      icon: BarChart3,
      count: "$45,600 this month"
    },
    {
      name: "System Settings",
      description: "Configure platform settings and preferences",
      icon: Settings,
      count: "All systems operational"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Administrator Control Panel</h2>
        <p className="text-gray-600">Manage platform operations, users, and system settings</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{adminStats.totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{adminStats.activeProviders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${adminStats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{adminStats.systemHealth}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Administration Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{module.name}</h4>
                      <p className="text-xs text-gray-500">{module.count}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Manage
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}