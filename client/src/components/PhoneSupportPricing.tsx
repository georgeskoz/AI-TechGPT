import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Navigation,
  Zap,
  Target,
  Info,
  Users,
  Calendar
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
  const [isRealTimeUpdates, setIsRealTimeUpdates] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [simulateTimeOfDay, setSimulateTimeOfDay] = useState<'morning' | 'midday' | 'afternoon' | 'evening' | 'midnight'>('afternoon');
  const [simulateWeekend, setSimulateWeekend] = useState<boolean>(false);
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [selectedServices, setSelectedServices] = useState<SupportService[]>([]);

  // Real-time clock update
  useEffect(() => {
    if (isRealTimeUpdates) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRealTimeUpdates]);

  // Auto-calculate current factors with simulation options
  const getCurrentFactors = (): PricingFactors => {
    const hour = isRealTimeUpdates ? currentTime.getHours() : getHourFromTimeOfDay(simulateTimeOfDay);
    const day = isRealTimeUpdates ? currentTime.getDay() : (simulateWeekend ? 0 : 1);
    
    let timeOfDay: 'morning' | 'midday' | 'afternoon' | 'evening' | 'midnight';
    if (isRealTimeUpdates) {
      if (hour >= 6 && hour < 12) timeOfDay = 'morning';
      else if (hour >= 12 && hour < 14) timeOfDay = 'midday';
      else if (hour >= 14 && hour < 18) timeOfDay = 'afternoon';
      else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
      else timeOfDay = 'midnight';
    } else {
      timeOfDay = simulateTimeOfDay;
    }

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

  const getHourFromTimeOfDay = (timeOfDay: string): number => {
    switch (timeOfDay) {
      case 'morning': return 9;
      case 'midday': return 13;
      case 'afternoon': return 15;
      case 'evening': return 19;
      case 'midnight': return 23;
      default: return 15;
    }
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
  }, [selectedService, urgency, estimatedDuration, distance, isOutOfTown, currentTime, simulateTimeOfDay, simulateWeekend, isRealTimeUpdates]);

  const handleServiceSelect = (service: SupportService) => {
    setSelectedService(service);
    
    // Auto-adjust duration based on service level
    const recommendedDuration = service.minimumTime + (service.supportLevel === 'expert' ? 30 : 
                                                      service.supportLevel === 'advanced' ? 15 : 0);
    setEstimatedDuration(recommendedDuration);
    
    // Add to comparison if in comparison mode
    if (comparisonMode && !selectedServices.find(s => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const removeFromComparison = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
  };

  const getSavingsPercentage = (originalPrice: number, currentPrice: number): number => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'urgent': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCurrentDemandLevel = (): string => {
    const factors = getCurrentFactors();
    if (factors.demandMultiplier >= 1.3) return 'Very High';
    if (factors.demandMultiplier >= 1.2) return 'High';
    if (factors.demandMultiplier >= 1.1) return 'Medium';
    return 'Low';
  };

  const handleBookService = () => {
    if (selectedService) {
      const factors = getCurrentFactors();
      onServiceSelected(selectedService, factors);
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Real-Time Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Interactive Phone Support Pricing Calculator
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={isRealTimeUpdates}
                  onCheckedChange={setIsRealTimeUpdates}
                />
                <Label className="text-sm">Real-time pricing</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={comparisonMode}
                  onCheckedChange={setComparisonMode}
                />
                <Label className="text-sm">Compare services</Label>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            Professional technical support with dynamic pricing based on complexity, urgency, and timing
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Real-Time Market Conditions */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium">Current Time</div>
                <div className="text-blue-600 font-mono">
                  {isRealTimeUpdates ? currentTime.toLocaleTimeString() : `${simulateTimeOfDay} (simulated)`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium">Demand Level</div>
                <div className="text-green-600 font-semibold">{getCurrentDemandLevel()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Navigation className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="text-sm font-medium">Traffic Factor</div>
                <div className="text-orange-600 font-semibold">
                  {getCurrentFactors().trafficFactor > 1 ? 'Heavy' : 'Normal'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium">Day Type</div>
                <div className="text-purple-600 font-semibold">
                  {getCurrentFactors().dayOfWeek === 'weekend' ? 'Weekend' : 'Weekday'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Simulation Controls */}
      {!isRealTimeUpdates && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Zap className="w-5 h-5" />
              Pricing Simulation Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="simulateTime">Simulate Time of Day</Label>
                <Select value={simulateTimeOfDay} onValueChange={(value: any) => setSimulateTimeOfDay(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (Standard Rate)</SelectItem>
                    <SelectItem value="midday">Midday (+10% Lunch Rush)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (Standard Rate)</SelectItem>
                    <SelectItem value="evening">Evening (+20% Peak Hours)</SelectItem>
                    <SelectItem value="midnight">Midnight (+50% Late Night)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="simulateWeekend"
                  checked={simulateWeekend}
                  onCheckedChange={setSimulateWeekend}
                />
                <Label htmlFor="simulateWeekend">Simulate Weekend (+30% Surcharge)</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Enhanced Pricing Configuration */}
      {selectedService && (
        <Tabs defaultValue="configure" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configure">Configure Session</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
            <TabsTrigger value="optimize">Price Optimizer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configure">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Configure Your Support Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="urgency" className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4" />
                      Priority Level
                    </Label>
                    <Select value={urgency} onValueChange={(value: any) => setUrgency(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Low Priority (Standard Rate)
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
                    <div className="mt-2 text-sm text-gray-600">
                      Current multiplier: <span className={getUrgencyColor(urgency)}>
                        {urgency === 'low' ? '1.0x' : urgency === 'medium' ? '1.2x' : urgency === 'high' ? '1.5x' : '2.0x'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration" className="flex items-center gap-2 mb-2">
                      <Timer className="w-4 h-4" />
                      Estimated Duration: {estimatedDuration} minutes
                    </Label>
                    <Slider
                      value={[estimatedDuration]}
                      onValueChange={(value) => setEstimatedDuration(value[0])}
                      max={180}
                      min={selectedService.minimumTime}
                      step={15}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{selectedService.minimumTime} min</span>
                      <span>180 min</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="distance" className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      Distance: {distance} miles
                    </Label>
                    <Slider
                      value={[distance]}
                      onValueChange={(value) => setDistance(value[0])}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>0 miles</span>
                      <span>100 miles</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="outOfTown"
                      checked={isOutOfTown}
                      onCheckedChange={setIsOutOfTown}
                    />
                    <Label htmlFor="outOfTown" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Out of town service (+$0.50/mile)
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Advanced Pricing Factors
                </CardTitle>
                <CardDescription>
                  Fine-tune your service requirements for accurate pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Time-Based Pricing</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Morning (6AM-12PM):</span>
                          <span className="font-mono">1.0x</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Midday (12PM-2PM):</span>
                          <span className="font-mono">1.1x</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Afternoon (2PM-6PM):</span>
                          <span className="font-mono">1.0x</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Evening (6PM-10PM):</span>
                          <span className="font-mono text-orange-600">1.2x</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Midnight (10PM-6AM):</span>
                          <span className="font-mono text-red-600">1.5x</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Service Level Benefits</h4>
                      <div className="space-y-2 text-sm">
                        {selectedService.includes.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Users className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="font-semibold text-yellow-900">Demand Level</div>
                    <div className="text-2xl font-bold text-yellow-600">{getCurrentDemandLevel()}</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Navigation className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="font-semibold text-orange-900">Traffic Factor</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {getCurrentFactors().trafficFactor}x
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold text-purple-900">Day Type</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {getCurrentFactors().dayOfWeek === 'weekend' ? '+30%' : 'Standard'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimize">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Price Optimizer
                </CardTitle>
                <CardDescription>
                  Find the best time and configuration for your support needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">💡 Money-Saving Tips</h4>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li>• Schedule during morning hours (6AM-12PM) for standard rates</li>
                      <li>• Avoid evening (6PM-10PM) and midnight (10PM-6AM) hours</li>
                      <li>• Book on weekdays to avoid 30% weekend surcharge</li>
                      <li>• Consider lower priority levels if not urgent</li>
                      <li>• Bundle multiple issues into one longer session</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Current Session Cost</h4>
                      <div className="text-3xl font-bold text-blue-600">
                        ${priceCalculation?.finalPrice || selectedService.basePrice}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Optimal Time Cost</h4>
                      <div className="text-3xl font-bold text-gray-600">
                        ${selectedService.basePrice}
                      </div>
                      <div className="text-sm text-gray-500">
                        {priceCalculation && priceCalculation.finalPrice > selectedService.basePrice && (
                          <span className="text-green-600">
                            Save ${(priceCalculation.finalPrice - selectedService.basePrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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