import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity, 
  Calendar, 
  Download, 
  RefreshCw,
  Clock,
  Star,
  Target,
  Zap
} from "lucide-react";

const StatisticsPanel: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your statistics report is being generated and will be downloaded shortly.",
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "All statistics have been updated with the latest data.",
    });
  };

  const overviewStats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "blue"
    },
    {
      title: "Service Providers",
      value: "342",
      change: "+8.3%",
      trend: "up",
      icon: Target,
      color: "green"
    },
    {
      title: "Monthly Revenue",
      value: "$284,750",
      change: "+15.2%",
      trend: "up",
      icon: DollarSign,
      color: "purple"
    },
    {
      title: "Active Jobs",
      value: "28",
      change: "-5.2%",
      trend: "down",
      icon: Activity,
      color: "orange"
    },
    {
      title: "Completed Jobs",
      value: "1,593",
      change: "+22.1%",
      trend: "up",
      icon: Zap,
      color: "emerald"
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "yellow"
    },
    {
      title: "Response Time",
      value: "2.3 min",
      change: "-0.5 min",
      trend: "up",
      icon: Clock,
      color: "red"
    },
    {
      title: "System Uptime",
      value: "99.9%",
      change: "+0.1%",
      trend: "up",
      icon: TrendingUp,
      color: "indigo"
    }
  ];

  const revenueBreakdown = [
    { category: "Remote Support", amount: 125000, percentage: 43.9 },
    { category: "Phone Support", amount: 85000, percentage: 29.9 },
    { category: "On-Site Support", amount: 52000, percentage: 18.3 },
    { category: "Consultation", amount: 22750, percentage: 8.0 }
  ];

  const topCategories = [
    { name: "Network Troubleshooting", requests: 456, revenue: 52000 },
    { name: "Hardware Issues", requests: 389, revenue: 45000 },
    { name: "Software Installation", requests: 312, revenue: 38000 },
    { name: "Security Issues", requests: 278, revenue: 35000 },
    { name: "Database Problems", requests: 234, revenue: 32000 }
  ];

  const userGrowth = [
    { month: "Aug", users: 1850, providers: 180 },
    { month: "Sep", users: 2100, providers: 210 },
    { month: "Oct", users: 2350, providers: 245 },
    { month: "Nov", users: 2600, providers: 285 },
    { month: "Dec", users: 2750, providers: 320 },
    { month: "Jan", users: 2847, providers: 342 }
  ];

  const performanceMetrics = [
    { metric: "Average Resolution Time", value: "2.3 hours", target: "< 3 hours", status: "good" },
    { metric: "First Response Time", value: "8 minutes", target: "< 15 minutes", status: "excellent" },
    { metric: "Customer Satisfaction", value: "4.8/5", target: "> 4.5", status: "excellent" },
    { metric: "Service Provider Rating", value: "4.7/5", target: "> 4.5", status: "good" },
    { metric: "Issue Resolution Rate", value: "94.2%", target: "> 90%", status: "excellent" },
    { metric: "Platform Uptime", value: "99.9%", target: "> 99.5%", status: "excellent" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Statistics & Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive platform analytics and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Service Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-gray-600">{category.requests} requests</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${category.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth (Last 6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userGrowth.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="font-medium">{month.month}</div>
                      <div className="flex space-x-8">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Users</div>
                          <div className="font-semibold">{month.users.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Providers</div>
                          <div className="font-semibold">{month.providers}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBreakdown.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm font-semibold">${item.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600">{item.percentage}% of total revenue</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: "Aug 2024", revenue: 185000, growth: 8.5 },
                    { month: "Sep 2024", revenue: 210000, growth: 13.5 },
                    { month: "Oct 2024", revenue: 235000, growth: 11.9 },
                    { month: "Nov 2024", revenue: 255000, growth: 8.5 },
                    { month: "Dec 2024", revenue: 270000, growth: 5.9 },
                    { month: "Jan 2025", revenue: 284750, growth: 5.5 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{item.month}</span>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">${item.revenue.toLocaleString()}</span>
                        <Badge variant={item.growth > 10 ? "default" : "secondary"}>
                          +{item.growth}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Individual Users</span>
                    <span className="font-semibold">2,145 (75.3%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Business Users</span>
                    <span className="font-semibold">572 (20.1%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enterprise Users</span>
                    <span className="font-semibold">130 (4.6%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>United States</span>
                    <span className="font-semibold">1,708 (60.0%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Canada</span>
                    <span className="font-semibold">854 (30.0%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other</span>
                    <span className="font-semibold">285 (10.0%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Active (Last 7 Days)</span>
                    <span className="font-semibold">1,423 (50.0%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active (Last 30 Days)</span>
                    <span className="font-semibold">2,278 (80.0%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inactive</span>
                    <span className="font-semibold">569 (20.0%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{metric.metric}</p>
                      <p className="text-sm text-gray-600">Target: {metric.target}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-lg">{metric.value}</span>
                      <Badge 
                        variant={metric.status === "excellent" ? "default" : 
                                metric.status === "good" ? "secondary" : "destructive"}
                      >
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Demand Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { service: "Remote Support", trend: "up", change: "+18%" },
                    { service: "Phone Support", trend: "up", change: "+12%" },
                    { service: "On-Site Support", trend: "down", change: "-5%" },
                    { service: "Consultation", trend: "up", change: "+25%" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{item.service}</span>
                      <div className="flex items-center space-x-2">
                        {item.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`font-semibold ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                          {item.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "9:00 AM - 12:00 PM", usage: "High", percentage: 85 },
                    { time: "1:00 PM - 5:00 PM", usage: "Very High", percentage: 95 },
                    { time: "6:00 PM - 9:00 PM", usage: "Medium", percentage: 60 },
                    { time: "9:00 PM - 9:00 AM", usage: "Low", percentage: 25 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.time}</span>
                        <span className="text-sm font-semibold">{item.usage}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatisticsPanel;