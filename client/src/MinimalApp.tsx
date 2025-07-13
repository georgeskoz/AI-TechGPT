import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import SimpleHome from "@/pages/SimpleHome";

function MinimalRouter() {
  return (
    <Switch>
      <Route path="/" component={SimpleHome} />
      <Route>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
            <p className="text-gray-600">The page you're looking for doesn't exist.</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function MinimalApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <MinimalRouter />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default MinimalApp;