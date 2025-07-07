import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Phone, 
  Clock, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Calculator,
  Star,
  DollarSign,
  Timer,
  Navigation
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

interface PriceCalculation {
  basePrice: number;
  adjustments: { [key: string]: number };
  finalPrice: number;
  breakdown: string[];
}

interface PhoneSupportPricingProps {
  onServiceSelected: (service: SupportService, factors: PricingFactors) => void;
}

// Mock data - in real app this would come from the backend
const supportServices: SupportService[] = [
  {
    id: 'basic-diagnosis',
    name: 'Basic Issue Diagnosis',
    description: 'Quick assessment and basic troubleshooting guidance',
    supportLevel: 'basic',
    basePrice: 25,
    minimumTime: 15,
    category: 'Phone Support',
    includes: ['Initial assessment', 'Basic troubleshooting steps', 'General guidance']
  },
  {
    id: 'basic-guidance',
    name: 'Basic Technical Guidance',
    description: 'Step-by-step instructions for common issues',
    supportLevel: 'basic',
    basePrice: 35,
    minimumTime: 30,
    category: 'Phone Support',
    includes: ['Detailed instructions', 'Follow-up verification', 'Documentation']
  },
  {
    id: 'intermediate-diagnosis',
    name: 'Intermediate Problem Solving',
    description: 'In-depth analysis and solution development',
    supportLevel: 'intermediate',
    basePrice: 55,
    minimumTime: 30,
    category: 'Phone Support',
    includes: ['Comprehensive diagnosis', 'Multiple solution options', 'Implementation guidance', 'Testing assistance']
  },
  {
    id: 'intermediate-configuration',
    name: 'System Configuration Support',
    description: 'Guided configuration and setup assistance',
    supportLevel: 'intermediate',
    basePrice: 75,
    minimumTime: 45,
    category: 'Phone Support',
    includes: ['Configuration planning', 'Step-by-step setup', 'Optimization recommendations', 'Verification testing']
  },
  {
    id: 'advanced-consultation',
    name: 'Advanced Technical Consultation',
    description: 'Expert-level analysis and strategic recommendations',
    supportLevel: 'advanced',
    basePrice: 95,
    minimumTime: 45,
    category: 'Phone Support',
    includes: ['Deep technical analysis', 'Strategic planning', 'Best practices review', 'Implementation roadmap']
  },
  {
    id: 'advanced-emergency',
    name: 'Emergency Response Support',
    description: 'Immediate response for critical technical issues',
    supportLevel: 'advanced',
    basePrice: 125,
    minimumTime: 30,
    category: 'Phone Support',
    includes: ['Immediate response', 'Priority escalation', 'Critical issue resolution', '24/7 availability']
  },
  {
    id: 'expert-architecture',
    name: 'System Architecture Review',
    description: 'Comprehensive system design and optimization',
    supportLevel: 'expert',
    basePrice: 150,
    minimumTime: 60,
    category: 'Phone Support',
    includes: ['Architecture assessment', 'Performance optimization', 'Security review', 'Scalability planning']
  },
  {
    id: 'expert-crisis',
    name: 'Crisis Management Support',
    description: 'Expert-level crisis resolution and recovery',
    supportLevel: 'expert',
    basePrice: 200,
    minimumTime: 60,
    category: 'Phone Support',
    includes: ['Crisis assessment', 'Recovery planning', 'Team coordination', 'Post-incident analysis']
  }
];

const levelColors = {
  basic: 'bg-green-100 text-green-800',
  intermediate: 'bg-blue-100 text-blue-800',
  advanced: 'bg-orange-100 text-orange-800',
  expert: 'bg-red-100 text-red-800'
};

const urgencyColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

