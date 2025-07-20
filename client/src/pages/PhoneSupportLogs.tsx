import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Phone,
  Search,
  Download,
  Mail,
  FileText,
  Calendar,
  Clock,
  User,
  Users,
  Shield,
  Filter,
  Eye,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { apiRequest } from '@/lib/queryClient';

interface PhoneSupportLog {
  id: string;
  callId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceProviderName: string;
  serviceProviderEmail: string;
  adminName?: string;
  callType: 'customer' | 'service_provider' | 'admin';
  category: string;
  issue: string;
  status: 'active' | 'completed' | 'failed' | 'transferred';
  duration: number; // in minutes
  startTime: string;
  endTime?: string;
  resolution: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  transferredTo?: string;
  notes: string;
  satisfaction?: number; // 1-5 rating
  recordings?: string[];
  createdAt: string;
}

const PhoneSupportLogs: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [selectedLog, setSelectedLog] = useState<PhoneSupportLog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);

  // Fetch phone support logs
  const { data: logsData, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/phone-support-logs', searchTerm, filterType, filterStatus, filterPriority, dateRange],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const logs: PhoneSupportLog[] = logsData?.logs || [];
  const stats = logsData?.stats || {
    total: 0,
    active: 0,
    completed: 0,
    avgDuration: 0,
    customerCalls: 0,
    providerCalls: 0,
    adminCalls: 0
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleViewDetails = (log: PhoneSupportLog) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  const handleExportPDF = async (log: PhoneSupportLog) => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/admin/phone-support-logs/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logId: log.id })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `phone-support-log-${log.callId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast({
          title: "PDF Exported",
          description: `Phone support log for call ${log.callId} has been downloaded.`,
        });
      } else {
        throw new Error('Failed to export PDF');
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailLog = async (log: PhoneSupportLog) => {
    setIsEmailing(true);
    try {
      const response = await apiRequest('/api/admin/phone-support-logs/email', {
        method: 'POST',
        body: JSON.stringify({ logId: log.id })
      });

      toast({
        title: "Email Sent",
        description: `Phone support log for call ${log.callId} has been emailed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to email log. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEmailing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'transferred': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'customer': return <User className="h-4 w-4" />;
      case 'service_provider': return <Users className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Phone Support Logs</h1>
          <p className="text-gray-600">Search, view, and export phone support call logs with detailed analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Phone className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Calls</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Calls</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                  <p className="text-2xl font-bold text-gray-900">{formatDuration(stats.avgDuration)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search & Filter Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search Box */}
              <div className="col-span-2">
                <Input
                  placeholder="Search by name, email, phone, or call ID..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Call Type Filter */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Call Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="service_provider">Service Provider</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority Filter */}
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Filter */}
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Found {logs.length} call logs
              </p>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Phone Support Call Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading logs...</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12">
                <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No phone support logs found</p>
                <p className="text-sm text-gray-400">Try adjusting your search filters</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Call ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service Provider</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.callId}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getTypeIcon(log.callType)}
                          <span className="ml-2 capitalize">{log.callType.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.customerName}</p>
                          <p className="text-sm text-gray-500">{log.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.serviceProviderName}</p>
                          <p className="text-sm text-gray-500">{log.serviceProviderEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{log.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-white ${getStatusColor(log.status)}`}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-white ${getPriorityColor(log.priority)}`}>
                          {log.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDuration(log.duration)}</TableCell>
                      <TableCell>
                        {new Date(log.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportPDF(log)}
                            disabled={isExporting}
                          >
                            {isExporting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEmailLog(log)}
                            disabled={isEmailing}
                          >
                            {isEmailing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Mail className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Call Details - {selectedLog?.callId}</DialogTitle>
            <DialogDescription>
              Comprehensive information about this phone support call
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-6">
              {/* Call Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Call Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Call ID</label>
                      <p className="text-sm">{selectedLog.callId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Type</label>
                      <p className="text-sm capitalize">{selectedLog.callType.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <p className="text-sm">{selectedLog.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <Badge className={`text-white ${getStatusColor(selectedLog.status)}`}>
                        {selectedLog.status}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Priority</label>
                      <Badge className={`text-white ${getPriorityColor(selectedLog.priority)}`}>
                        {selectedLog.priority}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Duration</label>
                      <p className="text-sm">{formatDuration(selectedLog.duration)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Participants</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Customer</label>
                      <p className="text-sm font-medium">{selectedLog.customerName}</p>
                      <p className="text-xs text-gray-500">{selectedLog.customerEmail}</p>
                      <p className="text-xs text-gray-500">{selectedLog.customerPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Service Provider</label>
                      <p className="text-sm font-medium">{selectedLog.serviceProviderName}</p>
                      <p className="text-xs text-gray-500">{selectedLog.serviceProviderEmail}</p>
                    </div>
                    {selectedLog.adminName && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Admin</label>
                        <p className="text-sm font-medium">{selectedLog.adminName}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Issue Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Issue & Resolution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Issue Description</label>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedLog.issue}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Resolution</label>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedLog.resolution}</p>
                  </div>
                  {selectedLog.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Notes</label>
                      <p className="text-sm bg-gray-50 p-3 rounded">{selectedLog.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Start Time</label>
                    <p className="text-sm">{new Date(selectedLog.startTime).toLocaleString()}</p>
                  </div>
                  {selectedLog.endTime && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">End Time</label>
                      <p className="text-sm">{new Date(selectedLog.endTime).toLocaleString()}</p>
                    </div>
                  )}
                  {selectedLog.satisfaction && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Customer Satisfaction</label>
                      <p className="text-sm">{selectedLog.satisfaction}/5 ⭐</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
            {selectedLog && (
              <>
                <Button onClick={() => handleExportPDF(selectedLog)} disabled={isExporting}>
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export PDF
                </Button>
                <Button onClick={() => handleEmailLog(selectedLog)} disabled={isEmailing}>
                  {isEmailing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Email Log
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhoneSupportLogs;