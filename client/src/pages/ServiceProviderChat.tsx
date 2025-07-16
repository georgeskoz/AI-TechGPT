import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'provider' | 'customer' | 'system';
  timestamp: Date;
  customerName?: string;
  priority?: 'low' | 'medium' | 'high';
}

export default function ServiceProviderChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to Service Provider Chat! You can communicate with customers here.",
      sender: 'system',
      timestamp: new Date()
    },
    {
      id: 2,
      text: "Hi, I'm having trouble with my laptop not connecting to WiFi. Can you help?",
      sender: 'customer',
      timestamp: new Date(),
      customerName: 'John Smith',
      priority: 'medium'
    },
    {
      id: 3,
      text: "Of course! I can help you troubleshoot your WiFi connection. Let me ask you a few questions to diagnose the issue.",
      sender: 'provider',
      timestamp: new Date()
    },
    {
      id: 4,
      text: "What operating system are you using? And when did this issue start?",
      sender: 'provider',
      timestamp: new Date()
    },
    {
      id: 5,
      text: "I'm using Windows 11 and this started yesterday evening. The WiFi icon shows but says 'No internet access'.",
      sender: 'customer',
      timestamp: new Date(),
      customerName: 'John Smith',
      priority: 'medium'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [activeCustomers] = useState([
    { name: 'John Smith', status: 'active', priority: 'medium', duration: '12 min' },
    { name: 'Sarah Johnson', status: 'waiting', priority: 'high', duration: '3 min' },
    { name: 'Mike Chen', status: 'active', priority: 'low', duration: '25 min' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'provider',
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'waiting': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Provider Chat</h1>
          <p className="text-gray-600">Communicate with customers and provide technical support</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Active Customers Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Active Customers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeCustomers.map((customer, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{customer.name}</span>
                        {getStatusIcon(customer.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs ${getPriorityColor(customer.priority)}`}>
                          {customer.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">{customer.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Start Call
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Template
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Transfer Customer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">JS</span>
                    </div>
                    <div>
                      <h3 className="font-medium">John Smith</h3>
                      <p className="text-sm text-gray-500">WiFi Connection Issue</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'provider' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'provider'
                            ? 'bg-green-600 text-white'
                            : message.sender === 'customer'
                            ? 'bg-gray-200 text-gray-800'
                            : 'bg-blue-100 text-blue-800 text-center'
                        }`}
                      >
                        {message.sender === 'customer' && message.customerName && (
                          <div className="text-xs opacity-70 mb-1">{message.customerName}</div>
                        )}
                        <div className="text-sm">{message.text}</div>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'provider' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message to the customer..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}