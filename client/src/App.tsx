import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/UserAuthProvider";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import IssueCategorizationPage from "@/pages/IssueCategorizationPage";
import PhoneSupportPage from "@/pages/PhoneSupportPage";
import MarketplacePage from "@/pages/MarketplacePage";
import LiveSupportPage from "@/pages/LiveSupportPage";
import TriagePage from "@/pages/TriagePage";
import SimpleDiagnosticPage from "@/pages/SimpleDiagnosticPage";
import ClientDashboard from "@/pages/ClientDashboard";
import AuthTestPage from "@/components/AuthTestPage";
import ServiceProviderRegistration from "@/pages/TechnicianRegistration";
import ServiceProviderDashboard from "@/pages/TechnicianDashboard";
import TechnicianDetailsPage from "@/pages/TechnicianDashboard";
import TechnicianLanding from "@/pages/TechnicianLanding";
import TechnicianMatchingPage from "@/pages/TechnicianMatchingPage";
import ExpertTechnicianFinder from "@/pages/ExpertTechnicianFinder";
import SimpleBooking from "@/pages/SimpleBooking";
import BookServicePage from "@/pages/BookServicePage";
import TechnicianEarnings from "@/pages/TechnicianEarnings";
import ProfileVisibilityPage from "@/pages/ProfileVisibilityPage";
import CustomerHomePage from "@/pages/CustomerHomePage";
import ServiceProviderHomePage from "@/pages/TechnicianHomePage";
import AdminHomePage from "@/pages/AdminHomePage";
import DomainSelector from "@/pages/DomainSelector";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminNavigation from "@/components/AdminNavigation";
import AdminEarningSettings from "@/components/AdminEarningSettings";
import AdminCategoryManagement from "@/pages/AdminCategoryManagement";
import AdminAnnouncements from "@/pages/AdminAnnouncements";
import FloatingChatWidget from "@/components/FloatingChatWidget";
import OnboardingWizard from "@/pages/OnboardingWizard";
import RegisterPage from "@/pages/RegisterPage";
import TestNotificationSystem from "@/pages/TestNotificationSystem";
import NotificationsDashboard from "@/pages/NotificationsDashboard";
import QuickTechnicianRequest from "@/pages/QuickTechnicianRequest";


function Router() {
  // Safe localStorage access for client-side rendering
  const getStoredUsername = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("username") || "Guest";
    }
    return "Guest";
  };

  return (
    <Switch>
      {/* Main Entry Points */}
      <Route path="/" component={CustomerHomePage} />
      <Route path="/home" component={CustomerHomePage} />
      
      {/* Customer Portal */}
      <Route path="/chat" component={ChatPage} />
      <Route path="/dashboard" component={ClientDashboard} />
      <Route path="/issues" component={IssueCategorizationPage} />
      <Route path="/support" component={ChatPage} />
      <Route path="/triage" component={TriagePage} />
      <Route path="/diagnostic" component={SimpleDiagnosticPage} />
      
      {/* Support Services */}
      <Route path="/phone-support" component={PhoneSupportPage} />
      <Route path="/live-support" component={() => <LiveSupportPage username={getStoredUsername()} />} />
      <Route path="/technician-request" component={QuickTechnicianRequest} />
      <Route path="/technician-matching" component={TechnicianMatchingPage} />
      <Route path="/find-expert" component={ExpertTechnicianFinder} />
      <Route path="/marketplace" component={() => <MarketplacePage username={getStoredUsername()} />} />
      
      {/* Service Provider Portal */}
      <Route path="/technician-home" component={ServiceProviderHomePage} />
      <Route path="/technician-register" component={ServiceProviderRegistration} />
      <Route path="/technician-dashboard" component={TechnicianDetailsPage} />
      <Route path="/technician-earnings" component={TechnicianEarnings} />
      <Route path="/profile-visibility" component={ProfileVisibilityPage} />
      <Route path="/technicians" component={TechnicianLanding} />
      
      {/* Admin Portal */}
      <Route path="/admin-home" component={AdminHomePage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin-portal" component={AdminNavigation} />
      <Route path="/admin-earnings" component={AdminEarningSettings} />
      <Route path="/admin-categories" component={AdminCategoryManagement} />
      <Route path="/admin/announcements" component={AdminAnnouncements} />
      
      {/* Utility Pages */}
      <Route path="/domains" component={DomainSelector} />
      <Route path="/onboarding" component={OnboardingWizard} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/test-notifications" component={TestNotificationSystem} />
      <Route path="/notifications" component={NotificationsDashboard} />
      <Route path="/:username/profile" component={ProfilePage} />
      
      {/* Legacy Routes - Redirect to main paths */}
      <Route path="/customer-home" component={CustomerHomePage} />
      <Route path="/technician" component={QuickTechnicianRequest} />
      <Route path="/book-technician" component={SimpleBooking} />
      <Route path="/book-service" component={BookServicePage} />
      <Route path="/auth-test" component={AuthTestPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Get username from localStorage for the floating chat widget
  // Use useState to handle client-side rendering properly
  const [username, setUsername] = useState<string>("Guest");

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Router />
          <FloatingChatWidget username={username} />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
