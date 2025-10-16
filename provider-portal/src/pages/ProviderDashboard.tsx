import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, Briefcase, Clock, Star, 
  TrendingUp, Calendar, MessageSquare, Settings 
} from "lucide-react";
import { useLocation } from "wouter";
import ProviderLayout from "../components/ProviderLayout";

export default function ProviderDashboard() {
  const [, setLocation] = useLocation();

  const { data: stats } = useQuery({
    queryKey: ["/api/provider/stats"],
  });

  const { data: recentJobs } = useQuery({
    queryKey: ["/api/provider/jobs/recent"],
  });

  return (
    <ProviderLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Earnings</p>
                  <h3 className="text-2xl font-bold mt-1">${stats?.totalEarnings || 0}</h3>
                </div>
                <DollarSign className="h-8 w-8 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Active Jobs</p>
                  <h3 className="text-2xl font-bold mt-1">{stats?.activeJobs || 0}</h3>
                </div>
                <Briefcase className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Completed Jobs</p>
                  <h3 className="text-2xl font-bold mt-1">{stats?.completedJobs || 0}</h3>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Average Rating</p>
                  <h3 className="text-2xl font-bold mt-1">{stats?.rating || 0} <Star className="inline h-5 w-5 text-yellow-500 mb-1" /></h3>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {recentJobs && recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                        <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{job.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${job.amount}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{job.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No recent jobs</p>
            )}
            <Button 
              className="w-full mt-4" 
              variant="outline" 
              onClick={() => setLocation("/jobs")}
              data-testid="button-view-all-jobs"
            >
              View All Jobs
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => setLocation("/jobs")}>
            <CardContent className="p-6 text-center">
              <Calendar className="h-10 w-10 mx-auto text-green-600 mb-3" />
              <h3 className="font-semibold mb-1">View Jobs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your job queue</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => setLocation("/messages")}>
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-10 w-10 mx-auto text-blue-600 mb-3" />
              <h3 className="font-semibold mb-1">Messages</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Chat with customers</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => setLocation("/profile")}>
            <CardContent className="p-6 text-center">
              <Settings className="h-10 w-10 mx-auto text-purple-600 mb-3" />
              <h3 className="font-semibold mb-1">Profile Settings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Update your information</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProviderLayout>
  );
}
