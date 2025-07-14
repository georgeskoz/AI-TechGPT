import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Phone, 
  MessageCircle, 
  Navigation, 
  MapPin, 
  Clock, 
  Star, 
  User, 
  Zap,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";

interface ActiveServiceTrackerProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ActiveServiceTracker({ isVisible, onClose }: ActiveServiceTrackerProps) {
  const [serviceStatus, setServiceStatus] = useState<'en-route' | 'arrived' | 'working' | 'completed'>('en-route');
  const [eta, setEta] = useState(18);
  const [progress, setProgress] = useState(25);

  // Mock technician data (in real app, this would come from props or API)
  const technician = {
    id: 1,
    name: "Michael Chen",
    rating: 4.9,
    completedJobs: 247,
    phone: "+1 (555) 123-4567",
    skills: ["Hardware", "Network", "Security"],
    image: "/api/placeholder/64/64"
  };

  const serviceDetails = {
    bookingId: "TG-" + Date.now().toString().slice(-6),
    category: "Hardware Issues",
    description: "Computer won't start, showing blue screen error",
    location: "123 Main St, Ottawa, ON",
    serviceFee: "$90",
    requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // Simulate ETA countdown and auto-close when completed
  useEffect(() => {
    if (serviceStatus === 'en-route' && eta > 0) {
      const timer = setInterval(() => {
        setEta(prev => {
          const newEta = prev - 1;
          // Auto-advance service status for demo
          if (newEta <= 5) {
            setServiceStatus('arrived');
          }
          return newEta;
        });
        setProgress(prev => Math.min(prev + 2, 95));
      }, 30000); // Update every 30 seconds for demo
      return () => clearInterval(timer);
    }
    
    // Auto-close when service is completed
    if (serviceStatus === 'completed') {
      const autoCloseTimer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds
      return () => clearTimeout(autoCloseTimer);
    }
  }, [serviceStatus, eta, onClose]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en-route': return 'bg-blue-500';
      case 'arrived': return 'bg-orange-500';
      case 'working': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en-route': return 'En Route';
      case 'arrived': return 'Arrived';
      case 'working': return 'Working';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-full">
      <Card className="shadow-xl border-2 border-blue-500 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              🔧 Active Service Request
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {serviceDetails.bookingId}
            </Badge>
            <Badge className={`text-xs text-white ${getStatusColor(serviceStatus)}`}>
              {getStatusText(serviceStatus)}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Technician Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{technician.name}</h4>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{technician.rating}</span>
                </div>
                <span>•</span>
                <span>{technician.completedJobs} jobs</span>
              </div>
            </div>
          </div>

          {/* Service Status */}
          {serviceStatus === 'en-route' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ETA</span>
                <span className="font-semibold">{eta} minutes</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Traveling to your location</span>
              </div>
            </div>
          )}

          {serviceStatus === 'arrived' && (
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="w-4 h-4" />
                <span className="font-semibold">Technician has arrived!</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                Your technician is at your location and ready to begin service.
              </p>
            </div>
          )}

          {serviceStatus === 'working' && (
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 text-purple-800">
                <Zap className="w-4 h-4" />
                <span className="font-semibold">Service in progress</span>
              </div>
              <p className="text-sm text-purple-700 mt-1">
                Your technician is working on: {serviceDetails.description}
              </p>
            </div>
          )}

          {serviceStatus === 'completed' && (
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span className="font-semibold">Service completed!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Please rate your experience with {technician.name}
              </p>
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    // Generate receipt
                    const receipt = {
                      id: serviceDetails.bookingId,
                      service: serviceDetails.category,
                      date: new Date().toLocaleDateString(),
                      amount: serviceDetails.serviceFee,
                      provider: technician.name,
                      status: 'Completed',
                      details: serviceDetails.description
                    };
                    
                    // Show receipt modal or download
                    const receiptText = `
TechGPT Service Receipt
======================

Booking ID: ${receipt.id}
Service: ${receipt.service}
Date: ${receipt.date}
Amount: ${receipt.amount}
Service Provider: ${receipt.provider}
Status: ${receipt.status}

Service Details:
${receipt.details}

Thank you for using TechGPT!
                    `;
                    
                    const blob = new Blob([receiptText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `TechGPT_Receipt_${receipt.id}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    alert('Receipt downloaded successfully!');
                  }}
                >
                  📄 Download Receipt
                </Button>
              </div>
            </div>
          )}

          {/* Service Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">{serviceDetails.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Fee:</span>
              <span className="font-medium">{serviceDetails.serviceFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Requested:</span>
              <span className="font-medium">{serviceDetails.requestedAt}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => window.open(`tel:${technician.phone}`)}
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                // In real app, open chat with technician
                console.log("Opening chat with technician");
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                // Open Google Maps with technician location
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(serviceDetails.location)}`;
                window.open(mapsUrl, '_blank');
              }}
            >
              <Navigation className="w-4 h-4" />
              Track
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  // Simulate status progression for demo
                  if (serviceStatus === 'en-route') setServiceStatus('arrived');
                  else if (serviceStatus === 'arrived') setServiceStatus('working');
                  else if (serviceStatus === 'working') setServiceStatus('completed');
                }}
              >
                📱 Update Status
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  // Open support chat
                  console.log("Opening support chat");
                }}
              >
                💬 Need Help?
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}