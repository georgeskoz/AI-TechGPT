import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@shared/components/ui/toaster";
import { AuthProvider } from "@shared/components/UserAuthProvider";
import { queryClient } from "@shared/lib/queryClient";

// Import customer pages from original client
import ChatPage from "../../../client/src/pages/ChatPage";
import CustomerHomePage from "../../../client/src/pages/CustomerHomePage";
import CustomerDashboard from "../../../client/src/pages/CustomerDashboard";
import MarketplacePage from "../../../client/src/pages/MarketplacePage";
import LoginPage from "../../../client/src/pages/LoginPage";
import RegisterPage from "../../../client/src/pages/RegisterPage";
import ProfilePage from "../../../client/src/pages/ProfilePage";
import NotFound from "../../../client/src/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/" component={ChatPage} />
          <Route path="/chat" component={ChatPage} />
          <Route path="/home" component={CustomerHomePage} />
          <Route path="/dashboard" component={CustomerDashboard} />
          <Route path="/marketplace" component={MarketplacePage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
