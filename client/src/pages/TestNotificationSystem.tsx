import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import TechnicianNotificationService from '@/components/TechnicianNotificationService';
import { 
  MapPin, 
  Clock, 
  Users, 
  Wifi, 
  WifiOff, 
  Send, 
  TestTube,
  Navigation,
  Phone,
  Monitor
} from 'lucide-react';

export default function TestNotificationSystem() {
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<number>(1);
  const [isConnected, setIsConnected] = useState(false);
  const [testJobData, setTestJobData] = useState({
    customerId: 1,
    ticketId: Math.floor(Math.random() * 10000),
    serviceType: 'onsite' as 'onsite' | 'remote' | 'phone',
    category: 'Hardware Issues',
    description: 'Computer won\'t turn on, needs diagnostic and repair',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    customerLocation: {
      address: '123 Main Street, Ottawa, ON',
      latitude: 45.4215,
      longitude: -75.6972,
      city: 'Ottawa',
      state: 'ON',
      zipCode: 'K1A 0A6'
    }
  });

  // Get notification service status
  const { data: notificationStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['/api/providers/notifications/status'],
    refetchInterval: 5000, // Update every 5 seconds
  });

  // Mock technicians data for testing
  const mockTechnicians = [
    { id: 1, name: 'John Smith', specialties: ['Hardware', 'Network'], rating: 4.8 },
    { id: 2, name: 'Sarah Wilson', specialties: ['Software', 'Security'], rating: 4.9 },
    { id: 3, name: 'Mike Johnson', specialties: ['Database', 'System Admin'], rating: 4.7 },
    { id: 4, name: 'Emily Davis', specialties: ['Web Dev', 'Mobile'], rating: 4.6 },
  ];

  const handleDispatchJob = async () => {
    try {
      const response = await apiRequest('POST', '/api/jobs/dispatch', testJobData);
      console.log('Job dispatched:', response);
      
      // Generate new ticket ID for next test
      setTestJobData(prev => ({
        ...prev,
        ticketId: Math.floor(Math.random() * 10000)
      }));
      
      // Refresh status
      refetchStatus();
      
    } catch (error) {
      console.error('Error dispatching job:', error);
    }
  };

  const openGoogleMaps = () => {
    const { latitude, longitude } = testJobData.customerLocation;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const callCustomer = () => {
    window.open('tel:+15551234567', '_self');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notification Service Component */}
      <TechnicianNotificationService 
        technicianId={selectedTechnicianId}
        isActive={true}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Real-Time Notification System Test
        </h1>
        <p className="text-gray-600">
          Test the complete job dispatch and provider notification system with AI-powered matching,
          countdown timers, and automatic job reassignment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Active Connections</span>
                <Badge variant="secondary">
                  {notificationStatus?.activeConnections || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Pending Requests</span>
                <Badge variant="secondary">
                  {notificationStatus?.pendingRequests || 0}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="technician-select">Test as Technician</Label>
              <Select 
                value={selectedTechnicianId.toString()} 
                onValueChange={(value) => setSelectedTechnicianId(parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockTechnicians.map(tech => (
                    <SelectItem key={tech.id} value={tech.id.toString()}>
                      {tech.name} - {tech.specialties.join(', ')} ({tech.rating}⭐)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Wifi className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                WebSocket connection active for Technician #{selectedTechnicianId}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Job Dispatch Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Dispatch Test Job
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ticket ID</Label>
                <Input 
                  value={testJobData.ticketId} 
                  onChange={(e) => setTestJobData(prev => ({
                    ...prev, 
                    ticketId: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <Label>Service Type</Label>
                <Select 
                  value={testJobData.serviceType} 
                  onValueChange={(value) => setTestJobData(prev => ({
                    ...prev, 
                    serviceType: value as any
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Category</Label>
              <Select 
                value={testJobData.category} 
                onValueChange={(value) => setTestJobData(prev => ({
                  ...prev, 
                  category: value
                }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hardware Issues">Hardware Issues</SelectItem>
                  <SelectItem value="Network Troubleshooting">Network Troubleshooting</SelectItem>
                  <SelectItem value="Software Issues">Software Issues</SelectItem>
                  <SelectItem value="Security Questions">Security Questions</SelectItem>
                  <SelectItem value="System Administration">System Administration</SelectItem>
                  <SelectItem value="Database Help">Database Help</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Mobile Devices">Mobile Devices</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Urgency</Label>
              <Select 
                value={testJobData.urgency} 
                onValueChange={(value) => setTestJobData(prev => ({
                  ...prev, 
                  urgency: value as any
                }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea 
                value={testJobData.description}
                onChange={(e) => setTestJobData(prev => ({
                  ...prev, 
                  description: e.target.value
                }))}
                className="mt-1"
                rows={3}
              />
            </div>

            <Button onClick={handleDispatchJob} className="w-full" size="lg">
              <Send className="h-4 w-4 mr-2" />
              Dispatch Job to Best Technician
            </Button>
          </CardContent>
        </Card>

        {/* Customer Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Customer Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Address</Label>
              <Input 
                value={testJobData.customerLocation.address}
                onChange={(e) => setTestJobData(prev => ({
                  ...prev, 
                  customerLocation: {
                    ...prev.customerLocation,
                    address: e.target.value
                  }
                }))}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input 
                  value={testJobData.customerLocation.city}
                  onChange={(e) => setTestJobData(prev => ({
                    ...prev, 
                    customerLocation: {
                      ...prev.customerLocation,
                      city: e.target.value
                    }
                  }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>State/Province</Label>
                <Input 
                  value={testJobData.customerLocation.state}
                  onChange={(e) => setTestJobData(prev => ({
                    ...prev, 
                    customerLocation: {
                      ...prev.customerLocation,
                      state: e.target.value
                    }
                  }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Postal Code</Label>
                <Input 
                  value={testJobData.customerLocation.zipCode}
                  onChange={(e) => setTestJobData(prev => ({
                    ...prev, 
                    customerLocation: {
                      ...prev.customerLocation,
                      zipCode: e.target.value
                    }
                  }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Latitude</Label>
                <Input 
                  type="number" 
                  step="0.0001"
                  value={testJobData.customerLocation.latitude}
                  onChange={(e) => setTestJobData(prev => ({
                    ...prev, 
                    customerLocation: {
                      ...prev.customerLocation,
                      latitude: parseFloat(e.target.value) || 0
                    }
                  }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input 
                  type="number" 
                  step="0.0001"
                  value={testJobData.customerLocation.longitude}
                  onChange={(e) => setTestJobData(prev => ({
                    ...prev, 
                    customerLocation: {
                      ...prev.customerLocation,
                      longitude: parseFloat(e.target.value) || 0
                    }
                  }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={openGoogleMaps} variant="outline" className="flex-1">
                <Navigation className="h-4 w-4 mr-2" />
                Open Maps
              </Button>
              <Button onClick={callCustomer} variant="outline" className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Call Customer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              System Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-800">60-second countdown timer with visual progress</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-800">WebSocket real-time notifications</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-purple-800">AI-powered provider matching by proximity & expertise</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-orange-800">Automatic job reassignment on timeout/rejection</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-sm text-indigo-800">Google Maps integration with deep linking</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-red-800">Analytics logging for response tracking</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              This page demonstrates the complete real-time notification system for service providers:
            </p>
            
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Select a technician ID to test as from the dropdown</li>
              <li>The system automatically connects via WebSocket for real-time notifications</li>
              <li>Customize the job details and location as needed</li>
              <li>Click "Dispatch Job" to send a job request to the AI matching system</li>
              <li>The system will find the best technician and send a popup notification</li>
              <li>The notification includes a 60-second countdown timer</li>
              <li>Accept/reject the job or let it timeout to test reassignment</li>
              <li>On acceptance, the system opens Google Maps with navigation</li>
              <li>All responses are logged for analytics and performance tracking</li>
            </ol>
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> In development mode, you can also use the "Test Notification" button 
                in the bottom-right corner to simulate notifications without dispatching actual jobs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}