import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Home, Menu, X, MessageCircle, Users, Shield, User } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import techGPTLogoPath from "@assets/image_1752537953157.png";
// Temporarily remove problematic imports
// import RoleBasedNavigation from "@/components/RoleBasedNavigation";
// import { useUnifiedAuth } from "@/components/UnifiedAuthProvider";

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
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Temporarily bypass auth to prevent loading issues
  const isAuthenticated = false;

  const handleBack = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      // Use browser history to go back to previous page
      window.history.back();
    }
  };

  // Determine current page type
  const isServiceProviderPage = location.includes('/service-provider') || 
                               location.includes('/provider') || 
                               location.includes('/technician-dashboard') ||
                               location.includes('/technician-earnings') ||
                               location.includes('/technician-registration') ||
                               location.includes('/technician-register') ||
                               location.includes('/technician-home') ||
                               location.includes('/technician-matching') ||
                               location.includes('/technicians') ||
                               location.includes('/profile-visibility') ||
                               location.includes('/notifications-dashboard');
  const isAdminPage = location.includes('/admin');

  // Get context-aware home path
  const getHomePath = () => {
    if (isServiceProviderPage) {
      return "/technician-home";
    } else if (isAdminPage) {
      return "/admin-home";
    } else {
      return "/";
    }
  };

  // Dynamic navigation items based on current page
  const getNavigationItems = () => {
    if (isServiceProviderPage) {
      return [
        { label: "Provider Home", path: "/technician-home", description: "Service provider dashboard" },
        { label: "Provider Dashboard", path: "/technician-dashboard", description: "View jobs and earnings" },
        { label: "Job Notifications", path: "/notifications-dashboard", description: "Manage job alerts" },
        { label: "Earnings & Payouts", path: "/technician-earnings", description: "Track earnings and payments" },
        { label: "Provider Registration", path: "/technician-registration", description: "Update provider profile" },
        { label: "Profile Visibility", path: "/profile-visibility", description: "Manage profile visibility" },
        { label: "Test Notifications", path: "/test-notifications", description: "Test notification system" },
        { label: "Find Opportunities", path: "/technician-matching", description: "Browse available jobs" },
      ];
    } else if (isAdminPage) {
      return [
        { label: "Admin Home", path: "/admin-home", description: "Admin dashboard overview" },
        { label: "Admin Dashboard", path: "/admin", description: "Main admin control panel" },
        { label: "Admin Navigation", path: "/admin-navigation", description: "Admin tools navigation" },
        { label: "Earning Settings", path: "/admin-earnings", description: "Manage provider earnings" },
        { label: "Category Management", path: "/admin-categories", description: "Manage service categories" },
        { label: "Announcements", path: "/admin-announcements", description: "System announcements" },
        { label: "Diagnostic Tools", path: "/admin-diagnostic", description: "Admin diagnostic tools" },
        { label: "Test Notifications", path: "/test-notifications", description: "Test system notifications" },
      ];
    } else {
      // Customer pages - Clean production-ready navigation
      return [
        { label: "Home", path: "/", description: "Customer portal home" },
        { label: "AI Chat Support", path: "/chat", description: "Free AI assistance" },
        { label: "My Dashboard", path: "/dashboard", description: "View your account and services" },
        { label: "Request Service Provider", path: "/technician-request", description: "Book professional help" },
        { label: "Live Support", path: "/live-support", description: "Chat with human experts" },
        { label: "Phone Support", path: "/phone-support", description: "Call-based support" },
        { label: "Screen Sharing", path: "/screen-sharing", description: "Remote screen assistance" },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  // Development role switcher - only show in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  const roleSwitcherItems = [
    { label: "Customer View", path: "/", icon: <User className="h-4 w-4" />, description: "Customer portal and services" },
    { label: "Service Provider", path: "/technician-home", icon: <Users className="h-4 w-4" />, description: "Service provider dashboard" },
    { label: "Admin Portal", path: "/admin-home", icon: <Shield className="h-4 w-4" />, description: "Admin management console" },
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
              onClick={() => setLocation(getHomePath())}
              className="p-2 hover:bg-white"
            >
              <img 
                src={techGPTLogoPath} 
                alt="TechGPT Logo" 
                className="h-16 w-48"
              />
            </Button>
          </div>

          {/* Right side - Authentication, Chat, Home button and Menu */}
          <div className="flex items-center gap-2">
            {/* Role-based navigation for authenticated users */}
            {isAuthenticated && (
              <div className="hidden sm:block">
                <RoleBasedNavigation />
              </div>
            )}
            
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
                onClick={() => setLocation(getHomePath())}
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
                  
                  {/* Development Role Switcher - Mobile */}
                  {isDevelopment && (
                    <>
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-md font-semibold">Development</h3>
                          <Badge variant="secondary" className="text-xs">DEV</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Switch between user roles for testing</p>
                        {roleSwitcherItems.map((item) => (
                          <Button
                            key={item.path}
                            variant={location === item.path || 
                                   (item.path === "/" && (location === "/" || location.includes("/chat") || location.includes("/dashboard"))) ? 
                                   "default" : "ghost"}
                            onClick={() => {
                              setLocation(item.path);
                              setIsOpen(false);
                            }}
                            className="justify-start text-left h-auto p-3 w-full"
                          >
                            <div className="flex items-center gap-3">
                              {item.icon}
                              <div>
                                <div className="font-medium">{item.label}</div>
                                <div className="text-sm text-gray-500">{item.description}</div>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
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
                <div className="flex flex-col gap-2 mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Quick Access</h2>
                  </div>
                  {navigationItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      onClick={() => setLocation(item.path)}
                      className="justify-start text-left h-auto p-2"
                    >
                      <div>
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Button>
                  ))}
                  
                  {/* Development Role Switcher */}
                  {isDevelopment && (
                    <>
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-md font-semibold">Development</h3>
                          <Badge variant="secondary" className="text-xs">DEV</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Switch between user roles for testing</p>
                        {roleSwitcherItems.map((item) => (
                          <Button
                            key={item.path}
                            variant={location === item.path || 
                                   (item.path === "/" && (location === "/" || location.includes("/chat") || location.includes("/dashboard"))) ? 
                                   "default" : "ghost"}
                            onClick={() => setLocation(item.path)}
                            className="justify-start text-left h-auto p-3 w-full"
                          >
                            <div className="flex items-center gap-3">
                              {item.icon}
                              <div>
                                <div className="font-medium">{item.label}</div>
                                <div className="text-sm text-gray-500">{item.description}</div>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}