import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { 
  Search,
  Monitor,
  Clock,
  User,
  Eye,
  StopCircle,
  Activity,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Settings
} from "lucide-react";

interface ScreenSharingSession {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceProviderName?: string;
  sessionType: 'customer-initiated' | 'provider-initiated' | 'admin-initiated';
  status: 'active' | 'completed' | 'terminated' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  resolution: string;
  remoteControlEnabled: boolean;
  recordingEnabled: boolean;
  issue: string;
  resolution_notes?: string;
  connectionQuality: number; // 0-100
  bandwidth: number; // Mbps
  latency: number; // ms
  cost: number;
  events: ScreenSharingEvent[];
}

interface ScreenSharingEvent {
  id: string;
  sessionId: string;
  type: 'connection' | 'disconnection' | 'quality_change' | 'remote_control' | 'recording' | 'error';
  description: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error';
}

const statusConfig = {
  active: { color: 'bg-green-100 text-green-800', icon: Activity, label: 'Active' },
  completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Completed' },
  terminated: { color: 'bg-red-100 text-red-800', icon: StopCircle, label: 'Terminated' },
  failed: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Failed' }
};

const qualityConfig = {
  excellent: { color: 'bg-green-100 text-green-800', label: 'Excellent' },
  good: { color: 'bg-blue-100 text-blue-800', label: 'Good' },
  fair: { color: 'bg-yellow-100 text-yellow-800', label: 'Fair' },
  poor: { color: 'bg-red-100 text-red-800', label: 'Poor' }
};

const eventTypeConfig = {
  connection: { color: 'bg-green-100 text-green-800', label: 'Connection' },
  disconnection: { color: 'bg-red-100 text-red-800', label: 'Disconnection' },
  quality_change: { color: 'bg-yellow-100 text-yellow-800', label: 'Quality Change' },
  remote_control: { color: 'bg-blue-100 text-blue-800', label: 'Remote Control' },
  recording: { color: 'bg-purple-100 text-purple-800', label: 'Recording' },
  error: { color: 'bg-red-100 text-red-800', label: 'Error' }
};

