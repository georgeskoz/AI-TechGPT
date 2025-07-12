import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/Navigation';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  MapPin, 
  User,
  Star,
  Phone,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Timer
} from 'lucide-react';

interface ServiceProviderJob {
  id: number;
  customerId: number;
  customerName: string;
  category: string;
  description: string;
  serviceType: 'remote' | 'phone' | 'onsite';
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  scheduledTime: string;
  duration: number;
  cost: number;
  location?: string;
  customerPhone: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
}

export default function ServiceProviderDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app this would come from API
  const mockJobs: ServiceProviderJob[] = [
    {
      id: 1,
      customerId: 101,
      customerName: "Sarah Johnson",
      category: "Hardware Issues",
      description: "Laptop won't boot, blue screen error",
      serviceType: "onsite",
      status: "accepted",
      scheduledTime: "Today, 2:30 PM",
      duration: 90,
      cost: 120,
      location: "123 Main St, Ottawa, ON",
      customerPhone: "+1 (555) 123-4567",
      urgency: "high",
      createdAt: "2025-01-12T10:30:00Z"
    },
    {
      id: 2,
      customerId: 102,
      customerName: "Mike Chen",
      category: "Network Setup",
      description: "WiFi configuration for home office",
      serviceType: "remote",
      status: "in_progress",
      scheduledTime: "Today, 1:00 PM",
      duration: 60,
      cost: 75,
      customerPhone: "+1 (555) 987-6543",
      urgency: "medium",
      createdAt: "2025-01-12T09:15:00Z"
    },
    {
      id: 3,
      customerId: 103,
      customerName: "Emma Davis",
      category: "Software Installation",
      description: "Install and configure accounting software",
      serviceType: "phone",
      status: "completed",
      scheduledTime: "Yesterday, 3:45 PM",
      duration: 45,
      cost: 85,
      customerPhone: "+1 (555) 246-8135",
      urgency: "low",
      createdAt: "2025-01-11T14:30:00Z"
    },
    {
      id: 4,
      customerId: 104,
      customerName: "David Park",
      category: "System Troubleshooting",
      description: "Computer running slow, malware scan needed",
      serviceType: "remote",
      status: "pending",
      scheduledTime: "Tomorrow, 10:00 AM",
      duration: 75,
      cost: 95,
      customerPhone: "+1 (555) 369-2580",
      urgency: "medium",
      createdAt: "2025-01-12T11:45:00Z"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'urgent': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const activeJobs = mockJobs.filter(job => ['pending', 'accepted', 'in_progress'].includes(job.status));
  const completedJobs = mockJobs.filter(job => job.status === 'completed');
  const totalEarnings = completedJobs.reduce((sum, job) => sum + job.cost, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        showBackButton={true}
        backTo="/technician-dashboard"
        title="Service Provider Dashboard"
        showHomeButton={true}
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Provider Dashboard</h1>
          <p className="text-gray-600">Manage your bookings, track earnings, and view customer requests</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="active">Active Jobs</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                      <p className="text-2xl font-bold text-gray-900">{activeJobs.length}</p>
                    </div>
                    <Timer className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                      <p className="text-2xl font-bold text-gray-900">{completedJobs.length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                      <p className="text-2xl font-bold text-gray-900">${totalEarnings}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                      <p className="text-2xl font-bold text-gray-900">4.8</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockJobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{job.customerName} - {job.category}</p>
                          <p className="text-sm text-gray-600">{job.scheduledTime}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Jobs ({activeJobs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{job.customerName}</h3>
                            <p className="text-sm text-gray-600">{job.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(job.status)}>
                            {job.status.replace('_', ' ')}
                          </Badge>
                          <span className={`text-sm font-medium ${getUrgencyColor(job.urgency)}`}>
                            {job.urgency}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700">{job.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{job.scheduledTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.duration} min</span>
                          </div>
                          {job.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                          )}
                        </div>
                        <span className="font-semibold text-green-600">${job.cost}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Customer
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        {job.status === 'pending' && (
                          <Button size="sm">
                            Accept Job
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Jobs ({completedJobs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedJobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{job.customerName}</h3>
                            <p className="text-sm text-gray-600">{job.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">${job.cost}</p>
                          <p className="text-sm text-gray-600">{job.scheduledTime}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700">{job.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.duration} min</span>
                          </div>
                          <Badge variant="secondary">{job.serviceType}</Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>4.8</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-600">${totalEarnings}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-blue-600">${totalEarnings}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Average per Job</p>
                    <p className="text-2xl font-bold text-purple-600">${Math.round(totalEarnings / completedJobs.length)}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Recent Earnings</h4>
                  {completedJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{job.customerName}</p>
                        <p className="text-sm text-gray-600">{job.category} - {job.scheduledTime}</p>
                      </div>
                      <span className="font-semibold text-green-600">${job.cost}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}