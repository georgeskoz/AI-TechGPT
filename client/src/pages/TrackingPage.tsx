import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Navigation, 
  CheckCircle, 
  User,
  AlertCircle 
} from 'lucide-react';

export default function TrackingPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [serviceProvider] = useState({
    name: "John Smith",
    phone: "+1-555-0123",
    vehicle: "White Toyota Camry",
    license: "ABC-123",
    currentLocation: "En route to your location",
    estimatedArrival: "15 minutes",
    status: "on_way"
  });

  const [serviceDetails] = useState({
    requestId: "TG-" + Date.now().toString().slice(-6),
    category: "Computer Repair",
    address: "123 Main St, Ottawa, ON",
    requestedAt: "2:30 PM",
    estimatedDuration: "1-2 hours"
  });

  const [trackingEvents] = useState([
    { time: "2:30 PM", event: "Service request submitted", status: "completed" },
    { time: "2:35 PM", event: "Service provider assigned", status: "completed" },
    { time: "2:40 PM", event: "Service provider accepted request", status: "completed" },
    { time: "2:45 PM", event: "Service provider started journey", status: "completed" },
    { time: "3:00 PM", event: "Service provider en route", status: "current" },
    { time: "3:15 PM", event: "Estimated arrival time", status: "pending" },
    { time: "TBD", event: "Service completion", status: "pending" }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCall = () => {
    window.location.href = `tel:${serviceProvider.phone}`;
  };

  const handleMessage = () => {
    window.location.href = '/service-provider-chat';
  };

  const handleOpenMaps = () => {
    const encodedAddress = encodeURIComponent(serviceDetails.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'current': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'current': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-6 w-6 text-blue-600" />
            Service Provider Tracking
          </CardTitle>
          <CardDescription>
            Track your service provider's location and service progress in real-time
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{serviceProvider.name}</h3>
              <p className="text-sm text-gray-600">{serviceProvider.currentLocation}</p>
            </div>
            <div className="ml-auto">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                En Route
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">ETA</p>
                <p className="font-semibold">{serviceProvider.estimatedArrival}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-semibold">{serviceProvider.vehicle}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleCall}
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleMessage}
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleOpenMaps}
            >
              <Navigation className="w-4 h-4" />
              Maps
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Request ID</p>
              <p className="font-semibold">{serviceDetails.requestId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Service Type</p>
              <p className="font-semibold">{serviceDetails.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold">{serviceDetails.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Requested At</p>
              <p className="font-semibold">{serviceDetails.requestedAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Live Location</CardTitle>
          <CardDescription>
            Service provider's current location and route to your address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 w-full rounded-lg overflow-hidden border">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(serviceDetails.address)}&output=embed&z=14`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Service Location Map"
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>Last updated: {currentTime.toLocaleTimeString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Progress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trackingEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getStatusIcon(event.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{event.event}</span>
                    <Badge variant="outline" className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => window.history.back()}>
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.href = '/chat'}>
                AI Support
              </Button>
              <Button onClick={() => window.location.href = '/dashboard'}>
                Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}