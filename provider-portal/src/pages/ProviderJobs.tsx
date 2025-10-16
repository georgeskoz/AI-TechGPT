import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, DollarSign, User } from "lucide-react";
import ProviderLayout from "../components/ProviderLayout";

export default function ProviderJobs() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["/api/provider/jobs"],
  });

  const activeJobs = jobs?.filter((job: any) => job.status === "active") || [];
  const pendingJobs = jobs?.filter((job: any) => job.status === "pending") || [];
  const completedJobs = jobs?.filter((job: any) => job.status === "completed") || [];

  const JobCard = ({ job }: { job: any }) => (
    <Card className="hover:shadow-lg transition">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {job.customerName}
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </span>
            </div>
          </div>
          <Badge variant={job.status === "active" ? "default" : job.status === "completed" ? "secondary" : "outline"}>
            {job.status}
          </Badge>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">{job.description}</p>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-green-600 font-semibold">
              <DollarSign className="h-4 w-4" />
              {job.amount}
            </span>
            <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              {job.duration}
            </span>
          </div>
          <div className="space-x-2">
            {job.status === "pending" && (
              <>
                <Button size="sm" variant="outline" data-testid={`button-decline-${job.id}`}>Decline</Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" data-testid={`button-accept-${job.id}`}>Accept</Button>
              </>
            )}
            {job.status === "active" && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" data-testid={`button-complete-${job.id}`}>Mark Complete</Button>
            )}
            {job.status === "completed" && (
              <Button size="sm" variant="outline" data-testid={`button-view-${job.id}`}>View Details</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ProviderLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your service requests and assignments</p>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active" data-testid="tab-active">
              Active ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending">
              Pending ({pendingJobs.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">
              Completed ({completedJobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {isLoading ? (
              <p className="text-center py-8">Loading jobs...</p>
            ) : activeJobs.length > 0 ? (
              activeJobs.map((job: any) => <JobCard key={job.id} job={job} />)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">No active jobs at the moment</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {isLoading ? (
              <p className="text-center py-8">Loading jobs...</p>
            ) : pendingJobs.length > 0 ? (
              pendingJobs.map((job: any) => <JobCard key={job.id} job={job} />)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">No pending job requests</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {isLoading ? (
              <p className="text-center py-8">Loading jobs...</p>
            ) : completedJobs.length > 0 ? (
              completedJobs.map((job: any) => <JobCard key={job.id} job={job} />)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">No completed jobs yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProviderLayout>
  );
}
