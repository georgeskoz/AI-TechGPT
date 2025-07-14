import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  User, 
  MapPin, 
  Clock, 
  Star,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'customer' | 'provider';
  content: string;
  timestamp: Date;
  type: 'text' | 'status' | 'system';
}

export default function ServiceProviderChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'provider',
      content: 'Hi! I\'m Michael, your service provider. I\'m currently on my way to your location. I should be there in about 15 minutes.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      type: 'text'
    },
    {
      id: '2',
      sender: 'customer',
      content: 'Great! I\'ll be waiting. The issue is with my computer not starting up properly.',
      timestamp: new Date(Date.now() - 240000), // 4 minutes ago
      type: 'text'
    },
    {
      id: '3',
      sender: 'provider',
      content: 'Thanks for the details. I\'ll bring the necessary diagnostic tools. Can you describe what happens when you press the power button?',
      timestamp: new Date(Date.now() - 180000), // 3 minutes ago
      type: 'text'
    },
    {
      id: '4',
      sender: 'system',
      content: 'Service provider is now 10 minutes away',
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      type: 'system'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const serviceProvider = {
    id: 1,
    name: "Michael Chen",
    rating: 4.9,
    completedJobs: 247,
    phone: "+1 (555) 123-4567",
    skills: ["Hardware", "Network", "Security"],
    status: "en-route",
    eta: "10 minutes"
  };

  const serviceDetails = {
    bookingId: "TG-" + Date.now().toString().slice(-6),
    category: "Hardware Issues",
    description: "Computer won't start, showing blue screen error",
    location: "123 Main St, Ottawa, ON",
    serviceFee: "$90"
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'customer',
        content: newMessage.trim(),
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate provider response
      setIsTyping(true);
      setTimeout(() => {
        const responses = [
          "Thanks for the information. I'll have the right tools ready.",
          "I understand. I'll start with a diagnostic check when I arrive.",
          "Got it. This should be a straightforward fix.",
          "I'm familiar with this issue. Should be resolved quickly.",
          "Perfect. I'll update you when I'm 5 minutes away."
        ];
        
        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'provider',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: 'text'
        };
        
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStyle = (sender: string, type: string) => {
    if (type === 'system') {
      return 'bg-blue-50 text-blue-800 text-center text-sm p-2 rounded-md mx-8';
    }
    
    if (sender === 'customer') {
      return 'bg-blue-600 text-white ml-auto max-w-xs p-3 rounded-lg rounded-br-sm';
    }
    
    return 'bg-gray-100 text-gray-800 mr-auto max-w-xs p-3 rounded-lg rounded-bl-sm';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                Chat with Service Provider
              </CardTitle>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Service Provider Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{serviceProvider.name}</h3>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {serviceProvider.status === 'en-route' ? 'En Route' : serviceProvider.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{serviceProvider.rating} rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>ETA: {serviceProvider.eta}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`tel:${serviceProvider.phone}`)}
              className="flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium ml-2">{serviceDetails.bookingId}</span>
            </div>
            <div>
              <span className="text-gray-600">Category:</span>
              <span className="font-medium ml-2">{serviceDetails.category}</span>
            </div>
            <div>
              <span className="text-gray-600">Location:</span>
              <span className="font-medium ml-2">{serviceDetails.location}</span>
            </div>
            <div>
              <span className="text-gray-600">Service Fee:</span>
              <span className="font-medium ml-2">{serviceDetails.serviceFee}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Messages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                <div className={getMessageStyle(message.sender, message.type)}>
                  <div className="break-words">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <Separator />
          
          {/* Message Input */}
          <div className="p-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Tracking
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                Dashboard
              </Button>
              <Button onClick={() => window.location.href = '/tracking'}>
                View Tracking
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}