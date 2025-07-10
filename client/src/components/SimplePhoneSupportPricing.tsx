import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Phone, 
  Clock, 
  CheckCircle,
  DollarSign,
  Timer
} from 'lucide-react';

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

interface SimplePhoneSupportPricingProps {
  onServiceSelected: (service: SupportService, factors: PricingFactors) => void;
}

// Simplified service list - just the essentials
const supportServices: SupportService[] = [
  {
    id: 'basic-help',
    name: 'Quick Help',
    description: 'Basic troubleshooting & guidance',
    supportLevel: 'basic',
    basePrice: 25,
    minimumTime: 15,
    category: 'Phone Support',
    includes: ['Quick diagnosis', 'Basic steps', 'Simple fixes']
  },
  {
    id: 'standard-support',
    name: 'Standard Support',
    description: 'Detailed problem solving',
    supportLevel: 'intermediate',
    basePrice: 55,
    minimumTime: 30,
    category: 'Phone Support',
    includes: ['Full diagnosis', 'Step-by-step help', 'Testing']
  },
  {
    id: 'expert-help',
    name: 'Expert Help',
    description: 'Advanced technical consultation',
    supportLevel: 'advanced',
    basePrice: 95,
    minimumTime: 45,
    category: 'Phone Support',
    includes: ['Expert analysis', 'Strategic advice', 'Best practices']
  }
];

const levelColors = {
  basic: 'bg-green-100 text-green-800',
  intermediate: 'bg-blue-100 text-blue-800',
  advanced: 'bg-orange-100 text-orange-800',
  expert: 'bg-red-100 text-red-800'
};

const urgencyOptions = [
  { value: 'low', label: 'Low - Can wait', multiplier: 1.0 },
  { value: 'medium', label: 'Medium - Today', multiplier: 1.2 },
  { value: 'high', label: 'High - ASAP', multiplier: 1.5 },
  { value: 'urgent', label: 'Urgent - Now', multiplier: 2.0 }
];

export default function SimplePhoneSupportPricing({ onServiceSelected }: SimplePhoneSupportPricingProps) {
  const [selectedService, setSelectedService] = useState<SupportService | null>(null);
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  
  const calculatePrice = (service: SupportService, urgencyLevel: string) => {
    const urgencyMultiplier = urgencyOptions.find(u => u.value === urgencyLevel)?.multiplier || 1.0;
    const timeMultiplier = 1.1; // Evening surcharge
    return Math.round(service.basePrice * urgencyMultiplier * timeMultiplier);
  };

  const handleBookService = (service: SupportService) => {
    const factors: PricingFactors = {
      supportLevel: service.supportLevel,
      timeOfDay: 'evening',
      urgency: urgency,
      estimatedDuration: service.minimumTime,
      distance: 0,
      isOutOfTown: false,
      trafficFactor: 1.0,
      demandMultiplier: 1.0,
      dayOfWeek: 'weekday'
    };
    
    onServiceSelected(service, factors);
  };

  return (
    <div className="space-y-4">
      {/* Mobile-optimized header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">Phone Support</h2>
        <p className="text-gray-600 text-sm">Get help from our technicians</p>
      </div>

      {/* Simple urgency selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Timer className="h-5 w-5" />
            How urgent is this?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={urgency} onValueChange={(value: any) => setUrgency(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select urgency" />
            </SelectTrigger>
            <SelectContent>
              {urgencyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Simplified service cards */}
      <div className="space-y-3">
        {supportServices.map((service) => {
          const finalPrice = calculatePrice(service, urgency);
          
          return (
            <Card key={service.id} className="border-2 hover:border-blue-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">${finalPrice}</div>
                    <div className="text-xs text-gray-500">{service.minimumTime} min</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={levelColors[service.supportLevel]} variant="secondary">
                    {service.supportLevel}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Phone className="h-3 w-3 mr-1" />
                    Phone Call
                  </Badge>
                </div>

                {/* What's included - simplified */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Includes:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {service.includes.slice(0, 3).map((item, index) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => handleBookService(service)}
                  className="w-full"
                  size="lg"
                >
                  Book ${finalPrice} Call
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Simple features footer */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-blue-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Available 24/7</span>
            </div>
            <p className="text-sm text-blue-600">
              Get connected with certified technicians instantly
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}