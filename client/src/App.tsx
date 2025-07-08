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
import DiagnosticPage from "@/pages/DiagnosticPage";
import ClientDashboard from "@/pages/ClientDashboard";
import AuthTestPage from "@/components/AuthTestPage";
import TechnicianRegistration from "@/pages/TechnicianRegistration";
import TechnicianDashboard from "@/pages/TechnicianDashboard";
import TechnicianLanding from "@/pages/TechnicianLanding";
import TechnicianMatchingPage from "@/pages/TechnicianMatchingPage";
import TechnicianEarnings from "@/pages/TechnicianEarnings";
import ProfileVisibilityPage from "@/pages/ProfileVisibilityPage";
import CustomerHomePage from "@/pages/CustomerHomePage";
import TechnicianHomePage from "@/pages/TechnicianHomePage";
import AdminHomePage from "@/pages/AdminHomePage";
import DomainSelector from "@/pages/DomainSelector";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminNavigation from "@/components/AdminNavigation";
import AdminEarningSettings from "@/components/AdminEarningSettings";
import FloatingChatWidget from "@/components/FloatingChatWidget";

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
      <Route path="/diagnostic" component={DiagnosticPage} />
      <Route path="/dashboard" component={ClientDashboard} />
      <Route path="/auth-test" component={AuthTestPage} />
      <Route path="/technician-register" component={TechnicianRegistration} />
      <Route path="/technician-dashboard" component={TechnicianDashboard} />
      <Route path="/technicians" component={TechnicianLanding} />
      <Route path="/technician-matching" component={TechnicianMatchingPage} />
      <Route path="/technician-earnings" component={TechnicianEarnings} />
      <Route path="/profile-visibility" component={ProfileVisibilityPage} />
      <Route path="/domains" component={DomainSelector} />
      <Route path="/customer-home" component={CustomerHomePage} />
      <Route path="/technician-home" component={TechnicianHomePage} />
      <Route path="/admin-home" component={AdminHomePage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin-portal" component={AdminNavigation} />
      <Route path="/admin-earnings" component={AdminEarningSettings} />
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
