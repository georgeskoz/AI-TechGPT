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
  Calculator, 
  Clock, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Star,
  DollarSign,
  Timer,
  Navigation,
  Zap,
  Target,
  Users,
  Calendar,
  Wrench,
  Monitor,
  Smartphone,
  Wifi,
  Database,
  Shield,
  Settings
} from 'lucide-react';

interface ServiceCategory {
  category: string;
  subcategory: string;
  basePrice: number;
  minimumTime: number;
  complexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  includes: string[];
}

interface PricingFactors {
  complexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  timeOfDay: 'morning' | 'midday' | 'afternoon' | 'evening' | 'midnight';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number;
  distance?: number;
  isOutOfTown: boolean;
  trafficFactor: number;
  demandMultiplier: number;
  dayOfWeek: 'weekday' | 'weekend';
  serviceType: 'remote' | 'phone' | 'onsite' | 'consultation';
}

interface PriceCalculation {
  basePrice: number;
  adjustments: { [key: string]: number };
  finalPrice: number;
  breakdown: string[];
}

interface UniversalPricingCalculatorProps {
  selectedCategory: string;
  selectedSubcategory: string;
  onServiceBooked: (category: string, subcategory: string, factors: PricingFactors, price: number) => void;
}

// Universal service pricing based on category and complexity
const getServicePricing = (category: string, subcategory: string): ServiceCategory => {
  const servicePricing: { [key: string]: { [key: string]: Partial<ServiceCategory> } } = {
    'Web Development': {
      'Frontend Issues': { basePrice: 45, complexity: 'intermediate', minimumTime: 30 },
      'Backend Problems': { basePrice: 65, complexity: 'advanced', minimumTime: 45 },
      'Full Stack': { basePrice: 85, complexity: 'expert', minimumTime: 60 },
      'Performance Optimization': { basePrice: 75, complexity: 'advanced', minimumTime: 60 },
      'Database Integration': { basePrice: 70, complexity: 'advanced', minimumTime: 45 },
      'API Development': { basePrice: 60, complexity: 'intermediate', minimumTime: 45 },
      'Deployment Issues': { basePrice: 50, complexity: 'intermediate', minimumTime: 30 }
    },
    'Hardware Issues': {
      'Computer Problems': { basePrice: 35, complexity: 'basic', minimumTime: 30 },
      'Laptop Repair': { basePrice: 45, complexity: 'intermediate', minimumTime: 45 },
      'Component Installation': { basePrice: 55, complexity: 'intermediate', minimumTime: 60 },
      'Performance Issues': { basePrice: 40, complexity: 'basic', minimumTime: 30 },
      'Hardware Diagnostics': { basePrice: 50, complexity: 'intermediate', minimumTime: 45 },
      'Upgrade Assistance': { basePrice: 60, complexity: 'intermediate', minimumTime: 60 },
      'Compatibility Issues': { basePrice: 45, complexity: 'intermediate', minimumTime: 30 }
    },
    'Network Troubleshooting': {
      'WiFi Problems': { basePrice: 30, complexity: 'basic', minimumTime: 20 },
      'Internet Connectivity': { basePrice: 35, complexity: 'basic', minimumTime: 30 },
      'Router Configuration': { basePrice: 50, complexity: 'intermediate', minimumTime: 45 },
      'Network Security': { basePrice: 70, complexity: 'advanced', minimumTime: 60 },
      'VPN Setup': { basePrice: 45, complexity: 'intermediate', minimumTime: 30 },
      'Speed Optimization': { basePrice: 55, complexity: 'intermediate', minimumTime: 45 },
      'Enterprise Network': { basePrice: 95, complexity: 'expert', minimumTime: 90 }
    },
    'Database Help': {
      'Query Optimization': { basePrice: 60, complexity: 'advanced', minimumTime: 45 },
      'Database Design': { basePrice: 80, complexity: 'expert', minimumTime: 60 },
      'Data Migration': { basePrice: 90, complexity: 'expert', minimumTime: 90 },
      'Performance Tuning': { basePrice: 75, complexity: 'advanced', minimumTime: 60 },
      'Backup Solutions': { basePrice: 55, complexity: 'intermediate', minimumTime: 45 },
      'Security Implementation': { basePrice: 85, complexity: 'expert', minimumTime: 75 },
      'Troubleshooting': { basePrice: 50, complexity: 'intermediate', minimumTime: 30 }
    },
    'Mobile Devices': {
      'Smartphone Issues': { basePrice: 25, complexity: 'basic', minimumTime: 20 },
      'App Problems': { basePrice: 30, complexity: 'basic', minimumTime: 25 },
      'Device Setup': { basePrice: 35, complexity: 'basic', minimumTime: 30 },
      'Data Recovery': { basePrice: 65, complexity: 'advanced', minimumTime: 60 },
      'Security Setup': { basePrice: 40, complexity: 'intermediate', minimumTime: 30 },
      'Performance Optimization': { basePrice: 35, complexity: 'basic', minimumTime: 30 },
      'Tablet Support': { basePrice: 30, complexity: 'basic', minimumTime: 25 }
    },
    'Security Questions': {
      'Virus Removal': { basePrice: 45, complexity: 'intermediate', minimumTime: 45 },
      'Malware Protection': { basePrice: 50, complexity: 'intermediate', minimumTime: 30 },
      'Data Protection': { basePrice: 65, complexity: 'advanced', minimumTime: 60 },
      'Privacy Settings': { basePrice: 35, complexity: 'basic', minimumTime: 30 },
      'Security Audits': { basePrice: 85, complexity: 'expert', minimumTime: 90 },
      'Firewall Configuration': { basePrice: 60, complexity: 'advanced', minimumTime: 45 },
      'Identity Protection': { basePrice: 55, complexity: 'intermediate', minimumTime: 45 }
    },
    'System Administration': {
      'Server Management': { basePrice: 95, complexity: 'expert', minimumTime: 60 },
      'User Account Management': { basePrice: 40, complexity: 'intermediate', minimumTime: 30 },
      'System Updates': { basePrice: 35, complexity: 'basic', minimumTime: 30 },
      'Backup Solutions': { basePrice: 55, complexity: 'intermediate', minimumTime: 45 },
      'Performance Monitoring': { basePrice: 65, complexity: 'advanced', minimumTime: 60 },
      'Security Policies': { basePrice: 75, complexity: 'advanced', minimumTime: 75 },
      'Automation Scripts': { basePrice: 85, complexity: 'expert', minimumTime: 90 }
    },
    'Software Issues': {
      'Installation Problems': { basePrice: 25, complexity: 'basic', minimumTime: 20 },
      'Software Conflicts': { basePrice: 40, complexity: 'intermediate', minimumTime: 30 },
      'License Management': { basePrice: 35, complexity: 'basic', minimumTime: 25 },
      'Update Issues': { basePrice: 30, complexity: 'basic', minimumTime: 25 },
      'Custom Software': { basePrice: 75, complexity: 'advanced', minimumTime: 60 },
      'Integration Problems': { basePrice: 65, complexity: 'advanced', minimumTime: 45 },
      'Configuration Issues': { basePrice: 45, complexity: 'intermediate', minimumTime: 30 }
    }
  };

  const categoryData = servicePricing[category]?.[subcategory];
  
  return {
    category,
    subcategory,
    basePrice: categoryData?.basePrice || 50,
    minimumTime: categoryData?.minimumTime || 30,
    complexity: categoryData?.complexity || 'intermediate',
    description: `Professional ${subcategory.toLowerCase()} support for ${category.toLowerCase()}`,
    includes: [
      'Expert consultation',
      'Step-by-step guidance',
      'Problem resolution',
      'Follow-up support'
    ]
  };
};

