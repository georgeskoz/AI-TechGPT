import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@shared/components/ui/toaster";
import { AuthProvider } from "@shared/components/UserAuthProvider";
import { queryClient } from "@shared/lib/queryClient";

// Import provider pages from original client
import ServiceProviderChatPage from "../../../client/src/pages/ServiceProviderChatPage";
import ProviderDashboard from "../../../client/src/pages/ProviderDashboard";
import ProviderJobs from "../../../client/src/pages/ProviderJobs";
import ProviderEarnings from "../../../client/src/pages/ProviderEarnings";
import ProviderProfile from "../../../client/src/pages/ProviderProfile";
import ProviderMessages from "../../../client/src/pages/ProviderMessages";
import ProviderLogin from "../../../client/src/pages/ProviderLogin";
import ProviderRegister from "../../../client/src/pages/ProviderRegister";
import NotFound from "../../../client/src/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/" component={ProviderDashboard} />
          <Route path="/dashboard" component={ProviderDashboard} />
          <Route path="/jobs" component={ProviderJobs} />
          <Route path="/earnings" component={ProviderEarnings} />
          <Route path="/profile" component={ProviderProfile} />
          <Route path="/messages" component={ProviderMessages} />
          <Route path="/chat" component={ServiceProviderChatPage} />
          <Route path="/login" component={ProviderLogin} />
          <Route path="/register" component={ProviderRegister} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
