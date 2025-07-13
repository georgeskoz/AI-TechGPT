import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Home, Menu } from "lucide-react";

interface SimpleNavigationProps {
  showBackButton?: boolean;
  backTo?: string;
  title?: string;
}

export default function SimpleNavigation({ 
  showBackButton = true, 
  backTo = "/", 
  title 
}: SimpleNavigationProps) {
  const [location, setLocation] = useLocation();

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button and Title */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            
            {title && (
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            )}
          </div>

          {/* Right side - Home button */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}