export default function UniversalPricingCalculator({ 
  selectedCategory, 
  selectedSubcategory, 
  onServiceBooked 
}: UniversalPricingCalculatorProps) {
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [estimatedDuration, setEstimatedDuration] = useState<number>(30);
  const [distance, setDistance] = useState<number>(0);
  const [isOutOfTown, setIsOutOfTown] = useState<boolean>(false);
  const [serviceType, setServiceType] = useState<'remote' | 'phone' | 'onsite' | 'consultation'>('remote');
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null);
  const [isRealTimeUpdates, setIsRealTimeUpdates] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [simulateTimeOfDay, setSimulateTimeOfDay] = useState<'morning' | 'midday' | 'afternoon' | 'evening' | 'midnight'>('afternoon');
  const [simulateWeekend, setSimulateWeekend] = useState<boolean>(false);

  const serviceData = getServicePricing(selectedCategory, selectedSubcategory);

  // Real-time clock update
  useEffect(() => {
    if (isRealTimeUpdates) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRealTimeUpdates]);

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
      complexity: serviceData.complexity,
      timeOfDay,
      urgency,
      estimatedDuration,
      distance: distance > 0 ? distance : undefined,
      isOutOfTown,
      trafficFactor,
      demandMultiplier,
      dayOfWeek: day === 0 || day === 6 ? 'weekend' : 'weekday',
      serviceType
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

  const calculatePrice = (factors: PricingFactors): PriceCalculation => {
    const breakdown: string[] = [];
    let finalPrice = serviceData.basePrice;
    const adjustments: { [key: string]: number } = {};

    breakdown.push(`Base price: $${serviceData.basePrice}`);

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

    const serviceTypeMultipliers = {
      remote: 1.0,
      phone: 1.1,
      onsite: 1.5,
      consultation: 1.2
    };

    // Apply time adjustment
    const timeMultiplier = timeMultipliers[factors.timeOfDay];
    if (timeMultiplier !== 1.0) {
      const timeAdjustment = serviceData.basePrice * (timeMultiplier - 1);
      adjustments.timeOfDay = timeAdjustment;
      finalPrice += timeAdjustment;
      breakdown.push(`${factors.timeOfDay} surcharge: +$${timeAdjustment.toFixed(2)}`);
    }

    // Apply urgency adjustment
    const urgencyMultiplier = urgencyMultipliers[factors.urgency];
    if (urgencyMultiplier !== 1.0) {
      const urgencyAdjustment = serviceData.basePrice * (urgencyMultiplier - 1);
      adjustments.urgency = urgencyAdjustment;
      finalPrice += urgencyAdjustment;
      breakdown.push(`${factors.urgency} priority: +$${urgencyAdjustment.toFixed(2)}`);
    }

    // Apply service type adjustment
    const serviceMultiplier = serviceTypeMultipliers[factors.serviceType];
    if (serviceMultiplier !== 1.0) {
      const serviceAdjustment = serviceData.basePrice * (serviceMultiplier - 1);
      adjustments.serviceType = serviceAdjustment;
      finalPrice += serviceAdjustment;
      breakdown.push(`${factors.serviceType} service: +$${serviceAdjustment.toFixed(2)}`);
    }

    // Weekend surcharge
    if (factors.dayOfWeek === 'weekend') {
      const weekendAdjustment = serviceData.basePrice * 0.3;
      adjustments.weekend = weekendAdjustment;
      finalPrice += weekendAdjustment;
      breakdown.push(`Weekend surcharge: +$${weekendAdjustment.toFixed(2)}`);
    }

    // Distance charges (for on-site services)
    if (factors.distance && factors.distance > 10 && factors.serviceType === 'onsite') {
      const extraMiles = factors.distance - 10;
      const mileRate = factors.isOutOfTown ? 3.0 : 2.5;
      const distanceCharge = extraMiles * mileRate;
      adjustments.distance = distanceCharge;
      finalPrice += distanceCharge;
      breakdown.push(`Distance (${extraMiles} miles): +$${distanceCharge.toFixed(2)}`);
    }

    // Duration adjustment
    if (factors.estimatedDuration > serviceData.minimumTime) {
      const extraTime = factors.estimatedDuration - serviceData.minimumTime;
      const hourlyRate = serviceData.basePrice / (serviceData.minimumTime / 60);
      const timeCharge = (extraTime / 60) * hourlyRate;
      adjustments.duration = timeCharge;
      finalPrice += timeCharge;
      breakdown.push(`Extended time (${extraTime} min): +$${timeCharge.toFixed(2)}`);
    }

    return {
      basePrice: serviceData.basePrice,
      adjustments,
      finalPrice: Math.round(finalPrice * 100) / 100,
      breakdown
    };
  };

  useEffect(() => {
    const factors = getCurrentFactors();
    const calculation = calculatePrice(factors);
    setPriceCalculation(calculation);
    setEstimatedDuration(serviceData.minimumTime);
  }, [urgency, estimatedDuration, distance, isOutOfTown, serviceType, currentTime, simulateTimeOfDay, simulateWeekend, isRealTimeUpdates, selectedCategory, selectedSubcategory]);

  const handleBookService = () => {
    if (priceCalculation) {
      const factors = getCurrentFactors();
      onServiceBooked(selectedCategory, selectedSubcategory, factors, priceCalculation.finalPrice);
    }
  };

  const getComplexityColor = (complexity: string): string => {
    switch (complexity) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentDemandLevel = (): string => {
    const factors = getCurrentFactors();
    if (factors.demandMultiplier >= 1.3) return 'Very High';
    if (factors.demandMultiplier >= 1.2) return 'High';
    if (factors.demandMultiplier >= 1.1) return 'Medium';
    return 'Low';
  };

  if (!selectedCategory || !selectedSubcategory) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="p-8 text-center">
          <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Service Category</h3>
          <p className="text-gray-500">Choose a category and subcategory to see pricing options</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Service Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              {selectedCategory}: {selectedSubcategory}
            </div>
            <Badge className={getComplexityColor(serviceData.complexity)}>
              {serviceData.complexity.charAt(0).toUpperCase() + serviceData.complexity.slice(1)}
            </Badge>
          </CardTitle>
          <CardDescription>{serviceData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="font-semibold">Base Price</div>
              <div className="text-lg text-green-600">${serviceData.basePrice}</div>
            </div>
            <div className="text-center">
              <Timer className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="font-semibold">Min Duration</div>
              <div className="text-lg text-blue-600">{serviceData.minimumTime} min</div>
            </div>
            <div className="text-center">
              <Star className="w-6 h-6 text-orange-600 mx-auto mb-1" />
              <div className="font-semibold">Complexity</div>
              <div className="text-lg text-orange-600 capitalize">{serviceData.complexity}</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="font-semibold">Current Price</div>
              <div className="text-lg font-bold text-purple-600">
                ${priceCalculation?.finalPrice || serviceData.basePrice}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Pricing Controls */}
      <Tabs defaultValue="configure" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configure">Configure Service</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          <TabsTrigger value="optimize">Price Optimizer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configure">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Service Configuration
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isRealTimeUpdates}
                    onCheckedChange={setIsRealTimeUpdates}
                  />
                  <Label className="text-sm">Real-time pricing</Label>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Wrench className="w-4 h-4" />
                    Service Type
                  </Label>
                  <Select value={serviceType} onValueChange={(value: any) => setServiceType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote Support (Standard)</SelectItem>
                      <SelectItem value="phone">Phone Support (+10%)</SelectItem>
                      <SelectItem value="onsite">On-site Support (+50%)</SelectItem>
                      <SelectItem value="consultation">Consultation (+20%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4" />
                    Priority Level
                  </Label>
                  <Select value={urgency} onValueChange={(value: any) => setUrgency(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority (Standard)</SelectItem>
                      <SelectItem value="medium">Medium Priority (+20%)</SelectItem>
                      <SelectItem value="high">High Priority (+50%)</SelectItem>
                      <SelectItem value="urgent">Urgent (+100%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Timer className="w-4 h-4" />
                    Duration: {estimatedDuration} minutes
                  </Label>
                  <Slider
                    value={[estimatedDuration]}
                    onValueChange={(value) => setEstimatedDuration(value[0])}
                    max={180}
                    min={serviceData.minimumTime}
                    step={15}
                    className="w-full"
                  />
                </div>

                {serviceType === 'onsite' && (
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
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
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Pricing Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">Current Time</div>
                  <div className="text-sm text-blue-600">
                    {isRealTimeUpdates ? currentTime.toLocaleTimeString() : simulateTimeOfDay}
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold">Demand Level</div>
                  <div className="text-sm text-green-600">{getCurrentDemandLevel()}</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold">Day Type</div>
                  <div className="text-sm text-purple-600">
                    {getCurrentFactors().dayOfWeek === 'weekend' ? 'Weekend' : 'Weekday'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimize">
          <Card>
            <CardHeader>
              <CardTitle>Price Optimizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Money-Saving Tips</h4>
                  <ul className="space-y-1 text-sm text-green-800">
                    <li>• Schedule during morning hours for standard rates</li>
                    <li>• Choose remote support when possible</li>
                    <li>• Book on weekdays to avoid weekend surcharge</li>
                    <li>• Consider lower priority if not urgent</li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <h4 className="font-semibold text-blue-900">Current Cost</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      ${priceCalculation?.finalPrice || serviceData.basePrice}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <h4 className="font-semibold text-gray-900">Base Cost</h4>
                    <div className="text-2xl font-bold text-gray-600">${serviceData.basePrice}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Price Breakdown & Booking */}
      {priceCalculation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Price Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {priceCalculation.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.split(':')[0]}:</span>
                  <span className="font-medium">{item.split(':')[1]}</span>
                </div>
              ))}
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Price:</span>
                  <span className="text-green-600">${priceCalculation.finalPrice}</span>
                </div>
              </div>
            </div>
            
            <Button onClick={handleBookService} className="w-full" size="lg">
              Book {selectedSubcategory} Service - ${priceCalculation.finalPrice}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}