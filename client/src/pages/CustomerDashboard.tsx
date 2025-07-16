import { useState } from 'react';
import { useAuth } from '@/components/UserAuthProvider';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import { 
  MessageSquare, 
  Phone, 
  Users, 
  Clock, 
  Star, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Settings,
  LogOut,
  Monitor,
  MapPin
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Mock data for customer dashboard
  const stats = {
    totalSessions: 12,
    hoursSupported: 8.5,
    averageRating: 4.7,
    activeSessions: 0
  };

  const recentSessions = [
    {
      id: 1,
      technician: "Alex Johnson",
      category: "Hardware Issues",
      status: "completed",
      duration: "45 min",
      date: "2 hours ago",
      rating: 5
    },
    {
      id: 2,
      technician: "Sarah Chen",
      category: "Network Setup",
      status: "completed",
      duration: "1.2 hours",
      date: "1 day ago",
      rating: 4
    },
    {
      id: 3,
      technician: "Mike Davis",
      category: "Software Issues",
      status: "completed",
      duration: "30 min",
      date: "3 days ago",
      rating: 5
    }
  ];

  const supportOptions = [
    {
      id: 1,
      title: "AI Chat Support",
      description: "Get instant help with AI-powered technical support",
      icon: MessageSquare,
      color: "bg-blue-500",
      path: "/chat"
    },
    {
      id: 2,
      title: "Phone Support",
      description: "Talk to a technician over the phone",
      icon: Phone,
      color: "bg-green-500",
      path: "/phone-support"
    },
    {
      id: 3,
      title: "Screen Sharing",
      description: "Share your screen for remote assistance",
      icon: Monitor,
      color: "bg-purple-500",
      path: "/screen-sharing"
    },
    {
      id: 4,
      title: "On-Site Support",
      description: "Get a technician to come to your location",
      icon: MapPin,
      color: "bg-orange-500",
      path: "/technician-request"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.fullName || user?.username}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Customer Account
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">+2 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Supported</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hoursSupported}h</div>
              <p className="text-xs text-muted-foreground">Total support time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">From {stats.totalSessions} sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSessions}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="support">Get Support</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Support Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{session.technician}</p>
                          <p className="text-sm text-gray-600">{session.category}</p>
                          <p className="text-xs text-gray-500">{session.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-sm">{session.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">{session.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setLocation('/chat')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start AI Chat Support
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setLocation('/phone-support')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Request Phone Support
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setLocation('/technician-request')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Book Technician Visit
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setLocation('/issues')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Issue Tracker
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportOptions.map((option) => (
                <Card key={option.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${option.color}`}>
                        <option.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{option.description}</p>
                    <Button 
                      className="w-full"
                      onClick={() => setLocation(option.path)}
                    >
                      Get Support
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Support Session History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{session.technician}</h4>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{session.category}</p>
                        <p className="text-xs text-gray-500 mt-1">{session.date}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{session.rating}/5</span>
                        </div>
                        <p className="text-xs text-gray-500">{session.duration}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Profile Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <p className="text-sm text-gray-600">{user?.fullName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Username</label>
                        <p className="text-sm text-gray-600">{user?.username}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <p className="text-sm text-gray-600">{user?.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Customer Status</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Active Customer
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Account Type: {user?.userType || 'customer'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="outline" onClick={() => setLocation('/profile/' + user?.username)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}