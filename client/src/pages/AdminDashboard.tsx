import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  Users, 
  Settings, 
  DollarSign, 
  Briefcase, 
  AlertTriangle, 
  TrendingUp,
  Shield,
  Clock,
  Star,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Home,
  BarChart3,
  Activity,
  Calendar,
  Target,
  Zap,
  Award,
  Globe,
  UserPlus,
  MessageSquare,
  Bell,
  LogOut,
  ChevronDown,
  Plus,
  Download,
  Upload,
  RefreshCw,
  FileText,
  Headphones,
  Wrench,
  CreditCard,
  Building,
  PhoneCall,
  Mail,
  MapPin,
  Wifi,
  Database,
  Server,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  Loader2,
  Sparkles,
  Copy,
  Save
} from "lucide-react";

interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  isActive: boolean;
  lastLogin: string;
  permissions: string[];
}

interface DashboardStats {
  totalUsers: number;
  totalServiceProviders?: number;
  totalTechnicians?: number;
  activeJobs: number;
  completedJobs: number;
  totalRevenue: number;
  pendingDisputes?: number;
  disputesClosed?: number;
  averageRating?: number;
  avgRating?: number;
  responseTime?: string;
  systemUptime?: string;
  monthlyGrowth?: number;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  activeConnections: number;
  totalRequests: number;
  errorRate: number;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user: string;
  status: string;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  subItems?: SidebarItem[];
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [policyContent, setPolicyContent] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: "TechGPT",
    businessType: "Technology Platform",
    jurisdiction: "United States",
    contactEmail: "legal@techgpt.com",
    website: "https://techgpt.com",
    address: "123 Tech Street, Silicon Valley, CA 94105"
  });
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Mock current admin user - in real app, this would come from auth
  useEffect(() => {
    setCurrentAdmin({
      id: 1,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@techgpt.com",
      role: "super_admin",
      department: "operations",
      avatar: "/api/placeholder/40/40",
      isActive: true,
      lastLogin: new Date().toISOString(),
      permissions: ["all"]
    });
  }, []);

  // Fetch dashboard data
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/dashboard"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: systemMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/admin/system-metrics"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["/api/admin/recent-activity"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: adminUsers, isLoading: adminUsersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Mock data for demonstration
  const mockStats: DashboardStats = {
    totalUsers: 2847,
    totalServiceProviders: 342,
    activeJobs: 28,
    completedJobs: 1593,
    totalRevenue: 284750,
    pendingDisputes: 3,
    averageRating: 4.8,
    responseTime: "2.3 min",
    systemUptime: "99.9%",
    monthlyGrowth: 12.5
  };

  const mockMetrics: SystemMetrics = {
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 73,
    activeConnections: 1247,
    totalRequests: 45782,
    errorRate: 0.02
  };

  const mockActivity: RecentActivity[] = [
    {
      id: 1,
      type: "user_registration",
      description: "New customer registration: john.smith@email.com",
      timestamp: "2 minutes ago",
      user: "System",
      status: "success"
    },
    {
      id: 2,
      type: "service_provider_approved",
      description: "Service provider approved: TechFix Solutions",
      timestamp: "5 minutes ago",
      user: "Admin Sarah",
      status: "success"
    },
    {
      id: 3,
      type: "payment_processed",
      description: "Payment processed: $85.00 for Job #1847",
      timestamp: "12 minutes ago",
      user: "System",
      status: "success"
    },
    {
      id: 4,
      type: "dispute_created",
      description: "New dispute created for Job #1823",
      timestamp: "18 minutes ago",
      user: "Customer",
      status: "warning"
    },
    {
      id: 5,
      type: "system_backup",
      description: "Daily system backup completed",
      timestamp: "1 hour ago",
      user: "System",
      status: "success"
    }
  ];

  const stats = dashboardStats?.stats || mockStats;
  const metrics = systemMetrics || mockMetrics;
  const activities = recentActivity || mockActivity;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registration": return <UserPlus className="h-4 w-4" />;
      case "service_provider_approved": return <CheckCircle className="h-4 w-4" />;
      case "payment_processed": return <CreditCard className="h-4 w-4" />;
      case "dispute_created": return <AlertTriangle className="h-4 w-4" />;
      case "system_backup": return <Database className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // AI Policy Generation Mutation
  const generatePolicyMutation = useMutation({
    mutationFn: async ({ policyType, customPrompts }: { policyType: string; customPrompts?: string }) => {
      const response = await fetch("/api/admin/generate-policy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          policyType,
          companyInfo,
          customPrompts,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate policy");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setPolicyContent(data.content);
      toast({
        title: "Policy Generated",
        description: "AI has successfully generated your policy document.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate policy. Please try again.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to Clipboard",
        description: "Policy content has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getPolicyType = (activeTab: string): string => {
    const policyTypes = {
      "refund-policy": "refund",
      "privacy-policy": "privacy",
      "cancellation-policy": "cancellation",
      "terms-conditions": "terms"
    };
    return policyTypes[activeTab] || "general";
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { 
      id: "users", 
      label: "Users", 
      icon: Users,
      subItems: [
        { id: "add-user", label: "Add New User", icon: UserPlus },
        { id: "users-list", label: "Users List", icon: Users },
        { id: "register-business", label: "Register Business", icon: Building },
        { id: "refund-policy", label: "Refund Policy", icon: FileText },
        { id: "privacy-policy", label: "Privacy Policy", icon: Shield },
        { id: "cancellation-policy", label: "Cancellation Policy", icon: XCircle },
        { id: "terms-conditions", label: "Terms & Conditions", icon: FileText },
        { id: "about-us", label: "About Us", icon: Globe },
        { id: "become-service-provider", label: "Become a Service Provider", icon: Wrench },
        { id: "faqs", label: "FAQs", icon: MessageSquare },
      ]
    },
    { 
      id: "service-providers", 
      label: "Service Providers", 
      icon: Wrench,
      subItems: [
        { id: "add-service-provider", label: "Add New Service Provider", icon: UserPlus },
        { id: "service-provider-list", label: "Service Provider List", icon: Users },
        { id: "pending-service-providers", label: "Recent Pending Service Pro", icon: Clock },
        { id: "service-provider-earnings", label: "Earnings", icon: DollarSign },
        { id: "service-provider-referrals", label: "Referrals", icon: Users },
        { id: "service-provider-opportunities", label: "Opportunities", icon: Target },
        { id: "refund-policy-sp", label: "Refund Policy", icon: FileText },
        { id: "privacy-policy-sp", label: "Privacy Policy", icon: Shield },
        { id: "cancellation-policy-sp", label: "Cancellation Policy", icon: XCircle },
        { id: "terms-conditions-sp", label: "Terms & Conditions", icon: FileText },
        { id: "about-us-sp", label: "About Us", icon: Globe },
        { id: "faqs-sp", label: "FAQs", icon: MessageSquare },
      ]
    },
    { id: "jobs", label: "Jobs", icon: Briefcase },
    { id: "disputes", label: "Disputes", icon: AlertTriangle },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "system", label: "System", icon: Server },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const QuickActions = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Button onClick={() => setActiveTab("users")} className="h-20 flex-col gap-2">
        <Users className="h-6 w-6" />
        <span className="text-sm">Manage Users</span>
      </Button>
      <Button onClick={() => setActiveTab("service-providers")} className="h-20 flex-col gap-2" variant="outline">
        <Wrench className="h-6 w-6" />
        <span className="text-sm">Service Providers</span>
      </Button>
      <Button onClick={() => setActiveTab("jobs")} className="h-20 flex-col gap-2" variant="outline">
        <Briefcase className="h-6 w-6" />
        <span className="text-sm">Active Jobs</span>
      </Button>
      <Button onClick={() => setActiveTab("disputes")} className="h-20 flex-col gap-2" variant="outline">
        <AlertTriangle className="h-6 w-6" />
        <span className="text-sm">Resolve Disputes</span>
      </Button>
    </div>
  );

  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-blue-900">{(stats.totalUsers || 0).toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">+{(stats.monthlyGrowth || 12.5)}% this month</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Service Providers</p>
              <p className="text-3xl font-bold text-green-900">{(stats.totalServiceProviders || stats.totalTechnicians || 0).toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">Active service providers</p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <Wrench className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Revenue</p>
              <p className="text-3xl font-bold text-purple-900">${(stats.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">Monthly total</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Completed Jobs</p>
              <p className="text-3xl font-bold text-orange-900">{(stats.completedJobs || 0).toLocaleString()}</p>
              <p className="text-xs text-orange-600 mt-1">★ {(stats.averageRating || stats.avgRating || 4.8)} avg rating</p>
            </div>
            <div className="p-3 bg-orange-500 rounded-full">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SystemHealth = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">CPU Usage</span>
              <span className="text-sm text-gray-600">{metrics.cpu}%</span>
            </div>
            <Progress value={metrics.cpu} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Memory</span>
              <span className="text-sm text-gray-600">{metrics.memory}%</span>
            </div>
            <Progress value={metrics.memory} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Disk Space</span>
              <span className="text-sm text-gray-600">{metrics.disk}%</span>
            </div>
            <Progress value={metrics.disk} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Network</span>
              <span className="text-sm text-gray-600">{metrics.network}%</span>
            </div>
            <Progress value={metrics.network} className="h-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{metrics.activeConnections.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Active Connections</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{metrics.totalRequests.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Requests</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{metrics.errorRate}%</p>
            <p className="text-sm text-gray-600">Error Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RecentActivityCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
              <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{activity.user}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                </div>
              </div>
              <Badge variant="outline" className={getStatusColor(activity.status)}>
                {activity.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TechGPT Admin</h1>
                <p className="text-sm text-gray-600">Platform Management Console</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">System Status: </span>
              <span className="font-medium text-green-600">Operational</span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={() => setLocation("/chat")}>
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Home</span>
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => setLocation("/admin-earnings")}>
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Earnings</span>
            </Button>
            
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentAdmin?.avatar} />
                <AvatarFallback>
                  {currentAdmin?.firstName?.[0]}{currentAdmin?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentAdmin?.firstName} {currentAdmin?.lastName}</p>
                <p className="text-xs text-gray-600 capitalize">{currentAdmin?.role?.replace('_', ' ')}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-1">
              {sidebarItems.map((item) => (
                <div key={item.id}>
                  <Button
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      activeTab === item.id 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                    onClick={() => {
                      if (item.subItems) {
                        toggleExpanded(item.id);
                      } else {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                    {item.subItems && (
                      <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${
                        expandedItems.includes(item.id) ? 'rotate-90' : ''
                      }`} />
                    )}
                  </Button>
                  {item.subItems && expandedItems.includes(item.id) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Button
                          key={subItem.id}
                          variant={activeTab === subItem.id ? "secondary" : "ghost"}
                          size="sm"
                          className={`w-full justify-start ${
                            activeTab === subItem.id 
                              ? 'bg-gray-700 text-white' 
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          }`}
                          onClick={() => {
                            setActiveTab(subItem.id);
                            setSidebarOpen(false);
                          }}
                        >
                          <subItem.icon className="h-3 w-3 mr-2" />
                          {subItem.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>


          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:ml-0">
          {activeTab === "overview" && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                <p className="text-gray-600">Welcome back, {currentAdmin?.firstName}! Here's what's happening with your platform.</p>
              </div>

              <QuickActions />
              <StatsCards />
              <SystemHealth />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivityCard />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Active Jobs</span>
                        <Badge variant="outline">{stats.activeJobs || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Pending Disputes</span>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          {stats.pendingDisputes || stats.disputesClosed || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Average Response Time</span>
                        <Badge variant="outline">{stats.responseTime || "2.3 min"}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">System Uptime</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {stats.systemUptime || "99.9%"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* User Management Sections */}
          {activeTab === "add-user" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New User</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Create New User Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</label>
                      <Input placeholder="Enter full name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                      <Input placeholder="user@example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">User Role</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="service_provider">Service Provider</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button>Create User</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "users-list" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Users List</h2>
              <Card>
                <CardHeader>
                  <CardTitle>All Platform Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input placeholder="Search users..." className="max-w-sm" />
                  </div>
                  <div className="text-center py-8 text-gray-600">
                    User management interface will be displayed here
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "register-business" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Register Business</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Business Registration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Business Name</label>
                      <Input placeholder="Enter business name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Business Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporation">Corporation</SelectItem>
                          <SelectItem value="llc">LLC</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Tax ID</label>
                      <Input placeholder="Enter tax ID" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Contact Email</label>
                      <Input placeholder="business@example.com" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button>Register Business</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI-Powered Policy Management Sections */}
          {(activeTab === "refund-policy" || activeTab === "privacy-policy" || activeTab === "cancellation-policy" || activeTab === "terms-conditions") && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {activeTab === "refund-policy" && "Refund Policy Generator"}
                {activeTab === "privacy-policy" && "Privacy Policy Generator"}
                {activeTab === "cancellation-policy" && "Cancellation Policy Generator"}
                {activeTab === "terms-conditions" && "Terms & Conditions Generator"}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Company Information Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Company Name</label>
                      <Input 
                        value={companyInfo.name}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Business Type</label>
                      <Input 
                        value={companyInfo.businessType}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, businessType: e.target.value }))}
                        placeholder="e.g., Technology Platform"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Jurisdiction</label>
                      <Select value={companyInfo.jurisdiction} onValueChange={(value) => setCompanyInfo(prev => ({ ...prev, jurisdiction: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select jurisdiction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="European Union">European Union</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Contact Email</label>
                      <Input 
                        value={companyInfo.contactEmail}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, contactEmail: e.target.value }))}
                        placeholder="legal@company.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Website</label>
                      <Input 
                        value={companyInfo.website}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://company.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                      <Input 
                        value={companyInfo.address}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Street address"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* AI Generation Panel */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      AI Policy Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">
                        {activeTab === "refund-policy" && "Refund Policy Features"}
                        {activeTab === "privacy-policy" && "Privacy Policy Features"}
                        {activeTab === "cancellation-policy" && "Cancellation Policy Features"}
                        {activeTab === "terms-conditions" && "Terms & Conditions Features"}
                      </h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        {activeTab === "refund-policy" && (
                          <>
                            <li>• Refund eligibility criteria and timeframes</li>
                            <li>• Processing methods and timelines</li>
                            <li>• Exceptions and special circumstances</li>
                            <li>• Customer service contact information</li>
                          </>
                        )}
                        {activeTab === "privacy-policy" && (
                          <>
                            <li>• Data collection and usage practices</li>
                            <li>• Cookie and tracking technology disclosure</li>
                            <li>• Third-party service integrations</li>
                            <li>• User rights and data protection compliance</li>
                          </>
                        )}
                        {activeTab === "cancellation-policy" && (
                          <>
                            <li>• Service cancellation procedures</li>
                            <li>• Notice requirements and timeframes</li>
                            <li>• Prorated billing and refund terms</li>
                            <li>• Account closure and data retention</li>
                          </>
                        )}
                        {activeTab === "terms-conditions" && (
                          <>
                            <li>• Service usage rights and restrictions</li>
                            <li>• User obligations and prohibited activities</li>
                            <li>• Liability limitations and disclaimers</li>
                            <li>• Dispute resolution and governing law</li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Custom Requirements (Optional)</label>
                      <textarea 
                        className="w-full h-24 p-3 border border-gray-300 rounded-md text-sm"
                        placeholder="Add any specific requirements, clauses, or industry-specific terms you'd like included..."
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <Button 
                        onClick={() => generatePolicyMutation.mutate({ 
                          policyType: getPolicyType(activeTab),
                          customPrompts: document.querySelector('textarea')?.value 
                        })}
                        disabled={generatePolicyMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        {generatePolicyMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        {generatePolicyMutation.isPending ? "Generating..." : "Generate with AI"}
                      </Button>
                      
                      {policyContent && (
                        <>
                          <Button variant="outline" onClick={() => copyToClipboard(policyContent)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Generated Policy Content */}
              {policyContent && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Generated Policy Document</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(policyContent)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save Policy
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                        {policyContent}
                      </pre>
                    </div>
                    
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Edit Generated Content</label>
                      <textarea 
                        className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm"
                        value={policyContent}
                        onChange={(e) => setPolicyContent(e.target.value)}
                        placeholder="Edit the generated policy content as needed..."
                      />
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export as PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "about-us" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About Us</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Company Description</label>
                      <textarea 
                        className="w-full h-32 p-3 border border-gray-300 rounded-md"
                        placeholder="Enter company description..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Mission Statement</label>
                      <textarea 
                        className="w-full h-24 p-3 border border-gray-300 rounded-md"
                        placeholder="Enter mission statement..."
                      />
                    </div>
                    <Button>Update About Us</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "become-service-provider" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Become a Service Provider</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Service Provider Registration Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Registration Requirements</label>
                      <textarea 
                        className="w-full h-32 p-3 border border-gray-300 rounded-md"
                        placeholder="Enter registration requirements..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Application Process</label>
                      <textarea 
                        className="w-full h-32 p-3 border border-gray-300 rounded-md"
                        placeholder="Enter application process details..."
                      />
                    </div>
                    <Button>Update Registration Info</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "faqs" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs Management</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">FAQ Items</h3>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add FAQ
                      </Button>
                    </div>
                    <div className="text-center py-8 text-gray-600">
                      FAQ management interface will be displayed here
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Service Providers Section */}
          {activeTab === "add-service-provider" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Service Provider</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Service Provider Registration Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</label>
                      <Input placeholder="Enter full name..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                      <Input type="email" placeholder="Enter email address..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
                      <Input type="tel" placeholder="Enter phone number..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Service Categories</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service categories..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hardware">Hardware Issues</SelectItem>
                          <SelectItem value="software">Software Issues</SelectItem>
                          <SelectItem value="network">Network Troubleshooting</SelectItem>
                          <SelectItem value="web">Web Development</SelectItem>
                          <SelectItem value="mobile">Mobile Devices</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Experience Level</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                          <SelectItem value="advanced">Advanced (6-10 years)</SelectItem>
                          <SelectItem value="expert">Expert (10+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                      <Input placeholder="Enter location..." />
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Bio/Description</label>
                      <textarea 
                        className="w-full h-32 p-3 border border-gray-300 rounded-md"
                        placeholder="Enter service provider bio..."
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Service Provider
                      </Button>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload CSV
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "service-provider-list" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Provider List</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>All Service Providers</span>
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Search service providers..." 
                        className="w-64"
                      />
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service Provider</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Completed Jobs</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/api/placeholder/32/32" />
                                <AvatarFallback>JD</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">John Doe</p>
                                <p className="text-sm text-gray-600">john@example.com</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>Hardware Issues</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span>4.8</span>
                            </div>
                          </TableCell>
                          <TableCell>127</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "pending-service-providers" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Pending Service Providers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-500" />
                      Pending Approvals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium">Mike Johnson</p>
                          <p className="text-sm text-gray-600">Network Specialist</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium">Sarah Wilson</p>
                          <p className="text-sm text-gray-600">Web Developer</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      Earnings Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Pending Earnings</span>
                        <span className="font-bold text-green-600">$2,450</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Processing Payments</span>
                        <span className="font-bold text-orange-600">$1,200</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Referral Bonuses</span>
                        <span className="font-bold text-blue-600">$350</span>
                      </div>
                      <Button className="w-full" size="sm">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Process Payments
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      New Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-sm">High-Priority Jobs</p>
                        <p className="text-xs text-gray-600">15 urgent assignments available</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="font-medium text-sm">Premium Clients</p>
                        <p className="text-xs text-gray-600">3 enterprise clients requesting</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-sm">Skill Matches</p>
                        <p className="text-xs text-gray-600">22 perfect skill matches</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "service-provider-earnings" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Provider Earnings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                        <p className="text-2xl font-bold text-green-600">$45,230</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
                        <p className="text-2xl font-bold text-blue-600">$8,420</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
                        <p className="text-2xl font-bold text-orange-600">$3,420</p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Commission Rate</p>
                        <p className="text-2xl font-bold text-purple-600">15%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "service-provider-referrals" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Provider Referrals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                        <p className="text-2xl font-bold text-blue-600">127</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Referrals</p>
                        <p className="text-2xl font-bold text-green-600">89</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Referral Bonus</p>
                        <p className="text-2xl font-bold text-purple-600">$2,850</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-bold text-orange-600">68%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Referrals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/api/placeholder/32/32" />
                            <AvatarFallback>AM</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">Alice Morgan</p>
                            <p className="text-xs text-gray-600">Referred by: John Doe</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">+$50</p>
                          <p className="text-xs text-gray-600">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/api/placeholder/32/32" />
                            <AvatarFallback>RT</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">Robert Taylor</p>
                            <p className="text-xs text-gray-600">Referred by: Sarah Wilson</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">+$50</p>
                          <p className="text-xs text-gray-600">1 week ago</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/api/placeholder/32/32" />
                            <AvatarFallback>MJ</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">Mike Johnson</p>
                            <p className="text-xs text-gray-600">Referred by: Lisa Chen</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">+$50</p>
                          <p className="text-xs text-gray-600">2 weeks ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Referrers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/api/placeholder/32/32" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">John Doe</p>
                            <p className="text-xs text-gray-600">Hardware Specialist</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">23 referrals</p>
                          <p className="text-xs text-gray-600">$1,150 earned</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/api/placeholder/32/32" />
                            <AvatarFallback>SW</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">Sarah Wilson</p>
                            <p className="text-xs text-gray-600">Web Developer</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">18 referrals</p>
                          <p className="text-xs text-gray-600">$900 earned</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/api/placeholder/32/32" />
                            <AvatarFallback>LC</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">Lisa Chen</p>
                            <p className="text-xs text-gray-600">Network Engineer</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">15 referrals</p>
                          <p className="text-xs text-gray-600">$750 earned</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Referral Program Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Referral Bonus Amount</label>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">$</span>
                        <Input type="number" defaultValue="50" className="w-24" />
                        <span className="text-sm text-gray-600">per successful referral</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Requirements</label>
                      <Select defaultValue="30-days">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="7-days">7 days active</SelectItem>
                          <SelectItem value="30-days">30 days active</SelectItem>
                          <SelectItem value="first-job">Complete first job</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Update Referral Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "service-provider-opportunities" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Provider Opportunities</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Available Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Network Setup - Enterprise Client</h3>
                          <p className="text-sm text-gray-600">High-priority network configuration for corporate office</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary">Network Troubleshooting</Badge>
                            <span className="text-sm text-gray-600">Budget: $500-800</span>
                            <span className="text-sm text-gray-600">Deadline: 2 days</span>
                          </div>
                        </div>
                        <Button>
                          <Target className="h-4 w-4 mr-2" />
                          Assign
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Mobile App Development</h3>
                          <p className="text-sm text-gray-600">React Native app for local business</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary">Mobile Development</Badge>
                            <span className="text-sm text-gray-600">Budget: $1,200-2,000</span>
                            <span className="text-sm text-gray-600">Deadline: 1 week</span>
                          </div>
                        </div>
                        <Button>
                          <Target className="h-4 w-4 mr-2" />
                          Assign
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Service Provider Policy Sections */}
          {(activeTab === "refund-policy-sp" || activeTab === "privacy-policy-sp" || activeTab === "cancellation-policy-sp" || activeTab === "terms-conditions-sp") && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Service Provider {activeTab.replace('-sp', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Company Information Panel */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Company Name</label>
                        <Input 
                          value={companyInfo.name} 
                          onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                          placeholder="Enter company name..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Business Type</label>
                        <Select value={companyInfo.businessType} onValueChange={(value) => setCompanyInfo({...companyInfo, businessType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                            <SelectItem value="corporation">Corporation</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Jurisdiction</label>
                        <Select value={companyInfo.jurisdiction} onValueChange={(value) => setCompanyInfo({...companyInfo, jurisdiction: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select jurisdiction..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="united-states">United States</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="united-kingdom">United Kingdom</SelectItem>
                            <SelectItem value="european-union">European Union</SelectItem>
                            <SelectItem value="australia">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Contact Email</label>
                        <Input 
                          type="email"
                          value={companyInfo.contactEmail} 
                          onChange={(e) => setCompanyInfo({...companyInfo, contactEmail: e.target.value})}
                          placeholder="Enter contact email..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Website</label>
                        <Input 
                          value={companyInfo.website} 
                          onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                          placeholder="Enter website URL..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                        <textarea 
                          className="w-full h-20 p-3 border border-gray-300 rounded-md"
                          value={companyInfo.address} 
                          onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                          placeholder="Enter company address..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Generation Controls */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Generation Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Policy Type</label>
                        <Select value={getPolicyType(activeTab)} disabled>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="refund">Refund Policy</SelectItem>
                            <SelectItem value="privacy">Privacy Policy</SelectItem>
                            <SelectItem value="cancellation">Cancellation Policy</SelectItem>
                            <SelectItem value="terms">Terms & Conditions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Custom Requirements (Optional)</label>
                        <textarea 
                          className="w-full h-24 p-3 border border-gray-300 rounded-md"
                          value={customPrompts}
                          onChange={(e) => setCustomPrompts(e.target.value)}
                          placeholder="Add any specific requirements or clauses..."
                        />
                      </div>
                      <Button 
                        onClick={generatePolicy}
                        disabled={isGenerating}
                        className="w-full"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Generate Policy
                          </>
                        )}
                      </Button>
                      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
                        <p className="font-medium mb-1">AI Policy Generator</p>
                        <p>Uses advanced AI to create legally compliant policy documents tailored to your business and jurisdiction.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Content Preview */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-md h-96 overflow-y-auto">
                        {generatedContent ? (
                          <div className="whitespace-pre-wrap text-sm">
                            {generatedContent}
                          </div>
                        ) : (
                          <div className="text-center py-16 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>Generated policy content will appear here</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              {generatedContent && (
                <Card className="mt-6">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mt-4">
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export as PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "about-us-sp" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About Us - Service Provider Section</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Service Provider About Us Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Service Provider Platform Description</label>
                      <textarea 
                        className="w-full h-32 p-3 border border-gray-300 rounded-md"
                        placeholder="Enter service provider platform description..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Benefits for Service Providers</label>
                      <textarea 
                        className="w-full h-24 p-3 border border-gray-300 rounded-md"
                        placeholder="Enter benefits for service providers..."
                      />
                    </div>
                    <Button>Update Service Provider Info</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "faqs-sp" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Provider FAQs</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Service Provider Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Service Provider FAQ Items</h3>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add FAQ
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium">How do I become a service provider?</h4>
                        <p className="text-sm text-gray-600 mt-1">Complete our application process and pass our verification requirements.</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium">What are the earning opportunities?</h4>
                        <p className="text-sm text-gray-600 mt-1">Service providers can earn 85% of service fees with additional bonuses for performance.</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium">How do I get paid?</h4>
                        <p className="text-sm text-gray-600 mt-1">Payments are processed weekly via direct deposit or your preferred payment method.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {(activeTab === "users" || activeTab === "service-providers" || activeTab === "jobs" || activeTab === "disputes" || activeTab === "payments" || activeTab === "system" || activeTab === "settings") && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {sidebarItems.find(item => item.id === activeTab)?.label} Panel
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive {sidebarItems.find(item => item.id === activeTab)?.label.toLowerCase()} management tools will be available here.
              </p>
              <Button onClick={() => setActiveTab("overview")}>
                Back to Overview
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}