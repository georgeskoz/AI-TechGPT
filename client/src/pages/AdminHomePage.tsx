import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  Shield, 
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  FileText,
  Bell,
  Eye,
  UserCheck,
  Briefcase,
  MessageSquare,
  Target,
  Zap
} from "lucide-react";
import { useLocation } from "wouter";

export default function AdminHomePage() {
  const [, setLocation] = useLocation();

  const adminFeatures = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "User Management",
      description: "Monitor and manage customer accounts, view activity, and handle account issues",
      metrics: "25,847 active users",
      route: "/admin",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <UserCheck className="h-8 w-8 text-green-600" />,
      title: "Technician Oversight",
      description: "Verify technician profiles, monitor performance, and manage certifications",
      metrics: "5,234 verified techs",
      route: "/admin",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Analytics Dashboard",
      description: "Real-time platform metrics, revenue tracking, and performance insights",
      metrics: "98.5% uptime",
      route: "/admin",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-orange-600" />,
      title: "Dispute Resolution",
      description: "Handle customer complaints, resolve conflicts, and maintain service quality",
      metrics: "23 pending cases",
      route: "/admin",
      color: "bg-orange-50 border-orange-200"
    }
  ];

  const systemStats = [
    { 
      label: "Platform Revenue", 
      value: "$2.4M", 
      change: "+12%",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-green-600"
    },
    { 
      label: "Active Sessions", 
      value: "8,542", 
      change: "+5%",
      icon: <Activity className="h-5 w-5" />,
      color: "text-blue-600"
    },
    { 
      label: "Resolution Rate", 
      value: "94.2%", 
      change: "+2%",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600"
    },
    { 
      label: "Response Time", 
      value: "1.8 min", 
      change: "-8%",
      icon: <Clock className="h-5 w-5" />,
      color: "text-purple-600"
    }
  ];

  const quickActions = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security Audit",
      description: "Run system security check",
      action: "Run Audit"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Generate Report",
      description: "Create monthly analytics report",
      action: "Generate"
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "System Alerts",
      description: "View and manage system notifications",
      action: "View Alerts"
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Platform Settings",
      description: "Configure system parameters",
      action: "Configure"
    }
  ];

  const recentActivity = [
    {
      type: "user_registration",
      message: "342 new users registered today",
      time: "2 hours ago",
      status: "success"
    },
    {
      type: "technician_verified",
      message: "15 technicians completed verification",
      time: "4 hours ago", 
      status: "success"
    },
    {
      type: "system_alert",
      message: "High server load detected in US-East",
      time: "6 hours ago",
      status: "warning"
    },
    {
      type: "dispute_resolved",
      message: "8 customer disputes resolved",
      time: "8 hours ago",
      status: "success"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TechGPT Admin</h1>
                <p className="text-sm text-gray-600">Platform Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                <Activity className="h-3 w-3 mr-1" />
                System Healthy
              </Badge>
              <Button variant="outline" onClick={() => setLocation("/admin")}>
                Admin Panel
              </Button>
              <Button onClick={() => setLocation("/admin")}>
                Full Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-800 border-purple-300 mb-6">
              🛡️ Administrative Control Center
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Platform
              <span className="text-purple-600"> Management Hub</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Comprehensive administrative dashboard for monitoring users, managing technicians, 
              analyzing platform performance, and ensuring service quality across the TechGPT ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setLocation("/admin")}
                className="bg-purple-600 hover:bg-purple-700 text-lg px-8"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Open Admin Panel
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setLocation("/admin-portal")}
                className="text-lg px-8"
              >
                <Eye className="h-5 w-5 mr-2" />
                System Overview
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* System Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {systemStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`flex items-center justify-center mb-2 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                <div className={`text-xs font-medium ${stat.color}`}>
                  {stat.change} vs last month
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Administrative Functions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete platform oversight with real-time monitoring and management capabilities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {adminFeatures.map((feature, index) => (
              <Card key={index} className={`${feature.color} hover:shadow-lg transition-all duration-300 cursor-pointer group`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                        <CardDescription className="text-gray-600 mb-3">
                          {feature.description}
                        </CardDescription>
                        <Badge variant="secondary" className="bg-white/70">
                          {feature.metrics}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setLocation(feature.route)}
                    className="w-full group-hover:scale-105 transition-transform"
                    variant="default"
                  >
                    Access Module
                    <Target className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions & Recent Activity */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Quick Actions */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h3>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <Card key={index} className="bg-white hover:shadow-md transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                            {action.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold">{action.title}</h4>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          {action.action}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <Card key={index} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-100' : 
                          activity.status === 'warning' ? 'bg-orange-100' : 'bg-gray-100'
                        }`}>
                          {activity.status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : activity.status === 'warning' ? (
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                          ) : (
                            <Activity className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Health */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">System Performance</h3>
              <p className="opacity-90 mb-4">All systems operational with optimal performance metrics</p>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                99.8% Uptime
              </Badge>
            </div>
            
            <div>
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Security Status</h3>
              <p className="opacity-90 mb-4">All security protocols active with no detected threats</p>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Secure
              </Badge>
            </div>
            
            <div>
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth Metrics</h3>
              <p className="opacity-90 mb-4">Platform experiencing steady growth across all metrics</p>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                +15% Growth
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-purple-600 p-1 rounded">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">TechGPT Admin</span>
              </div>
              <p className="text-gray-400 text-sm">
                Comprehensive administrative platform for managing the TechGPT ecosystem with real-time insights and controls.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Admin Tools</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/admin" className="hover:text-white">Dashboard</a></li>
                <li><a href="/admin-portal" className="hover:text-white">System Monitor</a></li>
                <li><a href="/admin/users" className="hover:text-white">User Management</a></li>
                <li><a href="/admin/analytics" className="hover:text-white">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">System</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/admin/security" className="hover:text-white">Security</a></li>
                <li><a href="/admin/reports" className="hover:text-white">Reports</a></li>
                <li><a href="/admin/settings" className="hover:text-white">Settings</a></li>
                <li><a href="/admin/logs" className="hover:text-white">System Logs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/admin/help" className="hover:text-white">Admin Help</a></li>
                <li><a href="/admin/docs" className="hover:text-white">Documentation</a></li>
                <li><a href="/admin/contact" className="hover:text-white">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 TechGPT Admin. All rights reserved. Administrative control center.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}