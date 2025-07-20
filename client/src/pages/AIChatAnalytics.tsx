import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, 
  Bot, 
  Users, 
  TrendingUp, 
  Clock, 
  BarChart3,
  PieChart,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Calendar,
  Filter,
  Brain,
  Target,
  Globe,
  Lightbulb
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Navigation from '@/components/Navigation';
import { apiRequest } from '@/lib/queryClient';

// Sample data for comprehensive analytics
const conversationVolumeData = [
  { time: '00:00', conversations: 45, aiResponses: 187, humanHandoffs: 8 },
  { time: '02:00', conversations: 28, aiResponses: 112, humanHandoffs: 5 },
  { time: '04:00', conversations: 15, aiResponses: 58, humanHandoffs: 2 },
  { time: '06:00', conversations: 32, aiResponses: 124, humanHandoffs: 7 },
  { time: '08:00', conversations: 89, aiResponses: 342, humanHandoffs: 18 },
  { time: '10:00', conversations: 156, aiResponses: 623, humanHandoffs: 34 },
  { time: '12:00', conversations: 203, aiResponses: 812, humanHandoffs: 45 },
  { time: '14:00', conversations: 187, aiResponses: 734, humanHandoffs: 39 },
  { time: '16:00', conversations: 168, aiResponses: 658, humanHandoffs: 32 },
  { time: '18:00', conversations: 134, aiResponses: 523, humanHandoffs: 28 },
  { time: '20:00', conversations: 98, aiResponses: 378, humanHandoffs: 19 },
  { time: '22:00', conversations: 67, aiResponses: 256, humanHandoffs: 12 }
];

const resolutionData = [
  { category: 'Resolved by AI', value: 72.3, color: '#10B981' },
  { category: 'Escalated to Human', value: 18.7, color: '#F59E0B' },
  { category: 'User Abandoned', value: 6.2, color: '#EF4444' },
  { category: 'Follow-up Required', value: 2.8, color: '#8B5CF6' }
];

const domainPerformanceData = [
  { domain: 'Web Development', accuracy: 94.2, confidence: 91.5, avgTime: 45, volume: 342 },
  { domain: 'Network Issues', accuracy: 87.8, confidence: 85.3, avgTime: 62, volume: 287 },
  { domain: 'Hardware Support', accuracy: 82.4, confidence: 79.1, avgTime: 78, volume: 198 },
  { domain: 'Database Management', accuracy: 91.7, confidence: 88.9, avgTime: 53, volume: 156 },
  { domain: 'Mobile Development', accuracy: 89.3, confidence: 86.7, avgTime: 49, volume: 143 },
  { domain: 'Security & Privacy', accuracy: 95.1, confidence: 93.2, avgTime: 41, volume: 128 },
  { domain: 'Cloud Computing', accuracy: 90.6, confidence: 87.4, avgTime: 56, volume: 98 },
  { domain: 'Remote Support', accuracy: 85.9, confidence: 82.6, avgTime: 67, volume: 89 }
];

const sentimentAnalysisData = [
  { time: 'Week 1', positive: 68.5, neutral: 24.2, negative: 7.3 },
  { time: 'Week 2', positive: 71.8, neutral: 22.1, negative: 6.1 },
  { time: 'Week 3', positive: 74.2, neutral: 19.8, negative: 6.0 },
  { time: 'Week 4', positive: 76.9, neutral: 18.4, negative: 4.7 }
];

const aiModelPerformance = [
  { model: 'GPT-4o Main', requests: 15678, latency: 0.85, accuracy: 92.4, cost: 1247.32 },
  { model: 'GPT-4o Turbo', requests: 8934, latency: 0.62, accuracy: 89.7, cost: 892.15 },
  { model: 'GPT-3.5 Fallback', requests: 2341, latency: 0.43, accuracy: 84.2, cost: 187.23 }
];

