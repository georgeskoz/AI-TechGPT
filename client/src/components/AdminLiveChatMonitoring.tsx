import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search,
  MessageCircle,
  Clock,
  User,
  Bot,
  Monitor,
  Activity,
  CheckCircle,
  AlertCircle,
  Eye,
  ExternalLink,
  RefreshCw
} from "lucide-react";

interface ChatSession {
  id: string;
  customerName: string;
  customerEmail: string;
  sessionType: 'ai' | 'human' | 'escalated';
  status: 'active' | 'completed' | 'abandoned';
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  messageCount: number;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedAgent?: string;
  satisfaction?: number; // 1-5 rating
  issue: string;
  resolution?: string;
  cost: number;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'customer' | 'ai' | 'agent';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
}

const sessionTypeConfig = {
  ai: { color: 'bg-purple-100 text-purple-800', icon: Bot, label: 'AI Chat' },
  human: { color: 'bg-blue-100 text-blue-800', icon: User, label: 'Human Agent' },
  escalated: { color: 'bg-orange-100 text-orange-800', icon: AlertCircle, label: 'Escalated' }
};

const statusConfig = {
  active: { color: 'bg-green-100 text-green-800', icon: Activity, label: 'Active' },
  completed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, label: 'Completed' },
  abandoned: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Abandoned' }
};

export default function AdminLiveChatMonitoring() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<ChatMessage[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch chat sessions
  const { data: sessions = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/chat-sessions", { searchTerm, statusFilter, typeFilter }],
    refetchInterval: autoRefresh ? 5000 : false, // Refresh every 5 seconds if auto-refresh is on
  });

  // Fetch messages for selected session
  const { data: messages = [] } = useQuery({
    queryKey: ["/api/admin/chat-messages", selectedSession?.id],
    enabled: !!selectedSession,
    refetchInterval: selectedSession && autoRefresh ? 2000 : false, // Refresh every 2 seconds for active session
  });

  useEffect(() => {
    if (messages.length > 0) {
      setSelectedMessages(messages);
    }
  }, [messages]);

  const filteredSessions = sessions.filter((session: ChatSession) => {
    const matchesSearch = session.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesType = typeFilter === 'all' || session.sessionType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: sessions.length,
    active: sessions.filter((s: ChatSession) => s.status === 'active').length,
    completed: sessions.filter((s: ChatSession) => s.status === 'completed').length,
    abandoned: sessions.filter((s: ChatSession) => s.status === 'abandoned').length,
    aiChats: sessions.filter((s: ChatSession) => s.sessionType === 'ai').length,
    humanChats: sessions.filter((s: ChatSession) => s.sessionType === 'human').length,
    avgDuration: sessions.length > 0 ? sessions.reduce((acc: number, s: ChatSession) => acc + s.duration, 0) / sessions.length : 0,
    totalCost: sessions.reduce((acc: number, s: ChatSession) => acc + s.cost, 0)
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'customer':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'ai':
        return <Bot className="w-4 h-4 text-purple-500" />;
      case 'agent':
        return <User className="w-4 h-4 text-green-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Live Chat Monitoring</h2>
          <p className="text-gray-600">Monitor and manage customer chat sessions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Auto Refresh: {autoRefresh ? "On" : "Off"}
          </Button>
          <Button onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Now
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Abandoned</p>
              <p className="text-2xl font-bold text-red-600">{stats.abandoned}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">AI Chats</p>
              <p className="text-2xl font-bold text-purple-600">{stats.aiChats}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Human Chats</p>
              <p className="text-2xl font-bold text-blue-600">{stats.humanChats}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold">{formatDuration(Math.round(stats.avgDuration))}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalCost.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ai">AI Chat</SelectItem>
                <SelectItem value="human">Human Agent</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Chat Sessions ({filteredSessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading sessions...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session: ChatSession) => {
                    const StatusIcon = statusConfig[session.status].icon;
                    const TypeIcon = sessionTypeConfig[session.sessionType].icon;
                    return (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{session.customerName}</div>
                            <div className="text-sm text-gray-500">{session.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={sessionTypeConfig[session.sessionType].color}>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {sessionTypeConfig[session.sessionType].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[session.status].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[session.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">{session.issue}</div>
                        </TableCell>
                        <TableCell>{formatDuration(session.duration)}</TableCell>
                        <TableCell>{session.messageCount}</TableCell>
                        <TableCell>${session.cost.toFixed(2)}</TableCell>
                        <TableCell>{formatDate(session.startTime)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedSession(session)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>Chat Session Details</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                  {/* Session Info */}
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium">Customer</h4>
                                      <p className="text-sm">{session.customerName}</p>
                                      <p className="text-sm text-gray-500">{session.customerEmail}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Issue</h4>
                                      <p className="text-sm">{session.issue}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Session Stats</h4>
                                      <div className="text-sm space-y-1">
                                        <div>Duration: {formatDuration(session.duration)}</div>
                                        <div>Messages: {session.messageCount}</div>
                                        <div>Cost: ${session.cost.toFixed(2)}</div>
                                        {session.satisfaction && (
                                          <div>Rating: {session.satisfaction}/5 ⭐</div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Chat Messages */}
                                  <div className="col-span-2">
                                    <h4 className="font-medium mb-2">Chat Messages</h4>
                                    <ScrollArea className="h-64 border rounded-md p-4">
                                      <div className="space-y-4">
                                        {selectedMessages.map((message) => (
                                          <div key={message.id} className="flex gap-3">
                                            <div className="flex-shrink-0">
                                              {getSenderIcon(message.sender)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium capitalize">
                                                  {message.sender}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                  {formatDate(message.timestamp)}
                                                </span>
                                              </div>
                                              <div className="text-sm text-gray-700 mt-1">
                                                {message.content}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </ScrollArea>
                                  </div>
                                </div>
                                
                                <div className="flex justify-end">
                                  <Button variant="outline" asChild>
                                    <a href={`/live-support?sessionId=${session.id}`} target="_blank">
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      Open Live Chat
                                    </a>
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}