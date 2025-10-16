import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function ProviderNotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
        <Button
          onClick={() => setLocation("/")}
          className="bg-green-600 hover:bg-green-700"
          data-testid="button-home"
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
