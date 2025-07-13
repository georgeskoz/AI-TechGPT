import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface FeatureProgress {
  featureId: string;
  completed: boolean;
  lastAccessed: Date;
  completionTime?: number;
}

interface FeatureInsight {
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  pageRelevance: string[];
  userType: 'customer' | 'service_provider' | 'admin' | 'all';
  isNew: boolean;
  usageCount: number;
}

export function useFeatureDiscovery() {
  const [location] = useLocation();
  const [progress, setProgress] = useState<FeatureProgress[]>([]);
  const [discoveryScore, setDiscoveryScore] = useState(0);
  const [insights, setInsights] = useState<FeatureInsight[]>([]);
  const [isFirstTime, setIsFirstTime] = useState(true);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('feature_discovery_progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgress(parsed);
        setIsFirstTime(false);
      } catch (error) {
        console.error('Error loading feature discovery progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (progress.length > 0) {
      localStorage.setItem('feature_discovery_progress', JSON.stringify(progress));
    }
  }, [progress]);

  // Calculate discovery score
  useEffect(() => {
    const totalFeatures = 10; // Total number of features
    const completedFeatures = progress.filter(p => p.completed).length;
    const score = Math.round((completedFeatures / totalFeatures) * 100);
    setDiscoveryScore(score);
  }, [progress]);

  // Generate AI-powered insights based on current page and user behavior
  const generateContextualInsights = () => {
    const pageInsights: FeatureInsight[] = [];
    
    // Page-specific recommendations
    if (location === '/chat') {
      pageInsights.push({
        id: 'chat-escalation',
        title: 'Escalate to Human Support',
        description: 'When AI can\'t solve your issue, seamlessly escalate to live support',
        relevanceScore: 0.9,
        pageRelevance: ['/chat'],
        userType: 'customer',
        isNew: !progress.find(p => p.featureId === 'chat-escalation')?.completed,
        usageCount: 0
      });
    }
    
    if (location === '/dashboard') {
      pageInsights.push({
        id: 'dashboard-metrics',
        title: 'Dashboard Analytics',
        description: 'Track your service usage and support history',
        relevanceScore: 0.8,
        pageRelevance: ['/dashboard'],
        userType: 'customer',
        isNew: !progress.find(p => p.featureId === 'dashboard-metrics')?.completed,
        usageCount: 0
      });
    }
    
    if (location.includes('/technician') || location.includes('/service-provider')) {
      pageInsights.push({
        id: 'provider-earnings',
        title: 'Earnings Tracking',
        description: 'Monitor your earnings and payment schedules',
        relevanceScore: 0.95,
        pageRelevance: ['/technician-earnings', '/service-provider-dashboard'],
        userType: 'service_provider',
        isNew: !progress.find(p => p.featureId === 'provider-earnings')?.completed,
        usageCount: 0
      });
    }
    
    if (location.includes('/admin')) {
      pageInsights.push({
        id: 'admin-analytics',
        title: 'Platform Analytics',
        description: 'Comprehensive platform metrics and user insights',
        relevanceScore: 0.92,
        pageRelevance: ['/admin'],
        userType: 'admin',
        isNew: !progress.find(p => p.featureId === 'admin-analytics')?.completed,
        usageCount: 0
      });
    }
    
    // Universal features that apply to all pages
    pageInsights.push({
      id: 'unified-auth',
      title: 'Unified Authentication',
      description: 'Switch between customer, provider, and admin roles seamlessly',
      relevanceScore: 0.7,
      pageRelevance: ['*'],
      userType: 'all',
      isNew: !progress.find(p => p.featureId === 'unified-auth')?.completed,
      usageCount: 0
    });
    
    return pageInsights.sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  // Update insights when location changes
  useEffect(() => {
    const newInsights = generateContextualInsights();
    setInsights(newInsights);
  }, [location, progress]);

  const markFeatureComplete = (featureId: string, completionTime?: number) => {
    setProgress(prev => {
      const existing = prev.find(p => p.featureId === featureId);
      if (existing) {
        return prev.map(p => 
          p.featureId === featureId 
            ? { ...p, completed: true, completionTime, lastAccessed: new Date() }
            : p
        );
      } else {
        return [...prev, {
          featureId,
          completed: true,
          lastAccessed: new Date(),
          completionTime
        }];
      }
    });
  };

  const markFeatureAccessed = (featureId: string) => {
    setProgress(prev => {
      const existing = prev.find(p => p.featureId === featureId);
      if (existing) {
        return prev.map(p => 
          p.featureId === featureId 
            ? { ...p, lastAccessed: new Date() }
            : p
        );
      } else {
        return [...prev, {
          featureId,
          completed: false,
          lastAccessed: new Date()
        }];
      }
    });
  };

  const getFeatureProgress = (featureId: string) => {
    return progress.find(p => p.featureId === featureId);
  };

  const getCompletedFeatures = () => {
    return progress.filter(p => p.completed);
  };

  const getRecommendedFeatures = () => {
    return insights
      .filter(insight => insight.isNew)
      .slice(0, 3);
  };

  const resetProgress = () => {
    setProgress([]);
    setDiscoveryScore(0);
    localStorage.removeItem('feature_discovery_progress');
  };

  return {
    progress,
    discoveryScore,
    insights,
    isFirstTime,
    markFeatureComplete,
    markFeatureAccessed,
    getFeatureProgress,
    getCompletedFeatures,
    getRecommendedFeatures,
    resetProgress
  };
}

export default useFeatureDiscovery;