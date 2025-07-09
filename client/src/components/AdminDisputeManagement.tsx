import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Users, 
  FileText, 
  TrendingUp, 
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  AlertCircle,
  Calendar,
  Timer,
  User,
  Building
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Types
interface Dispute {
  id: number;
  title: string;
  description: string;
  disputeType: string;
  severity: string;
  status: string;
  reportedBy: string;
  customerId: number | null;
  technicianId: number | null;
  jobId: number | null;
  assignedAdminId: number | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
  resolutionNotes: string | null;
  adminNotes: string | null;
  priority: string;
  dueDate: Date | null;
  category: string;
  subcategory: string;
  escalatedAt: Date | null;
  estimatedResolutionTime: number | null;
  attachmentCount: number;
  lastResponseAt: Date | null;
  responseTime: number | null;
  satisfactionRating: number | null;
  tags: string[] | null;
  internalNotes: string | null;
  requiresManagerApproval: boolean;
  isPublic: boolean;
  metadata: Record<string, any> | null;
}

interface DisputeMessage {
  id: number;
  disputeId: number;
  senderId: number;
  senderType: string;
  message: string;
  attachments: string[] | null;
  createdAt: Date;
  isInternal: boolean | null;
}

interface DisputeAttachment {
  id: number;
  disputeId: number;
  uploaderId: number;
  uploaderType: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number | null;
  description: string | null;
  createdAt: Date;
}

interface DisputeAnalytics {
  totalDisputes: number;
  openDisputes: number;
  closedDisputes: number;
  newDisputes: number;
  pendingDisputes: number;
  ongoingDisputes: number;
  averageResolutionTime: number;
  statusDistribution: Record<string, number>;
  severityDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  adminWorkload: Record<string, number>;
  customerSatisfaction: number;
}

const AdminDisputeManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [newDispute, setNewDispute] = useState({
    title: '',
    description: '',
    disputeType: '',
    severity: '',
    priority: '',
    category: '',
    subcategory: '',
    customerId: null as number | null,
    technicianId: null as number | null,
    jobId: null as number | null,
    reportedBy: '',
    dueDate: null as Date | null
  });
  const [messageText, setMessageText] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [assignedAdmin, setAssignedAdmin] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch dispute analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/admin/disputes/analytics'],
    refetchInterval: 30000
  });

  // Fetch all disputes
  const { data: allDisputes, isLoading: disputesLoading } = useQuery({
    queryKey: ['/api/admin/disputes'],
    refetchInterval: 15000
  });

  // Fetch disputes by status
  const { data: statusDisputes, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/admin/disputes/status', selectedTab],
    enabled: selectedTab !== 'all',
    refetchInterval: 15000
  });

  // Fetch dispute messages
  const { data: disputeMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/disputes', selectedDispute?.id, 'messages'],
    enabled: !!selectedDispute,
    refetchInterval: 5000
  });

  // Fetch dispute attachments
  const { data: disputeAttachments, isLoading: attachmentsLoading } = useQuery({
    queryKey: ['/api/disputes', selectedDispute?.id, 'attachments'],
    enabled: !!selectedDispute,
    refetchInterval: 30000
  });

  // Create dispute mutation
  const createDispute = useMutation({
    mutationFn: (disputeData: any) => apiRequest('/api/disputes', 'POST', disputeData),
    onSuccess: () => {
      toast({
        title: "Dispute created successfully",
        description: "The dispute has been created and assigned.",
      });
      setShowCreateDialog(false);
      setNewDispute({
        title: '',
        description: '',
        disputeType: '',
        severity: '',
        priority: '',
        category: '',
        subcategory: '',
        customerId: null,
        technicianId: null,
        jobId: null,
        reportedBy: '',
        dueDate: null
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/disputes'] });
    },
    onError: (error) => {
      toast({
        title: "Error creating dispute",
        description: "Failed to create the dispute. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update dispute status mutation
  const updateDisputeStatus = useMutation({
    mutationFn: ({ id, status, adminId }: { id: number; status: string; adminId: number }) => 
      apiRequest(`/api/admin/disputes/${id}/status`, 'PATCH', { status, adminId }),
    onSuccess: () => {
      toast({
        title: "Status updated successfully",
        description: "The dispute status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/disputes'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: "Failed to update the dispute status.",
        variant: "destructive"
      });
    }
  });

  // Assign dispute mutation
  const assignDispute = useMutation({
    mutationFn: ({ id, adminId }: { id: number; adminId: number }) => 
      apiRequest(`/api/admin/disputes/${id}/assign`, 'PATCH', { adminId }),
    onSuccess: () => {
      toast({
        title: "Dispute assigned successfully",
        description: "The dispute has been assigned to an admin.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/disputes'] });
    },
    onError: (error) => {
      toast({
        title: "Error assigning dispute",
        description: "Failed to assign the dispute.",
        variant: "destructive"
      });
    }
  });

  // Create dispute message mutation
  const createMessage = useMutation({
    mutationFn: ({ disputeId, messageData }: { disputeId: number; messageData: any }) => 
      apiRequest(`/api/disputes/${disputeId}/messages`, 'POST', messageData),
    onSuccess: () => {
      toast({
        title: "Message sent successfully",
        description: "Your message has been added to the dispute.",
      });
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['/api/disputes', selectedDispute?.id, 'messages'] });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: "Failed to send the message.",
        variant: "destructive"
      });
    }
  });

  // Get current disputes based on selected tab
  const getCurrentDisputes = () => {
    if (selectedTab === 'all') return allDisputes || [];
    return statusDisputes || [];
  };

  // Filter disputes based on search term
  const filteredDisputes = getCurrentDisputes().filter((dispute: Dispute) =>
    dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispute.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispute.disputeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispute.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ongoing': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle create dispute
  const handleCreateDispute = () => {
    if (!newDispute.title || !newDispute.description || !newDispute.disputeType || !newDispute.severity) {
      toast({
        title: "Please fill in all required fields",
        description: "Title, description, type, and severity are required.",
        variant: "destructive"
      });
      return;
    }

    createDispute.mutate({
      ...newDispute,
      reportedBy: newDispute.reportedBy || 'Admin',
      status: 'new',
      priority: newDispute.priority || 'medium',
      category: newDispute.category || 'general',
      subcategory: newDispute.subcategory || 'other'
    });
  };

  // Handle status update
  const handleStatusUpdate = (disputeId: number, newStatus: string) => {
    updateDisputeStatus.mutate({
      id: disputeId,
      status: newStatus,
      adminId: 1 // TODO: Get actual admin ID from context
    });
  };

  // Handle admin assignment
  const handleAssignDispute = (disputeId: number, adminId: number) => {
    assignDispute.mutate({
      id: disputeId,
      adminId
    });
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedDispute) return;

    createMessage.mutate({
      disputeId: selectedDispute.id,
      messageData: {
        senderId: 1, // TODO: Get actual admin ID from context
        senderType: 'admin',
        message: messageText,
        isInternal: false
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalDisputes || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.openDisputes || 0}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.averageResolutionTime || 0}h</div>
            <p className="text-xs text-muted-foreground">Average time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.customerSatisfaction || 0}%</div>
            <p className="text-xs text-muted-foreground">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Dispute Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage and resolve customer and technician disputes
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Dispute
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Dispute</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={newDispute.title}
                          onChange={(e) => setNewDispute({...newDispute, title: e.target.value})}
                          placeholder="Enter dispute title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="disputeType">Type *</Label>
                        <Select value={newDispute.disputeType} onValueChange={(value) => setNewDispute({...newDispute, disputeType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="service_quality">Service Quality</SelectItem>
                            <SelectItem value="payment">Payment</SelectItem>
                            <SelectItem value="refund">Refund</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="severity">Severity *</Label>
                        <Select value={newDispute.severity} onValueChange={(value) => setNewDispute({...newDispute, severity: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={newDispute.priority} onValueChange={(value) => setNewDispute({...newDispute, priority: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={newDispute.description}
                        onChange={(e) => setNewDispute({...newDispute, description: e.target.value})}
                        placeholder="Enter detailed description"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="reportedBy">Reported By</Label>
                        <Input
                          id="reportedBy"
                          value={newDispute.reportedBy}
                          onChange={(e) => setNewDispute({...newDispute, reportedBy: e.target.value})}
                          placeholder="Reporter name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={newDispute.category}
                          onChange={(e) => setNewDispute({...newDispute, category: e.target.value})}
                          placeholder="Category"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateDispute} disabled={createDispute.isPending}>
                        {createDispute.isPending ? 'Creating...' : 'Create Dispute'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <TabsList className="grid w-full grid-cols-5 sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search disputes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <TabsContent value={selectedTab} className="space-y-4">
              {disputesLoading || statusLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading disputes...</p>
                  </div>
                </div>
              ) : filteredDisputes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No disputes found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDisputes.map((dispute: Dispute) => (
                    <Card key={dispute.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{dispute.title}</h3>
                              <Badge className={getStatusColor(dispute.status)}>
                                {dispute.status}
                              </Badge>
                              <Badge className={getSeverityColor(dispute.severity)}>
                                {dispute.severity}
                              </Badge>
                              <Badge className={getPriorityColor(dispute.priority)}>
                                {dispute.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{dispute.description}</p>
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {dispute.reportedBy}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {dispute.disputeType}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(dispute.createdAt).toLocaleDateString()}
                              </span>
                              {dispute.dueDate && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Due: {new Date(dispute.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedDispute(dispute)}>
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Dispute Details - {dispute.title}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Status</Label>
                                      <Select value={dispute.status} onValueChange={(value) => handleStatusUpdate(dispute.id, value)}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="new">New</SelectItem>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="ongoing">Ongoing</SelectItem>
                                          <SelectItem value="closed">Closed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Assigned Admin</Label>
                                      <Select value={dispute.assignedAdminId?.toString() || ''} onValueChange={(value) => handleAssignDispute(dispute.id, parseInt(value))}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select admin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="1">Admin User</SelectItem>
                                          <SelectItem value="2">Support Manager</SelectItem>
                                          <SelectItem value="3">Senior Admin</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Description</Label>
                                    <div className="mt-1 p-3 bg-muted rounded-md">
                                      <p className="text-sm">{dispute.description}</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <Label>Type</Label>
                                      <p className="text-sm font-medium">{dispute.disputeType}</p>
                                    </div>
                                    <div>
                                      <Label>Severity</Label>
                                      <Badge className={getSeverityColor(dispute.severity)}>
                                        {dispute.severity}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label>Priority</Label>
                                      <Badge className={getPriorityColor(dispute.priority)}>
                                        {dispute.priority}
                                      </Badge>
                                    </div>
                                  </div>

                                  <Separator />

                                  <div>
                                    <Label>Messages</Label>
                                    <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                                      {disputeMessages?.map((message: DisputeMessage) => (
                                        <div key={message.id} className={`p-3 rounded-md ${message.senderType === 'admin' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                                          <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-medium">{message.senderType}</span>
                                            <span className="text-xs text-muted-foreground">
                                              {new Date(message.createdAt).toLocaleString()}
                                            </span>
                                          </div>
                                          <p className="text-sm">{message.message}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Send Message</Label>
                                    <div className="mt-2 space-y-2">
                                      <Textarea
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder="Type your message..."
                                        rows={3}
                                      />
                                      <Button onClick={handleSendMessage} disabled={createMessage.isPending}>
                                        {createMessage.isPending ? 'Sending...' : 'Send Message'}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Select onValueChange={(value) => handleStatusUpdate(dispute.id, value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Actions" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">Set New</SelectItem>
                                <SelectItem value="pending">Set Pending</SelectItem>
                                <SelectItem value="ongoing">Set Ongoing</SelectItem>
                                <SelectItem value="closed">Set Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDisputeManagement;