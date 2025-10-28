import { apiRequest } from '@/lib/queryClient';

export interface FeatureDiscoveryRequest {
  userId?: string;
  currentPage: string;
  userRole: 'customer' | 'service_provider' | 'admin';
  completedFeatures: string[];
  sessionDuration: number;
  lastActiveFeatures: string[];
}

export interface FeatureRecommendation {
  featureId: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  relevanceScore: number;
  reasoning: string;
  estimatedTimeToComplete: number;
  prerequisites: string[];
  benefits: string[];
  nextSteps: string[];
}

export interface FeatureInsight {
  type: 'tip' | 'warning' | 'suggestion' | 'achievement';
  title: string;
  message: string;
  actionable: boolean;
  action?: {
    label: string;
    path: string;
    method: 'navigate' | 'modal' | 'tutorial';
  };
}

export interface FeatureDiscoveryResponse {
  recommendations: FeatureRecommendation[];
  insights: FeatureInsight[];
  discoveryScore: number;
  nextMilestone: {
    title: string;
    description: string;
    progress: number;
    target: number;
  };
}

class FeatureDiscoveryService {
  private baseUrl = '/api/feature-discovery';

  async getPersonalizedRecommendations(request: FeatureDiscoveryRequest): Promise<FeatureDiscoveryResponse> {
    try {
      const response = await apiRequest('POST', `${this.baseUrl}/recommendations`, request);
      return response.json();
    } catch (error) {
      console.error('Error fetching feature recommendations:', error);
      // Fallback to local recommendations if API fails
      return this.generateLocalRecommendations(request);
    }
  }

