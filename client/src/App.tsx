import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/UserAuthProvider";
import { UnifiedAuthProvider } from "@/components/UnifiedAuthProvider";
import { CrossRoleDataBridge } from "@/components/CrossRoleDataBridge";
import RoleBasedRedirect from "@/components/RoleBasedRedirect";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { isProfileComplete } from "@/utils/profileUtils";
import NotFound from "@/pages/not-found";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import ProfilePersonalInfo from "@/pages/ProfilePersonalInfo";
import ProfileAddress from "@/pages/ProfileAddress";
import ProfileBusiness from "@/pages/ProfileBusiness";
import ProfilePayment from "@/pages/ProfilePayment";
import ProfileReview from "@/pages/ProfileReview";
import ProfileSummary from "@/pages/ProfileSummary";
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
import CustomerServiceTracker from "@/pages/CustomerServiceTracker";
import CustomerDashboard from "@/pages/CustomerDashboard";
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
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import TestNotificationSystem from "@/pages/TestNotificationSystem";
import NotificationsDashboard from "@/pages/NotificationsDashboard";
import QuickServiceProviderRequest from "@/pages/QuickTechnicianRequest";
import ScreenSharingPage from "@/pages/ScreenSharingPage";
import ReceiptDemo from "@/pages/ReceiptDemo";
import InvoiceModificationDemo from "@/pages/InvoiceModificationDemo";
import AIFeatureDiscoveryWrapper from "@/components/AIFeatureDiscoveryWrapper";
import FeatureDiscoveryPage from "@/pages/FeatureDiscoveryPage";
import TrackingPage from "@/pages/TrackingPage";
import ServiceProviderChat from "@/pages/ServiceProviderChat";
import RegistrationSuccess from "@/pages/RegistrationSuccess";
import MultiRoleInterface from "@/pages/MultiRoleInterface";
import DevRoleSwitcher from "@/components/DevRoleSwitcher";
import ServiceProviderChatPage from "@/pages/ServiceProviderChatPage";
import TechnicianReferrals from "@/pages/TechnicianReferrals";
import TechnicianOpportunities from "@/pages/TechnicianOpportunities";
import LearningCenter from "@/pages/LearningCenter";
import { PortalAuthGuard } from "@/components/PortalAuthGuard";
import TechnicianInbox from '@/pages/TechnicianInbox';
import TechnicianHelp from '@/pages/TechnicianHelp';
import AIChatAnalytics from '@/pages/AIChatAnalytics';


// Conditional Profile Route Component
function ProfileRoute({ params }: { params: { username: string } }) {
  const cleanUsername = params.username?.replace(/^"(.*)"$/, '$1') || params.username;
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/users", cleanUsername],
    queryFn: async () => {
      const res = await fetch(`/api/users/${encodeURIComponent(cleanUsername)}`);
      if (!res.ok) {
        if (res.status === 404) {
          // User doesn't exist, return null to show the profile creation form
          return null;
        }
        throw new Error("Failed to fetch user data");
      }
      return res.json();
    },
    retry: false, // Don't retry on 404 errors
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 border-solid rounded-full"></div>
      </div>
    );
  }

  // If there's an error (other than 404), show error message
  if (error && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  // If user exists and profile is complete, show summary page
  if (user && isProfileComplete(user)) {
    return <ProfileSummary />;
  }

  // Otherwise, show the multi-step form starting with personal info
  return <ProfilePersonalInfo />;
}

