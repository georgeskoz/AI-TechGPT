import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/UserAuthProvider";
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


function Router() {
  return (
    <Switch>
      <Route path="/" component={CustomerHomePage} />
      <Route path="/marketplace" component={() => <MarketplacePage username={localStorage.getItem("username") || "Guest"} />} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/issues" component={IssueCategorizationPage} />
      <Route path="/phone-support" component={PhoneSupportPage} />
      <Route path="/live-support" component={() => <LiveSupportPage username={localStorage.getItem("username") || "Guest"} />} />
      <Route path="/triage" component={TriagePage} />
      <Route path="/diagnostic" component={SimpleDiagnosticPage} />
      <Route path="/dashboard" component={ClientDashboard} />
      <Route path="/auth-test" component={AuthTestPage} />
      <Route path="/technician-register" component={ServiceProviderRegistration} />
      <Route path="/technician-dashboard" component={ServiceProviderDashboard} />
      <Route path="/technicians" component={TechnicianLanding} />
      <Route path="/technician-matching" component={TechnicianMatchingPage} />
      <Route path="/find-expert" component={ExpertTechnicianFinder} />
      <Route path="/book-technician" component={SimpleBooking} />
      <Route path="/book-service" component={BookServicePage} />
      <Route path="/technician-earnings" component={TechnicianEarnings} />
      <Route path="/profile-visibility" component={ProfileVisibilityPage} />
      <Route path="/domains" component={DomainSelector} />
      <Route path="/customer-home" component={CustomerHomePage} />
      <Route path="/technician-home" component={ServiceProviderHomePage} />
      <Route path="/admin-home" component={AdminHomePage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin-portal" component={AdminNavigation} />
      <Route path="/admin-earnings" component={AdminEarningSettings} />
      <Route path="/admin-categories" component={AdminCategoryManagement} />
      <Route path="/admin/announcements" component={AdminAnnouncements} />
      <Route path="/onboarding" component={OnboardingWizard} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/test-notifications" component={TestNotificationSystem} />
      <Route path="/:username/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Get username from localStorage for the floating chat widget
  const username = localStorage.getItem("username") || "Guest";

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
