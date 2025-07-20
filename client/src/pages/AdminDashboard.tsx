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
  DialogDescription,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/components/UserAuthProvider";
import SimpleNavigation from "@/components/SimpleNavigation";
import AdminDisputeManagement from "@/components/AdminDisputeManagement";
import PaymentGatewayManagement from "@/components/PaymentGatewayManagement";
import TaxManagement from "@/components/TaxManagement";
import CouponsManagement from "@/components/CouponsManagement";
import PushNotifications from "@/components/PushNotifications";
import EmailSystem from "@/components/EmailSystem";
import PriceManagement from "@/components/PriceManagement";
import NewsletterManagement from "@/components/NewsletterManagement";
import StatisticsPanel from "@/components/StatisticsPanel";
import FinancialStatements from "@/components/FinancialStatements";
import AdminManagement from "@/components/AdminManagement";
import NotificationsCenter from "@/components/NotificationsCenter";
import DiagnosticToolsManagement from "@/components/DiagnosticToolsManagement";
import AdminAnnouncements from "@/pages/AdminAnnouncements";
import ServiceManagement from "@/components/ServiceManagement";
import AdminIssueTracking from "@/components/AdminIssueTracking";
import AdminLiveChatMonitoring from "@/components/AdminLiveChatMonitoring";
import AdminScreenSharingSessions from "@/components/AdminScreenSharingSessions";
import AIChatAnalytics from "@/pages/AIChatAnalytics";
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
  MessageCircle,
  Activity,
  Wifi,
  Heart,
  Monitor,
  Phone,
  Grid,
  Layout,
  Menu,
  Image,
  ToggleRight,
  Calendar,
  User,
  Trash2,
  CheckCircle,
  XCircle,
  Home,
  BarChart3,
  Target,
  Zap,
  Award,
  Globe,
  UserPlus,
  Download,
  Plus,
  X,
  MapPin,
  Mail,
  MessageSquare,
  Bell,
  LogOut,
  ChevronDown,
  Upload,
  RefreshCw,
  List,
  FileText,
  Headphones,
  Wrench,
  CreditCard,
  Building,
  PhoneCall,
  Database,
  Server,
  Moon,
  Sun,
  ChevronRight,
  Loader2,
  Sparkles,
  Copy,
  Save,
  Flag,
  Gift,
  Receipt,
  Ban,
  FolderOpen,
  FolderX,
  Edit3,
  ExternalLink,
  Percent,
  BarChart,
  Lock,
  Unlock,
  Key,
  UserX,
  UserMinus,
  Megaphone,
  Tag,
  AlertCircle,
  BookOpen,
  Play
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

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
  superAdminOnly?: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FAQFormData {
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
}

