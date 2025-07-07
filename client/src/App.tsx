import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import IssueCategorizationPage from "@/pages/IssueCategorizationPage";
import PhoneSupportPage from "@/pages/PhoneSupportPage";
import MarketplacePage from "@/pages/MarketplacePage";
import LiveSupportPage from "@/pages/LiveSupportPage";
import TriagePage from "@/pages/TriagePage";
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
      <Router />
      <FloatingChatWidget username={username} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
