import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, 
  User, 
  Users, 
  Shield, 
  BookOpen, 
  TrendingUp, 
  Target,
  CheckCircle,
  Clock,
  Star,
  BarChart3,
  MessageSquare,
  Phone,
  Settings,
  Zap,
  Search
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
// Auth context handled by parent components
import { useFeatureDiscovery } from '@/hooks/useFeatureDiscovery';
import { featureDiscoveryService } from '@/services/featureDiscoveryService';

export default function FeatureDiscoveryPage() {
  // User context handled by parent components
  const { progress, discoveryScore, insights, getRecommendedFeatures } = useFeatureDiscovery();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'service_provider' | 'admin'>('customer');
  const [analyticsData, setAnalyticsData] = useState(null);

  const loadAnalytics = async () => {
    try {
      const data = await featureDiscoveryService.getFeatureAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const features = [
    {
      id: 'ai-chat',
      title: 'AI Technical Support Chat',
      description: 'Get instant help from our AI assistant for technical questions',
      icon: <MessageSquare className="h-5 w-5" />,
      category: 'customer',
      estimatedTime: 3,
      priority: 'high'
    },
    {
      id: 'phone-support',
      title: 'Phone Support Services',
      description: 'Connect with expert technicians via phone for complex issues',
      icon: <Phone className="h-5 w-5" />,
      category: 'customer',
      estimatedTime: 5,
      priority: 'high'
    },
    {
      id: 'technician-marketplace',
      title: 'Service Provider Marketplace',
      description: 'Find and book skilled technicians for on-site support',
      icon: <Users className="h-5 w-5" />,
      category: 'customer',
      estimatedTime: 7,
      priority: 'medium'
    },
    {
      id: 'service-provider-dashboard',
      title: 'Service Provider Dashboard',
      description: 'Manage your service provider business with comprehensive tools',
      icon: <Settings className="h-5 w-5" />,
      category: 'service_provider',
      estimatedTime: 10,
      priority: 'high'
    },
    {
      id: 'admin-management',
      title: 'Admin Management Console',
      description: 'Comprehensive platform management and analytics',
      icon: <Shield className="h-5 w-5" />,
      category: 'admin',
      estimatedTime: 15,
      priority: 'high'
    },
    {
      id: 'screen-sharing',
      title: 'Screen Sharing Support',
      description: 'Real-time screen sharing for remote assistance',
      icon: <Zap className="h-5 w-5" />,
      category: 'universal',
      estimatedTime: 4,
      priority: 'medium'
    }
  ];

  const getFeaturesByRole = (role: string) => {
    return features.filter(feature => feature.category === role || feature.category === 'universal');
  };

  const getCompletionStats = () => {
    const totalFeatures = features.length;
    const completedFeatures = progress.filter(p => p.completed).length;
    const completionRate = Math.round((completedFeatures / totalFeatures) * 100);
    
    return {
      total: totalFeatures,
      completed: completedFeatures,
      remaining: totalFeatures - completedFeatures,
      completionRate
    };
  };

  const stats = getCompletionStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            AI-Powered Feature Discovery
          </h1>
          <p className="text-gray-600">
            Discover and learn about features tailored to your role and needs
          </p>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            View Features For Role:
          </label>
          <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer
                </div>
              </SelectItem>
              <SelectItem value="service_provider">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Service Provider
                </div>
              </SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Administrator
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Discovery Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{discoveryScore}%</div>
              <Progress value={discoveryScore} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Features</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                of {stats.total} features
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.remaining}</div>
              <p className="text-xs text-muted-foreground">
                features to explore
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Insights</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.length}</div>
              <p className="text-xs text-muted-foreground">
                personalized tips
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="space-y-4">
            <div className="grid gap-4">
              {getFeaturesByRole(selectedRole).map((feature) => {
                const isCompleted = progress.some(p => p.featureId === feature.id && p.completed);
                const featureProgress = progress.find(p => p.featureId === feature.id);
                
                return (
                  <Card key={feature.id} className={`hover:shadow-md transition-shadow ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {feature.icon}
                          {feature.title}
                          {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{feature.category}</Badge>
                          {featureProgress && (
                            <span className="text-sm text-gray-500">
                              Last accessed: {featureProgress.lastAccessed.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Learn More
                          </Button>
                          <Button size="sm">
                            Start Tutorial
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommended for You
                </CardTitle>
                <CardDescription>
                  AI-powered recommendations based on your role and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecommendedFeatures().map((insight) => (
                    <div key={insight.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge variant="outline">
                          Relevance: {Math.round(insight.relevanceScore * 100)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={insight.isNew ? 'default' : 'secondary'}>
                          {insight.isNew ? 'New' : 'Familiar'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          For {insight.userType} users
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4">
              {insights.map((insight, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        insight.type === 'tip' ? 'bg-blue-500' :
                        insight.type === 'warning' ? 'bg-yellow-500' :
                        insight.type === 'suggestion' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`} />
                      {insight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{insight.message}</p>
                    {insight.actionable && insight.action && (
                      <Button variant="outline" size="sm">
                        {insight.action.label}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Feature Analytics
                </CardTitle>
                <CardDescription>
                  Platform-wide feature usage statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={loadAnalytics} variant="outline">
                    Load Analytics Data
                  </Button>
                  
                  {analyticsData && (
                    <div className="grid gap-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{analyticsData.totalFeatures}</div>
                          <div className="text-sm text-gray-500">Total Features</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{analyticsData.completedFeatures}</div>
                          <div className="text-sm text-gray-500">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{analyticsData.averageCompletionTime}min</div>
                          <div className="text-sm text-gray-500">Avg. Time</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Most Popular Features</h4>
                        <div className="space-y-2">
                          {analyticsData.mostPopularFeatures.map((feature, index) => (
                            <div key={feature.featureId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{feature.featureId}</span>
                              <Badge variant="secondary">{feature.usageCount} uses</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}