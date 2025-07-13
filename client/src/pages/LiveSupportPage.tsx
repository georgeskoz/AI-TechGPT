import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import LiveSupportChat from "@/components/LiveSupportChat";
import { 
  MessageSquare, 
  Clock, 
  Users, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Phone,
  Video,
  Monitor,
  ArrowLeft,
  Home,
  X
} from "lucide-react";

interface LiveSupportPageProps {
  username: string;
}

export default function LiveSupportPage({ username }: LiveSupportPageProps) {
  const [showChat, setShowChat] = useState(false);
  const [selectedUserId] = useState(1); // Mock user ID for demo
  const [, setLocation] = useLocation();

  // Get user's support cases history
  const { data: supportCases = [] } = useQuery({
    queryKey: ["/api/support/cases/customer", selectedUserId],
    queryFn: async () => {
      const response = await fetch(`/api/support/cases/customer/${selectedUserId}`);
      return response.json();
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-yellow-100 text-yellow-800";
      case "assigned": return "bg-blue-100 text-blue-800";
      case "closed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="h-4 w-4" />;
      case "assigned": return <Users className="h-4 w-4" />;
      case "closed": return <CheckCircle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="Live Support" backTo="/" />
      {/* Navigation Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Live Support Center</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/")}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Exit
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Live Support Center</h1>
                <p className="text-gray-600 mt-1">
                  Get instant help from our expert technicians
                </p>
              </div>
              <Button
                onClick={() => setShowChat(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Live Chat
              </Button>
            </div>
          </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                Free Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-green-600">10 Minutes</p>
                <p className="text-xs text-gray-600">
                  Get free support for the first 10 minutes of each session
                </p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>No credit card required</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Expert Technicians
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-blue-600">24/7</p>
                <p className="text-xs text-gray-600">
                  Professional technicians available around the clock
                </p>
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Certified specialists</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-purple-600">96%</p>
                <p className="text-xs text-gray-600">
                  Issues resolved in the first session
                </p>
                <div className="flex items-center gap-1 text-xs text-purple-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Satisfaction guaranteed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Types */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Support Type</CardTitle>
            <p className="text-sm text-gray-600">
              Select the best option for your technical needs
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium">Live Chat</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Real-time text chat with expert technicians
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setShowChat(true)}
                >
                  Start Chat
                </Button>
              </div>

              <div className="border rounded-lg p-4 hover:border-green-500 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-medium">Phone Support</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Direct phone consultation with specialists
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setLocation('/phone-support')}
                >
                  Call Now
                </Button>
              </div>

              <div className="border rounded-lg p-4 hover:border-purple-500 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Monitor className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-medium">Screen Share</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Remote screen sharing for complex issues
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setLocation('/screen-sharing')}
                >
                  Share Screen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support History */}
        <Card>
          <CardHeader>
            <CardTitle>Your Support History</CardTitle>
            <p className="text-sm text-gray-600">
              Track your previous support cases and their status
            </p>
          </CardHeader>
          <CardContent>
            {supportCases.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No support cases yet</h3>
                <p className="text-gray-600 mb-4">Start your first live chat session to get help</p>
                <Button onClick={() => setShowChat(true)}>
                  Start Live Chat
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {supportCases.map((supportCase: any) => (
                  <div key={supportCase.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(supportCase.status)}
                        <h3 className="font-medium">{supportCase.title}</h3>
                      </div>
                      <Badge className={getStatusColor(supportCase.status)}>
                        {supportCase.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Case ID:</span>
                        <p className="font-medium">#{supportCase.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium">{formatDuration(supportCase.totalDuration)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Cost:</span>
                        <p className="font-medium text-green-600">
                          {supportCase.isFreeSupport ? "Free" : "Paid"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Date:</span>
                        <p className="font-medium">
                          {new Date(supportCase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {supportCase.description && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                        {supportCase.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Live Support Chat Widget */}
      {showChat && (
        <LiveSupportChat
          userId={selectedUserId}
          username={username}
          isMinimized={false}
          onToggleMinimize={() => setShowChat(!showChat)}
        />
      )}
    </div>
  );
}