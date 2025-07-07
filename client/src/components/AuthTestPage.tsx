import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  User, 
  LogIn, 
  UserPlus, 
  Shield, 
  Check,
  AlertCircle,
  MessageSquare,
  Phone,
  MapPin
} from "lucide-react";
import AuthModal from "@/components/AuthModal";
import SupportOptionsWidget from "@/components/SupportOptionsWidget";
import AuthenticationDemo from "@/components/AuthenticationDemo";

export default function AuthTestPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [, setLocation] = useLocation();

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('tech_user', JSON.stringify(user));
    setShowAuthModal(false);
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      // Navigate to service
      console.log("Accessing service:", service);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tech_user');
  };

  const testServices = [
    {
      id: 'live_chat',
      title: 'Live Support Chat',
      description: 'Connect with human technicians',
      price: '$25/10min',
      requiresAuth: true,
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      id: 'phone_support',
      title: 'Phone Support',
      description: 'Direct phone assistance',
      price: '$35/hr',
      requiresAuth: true,
      icon: <Phone className="h-5 w-5" />
    },
    {
      id: 'onsite_support',
      title: 'Onsite Support',
      description: 'In-person technical help',
      price: '$75/hr',
      requiresAuth: true,
      icon: <MapPin className="h-5 w-5" />
    }
  ];

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Test Page</h1>
        <p className="text-gray-600">Test the authentication flow and protected services</p>
      </div>

      {/* User Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">Authenticated</span>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Welcome, {currentUser.fullName}!</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p>Email: {currentUser.email}</p>
                  <p>Phone: {currentUser.phone}</p>
                  <p>Address: {currentUser.address}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setLocation('/dashboard')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-700 font-medium">Not Authenticated</span>
              </div>
              <p className="text-gray-600">You need to create an account or login to access paid services.</p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login / Sign Up
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Services */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Protected Services</CardTitle>
          <p className="text-sm text-gray-600">These services require authentication</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {testServices.map((service) => (
              <div 
                key={service.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleServiceSelect(service)}
              >
                <div className="flex items-center gap-3">
                  {service.icon}
                  <div>
                    <h3 className="font-medium">{service.title}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">{service.price}</Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Shield className="h-3 w-3" />
                    Auth Required
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Authentication Demo */}
      <AuthenticationDemo />

      {/* Support Options Widget Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Support Options Widget Demo</CardTitle>
          <p className="text-sm text-gray-600">The full support options widget with authentication integration</p>
        </CardHeader>
        <CardContent>
          <SupportOptionsWidget 
            category="Hardware Issues"
            onOptionSelected={(option) => console.log("Selected:", option)}
          />
        </CardContent>
      </Card>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setSelectedService(null);
        }}
        onAuthSuccess={handleAuthSuccess}
        selectedService={selectedService?.title}
        serviceDetails={selectedService}
      />
    </div>
  );
}