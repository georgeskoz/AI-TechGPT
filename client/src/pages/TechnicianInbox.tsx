import { useState } from 'react';
import { useAuth } from '@/components/UserAuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import Navigation from '@/components/Navigation';
import { 
  Mail, 
  MailOpen, 
  Archive, 
  Trash2, 
  Star, 
  Search,
  Filter,
  MoreVertical,
  Bell,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  Settings
} from 'lucide-react';

interface Message {
  id: number;
  subject: string;
  sender: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  type: 'email' | 'notification' | 'system';
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export default function TechnicianInbox() {
  const { user } = useAuth();
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock inbox data
  const messages: Message[] = [
    {
      id: 1,
      subject: "New Job Assignment: Network Setup - Downtown Ottawa",
      sender: "TechersGPT System",
      preview: "You have been assigned a new job for network setup at a small office. Customer: Sarah Johnson, Budget: $150, Urgency: Medium",
      timestamp: "2 hours ago",
      isRead: false,
      isStarred: true,
      type: 'notification',
      priority: 'high',
      category: 'Job Assignment'
    },
    {
      id: 2,
      subject: "Payment Received: Job #TG-789456",
      sender: "Payment System",
      preview: "Payment of $85.00 has been processed for your completed hardware repair job. Net earnings: $72.25 (after 15% platform fee)",
      timestamp: "4 hours ago",
      isRead: false,
      isStarred: false,
      type: 'email',
      priority: 'medium',
      category: 'Payment'
    },
    {
      id: 3,
      subject: "Customer Review: 5 Stars ⭐⭐⭐⭐⭐",
      sender: "Review System",
      preview: "Mike Davis left you a 5-star review: 'Excellent service! Fixed my computer issues quickly and professionally. Highly recommend!'",
      timestamp: "6 hours ago",
      isRead: true,
      isStarred: true,
      type: 'notification',
      priority: 'low',
      category: 'Review'
    },
    {
      id: 4,
      subject: "Weekly Earnings Summary",
      sender: "TechersGPT Analytics",
      preview: "Your weekly earnings: $425.50 from 8 completed jobs. Average rating: 4.9/5. Top service: Hardware Issues (3 jobs).",
      timestamp: "1 day ago",
      isRead: true,
      isStarred: false,
      type: 'email',
      priority: 'low',
      category: 'Analytics'
    },
    {
      id: 5,
      subject: "Profile Optimization Tips",
      sender: "Support Team",
      preview: "Boost your profile visibility with these tips: Update your skills, add more service areas, upload recent certifications...",
      timestamp: "2 days ago",
      isRead: true,
      isStarred: false,
      type: 'email',
      priority: 'low',
      category: 'Tips'
    },
    {
      id: 6,
      subject: "Job Opportunity: Emergency Hardware Repair",
      sender: "Dispatch System",
      preview: "Urgent job available: Computer won't start after power outage. Customer willing to pay premium rates. Located in Gatineau.",
      timestamp: "3 days ago",
      isRead: true,
      isStarred: false,
      type: 'notification',
      priority: 'high',
      category: 'Job Opportunity'
    },
    {
      id: 7,
      subject: "Platform Update: New Features Available",
      sender: "TechersGPT Team",
      preview: "Check out our latest features: Enhanced job matching, improved messaging system, and new earning opportunities.",
      timestamp: "1 week ago",
      isRead: true,
      isStarred: false,
      type: 'system',
      priority: 'medium',
      category: 'Updates'
    }
  ];

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && !message.isRead;
    if (activeTab === 'starred') return matchesSearch && message.isStarred;
    if (activeTab === 'emails') return matchesSearch && message.type === 'email';
    if (activeTab === 'notifications') return matchesSearch && message.type === 'notification';
    
    return matchesSearch;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;
  const starredCount = messages.filter(m => m.isStarred).length;

  const handleSelectMessage = (messageId: number) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredMessages.map(m => m.id));
    }
  };

  const handleArchive = () => {
    console.log('Archiving messages:', selectedMessages);
    setSelectedMessages([]);
    // TODO: Implement archive functionality
  };

  const handleDelete = () => {
    console.log('Deleting messages:', selectedMessages);
    setSelectedMessages([]);
    // TODO: Implement delete functionality
  };

  const handleMarkAsRead = () => {
    console.log('Marking as read:', selectedMessages);
    setSelectedMessages([]);
    // TODO: Implement mark as read functionality
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'notification': return <Bell className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Job Assignment': return <User className="h-4 w-4" />;
      case 'Payment': return <DollarSign className="h-4 w-4" />;
      case 'Job Opportunity': return <AlertCircle className="h-4 w-4" />;
      case 'Analytics': return <Calendar className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
              <p className="text-gray-600 mt-1">
                Manage your emails, notifications, and messages
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {unreadCount} Unread
              </Badge>
              <Button size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedMessages.length > 0 && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm text-blue-700">
                {selectedMessages.length} message{selectedMessages.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2 ml-auto">
                <Button size="sm" variant="outline" onClick={handleMarkAsRead}>
                  <MailOpen className="h-4 w-4 mr-1" />
                  Mark Read
                </Button>
                <Button size="sm" variant="outline" onClick={handleArchive}>
                  <Archive className="h-4 w-4 mr-1" />
                  Archive
                </Button>
                <Button size="sm" variant="outline" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Message Tabs and List */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All ({messages.length})</TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="starred">Starred ({starredCount})</TabsTrigger>
                <TabsTrigger value="emails">Emails</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="border-b p-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
            </div>

            <div className="divide-y">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !message.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedMessages.includes(message.id)}
                      onCheckedChange={() => handleSelectMessage(message.id)}
                    />
                    
                    <button
                      className={`${message.isStarred ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(message.type)}
                          <span className={`text-sm font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                            {message.sender}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {message.category}
                          </Badge>
                          {getCategoryIcon(message.category)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs ${getPriorityColor(message.priority)}`}>
                            ● {message.priority}
                          </span>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-1">
                        <h3 className={`text-sm ${!message.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {message.subject}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {message.preview}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMessages.length === 0 && (
              <div className="p-8 text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Try adjusting your search terms' : 'Your inbox is empty'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MailOpen className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Starred</p>
                  <p className="text-2xl font-bold text-yellow-600">{starredCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Bell className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Notifications</p>
                  <p className="text-2xl font-bold text-green-600">
                    {messages.filter(m => m.type === 'notification').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}