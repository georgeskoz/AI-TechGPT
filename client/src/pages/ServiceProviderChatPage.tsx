import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/components/UserAuthProvider";
import { Send, Bot, User, Wrench, MessageCircle, Clock, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  category?: string;
  urgency?: string;
}

interface ServiceProviderStats {
  activeJobs: number;
  pendingRequests: number;
  todayEarnings: number;
  responseTime: string;
  rating: number;
  completedJobs: number;
}

export default function ServiceProviderChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Mock stats for now - in real implementation, these would come from API
  const stats: ServiceProviderStats = {
    activeJobs: 3,
    pendingRequests: 7,
    todayEarnings: 285,
    responseTime: "2.3 min",
    rating: 4.8,
    completedJobs: 142
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("/api/service-provider/chat", {
        method: "POST",
        body: { message, userId: user?.id }
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.response) {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "_ai",
          content: data.response,
          isUser: false,
          timestamp: new Date(),
          category: data.category,
          urgency: data.urgency
        }]);
      }
      setIsTyping(false);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      setIsTyping(false);
    }
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    sendMessageMutation.mutate(inputValue);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "welcome",
        content: `Welcome to the Service Provider AI Assistant! I'm here to help you with:

• Job management and scheduling
• Customer communication best practices
• Technical troubleshooting guidance
• Earnings and pricing optimization
• Professional development tips
• Platform features and tools

How can I assist you today?`,
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Wrench className="h-5 w-5" />
                  Service Provider Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.activeJobs}</div>
                    <div className="text-xs text-gray-600">Active Jobs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.pendingRequests}</div>
                    <div className="text-xs text-gray-600">Pending Requests</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Today's Earnings</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ${stats.todayEarnings}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Response</span>
                    <Badge variant="outline">
                      {stats.responseTime}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      ⭐ {stats.rating}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <Badge variant="outline">
                      {stats.completedJobs} jobs
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    View Active Jobs
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Earnings Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <MessageCircle className="h-5 w-5" />
                  Service Provider AI Assistant
                </CardTitle>
                <p className="text-sm text-green-600">
                  Get help with job management, customer communication, and professional development
                </p>
              </CardHeader>
              
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[420px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.isUser ? user?.profileImageUrl : undefined} />
                            <AvatarFallback className={message.isUser ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}>
                              {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className={`rounded-lg p-3 ${
                            message.isUser 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                            <div className={`text-xs mt-1 ${message.isUser ? 'text-green-100' : 'text-gray-500'}`}>
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                            {message.category && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                {message.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about job management, customer communication, earnings optimization..."
                      className="flex-1 min-h-[44px] max-h-32 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                    <Button 
                      type="submit" 
                      disabled={!inputValue.trim() || sendMessageMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}