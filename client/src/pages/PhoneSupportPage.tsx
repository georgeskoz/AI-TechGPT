import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, CheckCircle } from 'lucide-react';
import PhoneSupportPricing from '@/components/PhoneSupportPricing';

interface SupportService {
  id: string;
  name: string;
  description: string;
  supportLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  basePrice: number;
  minimumTime: number;
  category: string;
  includes: string[];
}

interface PricingFactors {
  supportLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  timeOfDay: 'morning' | 'midday' | 'afternoon' | 'evening' | 'midnight';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number;
  distance?: number;
  isOutOfTown: boolean;
  trafficFactor: number;
  demandMultiplier: number;
  dayOfWeek: 'weekday' | 'weekend';
}

export default function PhoneSupportPage() {
  const [, setLocation] = useLocation();
  const [selectedService, setSelectedService] = useState<SupportService | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleServiceSelected = (service: SupportService, factors: PricingFactors) => {
    setSelectedService(service);
    // Here you would typically send this to your booking API
    console.log('Service booked:', service, factors);
    setBookingConfirmed(true);
    
    // Auto-redirect after booking
    setTimeout(() => {
      setLocation('/chat');
    }, 3000);
  };

  if (bookingConfirmed && selectedService) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-4">
              Your {selectedService.name} session has been booked successfully.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="text-sm text-green-700">
                <div className="font-medium">What happens next:</div>
                <div className="mt-2 space-y-1">
                  <div>• You'll receive a confirmation call within 5 minutes</div>
                  <div>• Our technician will contact you at the scheduled time</div>
                  <div>• Have your device/system ready for support</div>
                </div>
              </div>
            </div>
            <Button onClick={() => setLocation('/chat')} className="w-full">
              Return to Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/issues')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Issues
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Phone Support Services</h1>
                <p className="text-gray-600">Professional technical support with dynamic pricing</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-700">
              <Phone className="w-4 h-4 mr-1" />
              Available 24/7
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PhoneSupportPricing onServiceSelected={handleServiceSelected} />
      </div>

      {/* Features Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Instant Connection</h3>
              <p className="text-sm text-gray-600">Connect with certified technicians immediately</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Guaranteed Results</h3>
              <p className="text-sm text-gray-600">100% satisfaction guarantee or money back</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Badge className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Expert Support</h3>
              <p className="text-sm text-gray-600">Certified professionals with years of experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}