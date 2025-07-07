import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import IssueCategorizationPage from "@/pages/IssueCategorizationPage";
import PhoneSupportPage from "@/pages/PhoneSupportPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ChatPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/issues" component={IssueCategorizationPage} />
      <Route path="/phone-support" component={PhoneSupportPage} />
      <Route path="/:username/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
