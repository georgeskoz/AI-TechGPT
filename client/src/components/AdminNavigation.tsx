import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  Activity, 
  BarChart3,
  ArrowRight,
  Lock,
  AlertTriangle,
  TrendingUp
} from "lucide-react";

export default function AdminNavigation() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">TechGPT Admin Panel</h1>
        <p className="text-gray-600">Platform management and analytics dashboard</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              Admin Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Access the comprehensive admin dashboard to monitor platform activity, manage users and technicians, and view analytics.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>User & Technician Management</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-500" />
                <span>Real-time Job Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-gray-500" />
                <span>Dispute Resolution Center</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <span>Analytics & Reporting</span>
              </div>
            </div>
            <Link href="/admin">
              <Button className="w-full flex items-center gap-2">
                Access Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Lock className="h-5 w-5 text-gray-600" />
              </div>
              Security & Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Advanced security features and administrative controls for platform management.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div>• User account suspension and activation</div>
              <div>• Technician verification and approval</div>
              <div>• Payment dispute mediation</div>
              <div>• Platform security monitoring</div>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center">Platform Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">12,543</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">2,876</div>
              <div className="text-sm text-gray-600">Technicians</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">145</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">$2.4M</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline">
              Back to Main Site
            </Button>
          </Link>
          <Link href="/technicians">
            <Button variant="outline">
              Technician Portal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}