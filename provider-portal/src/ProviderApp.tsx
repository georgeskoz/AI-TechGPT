import { Switch, Route, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ProviderLogin from "./pages/ProviderLogin";
import ProviderRegister from "./pages/ProviderRegister";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderJobs from "./pages/ProviderJobs";
import ProviderEarnings from "./pages/ProviderEarnings";
import ProviderProfile from "./pages/ProviderProfile";
import ProviderMessages from "./pages/ProviderMessages";
import ProviderNotFound from "./pages/ProviderNotFound";

function ProviderApp() {
  const [location] = useLocation();

  // Check if user is authenticated
  const { data: session } = useQuery({
    queryKey: ["/api/session"],
    retry: false,
  });

  const isAuthenticated = session?.user?.role === "service_provider";
  const isAuthPage = location === "/login" || location === "/register";

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !isAuthPage) {
    return <ProviderLogin />;
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPage) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <Switch>
        <Route path="/login" component={ProviderLogin} />
        <Route path="/register" component={ProviderRegister} />
        <Route path="/" component={ProviderDashboard} />
        <Route path="/jobs" component={ProviderJobs} />
        <Route path="/earnings" component={ProviderEarnings} />
        <Route path="/profile" component={ProviderProfile} />
        <Route path="/messages" component={ProviderMessages} />
        <Route component={ProviderNotFound} />
      </Switch>
    </div>
  );
}

export default ProviderApp;
