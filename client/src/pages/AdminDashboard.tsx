import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
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
  MapPin,
  Phone,
  Mail,
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
  Globe
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeTechnicians: number;
  completedJobs: number;
  totalRevenue: number;
  pendingDisputes: number;
  averageRating: number;
  responseTime: string;
  uptime: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  status?: string;
  joinDate?: string;
  totalSpent?: number;
  completedJobs?: number;
  createdAt?: string;
}

interface Technician {
  id: number;
  businessName?: string;
  contactPerson?: string;
  email: string;
  skills?: string[];
  specialties?: string[];
  rating?: number;
  completedJobs?: number;
  earnings?: number;
  isActive?: boolean;
  status?: string;
  serviceArea?: string;
  location?: string;
  joinDate?: string;
  verification?: string;
  createdAt?: string;
}

interface Job {
  id: number;
  customerName: string;
  technicianName: string;
  category: string;
  status: string;
  amount: number;
  createdAt: string;
  completedAt?: string;
  rating?: number;
}

interface Dispute {
  id: number;
  jobId: number;
  customerName: string;
  technicianName: string;
  issue: string;
  status: string;
  createdAt: string;
  priority: string;
}

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch dashboard stats
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard");
      const data = await response.json();
      return data.stats;
    }
  });

  // Fetch users
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  // Fetch technicians
  const { data: technicians = [] } = useQuery<Technician[]>({
    queryKey: ["/api/admin/technicians"],
  });

  // Fetch jobs
  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ["/api/admin/jobs"],
  });

  // Fetch disputes
  const { data: disputes = [] } = useQuery<Dispute[]>({
    queryKey: ["/api/admin/disputes"],
  });

  // Fetch complaints
  const { data: complaints = [] } = useQuery({
    queryKey: ["/api/admin/complaints"],
  });

  // Fetch pending technician approvals
  const { data: pendingApprovals = [] } = useQuery({
    queryKey: ["/api/admin/technicians/pending-approvals"],
  });

  // Fetch pending background checks
  const { data: pendingBackgroundChecks = [] } = useQuery({
    queryKey: ["/api/admin/background-checks/pending"],
  });

  // Update user status mutation
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: number; status: string }) => {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Success", description: "User status updated successfully" });
    }
  });

  // Update technician status mutation
  const updateTechnicianStatusMutation = useMutation({
    mutationFn: async ({ technicianId, status }: { technicianId: number; status: string }) => {
      const response = await fetch(`/api/admin/technicians/${technicianId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/technicians"] });
      toast({ title: "Success", description: "Technician status updated successfully" });
    }
  });

  // Approve technician mutation
  const approveTechnicianMutation = useMutation({
    mutationFn: async ({ technicianId, notes }: { technicianId: number; notes?: string }) => {
      const response = await fetch(`/api/admin/technicians/${technicianId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      });
      if (!response.ok) throw new Error("Failed to approve technician");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/technicians"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/technicians/pending-approvals"] });
      toast({ 
        title: "Success", 
        description: "Technician approved successfully",
        variant: "default"
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to approve technician",
        variant: "destructive"
      });
    }
  });

  // Reject technician mutation
  const rejectTechnicianMutation = useMutation({
    mutationFn: async ({ technicianId, reason }: { technicianId: number; reason: string }) => {
      const response = await fetch(`/api/admin/technicians/${technicianId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });
      if (!response.ok) throw new Error("Failed to reject technician");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/technicians"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/technicians/pending-approvals"] });
      toast({ 
        title: "Success", 
        description: "Technician rejected",
        variant: "default"
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to reject technician",
        variant: "destructive"
      });
    }
  });

  // Update complaint status mutation
  const updateComplaintStatusMutation = useMutation({
    mutationFn: async ({ complaintId, status, notes }: { complaintId: number; status: string; notes?: string }) => {
      const response = await fetch(`/api/admin/complaints/${complaintId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes })
      });
      if (!response.ok) throw new Error("Failed to update complaint status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/complaints"] });
      toast({ 
        title: "Success", 
        description: "Complaint status updated successfully",
        variant: "default"
      });
    }
  });

  // Resolve complaint mutation
  const resolveComplaintMutation = useMutation({
    mutationFn: async ({ complaintId, resolution }: { complaintId: number; resolution: string }) => {
      const response = await fetch(`/api/admin/complaints/${complaintId}/resolve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution })
      });
      if (!response.ok) throw new Error("Failed to resolve complaint");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/complaints"] });
      toast({ 
        title: "Success", 
        description: "Complaint resolved successfully",
        variant: "default"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-blue-100 text-blue-800",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const filteredUsers = users.filter(user => {
    const status = user.status || "active";
    const fullName = user.fullName || "Unknown";
    
    return (filterStatus === "all" || status === filterStatus) &&
      (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       fullName.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const filteredTechnicians = technicians.filter(tech => {
    const name = tech.businessName || tech.contactPerson || "Unknown";
    const status = tech.status || (tech.isActive ? "active" : "inactive");
    const skills = tech.skills || tech.specialties || [];
    
    return (filterStatus === "all" || status === filterStatus) &&
      (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       tech.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())));
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        title="Admin Dashboard" 
        backTo="/admin-home" 
        showHomeButton={false}
      />
      
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Platform Management</h1>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Shield className="h-3 w-3 mr-1" />
                Administrator
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/admin-earnings")}
                className="flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Earnings Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                </div>
                <div className="bg-blue-400 p-3 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Technicians</p>
                  <p className="text-3xl font-bold">{stats?.activeTechnicians || 0}</p>
                </div>
                <div className="bg-green-400 p-3 rounded-lg">
                  <Settings className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Completed Jobs</p>
                  <p className="text-3xl font-bold">{stats?.completedJobs || 0}</p>
                </div>
                <div className="bg-purple-400 p-3 rounded-lg">
                  <Briefcase className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold">${(stats?.totalRevenue || 0).toLocaleString()}</p>
                </div>
                <div className="bg-orange-400 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats?.pendingDisputes || 0}</p>
              <p className="text-sm text-gray-600">Pending Disputes</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats?.averageRating || 0}</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats?.responseTime || "2m"}</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats?.uptime || "99.9%"}</p>
              <p className="text-sm text-gray-600">System Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="technicians" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Technicians
              {pendingApprovals.length > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {pendingApprovals.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="complaints" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Complaints
              {complaints.filter((c: any) => c.status === 'pending').length > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {complaints.filter((c: any) => c.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="disputes" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Disputes
            </TabsTrigger>
          </TabsList>

          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-lg border">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users, technicians, or jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </span>
                  <Badge variant="outline">{filteredUsers.length} users</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Jobs Completed</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        const fullName = user.fullName || user.username || "Unknown";
                        const status = user.status || "active";
                        const completedJobs = user.completedJobs || 0;
                        const totalSpent = user.totalSpent || 0;
                        const joinDate = user.joinDate || user.createdAt || "Unknown";
                        
                        return (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{fullName}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(status)}>
                                {status}
                              </Badge>
                            </TableCell>
                            <TableCell>{completedJobs}</TableCell>
                            <TableCell>${totalSpent.toLocaleString()}</TableCell>
                            <TableCell>{joinDate}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>User Details</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="text-sm font-medium">Full Name</label>
                                        <p className="text-sm text-gray-600">{fullName}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Username</label>
                                        <p className="text-sm text-gray-600">{user.username}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Status</label>
                                        <Badge className={getStatusBadge(status)}>
                                          {status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                
                                <Select
                                  value={status}
                                  onValueChange={(newStatus) => 
                                    updateUserStatusMutation.mutate({ userId: user.id, status: newStatus })
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technicians Tab */}
          <TabsContent value="technicians">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Technician Management
                  </span>
                  <Badge variant="outline">{filteredTechnicians.length} technicians</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Technician</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Completed Jobs</TableHead>
                        <TableHead>Earnings</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTechnicians.map((technician) => {
                        const name = technician.businessName || technician.contactPerson || "Unknown";
                        const status = technician.status || (technician.isActive ? "active" : "inactive");
                        const location = technician.serviceArea || technician.location || "Not specified";
                        const skills = technician.skills || technician.specialties || [];
                        const rating = technician.rating || 0;
                        const completedJobs = technician.completedJobs || 0;
                        const earnings = technician.earnings || 0;
                        
                        return (
                          <TableRow key={technician.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{name}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {location}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(status)}>
                                {status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                {typeof rating === 'number' ? rating.toFixed(1) : '0.0'}
                              </div>
                            </TableCell>
                            <TableCell>{completedJobs}</TableCell>
                            <TableCell>${earnings.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {skills.slice(0, 2).map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {skills.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{skills.length - 2}
                                  </Badge>
                                )}
                                {skills.length === 0 && (
                                  <Badge variant="outline" className="text-xs text-gray-400">
                                    No skills listed
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                <Select
                                  value={status}
                                  onValueChange={(newStatus) => 
                                    updateTechnicianStatusMutation.mutate({ 
                                      technicianId: technician.id, 
                                      status: newStatus 
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>

                                {/* Approval/Rejection Actions */}
                                {status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => approveTechnicianMutation.mutate({ 
                                        technicianId: technician.id, 
                                        notes: "Approved by admin" 
                                      })}
                                      disabled={approveTechnicianMutation.isPending}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => rejectTechnicianMutation.mutate({ 
                                        technicianId: technician.id, 
                                        reason: "Rejected by admin" 
                                      })}
                                      disabled={rejectTechnicianMutation.isPending}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Job Management
                  </span>
                  <Badge variant="outline">{jobs.length} jobs</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Technician</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell>#{job.id}</TableCell>
                          <TableCell>{job.customerName}</TableCell>
                          <TableCell>{job.technicianName}</TableCell>
                          <TableCell>{job.category}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(job.status)}>
                              {job.status}
                            </Badge>
                          </TableCell>
                          <TableCell>${job.amount}</TableCell>
                          <TableCell>{job.createdAt}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complaints Tab */}
          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Complaint Management
                  </span>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    {complaints.length} complaints
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search complaints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Complaint ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Complainant</TableHead>
                        <TableHead>Against</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complaints.map((complaint: any) => (
                        <TableRow key={complaint.id}>
                          <TableCell>#{complaint.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{complaint.complaintType}</Badge>
                          </TableCell>
                          <TableCell>{complaint.complainantName || 'Anonymous'}</TableCell>
                          <TableCell>{complaint.againstTechnicianName || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(complaint.status)}>
                              {complaint.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={complaint.priority === 'high' ? 'destructive' : complaint.priority === 'medium' ? 'default' : 'secondary'}>
                              {complaint.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Complaint Details</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">Complaint Type</label>
                                      <p className="text-sm text-gray-600">{complaint.complaintType}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Description</label>
                                      <p className="text-sm text-gray-600">{complaint.description}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Evidence</label>
                                      <p className="text-sm text-gray-600">{complaint.evidence || 'No evidence provided'}</p>
                                    </div>
                                    <div className="flex gap-4">
                                      <Select
                                        value={complaint.status}
                                        onValueChange={(newStatus) => 
                                          updateComplaintStatusMutation.mutate({ 
                                            complaintId: complaint.id, 
                                            status: newStatus,
                                            notes: "Status updated by admin"
                                          })
                                        }
                                      >
                                        <SelectTrigger className="w-48">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="investigating">Investigating</SelectItem>
                                          <SelectItem value="resolved">Resolved</SelectItem>
                                          <SelectItem value="closed">Closed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      {complaint.status !== 'resolved' && (
                                        <Button
                                          onClick={() => resolveComplaintMutation.mutate({ 
                                            complaintId: complaint.id, 
                                            resolution: "Resolved by admin review"
                                          })}
                                          disabled={resolveComplaintMutation.isPending}
                                          variant="default"
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          Mark Resolved
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Dispute Management
                  </span>
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    {disputes.length} disputes
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dispute ID</TableHead>
                        <TableHead>Job ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Technician</TableHead>
                        <TableHead>Issue</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {disputes.map((dispute) => (
                        <TableRow key={dispute.id}>
                          <TableCell>#{dispute.id}</TableCell>
                          <TableCell>#{dispute.jobId}</TableCell>
                          <TableCell>{dispute.customerName}</TableCell>
                          <TableCell>{dispute.technicianName}</TableCell>
                          <TableCell className="max-w-xs truncate">{dispute.issue}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                dispute.priority === "high" ? "bg-red-100 text-red-800" :
                                dispute.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              }
                            >
                              {dispute.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(dispute.status)}>
                              {dispute.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{dispute.createdAt}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {dispute.status === "pending" && (
                                <Button size="sm" variant="outline">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}