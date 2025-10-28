import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, MessageSquare, Clock, AlertCircle, Mail, Calendar } from 'lucide-react';

interface NoServiceProvidersModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerLocation: {
    city: string;
    state: string;
    country: string;
    address?: string;
  };
  serviceType: string;
  category: string;
  subcategory: string;
  onExpandRadius?: () => void;
}

export default function NoServiceProvidersModal({
  isOpen,
  onClose,
  customerLocation,
  serviceType,
  category,
  subcategory,
  onExpandRadius
}: NoServiceProvidersModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const alternativeOptions = [
    {
      id: 'expand-radius',
      title: 'Expand Search Radius',
      description: 'Search for service providers in nearby cities',
      icon: MapPin,
      action: 'Search wider area',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      estimatedTime: '5-10 minutes'
    },
    {
      id: 'phone-support',
      title: 'Phone Support',
      description: 'Get immediate help via phone consultation',
      icon: Phone,
      action: 'Call now',
      color: 'bg-green-50 text-green-700 border-green-200',
      estimatedTime: 'Immediate'
    },
    {
      id: 'ai-chat',
      title: 'AI Technical Assistant',
      description: 'Try our AI-powered troubleshooting first',
      icon: MessageSquare,
      action: 'Start chat',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      estimatedTime: 'Immediate'
    },
    {
      id: 'schedule-later',
      title: 'Schedule for Later',
      description: 'Book for when service providers become available',
      icon: Calendar,
      action: 'Schedule',
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      estimatedTime: 'Next available slot'
    },
    {
      id: 'email-request',
      title: 'Email Request',
      description: 'Send detailed request and get priority notification',
      icon: Mail,
      action: 'Send email',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      estimatedTime: '1-2 hours'
    }
  ];

  const getMapUrl = () => {
    const { city, state, country } = customerLocation;
    const location = `${city}, ${state}, ${country}`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed&z=12`;
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    // Handle different option actions
    switch (optionId) {
      case 'expand-radius':
        // Expand search radius and close modal
        onClose();
        // Trigger expanded search callback
        if (onExpandRadius) {
          onExpandRadius();
        }
        break;
      case 'phone-support':
        // TODO: Redirect to phone support
        window.location.href = '/phone-support';
        break;
      case 'ai-chat':
        // TODO: Redirect to AI chat
        window.location.href = '/chat';
        break;
      case 'schedule-later':
        // TODO: Implement scheduling
        console.log('Opening scheduler...');
        break;
      case 'email-request':
        // TODO: Implement email request
        console.log('Opening email form...');
        break;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-[90vw] md:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            No Service Providers Available
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Request Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Service Request</CardTitle>
              <CardDescription>
                We're currently searching for available service providers in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Service Type</p>
                  <Badge variant="outline" className="mt-1">{serviceType}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <Badge variant="outline" className="mt-1">{category}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Subcategory</p>
                  <Badge variant="outline" className="mt-1">{subcategory}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{customerLocation.city}, {customerLocation.state}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Map */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Location</CardTitle>
              <CardDescription>
                Current search area: {customerLocation.city}, {customerLocation.state}, {customerLocation.country}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 w-full rounded-lg overflow-hidden border">
                <iframe
                  src={getMapUrl()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Your Location Map"
                />
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    <strong>No service providers found</strong> in your immediate area for {serviceType} {category} services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alternative Options</CardTitle>
              <CardDescription>
                Choose from these alternatives to get the help you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alternativeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Card 
                      key={option.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedOption === option.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleOptionSelect(option.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${option.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{option.title}</h3>
                            <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {option.action}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{option.estimatedTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Explore More Button - Mobile Style */}
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-md opacity-60 animate-pulse"></div>
              <Button 
                onClick={() => handleOptionSelect('expand-radius')}
                className="relative bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-6 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <MapPin className="h-6 w-6 mr-2" />
                EXPLORE MORE
              </Button>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Search in nearby cities and expanded areas
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleOptionSelect('phone-support')}>
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
              <Button onClick={() => handleOptionSelect('ai-chat')}>
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}