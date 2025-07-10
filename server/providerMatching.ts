import OpenAI from "openai";
import type { JobDispatchRequest, Technician, InsertJobDispatchRequest, InsertProviderResponseAnalytics, InsertProviderRecommendation } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ProviderMatchingFactors {
  proximityScore: number;
  workloadScore: number;
  expertiseScore: number;
  ratingScore: number;
  availabilityScore: number;
}

interface RecommendedProvider {
  technicianId: number;
  score: number;
  factors: ProviderMatchingFactors;
  distance: number;
  eta: number;
  currentJobs: number;
  technician: Technician;
}

interface JobRequest {
  customerId: number;
  ticketId: number;
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
}

export class AIProviderMatchingService {
  private readonly factorWeights = {
    proximity: 0.35, // Highest weight for location
    workload: 0.25,  // Second highest for availability
    expertise: 0.20, // Important for quality
    rating: 0.15,    // Customer satisfaction
    availability: 0.05 // Basic availability check
  };

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Estimate travel time with traffic using AI
   */
  private async estimateETAWithTraffic(distance: number, timeOfDay: string): Promise<number> {
    try {
      const prompt = `Based on the following data, estimate travel time in minutes:
- Distance: ${distance} miles
- Time of day: ${timeOfDay}
- Assume city driving with typical traffic patterns
- Account for traffic variations (morning rush, lunch, evening rush, late night)

Respond with just the estimated minutes as a number.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
        temperature: 0.3,
      });

      const etaText = response.choices[0]?.message?.content?.trim();
      const eta = parseInt(etaText || '0', 10);
      
      // Fallback calculation if AI fails
      if (isNaN(eta) || eta <= 0) {
        const baseTime = distance * 2.5; // ~24 mph average city speed
        const trafficMultiplier = this.getTrafficMultiplier(timeOfDay);
        return Math.round(baseTime * trafficMultiplier);
      }
      
      return eta;
    } catch (error) {
      console.error('Error estimating ETA with AI:', error);
      // Fallback calculation
      const baseTime = distance * 2.5; // ~24 mph average city speed
      const trafficMultiplier = this.getTrafficMultiplier(timeOfDay);
      return Math.round(baseTime * trafficMultiplier);
    }
  }

  /**
   * Get traffic multiplier based on time of day
   */
  private getTrafficMultiplier(timeOfDay: string): number {
    const multipliers = {
      'morning': 1.4,    // Rush hour
      'midday': 1.0,     // Light traffic
      'afternoon': 1.2,  // Moderate traffic
      'evening': 1.5,    // Heavy rush hour
      'midnight': 0.8    // Very light traffic
    };
    return multipliers[timeOfDay as keyof typeof multipliers] || 1.0;
  }

  /**
   * Estimate job cost using AI
   */
  private async estimateJobCost(category: string, description: string, urgency: string, distance: number): Promise<number> {
    try {
      const prompt = `Estimate the cost for this technical service job:
Category: ${category}
Description: ${description}
Urgency: ${urgency}
Distance: ${distance} miles

Consider:
- Base hourly rates: Basic ($35-60), Intermediate ($55-75), Advanced ($95-125), Expert ($150-200)
- Urgency multiplier: low (1.0x), medium (1.1x), high (1.3x), urgent (1.5x)
- Travel costs for onsite work
- Complexity of the described issue

Respond with just the estimated cost as a number (without $ symbol).`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
        temperature: 0.3,
      });

      const costText = response.choices[0]?.message?.content?.trim();
      const cost = parseFloat(costText || '0');
      
      // Fallback calculation if AI fails
      if (isNaN(cost) || cost <= 0) {
        const baseCost = this.getBaseCostByCategory(category);
        const urgencyMultiplier = this.getUrgencyMultiplier(urgency);
        const travelCost = distance * 2; // $2 per mile
        return Math.round((baseCost + travelCost) * urgencyMultiplier);
      }
      
      return Math.round(cost);
    } catch (error) {
      console.error('Error estimating cost with AI:', error);
      // Fallback calculation
      const baseCost = this.getBaseCostByCategory(category);
      const urgencyMultiplier = this.getUrgencyMultiplier(urgency);
      const travelCost = distance * 2; // $2 per mile
      return Math.round((baseCost + travelCost) * urgencyMultiplier);
    }
  }

  private getBaseCostByCategory(category: string): number {
    const baseCosts = {
      'hardware': 75,
      'network': 85,
      'software': 65,
      'security': 95,
      'system': 80,
      'mobile': 60,
      'web': 70,
      'database': 90,
      'general': 65
    };
    
    const key = category.toLowerCase();
    return baseCosts[key as keyof typeof baseCosts] || 70;
  }

  private getUrgencyMultiplier(urgency: string): number {
    const multipliers = {
      'low': 1.0,
      'medium': 1.1,
      'high': 1.3,
      'urgent': 1.5
    };
    return multipliers[urgency as keyof typeof multipliers] || 1.0;
  }

  /**
   * Calculate provider matching scores
   */
  private calculateProviderScore(
    technician: Technician,
    jobRequest: JobRequest,
    distance: number,
    currentJobs: number
  ): { score: number; factors: ProviderMatchingFactors } {
    // Proximity Score (0-100) - higher is better, closer distance
    const proximityScore = Math.max(0, 100 - (distance * 2)); // Penalty of 2 points per mile
    
    // Workload Score (0-100) - lower current jobs is better
    const maxJobs = 5; // Assume max 5 concurrent jobs
    const workloadScore = Math.max(0, 100 - ((currentJobs / maxJobs) * 100));
    
    // Expertise Score (0-100) - match skills with job category
    const technicianSkills = technician.skills || [];
    const jobCategory = jobRequest.category.toLowerCase();
    const relevantSkills = technicianSkills.filter(skill => 
      skill.toLowerCase().includes(jobCategory) || 
      jobCategory.includes(skill.toLowerCase())
    );
    const expertiseScore = Math.min(100, (relevantSkills.length / Math.max(1, technicianSkills.length)) * 100 + 20);
    
    // Rating Score (0-100) - convert 5-star rating to 100-point scale
    const rating = parseFloat(technician.rating?.toString() || '5.0');
    const ratingScore = (rating / 5.0) * 100;
    
    // Availability Score (0-100) - check current availability
    const now = new Date();
    const dayOfWeek = now.toLocaleLowerCase().substring(0, 3) + 'day'; // monday, tuesday, etc.
    const availability = technician.availability as any;
    const todayAvail = availability?.[dayOfWeek];
    const availabilityScore = (todayAvail?.available && technician.isActive) ? 100 : 0;
    
    const factors: ProviderMatchingFactors = {
      proximityScore,
      workloadScore,
      expertiseScore,
      ratingScore,
      availabilityScore
    };
    
    // Calculate weighted score
    const score = 
      (proximityScore * this.factorWeights.proximity) +
      (workloadScore * this.factorWeights.workload) +
      (expertiseScore * this.factorWeights.expertise) +
      (ratingScore * this.factorWeights.rating) +
      (availabilityScore * this.factorWeights.availability);
    
    return { score: Math.round(score), factors };
  }

  /**
   * Find and rank optimal providers for a job
   */
  async findOptimalProviders(
    jobRequest: JobRequest,
    availableTechnicians: Technician[],
    maxProviders: number = 5
  ): Promise<RecommendedProvider[]> {
    const timeOfDay = this.getTimeOfDay();
    const recommendations: RecommendedProvider[] = [];
    
    for (const technician of availableTechnicians) {
      // Skip if technician is not active or verified
      if (!technician.isActive || !technician.isVerified) {
        continue;
      }
      
      // Calculate distance (mock coordinates if not available)
      const techLat = 45.4215 + (Math.random() - 0.5) * 0.5; // Ottawa area mock
      const techLon = -75.6972 + (Math.random() - 0.5) * 0.5;
      
      const distance = this.calculateDistance(
        jobRequest.customerLocation.latitude,
        jobRequest.customerLocation.longitude,
        techLat,
        techLon
      );
      
      // Skip if too far (beyond service radius)
      const serviceRadius = technician.serviceRadius || 25;
      if (distance > serviceRadius) {
        continue;
      }
      
      // Mock current jobs (in real app, get from database)
      const currentJobs = Math.floor(Math.random() * 3);
      
      // Calculate scores
      const { score, factors } = this.calculateProviderScore(
        technician,
        jobRequest,
        distance,
        currentJobs
      );
      
      // Estimate ETA
      const eta = await this.estimateETAWithTraffic(distance, timeOfDay);
      
      recommendations.push({
        technicianId: technician.id!,
        score,
        factors,
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal
        eta,
        currentJobs,
        technician
      });
    }
    
    // Sort by score (highest first) and return top providers
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, maxProviders);
  }

  /**
   * Create dispatch request with AI estimates
   */
  async createDispatchRequest(
    jobRequest: JobRequest,
    selectedTechnician: Technician
  ): Promise<InsertJobDispatchRequest> {
    const timeOfDay = this.getTimeOfDay();
    
    // Calculate distance and ETA
    const techLat = 45.4215 + (Math.random() - 0.5) * 0.5; // Mock coordinates
    const techLon = -75.6972 + (Math.random() - 0.5) * 0.5;
    
    const distance = this.calculateDistance(
      jobRequest.customerLocation.latitude,
      jobRequest.customerLocation.longitude,
      techLat,
      techLon
    );
    
    const eta = await this.estimateETAWithTraffic(distance, timeOfDay);
    const estimatedCost = await this.estimateJobCost(
      jobRequest.category,
      jobRequest.description,
      jobRequest.urgency,
      distance
    );
    
    // Estimate job duration
    const estimatedDuration = await this.estimateJobDuration(
      jobRequest.category,
      jobRequest.description,
      jobRequest.urgency
    );
    
    // Create dispatch request
    const dispatchRequest: InsertJobDispatchRequest = {
      ticketId: jobRequest.ticketId,
      customerId: jobRequest.customerId,
      technicianId: selectedTechnician.id!,
      serviceType: jobRequest.serviceType,
      category: jobRequest.category,
      description: jobRequest.description,
      urgency: jobRequest.urgency,
      customerLocation: jobRequest.customerLocation,
      technicianLocation: {
        latitude: techLat,
        longitude: techLon
      },
      estimatedCost: estimatedCost.toString(),
      estimatedDuration,
      estimatedDistance: distance.toString(),
      estimatedETA: eta,
      trafficFactor: this.getTrafficMultiplier(timeOfDay).toString(),
      responseDeadline: new Date(Date.now() + 60000) // 60 seconds from now
    };
    
    return dispatchRequest;
  }

  private async estimateJobDuration(category: string, description: string, urgency: string): Promise<number> {
    try {
      const prompt = `Estimate the duration in minutes for this technical service job:
Category: ${category}
Description: ${description}
Urgency: ${urgency}

Consider typical time for diagnosis, repair, testing, and documentation.
Respond with just the estimated minutes as a number.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
        temperature: 0.3,
      });

