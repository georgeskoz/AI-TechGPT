import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot,
  Minimize2,
  Maximize2,
  HelpCircle,
  Zap,
  Brain,
  Phone,
  Users
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import ChatTriage from "./ChatTriage";
import LiveSupportChat from "./LiveSupportChat";

interface FloatingChatWidgetProps {
  username: string;
}

export default function FloatingChatWidget({ username }: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [currentView, setCurrentView] = useState<'menu' | 'triage' | 'live_chat'>('menu');
  const [, setLocation] = useLocation();

  const handleSendMessage = () => {
    if (message.trim()) {
      // Navigate to chat page with the message
      setLocation(`/chat?message=${encodeURIComponent(message)}&username=${encodeURIComponent(username)}`);
      setMessage("");
      setIsOpen(false);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === "Start Live Support Chat") {
      setLocation("/live-support");
      setIsOpen(false);
    } else if (action === "AI Triage Analysis") {
      setCurrentView('triage');
    } else {
      setMessage(action);
      setLocation(`/chat?message=${encodeURIComponent(action)}&username=${encodeURIComponent(username)}`);
      setIsOpen(false);
    }
  };

  const handlePathSelected = (path: string, data?: any) => {
    switch (path) {
      case 'ai_chat':
        setLocation('/chat');
        setIsOpen(false);
        break;
      case 'live_chat':
        setCurrentView('live_chat');
        break;
      case 'phone_support':
        setLocation('/phone-support');
        setIsOpen(false);
        break;
      case 'escalate':
        setLocation('/live-support');
        setIsOpen(false);
        break;
      default:
        setCurrentView('menu');
    }
  };

  const quickActions = [
    "AI Triage Analysis",
    "Start Live Support Chat", 
    "Help me troubleshoot a network connection issue",
    "I need help with software installation",
    "My computer is running slowly, what should I check?",
    "How do I set up email on my phone?",
    "I'm having database connection problems"
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
        <div className="absolute -top-2 -left-2">
          <div className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            <HelpCircle className="h-3 w-3" />
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'triage') {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-96 h-[500px] shadow-xl border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('menu')}
                  className="h-6 w-6 p-0"
                >
                  ←
                </Button>
                <CardTitle className="text-sm">AI Triage</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-full overflow-y-auto">
            <ChatTriage username={username} onPathSelected={handlePathSelected} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'live_chat') {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-96 h-[500px] shadow-xl border-2">
          <CardContent className="h-full p-0">
            <LiveSupportChat 
              username={username}
              isMinimized={false}
              onToggleMinimize={() => setCurrentView('menu')}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 shadow-2xl border-2 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-sm">TechGPT Assistant</CardTitle>
                <p className="text-xs text-gray-600">Ask about any technical issue</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="space-y-4">
            {/* Quick Actions */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Quick Help</span>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {quickActions.slice(0, 4).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className={`text-left text-xs p-2 rounded w-full transition-colors flex items-center gap-2 ${
                      action === "AI Triage Analysis" 
                        ? "text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                        : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    }`}
                  >
                    {action === "AI Triage Analysis" ? (
                      <Brain className="h-3 w-3" />
                    ) : action === "Start Live Support Chat" ? (
                      <Users className="h-3 w-3" />
                    ) : (
                      <Bot className="h-3 w-3" />
                    )}
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your technical issue or question..."
                className="min-h-[60px] text-sm resize-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    AI Powered
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Expert Help
                  </Badge>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Send className="h-3 w-3" />
                  Send
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Instant AI responses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Connect with expert technicians</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Track your service requests</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}