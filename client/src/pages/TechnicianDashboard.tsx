import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/Navigation';
import { 
  User, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Navigation as NavigationIcon,
  CheckCircle,
  ArrowLeft,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function TechnicianDashboard() {
  const [, setLocation] = useLocation();
  
  // Mock data - in real app this would come from booking context
  const assignedServiceProvider = {
    id: 1,
    name: "Alex Johnson",
    rating: 4.8,
    completedJobs: 145,
    experience: "5 years",
    specialties: ["Hardware Repair", "Network Setup", "System Troubleshooting"],
    phone: "+1 (555) 123-4567",
    email: "alex.johnson@techgpt.com",
    location: "Downtown Ottawa",
    eta: "25 minutes",
    status: "On the way",
    profileImage: "/api/placeholder/120/120"
  };

  const bookingDetails = {
    bookingId: `TG-${Date.now().toString().slice(-6)}`,
    category: "Hardware Issues",
    description: "Computer won't start properly",
    scheduledTime: "Today, 2:30 PM",
    estimatedDuration: "1-2 hours",
    serviceType: "On-site",
    address: "123 Main St, Ottawa, ON",
    totalCost: "$85"
  };

  const handleStartNavigation = () => {
    const address = encodeURIComponent(bookingDetails.address);
    window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
  };

  const handleCallServiceProvider = () => {
    window.open(`tel:${assignedServiceProvider.phone}`, '_self');
  };

  const handleSendMessage = () => {
    // In real app, this would open a direct chat with the service provider
    setLocation('/chat');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation 
        showBackButton={true}
        backTo="/"
        title="Service Provider Details"
        showHomeButton={true}
      />
      
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Service Provider</h1>
          <p className="text-gray-600">Booking confirmed - your service provider is on the way</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Service Provider Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Service Provider Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{assignedServiceProvider.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{assignedServiceProvider.rating} ({assignedServiceProvider.completedJobs} jobs)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{assignedServiceProvider.experience} experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{assignedServiceProvider.location}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {assignedServiceProvider.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button 
                  onClick={handleCallServiceProvider}
                  className="w-full"
                  variant="default"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Service Provider
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  className="w-full"
                  variant="outline"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button 
                  onClick={handleStartNavigation}
                  className="w-full"
                  variant="outline"
                >
                  <NavigationIcon className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Booking ID</span>
                  <span className="text-sm font-mono">{bookingDetails.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm">{bookingDetails.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Service Type</span>
                  <span className="text-sm">{bookingDetails.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Scheduled</span>
                  <span className="text-sm">{bookingDetails.scheduledTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm">{bookingDetails.estimatedDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Cost</span>
                  <span className="text-sm font-semibold">{bookingDetails.totalCost}</span>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Service Description:</p>
                <p className="text-sm text-gray-600">{bookingDetails.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Service Address:</p>
                <p className="text-sm text-gray-600">{bookingDetails.address}</p>
              </div>

              <Separator />

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-600">Confirmed</span>
                </div>
                <p className="text-sm text-gray-600">
                  ETA: {assignedServiceProvider.eta}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Updates */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Booking confirmed</span>
                <span className="text-xs text-gray-500">Just now</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Service Provider assigned</span>
                <span className="text-xs text-gray-500">1 minute ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Service Provider on the way</span>
                <span className="text-xs text-gray-500">Expected in {assignedServiceProvider.eta}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-400">Service in progress</span>
                <span className="text-xs text-gray-400">Pending</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-400">Service completed</span>
                <span className="text-xs text-gray-400">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button 
            onClick={() => setLocation('/service-provider-dashboard')}
            variant="outline"
          >
            <User className="w-4 h-4 mr-2" />
            My Dashboard
          </Button>
          <Button 
            onClick={() => setLocation('/service-provider-dashboard')}
            variant="outline"
          >
            <Calendar className="w-4 h-4 mr-2" />
            View All Bookings
          </Button>
          <Button 
            onClick={() => setLocation('/chat')}
            variant="outline"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            AI Support
          </Button>
        </div>
      </div>
    </div>
  );
}