function Router() {
  // Safe localStorage access for client-side rendering
  const getStoredUsername = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("techgpt_username") || "Guest";
    }
    return "Guest";
  };

  return (
    <Switch>
      {/* Main Entry Points */}
      <Route path="/" component={RoleBasedRedirect} />
      <Route path="/multi-role" component={MultiRoleInterface} />
      <Route path="/customer-home" component={CustomerHomePage} />
      
      {/* Authentication */}
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      
      {/* Customer Portal - Core Pages */}
      <Route path="/chat" component={() => 
        <PortalAuthGuard requiredPortal="customer">
          <ChatPage />
        </PortalAuthGuard>
      } />
      <Route path="/dashboard" component={() => 
        <PortalAuthGuard requiredPortal="customer">
          <ClientDashboard />
        </PortalAuthGuard>
      } />
      <Route path="/customer-dashboard" component={() => 
        <PortalAuthGuard requiredPortal="customer">
          <CustomerDashboard />
        </PortalAuthGuard>
      } />
      <Route path="/customer-service-tracker" component={() => 
        <PortalAuthGuard requiredPortal="customer">
          <CustomerServiceTracker />
        </PortalAuthGuard>
      } />
      <Route path="/issues" component={() => 
        <PortalAuthGuard requiredPortal="customer">
          <IssueCategorizationPage />
        </PortalAuthGuard>
      } />
      <Route path="/registration-success" component={RegistrationSuccess} />
      
      {/* Support Services - Essential Customer Services */}
      <Route path="/live-support" component={() => <LiveSupportPage username={getStoredUsername()} />} />
      <Route path="/phone-support" component={PhoneSupportPage} />
      <Route path="/screen-sharing" component={ScreenSharingPage} />
      <Route path="/technician-request" component={QuickServiceProviderRequest} />
      <Route path="/tracking" component={TrackingPage} />
      <Route path="/service-provider-chat" component={ServiceProviderChat} />
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
      <Route path="/service-provider-dashboard" component={() => 
        <PortalAuthGuard requiredPortal="service_provider">
          <ServiceProviderDashboard />
        </PortalAuthGuard>
      } />
      <Route path="/technician-dashboard" component={() => 
        <PortalAuthGuard requiredPortal="service_provider">
          <ServiceProviderDashboard />
        </PortalAuthGuard>
      } />
      <Route path="/service-provider-chat" component={() => 
        <PortalAuthGuard requiredPortal="service_provider">
          <ServiceProviderChat />
        </PortalAuthGuard>
      } />
      <Route path="/service-provider-chat-page" component={() => 
        <PortalAuthGuard requiredPortal="service_provider">
          <ServiceProviderChatPage />
        </PortalAuthGuard>
      } />
      <Route path="/technician-earnings" component={() => 
        <PortalAuthGuard requiredPortal="service_provider">
          <TechnicianEarnings />
        </PortalAuthGuard>
      } />
      <Route path="/profile-visibility" component={() => 
        <PortalAuthGuard requiredPortal="service_provider">
          <ProfileVisibilityPage />
        </PortalAuthGuard>
      } />
      <Route path="/technicians" component={TechnicianLanding} />
      <Route path="/notifications-dashboard" component={() => 
        <PortalAuthGuard requiredPortal="service_provider">
          <NotificationsDashboard />
        </PortalAuthGuard>
      } />
      <Route path="/technician-matching" component={TechnicianMatchingPage} />
      <Route path="/test-notifications" component={TestNotificationSystem} />
      <Route path="/technician-referrals" component={() => 
        <PortalAuthGuard requiredPortal="service_provider">
          <TechnicianReferrals />
        </PortalAuthGuard>
      } />
      <Route path="/technician-opportunities" component={() => 
        <PortalAuthGuard requiredPortal="service_provider">
          <TechnicianOpportunities />
        </PortalAuthGuard>
      } />
      <Route path="/learning-center" component={() => 
        <PortalAuthGuard requiredPortal="service_provider">
          <LearningCenter />
        </PortalAuthGuard>
      } />
      <Route path="/technician-inbox" component={() => 
        <PortalAuthGuard requiredPortal="service_provider">
          <TechnicianInbox />
        </PortalAuthGuard>
      } />
      <Route path="/technician-help" component={() => 
        <PortalAuthGuard requiredPortal="service_provider">
          <TechnicianHelp />
        </PortalAuthGuard>
      } />
      
      {/* Admin Portal */}
      <Route path="/admin-home" component={AdminHomePage} />
      <Route path="/admin" component={() => 
        <PortalAuthGuard requiredPortal="admin">
          <AdminDashboard />
        </PortalAuthGuard>
      } />
      <Route path="/admin-portal" component={() => 
        <PortalAuthGuard requiredPortal="admin">
          <AdminNavigation />
        </PortalAuthGuard>
      } />
      <Route path="/admin-earnings" component={() => 
        <PortalAuthGuard requiredPortal="admin">
          <AdminEarningSettings />
        </PortalAuthGuard>
      } />
      <Route path="/admin-categories" component={() => 
        <PortalAuthGuard requiredPortal="admin">
          <AdminCategoryManagement />
        </PortalAuthGuard>
      } />
      <Route path="/admin/announcements" component={() => 
        <PortalAuthGuard requiredPortal="admin">
          <AdminAnnouncements />
        </PortalAuthGuard>
      } />
      <Route path="/ai-chat-analytics" component={() => 
        <PortalAuthGuard requiredPortal="admin">
          <AIChatAnalytics />
        </PortalAuthGuard>
      } />
      
      {/* User Profile - Conditional routing (Summary vs Multi-step) */}
      <Route path="/profile/:username" component={ProfileRoute} />
      <Route path="/profile/:username/personal" component={ProfilePersonalInfo} />
      <Route path="/profile/:username/address" component={ProfileAddress} />
      <Route path="/profile/:username/business" component={ProfileBusiness} />
      <Route path="/profile/:username/payment" component={ProfilePayment} />
      <Route path="/profile/:username/review" component={ProfileReview} />
      
      {/* Legacy profile route for compatibility */}
      <Route path="/:username/profile" component={ProfileRoute} />
      
      {/* Development/Testing Pages - Only available in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <Route path="/domains" component={DomainSelector} />
          <Route path="/notifications" component={NotificationsDashboard} />
          <Route path="/onboarding" component={OnboardingWizard} />
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
      const storedUsername = localStorage.getItem("techgpt_username");
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
          {/* Development role switcher for testing */}
          <DevRoleSwitcher />
          {/* Temporarily disabled complex components causing loading issues */}
          {/* <FloatingChatWidget username={username} /> */}
          {/* <AIFeatureDiscoveryWrapper /> */}
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
