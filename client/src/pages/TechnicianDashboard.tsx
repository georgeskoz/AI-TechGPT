import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  DollarSign, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  Star,
  TrendingUp,
  Settings
} from "lucide-react";
import type { Technician, ServiceRequest, Job } from "@shared/schema";

interface TechnicianDashboardProps {
  technicianId: number;
  userId: number;
}

export default function TechnicianDashboard({ technicianId, userId }: TechnicianDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: technician, isLoading: technicianLoading } = useQuery({
    queryKey: [`/api/technicians/${technicianId}`],
  });

  const { data: serviceRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: [`/api/service-requests/technician/${technicianId}`],
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: [`/api/jobs/technician/${technicianId}`],
  });

  if (technicianLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Technician Profile Not Found</h2>
        <p className="text-gray-600">Unable to load your technician profile.</p>
      </div>
    );
  }

  const pendingRequests = serviceRequests.filter((req: ServiceRequest) => req.status === "pending");
  const activeJobs = jobs.filter((job: Job) => ["assigned", "started", "in_progress"].includes(job.status));
  const completedJobs = jobs.filter((job: Job) => job.status === "completed");
  
  const totalEarnings = completedJobs.reduce((sum: number, job: Job) => {
    return sum + (parseFloat(job.finalPrice || "0"));
  }, 0);

  const averageRating = completedJobs.length > 0 
    ? completedJobs.reduce((sum: number, job: Job) => sum + (job.customerRating || 0), 0) / completedJobs.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Technician Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {technician.companyName || "Technician"}!</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold">{activeJobs.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                <p className="text-2xl font-bold">{completedJobs.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Service Requests</TabsTrigger>
          <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
          <TabsTrigger value="history">Job History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{technician.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{technician.experience}</Badge>
                  <Badge variant="outline">${technician.hourlyRate}/hour</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{averageRating.toFixed(1)} average rating</span>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {technician.skills?.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeJobs.slice(0, 3).map((job: Job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Job #{job.id}</p>
                        <p className="text-sm text-gray-600">{job.status}</p>
                      </div>
                      <Badge
                        variant={
                          job.status === "completed" ? "default" :
                          job.status === "in_progress" ? "secondary" : "outline"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                  ))}
                  {activeJobs.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No active jobs</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Service Requests</CardTitle>
              <CardDescription>
                Review and accept service requests from customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map((request: ServiceRequest) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{request.title}</h3>
                      <Badge variant="outline">{request.urgency}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{request.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{request.category} → {request.subcategory}</span>
                      <span>{request.serviceType}</span>
                      <span>${request.budget}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Accept Request</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
                {pendingRequests.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No pending requests</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Jobs</CardTitle>
              <CardDescription>
                Manage your current job assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeJobs.map((job: Job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Job #{job.id}</h3>
                      <Badge
                        variant={
                          job.status === "in_progress" ? "default" :
                          job.status === "started" ? "secondary" : "outline"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>${job.finalPrice}</span>
                      {job.startedAt && (
                        <span>Started: {new Date(job.startedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Update Status</Button>
                      <Button size="sm" variant="outline">Add Update</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
                {activeJobs.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No active jobs</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job History</CardTitle>
              <CardDescription>
                View your completed jobs and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedJobs.map((job: Job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Job #{job.id}</h3>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${job.finalPrice}</p>
                        {job.customerRating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs">{job.customerRating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {job.completedAt && (
                      <p className="text-sm text-gray-500">
                        Completed: {new Date(job.completedAt).toLocaleDateString()}
                      </p>
                    )}
                    {job.customerFeedback && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        "{job.customerFeedback}"
                      </p>
                    )}
                  </div>
                ))}
                {completedJobs.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No completed jobs yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}