      const durationText = response.choices[0]?.message?.content?.trim();
      const duration = parseInt(durationText || '0', 10);
      
      if (isNaN(duration) || duration <= 0) {
        return this.getBaseDurationByCategory(category);
      }
      
      return duration;
    } catch (error) {
      console.error('Error estimating duration with AI:', error);
      return this.getBaseDurationByCategory(category);
    }
  }

  private getBaseDurationByCategory(category: string): number {
    const baseDurations = {
      'hardware': 90,
      'network': 120,
      'software': 60,
      'security': 150,
      'system': 105,
      'mobile': 45,
      'web': 75,
      'database': 135,
      'general': 75
    };
    
    const key = category.toLowerCase();
    return baseDurations[key as keyof typeof baseDurations] || 90;
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 14) return 'midday';
    if (hour >= 14 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'midnight';
  }

  /**
   * Log provider response for analytics
   */
  async logProviderResponse(
    dispatchRequestId: number,
    technicianId: number,
    responseAction: 'accepted' | 'rejected' | 'timeout',
    responseTimeSeconds: number,
    deviceInfo?: { deviceType?: string; userAgent?: string }
  ): Promise<InsertProviderResponseAnalytics> {
    const now = new Date();
    const timeOfDay = this.getTimeOfDay();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const analytics: InsertProviderResponseAnalytics = {
      dispatchRequestId,
      technicianId,
      responseAction,
      responseTimeSeconds,
      deviceType: deviceInfo?.deviceType || 'unknown',
      userAgent: deviceInfo?.userAgent || '',
      technicianCurrentWorkload: Math.floor(Math.random() * 5), // Mock current workload
      technicianAvailabilityStatus: 'available',
      timeOfDay,
      dayOfWeek,
      technicianDistance: (Math.random() * 20 + 1).toString(), // Mock distance
      estimatedTravelTime: Math.floor(Math.random() * 45 + 10) // Mock travel time
    };
    
    return analytics;
  }
}

export const providerMatchingService = new AIProviderMatchingService();