  async trackFeatureUsage(featureId: string, action: 'started' | 'completed' | 'abandoned', duration?: number) {
    try {
      await apiRequest('POST', `${this.baseUrl}/track`, {
        featureId,
        action,
        duration,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking feature usage:', error);
    }
  }

  async getFeatureAnalytics(timeRange: '24h' | '7d' | '30d' = '7d') {
    try {
      const response = await apiRequest('GET', `${this.baseUrl}/analytics?timeRange=${timeRange}`);
      return response.json();
    } catch (error) {
      console.error('Error fetching feature analytics:', error);
      return { 
        totalFeatures: 0, 
        completedFeatures: 0, 
        averageCompletionTime: 0,
        mostPopularFeatures: []
      };
    }
  }

  private generateLocalRecommendations(request: FeatureDiscoveryRequest): FeatureDiscoveryResponse {
    const { currentPage, userRole, completedFeatures } = request;
    
    const allFeatures = [
      {
        featureId: 'ai-chat',
        title: 'AI Technical Support',
        description: 'Get instant AI-powered technical assistance',
        priority: 'high' as const,
        relevanceScore: 0.9,
        reasoning: 'High-priority feature for immediate technical support',
        estimatedTimeToComplete: 5,
        prerequisites: [],
        benefits: ['24/7 availability', 'Instant responses', 'Domain expertise'],
        nextSteps: ['Navigate to chat', 'Ask technical question', 'Review AI response']
      },
      {
        featureId: 'phone-support',
        title: 'Phone Support Services',
        description: 'Connect with expert technicians via phone',
        priority: 'high' as const,
        relevanceScore: 0.8,
        reasoning: 'Essential for complex technical issues requiring human expertise',
        estimatedTimeToComplete: 10,
        prerequisites: ['account-setup'],
        benefits: ['Human expertise', 'Real-time assistance', 'Complex problem solving'],
        nextSteps: ['Browse services', 'Select appropriate tier', 'Schedule call']
      },
      {
        featureId: 'technician-marketplace',
        title: 'Service Provider Marketplace',
        description: 'Find skilled technicians for on-site support',
        priority: 'medium' as const,
        relevanceScore: 0.7,
        reasoning: 'Valuable for hardware issues requiring physical presence',
        estimatedTimeToComplete: 15,
        prerequisites: ['location-setup'],
        benefits: ['Local expertise', 'On-site support', 'Verified technicians'],
        nextSteps: ['Describe issue', 'Review matches', 'Book appointment']
      },
      {
        featureId: 'service-provider-dashboard',
        title: 'Service Provider Dashboard',
        description: 'Manage your service provider business',
        priority: 'high' as const,
        relevanceScore: userRole === 'service_provider' ? 0.95 : 0.1,
        reasoning: 'Essential tool for service providers to manage jobs and earnings',
        estimatedTimeToComplete: 20,
        prerequisites: ['provider-verification'],
        benefits: ['Job management', 'Earnings tracking', 'Client communication'],
        nextSteps: ['Complete profile', 'Set availability', 'Accept jobs']
      },
      {
        featureId: 'admin-console',
        title: 'Admin Management Console',
        description: 'Comprehensive platform management',
        priority: 'high' as const,
        relevanceScore: userRole === 'admin' ? 0.9 : 0.05,
        reasoning: 'Critical for platform administrators',
        estimatedTimeToComplete: 30,
        prerequisites: ['admin-access'],
        benefits: ['User management', 'Analytics', 'Platform configuration'],
        nextSteps: ['Review dashboard', 'Check user metrics', 'Monitor system health']
      }
    ];

    // Filter and sort recommendations based on user role and completed features
    const recommendations = allFeatures
      .filter(feature => {
        // Don't recommend completed features
        if (completedFeatures.includes(feature.featureId)) return false;
        
        // Role-based filtering
        if (userRole === 'customer' && ['service-provider-dashboard', 'admin-console'].includes(feature.featureId)) return false;
        if (userRole === 'service_provider' && feature.featureId === 'admin-console') return false;
        
        return true;
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);

    // Generate contextual insights
    const insights: FeatureInsight[] = [];
    
    // Page-specific insights
    if (currentPage === '/chat') {
      insights.push({
        type: 'tip',
        title: 'Pro Tip',
        message: 'Use specific technical terms for better AI responses',
        actionable: false
      });
    }

    if (currentPage.includes('/dashboard')) {
      insights.push({
        type: 'suggestion',
        title: 'Explore More Features',
        message: 'Try phone support for complex issues that need human expertise',
        actionable: true,
        action: {
          label: 'Browse Phone Support',
          path: '/phone-support',
          method: 'navigate'
        }
      });
    }

    // Achievement insights
    const completionPercentage = (completedFeatures.length / allFeatures.length) * 100;
    if (completionPercentage >= 50) {
      insights.push({
        type: 'achievement',
        title: 'Feature Explorer!',
        message: `You've explored ${completedFeatures.length} features! Keep discovering more.`,
        actionable: false
      });
    }

    // Discovery score and next milestone
    const discoveryScore = Math.round(completionPercentage);
    const nextMilestone = {
      title: 'Feature Expert',
      description: 'Complete 75% of available features',
      progress: completedFeatures.length,
      target: Math.ceil(allFeatures.length * 0.75)
    };

    return {
      recommendations,
      insights,
      discoveryScore,
      nextMilestone
    };
  }

  async submitFeatureFeedback(featureId: string, rating: number, feedback: string) {
    try {
      await apiRequest('POST', `${this.baseUrl}/feedback`, {
        featureId,
        rating,
        feedback,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error submitting feature feedback:', error);
    }
  }

  async getFeatureTips(featureId: string): Promise<string[]> {
    try {
      const response = await apiRequest('GET', `${this.baseUrl}/tips/${featureId}`);
      const data = await response.json();
      return data.tips || [];
    } catch (error) {
      console.error('Error fetching feature tips:', error);
      return this.getDefaultTips(featureId);
    }
  }

  private getDefaultTips(featureId: string): string[] {
    const tipMap: Record<string, string[]> = {
      'ai-chat': [
        'Be specific with your technical questions',
        'Include error messages when relevant',
        'Ask follow-up questions for clarification'
      ],
      'phone-support': [
        'Have your system information ready',
        'Choose the right support tier for your issue',
        'Be prepared to describe the problem clearly'
      ],
      'technician-marketplace': [
        'Provide accurate location information',
        'Describe the issue in detail',
        'Check technician ratings and reviews'
      ],
      'service-provider-dashboard': [
        'Keep your profile updated',
        'Respond to job requests promptly',
        'Track your earnings regularly'
      ],
      'admin-console': [
        'Monitor system metrics regularly',
        'Review user feedback weekly',
        'Keep platform settings optimized'
      ]
    };

    return tipMap[featureId] || ['Explore all available options', 'Take your time to understand the feature'];
  }
}

export const featureDiscoveryService = new FeatureDiscoveryService();
export default featureDiscoveryService;