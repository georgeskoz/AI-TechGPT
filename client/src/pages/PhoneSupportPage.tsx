import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, CheckCircle } from 'lucide-react';
import SimpleNavigation from '@/components/SimpleNavigation';
import SimplePhoneSupportPricing from '@/components/SimplePhoneSupportPricing';

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
      <SimpleNavigation title="Phone Support" backTo="/issues" />
      
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <SimplePhoneSupportPricing onServiceSelected={handleServiceSelected} />
      </div>
    </div>
  );
}