import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  Send, 
  Clock, 
  User, 
  Technician,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Minimize2,
  Maximize2,
  Users
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SupportCase {
  id: number;
  customerId: number;
  technicianId?: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  category?: string;
  startTime: string;
  endTime?: string;
  totalDuration: number;
  isFreeSupport: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SupportMessage {
  id: number;
  caseId: number;
  senderId: number;
  senderType: "customer" | "technician";
  content: string;
  messageType: string;
  isRead: boolean;
  timestamp: string;
}

interface LiveSupportChatProps {
  userId: number;
  username: string;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export default function LiveSupportChat({ 
  userId, 
  username, 
  isMinimized = false, 
  onToggleMinimize 
}: LiveSupportChatProps) {
  const [currentCase, setCurrentCase] = useState<SupportCase | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [chatStartTime, setChatStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [aiMode, setAiMode] = useState(true);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  // Get user's support cases
  const { data: supportCases = [] } = useQuery({
    queryKey: ["/api/support/cases/customer", userId],
    queryFn: async () => {
      const response = await fetch(`/api/support/cases/customer/${userId}`);
      return response.json();
    },
  });

  // Get messages for current case
  const { data: messages = [] } = useQuery({
    queryKey: ["/api/support/cases", currentCase?.id, "messages"],
    queryFn: async () => {
      if (!currentCase) return [];
      const response = await fetch(`/api/support/cases/${currentCase.id}/messages`);
      return response.json();
    },
    enabled: !!currentCase,
  });

  // Create support case mutation
  const createCaseMutation = useMutation({
    mutationFn: async (caseData: { title: string; description: string; category: string; priority: string }) => {
      const response = await apiRequest("POST", "/api/support/cases", {
        customerId: userId,
        ...caseData,
      });
      return response.json();
    },
    onSuccess: async (newCase) => {
      setCurrentCase(newCase);
      setChatStartTime(new Date());
      queryClient.invalidateQueries({ queryKey: ["/api/support/cases/customer", userId] });
      
      // Send AI welcome message
      try {
        await apiRequest("POST", `/api/support/cases/${newCase.id}/messages`, {
          senderId: 999,
          senderType: "technician",
          content: "Hello! I'm your AI Technical Assistant. I'm here to help you with your technical questions and issues. What can I assist you with today?",
          messageType: "text",
        });
        
        queryClient.invalidateQueries({ 
          queryKey: ["/api/support/cases", newCase.id, "messages"] 
        });
      } catch (error) {
        console.error("Error sending welcome message:", error);
      }
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!currentCase) throw new Error("No active case");
      const response = await apiRequest("POST", `/api/support/cases/${currentCase.id}/messages`, {
        senderId: userId,
        senderType: "customer",
        content,
        messageType: "text",
      });
      return response.json();
    },
    onSuccess: (message) => {
      setNewMessage("");
      queryClient.invalidateQueries({ 
        queryKey: ["/api/support/cases", currentCase?.id, "messages"] 
      });
      
      // If in AI mode, generate AI response
      if (aiMode && currentCase) {
        handleAiResponse(message.content);
      }
    },
  });

  // AI response handler
  const handleAiResponse = async (userMessage: string) => {
    if (!currentCase) return;
    
    setIsAiResponding(true);
    
    try {
      // Simulate AI thinking delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      const response = await apiRequest("POST", `/api/support/ai-response`, {
        caseId: currentCase.id,
        userMessage,
        context: messages.slice(-5), // Last 5 messages for context
      });
      
      const aiResponse = await response.json();
      
      // Send AI response as message
      await apiRequest("POST", `/api/support/cases/${currentCase.id}/messages`, {
        senderId: 999, // AI assistant ID
        senderType: "technician",
        content: aiResponse.message,
        messageType: "text",
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ["/api/support/cases", currentCase?.id, "messages"] 
      });
      
    } catch (error) {
      console.error("Error generating AI response:", error);
    } finally {
      setIsAiResponding(false);
    }
  };

  // Close case mutation
  const closeCaseMutation = useMutation({
    mutationFn: async () => {
      if (!currentCase) throw new Error("No active case");
      const response = await apiRequest("POST", `/api/support/cases/${currentCase.id}/close`, {
        totalDuration: elapsedTime,
      });
      return response.json();
    },
    onSuccess: () => {
      setCurrentCase(null);
      setChatStartTime(null);
      setElapsedTime(0);
      queryClient.invalidateQueries({ queryKey: ["/api/support/cases/customer", userId] });
    },
  });

  // Timer for elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (chatStartTime && currentCase?.status !== "closed") {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - chatStartTime.getTime()) / 1000 / 60); // minutes
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [chatStartTime, currentCase?.status]);

  // WebSocket connection
  useEffect(() => {
    if (currentCase) {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        wsRef.current?.send(JSON.stringify({
          type: "join_case",
          caseId: currentCase.id,
        }));
      };
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case "new_message":
            queryClient.invalidateQueries({ 
              queryKey: ["/api/support/cases", currentCase.id, "messages"] 
            });
            break;
          case "typing":
            if (data.userId !== userId) {
              setIsTyping(data.isTyping);
            }
            break;
          case "joined_case":
            console.log(`Joined case ${data.caseId}`);
            break;
        }
      };
      
      return () => {
        wsRef.current?.close();
      };
    }
  }, [currentCase, userId, queryClient]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && currentCase) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  const handleStartNewCase = () => {
    createCaseMutation.mutate({
      title: `Support Request - ${new Date().toLocaleString()}`,
      description: "Live support chat session",
      category: "General Support",
      priority: "medium",
    });
  };

  const handleSwitchToHuman = async () => {
    if (!currentCase) return;
    
    setAiMode(false);
    
    // Send system message about switching to human agent
    await apiRequest("POST", `/api/support/cases/${currentCase.id}/messages`, {
      senderId: 999,
      senderType: "technician", 
      content: "I'm connecting you with a human technician who can provide more specialized assistance. Please wait a moment...",
      messageType: "system",
    });
    
    queryClient.invalidateQueries({ 
      queryKey: ["/api/support/cases", currentCase?.id, "messages"] 
    });
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}:${mins.toString().padStart(2, "0")}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "assigned": return <Users className="h-4 w-4 text-blue-500" />;
      case "closed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 right-6 z-50">
        <Button
          onClick={onToggleMinimize}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full h-12 w-12 shadow-lg"
          size="icon"
        >
          <MessageSquare className="h-5 w-5" />
          {currentCase && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              !
            </div>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] flex flex-col">
      <Card className="h-full flex flex-col shadow-2xl border-2 border-green-200">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-sm">Live Support</CardTitle>
                <p className="text-xs text-gray-600">
                  {currentCase ? "Connected" : "Start a chat"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {onToggleMinimize && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleMinimize}
                  className="h-6 w-6 p-0"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          
          {currentCase && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(currentCase.status)}
                    <span className="capitalize">{currentCase.status}</span>
                  </div>
                  {aiMode && (
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      AI Support
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(elapsedTime)}</span>
                </div>
              </div>
              
              {elapsedTime <= 10 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Free support time</span>
                    <span>{10 - elapsedTime} min left</span>
                  </div>
                  <Progress value={(elapsedTime / 10) * 100} className="h-1" />
                </div>
              )}
              
              {elapsedTime > 10 && (
                <Badge variant="outline" className="text-xs">
                  Paid support active
                </Badge>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-4 space-y-4 min-h-0">
          {!currentCase ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <h3 className="text-sm font-medium">Need Help?</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Start a live chat with our technical support team
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="flex items-center gap-2 text-xs text-purple-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>AI Assistant first</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>First 10 minutes free</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <Users className="h-3 w-3" />
                  <span>Human expert backup</span>
                </div>
              </div>
              
              <Button
                onClick={handleStartNewCase}
                disabled={createCaseMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                {createCaseMutation.isPending ? "Starting..." : "Start AI Support"}
              </Button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.map((message: SupportMessage) => {
                  const isAiMessage = message.senderId === 999;
                  const isSystemMessage = message.messageType === "system";
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderType === "customer" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-2 rounded-lg text-xs ${
                          message.senderType === "customer"
                            ? "bg-blue-600 text-white"
                            : isAiMessage
                            ? "bg-purple-100 text-purple-900 border border-purple-200"
                            : isSystemMessage
                            ? "bg-yellow-100 text-yellow-900 border border-yellow-200"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-xs">
                              {message.senderType === "customer" 
                                ? "C" 
                                : isAiMessage 
                                ? "🤖" 
                                : "T"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {message.senderType === "customer" 
                              ? "You" 
                              : isAiMessage 
                              ? "AI Assistant" 
                              : "Technician"}
                          </span>
                          <span className="text-xs opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p>{message.content}</p>
                        
                        {isAiMessage && aiMode && (
                          <div className="mt-2 pt-2 border-t border-purple-200">
                            <Button
                              onClick={handleSwitchToHuman}
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6 px-2 text-purple-700 hover:bg-purple-200"
                            >
                              Talk to Human Agent
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {(isTyping || isAiResponding) && (
                  <div className="flex justify-start">
                    <div className={`p-2 rounded-lg text-xs ${
                      isAiResponding 
                        ? "bg-purple-100 text-purple-900 border border-purple-200"
                        : "bg-gray-100 text-gray-900"
                    }`}>
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-xs">
                            {isAiResponding ? "🤖" : "T"}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {isAiResponding 
                            ? "AI Assistant is analyzing..." 
                            : "Technician is typing..."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="text-xs"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    size="sm"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-600">
                    Case #{currentCase.id}
                  </div>
                  <Button
                    onClick={() => closeCaseMutation.mutate()}
                    disabled={closeCaseMutation.isPending}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Close Case
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}