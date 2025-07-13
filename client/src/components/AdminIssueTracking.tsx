import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Search,
  Filter,
  Eye,
  Edit,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  ExternalLink
} from "lucide-react";

interface TechnicalIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved';
  reportedBy: string;
  assignedTo?: string;
  customerEmail?: string;
  timestamp: Date;
  estimatedResolutionTime: string;
  actualResolutionTime?: string;
  adminNotes?: string;
}

const priorityConfig = {
  low: { color: 'bg-green-100 text-green-800', label: 'Low' },
  medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-800', label: 'High' },
  urgent: { color: 'bg-red-100 text-red-800', label: 'Urgent' }
};

const statusConfig = {
  open: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, label: 'Open' },
  'in-progress': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'In Progress' },
  resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Resolved' }
};

export default function AdminIssueTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState<TechnicalIssue | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch issues with filters
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["/api/admin/issues", { searchTerm, statusFilter, priorityFilter, categoryFilter }],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Update issue status
  const updateIssueMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TechnicalIssue> }) => {
      const response = await fetch(`/api/admin/issues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update issue');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/issues"] });
      toast({
        title: "Issue Updated",
        description: "Issue has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update issue. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Assign issue to admin
  const assignIssueMutation = useMutation({
    mutationFn: async ({ id, assignedTo, adminNotes }: { id: string; assignedTo: string; adminNotes: string }) => {
      const response = await fetch(`/api/admin/issues/${id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo, adminNotes })
      });
      if (!response.ok) throw new Error('Failed to assign issue');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/issues"] });
      toast({
        title: "Issue Assigned",
        description: "Issue has been assigned successfully.",
      });
      setSelectedIssue(null);
      setAssignedTo('');
      setAdminNotes('');
    },
  });

  const handleStatusChange = (issueId: string, newStatus: TechnicalIssue['status']) => {
    updateIssueMutation.mutate({ 
      id: issueId, 
      updates: { 
        status: newStatus,
        actualResolutionTime: newStatus === 'resolved' ? new Date().toISOString() : undefined
      } 
    });
  };

  const handleAssignIssue = () => {
    if (!selectedIssue || !assignedTo) return;
    
    assignIssueMutation.mutate({
      id: selectedIssue.id,
      assignedTo,
      adminNotes
    });
  };

  const filteredIssues = issues.filter((issue: TechnicalIssue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const stats = {
    total: issues.length,
    open: issues.filter((i: TechnicalIssue) => i.status === 'open').length,
    inProgress: issues.filter((i: TechnicalIssue) => i.status === 'in-progress').length,
    resolved: issues.filter((i: TechnicalIssue) => i.status === 'resolved').length,
    urgent: issues.filter((i: TechnicalIssue) => i.priority === 'urgent').length
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Issue Tracking</h2>
          <p className="text-gray-600">Monitor and manage customer technical issues</p>
        </div>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/issues"] })}>
          Refresh Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search issues..."
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Hardware Issues">Hardware Issues</SelectItem>
                <SelectItem value="Network Troubleshooting">Network Troubleshooting</SelectItem>
                <SelectItem value="Database Help">Database Help</SelectItem>
                <SelectItem value="Mobile Devices">Mobile Devices</SelectItem>
                <SelectItem value="Security Questions">Security Questions</SelectItem>
                <SelectItem value="System Administration">System Administration</SelectItem>
                <SelectItem value="Software Issues">Software Issues</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setCategoryFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Issues Table */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Issues ({filteredIssues.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading issues...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.map((issue: TechnicalIssue) => {
                    const StatusIcon = statusConfig[issue.status].icon;
                    return (
                      <TableRow key={issue.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{issue.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {issue.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge variant="outline">{issue.category}</Badge>
                            <div className="text-xs text-gray-500">{issue.subcategory}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityConfig[issue.priority].color}>
                            {priorityConfig[issue.priority].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[issue.status].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[issue.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {issue.reportedBy}
                          </div>
                        </TableCell>
                        <TableCell>
                          {issue.assignedTo || (
                            <span className="text-gray-400">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(issue.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedIssue(issue)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Issue Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium">{issue.title}</h4>
                                    <p className="text-sm text-gray-600">{issue.description}</p>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Assign To</label>
                                      <Select value={assignedTo} onValueChange={setAssignedTo}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select admin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="admin1">Admin 1</SelectItem>
                                          <SelectItem value="admin2">Admin 2</SelectItem>
                                          <SelectItem value="admin3">Admin 3</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Status</label>
                                      <Select 
                                        value={issue.status} 
                                        onValueChange={(value) => handleStatusChange(issue.id, value as TechnicalIssue['status'])}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="open">Open</SelectItem>
                                          <SelectItem value="in-progress">In Progress</SelectItem>
                                          <SelectItem value="resolved">Resolved</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium">Admin Notes</label>
                                    <Textarea
                                      placeholder="Add internal notes..."
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button onClick={handleAssignIssue} disabled={!assignedTo}>
                                      Assign Issue
                                    </Button>
                                    <Button variant="outline" asChild>
                                      <a href={`/chat?issueId=${issue.id}`} target="_blank">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        View in Chat
                                      </a>
                                    </Button>
                                  </div>
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