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
import FloatingChatWidget from "@/components/FloatingChatWidget";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ChatPage} />
      <Route path="/marketplace" component={() => <MarketplacePage username={localStorage.getItem("username") || "Guest"} />} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/issues" component={IssueCategorizationPage} />
      <Route path="/phone-support" component={PhoneSupportPage} />
      <Route path="/live-support" component={() => <LiveSupportPage username={localStorage.getItem("username") || "Guest"} />} />
      <Route path="/triage" component={TriagePage} />
      <Route path="/diagnostic" component={DiagnosticPage} />
      <Route path="/dashboard" component={ClientDashboard} />
      <Route path="/auth-test" component={AuthTestPage} />
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
