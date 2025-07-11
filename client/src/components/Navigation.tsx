import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Home, Menu, X, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavigationProps {
  showBackButton?: boolean;
  backTo?: string;
  title?: string;
  showHomeButton?: boolean;
  customBackAction?: () => void;
}

export default function Navigation({ 
  showBackButton = true, 
  backTo = "/", 
  title,
  showHomeButton = true,
  customBackAction 
}: NavigationProps) {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleBack = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      setLocation(backTo);
    }
  };

  const navigationItems = [
    { label: "Home", path: "/", description: "Customer portal home" },
    { label: "AI Chat Support", path: "/chat", description: "Free AI assistance" },
    { label: "My Dashboard", path: "/dashboard", description: "View your account and services" },
    { label: "Request Technician", path: "/technician-request", description: "Book professional help" },
    { label: "Live Support", path: "/live-support", description: "Human technician help" },
    { label: "Phone Support", path: "/phone-support", description: "Call-based support" },
    { label: "Issue Tracker", path: "/issues", description: "Manage your requests" },
    { label: "Technician Portal", path: "/technician-home", description: "Join as a service provider" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button and Title */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            {title && (
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            )}
          </div>

          {/* Center - Logo/Brand */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-xl font-bold text-blue-600 hover:text-blue-700"
            >
              TechGPT
            </Button>
          </div>

          {/* Right side - Chat, Home button and Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/chat")}
              className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </Button>
            {showHomeButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="sm:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Navigation</h2>
                  </div>
                  {navigationItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      onClick={() => {
                        setLocation(item.path);
                        setIsOpen(false);
                      }}
                      className="justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Quick Access Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden sm:flex items-center gap-2"
                >
                  <Menu className="h-4 w-4" />
                  Quick Access
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Quick Access</h2>
                  </div>
                  {navigationItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      onClick={() => setLocation(item.path)}
                      className="justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}