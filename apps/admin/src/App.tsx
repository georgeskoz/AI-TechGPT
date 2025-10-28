import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@shared/components/ui/toaster";
import { AuthProvider } from "@shared/components/UserAuthProvider";
import { queryClient } from "@shared/lib/queryClient";

// Import admin pages from original client
import AdminDashboard from "../../../client/src/pages/AdminDashboard";
import AdminHomePage from "../../../client/src/pages/AdminHomePage";
import LoginPage from "../../../client/src/pages/LoginPage";
import NotFound from "../../../client/src/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/" component={AdminHomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/:rest*" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