export default function AIChatAnalytics() {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock API data for real-time analytics
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/admin/ai-chat-analytics', timeRange],
    queryFn: () => Promise.resolve({
      totalConversations: 3421,
      aiResolutions: 2473,
      humanHandoffs: 639,
      averageResponseTime: 1.2,
      satisfactionScore: 4.6,
      costPerConversation: 0.14,
      topIssues: ['Login Problems', 'API Integration', 'Database Connection', 'Mobile App Crashes'],
      peakHours: ['10:00-12:00', '14:00-16:00'],
      resolutionRate: 72.3
    }),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Chat Analytics</h1>
            <p className="text-gray-600 mt-1">Comprehensive analysis of AI chat performance and user interactions</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <Badge variant="outline" className="text-xs">+12.3%</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{analytics?.totalConversations?.toLocaleString() || '0'}</div>
              <p className="text-sm text-gray-600">Total Conversations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Bot className="h-5 w-5 text-green-600" />
                <Badge variant="outline" className="text-xs">+8.7%</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{analytics?.resolutionRate || '0'}%</div>
              <p className="text-sm text-gray-600">AI Resolution Rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Clock className="h-5 w-5 text-purple-600" />
                <Badge variant="outline" className="text-xs">-2.1s</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{analytics?.averageResponseTime || '0'}s</div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-orange-600" />
                <Badge variant="outline" className="text-xs">+15.4%</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{analytics?.humanHandoffs || '0'}</div>
              <p className="text-sm text-gray-600">Human Handoffs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-5 w-5 text-pink-600" />
                <Badge variant="outline" className="text-xs">+0.3</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{analytics?.satisfactionScore || '0'}/5</div>
              <p className="text-sm text-gray-600">Satisfaction Score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Zap className="h-5 w-5 text-yellow-600" />
                <Badge variant="outline" className="text-xs">-$0.02</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">${analytics?.costPerConversation || '0'}</div>
              <p className="text-sm text-gray-600">Cost/Conversation</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="domains">Domain Analysis</TabsTrigger>
            <TabsTrigger value="sentiment">User Sentiment</TabsTrigger>
            <TabsTrigger value="models">AI Models</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversation Volume Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Conversation Volume (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={conversationVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="conversations" 
                        stackId="1" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.6} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="aiResponses" 
                        stackId="2" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.4} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Resolution Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Resolution Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={resolutionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {resolutionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {[
                    { time: '12:34:21', type: 'success', message: 'AI successfully resolved database connection issue for user sarah_dev' },
                    { time: '12:33:45', type: 'handoff', message: 'Complex mobile app issue escalated to human technician for user mike_mobile' },
                    { time: '12:33:12', type: 'success', message: 'Login problem resolved automatically for user john_doe' },
                    { time: '12:32:56', type: 'warning', message: 'High confidence threshold not met for security question from user alex_sec' },
                    { time: '12:32:33', type: 'success', message: 'API integration guidance provided successfully to user dev_team' },
                    { time: '12:32:01', type: 'handoff', message: 'Hardware diagnostics requires specialist - escalated for user lisa_tech' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
                        {activity.type === 'handoff' && <ArrowUpRight className="h-4 w-4 text-blue-600 mt-0.5" />}
                        {activity.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Response Time Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Response Time Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={conversationVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="aiResponses" 
                        stroke="#3B82F6" 
                        strokeWidth={3} 
                        name="AI Response Time (ms)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">AI Accuracy Rate</span>
                      <span className="text-sm text-gray-600">91.2%</span>
                    </div>
                    <Progress value={91.2} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">User Satisfaction</span>
                      <span className="text-sm text-gray-600">4.6/5.0</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">First Contact Resolution</span>
                      <span className="text-sm text-gray-600">78.4%</span>
                    </div>
                    <Progress value={78.4} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Cost Efficiency</span>
                      <span className="text-sm text-gray-600">94.7%</span>
                    </div>
                    <Progress value={94.7} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Domain Analysis Tab */}
          <TabsContent value="domains" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Technical Domain Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {domainPerformanceData.map((domain, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{domain.domain}</h3>
                          <p className="text-sm text-gray-600">{domain.volume} conversations this period</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Avg Response: {domain.avgTime}s</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Accuracy</span>
                            <span className="text-sm font-medium">{domain.accuracy}%</span>
                          </div>
                          <Progress value={domain.accuracy} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Confidence</span>
                            <span className="text-sm font-medium">{domain.confidence}%</span>
                          </div>
                          <Progress value={domain.confidence} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sentiment Analysis Tab */}
          <TabsContent value="sentiment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  User Sentiment Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={sentimentAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="positive" 
                      stackId="1" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      name="Positive (%)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="neutral" 
                      stackId="1" 
                      stroke="#F59E0B" 
                      fill="#F59E0B" 
                      name="Neutral (%)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="negative" 
                      stackId="1" 
                      stroke="#EF4444" 
                      fill="#EF4444" 
                      name="Negative (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI Model Performance Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiModelPerformance.map((model, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{model.model}</h3>
                          <p className="text-sm text-gray-600">{model.requests.toLocaleString()} requests processed</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">${model.cost}</div>
                          <div className="text-sm text-gray-600">Total Cost</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-xl font-semibold">{model.latency}s</div>
                          <div className="text-sm text-gray-600">Avg Latency</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">{model.accuracy}%</div>
                          <div className="text-sm text-gray-600">Accuracy</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">${(model.cost / model.requests).toFixed(4)}</div>
                          <div className="text-sm text-gray-600">Cost per Request</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    AI-Generated Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <h4 className="font-semibold text-blue-800">Peak Performance Period</h4>
                    <p className="text-sm text-blue-700">AI performs 12% better during 10:00-14:00 due to higher engagement and clearer user queries.</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                    <h4 className="font-semibold text-green-800">Optimization Opportunity</h4>
                    <p className="text-sm text-green-700">Database-related queries show highest success rate (91.7%) - consider expanding training data for this domain.</p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h4 className="font-semibold text-yellow-800">Cost Efficiency Alert</h4>
                    <p className="text-sm text-yellow-700">GPT-3.5 fallback usage increased 15% - review escalation thresholds to optimize costs.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Usage Patterns & Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Top Issues This Week</h4>
                      <div className="space-y-2">
                        {analytics?.topIssues?.map((issue, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{issue}</span>
                            <Badge variant="secondary">{Math.floor(Math.random() * 50) + 20}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Peak Hours</h4>
                      <div className="space-y-2">
                        {analytics?.peakHours?.map((hour, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{hour}</span>
                            <Progress value={85 - index * 15} className="w-20 h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}