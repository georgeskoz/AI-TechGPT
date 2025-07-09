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
  ChevronRight
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
    { id: "service-providers", label: "Service Providers", icon: Wrench },
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

          {/* Policy Management Sections */}
          {(activeTab === "refund-policy" || activeTab === "privacy-policy" || activeTab === "cancellation-policy" || activeTab === "terms-conditions") && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {activeTab === "refund-policy" && "Refund Policy"}
                {activeTab === "privacy-policy" && "Privacy Policy"}
                {activeTab === "cancellation-policy" && "Cancellation Policy"}
                {activeTab === "terms-conditions" && "Terms & Conditions"}
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>Policy Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Policy Content</label>
                      <textarea 
                        className="w-full h-64 p-3 border border-gray-300 rounded-md"
                        placeholder="Enter policy content..."
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Button>Save Policy</Button>
                      <Button variant="outline">Preview</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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