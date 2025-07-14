import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, User } from "lucide-react";

export default function RegistrationSuccess() {
  const [, setLocation] = useLocation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect to login after 5 seconds
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setLocation('/chat');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setLocation]);

  const handleContinue = () => {
    setLocation('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white text-center py-6">
          <h1 className="text-2xl font-bold">Customer Registration</h1>
        </div>

        <CardContent className="p-8 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="relative mx-auto w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center">
              {/* Card/Document Icon */}
              <div className="relative">
                <div className="w-12 h-8 bg-white border-2 border-gray-600 rounded-sm flex flex-col justify-center items-start pl-1">
                  <div className="w-3 h-0.5 bg-green-600 mb-1"></div>
                  <div className="w-4 h-0.5 bg-green-600 mb-1"></div>
                  <div className="w-2 h-0.5 bg-green-600"></div>
                </div>
                {/* Hand/Thumb */}
                <div className="absolute -bottom-2 -right-1">
                  <div className="w-6 h-8 border-2 border-gray-600 rounded-bl-md rounded-br-md bg-white relative">
                    <div className="absolute top-1 left-1 w-1 h-1 bg-gray-600 rounded-full"></div>
                    <div className="absolute top-3 left-1 w-1 h-1 bg-gray-600 rounded-full"></div>
                    <div className="absolute top-5 left-1 w-1 h-1 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-2 border-gray-600 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-green-600 mb-3">THANK YOU</h2>
            <p className="text-gray-600 text-lg mb-4">successfully registered</p>
            <p className="text-gray-500">You will be redirected to login screen</p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-6">
            <div className="text-gray-500 text-sm mb-2">
              Redirecting in {countdown} seconds...
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Continue Button */}
          <Button 
            onClick={handleContinue}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            Continue to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}