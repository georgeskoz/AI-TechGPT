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
      <Route path="/" component={CustomerHomePage} />
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
      <Route path="/feature-discovery" component={FeatureDiscoveryPage} />
      
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
      
      {/* User Profile */}
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8">TechGPT - Customer Portal</h1>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">AI Chat Support</h2>
              <p className="text-gray-600 mb-4">Get instant help with technical questions</p>
              <button 
                onClick={() => window.location.href = '/chat'} 
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Start Chat
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Phone Support</h2>
              <p className="text-gray-600 mb-4">Talk to our technical experts</p>
              <button 
                onClick={() => window.location.href = '/phone-support'} 
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Call Support
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Live Support</h2>
              <p className="text-gray-600 mb-4">Real-time chat with technicians</p>
              <button 
                onClick={() => window.location.href = '/live-support'} 
                className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
              >
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
