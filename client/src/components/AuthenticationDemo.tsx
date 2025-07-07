import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Shield,
  Zap,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AuthenticationDemo() {
  const [demoStep, setDemoStep] = useState(1);
  const [demoUser, setDemoUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const steps = [
    {
      title: "User wants to book technician service",
      description: "User selects a paid service that requires authentication",
      status: "complete"
    },
    {
      title: "Authentication modal appears",
      description: "System prompts for login/signup with service context",
      status: demoStep >= 2 ? "complete" : "pending"
    },
    {
      title: "User creates account",
      description: "User fills out registration form with contact details",
      status: demoStep >= 3 ? "complete" : "pending"
    },
    {
      title: "Access granted to service",
      description: "User is redirected to their selected service",
      status: demoStep >= 4 ? "complete" : "pending"
    },
    {
      title: "Dashboard access available",
      description: "User can now access their personalized dashboard",
      status: demoStep >= 5 ? "complete" : "pending"
    }
  ];

  const handleDemoSignup = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/register", {
        email: "demo.user@techgpt.com",
        password: "demo123",
        firstName: "Demo",
        lastName: "User",
        phone: "(555) 987-6543",
        address: "456 Demo Avenue",
        city: "Tech City",
        state: "CA",
        zipCode: "90210"
      });
      
      const user = await response.json();
      setDemoUser(user);
      
      toast({
        title: "Demo Account Created!",
        description: `Welcome ${user.fullName}! Your account is ready.`,
      });
      
      setDemoStep(5);
    } catch (error) {
      toast({
        title: "Demo Registration",
        description: "Demo account already exists, using existing user.",
      });
      
      // Use existing demo user
      setDemoUser({
        id: 1,
        username: "demo@example.com",
        email: "demo@example.com",
        fullName: "Demo User",
        phone: "(555) 123-4567",
        address: "123 Demo St, Demo City, CA 90210"
      });
      setDemoStep(5);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (demoStep < 5) {
      setDemoStep(demoStep + 1);
    }
  };

  const resetDemo = () => {
    setDemoStep(1);
    setDemoUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Flow Demo</h2>
        <p className="text-gray-600">Experience how users authenticate to access technician services</p>
      </div>

      {/* Demo Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Authentication Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {step.status === "complete" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${step.status === "complete" ? "text-green-900" : "text-gray-700"}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${step.status === "complete" ? "text-green-700" : "text-gray-600"}`}>
                    {step.description}
                  </p>
                </div>
                <Badge variant={step.status === "complete" ? "default" : "secondary"}>
                  {step.status === "complete" ? "✓" : index + 1}
                </Badge>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t">
            {demoStep < 5 && (
              <Button onClick={nextStep} className="flex items-center gap-2">
                {demoStep === 4 ? "Create Demo Account" : "Next Step"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            
            {demoStep === 4 && (
              <Button 
                onClick={handleDemoSignup}
                disabled={isLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                {isLoading ? "Creating..." : "Demo Signup"}
              </Button>
            )}
            
            <Button onClick={resetDemo} variant="ghost">
              Reset Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo User Info */}
      {demoUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Demo User Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Name:</span>
                    <span>{demoUser.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Email:</span>
                    <span>{demoUser.email}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Phone:</span>
                    <span>{demoUser.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Address:</span>
                    <span>{demoUser.address}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-sm text-green-700 mb-3">
                  🎉 Account created successfully! This user can now:
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Access all technician services (phone, live chat, onsite)</li>
                  <li>• View their personalized dashboard</li>
                  <li>• Track service requests and job history</li>
                  <li>• Manage their profile and preferences</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Try Live Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Test Credentials</h3>
              <div className="space-y-2 text-sm bg-gray-50 p-3 rounded">
                <div><strong>Email:</strong> demo@example.com</div>
                <div><strong>Password:</strong> demo123</div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  onClick={() => window.open('/auth-test', '_blank')}
                  className="w-full"
                  variant="outline"
                >
                  Open Auth Test Page
                </Button>
                <Button 
                  onClick={() => window.open('/dashboard', '_blank')}
                  className="w-full"
                  variant="outline"
                >
                  Try Dashboard (requires auth)
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}