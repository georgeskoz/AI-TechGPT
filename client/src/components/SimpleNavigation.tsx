import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Home, Menu, MessageCircle, Phone, Monitor, Users, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SimpleNavigationProps {
  showBackButton?: boolean;
  backTo?: string;
  title?: string;
}

export default function SimpleNavigation({ 
  showBackButton = true, 
  backTo = "/", 
  title 
}: SimpleNavigationProps) {
  const [location, setLocation] = useLocation();

  const handleBack = () => {
    window.history.back();
  };

  const quickAccessItems = [
    { label: "AI Chat Support", path: "/chat", icon: <MessageCircle className="h-4 w-4" />, description: "Free AI assistance" },
    { label: "Live Support", path: "/live-support", icon: <Users className="h-4 w-4" />, description: "Chat with human experts" },
    { label: "Phone Support", path: "/phone-support", icon: <Phone className="h-4 w-4" />, description: "Call-based support" },
    { label: "Screen Sharing", path: "/screen-sharing", icon: <Monitor className="h-4 w-4" />, description: "Remote screen assistance" },
    { label: "Request Service Provider", path: "/technician-request", icon: <Users className="h-4 w-4" />, description: "Book professional help" },
    { label: "Customer Portal", path: "/customer-home", icon: <Home className="h-4 w-4" />, description: "Customer home page" },
    { label: "Admin Dashboard", path: "/admin", icon: <Shield className="h-4 w-4" />, description: "Admin control panel" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button and Title */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            
            {title && (
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            )}
          </div>

          {/* Right side - Home button and Quick Access */}
          <div className="flex items-center gap-2">
            {/* Home Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>

            {/* Quick Access Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Menu className="h-4 w-4" />
                  Quick Access
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {quickAccessItems.map((item, index) => (
                  <DropdownMenuItem 
                    key={index}
                    onClick={() => setLocation(item.path)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.label}</span>
                        <span className="text-xs text-gray-500">{item.description}</span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}