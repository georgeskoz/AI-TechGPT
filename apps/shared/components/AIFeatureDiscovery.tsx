import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Lightbulb, 
  ArrowRight, 
  CheckCircle, 
  Play, 
  Pause, 
  SkipForward, 
  X,
  MessageCircle,
  Phone,
  Users,
  Shield,
  Zap,
  Settings,
  BookOpen,
  Target,
  Sparkles
} from 'lucide-react';
import { useLocation } from 'wouter';

interface Feature {
  id: string;
  title: string;
  description: string;
  category: 'customer' | 'service_provider' | 'admin' | 'universal';
  icon: React.ReactNode;
  path: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number; // in minutes
  prerequisites?: string[];
  benefits: string[];
  steps: WalkthroughStep[];
}

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  action: string;
  element?: string; // CSS selector or element ID
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
}

interface AIFeatureDiscoveryProps {
  userRole?: 'customer' | 'service_provider' | 'admin';
  currentPage?: string;
  onFeatureComplete?: (featureId: string) => void;
}

export default function AIFeatureDiscovery({ 
  userRole = 'customer',
  currentPage = '/',
  onFeatureComplete
}: AIFeatureDiscoveryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);
  const [completedFeatures, setCompletedFeatures] = useState<string[]>([]);
  const [discoveryScore, setDiscoveryScore] = useState(0);
  const [location, setLocation] = useLocation();
  
  // Auth context is handled by the parent wrapper component

  const features: Feature[] = [
    {
      id: 'ai-chat',
      title: 'AI Technical Support Chat',
      description: 'Get instant help from our AI assistant for technical questions',
      category: 'customer',
      icon: <MessageCircle className="h-5 w-5" />,
      path: '/chat',
      priority: 'high',
      estimatedTime: 3,
      benefits: [
        'Instant 24/7 technical support',
        'Domain-specific AI responses',
        'Free tier available',
        'Seamless escalation to humans'
      ],
      steps: [
        {
          id: 'chat-1',
          title: 'Access AI Chat',
          description: 'Navigate to the AI chat interface',
          action: 'Click the Chat button or visit /chat',
          element: '[data-testid="chat-button"]',
          position: 'bottom'
        },
        {
          id: 'chat-2',
          title: 'Ask Technical Question',
          description: 'Type your technical question in the chat input',
          action: 'Enter a technical question like "How do I fix WiFi issues?"',
          element: '[data-testid="chat-input"]',
          position: 'top'
        },
        {
          id: 'chat-3',
          title: 'Review AI Response',
          description: 'The AI will provide domain-specific technical guidance',
          action: 'Read the AI response and follow suggested steps',
          element: '[data-testid="chat-messages"]',
          position: 'left'
        }
      ]
    },
    {
      id: 'phone-support',
      title: 'Phone Support Services',
      description: 'Connect with expert technicians via phone for complex issues',
      category: 'customer',
      icon: <Phone className="h-5 w-5" />,
      path: '/phone-support',
      priority: 'high',
      estimatedTime: 5,
      benefits: [
        'Direct expert consultation',
        'Dynamic pricing based on complexity',
        'Multiple skill levels available',
        'Real-time problem solving'
      ],
      steps: [
        {
          id: 'phone-1',
          title: 'Browse Phone Support',
          description: 'Explore available phone support services',
          action: 'Navigate to phone support page',
          element: '[data-testid="phone-support-nav"]',
          position: 'bottom'
        },
        {
          id: 'phone-2',
          title: 'Select Service Level',
          description: 'Choose appropriate support tier based on issue complexity',
          action: 'Select from Basic, Intermediate, Advanced, or Expert',
          element: '[data-testid="service-selector"]',
          position: 'top'
        },
        {
          id: 'phone-3',
          title: 'Review Pricing',
          description: 'See dynamic pricing based on time, urgency, and complexity',
          action: 'Review cost breakdown and factors',
          element: '[data-testid="pricing-display"]',
          position: 'left'
        }
      ]
    },
    {
      id: 'technician-marketplace',
      title: 'Service Provider Marketplace',
      description: 'Find and book skilled technicians for on-site support',
      category: 'customer',
      icon: <Users className="h-5 w-5" />,
      path: '/technician-request',
      priority: 'medium',
      estimatedTime: 7,
      benefits: [
        'Skilled local technicians',
        'Real-time availability',
        'Transparent pricing',
        'GPS tracking and ETA'
      ],
      steps: [
        {
          id: 'marketplace-1',
          title: 'Request Technician',
          description: 'Start the technician booking process',
          action: 'Click "Request Technician" or visit technician marketplace',
          element: '[data-testid="technician-request"]',
          position: 'bottom'
        },
        {
          id: 'marketplace-2',
          title: 'Describe Issue',
          description: 'Provide details about your technical problem',
          action: 'Fill out issue category, description, and location',
          element: '[data-testid="issue-form"]',
          position: 'top'
        },
        {
          id: 'marketplace-3',
          title: 'Review Matches',
          description: 'See AI-matched technicians based on skills and location',
          action: 'Browse available technicians and their ratings',
          element: '[data-testid="technician-matches"]',
          position: 'left'
        }
      ]
    },
    {
      id: 'service-provider-dashboard',
      title: 'Service Provider Dashboard',
      description: 'Manage your service provider business with comprehensive tools',
      category: 'service_provider',
      icon: <Settings className="h-5 w-5" />,
      path: '/service-provider-dashboard',
      priority: 'high',
      estimatedTime: 10,
      benefits: [
        'Job management and tracking',
        'Real-time earnings tracking',
        'Client communication tools',
        'Invoice modification system'
      ],
      steps: [
        {
          id: 'provider-1',
          title: 'Access Dashboard',
          description: 'Navigate to your service provider dashboard',
          action: 'Visit service provider dashboard',
          element: '[data-testid="provider-dashboard"]',
          position: 'bottom'
        },
        {
          id: 'provider-2',
          title: 'View Active Jobs',
          description: 'Monitor your current and pending jobs',
          action: 'Review job status and client information',
          element: '[data-testid="active-jobs"]',
          position: 'top'
        },
        {
          id: 'provider-3',
          title: 'Track Earnings',
          description: 'Monitor your earnings and payment history',
          action: 'Check earnings dashboard and payout schedule',
          element: '[data-testid="earnings-tracker"]',
          position: 'left'
        }
      ]
    },
    {
      id: 'admin-management',
      title: 'Admin Management Console',
      description: 'Comprehensive platform management and analytics',
      category: 'admin',
      icon: <Shield className="h-5 w-5" />,
      path: '/admin',
      priority: 'high',
      estimatedTime: 15,
      benefits: [
        'Platform analytics and insights',
        'User and provider management',
        'Financial reporting',
        'System configuration'
      ],
      steps: [
        {
          id: 'admin-1',
          title: 'Access Admin Panel',
          description: 'Navigate to the admin dashboard',
          action: 'Visit admin management console',
          element: '[data-testid="admin-dashboard"]',
          position: 'bottom'
        },
        {
          id: 'admin-2',
          title: 'Review Analytics',
          description: 'Monitor platform performance and metrics',
          action: 'Check user statistics, revenue, and system health',
          element: '[data-testid="analytics-panel"]',
          position: 'top'
        },
        {
          id: 'admin-3',
          title: 'Manage Users',
          description: 'Oversee user accounts and service providers',
          action: 'Review user management and provider verification',
          element: '[data-testid="user-management"]',
          position: 'left'
        }
      ]
    },
    {
      id: 'screen-sharing',
      title: 'Screen Sharing Support',
      description: 'Real-time screen sharing for remote assistance',
      category: 'universal',
      icon: <Zap className="h-5 w-5" />,
      path: '/screen-sharing',
      priority: 'medium',
      estimatedTime: 4,
      benefits: [
        'Real-time visual assistance',
        'WebRTC-based technology',
        'Secure connection',
        'Remote troubleshooting'
      ],
      steps: [
        {
          id: 'screen-1',
          title: 'Start Screen Sharing',
          description: 'Initialize screen sharing session',
          action: 'Click "Start Screen Sharing" button',
          element: '[data-testid="screen-sharing-start"]',
          position: 'bottom'
        },
        {
          id: 'screen-2',
          title: 'Grant Permissions',
          description: 'Allow screen sharing access in your browser',
          action: 'Click "Allow" when prompted for screen access',
          element: '[data-testid="permission-dialog"]',
          position: 'top'
        },
        {
          id: 'screen-3',
          title: 'Connect with Support',
          description: 'Support technician will guide you through your issue',
          action: 'Follow technician guidance for troubleshooting',
          element: '[data-testid="support-controls"]',
          position: 'left'
        }
      ]
    }
  ];

  // Filter features based on user role and current page
  const getRelevantFeatures = () => {
    return features.filter(feature => {
      // Show universal features to all users
      if (feature.category === 'universal') return true;
      
      // Show role-specific features
      if (feature.category === userRole) return true;
      
      // Show features relevant to current page
      if (currentPage && feature.path.includes(currentPage)) return true;
      
      return false;
    });
  };

  const getPersonalizedRecommendations = () => {
    const relevantFeatures = getRelevantFeatures();
    
    // AI-powered recommendations based on user behavior and role
    const recommendations = relevantFeatures
      .filter(feature => !completedFeatures.includes(feature.id))
      .sort((a, b) => {
        // Prioritize high-priority features
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (b.priority === 'high' && a.priority !== 'high') return 1;
        
        // Prioritize features with fewer prerequisites
        const aPrereqs = a.prerequisites?.length || 0;
        const bPrereqs = b.prerequisites?.length || 0;
        if (aPrereqs !== bPrereqs) return aPrereqs - bPrereqs;
        
        // Prioritize shorter estimated time
        return a.estimatedTime - b.estimatedTime;
      });
    
    return recommendations.slice(0, 3);
  };

  const startWalkthrough = (feature: Feature) => {
    setCurrentFeature(feature);
    setCurrentStep(0);
    setIsWalkthroughActive(true);
    
    // Navigate to feature page if needed
    if (location !== feature.path) {
      setLocation(feature.path);
    }
  };

  const nextStep = () => {
    if (currentFeature && currentStep < currentFeature.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeWalkthrough();
    }
  };

  const completeWalkthrough = () => {
    if (currentFeature) {
      const newCompleted = [...completedFeatures, currentFeature.id];
      setCompletedFeatures(newCompleted);
      
      // Update discovery score
      const newScore = Math.min(100, (newCompleted.length / features.length) * 100);
      setDiscoveryScore(newScore);
      
      // Notify parent component
      onFeatureComplete?.(currentFeature.id);
      
      // Reset walkthrough
      setCurrentFeature(null);
      setCurrentStep(0);
      setIsWalkthroughActive(false);
    }
  };

  const skipWalkthrough = () => {
    setCurrentFeature(null);
    setCurrentStep(0);
    setIsWalkthroughActive(false);
  };

  const recommendations = getPersonalizedRecommendations();

  return (
    <>
      {/* Feature Discovery Trigger */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Discover Features
            <Sparkles className="h-4 w-4 ml-2" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              AI-Powered Feature Discovery
            </DialogTitle>
            <DialogDescription>
              Discover and learn about features tailored to your role and current needs
            </DialogDescription>
          </DialogHeader>
          
          {/* Discovery Progress */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Discovery Progress</span>
              <span className="text-sm text-gray-600">{completedFeatures.length} / {features.length} features explored</span>
            </div>
            <Progress value={discoveryScore} className="h-2" />
          </div>
          
          {/* Personalized Recommendations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Recommended for You
            </h3>
            <div className="grid gap-4">
              {recommendations.map((feature) => (
                <Card key={feature.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {feature.icon}
                        {feature.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={feature.priority === 'high' ? 'destructive' : feature.priority === 'medium' ? 'default' : 'secondary'}>
                          {feature.priority}
                        </Badge>
                        <span className="text-sm text-gray-500">{feature.estimatedTime} min</span>
                      </div>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {feature.benefits.slice(0, 2).map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => startWalkthrough(feature)}
                        className="flex-1"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Walkthrough
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setLocation(feature.path)}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* All Features */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              All Features
            </h3>
            <div className="grid gap-3">
              {getRelevantFeatures().map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <div>
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {completedFeatures.includes(feature.id) && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startWalkthrough(feature)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Active Walkthrough Overlay */}
      {isWalkthroughActive && currentFeature && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <Card className="max-w-lg mx-4 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {currentFeature.icon}
                  {currentFeature.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipWalkthrough}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Step {currentStep + 1} of {currentFeature.steps.length}</span>
                <Progress value={((currentStep + 1) / currentFeature.steps.length) * 100} className="flex-1 h-1" />
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-2">{currentFeature.steps[currentStep].title}</h3>
              <p className="text-sm text-gray-600 mb-4">{currentFeature.steps[currentStep].description}</p>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm font-medium text-blue-900">
                  Action: {currentFeature.steps[currentStep].action}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={nextStep}
                  className="flex-1"
                >
                  {currentStep === currentFeature.steps.length - 1 ? 'Complete' : 'Next Step'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={skipWalkthrough}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}