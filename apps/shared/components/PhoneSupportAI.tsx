import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Bot, User, MessageSquare, Clock, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import PhoneSupportPricing from "./PhoneSupportPricing";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface SupportService {
  id: string;
  name: string;
  description: string;
  supportLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  basePrice: number;
  minimumTime: number;
  category: string;
  includes: string[];
}

interface PricingFactors {
  supportLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  timeOfDay: 'morning' | 'midday' | 'afternoon' | 'evening' | 'midnight';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number;
  distance?: number;
  isOutOfTown: boolean;
  trafficFactor: number;
  demandMultiplier: number;
  dayOfWeek: 'weekday' | 'weekend';
}

interface PhoneSupportAIProps {
  username: string;
  onBack: () => void;
}

export default function PhoneSupportAI({ username, onBack }: PhoneSupportAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI Phone Support Assistant. I'm here to help you with your technical issues before connecting you with a human technician. This can save you time and potentially resolve your issue faster. What technical problem are you experiencing?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [issueAssessment, setIssueAssessment] = useState<{
    category: string;
    complexity: string;
    urgency: string;
    estimatedDuration: number;
    requiresPhoneSupport: boolean;
  } | null>(null);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsAiResponding(true);

    try {
      // Get AI response for phone support context
      const response = await apiRequest("POST", "/api/support/phone-ai-response", {
        userMessage: currentMessage,
        context: messages.slice(-3), // Last 3 messages for context
        username,
      });

      const aiResponse = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.message,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // If AI suggests phone support, store assessment
      if (aiResponse.suggestPhoneSupport) {
        setIssueAssessment(aiResponse.assessment);
      }
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble processing your request right now. Would you like to connect directly with a human technician?",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiResponding(false);
    }
  };

  const handleConnectToHuman = () => {
    setShowPricing(true);
  };

  const handleServiceSelected = (service: SupportService, factors: PricingFactors) => {
    // Here you would typically create a phone support request
    console.log('Phone support service booked:', service, factors);
    
    // Add confirmation message
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      content: `Great! I've scheduled your phone support session for "${service.name}". A technician will call you within 15 minutes. The estimated cost is $${(service.basePrice * factors.demandMultiplier).toFixed(2)} for ${factors.estimatedDuration} minutes.`,
      sender: "ai",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
    setShowPricing(false);
  };

  if (showPricing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" onClick={() => setShowPricing(false)}>
            ← Back to AI Chat
          </Button>
          <h2 className="text-lg font-semibold">Phone Support Pricing</h2>
        </div>
        
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
              <Bot className="h-4 w-4" />
              <span>AI Assessment</span>
            </div>
            {issueAssessment && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Category:</span> {issueAssessment.category}
                </div>
                <div>
                  <span className="font-medium">Complexity:</span> {issueAssessment.complexity}
                </div>
                <div>
                  <span className="font-medium">Urgency:</span> {issueAssessment.urgency}
                </div>
                <div>
                  <span className="font-medium">Est. Duration:</span> {issueAssessment.estimatedDuration} min
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <PhoneSupportPricing
          onServiceSelected={handleServiceSelected}
          prefilledFactors={issueAssessment ? {
            supportLevel: issueAssessment.complexity.toLowerCase() as any,
            urgency: issueAssessment.urgency.toLowerCase() as any,
            estimatedDuration: issueAssessment.estimatedDuration,
          } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back
        </Button>
        <h2 className="text-lg font-semibold">AI Phone Support Assistant</h2>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Bot className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <Card className="h-96">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Support Pre-Screening
          </CardTitle>
          <p className="text-xs text-gray-600">
            Let me understand your issue first - this might save you time and money!
          </p>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-purple-100 text-purple-900 border border-purple-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">
                        {message.sender === "user" ? "U" : "🤖"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {message.sender === "user" ? "You" : "AI Assistant"}
                    </span>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            
            {isAiResponding && (
              <div className="flex justify-start">
                <div className="bg-purple-100 text-purple-900 border border-purple-200 p-3 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">🤖</AvatarFallback>
                    </Avatar>
                    <span>AI Assistant is analyzing your issue...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Describe your technical issue in detail..."
              className="min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex justify-between items-center">
              <Button
                onClick={handleConnectToHuman}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Phone className="h-3 w-3 mr-1" />
                Skip AI - Call Human Now
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isAiResponding}
                size="sm"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-purple-600">
                <Bot className="h-4 w-4" />
                <span>Free AI Pre-screening</span>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Potential cost savings</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Phone support rates start at $25/session
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}