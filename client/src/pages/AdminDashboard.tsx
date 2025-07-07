import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Wrench, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Star,
  DollarSign,
  Search,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal
} from "lucide-react";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState("overview");

  // Mock data for demonstration - in production, this would come from API
  const { data: dashboardData } = useQuery({
    queryKey: ["/api/admin/dashboard"],
    queryFn: async () => ({
      stats: {
        totalUsers: 12543,
        totalTechnicians: 2876,
        activeJobs: 145,
        completedJobs: 8932,
        totalRevenue: 2456789,
        disputesClosed: 23,
        avgRating: 4.7
      },
      analytics: {
        popularServices: [
          { name: "Hardware Issues", count: 1234, revenue: 89456 },
          { name: "Network Troubleshooting", count: 987, revenue: 76543 },
          { name: "Software Issues", count: 856, revenue: 54321 },
          { name: "Web Development", count: 743, revenue: 98765 },
          { name: "Database Help", count: 623, revenue: 67890 }
        ],
        topTechnicians: [
          { id: 1, name: "Sarah Johnson", rating: 4.9, jobs: 245, earnings: 18750 },
          { id: 2, name: "Mike Chen", rating: 4.8, jobs: 198, earnings: 15840 },
          { id: 3, name: "Emma Wilson", rating: 4.9, jobs: 187, earnings: 16230 },
          { id: 4, name: "David Brown", rating: 4.7, jobs: 176, earnings: 14560 },
          { id: 5, name: "Lisa Garcia", rating: 4.8, jobs: 165, earnings: 13890 }
        ],
        busyHours: [
          { hour: "9 AM", jobs: 45 },
          { hour: "10 AM", jobs: 67 },
          { hour: "11 AM", jobs: 78 },
          { hour: "12 PM", jobs: 89 },
          { hour: "1 PM", jobs: 92 },
          { hour: "2 PM", jobs: 87 },
          { hour: "3 PM", jobs: 94 },
          { hour: "4 PM", jobs: 76 },
          { hour: "5 PM", jobs: 58 }
        ]
      }
    })
  });

  const { data: usersData } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => [
      { id: 1, name: "John Doe", email: "john@example.com", type: "customer", status: "active", joinDate: "2024-01-15", totalSpent: 450 },
      { id: 2, name: "Jane Smith", email: "jane@example.com", type: "customer", status: "active", joinDate: "2024-01-20", totalSpent: 720 },
      { id: 3, name: "Bob Wilson", email: "bob@example.com", type: "customer", status: "suspended", joinDate: "2024-01-25", totalSpent: 180 },
      { id: 4, name: "Alice Brown", email: "alice@example.com", type: "customer", status: "active", joinDate: "2024-02-01", totalSpent: 990 }
    ]
  });

  const { data: techniciansData } = useQuery({
    queryKey: ["/api/admin/technicians"],
    queryFn: async () => [
      { id: 1, name: "Sarah Johnson", email: "sarah@example.com", rating: 4.9, jobs: 245, earnings: 18750, status: "verified", joinDate: "2023-11-10" },
      { id: 2, name: "Mike Chen", email: "mike@example.com", rating: 4.8, jobs: 198, earnings: 15840, status: "verified", joinDate: "2023-12-05" },
      { id: 3, name: "Emma Wilson", email: "emma@example.com", rating: 4.9, jobs: 187, earnings: 16230, status: "pending", joinDate: "2024-01-12" },
      { id: 4, name: "David Brown", email: "david@example.com", rating: 4.7, jobs: 176, earnings: 14560, status: "verified", joinDate: "2024-01-18" }
    ]
  });

  const { data: jobsData } = useQuery({
    queryKey: ["/api/admin/jobs"],
    queryFn: async () => [
      { id: 1, customer: "John Doe", technician: "Sarah Johnson", service: "Hardware Issues", status: "in_progress", amount: 120, created: "2024-01-07 10:30" },
      { id: 2, customer: "Jane Smith", technician: "Mike Chen", service: "Network Setup", status: "completed", amount: 200, created: "2024-01-07 09:15" },
      { id: 3, customer: "Bob Wilson", technician: "Emma Wilson", service: "Software Issues", status: "disputed", amount: 80, created: "2024-01-07 08:45" },
      { id: 4, customer: "Alice Brown", technician: "David Brown", service: "Web Development", status: "in_progress", amount: 350, created: "2024-01-07 11:20" }
    ]
  });

  const { data: disputesData } = useQuery({
    queryKey: ["/api/admin/disputes"],
    queryFn: async () => [
      { id: 1, jobId: 3, customer: "Bob Wilson", technician: "Emma Wilson", reason: "Service not completed", status: "open", created: "2024-01-07 12:00" },
      { id: 2, jobId: 15, customer: "Tom Johnson", technician: "Sarah Johnson", reason: "Billing issue", status: "resolved", created: "2024-01-06 14:30" },
      { id: 3, jobId: 22, customer: "Mary Davis", technician: "Mike Chen", reason: "Quality concerns", status: "investigating", created: "2024-01-05 16:45" }
    ]
  });

  const stats = dashboardData?.stats || {};
  const analytics = dashboardData?.analytics || {};

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": case "verified": case "completed": case "resolved": return "bg-green-100 text-green-800";
      case "pending": case "investigating": case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "suspended": case "disputed": case "open": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users, technicians, jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </Button>
        </div>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="technicians">Technicians</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers?.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Technicians</p>
                    <p className="text-2xl font-bold">{stats.totalTechnicians?.toLocaleString()}</p>
                  </div>
                  <Wrench className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold">{stats.activeJobs}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue?.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.popularServices?.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.count} jobs</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${service.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Technicians</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topTechnicians?.map((tech, index) => (
                    <div key={tech.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{tech.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{tech.rating}</span>
                          <span>•</span>
                          <span>{tech.jobs} jobs</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${tech.earnings.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Busiest Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.busyHours?.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{hour.hour}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(hour.jobs / 100) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{hour.jobs}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usersData?.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                        <span>Total Spent: ${user.totalSpent}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technician Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {techniciansData?.map((tech) => (
                  <div key={tech.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{tech.name}</p>
                          <p className="text-sm text-gray-600">{tech.email}</p>
                        </div>
                        <Badge className={getStatusColor(tech.status)}>
                          {tech.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{tech.rating}</span>
                        </div>
                        <span>{tech.jobs} jobs</span>
                        <span>${tech.earnings.toLocaleString()} earned</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobsData?.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">#{job.id} - {job.service}</p>
                          <p className="text-sm text-gray-600">{job.customer} → {job.technician}</p>
                        </div>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>${job.amount}</span>
                        <span>{job.created}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {job.status === "disputed" && (
                        <Button variant="outline" size="sm">
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dispute Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {disputesData?.map((dispute) => (
                  <div key={dispute.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">Dispute #{dispute.id}</p>
                          <p className="text-sm text-gray-600">{dispute.customer} vs {dispute.technician}</p>
                        </div>
                        <Badge className={getStatusColor(dispute.status)}>
                          {dispute.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Reason: {dispute.reason}</span>
                        <span>Created: {dispute.created}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {dispute.status === "open" && (
                        <>
                          <Button variant="outline" size="sm">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}