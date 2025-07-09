import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { 
  User, 
  Users,
  Settings, 
  History, 
  Calendar, 
  MapPin, 
  Phone, 
  Star, 
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  DollarSign,
  Filter,
  Search,
  Plus
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [serviceBookings, setServiceBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load user from localStorage or use demo user
    const userStr = localStorage.getItem('tech_user');
    let user;
    
    if (userStr) {
      user = JSON.parse(userStr);
    } else {
      // Create demo user for testing
      user = {
        id: 1,
        username: "demo_user",
        email: "demo@example.com",
        fullName: "Demo User",
        userType: "customer"
      };
    }
    
    setCurrentUser(user);
    loadUserData(user.id);
  }, []);

  const loadUserData = async (userId: number) => {
    setIsLoading(true);
    try {
      // Load service requests, jobs, and service bookings for the user
      const [requestsRes, jobsRes, bookingsRes] = await Promise.all([
        apiRequest("GET", `/api/service-requests/customer/${userId}`),
        apiRequest("GET", `/api/jobs/customer/${userId}`),
        apiRequest("GET", `/api/service-bookings/customer/${userId}`)
      ]);
      
      const requests = await requestsRes.json();
      const userJobs = await jobsRes.json();
      const bookings = await bookingsRes.json();
      
      console.log("Loaded service requests:", requests);
      console.log("Loaded jobs:", userJobs);
      console.log("Loaded service bookings:", bookings);
      
      setServiceRequests(requests);
      setJobs(userJobs);
      setServiceBookings(bookings);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error loading data",
        description: "Unable to load your support history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRequest = () => {
    setLocation('/issues');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Combine service requests and service bookings
  const allRequests = [
    ...serviceRequests.map(req => ({...req, type: 'service_request'})),
    ...serviceBookings.map(booking => ({
      ...booking,
      type: 'service_booking',
      category: booking.category || 'General Support',
      title: booking.description || 'Service Booking'
    }))
  ];

  const filteredRequests = allRequests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = (request.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (request.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!currentUser) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <Navigation title="Client Dashboard" backTo="/customer-home" />
        <div className="text-center py-12">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard</h1>
            <p className="text-gray-600 mb-8">
              Create an account or log in to access your support history, manage service requests, and track your technical support needs.
            </p>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Free AI Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Get instant help with technical issues using our AI assistant
                  </p>
                  <Button onClick={() => setSelectedSection('chat')} className="w-full">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Find Technicians</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect with verified experts for complex technical problems
                  </p>
                  <Button onClick={() => setSelectedSection('technicians')} variant="outline" className="w-full">
                    Find Experts
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Manage Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Categorize and track your technical support requests
                  </p>
                  <Button onClick={() => setSelectedSection('issues')} variant="outline" className="w-full">
                    Manage Issues
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <User className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Profile & Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Create account, edit profile, and manage your settings
                  </p>
                  <Button onClick={() => setSelectedSection('profile')} variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Render Selected Section Content */}
            {selectedSection && (
              <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedSection === 'chat' && 'AI Chat Support'}
                      {selectedSection === 'technicians' && 'Find Technicians'}
                      {selectedSection === 'issues' && 'Manage Issues'}
                      {selectedSection === 'profile' && 'Profile & Settings'}
                    </h2>
                    <Button variant="outline" size="sm" onClick={() => setSelectedSection(null)}>
                      Close
                    </Button>
                  </div>
                  
                  {selectedSection === 'chat' && (
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Get instant help with technical issues using our AI assistant. Click the button below to start a chat session.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-medium text-blue-900 mb-2">What can our AI help you with?</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Hardware troubleshooting</li>
                          <li>• Software installation issues</li>
                          <li>• Network connectivity problems</li>
                          <li>• Performance optimization</li>
                          <li>• Security questions</li>
                        </ul>
                      </div>
                      <Button onClick={() => setLocation('/chat')} className="w-full sm:w-auto">
                        Start AI Chat Now
                      </Button>
                    </div>
                  )}
                  
                  {selectedSection === 'technicians' && (
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Connect with verified technicians for complex problems requiring human expertise.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h3 className="font-medium text-green-900 mb-2">Remote Support</h3>
                          <p className="text-sm text-green-800 mb-2">Screen sharing and remote assistance</p>
                          <p className="text-sm text-green-600">Starting at $25/hour</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h3 className="font-medium text-green-900 mb-2">On-site Support</h3>
                          <p className="text-sm text-green-800 mb-2">In-person technical assistance</p>
                          <p className="text-sm text-green-600">Starting at $50/hour</p>
                        </div>
                      </div>
                      <Button onClick={() => setLocation('/technician-matching')} className="w-full sm:w-auto">
                        Find Technicians Now
                      </Button>
                    </div>
                  )}
                  
                  {selectedSection === 'issues' && (
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Categorize and track your technical support requests for better organization.
                      </p>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h3 className="font-medium text-purple-900 mb-2">Issue Categories</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-purple-800">
                          <div>• Hardware Issues</div>
                          <div>• Software Problems</div>
                          <div>• Network Troubleshooting</div>
                          <div>• Database Help</div>
                          <div>• Security Questions</div>
                          <div>• Mobile Devices</div>
                        </div>
                      </div>
                      <Button onClick={() => setLocation('/issues')} className="w-full sm:w-auto">
                        Manage Issues Now
                      </Button>
                    </div>
                  )}
                  
                  {selectedSection === 'profile' && (
                    <div className="space-y-6">
                      <p className="text-gray-600">
                        Create your account to unlock personalized support, track service history, and save your preferences.
                      </p>
                      
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                        <h3 className="font-medium text-orange-900 mb-4">Create New Account</h3>
                        <form className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                              <Input placeholder="Enter your full name" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                              <Input type="email" placeholder="Enter your email" />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                              <Input type="tel" placeholder="Enter your phone number" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                              <Input placeholder="Choose a username" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <Input placeholder="Enter your address (for onsite services)" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <Input type="password" placeholder="Create a password" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <Input type="password" placeholder="Confirm your password" />
                          </div>
                        </form>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-medium text-blue-900 mb-2">Account Benefits</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Save your service history and preferences</li>
                          <li>• Track support requests and their progress</li>
                          <li>• Get personalized recommendations</li>
                          <li>• Access premium support features</li>
                          <li>• Receive notifications about your requests</li>
                        </ul>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          Create Account
                        </Button>
                        <Button variant="outline">
                          Sign In to Existing Account
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!selectedSection && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">Ready to Get Started?</h2>
                <p className="text-blue-700 mb-4">
                  Create an account to track your support history, save preferences, and get personalized assistance.
                </p>
                <Button onClick={() => setLocation('/chat')} className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Navigation title="Client Dashboard" backTo="/customer-home" />
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser.fullName?.split(' ')[0] || 'User'}!</h1>
          <p className="text-gray-600">Manage your technical support services and history</p>
        </div>
        <Button onClick={handleNewRequest} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Support Request
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Support Requests</TabsTrigger>
          <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Active Requests</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {serviceRequests.filter(r => r.status === 'pending' || r.status === 'in_progress').length}
                </div>
                <p className="text-sm text-gray-600">Open support requests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">Completed Jobs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {jobs.filter(j => j.status === 'completed').length}
                </div>
                <p className="text-sm text-gray-600">Successfully resolved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-lg">Average Rating</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">4.8</div>
                <p className="text-sm text-gray-600">Based on service reviews</p>
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
                {serviceRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {getStatusIcon(request.status)}
                    <div className="flex-1">
                      <p className="font-medium">{request.description || request.title}</p>
                      <p className="text-sm text-gray-600">{request.category}</p>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                ))}
                {serviceRequests.length === 0 && (
                  <p className="text-gray-600 text-center py-8">
                    No support requests yet. <Button variant="link" onClick={handleNewRequest}>Create your first request</Button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{request.description || request.title}</CardTitle>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Category: {request.category}</span>
                        <span>Priority: {request.priority}</span>
                        <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">${request.estimatedPrice}</div>
                      <div className="text-sm text-gray-600">Est. Price</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{request.description || request.title}</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Contact Technician
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Reschedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredRequests.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                  <p className="text-gray-600 mb-4">
                    {filterStatus === 'all' 
                      ? "You haven't created any support requests yet."
                      : `No requests found with status "${filterStatus}".`
                    }
                  </p>
                  <Button onClick={handleNewRequest}>Create New Request</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-6">
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>Technician: {job.technicianName || 'Assigned'}</span>
                        <span>Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Chat with Technician
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Call Technician
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      Track Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {jobs.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active jobs</h3>
                  <p className="text-gray-600 mb-4">You don't have any active technician jobs at the moment.</p>
                  <Button onClick={handleNewRequest}>Schedule New Service</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...serviceRequests, ...jobs]
                  .filter(item => item.status === 'completed')
                  .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
                  .map((item) => (
                    <div key={`${item.id}-${item.title ? 'job' : 'request'}`} className="flex items-center gap-3 p-4 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium">{item.title || item.description}</p>
                        <p className="text-sm text-gray-600">
                          Completed on {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">${item.finalPrice || item.estimatedPrice}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input value={currentUser.fullName || ''} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input value={currentUser.email || ''} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input value={currentUser.phone || ''} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Input value={currentUser.address || ''} readOnly />
                </div>
                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Requests:</span>
                  <span className="font-medium">{serviceRequests.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed Jobs:</span>
                  <span className="font-medium">{jobs.filter(j => j.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Rating:</span>
                  <span className="font-medium">4.8 ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span>Member Since:</span>
                  <span className="font-medium">January 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Spent:</span>
                  <span className="font-medium text-green-600">$0.00</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}