export default function PhoneSupportPricing({ onServiceSelected }: PhoneSupportPricingProps) {
  const [selectedService, setSelectedService] = useState<SupportService | null>(null);
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [estimatedDuration, setEstimatedDuration] = useState<number>(30);
  const [distance, setDistance] = useState<number>(0);
  const [isOutOfTown, setIsOutOfTown] = useState<boolean>(false);
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null);

  // Auto-calculate current factors
  const getCurrentFactors = (): PricingFactors => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    
    let timeOfDay: 'morning' | 'midday' | 'afternoon' | 'evening' | 'midnight';
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 14) timeOfDay = 'midday';
    else if (hour >= 14 && hour < 18) timeOfDay = 'afternoon';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'midnight';

    const demandMultiplier = hour >= 9 && hour <= 17 ? 1.2 : 1.0;
    const trafficFactor = hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19 ? 1.3 : 1.0;

    return {
      supportLevel: selectedService?.supportLevel || 'basic',
      timeOfDay,
      urgency,
      estimatedDuration,
      distance: distance > 0 ? distance : undefined,
      isOutOfTown,
      trafficFactor,
      demandMultiplier,
      dayOfWeek: day === 0 || day === 6 ? 'weekend' : 'weekday'
    };
  };

  // Simple price calculation (mock of backend logic)
  const calculatePrice = (service: SupportService, factors: PricingFactors): PriceCalculation => {
    const breakdown: string[] = [];
    let finalPrice = service.basePrice;
    const adjustments: { [key: string]: number } = {};

    breakdown.push(`Base price: $${service.basePrice}`);

    // Time multipliers
    const timeMultipliers = {
      morning: 1.0,
      midday: 1.1,
      afternoon: 1.0,
      evening: 1.2,
      midnight: 1.5
    };

    const urgencyMultipliers = {
      low: 1.0,
      medium: 1.2,
      high: 1.5,
      urgent: 2.0
    };

    // Apply time adjustment
    const timeMultiplier = timeMultipliers[factors.timeOfDay];
    if (timeMultiplier !== 1.0) {
      const timeAdjustment = service.basePrice * (timeMultiplier - 1);
      adjustments.timeOfDay = timeAdjustment;
      finalPrice += timeAdjustment;
      breakdown.push(`${factors.timeOfDay} surcharge: +$${timeAdjustment.toFixed(2)}`);
    }

    // Apply urgency adjustment
    const urgencyMultiplier = urgencyMultipliers[factors.urgency];
    if (urgencyMultiplier !== 1.0) {
      const urgencyAdjustment = service.basePrice * (urgencyMultiplier - 1);
      adjustments.urgency = urgencyAdjustment;
      finalPrice += urgencyAdjustment;
      breakdown.push(`${factors.urgency} priority: +$${urgencyAdjustment.toFixed(2)}`);
    }

    // Weekend surcharge
    if (factors.dayOfWeek === 'weekend') {
      const weekendAdjustment = service.basePrice * 0.3;
      adjustments.weekend = weekendAdjustment;
      finalPrice += weekendAdjustment;
      breakdown.push(`Weekend surcharge: +$${weekendAdjustment.toFixed(2)}`);
    }

    // Distance charges (for on-site support)
    if (factors.distance && factors.distance > 10) {
      const extraMiles = factors.distance - 10;
      const mileRate = factors.isOutOfTown ? 3.0 : 2.5;
      const distanceCharge = extraMiles * mileRate;
      adjustments.distance = distanceCharge;
      finalPrice += distanceCharge;
      breakdown.push(`Distance (${extraMiles} miles): +$${distanceCharge.toFixed(2)}`);
    }

    // Duration adjustment
    if (factors.estimatedDuration > service.minimumTime) {
      const extraTime = factors.estimatedDuration - service.minimumTime;
      const hourlyRate = service.basePrice / (service.minimumTime / 60);
      const timeCharge = (extraTime / 60) * hourlyRate;
      adjustments.duration = timeCharge;
      finalPrice += timeCharge;
      breakdown.push(`Extended time (${extraTime} min): +$${timeCharge.toFixed(2)}`);
    }

    return {
      basePrice: service.basePrice,
      adjustments,
      finalPrice: Math.round(finalPrice * 100) / 100,
      breakdown
    };
  };

  useEffect(() => {
    if (selectedService) {
      const factors = getCurrentFactors();
      const calculation = calculatePrice(selectedService, factors);
      setPriceCalculation(calculation);
    }
  }, [selectedService, urgency, estimatedDuration, distance, isOutOfTown]);

  const handleServiceSelect = (service: SupportService) => {
    setSelectedService(service);
  };

  const handleBookService = () => {
    if (selectedService) {
      const factors = getCurrentFactors();
      onServiceSelected(selectedService, factors);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Phone Support Services & Pricing
          </CardTitle>
          <CardDescription>
            Professional technical support with dynamic pricing based on complexity, urgency, and timing
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Service Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supportServices.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedService?.id === service.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => handleServiceSelect(service)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Badge className={levelColors[service.supportLevel]}>
                  {service.supportLevel.charAt(0).toUpperCase() + service.supportLevel.slice(1)}
                </Badge>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">${service.basePrice}</div>
                  <div className="text-xs text-gray-500">{service.minimumTime} min min</div>
                </div>
              </div>
              
              <h3 className="font-semibold text-sm mb-1">{service.name}</h3>
              <p className="text-xs text-gray-600 mb-3">{service.description}</p>
              
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-700">Includes:</div>
                {service.includes.slice(0, 2).map((item, index) => (
                  <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {item}
                  </div>
                ))}
                {service.includes.length > 2 && (
                  <div className="text-xs text-gray-500">+{service.includes.length - 2} more</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pricing Configuration */}
      {selectedService && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Configure Your Support Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urgency">Priority Level</Label>
                <Select value={urgency} onValueChange={(value: any) => setUrgency(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Low Priority (Standard)
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        Medium Priority (+20%)
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        High Priority (+50%)
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Urgent (+100%)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                <Input
                  type="number"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                  min={selectedService.minimumTime}
                  step={15}
                />
              </div>

              <div>
                <Label htmlFor="distance">Distance (miles) - For on-site coordination</Label>
                <Input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  min={0}
                  step={1}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="outOfTown"
                  checked={isOutOfTown}
                  onChange={(e) => setIsOutOfTown(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="outOfTown">Out of town service</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Breakdown */}
      {priceCalculation && selectedService && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Price Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {priceCalculation.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.split(':')[0]}:</span>
                  <span className="font-medium">{item.split(':')[1]}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Price:</span>
                  <span className="text-green-600">${priceCalculation.finalPrice}</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleBookService} 
              className="w-full mt-4"
              size="lg"
            >
              <Phone className="w-4 h-4 mr-2" />
              Book {selectedService.name} - ${priceCalculation.finalPrice}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Factors Display */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <div>
                <div className="font-medium">Time</div>
                <div className="text-blue-600">{getCurrentFactors().timeOfDay}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <div>
                <div className="font-medium">Demand</div>
                <div className="text-blue-600">{getCurrentFactors().demandMultiplier > 1 ? 'High' : 'Normal'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-600" />
              <div>
                <div className="font-medium">Traffic</div>
                <div className="text-blue-600">{getCurrentFactors().trafficFactor > 1 ? 'Heavy' : 'Normal'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-600" />
              <div>
                <div className="font-medium">Day</div>
                <div className="text-blue-600">{getCurrentFactors().dayOfWeek}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}