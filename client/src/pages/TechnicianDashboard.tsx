import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Clock, 
  Star, 
  Users, 
  Award, 
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  Calendar,
  MessageSquare,
  Settings,
  Shield,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface TechnicianStats {
  totalEarnings: number;
  completedJobs: number;
  averageRating: number;
  responseTime: number;
  activeJobs: number;
  pendingJobs: number;
}

interface JobNotification {
  id: number;
  title: string;
  message: string;
  type: 'new_job' | 'job_update' | 'payment_received';
  isRead: boolean;
  expiresAt?: string;
  serviceRequest: {
    id: number;
    category: string;
    serviceType: string;
    location: string;
    budget: number;
    urgency: string;
  };
}

export default function TechnicianDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");
  const { toast } = useToast();

  // Fetch technician profile and stats
  const { data: technicianData, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/technicians/profile'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/technicians/profile");
      return await response.json();
    },
  });

  // Fetch job notifications
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/technicians/notifications'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/technicians/notifications");
      return await response.json();
    },
  });

  // Fetch earnings data
  const { data: earnings, isLoading: earningsLoading } = useQuery({
    queryKey: ['/api/technicians/earnings'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/technicians/earnings");
      return await response.json();
    },
  });

  // Accept job mutation
  const acceptJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const response = await apiRequest("POST", `/api/technicians/jobs/${jobId}/accept`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Accepted",
        description: "You have successfully accepted this job.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/technicians/notifications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to accept job.",
        variant: "destructive",
      });
    },
  });

  // Decline job mutation
  const declineJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const response = await apiRequest("POST", `/api/technicians/jobs/${jobId}/decline`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Declined",
        description: "You have declined this job.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/technicians/notifications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to decline job.",
        variant: "destructive",
      });
    },
  });

  // Toggle availability mutation
  const toggleAvailabilityMutation = useMutation({
    mutationFn: async (available: boolean) => {
      const response = await apiRequest("PUT", "/api/technicians/availability", { available });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Availability Updated",
        description: `You are now ${isAvailable ? 'available' : 'unavailable'} for new jobs.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update availability.",
        variant: "destructive",
      });
    },
  });

  const handleAvailabilityChange = (available: boolean) => {
    setIsAvailable(available);
    toggleAvailabilityMutation.mutate(available);
  };

  const handleAcceptJob = (jobId: number) => {
    acceptJobMutation.mutate(jobId);
  };

  const handleDeclineJob = (jobId: number) => {
    declineJobMutation.mutate(jobId);
  };

  const mockStats: TechnicianStats = {
    totalEarnings: 2850.00,
    completedJobs: 47,
    averageRating: 4.8,
    responseTime: 45,
    activeJobs: 3,
    pendingJobs: 2,
  };

  const mockNotifications: JobNotification[] = [
    {
      id: 1,
      title: "New Job Opportunity",
      message: "Hardware repair needed in your area",
      type: "new_job",
      isRead: false,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      serviceRequest: {
        id: 123,
        category: "Hardware Issues",
        serviceType: "onsite",
        location: "San Francisco, CA",
        budget: 150,
        urgency: "medium"
      }
    },
    {
      id: 2,
      title: "Job Update",
      message: "Customer updated requirements for network troubleshooting",
      type: "job_update",
      isRead: false,
      serviceRequest: {
        id: 124,
        category: "Network Troubleshooting",
        serviceType: "remote",
        location: "Remote",
        budget: 100,
        urgency: "high"
      }
    }
  ];

  const mockEarnings = [
    { month: "Nov", amount: 1200 },
    { month: "Dec", amount: 1650 },
    { month: "Jan", amount: 2850 },
  ];

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Technician Dashboard</h1>
          <p className="text-gray-600">Welcome back, {technicianData?.businessName || "Technician"}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Available for Jobs</span>
            <Switch
              checked={isAvailable}
              onCheckedChange={handleAvailabilityChange}
            />
          </div>
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? "Available" : "Away"}
          </Badge>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockStats.totalEarnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.completedJobs}</div>
                <p className="text-xs text-muted-foreground">
                  +5 this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.averageRating}</div>
                <p className="text-xs text-muted-foreground">
                  From 47 reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.responseTime}m</div>
                <p className="text-xs text-muted-foreground">
                  Average response
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Job Completed</p>
                    <p className="text-sm text-gray-600">Network troubleshooting for ABC Corp - $125</p>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Payment Received</p>
                    <p className="text-sm text-gray-600">$125 deposited to your account</p>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">3 hours ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">New Job Available</p>
                    <p className="text-sm text-gray-600">Hardware repair in your area</p>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">5 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">In Progress</Badge>
                    <span className="text-sm text-gray-500">Started 2 hours ago</span>
                  </div>
                  <h3 className="font-semibold">PC Hardware Repair</h3>
                  <p className="text-gray-600 mb-2">Computer won't boot, suspected motherboard issue</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      San Francisco, CA
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      $150
                    </span>
                  </div>
                </div>
                <div className="text-center text-gray-500 py-8">
                  No other active jobs
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,250</div>
                <p className="text-xs text-green-600">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$340</div>
                <p className="text-xs text-gray-600">2 payments pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,850</div>
                <p className="text-xs text-gray-600">Since joining</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Job Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNotifications.map((notification) => (
                  <div key={notification.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={notification.type === 'new_job' ? 'default' : 'secondary'}>
                          {notification.type === 'new_job' ? 'New Job' : 'Update'}
                        </Badge>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      {notification.expiresAt && (
                        <span className="text-sm text-red-600">
                          Expires in {Math.round((new Date(notification.expiresAt).getTime() - Date.now()) / 60000)}m
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold">{notification.title}</h3>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>{notification.serviceRequest.category}</span>
                      <span>{notification.serviceRequest.location}</span>
                      <span>${notification.serviceRequest.budget}</span>
                      <Badge variant="outline" className="text-xs">
                        {notification.serviceRequest.urgency}
                      </Badge>
                    </div>
                    {notification.type === 'new_job' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleAcceptJob(notification.serviceRequest.id)}
                          disabled={acceptJobMutation.isPending}
                        >
                          Accept Job
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeclineJob(notification.serviceRequest.id)}
                          disabled={declineJobMutation.isPending}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Verification Status</p>
                    <p className="text-sm text-green-600">Verified Technician</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Rating</p>
                    <p className="text-sm text-gray-600">4.8 stars (47 reviews)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Specialties</p>
                    <p className="text-sm text-gray-600">Hardware Repair, Network Setup, Software Issues</p>
                  </div>
                </div>
                <Button className="mt-4">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Job Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications for new jobs</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Updates</p>
                    <p className="text-sm text-gray-600">Get weekly performance summaries</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-Accept Jobs</p>
                    <p className="text-sm text-gray-600">Automatically accept matching jobs</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}