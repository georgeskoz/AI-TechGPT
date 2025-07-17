import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SimpleNavigation from "@/components/SimpleNavigation";
import { 
  Users, 
  Search, 
  Plus, 
  Settings, 
  User,
  Briefcase,
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import TechnicianRegistration from "./TechnicianRegistration";
import CustomerServiceTracker from "./CustomerServiceTracker";
import ServiceRequestFlow from "../components/ServiceRequestFlow";
import IssueCategorization from "../components/IssueCategorization";
import type { TechnicalIssue } from "../components/IssueCategorization";

interface MarketplacePageProps {
  username: string;
}

// Mock user ID - in a real app this would come from authentication
const MOCK_USER_ID = 1;

export default function MarketplacePage({ username }: MarketplacePageProps) {
  const [activeView, setActiveView] = useState<'browse' | 'register' | 'dashboard' | 'request'>('browse');
  const [userType, setUserType] = useState<'customer' | 'technician' | null>(null);
  const [technicianId, setTechnicianId] = useState<number | null>(null);
  const [requestCategory, setRequestCategory] = useState<string>("");
  const [requestSubcategory, setRequestSubcategory] = useState<string>("");

  // Check if user has a technician profile
  const { data: technician, isLoading: technicianLoading } = useQuery({
    queryKey: [`/api/technicians/user/${MOCK_USER_ID}`],
    retry: false,
  });

  useEffect(() => {
    if (!technicianLoading) {
      if (technician) {
        setUserType('technician');
        setTechnicianId(technician.id);
      } else {
        setUserType('customer');
      }
    }
  }, [technician, technicianLoading]);

  const handleCategorySelected = (category: string, subcategory: string) => {
    setRequestCategory(category);
    setRequestSubcategory(subcategory);
    setActiveView('request');
  };

  const handleIssueCreated = (issue: TechnicalIssue) => {
    handleCategorySelected(issue.category, issue.subcategory);
  };

  const handleRegistrationComplete = () => {
    setActiveView('dashboard');
    // Refetch technician data
    window.location.reload();
  };

  const handleRequestComplete = () => {
    setActiveView('browse');
  };

  if (technicianLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  // Service Request Flow
  if (activeView === 'request') {
    return (
      <ServiceRequestFlow
        category={requestCategory}
        subcategory={requestSubcategory}
        userId={MOCK_USER_ID}
        onComplete={handleRequestComplete}
      />
    );
  }

  // Technician Registration
  if (activeView === 'register') {
    return (
      <TechnicianRegistration
        userId={MOCK_USER_ID}
        onRegistrationComplete={handleRegistrationComplete}
      />
    );
  }

  // Customer Service Tracker
  if (activeView === 'dashboard' && technicianId) {
    return (
      <CustomerServiceTracker />
    );
  }

  // Main Marketplace View
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <SimpleNavigation title="Marketplace" backTo="/" />
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">TechGPT Marketplace</h1>
          <p className="text-gray-600 mt-1">
            Get expert technical help or offer your services as a technician
          </p>
        </div>
        <div className="flex gap-2">
          {userType === 'technician' && technicianId && (
            <Button onClick={() => setActiveView('dashboard')} className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              My Dashboard
            </Button>
          )}
          {userType === 'customer' && (
            <Button onClick={() => setActiveView('register')} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Become a Technician
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Technicians</p>
                <p className="text-2xl font-bold">247</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Jobs Completed</p>
                <p className="text-2xl font-bold">1,842</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">24min</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                <p className="text-2xl font-bold">4.8★</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="get-help" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="get-help">Get Technical Help</TabsTrigger>
          <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
        </TabsList>

        <TabsContent value="get-help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Get Expert Technical Support</CardTitle>
              <CardDescription>
                Browse technical categories and connect with qualified technicians for personalized help
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IssueCategorization
                onIssueCreated={handleIssueCreated}
                onCategorySelected={handleCategorySelected}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Choose TechGPT Marketplace?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Search className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Matching</h3>
                  <p className="text-sm text-gray-600">
                    Our AI matches you with the most qualified technicians for your specific needs
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-time Communication</h3>
                  <p className="text-sm text-gray-600">
                    Chat directly with technicians and get live updates on your service progress
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
                  <p className="text-sm text-gray-600">
                    All technicians are vetted and rated by customers for quality assurance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="how-it-works" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How the Marketplace Works</CardTitle>
              <CardDescription>
                A simple 4-step process to get the technical help you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Describe Your Issue</h3>
                    <p className="text-gray-600">
                      Tell us about your technical problem and select the appropriate category and service type
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Find a Technician</h3>
                    <p className="text-gray-600">
                      Browse qualified technicians or let our system automatically match you with the best fit
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Get Help</h3>
                    <p className="text-gray-600">
                      Connect with your technician via chat, phone, or schedule an on-site visit
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Complete & Review</h3>
                    <p className="text-gray-600">
                      Once your issue is resolved, complete the payment and leave a review for the technician
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Types Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Remote Support
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Get help via screen sharing and remote access
                  </p>
                  <Badge variant="outline">Fastest Response</Badge>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Phone Support
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Direct phone consultation with technical experts
                  </p>
                  <Badge variant="outline">Personal Touch</Badge>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    On-site Service
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Technician visits your location for hands-on help
                  </p>
                  <Badge variant="outline">Comprehensive</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}