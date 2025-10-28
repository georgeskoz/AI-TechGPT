import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import AuthModal from "@/components/AuthModal";
import { 
  MessageSquare, 
  Phone, 
  Users, 
  MapPin,
  Bot,
  Brain,
  Clock,
  DollarSign,
  Star
} from "lucide-react";

interface SupportOptionsWidgetProps {
  category?: string;
  issue?: string;
  onOptionSelected?: (option: string) => void;
}

export default function SupportOptionsWidget({ 
  category, 
  issue, 
  onOptionSelected 
}: SupportOptionsWidgetProps) {
  const [, setLocation] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const supportOptions = [
    {
      id: 'ai_chat',
      title: 'AI Chat Support',
      description: 'Instant AI-powered technical assistance',
      icon: <Bot className="h-5 w-5" />,
      price: 'Free',
      duration: 'Instant',
      features: ['24/7 available', 'Instant responses', 'Multi-language'],
      color: 'bg-purple-600 hover:bg-purple-700',
      route: '/chat'
    },
    {
      id: 'triage',
      title: 'AI Triage Analysis',
      description: 'Smart issue analysis and routing',
      icon: <Brain className="h-5 w-5" />,
      price: 'Free',
      duration: '~2 min',
      features: ['Issue classification', 'Smart routing', 'Confidence scoring'],
      color: 'bg-indigo-600 hover:bg-indigo-700',
      route: '/triage'
    },
    {
      id: 'live_chat',
      title: 'Live Chat Support',
      description: 'Real-time chat with human technicians',
      icon: <MessageSquare className="h-5 w-5" />,
      price: '10 min free',
      duration: 'Real-time',
      features: ['Human expertise', 'Screen sharing', 'File transfer'],
      color: 'bg-green-600 hover:bg-green-700',
      route: '/live-support'
    },
    {
      id: 'phone_support',
      title: 'Phone Support',
      description: 'Voice guidance with technical experts',
      icon: <Phone className="h-5 w-5" />,
      price: 'From $25',
      duration: '15-60 min',
      features: ['Voice guidance', 'Complex troubleshooting', 'Step-by-step help'],
      color: 'bg-blue-600 hover:bg-blue-700',
      route: '/phone-support'
    },
    {
      id: 'onsite_support',
      title: 'Onsite Support',
      description: 'In-person technician visits',
      icon: <MapPin className="h-5 w-5" />,
      price: 'From $50',
      duration: '1-3 hours',
      features: ['Hands-on assistance', 'Hardware repairs', 'Setup & installation'],
      color: 'bg-orange-600 hover:bg-orange-700',
      route: '/marketplace'
    }
  ];

  const handleOptionClick = (option: any) => {
    // For free services (AI chat, triage), no auth required
    if (option.id === 'ai_chat' || option.id === 'triage') {
      if (onOptionSelected) {
        onOptionSelected(option.id);
      } else {
        setLocation(option.route);
      }
      return;
    }
    
    // For paid services (live chat, phone support, onsite), require authentication
    setSelectedService(option);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (user: any) => {
    // Store user info in localStorage for now
    localStorage.setItem('tech_user', JSON.stringify(user));
    
    // Navigate to the selected service
    if (selectedService) {
      if (onOptionSelected) {
        onOptionSelected(selectedService.id);
      } else {
        setLocation(selectedService.route);
      }
    }
    setShowAuthModal(false);
    setSelectedService(null);
  };

  return (
    <div className="space-y-4">
      {category && (
        <div className="mb-4">
          <Badge variant="outline" className="mb-2">
            {category}
          </Badge>
          {issue && (
            <p className="text-sm text-gray-600">{issue}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {supportOptions.map((option) => (
          <Card key={option.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gray-100">
                    {option.icon}
                  </div>
                  <div>
                    <CardTitle className="text-sm">{option.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {option.price}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {option.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3">{option.description}</p>
              
              <div className="space-y-1 mb-4">
                {option.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleOptionClick(option)}
                className={`w-full ${option.color} text-white`}
                size="sm"
              >
                Select {option.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-600 mt-6">
        <p>Need help choosing? Try our <strong>AI Triage Analysis</strong> for personalized recommendations.</p>
      </div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setSelectedService(null);
        }}
        onAuthSuccess={handleAuthSuccess}
        selectedService={selectedService?.title}
        serviceDetails={selectedService}
      />
    </div>
  );
}