import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/UserAuthProvider";
import { UnifiedAuthProvider } from "@/components/UnifiedAuthProvider";
import { CrossRoleDataBridge } from "@/components/CrossRoleDataBridge";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import ProfilePersonalInfo from "@/pages/ProfilePersonalInfo";
import ProfileAddress from "@/pages/ProfileAddress";
import ProfileBusiness from "@/pages/ProfileBusiness";
import ProfilePayment from "@/pages/ProfilePayment";
import ProfileReview from "@/pages/ProfileReview";
import IssueCategorizationPage from "@/pages/IssueCategorizationPage";
import PhoneSupportPage from "@/pages/PhoneSupportPage";
import MarketplacePage from "@/pages/MarketplacePage";
import LiveSupportPage from "@/pages/LiveSupportPage";
import TriagePage from "@/pages/TriagePage";
import SimpleDiagnosticPage from "@/pages/SimpleDiagnosticPage";
import ClientDashboard from "@/pages/ClientDashboard";
import AuthTestPage from "@/components/AuthTestPage";
import ServiceProviderRegistration from "@/pages/TechnicianRegistration";
import ServiceProviderDashboard from "@/pages/ServiceProviderDashboard";
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
import QuickServiceProviderRequest from "@/pages/QuickTechnicianRequest";
import ScreenSharingPage from "@/pages/ScreenSharingPage";
import ReceiptDemo from "@/pages/ReceiptDemo";
import InvoiceModificationDemo from "@/pages/InvoiceModificationDemo";
import AIFeatureDiscoveryWrapper from "@/components/AIFeatureDiscoveryWrapper";
import FeatureDiscoveryPage from "@/pages/FeatureDiscoveryPage";


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
      <Route path="/" component={ChatPage} />
      <Route path="/customer-home" component={CustomerHomePage} />
      
      {/* Customer Portal - Core Pages */}
      <Route path="/chat" component={ChatPage} />
      <Route path="/dashboard" component={ClientDashboard} />
      <Route path="/issues" component={IssueCategorizationPage} />
      
      {/* Support Services - Essential Customer Services */}
      <Route path="/live-support" component={() => <LiveSupportPage username={getStoredUsername()} />} />
      <Route path="/phone-support" component={PhoneSupportPage} />
      <Route path="/screen-sharing" component={ScreenSharingPage} />
      <Route path="/technician-request" component={QuickServiceProviderRequest} />
      <Route path="/marketplace" component={() => <MarketplacePage username={getStoredUsername()} />} />
      <Route path="/feature-discovery" component={FeatureDiscoveryPage} />
      <Route path="/triage" component={TriagePage} />
      <Route path="/diagnostic" component={SimpleDiagnosticPage} />
      <Route path="/booking" component={SimpleBooking} />
      <Route path="/book-service" component={BookServicePage} />
      <Route path="/expert-technician" component={ExpertTechnicianFinder} />
      
      {/* Service Provider Portal */}
      <Route path="/technician-home" component={ServiceProviderHomePage} />
      <Route path="/technician-register" component={ServiceProviderRegistration} />
      <Route path="/technician-registration" component={ServiceProviderRegistration} />
      <Route path="/technician-dashboard" component={TechnicianDetailsPage} />
      <Route path="/service-provider-dashboard" component={ServiceProviderDashboard} />
      <Route path="/technician-earnings" component={TechnicianEarnings} />
      <Route path="/profile-visibility" component={ProfileVisibilityPage} />
      <Route path="/technicians" component={TechnicianLanding} />
      <Route path="/notifications-dashboard" component={NotificationsDashboard} />
      <Route path="/technician-matching" component={TechnicianMatchingPage} />
      <Route path="/test-notifications" component={TestNotificationSystem} />
      
      {/* Admin Portal */}
      <Route path="/admin-home" component={AdminHomePage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin-portal" component={AdminNavigation} />
      <Route path="/admin-earnings" component={AdminEarningSettings} />
      <Route path="/admin-categories" component={AdminCategoryManagement} />
      <Route path="/admin/announcements" component={AdminAnnouncements} />
      
      {/* User Profile - Multi-page flow */}
      <Route path="/profile/:username" component={ProfilePage} />
      <Route path="/profile/:username/personal" component={ProfilePersonalInfo} />
      <Route path="/profile/:username/address" component={ProfileAddress} />
      <Route path="/profile/:username/business" component={ProfileBusiness} />
      <Route path="/profile/:username/payment" component={ProfilePayment} />
      <Route path="/profile/:username/review" component={ProfileReview} />
      
      {/* Legacy profile route for compatibility */}
      <Route path="/:username/profile" component={ProfilePage} />
      
      {/* Development/Testing Pages - Only available in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <Route path="/domains" component={DomainSelector} />

          <Route path="/notifications" component={NotificationsDashboard} />
          <Route path="/onboarding" component={OnboardingWizard} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/auth-test" component={AuthTestPage} />
          <Route path="/receipt-demo" component={ReceiptDemo} />
          <Route path="/invoice-demo" component={InvoiceModificationDemo} />
        </>
      )}
      
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
      <div className="min-h-screen bg-gray-50">
        <Router />
        {/* Temporarily disabled complex components causing loading issues */}
        {/* <FloatingChatWidget username={username} /> */}
        {/* <AIFeatureDiscoveryWrapper /> */}
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
