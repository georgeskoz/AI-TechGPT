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
            <h1 className="text-xl font-bold text-gray-900">TechersGPT Platform</h1>
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

  const handleStartChat = () => {
    // Navigate to customer chat page
    window.location.href = '/chat';
  };

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

      {/* Customer Chat Access */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-600">Customer Chat Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-4">
              <MessageSquare className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Need Technical Support?</h3>
              <p className="text-gray-600 mb-6">
                Get instant help from AI or connect with expert technicians
              </p>
            </div>
            <Button 
              onClick={handleStartChat}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            >
              Start Chat Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-600">AI Chat Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Get instant AI-powered technical assistance</p>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleStartChat}>
              Start AI Chat
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-600">Phone Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Talk directly with technical experts</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Request Call
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-orange-600">On-Site Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Get technicians to come to your location</p>
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              Book Technician
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Service Provider Interface Component
export function ServiceProviderInterface() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication check
    if (loginData.username === 'vanessa1' && loginData.password === 'password123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Use vanessa1 / password123');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-600">Service Provider Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Login as Service Provider
                </Button>
                <div className="text-center text-sm text-gray-500 mt-2">
                  Test credentials: vanessa1 / password123
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const providerStats = {
    totalEarnings: 2850,
    completedJobs: 24,
    averageRating: 4.8,
    activeJobs: 2
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Provider Dashboard</h2>
          <p className="text-gray-600">Welcome back, Vanessa Rodriguez!</p>
        </div>
        <Button 
          onClick={() => setIsAuthenticated(false)}
          variant="outline"
          className="text-green-600 border-green-600 hover:bg-green-50"
        >
          Logout
        </Button>
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

      {/* Service Provider Chat Access */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-green-600">Service Provider Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-4">
              <MessageSquare className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer Communication</h3>
              <p className="text-gray-600 mb-6">
                Chat with customers and provide technical support
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/service-provider-chat'}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
            >
              Open Chat Interface
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-600">Manage Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Configure your service offerings and rates</p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Update Services
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-600">View Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Check active jobs and requests</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              View Jobs
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-600">Earnings Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Download detailed earnings report</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Download Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Administrator Interface Component
export function AdministratorInterface() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple admin authentication check
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin credentials. Use admin / admin123');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-purple-600">Administrator Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Admin Username</label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter admin username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Admin Password</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter admin password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  Login as Administrator
                </Button>
                <div className="text-center text-sm text-gray-500 mt-2">
                  Test credentials: admin / admin123
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const adminStats = {
    totalUsers: 1247,
    activeProviders: 89,
    totalRevenue: 45600,
    systemHealth: 98.5
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Administrator Control Panel</h2>
          <p className="text-gray-600">Platform management and system oversight</p>
        </div>
        <Button 
          onClick={() => setIsAuthenticated(false)}
          variant="outline"
          className="text-purple-600 border-purple-600 hover:bg-purple-50"
        >
          Logout
        </Button>
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

      {/* Admin Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-600">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Manage customer accounts and permissions</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Manage Users
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-600">Provider Oversight</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Monitor service providers and performance</p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              View Providers
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-600">System Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Platform performance and revenue reports</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Connection</span>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Services</span>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">WebSocket Services</span>
              <Badge className="bg-yellow-100 text-yellow-800">Limited</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Services</span>
              <Badge className="bg-red-100 text-red-800">Config Required</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}