export default function AdminScreenSharingSessions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState<ScreenSharingSession | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch screen sharing sessions
  const { data: sessions = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/screen-sharing-sessions", { searchTerm, statusFilter, qualityFilter }],
    refetchInterval: autoRefresh ? 5000 : false,
  });

  // Terminate session mutation
  const terminateSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(`/api/admin/screen-sharing-sessions/${sessionId}/terminate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to terminate session');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/screen-sharing-sessions"] });
      toast({
        title: "Session Terminated",
        description: "Screen sharing session has been terminated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Termination Failed",
        description: "Failed to terminate session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredSessions = sessions.filter((session: ScreenSharingSession) => {
    const matchesSearch = session.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesQuality = qualityFilter === 'all' || session.quality === qualityFilter;
    
    return matchesSearch && matchesStatus && matchesQuality;
  });

  const stats = {
    total: sessions.length,
    active: sessions.filter((s: ScreenSharingSession) => s.status === 'active').length,
    completed: sessions.filter((s: ScreenSharingSession) => s.status === 'completed').length,
    terminated: sessions.filter((s: ScreenSharingSession) => s.status === 'terminated').length,
    failed: sessions.filter((s: ScreenSharingSession) => s.status === 'failed').length,
    avgDuration: sessions.length > 0 ? sessions.reduce((acc: number, s: ScreenSharingSession) => acc + s.duration, 0) / sessions.length : 0,
    totalCost: sessions.reduce((acc: number, s: ScreenSharingSession) => acc + s.cost, 0),
    remoteControlSessions: sessions.filter((s: ScreenSharingSession) => s.remoteControlEnabled).length,
    recordedSessions: sessions.filter((s: ScreenSharingSession) => s.recordingEnabled).length
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

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-600';
    if (quality >= 60) return 'text-yellow-600';
    if (quality >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleTerminateSession = (sessionId: string) => {
    terminateSessionMutation.mutate(sessionId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Screen Sharing Sessions</h2>
          <p className="text-gray-600">Monitor and manage screen sharing sessions</p>
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
              <p className="text-sm text-gray-600">Terminated</p>
              <p className="text-2xl font-bold text-red-600">{stats.terminated}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Remote Control</p>
              <p className="text-2xl font-bold text-purple-600">{stats.remoteControlSessions}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Recorded</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.recordedSessions}</p>
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
                <SelectItem value="terminated">Terminated</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quality</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setQualityFilter('all');
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
          <CardTitle>Screen Sharing Sessions ({filteredSessions.length})</CardTitle>
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
                    <TableHead>Service Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Connection</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session: ScreenSharingSession) => {
                    const StatusIcon = statusConfig[session.status].icon;
                    return (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{session.customerName}</div>
                            <div className="text-sm text-gray-500">{session.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {session.serviceProviderName || (
                            <span className="text-gray-400">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[session.status].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[session.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge className={qualityConfig[session.quality].color}>
                              {qualityConfig[session.quality].label}
                            </Badge>
                            <div className={`text-xs ${getQualityColor(session.connectionQuality)}`}>
                              {session.connectionQuality}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDuration(session.duration)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {session.remoteControlEnabled && (
                              <Badge variant="outline" className="text-xs">RC</Badge>
                            )}
                            {session.recordingEnabled && (
                              <Badge variant="outline" className="text-xs">REC</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{session.bandwidth} Mbps</div>
                            <div className="text-gray-500">{session.latency}ms</div>
                          </div>
                        </TableCell>
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
                                  <DialogTitle>Screen Sharing Session Details</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  {/* Session Info */}
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium">Session Information</h4>
                                      <div className="text-sm space-y-1 mt-2">
                                        <div>Customer: {session.customerName}</div>
                                        <div>Email: {session.customerEmail}</div>
                                        <div>Service Provider: {session.serviceProviderName || 'Not assigned'}</div>
                                        <div>Resolution: {session.resolution}</div>
                                        <div>Duration: {formatDuration(session.duration)}</div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-medium">Connection Quality</h4>
                                      <div className="text-sm space-y-1 mt-2">
                                        <div>Quality: {session.connectionQuality}%</div>
                                        <div>Bandwidth: {session.bandwidth} Mbps</div>
                                        <div>Latency: {session.latency}ms</div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-medium">Features</h4>
                                      <div className="text-sm space-y-1 mt-2">
                                        <div>Remote Control: {session.remoteControlEnabled ? 'Enabled' : 'Disabled'}</div>
                                        <div>Recording: {session.recordingEnabled ? 'Enabled' : 'Disabled'}</div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Session Events */}
                                  <div>
                                    <h4 className="font-medium">Session Events</h4>
                                    <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                                      {session.events?.map((event) => (
                                        <div key={event.id} className="p-2 border rounded-lg">
                                          <div className="flex items-center justify-between">
                                            <Badge className={eventTypeConfig[event.type].color}>
                                              {eventTypeConfig[event.type].label}
                                            </Badge>
                                            <span className="text-xs text-gray-500">
                                              {formatDate(event.timestamp)}
                                            </span>
                                          </div>
                                          <div className="text-sm mt-1">{event.description}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between">
                                  <Button 
                                    variant="outline" 
                                    asChild
                                  >
                                    <a href={`/screen-sharing?sessionId=${session.id}`} target="_blank">
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      View Session
                                    </a>
                                  </Button>
                                  
                                  {session.status === 'active' && (
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleTerminateSession(session.id)}
                                    >
                                      <StopCircle className="w-4 h-4 mr-2" />
                                      Terminate Session
                                    </Button>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {session.status === 'active' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleTerminateSession(session.id)}
                              >
                                <StopCircle className="w-4 h-4" />
                              </Button>
                            )}
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