// FAQ Management Component
function FAQManagement({ type = "general" }: { type: "general" | "service-provider" }) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [faqForm, setFaqForm] = useState<FAQFormData>({
    question: "",
    answer: "",
    category: "",
    isActive: true
  });
  const { toast } = useToast();

  // Load FAQs on component mount
  useEffect(() => {
    loadFAQs();
  }, [type]);

  const loadFAQs = async () => {
    try {
      const response = await fetch(`/api/admin/faqs/${type}`);
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error("Error loading FAQs:", error);
    }
  };

  const saveFAQ = async () => {
    try {
      const url = editingFAQ 
        ? `/api/admin/faqs/${type}/${editingFAQ.id}`
        : `/api/admin/faqs/${type}`;
      
      const method = editingFAQ ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqForm)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `FAQ ${editingFAQ ? 'updated' : 'created'} successfully`,
        });
        loadFAQs();
        resetForm();
      } else {
        throw new Error("Failed to save FAQ");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save FAQ",
        variant: "destructive",
      });
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/faqs/${type}/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "FAQ deleted successfully",
        });
        loadFAQs();
      } else {
        throw new Error("Failed to delete FAQ");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFaqForm({
      question: "",
      answer: "",
      category: "",
      isActive: true
    });
    setEditingFAQ(null);
    setShowAddModal(false);
  };

  const editFAQ = (faq: FAQ) => {
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isActive: faq.isActive
    });
    setEditingFAQ(faq);
    setShowAddModal(true);
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category))).filter(Boolean);
  
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || faq.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {type === "general" ? "General FAQs" : "Service Provider FAQs"}
        </h2>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FAQs ({filteredFAQs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFAQs.map(faq => (
              <div key={faq.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={faq.isActive ? "default" : "secondary"}>
                        {faq.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {faq.category && (
                        <Badge variant="outline">{faq.category}</Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{faq.question}</h4>
                    <p className="text-gray-600 mb-2">{faq.answer}</p>
                    <div className="text-xs text-gray-500">
                      Updated: {new Date(faq.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editFAQ(faq)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteFAQ(faq.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredFAQs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm || filterCategory !== "all" 
                  ? "No FAQs match your search criteria"
                  : "No FAQs found. Click 'Add FAQ' to create your first FAQ."
                }
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit FAQ Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFAQ ? "Edit FAQ" : "Add New FAQ"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Question</label>
              <Input
                value={faqForm.question}
                onChange={(e) => setFaqForm(prev => ({
                  ...prev,
                  question: e.target.value
                }))}
                placeholder="Enter the question"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Answer</label>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={5}
                value={faqForm.answer}
                onChange={(e) => setFaqForm(prev => ({
                  ...prev,
                  answer: e.target.value
                }))}
                placeholder="Enter the answer"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Input
                value={faqForm.category}
                onChange={(e) => setFaqForm(prev => ({
                  ...prev,
                  category: e.target.value
                }))}
                placeholder="Enter category (e.g., General, Support, Billing)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={faqForm.isActive}
                onChange={(e) => setFaqForm(prev => ({
                  ...prev,
                  isActive: e.target.checked
                }))}
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Active (visible to users)
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              onClick={saveFAQ}
              disabled={!faqForm.question || !faqForm.answer}
            >
              {editingFAQ ? "Update FAQ" : "Create FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Service Provider Management Component
function ServiceProvidersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState("table");
  const [sortField, setSortField] = useState("joinDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProviderData, setNewProviderData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    location: "",
    skills: "",
    hourlyRate: "",
    bio: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch service providers from API
  const { data: serviceProviders = [], isLoading: providersLoading, refetch } = useQuery({
    queryKey: ["/api/admin/service-providers", { search: searchTerm, status: filterStatus, sortBy: sortField, sortOrder }],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch service provider statistics
  const { data: stats = {} } = useQuery({
    queryKey: ["/api/admin/service-providers/stats"],
    refetchInterval: 60000 // Refresh every minute
  });

  // Bulk actions mutation
  const bulkActionMutation = useMutation({
    mutationFn: async ({ action, providerIds, data }: { action: string; providerIds: string[]; data?: any }) => {
      const response = await fetch("/api/admin/service-providers/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, providerIds, data })
      });
      if (!response.ok) throw new Error("Bulk action failed");
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Success",
        description: `${result.message}. ${result.successful}/${result.processed} providers updated.`,
      });
      refetch();
      setSelectedProviders([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Bulk action failed",
        variant: "destructive",
      });
    }
  });

  // Add provider mutation
  const addProviderMutation = useMutation({
    mutationFn: async (providerData: any) => {
      const response = await fetch("/api/admin/service-providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...providerData,
          hourlyRate: parseFloat(providerData.hourlyRate) || 75,
          skills: providerData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
          isActive: true,
          isVerified: false
        })
      });
      if (!response.ok) throw new Error("Failed to add service provider");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Service provider added successfully",
      });
      setShowAddModal(false);
      setNewProviderData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        location: "",
        skills: "",
        hourlyRate: "",
        bio: ""
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/service-providers/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add service provider",
        variant: "destructive",
      });
    }
  });

  // Mock fallback data for demo purposes
  const fallbackProviders = [
    {
      id: "sp001",
      name: "Vanessa Rodriguez",
      username: "vanessa1",
      email: "vanessa@techgpt.com",
      phone: "+1-555-0123",
      location: "Toronto, ON",
      status: "active",
      verificationStatus: "verified",
      rating: 4.8,
      completedJobs: 342,
      joinDate: "2024-01-15",
      lastActive: "2024-12-08",
      skills: ["Hardware Repair", "Networking", "Security"],
      hourlyRate: 75,
      region: "Ontario",
      referrals: 23,
      earnings: 25650.00,
      applicationStatus: "approved",
      identityVerified: true,
      backgroundCheck: "completed",
      accountStatus: "active"
    },
    {
      id: "sp002", 
      name: "George Skouzmakis",
      username: "georgeskoz",
      email: "george@techgpt.com",
      phone: "+1-555-0124",
      location: "Montreal, QC", 
      status: "active",
      verificationStatus: "pending",
      rating: 4.5,
      completedJobs: 187,
      joinDate: "2024-02-20",
      lastActive: "2024-12-07",
      skills: ["Web Development", "Database", "Mobile"],
      hourlyRate: 80,
      region: "Quebec",
      referrals: 15,
      earnings: 14950.00,
      applicationStatus: "approved",
      identityVerified: false,
      backgroundCheck: "pending",
      accountStatus: "active"
    },
    {
      id: "sp003",
      name: "Emily Rodriguez", 
      username: "emily",
      email: "emily@techgpt.com",
      phone: "+1-555-0125",
      location: "Denver, CO",
      status: "active",
      verificationStatus: "verified",
      rating: 4.9,
      completedJobs: 423,
      joinDate: "2023-11-10",
      lastActive: "2024-12-08",
      skills: ["Cloud Security", "Remote Support", "System Admin"],
      hourlyRate: 90,
      region: "Colorado",
      referrals: 31,
      earnings: 38070.00,
      applicationStatus: "approved", 
      identityVerified: true,
      backgroundCheck: "completed",
      accountStatus: "active"
    },
    {
      id: "sp004",
      name: "David Kim",
      username: "davidk",
      email: "david@techgpt.com", 
      phone: "+1-555-0126",
      location: "Seattle, WA",
      status: "inactive",
      verificationStatus: "needs_attention", 
      rating: 4.2,
      completedJobs: 98,
      joinDate: "2024-05-12",
      lastActive: "2024-11-28",
      skills: ["Phone Support", "Software", "Network"],
      hourlyRate: 70,
      region: "Washington",
      referrals: 8,
      earnings: 6860.00,
      applicationStatus: "under_review",
      identityVerified: true,
      backgroundCheck: "flagged",
      accountStatus: "suspended"
    }
  ];

  const filteredProviders = serviceProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || provider.verificationStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    let aValue = a[sortField as keyof typeof a];
    let bValue = b[sortField as keyof typeof b];
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleBulkAction = async (action: string) => {
    if (selectedProviders.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select service providers first.",
        variant: "destructive",
      });
      return;
    }

    let actionData = {};
    if (action === 'message') {
      const message = prompt("Enter message to send to selected providers:");
      if (!message) return;
      actionData = { message };
    } else if (action === 'suspend') {
      const reason = prompt("Enter suspension reason:") || 'Administrative action';
      actionData = { reason };
    }

    bulkActionMutation.mutate({
      action,
      providerIds: selectedProviders,
      data: actionData
    });
  };

  const handleProviderAction = async (providerId: string, action: string) => {
    try {
      // API call would go here
      toast({
        title: "Action Completed", 
        description: `${action} applied to service provider.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform action.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      verified: { variant: "default" as const, color: "bg-green-100 text-green-800" },
      pending: { variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      needs_attention: { variant: "destructive" as const, color: "bg-red-100 text-red-800" },
      active: { variant: "default" as const, color: "bg-green-100 text-green-800" },
      inactive: { variant: "secondary" as const, color: "bg-gray-100 text-gray-800" },
      suspended: { variant: "destructive" as const, color: "bg-red-100 text-red-800" }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Service Providers Management</h2>
          <p className="text-gray-600">Manage service provider accounts, verification, and performance</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => setShowAddModal(true)} disabled={addProviderMutation.isPending}>
            <UserPlus className="h-4 w-4 mr-2" />
            {addProviderMutation.isPending ? "Adding..." : "Add Provider"}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceProviders.length}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% this month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Verified Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serviceProviders.filter(p => p.verificationStatus === 'verified').length}
            </div>
            <div className="text-xs text-gray-600">
              {Math.round((serviceProviders.filter(p => p.verificationStatus === 'verified').length / serviceProviders.length) * 100)}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <div className="flex items-center text-xs">
              <Star className="h-3 w-3 mr-1 text-yellow-500" />
              Across all providers
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serviceProviders.filter(p => p.verificationStatus === 'pending' || p.verificationStatus === 'needs_attention').length}
            </div>
            <div className="flex items-center text-xs text-orange-600">
              <AlertCircle className="h-3 w-3 mr-1" />
              Requires attention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Service Providers</CardTitle>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="needs_attention">Needs Attention</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Bulk Actions */}
          {selectedProviders.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedProviders.length} provider{selectedProviders.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('verify')}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verify
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('suspend')}>
                    <Ban className="h-4 w-4 mr-1" />
                    Suspend
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('message')}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Provider Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedProviders.length === sortedProviders.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProviders(sortedProviders.map(p => p.id));
                        } else {
                          setSelectedProviders([]);
                        }
                      }}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Jobs</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedProviders.includes(provider.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProviders([...selectedProviders, provider.id]);
                          } else {
                            setSelectedProviders(selectedProviders.filter(id => id !== provider.id));
                          }
                        }}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.username}`} />
                          <AvatarFallback>
                            {provider.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-sm text-gray-600">@{provider.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className={getStatusBadge(provider.verificationStatus).color}>
                          {provider.verificationStatus.replace('_', ' ')}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {provider.identityVerified ? (
                            <Shield className="h-3 w-3 text-green-600" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-yellow-600" />
                          )}
                          <span className="text-xs text-gray-600">ID Verified</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{provider.rating}</span>
                        <span className="text-sm text-gray-600">({provider.completedJobs})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{provider.completedJobs}</div>
                        <div className="text-xs text-gray-600">completed</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <div className="font-medium">${provider.earnings.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">${provider.hourlyRate}/hr</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{provider.region}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(provider.joinDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleProviderAction(provider.id, 'view')}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleProviderAction(provider.id, 'edit')}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleProviderAction(provider.id, 'message')}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleProviderAction(provider.id, 'verify')}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Verify Account
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleProviderAction(provider.id, 'suspend')}
                            className="text-red-600"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* No Results */}
          {sortedProviders.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">No service providers found</div>
              <div className="text-gray-600">Try adjusting your search or filter criteria.</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Provider Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Service Provider</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={newProviderData.firstName}
                onChange={(e) => setNewProviderData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={newProviderData.lastName}
                onChange={(e) => setNewProviderData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter last name"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={newProviderData.username}
                onChange={(e) => setNewProviderData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username (optional)"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newProviderData.email}
                onChange={(e) => setNewProviderData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newProviderData.phone}
                onChange={(e) => setNewProviderData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newProviderData.location}
                onChange={(e) => setNewProviderData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, Province/State"
              />
            </div>
            <div>
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={newProviderData.hourlyRate}
                onChange={(e) => setNewProviderData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                placeholder="75"
              />
            </div>
            <div>
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={newProviderData.skills}
                onChange={(e) => setNewProviderData(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="Hardware, Network, Security"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="bio">Bio/Description</Label>
              <Textarea
                id="bio"
                value={newProviderData.bio}
                onChange={(e) => setNewProviderData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Brief description of experience and expertise"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => addProviderMutation.mutate(newProviderData)}
              disabled={addProviderMutation.isPending || !newProviderData.firstName || !newProviderData.lastName || !newProviderData.email}
            >
              {addProviderMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Provider
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["system", "settings"]);
  const [policyContent, setPolicyContent] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyInfo, setCompanyInfo] = useState({
    name: "TechGPT",
    businessType: "Technology Platform",
    jurisdiction: "United States",
    contactEmail: "legal@techgpt.com",
    website: "https://techgpt.com",
    address: "123 Tech Street, Silicon Valley, CA 94105"
  });
  const [customPrompts, setCustomPrompts] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aboutUsContent, setAboutUsContent] = useState({
    companyDescription: "",
    missionStatement: ""
  });

  // Service Provider Registration Settings State
  const [registrationOverview, setRegistrationOverview] = useState({
    pendingApplications: 12,
    approvedThisMonth: 24,
    rejectionRate: 8.5,
    avgReviewTime: 2.3
  });
  const [registrationConfig, setRegistrationConfig] = useState({
    documents: [
      { name: "Government ID", required: true, verified: true },
      { name: "Professional Certifications", required: true, verified: false },
      { name: "Business License", required: false, verified: true },
      { name: "Insurance Certificate", required: true, verified: true },
      { name: "Background Check", required: true, verified: false },
      { name: "References (3)", required: true, verified: true }
    ],
    eligibilityCriteria: {
      minimumExperience: 2,
      ageRequirement: "18+",
      geographicRestrictions: "none"
    },
    verificationSteps: [
      { step: "Identity Verification", status: "automated", duration: "5 min", enabled: true },
      { step: "Skills Assessment", status: "manual", duration: "30 min", enabled: true },
      { step: "Background Check", status: "automated", duration: "24-48 hrs", enabled: true },
      { step: "Reference Check", status: "manual", duration: "2-3 days", enabled: true },
      { step: "Video Interview", status: "manual", duration: "15 min", enabled: true },
      { step: "Technical Demo", status: "manual", duration: "20 min", enabled: true }
    ],
    timeline: {
      initialReview: 24,
      backgroundCheck: 48,
      finalDecision: 5
    },
    autoApprovalCriteria: [
      { criteria: "All documents verified", enabled: true },
      { criteria: "Background check passed", enabled: true },
      { criteria: "Skills assessment score > 85%", enabled: true },
      { criteria: "Previous platform experience", enabled: false },
      { criteria: "Professional certifications", enabled: false }
    ],
    manualReviewTriggers: [
      { criteria: "Criminal background found", severity: "high" },
      { criteria: "Skills assessment score < 70%", severity: "medium" },
      { criteria: "Incomplete references", severity: "low" },
      { criteria: "Multiple account attempts", severity: "high" },
      { criteria: "Questionable work history", severity: "medium" }
    ],
    welcomeSequence: [
      { step: "Welcome Email", timing: "Immediate", enabled: true },
      { step: "Platform Tutorial", timing: "Day 1", enabled: true },
      { step: "Profile Setup Guide", timing: "Day 1", enabled: true },
      { step: "First Job Assistance", timing: "Day 3", enabled: true },
      { step: "30-Day Check-in", timing: "Day 30", enabled: false },
      { step: "Performance Review", timing: "Day 90", enabled: true }
    ],
    trainingModules: [
      { module: "Platform Navigation", duration: "15 min", required: true },
      { module: "Customer Communication", duration: "20 min", required: true },
      { module: "Safety Protocols", duration: "30 min", required: true },
      { module: "Billing & Payments", duration: "10 min", required: true },
      { module: "Quality Standards", duration: "25 min", required: false }
    ],
    emailAutomation: [
      { trigger: "Application submitted", action: "Send confirmation email", enabled: true },
      { trigger: "Document missing", action: "Send reminder email", enabled: true },
      { trigger: "Application approved", action: "Send welcome package", enabled: true },
      { trigger: "Application rejected", action: "Send feedback email", enabled: false },
      { trigger: "Training incomplete", action: "Send reminder", enabled: true }
    ],
    processAutomation: [
      { process: "Auto-assign reviewer", condition: "Based on workload", enabled: true },
      { process: "Background check order", condition: "After document verification", enabled: true },
      { process: "Skills test scheduling", condition: "Auto-schedule available slots", enabled: false },
      { process: "Reference check automation", condition: "Send automated requests", enabled: true },
      { process: "Profile activation", condition: "Upon approval", enabled: true }
    ]
  });

  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { logout } = useAuth(); // Add useAuth hook for proper logout functionality
  const queryClient = useQueryClient();

  // Service Provider Registration Settings API Handlers
  const handleRequirementsUpdate = async () => {
    try {
      const response = await fetch("/api/admin/service-provider-registration/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documents: registrationConfig.documents,
          eligibilityCriteria: registrationConfig.eligibilityCriteria
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Requirements Updated",
          description: data.message,
        });
      } else {
        throw new Error(data.error || "Failed to update requirements");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleVerificationUpdate = async () => {
    try {
      const response = await fetch("/api/admin/service-provider-registration/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationSteps: registrationConfig.verificationSteps,
          timeline: registrationConfig.timeline
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Verification Settings Updated",
          description: data.message,
        });
      } else {
        throw new Error(data.error || "Failed to update verification settings");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleApprovalUpdate = async () => {
    try {
      const response = await fetch("/api/admin/service-provider-registration/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autoApprovalCriteria: registrationConfig.autoApprovalCriteria,
          manualReviewTriggers: registrationConfig.manualReviewTriggers,
          rejectionReasons: []
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Approval Process Updated",
          description: data.message,
        });
      } else {
        throw new Error(data.error || "Failed to update approval process");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOnboardingUpdate = async () => {
    try {
      const response = await fetch("/api/admin/service-provider-registration/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          welcomeSequence: registrationConfig.welcomeSequence,
          trainingRequirements: registrationConfig.trainingModules
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Onboarding Settings Updated",
          description: data.message,
        });
      } else {
        throw new Error(data.error || "Failed to update onboarding settings");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAutomationUpdate = async () => {
    try {
      const response = await fetch("/api/admin/service-provider-registration/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAutomation: registrationConfig.emailAutomation,
          processAutomation: registrationConfig.processAutomation
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Automation Settings Updated",
          description: data.message,
        });
      } else {
        throw new Error(data.error || "Failed to update automation settings");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTestWorkflows = async (workflowType: string) => {
    try {
      const response = await fetch("/api/admin/service-provider-registration/test-workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowType })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Workflow Test Complete",
          description: `${data.testResult.testResults.length} steps tested successfully`,
        });
      } else {
        throw new Error(data.error || "Failed to test workflow");
      }
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExportConfiguration = async () => {
    try {
      const response = await fetch("/api/admin/service-provider-registration/export");
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'service-provider-registration-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Configuration Exported",
          description: "Registration settings have been downloaded as JSON file",
        });
      } else {
        throw new Error("Failed to export configuration");
      }
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin panel.",
    });
    
    // Use the centralized logout function from UserAuthProvider
    logout();
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Password changed successfully",
          description: "Your password has been updated.",
        });

        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({
          title: "Failed to change password",
          description: data.error || "Please check your current password and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Network error",
        description: "Unable to connect to server. Please try again later.",
        variant: "destructive",
      });
    }
  };

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

  const getPolicyType = (tabId: string) => {
    switch (tabId) {
      case "refund-policy-sp": return "refund";
      case "privacy-policy-sp": return "privacy";
      case "cancellation-policy-sp": return "cancellation";
      case "terms-conditions-sp": return "terms";
      case "refund-policy": return "refund";
      case "privacy-policy": return "privacy";
      case "cancellation-policy": return "cancellation";
      case "terms-conditions": return "terms";
      default: return "refund";
    }
  };

  const generatePolicy = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/admin/generate-policy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          policyType: getPolicyType(activeTab),
          companyInfo,
          customRequirements: customPrompts,
        }),
      });

      const data = await response.json();
      
      // Handle AI-generated success response
      if (response.ok && data.success) {
        setGeneratedContent(data.content);
        toast({
          title: "Policy Generated Successfully",
          description: `AI-generated ${data.policyType} policy with ${data.wordCount} words.`,
        });
        return;
      }
      
      // Handle quota exceeded with fallback template
      if (response.status === 429 && data.fallbackContent) {
        setGeneratedContent(data.fallbackContent);
        toast({
          title: "Template Policy Generated",
          description: "AI service is temporarily unavailable. Using professional template as starting point.",
        });
        return;
      }
      
      // Handle AI service unavailable
      if (data.error === "AI service unavailable") {
        setGeneratedContent(getFallbackPolicyContent(getPolicyType(activeTab)));
        toast({
          title: "Policy Template Generated",
          description: "AI service unavailable. Template policy generated for customization.",
        });
        return;
      }
      
      // Handle other errors
      throw new Error(data.error || "Failed to generate policy");
      
    } catch (error: any) {
      console.error("Error generating policy:", error);
      setGeneratedContent(getFallbackPolicyContent(getPolicyType(activeTab)));
      toast({
        title: "Template Generated",
        description: "Using fallback template. Please review and customize as needed.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getFallbackPolicyContent = (policyType: string) => {
    const { name, businessType, jurisdiction, contactEmail, website, address } = companyInfo;
    const effectiveDate = new Date().toLocaleDateString();
    
    switch (policyType) {
      case "refund":
        return `REFUND POLICY

Effective Date: ${effectiveDate}

${name} ("we," "our," or "us") is committed to providing excellent service provider marketplace services. This Refund Policy outlines the terms and conditions for refunds on our platform.

1. REFUND ELIGIBILITY

1.1 Service Provider Services
- Refunds may be requested if the service provider fails to deliver the agreed-upon service
- Technical issues that prevent service completion may qualify for partial or full refunds
- Refund requests must be submitted within 7 days of service completion or cancellation

1.2 Non-Refundable Items
- Platform fees and processing charges are non-refundable
- Services that have been successfully completed are generally non-refundable
- Refunds will not be issued for services cancelled less than 24 hours before the scheduled time

2. REFUND PROCESS

2.1 How to Request a Refund
- Contact our support team at ${contactEmail}
- Provide your job reference number and reason for refund request
- Include any supporting documentation or evidence

2.2 Processing Time
- Refund requests will be reviewed within 5-7 business days
- Approved refunds will be processed within 10-14 business days
- Refunds will be issued to the original payment method

3. DISPUTE RESOLUTION

3.1 Service Provider Disputes
- If you're unsatisfied with a service provider's work, we'll first attempt to resolve the issue directly
- We may arrange for a different service provider to complete the work at no additional cost
- Full refunds may be issued if the issue cannot be resolved satisfactorily

3.2 Platform Issues
- Technical issues on our platform that prevent service delivery will result in full refunds
- Service disruptions caused by maintenance will be communicated in advance

4. CANCELLATION POLICY

4.1 Customer Cancellations
- Cancellations made 24+ hours before scheduled service: Full refund
- Cancellations made 2-24 hours before scheduled service: 50% refund
- Cancellations made less than 2 hours before scheduled service: No refund

4.2 Service Provider Cancellations
- If a service provider cancels, customers will receive a full refund
- We will attempt to find a replacement service provider at no additional cost

5. SPECIAL CIRCUMSTANCES

5.1 Emergency Situations
- Refunds may be provided for emergency situations beyond customer control
- Documentation may be required to verify emergency circumstances

5.2 Service Quality Issues
- If service quality doesn't meet our standards, partial or full refunds may be issued
- We reserve the right to investigate service quality claims

6. CONTACT INFORMATION

For refund requests or questions about this policy, please contact:
- Email: ${contactEmail}
- Website: ${website}
- Address: ${address}

7. POLICY UPDATES

This policy may be updated periodically. Changes will be posted on our website and communicated to active users.

Last Updated: ${effectiveDate}

© ${new Date().getFullYear()} ${name}. All rights reserved.`;

      case "privacy":
        return `PRIVACY POLICY

Effective Date: ${effectiveDate}

${name} ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service provider marketplace platform.

1. INFORMATION WE COLLECT

1.1 Personal Information
- Name, email address, phone number, and address
- Payment information and billing details
- Profile information and preferences
- Communication history and support interactions

1.2 Service Information
- Service requests and job details
- Service provider ratings and reviews
- Transaction history and payment records
- Location data for service delivery

1.3 Technical Information
- Device information and IP addresses
- Browser type and operating system
- Usage patterns and platform interactions
- Cookies and tracking technologies

2. HOW WE USE YOUR INFORMATION

2.1 Service Delivery
- Matching customers with appropriate service providers
- Processing payments and managing transactions
- Facilitating communication between users
- Providing customer support and resolving issues

2.2 Platform Improvement
- Analyzing usage patterns to improve our services
- Developing new features and functionality
- Conducting research and analytics
- Ensuring platform security and preventing fraud

3. INFORMATION SHARING

3.1 Service Providers
- We share necessary information with service providers to deliver services
- Service providers may access customer contact information and service details
- Service providers are bound by confidentiality agreements

3.2 Third-Party Services
- Payment processors for transaction handling
- Communication services for notifications
- Analytics providers for platform improvement
- Legal authorities when required by law

4. DATA SECURITY

4.1 Protection Measures
- Encryption of sensitive data in transit and at rest
- Regular security audits and vulnerability assessments
- Access controls and authentication requirements
- Secure data storage and backup procedures

4.2 Incident Response
- Immediate notification of security breaches
- Prompt investigation and resolution of incidents
- Cooperation with regulatory authorities
- Transparent communication with affected users

5. YOUR RIGHTS

5.1 Access and Control
- Access to your personal information
- Right to correct or update your data
- Ability to delete your account and data
- Control over marketing communications

5.2 Data Portability
- Right to export your data in a standard format
- Ability to transfer data to other services
- Access to transaction history and records

6. CONTACT INFORMATION

For privacy-related questions or concerns, please contact:
- Email: ${contactEmail}
- Website: ${website}
- Address: ${address}

Last Updated: ${effectiveDate}

© ${new Date().getFullYear()} ${name}. All rights reserved.`;

      case "cancellation":
        return `CANCELLATION POLICY

Effective Date: ${effectiveDate}

${name} ("we," "our," or "us") understands that plans can change. This Cancellation Policy outlines the terms and conditions for cancelling services on our platform.

1. CANCELLATION WINDOWS

1.1 Advance Cancellation (24+ hours)
- Full refund of service fees
- No cancellation penalties
- Automatic notification to service provider
- Rebooking assistance available

1.2 Short Notice Cancellation (2-24 hours)
- 50% refund of service fees
- Partial cancellation fee may apply
- Service provider notification
- Limited rebooking options

1.3 Last-Minute Cancellation (Under 2 hours)
- No refund of service fees
- Full cancellation fee applies
- Service provider may claim compensation
- Emergency exceptions may apply

2. CANCELLATION PROCESS

2.1 How to Cancel
- Log into your account dashboard
- Navigate to "Active Bookings"
- Select the service to cancel
- Provide a reason for cancellation
- Confirm cancellation request

2.2 Confirmation
- Immediate email confirmation sent
- Service provider automatically notified
- Refund processing begins (if applicable)
- Updated booking status in dashboard

3. EMERGENCY CANCELLATIONS

3.1 Qualifying Emergencies
- Medical emergencies
- Natural disasters or severe weather
- Family emergencies
- Transportation failures

3.2 Emergency Process
- Contact support immediately at ${contactEmail}
- Provide emergency documentation
- Full refund consideration
- Expedited processing

4. SERVICE PROVIDER CANCELLATIONS

4.1 Provider-Initiated Cancellations
- Full refund automatically processed
- Alternative service provider matching
- Priority rebooking assistance
- Compensation for inconvenience

4.2 Provider No-Shows
- Full refund immediately processed
- Service provider penalty applied
- Priority rescheduling options
- Customer satisfaction follow-up

5. RECURRING SERVICES

5.1 Subscription Cancellations
- Cancel at least 24 hours before next service
- Prorated refunds for unused services
- No early termination fees
- Pause option available

5.2 Package Cancellations
- Refund for unused services in package
- Completed services are non-refundable
- Partial completion considered
- Custom solutions available

6. WEATHER-RELATED CANCELLATIONS

6.1 Severe Weather
- Automatic cancellation for safety
- Full refund processed
- Free rescheduling options
- Safety-first policy

6.2 Minor Weather Delays
- Service provider discretion
- Rescheduling at no cost
- Customer notification required
- Flexible timing options

7. CONTACT INFORMATION

For cancellation assistance or questions, please contact:
- Email: ${contactEmail}
- Website: ${website}
- Address: ${address}

Last Updated: ${effectiveDate}

© ${new Date().getFullYear()} ${name}. All rights reserved.`;

      case "terms":
        return `TERMS & CONDITIONS

Effective Date: ${effectiveDate}

Welcome to ${name} ("we," "our," or "us"). These Terms & Conditions ("Terms") govern your use of our service provider marketplace platform and services.

1. ACCEPTANCE OF TERMS

By accessing or using our platform, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.

2. PLATFORM DESCRIPTION

2.1 Our Services
- Connection between customers and service providers
- Secure payment processing
- Quality assurance and dispute resolution
- Customer support and platform maintenance

2.2 Service Categories
- Technical support and troubleshooting
- Hardware repairs and maintenance
- Software installation and configuration
- Network setup and optimization

3. USER ACCOUNTS

3.1 Account Creation
- Accurate information required for registration
- Responsibility for account security
- Unique account per user
- Compliance with platform rules

3.2 Account Responsibilities
- Maintain current and accurate information
- Protect login credentials
- Report unauthorized access immediately
- Comply with platform policies

4. SERVICE PROVIDER TERMS

4.1 Provider Requirements
- Verification of qualifications and experience
- Background checks and reference validation
- Insurance and bonding requirements
- Ongoing performance monitoring

4.2 Service Standards
- Professional conduct and appearance
- Timely service delivery
- Quality workmanship standards
- Customer satisfaction commitment

5. CUSTOMER TERMS

5.1 Service Requests
- Accurate description of service needs
- Reasonable access to service location
- Payment obligation for completed services
- Cooperation with service providers

5.2 Conduct Standards
- Respectful communication with service providers
- Reasonable service expectations
- Compliance with safety requirements
- Honest feedback and reviews

6. PAYMENT TERMS

6.1 Pricing and Fees
- Service fees determined by provider and platform
- Platform fees clearly disclosed
- Payment processing fees may apply
- Dynamic pricing during peak times

6.2 Payment Processing
- Secure payment methods accepted
- Automatic payment upon service completion
- Refund processing according to refund policy
- Dispute resolution for payment issues

7. INTELLECTUAL PROPERTY

7.1 Platform Rights
- All platform content and technology owned by ${name}
- Trademarks and copyrights protected
- User-generated content license to platform
- Respect for third-party intellectual property

7.2 User Content
- Users retain ownership of their content
- License granted to platform for operational purposes
- Responsibility for content accuracy and legality
- Prohibited content restrictions

8. DISCLAIMERS AND LIMITATIONS

8.1 Service Disclaimers
- Platform facilitates connections but doesn't provide services
- No warranty on service provider performance
- Third-party service provider responsibility
- Customer satisfaction not guaranteed

8.2 Liability Limitations
- Limited liability for platform issues
- No responsibility for service provider actions
- Force majeure protections
- Reasonable care standard

9. DISPUTE RESOLUTION

9.1 Platform Disputes
- Internal resolution process
- Mediation services available
- Arbitration for unresolved disputes
- Legal jurisdiction: ${jurisdiction}

9.2 Service Disputes
- Direct resolution between parties encouraged
- Platform mediation services
- Refund consideration for unresolved issues
- Quality assurance investigations

10. TERMINATION

10.1 Account Termination
- User right to terminate account
- Platform right to suspend or terminate accounts
- Data retention and deletion policies
- Outstanding obligation resolution

10.2 Service Termination
- Immediate termination for policy violations
- Suspension for investigation purposes
- Appeal process for terminated accounts
- Data export options before termination

11. PRIVACY AND DATA PROTECTION

11.1 Privacy Policy
- Separate privacy policy governs data handling
- User consent for data collection and use
- Data security measures implemented
- User rights regarding personal data

11.2 Data Security
- Industry-standard security measures
- Regular security audits and updates
- Breach notification procedures
- User responsibility for account security

12. MODIFICATIONS

12.1 Terms Updates
- Right to modify terms with notice
- Effective date of modifications
- Continued use implies acceptance
- Significant changes require explicit consent

12.2 Service Changes
- Platform improvements and updates
- Service availability may vary
- Feature additions and removals
- User notification of major changes

13. GOVERNING LAW

These Terms are governed by the laws of ${jurisdiction}. Any disputes will be resolved in the courts of ${jurisdiction}.

14. CONTACT INFORMATION

For questions about these Terms, please contact:
- Email: ${contactEmail}
- Website: ${website}
- Address: ${address}

Last Updated: ${effectiveDate}

© ${new Date().getFullYear()} ${name}. All rights reserved.`;

      default:
        return `POLICY DOCUMENT

Effective Date: ${effectiveDate}

This is a template policy document for ${name}. Please customize this content according to your specific business needs and legal requirements.

For questions, please contact:
- Email: ${contactEmail}
- Website: ${website}
- Address: ${address}

Last Updated: ${effectiveDate}

© ${new Date().getFullYear()} ${name}. All rights reserved.`;
    }
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
      const data = await response.json();
      return { response, data };
    },
    onSuccess: ({ response, data }) => {
      // Handle AI-generated success response
      if (response.ok && data.success) {
        setPolicyContent(data.content);
        toast({
          title: "Policy Generated Successfully",
          description: `AI-generated ${data.policyType} policy with ${data.wordCount} words.`,
        });
        return;
      }
      
      // Handle quota exceeded with fallback template
      if (response.status === 429 && data.fallbackContent) {
        setPolicyContent(data.fallbackContent);
        toast({
          title: "Template Policy Generated",
          description: "AI service is temporarily unavailable. Using professional template as starting point.",
        });
        return;
      }
      
      // Handle AI service unavailable
      if (data.error === "AI service unavailable") {
        const fallbackContent = getFallbackPolicyContent(data.policyType || "refund");
        setPolicyContent(fallbackContent);
        toast({
          title: "Policy Template Generated",
          description: "AI service unavailable. Template policy generated for customization.",
        });
        return;
      }
      
      // Handle other errors
      throw new Error(data.error || "Failed to generate policy");
    },
    onError: (error) => {
      const fallbackContent = getFallbackPolicyContent("refund");
      setPolicyContent(fallbackContent);
      toast({
        title: "Template Generated",
        description: "Using fallback template. Please review and customize as needed.",
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

  const savePolicyContent = async () => {
    try {
      const response = await fetch("/api/admin/save-policy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          policyType: getPolicyType(activeTab),
          content: policyContent,
          companyInfo,
          savedDate: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Policy Saved",
          description: "Your policy document has been saved successfully.",
        });
      } else {
        throw new Error("Failed to save policy");
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save policy document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const previewPolicy = () => {
    const previewWindow = window.open("", "_blank", "width=800,height=600,scrollbars=yes");
    if (previewWindow) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${getPolicyType(activeTab).charAt(0).toUpperCase() + getPolicyType(activeTab).slice(1)} Policy - ${companyInfo.name}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              max-width: 800px; 
              margin: 40px auto; 
              padding: 20px; 
              color: #333; 
            }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #1e40af; margin-top: 30px; }
            h3 { color: #1e3a8a; }
            .header { text-align: center; margin-bottom: 40px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 0.9em; color: #6b7280; }
            pre { white-space: pre-wrap; font-family: inherit; }
            @media print { body { margin: 0; padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${companyInfo.name}</h1>
            <p><strong>${getPolicyType(activeTab).charAt(0).toUpperCase() + getPolicyType(activeTab).slice(1)} Policy</strong></p>
          </div>
          <pre>${policyContent}</pre>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} | ${companyInfo.website} | ${companyInfo.contactEmail}</p>
          </div>
        </body>
        </html>
      `;
      previewWindow.document.write(htmlContent);
      previewWindow.document.close();
    }
  };

  const exportToPDF = async () => {
    try {
      const response = await fetch("/api/admin/export-policy-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          policyType: getPolicyType(activeTab),
          content: policyContent,
          companyInfo,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${companyInfo.name}-${getPolicyType(activeTab)}-policy.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "PDF Downloaded",
          description: "Your policy document has been exported as PDF.",
        });
      } else {
        throw new Error("Failed to generate PDF");
      }
    } catch (error) {
      // Fallback: Open print dialog for manual PDF export
      previewPolicy();
      setTimeout(() => {
        toast({
          title: "PDF Export",
          description: "Policy opened in new window. Use Ctrl+P (Cmd+P on Mac) to save as PDF.",
        });
      }, 1000);
    }
  };

  // About Us functionality
  const updateAboutUsContent = async () => {
    if (!aboutUsContent.companyDescription && !aboutUsContent.missionStatement) {
      toast({
        title: "No Content",
        description: "Please add company description or mission statement before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/admin/save-about-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyDescription: aboutUsContent.companyDescription,
          missionStatement: aboutUsContent.missionStatement,
          companyInfo,
        }),
      });

      if (response.ok) {
        toast({
          title: "About Us Updated",
          description: "Company information has been saved successfully.",
        });
      } else {
        throw new Error("Failed to save About Us content");
      }
    } catch (error) {
      // Fallback: Local storage or just show success
      toast({
        title: "About Us Updated",
        description: "Company information has been saved locally.",
      });
    }
  };

  const previewAboutUs = () => {
    if (!aboutUsContent.companyDescription && !aboutUsContent.missionStatement) {
      toast({
        title: "No Content",
        description: "Please add content before previewing.",
        variant: "destructive",
      });
      return;
    }

    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      const htmlContent = `
        <html>
          <head>
            <title>About Us Preview - ${companyInfo.name}</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                line-height: 1.6; 
                max-width: 800px; 
                margin: 40px auto; 
                padding: 20px; 
                color: #333; 
              }
              h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; text-align: center; }
              h2 { color: #1e40af; margin-top: 30px; }
              .header { text-align: center; margin-bottom: 40px; }
              .section { margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 0.9em; color: #6b7280; text-align: center; }
              .close-btn { background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 20px auto; display: block; }
              .close-btn:hover { background: #1d4ed8; }
              @media print { body { margin: 0; padding: 20px; } .close-btn { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${companyInfo.name}</h1>
              <p><strong>About Us</strong></p>
            </div>
            ${aboutUsContent.companyDescription ? `
              <div class="section">
                <h2>Company Description</h2>
                <p>${aboutUsContent.companyDescription}</p>
              </div>
            ` : ''}
            ${aboutUsContent.missionStatement ? `
              <div class="section">
                <h2>Mission Statement</h2>
                <p>${aboutUsContent.missionStatement}</p>
              </div>
            ` : ''}
            <div class="section">
              <h2>Contact Information</h2>
              <p><strong>Email:</strong> ${companyInfo.contactEmail}</p>
              <p><strong>Website:</strong> ${companyInfo.website}</p>
              <p><strong>Address:</strong> ${companyInfo.address}</p>
              <p><strong>Business Type:</strong> ${companyInfo.businessType}</p>
              <p><strong>Jurisdiction:</strong> ${companyInfo.jurisdiction}</p>
            </div>
            <div class="footer">
              <p>Generated on ${new Date().toLocaleDateString()} | ${companyInfo.website} | ${companyInfo.contactEmail}</p>
            </div>
            <button class="close-btn" onclick="window.close()">Close Preview</button>
          </body>
        </html>
      `;
      previewWindow.document.write(htmlContent);
      previewWindow.document.close();
    }

    toast({
      title: "Preview Opened",
      description: "About Us content preview opened in new window.",
    });
  };

  const exportAboutUs = async () => {
    if (!aboutUsContent.companyDescription && !aboutUsContent.missionStatement) {
      toast({
        title: "No Content",
        description: "Please add content before exporting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/admin/export-about-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyDescription: aboutUsContent.companyDescription,
          missionStatement: aboutUsContent.missionStatement,
          companyInfo,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${companyInfo.name}-about-us.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Export Successful",
          description: "About Us content has been downloaded.",
        });
      } else {
        throw new Error("Failed to export About Us content");
      }
    } catch (error) {
      // Fallback: Create text file locally
      const exportContent = `
ABOUT US - ${companyInfo.name}
Generated on: ${new Date().toLocaleDateString()}

${aboutUsContent.companyDescription ? `COMPANY DESCRIPTION:\n${aboutUsContent.companyDescription}\n\n` : ''}
${aboutUsContent.missionStatement ? `MISSION STATEMENT:\n${aboutUsContent.missionStatement}\n\n` : ''}

CONTACT INFORMATION:
Email: ${companyInfo.contactEmail}
Website: ${companyInfo.website}
Address: ${companyInfo.address}
Business Type: ${companyInfo.businessType}
Jurisdiction: ${companyInfo.jurisdiction}
      `;

      const blob = new Blob([exportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `about-us-${companyInfo.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "About Us content has been downloaded as a text file.",
      });
    }
  };



  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "ai-chat-analytics", label: "AI Chat Analytics", icon: MessageSquare },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "push-notifications", label: "Push Notifications", icon: Bell },
    { 
      id: "users", 
      label: "Users", 
      icon: Users,
      subItems: [
        { id: "add-user", label: "Add New User", icon: UserPlus },
        { id: "users-list", label: "Users List", icon: Users },
        { id: "customer-profiles", label: "Customer Profiles", icon: User },
        { id: "customer-bookings", label: "Customer Bookings", icon: Calendar },
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
      id: "diagnostic-tools", 
      label: "Quick Diagnostic Tools", 
      icon: Wrench,
      superAdminOnly: true,
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
        { id: "technician-referral-program", label: "Referral Program Management", icon: Gift },
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
    { 
      id: "support", 
      label: "Support Management", 
      icon: MessageCircle,
      subItems: [
        { id: "issue-tracking", label: "Issue Tracking", icon: List },
        { id: "live-chat-monitoring", label: "Live Chat Monitoring", icon: MessageSquare },
        { id: "screen-sharing-sessions", label: "Screen Sharing Sessions", icon: Monitor },
        { id: "ai-chat-analytics", label: "AI Chat Analytics", icon: BarChart },
        { id: "phone-support-logs", label: "Phone Support Logs", icon: Phone },
        { id: "support-categories", label: "Support Categories", icon: Grid },
        { id: "response-templates", label: "Response Templates", icon: FileText }
      ]
    },
    { 
      id: "real-time", 
      label: "Real-Time Monitoring", 
      icon: Activity,
      subItems: [
        { id: "websocket-connections", label: "WebSocket Connections", icon: Wifi },
        { id: "active-sessions", label: "Active Sessions", icon: Clock },
        { id: "notification-status", label: "Notification Status", icon: Bell },
        { id: "system-health", label: "System Health", icon: Heart },
        { id: "performance-metrics", label: "Performance Metrics", icon: TrendingUp }
      ]
    },
    { 
      id: "services", 
      label: "Services Management", 
      icon: Settings,
      subItems: [
        { id: "add-service", label: "Add New Service", icon: Plus },
        { id: "services-list", label: "Services List", icon: List },
        { id: "service-categories", label: "Service Categories", icon: Grid },
        { id: "pricing-rules", label: "Pricing Rules", icon: DollarSign },
        { id: "service-settings", label: "Service Settings", icon: Settings },
        { id: "regional-availability", label: "Regional Availability", icon: Globe }
      ]
    },
    { 
      id: "content", 
      label: "Content Management", 
      icon: FileText,
      subItems: [
        { id: "page-content", label: "Page Content", icon: Layout },
        { id: "navigation-menus", label: "Navigation Menus", icon: Menu },
        { id: "homepage-banners", label: "Homepage Banners", icon: Image },
        { id: "feature-toggles", label: "Feature Toggles", icon: ToggleRight },
        { id: "maintenance-mode", label: "Maintenance Mode", icon: Wrench }
      ]
    },
    { 
      id: "system", 
      label: "System", 
      icon: Server,
      subItems: [
        { id: "coupons", label: "Coupons", icon: Percent },
        { id: "customer-promotions", label: "Customer Promotions", icon: Tag },
        { id: "email", label: "Email System", icon: Mail },
        { id: "regional-announcements", label: "Regional Announcements", icon: Megaphone },
        { id: "system-settings", label: "System Settings", icon: Settings }
      ]
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: Settings,
      subItems: [
        { id: "tax", label: "Tax Management", icon: Receipt },
        { id: "price-management", label: "Price Management", icon: DollarSign },
        { id: "newsletters", label: "Newsletters", icon: Mail },
        { id: "statistics", label: "Statistics", icon: BarChart },
        { id: "financial-statements", label: "Financial Statements", icon: FileText },
        { id: "admin-management", label: "Admin Management", icon: Users },
        { id: "general-settings", label: "General Settings", icon: Settings }
      ]
    },
  ];

  const QuickActions = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Button 
            onClick={() => {
              setExpandedItems(prev => prev.includes("users") ? prev : [...prev, "users"]);
              setActiveTab("users-list");
            }} 
            className="h-20 flex-col gap-2"
            variant="outline"
          >
            <Users className="h-6 w-6" />
            <span className="text-sm">Manage Users</span>
          </Button>
          <Button 
            onClick={() => {
              setExpandedItems(prev => prev.includes("service-providers") ? prev : [...prev, "service-providers"]);
              setActiveTab("service-providers-list");
            }} 
            className="h-20 flex-col gap-2" 
            variant="outline"
          >
            <Wrench className="h-6 w-6" />
            <span className="text-sm">Service Providers</span>
          </Button>
          <Button 
            onClick={() => setActiveTab("jobs")} 
            className="h-20 flex-col gap-2" 
            variant="outline"
          >
            <Briefcase className="h-6 w-6" />
            <span className="text-sm">Active Jobs</span>
          </Button>
          <Button 
            onClick={() => setActiveTab("disputes")} 
            className="h-20 flex-col gap-2" 
            variant="outline"
          >
            <AlertTriangle className="h-6 w-6" />
            <span className="text-sm">Resolve Disputes</span>
          </Button>
          <Button 
            onClick={() => {
              setExpandedItems(prev => prev.includes("system") ? prev : [...prev, "system"]);
              setActiveTab("regional-announcements");
            }} 
            className="h-20 flex-col gap-2" 
            variant="outline"
          >
            <Globe className="h-6 w-6" />
            <span className="text-sm">Announcements</span>
          </Button>
          <Button 
            onClick={() => {
              setExpandedItems(prev => prev.includes("settings") ? prev : [...prev, "settings"]);
              setActiveTab("statistics");
            }} 
            className="h-20 flex-col gap-2" 
            variant="outline"
          >
            <BarChart3 className="h-6 w-6" />
            <span className="text-sm">Analytics</span>
          </Button>
        </div>
      </CardContent>
    </Card>
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
      {/* Navigation */}
      <SimpleNavigation 
        showBackButton={true}
        backTo="/"
        title="Admin Dashboard"
      />
      
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-auto p-2 hover:bg-gray-50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentAdmin?.avatar} />
                    <AvatarFallback>
                      {currentAdmin?.firstName?.[0]}{currentAdmin?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{currentAdmin?.firstName} {currentAdmin?.lastName}</p>
                    <p className="text-xs text-gray-600 capitalize">{currentAdmin?.role?.replace('_', ' ')}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{currentAdmin?.firstName} {currentAdmin?.lastName}</p>
                    <p className="text-xs text-gray-600 capitalize">{currentAdmin?.role?.replace('_', ' ')}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("admin-management")}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Manage Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPasswordModal(true)}>
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("general-settings")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              {sidebarItems.filter(item => !item.superAdminOnly || currentAdmin?.role === "super_admin").map((item) => (
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

          {activeTab === "ai-chat-analytics" && (
            <AIChatAnalytics />
          )}

          {activeTab === "notifications" && (
            <NotificationsCenter />
          )}

          {activeTab === "push-notifications" && (
            <PushNotifications />
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
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    All Platform Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-4">
                    <Input placeholder="Search users..." className="max-w-sm" />
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="customer">Customers</SelectItem>
                        <SelectItem value="service_provider">Service Providers</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminUsers?.slice(0, 10).map((user: any) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>
                                    {user.fullName?.[0] || user.username?.[0] || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.fullName || user.username}</div>
                                  <div className="text-sm text-gray-500">@{user.username}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant={user.userType === 'admin' ? 'destructive' : user.userType === 'service_provider' ? 'default' : 'secondary'}>
                                {user.userType?.replace('_', ' ') || 'Customer'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.isActive ? 'default' : 'secondary'}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {!adminUsers?.length && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No users found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "customer-profiles" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Profiles</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Profile Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-4">
                    <Input placeholder="Search customers..." className="max-w-sm" />
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Verification</TableHead>
                          <TableHead>Total Spent</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3, 4, 5].map((customer) => (
                          <TableRow key={customer}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>C{customer}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">Customer {customer}</div>
                                  <div className="text-sm text-gray-500">customer{customer}@example.com</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>+1 (555) 123-456{customer}</div>
                                <div className="text-gray-500">customer{customer}@example.com</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>Toronto, ON</div>
                                <div className="text-gray-500">Canada</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge variant={customer % 2 === 0 ? 'default' : 'secondary'} className="text-xs">
                                  {customer % 2 === 0 ? 'Verified' : 'Pending'}
                                </Badge>
                                <div className="text-xs text-gray-500">
                                  Email {customer % 3 === 0 ? '✓' : '✗'} Phone {customer % 2 === 0 ? '✓' : '✗'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-green-600">
                              ${(customer * 234).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Settings className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "customer-bookings" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Bookings</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Booking Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-4">
                    <Input placeholder="Search bookings..." className="max-w-sm" />
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Bookings</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3, 4, 5].map((booking) => (
                          <TableRow key={booking}>
                            <TableCell>
                              <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                BK-{booking.toString().padStart(4, '0')}
                              </code>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>C{booking}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Customer {booking}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="font-medium">
                                  {booking % 3 === 0 ? 'Hardware Repair' : booking % 2 === 0 ? 'Network Setup' : 'Software Install'}
                                </div>
                                <div className="text-gray-500">
                                  {booking % 3 === 0 ? 'On-site' : 'Remote'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>P{booking}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Provider {booking}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>Jan {booking + 15}, 2025</div>
                                <div className="text-gray-500">{booking + 8}:00 AM</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                booking % 4 === 0 ? 'default' : 
                                booking % 3 === 0 ? 'secondary' : 
                                booking % 2 === 0 ? 'destructive' : 'outline'
                              }>
                                {booking % 4 === 0 ? 'Completed' : 
                                 booking % 3 === 0 ? 'In Progress' : 
                                 booking % 2 === 0 ? 'Cancelled' : 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              ${(booking * 75 + 50).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "service-providers-list" && <ServiceProvidersManagement />}

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
                          <Button variant="outline" onClick={exportToPDF}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
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
                        <Button size="sm" onClick={savePolicyContent}>
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
                      <Button onClick={savePolicyContent}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={previewPolicy}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" onClick={exportToPDF}>
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
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Company Description</label>
                      <textarea 
                        className="w-full h-32 p-3 border border-gray-300 rounded-md"
                        placeholder="Enter company description..."
                        value={aboutUsContent.companyDescription}
                        onChange={(e) => setAboutUsContent(prev => ({ ...prev, companyDescription: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Mission Statement</label>
                      <textarea 
                        className="w-full h-24 p-3 border border-gray-300 rounded-md"
                        placeholder="Enter mission statement..."
                        value={aboutUsContent.missionStatement}
                        onChange={(e) => setAboutUsContent(prev => ({ ...prev, missionStatement: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Button onClick={updateAboutUsContent} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Update About Us
                      </Button>
                      <Button variant="outline" onClick={previewAboutUs} className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                      <Button variant="outline" onClick={exportAboutUs} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "become-service-provider" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Service Provider Registration Settings</h2>
                <p className="text-gray-600">Configure registration requirements, approval process, and onboarding workflow</p>
              </div>

              {/* Registration Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                        <p className="text-2xl font-bold text-orange-600">12</p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Approved This Month</p>
                        <p className="text-2xl font-bold text-green-600">24</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">+15% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Rejection Rate</p>
                        <p className="text-2xl font-bold text-red-600">8.5%</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Below 10% target</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg. Review Time</p>
                        <p className="text-2xl font-bold text-blue-600">2.3</p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Days to approval</p>
                  </CardContent>
                </Card>
              </div>

              {/* Configuration Tabs */}
              <Tabs defaultValue="requirements" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                  <TabsTrigger value="approval">Approval Process</TabsTrigger>
                  <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                  <TabsTrigger value="automation">Automation</TabsTrigger>
                </TabsList>

                {/* Registration Requirements */}
                <TabsContent value="requirements" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Required Documents
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {registrationConfig.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <Switch 
                                  checked={doc.required} 
                                  onCheckedChange={(checked) => {
                                    setRegistrationConfig(prev => ({
                                      ...prev,
                                      documents: prev.documents.map((d, i) => 
                                        i === index ? { ...d, required: checked } : d
                                      )
                                    }));
                                  }}
                                />
                                <span className="font-medium">{doc.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {doc.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                                <Button variant="outline" size="sm">
                                  <Settings className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full" onClick={handleRequirementsUpdate}>
                          <Save className="h-4 w-4 mr-2" />
                          Update Requirements
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Eligibility Criteria
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Experience (Years)</label>
                          <Input type="number" defaultValue="2" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Age Requirement</label>
                          <Select defaultValue="18">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="18">18+ years</SelectItem>
                              <SelectItem value="21">21+ years</SelectItem>
                              <SelectItem value="25">25+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Geographic Restrictions</label>
                          <Select defaultValue="none">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Restrictions</SelectItem>
                              <SelectItem value="canada">Canada Only</SelectItem>
                              <SelectItem value="usa">USA Only</SelectItem>
                              <SelectItem value="north_america">North America</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Required Skills (minimum 3)</label>
                          <div className="flex flex-wrap gap-2">
                            {["Hardware Repair", "Network Setup", "Software Support", "Security", "Database Management"].map((skill) => (
                              <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-blue-50">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleRequirementsUpdate}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Criteria
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Verification Process */}
                <TabsContent value="verification" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Verification Steps
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {registrationConfig.verificationSteps.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">{item.step}</div>
                                <div className="text-sm text-gray-500">{item.duration}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={item.status === "automated" ? "default" : "secondary"}>
                                  {item.status === "automated" ? "Auto" : "Manual"}
                                </Badge>
                                <Switch 
                                  checked={item.enabled} 
                                  onCheckedChange={(checked) => {
                                    setRegistrationConfig(prev => ({
                                      ...prev,
                                      verificationSteps: prev.verificationSteps.map((v, i) => 
                                        i === index ? { ...v, enabled: checked } : v
                                      )
                                    }));
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure Verification
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Review Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Initial Review (Business Hours)</label>
                          <Input defaultValue="24" type="number" placeholder="Hours" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Background Check Processing</label>
                          <Select defaultValue="48">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="24">24 hours</SelectItem>
                              <SelectItem value="48">48 hours</SelectItem>
                              <SelectItem value="72">72 hours</SelectItem>
                              <SelectItem value="168">1 week</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Final Decision Timeline</label>
                          <Input defaultValue="5" type="number" placeholder="Business days" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Auto-reject incomplete applications after:</span>
                            <span className="font-medium">7 days</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Send reminder notifications every:</span>
                            <span className="font-medium">48 hours</span>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleVerificationUpdate}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Timeline
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Approval Process */}
                <TabsContent value="approval" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Approval Workflow Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900">Auto-Approval Criteria</h3>
                          <div className="space-y-3">
                            {registrationConfig.autoApprovalCriteria.map((item, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm">{item.criteria}</span>
                                <Switch 
                                  checked={item.enabled}
                                  onCheckedChange={(checked) => {
                                    setRegistrationConfig(prev => ({
                                      ...prev,
                                      autoApprovalCriteria: prev.autoApprovalCriteria.map((a, i) => 
                                        i === index ? { ...a, enabled: checked } : a
                                      )
                                    }));
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900">Manual Review Required</h3>
                          <div className="space-y-3">
                            {[
                              { criteria: "Criminal background found", severity: "high" },
                              { criteria: "Skills assessment score < 70%", severity: "medium" },
                              { criteria: "Incomplete references", severity: "low" },
                              { criteria: "Multiple account attempts", severity: "high" },
                              { criteria: "Questionable work history", severity: "medium" }
                            ].map((item, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm">{item.criteria}</span>
                                <Badge variant={item.severity === "high" ? "destructive" : item.severity === "medium" ? "secondary" : "outline"}>
                                  {item.severity}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900">Rejection Reasons</h3>
                          <div className="space-y-2">
                            <Input placeholder="Add custom rejection reason..." className="text-sm" />
                            <div className="space-y-1">
                              {[
                                "Insufficient experience",
                                "Failed background check", 
                                "Incomplete application",
                                "Geographic restrictions",
                                "Skills not aligned"
                              ].map((reason, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <span>{reason}</span>
                                  <Button variant="outline" size="sm">
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t">
                        <Button onClick={handleApprovalUpdate}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Approval Settings
                        </Button>
                        <Button variant="outline" onClick={() => handleTestWorkflows("approval")}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Workflow
                        </Button>
                        <Button variant="outline" onClick={handleExportConfiguration}>
                          <Download className="h-4 w-4 mr-2" />
                          Export Configuration
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onboarding Process */}
                <TabsContent value="onboarding" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Welcome Sequence
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {registrationConfig.welcomeSequence.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">{item.step}</div>
                                <div className="text-sm text-gray-500">{item.timing}</div>
                              </div>
                              <Switch 
                                checked={item.enabled}
                                onCheckedChange={(checked) => {
                                  setRegistrationConfig(prev => ({
                                    ...prev,
                                    welcomeSequence: prev.welcomeSequence.map((w, i) => 
                                      i === index ? { ...w, enabled: checked } : w
                                    )
                                  }));
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <Button className="w-full" onClick={handleOnboardingUpdate}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Sequence
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Training Requirements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Required Training Modules</label>
                          <div className="space-y-2">
                            {registrationConfig.trainingModules.map((item, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Switch 
                                    checked={item.required}
                                    onCheckedChange={(checked) => {
                                      setRegistrationConfig(prev => ({
                                        ...prev,
                                        trainingModules: prev.trainingModules.map((t, i) => 
                                          i === index ? { ...t, required: checked } : t
                                        )
                                      }));
                                    }}
                                  />
                                  <span className="text-sm font-medium">{item.module}</span>
                                </div>
                                <span className="text-xs text-gray-500">{item.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Completion Deadline</label>
                          <Select defaultValue="7">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 days</SelectItem>
                              <SelectItem value="7">7 days</SelectItem>
                              <SelectItem value="14">14 days</SelectItem>
                              <SelectItem value="30">30 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleOnboardingUpdate}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Training Config
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Automation Settings */}
                <TabsContent value="automation" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Automated Workflows
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900">Email Automation</h3>
                          <div className="space-y-3">
                            {registrationConfig.emailAutomation.map((item, index) => (
                              <div key={index} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">{item.trigger}</span>
                                  <Switch 
                                    checked={item.enabled}
                                    onCheckedChange={(checked) => {
                                      setRegistrationConfig(prev => ({
                                        ...prev,
                                        emailAutomation: prev.emailAutomation.map((e, i) => 
                                          i === index ? { ...e, enabled: checked } : e
                                        )
                                      }));
                                    }}
                                  />
                                </div>
                                <div className="text-xs text-gray-500">{item.action}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900">Process Automation</h3>
                          <div className="space-y-3">
                            {registrationConfig.processAutomation.map((item, index) => (
                              <div key={index} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">{item.process}</span>
                                  <Switch 
                                    checked={item.enabled}
                                    onCheckedChange={(checked) => {
                                      setRegistrationConfig(prev => ({
                                        ...prev,
                                        processAutomation: prev.processAutomation.map((p, i) => 
                                          i === index ? { ...p, enabled: checked } : p
                                        )
                                      }));
                                    }}
                                  />
                                </div>
                                <div className="text-xs text-gray-500">{item.condition}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t">
                        <Button onClick={handleAutomationUpdate}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Automation Settings
                        </Button>
                        <Button variant="outline" onClick={() => handleTestWorkflows("automation")}>
                          <Play className="h-4 w-4 mr-2" />
                          Test Workflows
                        </Button>
                        <Button variant="outline" onClick={() => handleTestWorkflows("analytics")}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Analytics
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "faqs" && (
            <FAQManagement type="general" />
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
                      <Button onClick={() => {
                        setGeneratedContent(generatedContent);
                        setPolicyContent(generatedContent);
                        savePolicyContent();
                      }}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setPolicyContent(generatedContent);
                        previewPolicy();
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setPolicyContent(generatedContent);
                        exportToPDF();
                      }}>
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
            <FAQManagement type="service-provider" />
          )}

          {activeTab === "jobs" && <JobManagement />}
          
          {activeTab === "diagnostic-tools" && (
            <DiagnosticToolsManagement />
          )}

          {activeTab === "disputes" && <AdminDisputeManagement />}

          {activeTab === "payments" && <PaymentGatewayManagement />}

          {activeTab === "tax" && <TaxManagement />}
          
          {/* Service Management Tabs */}
          {(activeTab === "add-service" || activeTab === "services-list" || activeTab === "service-categories" || activeTab === "service-settings") && (
            <ServiceManagement activeTab={activeTab} />
          )}

          {activeTab === "coupons" && <CouponsManagement />}

          {activeTab === "notifications" && <PushNotifications />}

          {activeTab === "email" && <EmailSystem />}

          {activeTab === "regional-announcements" && <AdminAnnouncements />}

          {activeTab === "price-management" && <PriceManagement />}

          {activeTab === "newsletters" && <NewsletterManagement />}

          {activeTab === "statistics" && <StatisticsPanel />}

          {activeTab === "financial-statements" && <FinancialStatements />}

          {activeTab === "admin-management" && <AdminManagement />}

          {/* Support Management Section */}
          {activeTab === "issue-tracking" && <AdminIssueTracking />}
          
          {activeTab === "live-chat-monitoring" && <AdminLiveChatMonitoring />}
          
          {activeTab === "screen-sharing-sessions" && <AdminScreenSharingSessions />}
          
          {activeTab === "ai-chat-analytics" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">AI Chat Analytics</h2>
                <p className="text-gray-600">Analyze AI chat performance and user interactions</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total AI Chats</p>
                      <p className="text-3xl font-bold text-blue-600">2,847</p>
                      <p className="text-xs text-gray-500 mt-1">+15% this week</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Avg Resolution Rate</p>
                      <p className="text-3xl font-bold text-green-600">78%</p>
                      <p className="text-xs text-gray-500 mt-1">AI resolved issues</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Escalation Rate</p>
                      <p className="text-3xl font-bold text-orange-600">22%</p>
                      <p className="text-xs text-gray-500 mt-1">To human agents</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Avg Satisfaction</p>
                      <p className="text-3xl font-bold text-purple-600">4.2/5</p>
                      <p className="text-xs text-gray-500 mt-1">User ratings</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "phone-support-logs" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Phone Support Logs</h2>
                <p className="text-gray-600">Monitor and analyze phone support activities</p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Phone Support Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-600">
                    Phone support monitoring interface coming soon
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Real-Time Monitoring Section */}
          {activeTab === "websocket-connections" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">WebSocket Connections</h2>
                <p className="text-gray-600">Monitor real-time WebSocket connections and status</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Active Connections</p>
                      <p className="text-3xl font-bold text-green-600">147</p>
                      <p className="text-xs text-gray-500 mt-1">Online now</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Service Providers</p>
                      <p className="text-3xl font-bold text-blue-600">23</p>
                      <p className="text-xs text-gray-500 mt-1">Connected</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Customers</p>
                      <p className="text-3xl font-bold text-purple-600">124</p>
                      <p className="text-xs text-gray-500 mt-1">Active sessions</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Uptime</p>
                      <p className="text-3xl font-bold text-green-600">99.8%</p>
                      <p className="text-xs text-gray-500 mt-1">Last 24h</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "active-sessions" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Active Sessions</h2>
                <p className="text-gray-600">Monitor all active user sessions across the platform</p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Current Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-600">
                    Active session monitoring interface will be displayed here
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Content Management Section */}
          {activeTab === "page-content" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Page Content Management</h2>
                <p className="text-gray-600">Manage content across all customer and service provider pages</p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Content Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium">Customer Home Page</h3>
                        <p className="text-sm text-gray-600 mt-1">Main landing page content</p>
                        <Button className="mt-3" size="sm">Edit Content</Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium">Service Provider Portal</h3>
                        <p className="text-sm text-gray-600 mt-1">Provider onboarding content</p>
                        <Button className="mt-3" size="sm">Edit Content</Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium">Chat Interface</h3>
                        <p className="text-sm text-gray-600 mt-1">AI chat responses and prompts</p>
                        <Button className="mt-3" size="sm">Edit Content</Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "feature-toggles" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Feature Toggles</h2>
                <p className="text-gray-600">Enable or disable platform features for customers and service providers</p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Platform Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">AI Chat Support</h3>
                        <p className="text-sm text-gray-600">Enable AI-powered chat assistance</p>
                      </div>
                      <Button variant="outline">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Screen Sharing</h3>
                        <p className="text-sm text-gray-600">WebRTC screen sharing functionality</p>
                      </div>
                      <Button variant="outline">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Service Provider Booking</h3>
                        <p className="text-sm text-gray-600">Professional service provider requests</p>
                      </div>
                      <Button variant="outline">Enabled</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Technician Referral Program Management Section */}
          {activeTab === "technician-referral-program" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Technician Referral Program Management</h2>
                <p className="text-gray-600">Manage technician-to-technician referral program with unique codes and configurable bonuses</p>
              </div>

              {/* Program Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                        <p className="text-2xl font-bold text-blue-600">247</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">+12% this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Referrers</p>
                        <p className="text-2xl font-bold text-green-600">89</p>
                      </div>
                      <Gift className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">73 new referrals</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Bonuses Paid</p>
                        <p className="text-2xl font-bold text-purple-600">$15,420</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">$2,850 pending</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-bold text-orange-600">68.2%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">+5.1% improvement</p>
                  </CardContent>
                </Card>
              </div>

              {/* Program Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Referral Program Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Program Status</h3>
                        <p className="text-sm text-gray-600">Enable or disable the referral program</p>
                      </div>
                      <Button variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Enabled
                      </Button>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Referral Bonus Amount (CAD)</label>
                      <div className="flex items-center gap-2">
                        <Input type="number" placeholder="150.00" className="flex-1" />
                        <Button size="sm">Update</Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Amount paid to referrer when referred technician completes first job</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Bonus for Referred Technician (CAD)</label>
                      <div className="flex items-center gap-2">
                        <Input type="number" placeholder="75.00" className="flex-1" />
                        <Button size="sm">Update</Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Welcome bonus for new technician upon first job completion</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Jobs Required</label>
                      <div className="flex items-center gap-2">
                        <Input type="number" placeholder="1" className="flex-1" />
                        <Button size="sm">Update</Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Jobs referred technician must complete to trigger bonus</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Referral Code Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Code Format</label>
                      <Select defaultValue="auto">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto-generated (TECH-ABC123)</SelectItem>
                          <SelectItem value="username">Username-based (USERNAME-123)</SelectItem>
                          <SelectItem value="custom">Custom format</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Code Length</label>
                      <Input type="number" defaultValue="8" min="6" max="12" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Sample Codes</label>
                      <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <code className="bg-blue-100 px-2 py-1 rounded">TECH-VAN847</code>
                          <span className="text-gray-500">vanessa1</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <code className="bg-green-100 px-2 py-1 rounded">TECH-GEO123</code>
                          <span className="text-gray-500">georgeskoz</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <code className="bg-purple-100 px-2 py-1 rounded">TECH-DAN456</code>
                          <span className="text-gray-500">dany</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Referrals Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Active Referral Codes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 flex-1 max-w-md">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input placeholder="Search technicians, codes, or referrals..." />
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Generate New Code
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Technician</TableHead>
                            <TableHead>Referral Code</TableHead>
                            <TableHead>Uses</TableHead>
                            <TableHead>Successful</TableHead>
                            <TableHead>Earnings</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <div>
                                <p className="font-medium">Vanessa Martinez</p>
                                <p className="text-sm text-gray-500">vanessa1</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">TECH-VAN847</code>
                            </TableCell>
                            <TableCell>12</TableCell>
                            <TableCell>8</TableCell>
                            <TableCell className="font-medium text-green-600">$1,200</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 border-0">Active</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Settings className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div>
                                <p className="font-medium">Georges Kozaily</p>
                                <p className="text-sm text-gray-500">georgeskoz</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">TECH-GEO123</code>
                            </TableCell>
                            <TableCell>7</TableCell>
                            <TableCell>5</TableCell>
                            <TableCell className="font-medium text-green-600">$750</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 border-0">Active</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Settings className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div>
                                <p className="font-medium">Dany Wilson</p>
                                <p className="text-sm text-gray-500">dany</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">TECH-DAN456</code>
                            </TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>2</TableCell>
                            <TableCell className="font-medium text-green-600">$300</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 border-0">Active</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Settings className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Customer Promotions Section */}
          {activeTab === "customer-promotions" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Customer Promotions Management</h2>
                <p className="text-gray-600">Create and manage promotional coupon codes for customer acquisition and retention</p>
              </div>

              {/* Promotion Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Promotions</p>
                        <p className="text-2xl font-bold text-blue-600">23</p>
                      </div>
                      <Tag className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">5 expiring soon</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
                        <p className="text-2xl font-bold text-green-600">1,847</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">+28% this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Discount Value</p>
                        <p className="text-2xl font-bold text-purple-600">$24,350</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Customer savings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-bold text-orange-600">42.8%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Code to purchase</p>
                  </CardContent>
                </Card>
              </div>

              {/* Create New Promotion */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Create New Promotion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Promotion Name</label>
                      <Input placeholder="e.g., New Customer Welcome 25%" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Coupon Code</label>
                      <div className="flex items-center gap-2">
                        <Input placeholder="WELCOME25" className="flex-1" />
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Discount Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage Discount</SelectItem>
                          <SelectItem value="fixed">Fixed Amount Discount</SelectItem>
                          <SelectItem value="free_service">Free Service Credit</SelectItem>
                          <SelectItem value="bogo">Buy One Get One</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Discount Value</label>
                        <Input type="number" placeholder="25" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Max Uses</label>
                        <Input type="number" placeholder="100" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Start Date</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">End Date</label>
                        <Input type="date" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Target Audience</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new_customers">New Customers Only</SelectItem>
                          <SelectItem value="existing_customers">Existing Customers</SelectItem>
                          <SelectItem value="all_customers">All Customers</SelectItem>
                          <SelectItem value="inactive_customers">Inactive Customers (90+ days)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Promotion
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5" />
                      Promotion Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">Top Performing Promotions</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">WELCOME25</span>
                          <span className="text-sm font-medium text-blue-700">847 uses</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">FIRST50</span>
                          <span className="text-sm font-medium text-blue-700">623 uses</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">HOLIDAY20</span>
                          <span className="text-sm font-medium text-blue-700">377 uses</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-medium text-green-900 mb-2">Customer Acquisition</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">New Customers This Month</span>
                          <span className="text-sm font-medium text-green-700">234</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Via Promotions</span>
                          <span className="text-sm font-medium text-green-700">187 (80%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Avg. Order Value</span>
                          <span className="text-sm font-medium text-green-700">$145</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-medium text-purple-900 mb-2">Revenue Impact</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Revenue Generated</span>
                          <span className="text-sm font-medium text-purple-700">$67,430</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Discounts Given</span>
                          <span className="text-sm font-medium text-purple-700">$24,350</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Net Revenue</span>
                          <span className="text-sm font-medium text-purple-700">$43,080</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Promotions Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Active Promotional Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 flex-1 max-w-md">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input placeholder="Search promotions, codes, or campaigns..." />
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Campaign Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Uses / Limit</TableHead>
                            <TableHead>Valid Until</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <div>
                                <p className="font-medium">New Customer Welcome</p>
                                <p className="text-sm text-gray-500">First-time customer offer</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">WELCOME25</code>
                            </TableCell>
                            <TableCell>25% Off</TableCell>
                            <TableCell>$0 - $50 max</TableCell>
                            <TableCell>847 / 1000</TableCell>
                            <TableCell>Dec 31, 2025</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 border-0">Active</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Settings className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Pause className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div>
                                <p className="font-medium">First Service $50 Off</p>
                                <p className="text-sm text-gray-500">Premium service discount</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">FIRST50</code>
                            </TableCell>
                            <TableCell>$50 Fixed</TableCell>
                            <TableCell>$50 off</TableCell>
                            <TableCell>623 / 800</TableCell>
                            <TableCell>Nov 30, 2025</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 border-0">Active</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Settings className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Pause className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div>
                                <p className="font-medium">Holiday Special</p>
                                <p className="text-sm text-gray-500">Seasonal promotion</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">HOLIDAY20</code>
                            </TableCell>
                            <TableCell>20% Off</TableCell>
                            <TableCell>$0 - $100 max</TableCell>
                            <TableCell>377 / 500</TableCell>
                            <TableCell>Jan 15, 2025</TableCell>
                            <TableCell>
                              <Badge className="bg-orange-100 text-orange-800 border-0">Expiring Soon</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Settings className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Calendar className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {(activeTab === "users" || activeTab === "service-providers" || activeTab === "system-settings" || activeTab === "general-settings") && (
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

      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Update your admin account password. Make sure to use a strong password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Current Password
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePasswordChange}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              <Key className="h-4 w-4 mr-2" />
              Update Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Comprehensive Job Management Component
function JobManagement() {
  const [activeView, setActiveView] = useState("filtered");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionData, setActionData] = useState<any>({});
  const { toast } = useToast();

  // Fetch categorized jobs data
  const { data: categorizedJobs, isLoading: loadingCategorized } = useQuery({
    queryKey: ['/api/admin/jobs/categorized'],
    enabled: activeView === "categorized"
  });

  // Fetch filtered jobs data
  const { data: filteredJobs, isLoading: loadingFiltered, refetch } = useQuery({
    queryKey: ['/api/admin/jobs/filtered', selectedTimeframe, selectedStatus, selectedCategory, searchQuery, currentPage, pageSize],
    enabled: activeView === "filtered",
    queryFn: async () => {
      const params = new URLSearchParams({
        timeframe: selectedTimeframe,
        status: selectedStatus,
        category: selectedCategory,
        search: searchQuery,
        page: currentPage.toString(),
        limit: pageSize.toString()
      });
      
      const response = await fetch(`/api/admin/jobs/filtered?${params}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return response.json();
    }
  });

  // Job action mutations
  const jobActionMutation = useMutation({
    mutationFn: (actionData: any) => {
      switch (actionData.type) {
        case 'complaint':
          return fetch('/api/admin/jobs/complaint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actionData.data)
          });
        case 'investigate':
          return fetch('/api/admin/jobs/investigate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actionData.data)
          });
        case 'refund':
          return fetch('/api/admin/jobs/refund', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actionData.data)
          });
        case 'coupon':
          return fetch('/api/admin/jobs/coupon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actionData.data)
          });
        case 'penalty':
          return fetch('/api/admin/jobs/penalty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actionData.data)
          });
        case 'case_action':
          return fetch('/api/admin/jobs/case-action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actionData.data)
          });
        default:
          return Promise.reject(new Error('Unknown action type'));
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job action completed successfully"
      });
      setShowActionModal(false);
      setActionData({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete job action",
        variant: "destructive"
      });
    }
  });

  const handleJobAction = (job: any, action: string) => {
    setSelectedJob(job);
    setActionType(action);
    setActionData({ jobId: job.id, type: action });
    setShowActionModal(true);
  };

  const submitJobAction = () => {
    jobActionMutation.mutate({
      type: actionType,
      data: actionData
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary", color: "bg-yellow-100 text-yellow-800" },
      in_progress: { variant: "default", color: "bg-blue-100 text-blue-800" },
      completed: { variant: "success", color: "bg-green-100 text-green-800" },
      cancelled: { variant: "destructive", color: "bg-red-100 text-red-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={`${config.color} border-0`}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={`${priorityConfig[priority as keyof typeof priorityConfig]} border-0`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderJobCard = (job: any) => (
    <Card key={job.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-sm">{job.jobNumber}</h3>
            <p className="text-xs text-gray-600 mt-1">{job.title}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(job.status)}
            {getPriorityBadge(job.priority)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
          <div>
            <span className="font-medium">Customer:</span> {job.customer}
          </div>
          <div>
            <span className="font-medium">Technician:</span> {job.technician}
          </div>
          <div>
            <span className="font-medium">Amount:</span> ${job.amount}
          </div>
          <div>
            <span className="font-medium">Duration:</span> {job.duration}min
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedJob(job);
                setShowJobDetails(true);
              }}
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            
            <Select onValueChange={(value) => handleJobAction(job, value)}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="complaint">
                  <Flag className="h-3 w-3 mr-2" />
                  Complaint
                </SelectItem>
                <SelectItem value="investigate">
                  <Search className="h-3 w-3 mr-2" />
                  Investigate
                </SelectItem>
                <SelectItem value="refund">
                  <Receipt className="h-3 w-3 mr-2" />
                  Refund
                </SelectItem>
                <SelectItem value="coupon">
                  <Gift className="h-3 w-3 mr-2" />
                  Coupon
                </SelectItem>
                <SelectItem value="penalty">
                  <Ban className="h-3 w-3 mr-2" />
                  Penalty
                </SelectItem>
                <SelectItem value="case_action">
                  <FolderOpen className="h-3 w-3 mr-2" />
                  Case Action
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-xs text-gray-500">
            {formatDate(job.createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCategorizedView = () => {
    if (loadingCategorized) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {['today', 'yesterday', 'weekly', 'monthly', 'yearly'].map((timeframe) => {
          const jobs = categorizedJobs?.[timeframe] || [];
          if (jobs.length === 0) return null;

          return (
            <div key={timeframe}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Jobs ({jobs.length})
              </h3>
              
              {/* Search for this timeframe */}
              <div className="mb-4">
                <div className="flex items-center gap-2 max-w-md">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={`Search ${timeframe} jobs...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Table view */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Job #</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Technician</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="w-[200px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobs
                          .filter(job => 
                            searchQuery === '' || 
                            job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.technician.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.category.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .slice(0, 50) // Limit to 50 jobs per section
                          .map((job) => (
                            <TableRow key={job.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{job.jobNumber}</TableCell>
                              <TableCell>{job.customer}</TableCell>
                              <TableCell>{job.technician}</TableCell>
                              <TableCell>{job.category}</TableCell>
                              <TableCell>{getStatusBadge(job.status)}</TableCell>
                              <TableCell>{getPriorityBadge(job.priority)}</TableCell>
                              <TableCell>${job.amount}</TableCell>
                              <TableCell>{job.duration}min</TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {new Date(job.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedJob(job);
                                      setShowJobDetails(true);
                                    }}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  
                                  <Select onValueChange={(value) => handleJobAction(job, value)}>
                                    <SelectTrigger className="w-24 h-8">
                                      <SelectValue placeholder="•••" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="complaint">Complaint</SelectItem>
                                      <SelectItem value="investigate">Investigate</SelectItem>
                                      <SelectItem value="refund">Refund</SelectItem>
                                      <SelectItem value="coupon">Coupon</SelectItem>
                                      <SelectItem value="penalty">Penalty</SelectItem>
                                      <SelectItem value="case_action">Case Action</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {jobs.length > 50 && (
                    <div className="p-4 text-center text-sm text-gray-500 border-t">
                      Showing first 50 of {jobs.length} jobs. Use filtered view for more options.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    );
  };

  const renderFilteredView = () => {
    if (loadingFiltered) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    const jobs = filteredJobs?.jobs || [];

    return (
      <div className="space-y-4">
        {/* Advanced Search and Filter Controls */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs, customers, technicians..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="flex-1"
              />
            </div>
            
            <Select value={selectedTimeframe} onValueChange={(value) => {
              setSelectedTimeframe(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="yearly">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={(value) => {
              setSelectedStatus(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Hardware Issues">Hardware Issues</SelectItem>
                <SelectItem value="Software Issues">Software Issues</SelectItem>
                <SelectItem value="Network Troubleshooting">Network Troubleshooting</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Database Help">Database Help</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Page Size Selection */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <Select value={pageSize.toString()} onValueChange={(value) => {
                setPageSize(parseInt(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">per page</span>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedTimeframe("all");
                setSelectedStatus("all");
                setSelectedCategory("all");
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        {filteredJobs && (
          <div className="flex justify-between items-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <div>
              {filteredJobs.totalCount === 0 ? (
                "No jobs found matching your criteria"
              ) : (
                <>
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredJobs.totalCount)} of {filteredJobs.totalCount} jobs
                </>
              )}
            </div>
            <div>
              Page {currentPage} of {filteredJobs.totalPages || 1}
            </div>
          </div>
        )}

        {/* Table view for filtered jobs */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Job #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[200px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                        No jobs found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobs.map((job) => (
                      <TableRow key={job.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{job.jobNumber}</TableCell>
                        <TableCell>{job.customer}</TableCell>
                        <TableCell>{job.technician}</TableCell>
                        <TableCell>{job.category}</TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                        <TableCell>{getPriorityBadge(job.priority)}</TableCell>
                        <TableCell>${job.amount}</TableCell>
                        <TableCell>{job.duration}min</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedJob(job);
                                setShowJobDetails(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            
                            <Select onValueChange={(value) => handleJobAction(job, value)}>
                              <SelectTrigger className="w-24 h-8">
                                <SelectValue placeholder="•••" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="complaint">Complaint</SelectItem>
                                <SelectItem value="investigate">Investigate</SelectItem>
                                <SelectItem value="refund">Refund</SelectItem>
                                <SelectItem value="coupon">Coupon</SelectItem>
                                <SelectItem value="penalty">Penalty</SelectItem>
                                <SelectItem value="case_action">Case Action</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        {filteredJobs && filteredJobs.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {[...Array(Math.min(5, filteredJobs.totalPages))].map((_, index) => {
                const pageNum = Math.max(1, Math.min(
                  filteredJobs.totalPages - 4,
                  Math.max(1, currentPage - 2)
                )) + index;
                
                if (pageNum <= filteredJobs.totalPages) {
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8"
                    >
                      {pageNum}
                    </Button>
                  );
                }
                return null;
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === filteredJobs.totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(filteredJobs.totalPages)}
              disabled={currentPage === filteredJobs.totalPages}
            >
              Last
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderJobDetailsModal = () => (
    <Dialog open={showJobDetails} onOpenChange={setShowJobDetails}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Job Details - {selectedJob?.jobNumber}</DialogTitle>
        </DialogHeader>
        
        {selectedJob && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Job Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Title:</strong> {selectedJob.title}</div>
                  <div><strong>Description:</strong> {selectedJob.description}</div>
                  <div><strong>Category:</strong> {selectedJob.category}</div>
                  <div><strong>Service Type:</strong> {selectedJob.serviceType}</div>
                  <div><strong>Priority:</strong> {getPriorityBadge(selectedJob.priority)}</div>
                  <div><strong>Status:</strong> {getStatusBadge(selectedJob.status)}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Participants</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Customer:</strong> {selectedJob.customer}</div>
                  <div><strong>Customer Email:</strong> {selectedJob.customerEmail}</div>
                  <div><strong>Technician:</strong> {selectedJob.technician}</div>
                  <div><strong>Technician Email:</strong> {selectedJob.technicianEmail}</div>
                  <div><strong>Location:</strong> {selectedJob.location}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Financial Details</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Amount:</strong> ${selectedJob.amount}</div>
                  <div><strong>Duration:</strong> {selectedJob.duration} minutes</div>
                  <div><strong>Rating:</strong> {selectedJob.rating}/5 stars</div>
                  <div><strong>Feedback:</strong> {selectedJob.feedback}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Created:</strong> {formatDate(selectedJob.createdAt)}</div>
                  <div><strong>Assigned:</strong> {formatDate(selectedJob.assignedAt)}</div>
                  <div><strong>Started:</strong> {formatDate(selectedJob.startedAt)}</div>
                  <div><strong>Completed:</strong> {formatDate(selectedJob.completedAt)}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowJobDetails(false);
                  handleJobAction(selectedJob, 'complaint');
                }}
              >
                <Flag className="h-4 w-4 mr-2" />
                File Complaint
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowJobDetails(false);
                  handleJobAction(selectedJob, 'investigate');
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                Investigate
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowJobDetails(false);
                  handleJobAction(selectedJob, 'refund');
                }}
              >
                <Receipt className="h-4 w-4 mr-2" />
                Process Refund
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const renderActionModal = () => (
    <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === 'complaint' && 'File Complaint'}
            {actionType === 'investigate' && 'Start Investigation'}
            {actionType === 'refund' && 'Process Refund'}
            {actionType === 'coupon' && 'Create Coupon'}
            {actionType === 'penalty' && 'Apply Penalty'}
            {actionType === 'case_action' && 'Case Action'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {actionType === 'complaint' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Complaint Type</label>
                <Select 
                  value={actionData.category} 
                  onValueChange={(value) => setActionData({...actionData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select complaint type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="behavior">Behavior Issue</SelectItem>
                    <SelectItem value="quality">Service Quality</SelectItem>
                    <SelectItem value="billing">Billing Dispute</SelectItem>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Severity</label>
                <Select 
                  value={actionData.severity} 
                  onValueChange={(value) => setActionData({...actionData, severity: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea 
                  value={actionData.description} 
                  onChange={(e) => setActionData({...actionData, description: e.target.value})}
                  placeholder="Describe the complaint in detail..."
                  className="min-h-[100px]"
                />
              </div>
            </>
          )}

          {actionType === 'investigate' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Investigation Type</label>
                <Select 
                  value={actionData.investigationType} 
                  onValueChange={(value) => setActionData({...actionData, investigationType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select investigation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quality">Quality Review</SelectItem>
                    <SelectItem value="fraud">Fraud Investigation</SelectItem>
                    <SelectItem value="performance">Performance Review</SelectItem>
                    <SelectItem value="compliance">Compliance Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <Select 
                  value={actionData.priority} 
                  onValueChange={(value) => setActionData({...actionData, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Investigation Notes</label>
                <Textarea 
                  value={actionData.notes} 
                  onChange={(e) => setActionData({...actionData, notes: e.target.value})}
                  placeholder="Enter investigation details and initial findings..."
                  className="min-h-[100px]"
                />
              </div>
            </>
          )}

          {actionType === 'refund' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Refund Amount</label>
                <Input 
                  type="number" 
                  value={actionData.amount} 
                  onChange={(e) => setActionData({...actionData, amount: e.target.value})}
                  placeholder="Enter refund amount"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Refund Reason</label>
                <Select 
                  value={actionData.reason} 
                  onValueChange={(value) => setActionData({...actionData, reason: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select refund reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service_unsatisfactory">Service Unsatisfactory</SelectItem>
                    <SelectItem value="technician_issue">Technician Issue</SelectItem>
                    <SelectItem value="billing_error">Billing Error</SelectItem>
                    <SelectItem value="service_incomplete">Service Incomplete</SelectItem>
                    <SelectItem value="customer_request">Customer Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Refund Notes</label>
                <Textarea 
                  value={actionData.notes} 
                  onChange={(e) => setActionData({...actionData, notes: e.target.value})}
                  placeholder="Enter refund processing notes..."
                  className="min-h-[100px]"
                />
              </div>
            </>
          )}

          {actionType === 'coupon' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Coupon Code</label>
                <Input 
                  value={actionData.code} 
                  onChange={(e) => setActionData({...actionData, code: e.target.value})}
                  placeholder="Enter coupon code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Discount Type</label>
                <Select 
                  value={actionData.discountType} 
                  onValueChange={(value) => setActionData({...actionData, discountType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Discount Value</label>
                <Input 
                  type="number" 
                  value={actionData.value} 
                  onChange={(e) => setActionData({...actionData, value: e.target.value})}
                  placeholder="Enter discount value"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expiry Date</label>
                <Input 
                  type="date" 
                  value={actionData.expiryDate} 
                  onChange={(e) => setActionData({...actionData, expiryDate: e.target.value})}
                />
              </div>
            </>
          )}

          {actionType === 'penalty' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Penalty Type</label>
                <Select 
                  value={actionData.penaltyType} 
                  onValueChange={(value) => setActionData({...actionData, penaltyType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select penalty type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="fine">Fine</SelectItem>
                    <SelectItem value="suspension">Suspension</SelectItem>
                    <SelectItem value="termination">Termination</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Penalty Amount</label>
                <Input 
                  type="number" 
                  value={actionData.amount} 
                  onChange={(e) => setActionData({...actionData, amount: e.target.value})}
                  placeholder="Enter penalty amount (if applicable)"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Penalty Reason</label>
                <Textarea 
                  value={actionData.reason} 
                  onChange={(e) => setActionData({...actionData, reason: e.target.value})}
                  placeholder="Enter penalty reason and details..."
                  className="min-h-[100px]"
                />
              </div>
            </>
          )}

          {actionType === 'case_action' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Case Action</label>
                <Select 
                  value={actionData.caseAction} 
                  onValueChange={(value) => setActionData({...actionData, caseAction: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select case action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open_case">Open Case</SelectItem>
                    <SelectItem value="escalate">Escalate</SelectItem>
                    <SelectItem value="resolve">Resolve</SelectItem>
                    <SelectItem value="close_case">Close Case</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Case Notes</label>
                <Textarea 
                  value={actionData.caseNotes} 
                  onChange={(e) => setActionData({...actionData, caseNotes: e.target.value})}
                  placeholder="Enter case management notes..."
                  className="min-h-[100px]"
                />
              </div>
            </>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowActionModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitJobAction}
              disabled={jobActionMutation.isPending}
            >
              {jobActionMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded">
            💡 Use Advanced Search for detailed job management with pagination
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === "filtered" ? "default" : "outline"}
              onClick={() => setActiveView("filtered")}
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Search
            </Button>
            <Button
              variant={activeView === "categorized" ? "default" : "outline"}
              onClick={() => setActiveView("categorized")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Quick Overview
            </Button>
          </div>
        </div>
      </div>

      {activeView === "categorized" && renderCategorizedView()}
      {activeView === "filtered" && renderFilteredView()}

      {renderJobDetailsModal()}
      {renderActionModal()}
    </div>
  );
}