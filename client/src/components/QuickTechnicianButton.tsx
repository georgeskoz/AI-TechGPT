import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Wrench, Zap, ArrowRight } from "lucide-react";

export default function QuickTechnicianButton() {
  const [, setLocation] = useLocation();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Need a Technician?</h3>
            <p className="text-blue-100 text-sm">Get help in under 60 seconds</p>
          </div>
        </div>
        <Button
          onClick={() => setLocation("/technician-request")}
          className="bg-white text-blue-600 hover:bg-blue-50"
        >
          <Zap className="w-4 h-4 mr-2" />
          Request Now
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}