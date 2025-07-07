export interface PricingFactors {
  supportLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  timeOfDay: 'morning' | 'midday' | 'afternoon' | 'evening' | 'midnight';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number; // in minutes
  distance?: number; // in miles for on-site support
  isOutOfTown: boolean;
  trafficFactor: number; // 1.0 = normal, 1.5 = heavy traffic
  demandMultiplier: number; // 1.0 = normal, 2.0 = high demand
  dayOfWeek: 'weekday' | 'weekend';
}

export interface SupportService {
  id: string;
  name: string;
  description: string;
  supportLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  basePrice: number;
  minimumTime: number;
  category: string;
  includes: string[];
}

// Base pricing structure for different support levels
export const supportServices: SupportService[] = [
  // Basic Support Level
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

  // Intermediate Support Level  
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

  // Advanced Support Level
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

  // Expert Support Level
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

// Time-based pricing multipliers
export const timeMultipliers = {
  morning: 1.0,    // 6 AM - 12 PM
  midday: 1.1,     // 12 PM - 2 PM (lunch rush)
  afternoon: 1.0,  // 2 PM - 6 PM
  evening: 1.2,    // 6 PM - 10 PM
  midnight: 1.5    // 10 PM - 6 AM
};

// Urgency multipliers
export const urgencyMultipliers = {
  low: 1.0,
  medium: 1.2,
  high: 1.5,
  urgent: 2.0
};

// Weekend surcharge
export const weekendMultiplier = 1.3;

// Distance pricing for on-site support (per mile)
export const distancePricing = {
  baseMileage: 10, // free miles included
  pricePerMile: 2.5,
  outOfTownSurcharge: 0.5 // additional per mile for out of town
};

export function calculateDynamicPrice(
  service: SupportService,
  factors: PricingFactors
): {
  basePrice: number;
  adjustments: { [key: string]: number };
  finalPrice: number;
  breakdown: string[];
} {
  const adjustments: { [key: string]: number } = {};
  const breakdown: string[] = [];
  
  let finalPrice = service.basePrice;
  breakdown.push(`Base price: $${service.basePrice}`);

  // Time of day adjustment
  const timeMultiplier = timeMultipliers[factors.timeOfDay];
  if (timeMultiplier !== 1.0) {
    const timeAdjustment = service.basePrice * (timeMultiplier - 1);
    adjustments.timeOfDay = timeAdjustment;
    finalPrice += timeAdjustment;
    breakdown.push(`${factors.timeOfDay} surcharge (${Math.round((timeMultiplier - 1) * 100)}%): +$${timeAdjustment.toFixed(2)}`);
  }

  // Urgency adjustment
  const urgencyMultiplier = urgencyMultipliers[factors.urgency];
  if (urgencyMultiplier !== 1.0) {
    const urgencyAdjustment = service.basePrice * (urgencyMultiplier - 1);
    adjustments.urgency = urgencyAdjustment;
    finalPrice += urgencyAdjustment;
    breakdown.push(`${factors.urgency} priority (${Math.round((urgencyMultiplier - 1) * 100)}%): +$${urgencyAdjustment.toFixed(2)}`);
  }

  // Weekend adjustment
  if (factors.dayOfWeek === 'weekend') {
    const weekendAdjustment = service.basePrice * (weekendMultiplier - 1);
    adjustments.weekend = weekendAdjustment;
    finalPrice += weekendAdjustment;
    breakdown.push(`Weekend surcharge (${Math.round((weekendMultiplier - 1) * 100)}%): +$${weekendAdjustment.toFixed(2)}`);
  }

  // Demand adjustment
  if (factors.demandMultiplier !== 1.0) {
    const demandAdjustment = service.basePrice * (factors.demandMultiplier - 1);
    adjustments.demand = demandAdjustment;
    finalPrice += demandAdjustment;
    breakdown.push(`High demand surcharge (${Math.round((factors.demandMultiplier - 1) * 100)}%): +$${demandAdjustment.toFixed(2)}`);
  }

  // Traffic adjustment (for on-site support)
  if (factors.trafficFactor !== 1.0 && factors.distance && factors.distance > 0) {
    const trafficAdjustment = service.basePrice * (factors.trafficFactor - 1) * 0.1; // 10% of price per traffic factor
    adjustments.traffic = trafficAdjustment;
    finalPrice += trafficAdjustment;
    breakdown.push(`Traffic delay adjustment: +$${trafficAdjustment.toFixed(2)}`);
  }

  // Distance pricing (for on-site support)
  if (factors.distance && factors.distance > 0) {
    const extraMiles = Math.max(0, factors.distance - distancePricing.baseMileage);
    let distanceCharge = extraMiles * distancePricing.pricePerMile;
    
    if (factors.isOutOfTown) {
      distanceCharge += extraMiles * distancePricing.outOfTownSurcharge;
      breakdown.push(`Distance charge (${extraMiles} miles + out-of-town): +$${distanceCharge.toFixed(2)}`);
    } else {
      breakdown.push(`Distance charge (${extraMiles} miles): +$${distanceCharge.toFixed(2)}`);
    }
    
    adjustments.distance = distanceCharge;
    finalPrice += distanceCharge;
  }

  // Duration adjustment (if longer than minimum)
  if (factors.estimatedDuration > service.minimumTime) {
    const extraTime = factors.estimatedDuration - service.minimumTime;
    const hourlyRate = service.basePrice / (service.minimumTime / 60);
    const timeCharge = (extraTime / 60) * hourlyRate;
    adjustments.duration = timeCharge;
    finalPrice += timeCharge;
    breakdown.push(`Extended duration (${extraTime} extra minutes): +$${timeCharge.toFixed(2)}`);
  }

  return {
    basePrice: service.basePrice,
    adjustments,
    finalPrice: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
    breakdown
  };
}

export function getSuggestedServices(
  issueType: string,
  complexity: 'low' | 'medium' | 'high' | 'critical'
): SupportService[] {
  const complexityToLevel = {
    low: 'basic',
    medium: 'intermediate', 
    high: 'advanced',
    critical: 'expert'
  };

  const recommendedLevel = complexityToLevel[complexity];
  
  // Return services at or above the recommended level
  return supportServices.filter(service => {
    const levelOrder = ['basic', 'intermediate', 'advanced', 'expert'];
    const serviceLevel = levelOrder.indexOf(service.supportLevel);
    const recommendedIndex = levelOrder.indexOf(recommendedLevel);
    return serviceLevel >= recommendedIndex;
  });
}

export function getCurrentDemandMultiplier(): number {
  // Simulate demand based on current time
  const hour = new Date().getHours();
  
  // Higher demand during business hours
  if (hour >= 9 && hour <= 17) {
    return 1.2; // 20% increase during business hours
  }
  
  // Evening peak
  if (hour >= 18 && hour <= 21) {
    return 1.3; // 30% increase during evening
  }
  
  // Normal demand other times
  return 1.0;
}

export function getTimeOfDay(): 'morning' | 'midday' | 'afternoon' | 'evening' | 'midnight' {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'midday';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'midnight';
}

export function getDayOfWeek(): 'weekday' | 'weekend' {
  const day = new Date().getDay();
  return day === 0 || day === 6 ? 'weekend' : 'weekday';
}