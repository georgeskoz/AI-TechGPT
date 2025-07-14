import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Users, Shield, Clock, Activity, Settings, ArrowLeft, X } from 'lucide-react';
import ScreenSharingTool from '@/components/ScreenSharingTool';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import SimpleNavigation from '@/components/SimpleNavigation';

interface ScreenSharingSession {
  id: string;
  customerId: number;
  serviceProviderId: number;
  customerName: string;
  serviceProviderName: string;
  status: 'pending' | 'active' | 'ended';
  sessionType: 'view-only' | 'remote-control';
  startTime: Date;
  duration: number;
  quality: 'high' | 'medium' | 'low';
}

export default function ScreenSharingPage() {
  const [activeTab, setActiveTab] = useState('current');
  const [userRole, setUserRole] = useState<'customer' | 'service_provider'>('customer');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  // Mock data for demonstration
  const mockSessions: ScreenSharingSession[] = [
    {
      id: 'session_001',
      customerId: 1,
      serviceProviderId: 2,
      customerName: 'John Smith',
      serviceProviderName: 'Emily Rodriguez',
      status: 'active',
      sessionType: 'remote-control',
      startTime: new Date(Date.now() - 300000), // 5 minutes ago
      duration: 300,
      quality: 'high'
    },
    {
      id: 'session_002',
      customerId: 3,
      serviceProviderId: 4,
      customerName: 'Sarah Johnson',
      serviceProviderName: 'Mike Chen',
      status: 'ended',
      sessionType: 'view-only',
      startTime: new Date(Date.now() - 1800000), // 30 minutes ago
      duration: 1245,
      quality: 'medium'
    }
  ];

  const { data: sessions = mockSessions } = useQuery({
    queryKey: ['/api/screen-sharing/sessions'],
    enabled: false // Using mock data for now
  });

  const activeSessions = sessions.filter(s => s.status === 'active');
  const recentSessions = sessions.filter(s => s.status === 'ended').slice(0, 10);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavigation 
        title="Screen Sharing Center" 
        showBackButton={true}
        backTo="/"
      />
      <div className="p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Screen Sharing Center</h1>
                <p className="text-gray-600">Remote screen sharing and control for technical support</p>
              </div>
            </div>
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Role:</span>
              <select 
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as any)}
                className="ml-2 p-1 border rounded"
              >
                <option value="customer">Customer</option>
                <option value="service_provider">Service Provider</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">System Online</span>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-green-600">{activeSessions.length}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Sessions</p>
                  <p className="text-2xl font-bold text-blue-600">{sessions.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Duration</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatDuration(Math.floor(sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length || 0))}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Security Status</p>
                  <p className="text-2xl font-bold text-green-600">Secure</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current Session</TabsTrigger>
              <TabsTrigger value="active">Active Sessions</TabsTrigger>
              <TabsTrigger value="history">Session History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Screen Sharing Tool</CardTitle>
                  <CardDescription>
                    Start a new screen sharing session or join an existing one
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScreenSharingTool 
                    userRole={userRole}
                    userId={1}
                    sessionId={selectedSession || undefined}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>
                    Currently running screen sharing sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Monitor className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium">No active sessions</p>
                      <p className="text-sm">Start a new session to begin screen sharing</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeSessions.map((session) => (
                        <Card key={session.id} className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`}></div>
                                <div>
                                  <h3 className="font-medium">
                                    {session.customerName} ↔ {session.serviceProviderName}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    Session ID: {session.id}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <Badge variant={session.sessionType === 'remote-control' ? 'destructive' : 'secondary'}>
                                    {session.sessionType}
                                  </Badge>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {formatDuration(Math.floor((Date.now() - session.startTime.getTime()) / 1000))}
                                  </p>
                                </div>
                                
                                <Button 
                                  size="sm" 
                                  onClick={() => {
                                    setSelectedSession(session.id);
                                    setActiveTab('current');
                                  }}
                                >
                                  Join Session
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Session History</CardTitle>
                  <CardDescription>
                    Previous screen sharing sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium">No session history</p>
                      <p className="text-sm">Completed sessions will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentSessions.map((session) => (
                        <Card key={session.id} className="border-l-4 border-l-gray-400">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`}></div>
                                <div>
                                  <h3 className="font-medium">
                                    {session.customerName} ↔ {session.serviceProviderName}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {session.startTime.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <Badge variant="outline">
                                    {session.sessionType}
                                  </Badge>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Duration: {formatDuration(session.duration)}
                                  </p>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-sm font-medium">Quality: {session.quality}</p>
                                  <p className="text-sm text-gray-600">Ended</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}