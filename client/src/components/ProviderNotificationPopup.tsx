import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Navigation, 
  Phone, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Route,
  Wrench,
  User
} from 'lucide-react';

interface JobDispatchNotification {
  id: number;
  ticketId: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  serviceType: 'onsite' | 'remote' | 'phone';
  category: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  
  customerLocation: {
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    zipCode: string;
  };
  
  estimates: {
    cost: number;
    duration: number; // minutes
    distance: number; // miles
    eta: number; // minutes
    trafficFactor: number;
  };
  
  responseDeadline: string; // ISO timestamp
  createdAt: string;
}

interface ProviderNotificationPopupProps {
  notification: JobDispatchNotification | null;
  isOpen: boolean;
  onAccept: (notificationId: number) => void;
  onReject: (notificationId: number) => void;
  onTimeout: (notificationId: number) => void;
}

export default function ProviderNotificationPopup({
  notification,
  isOpen,
  onAccept,
  onReject,
  onTimeout
}: ProviderNotificationPopupProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [responded, setResponded] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!notification || !isOpen || responded) return;

    const deadline = new Date(notification.responseDeadline);
    const now = new Date();
    const initialTimeLeft = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / 1000));
    
    setTimeLeft(initialTimeLeft);
    setIsExpired(initialTimeLeft <= 0);

    if (initialTimeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      const currentTime = new Date();
      const remaining = Math.max(0, Math.floor((deadline.getTime() - currentTime.getTime()) / 1000));
      
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        setIsExpired(true);
        handleTimeout();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [notification, isOpen, responded]);

  const handleAccept = () => {
    if (!notification || responded || isExpired) return;
    
    setResponded(true);
    onAccept(notification.id);
    
    // Open navigation app
    openNavigationApp(notification.customerLocation);
  };

  const handleReject = () => {
    if (!notification || responded || isExpired) return;
    
    setResponded(true);
    onReject(notification.id);
  };

  const handleTimeout = () => {
    if (!notification || responded) return;
    
    setResponded(true);
    setIsExpired(true);
    onTimeout(notification.id);
  };

  const openNavigationApp = (location: any) => {
    const { latitude, longitude, address } = location;
    
    // Detect device type and open appropriate navigation app
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    let navigationUrl = '';
    
    if (isIOS) {
      // iOS - Try Apple Maps first, fallback to Google Maps
      navigationUrl = `maps://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
      
      // Fallback to Google Maps if Apple Maps fails
      const fallbackUrl = `https://maps.google.com/maps?daddr=${latitude},${longitude}&amp;ll=`;
      
      // Try to open Apple Maps
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = navigationUrl;
      document.body.appendChild(iframe);
      
      // Remove iframe after attempting to open
      setTimeout(() => {
        document.body.removeChild(iframe);
        // If still here, open Google Maps in browser
        window.open(fallbackUrl, '_blank');
      }, 1000);
    } else if (isAndroid) {
      // Android - Use Google Maps intent
      navigationUrl = `google.navigation:q=${latitude},${longitude}&mode=d`;
      
      // Fallback to web version
      const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
      
      try {
        window.location.href = navigationUrl;
      } catch (error) {
        window.open(fallbackUrl, '_blank');
      }
    } else {
      // Desktop or other - Open Google Maps in browser
      navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
      window.open(navigationUrl, '_blank');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[urgency as keyof typeof colors] || colors.medium;
  };

  const getTimeLeftColor = (timeLeft: number) => {
    if (timeLeft > 40) return 'text-green-600';
    if (timeLeft > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const progressPercentage = Math.max(0, Math.min(100, (timeLeft / 60) * 100));

  if (!notification) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span>New Job Request</span>
            </div>
            {!responded && !isExpired && (
              <div className={`flex items-center gap-2 font-mono text-lg ${getTimeLeftColor(timeLeft)}`}>
                <Timer className="h-5 w-5" />
                {formatTime(timeLeft)}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Countdown Progress Bar */}
          {!responded && !isExpired && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Response Time</span>
                <span className={getTimeLeftColor(timeLeft)}>
                  {formatTime(timeLeft)} remaining
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2"
                style={{
                  background: timeLeft <= 20 ? '#fef2f2' : timeLeft <= 40 ? '#fffbeb' : '#f0fdf4'
                }}
              />
            </div>
          )}

          {/* Status Messages */}
          {responded && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Response Recorded</span>
            </div>
          )}

          {isExpired && !responded && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Request Expired - Reassigning</span>
            </div>
          )}

          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{notification.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{notification.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ticket:</span>
                <span className="font-medium">#{notification.ticketId}</span>
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Job Details
                </div>
                <Badge className={getUrgencyColor(notification.urgency)}>
                  {notification.urgency.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Category:</div>
                <div className="font-medium">{notification.category}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Description:</div>
                <div className="text-sm">{notification.description}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Service Type:</div>
                <Badge variant="outline" className="capitalize">
                  {notification.serviceType}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Location & Estimates */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">{notification.customerLocation.address}</div>
                <div className="text-xs text-gray-600">
                  {notification.customerLocation.city}, {notification.customerLocation.state}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Route className="h-3 w-3" />
                  {notification.estimates.distance} miles
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Estimates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>ETA:</span>
                  <span className="font-medium">{notification.estimates.eta} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">{notification.estimates.duration} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Cost:</span>
                  <span className="font-medium text-green-600">
                    ${notification.estimates.cost}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          {!responded && !isExpired && (
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleAccept}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Job
              </Button>
              <Button 
                onClick={handleReject}
                variant="outline" 
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                size="lg"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>
          )}

          {/* Navigation Button (after acceptance) */}
          {responded && !isExpired && (
            <Button 
              onClick={() => openNavigationApp(notification.customerLocation)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Open Navigation
            </Button>
          )}

          {/* Contact Customer Button */}
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => window.open(`tel:${notification.customerPhone}`, '_self')}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}