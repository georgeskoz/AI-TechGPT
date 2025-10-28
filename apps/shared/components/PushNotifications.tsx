import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Plus, 
  Search, 
  Send, 
  Users, 
  Target,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Smartphone,
  Monitor,
  Mail
} from 'lucide-react';

interface PushNotification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'promotion';
  targetAudience: 'all' | 'customers' | 'serviceProviders' | 'admins' | 'specific';
  platform: 'all' | 'web' | 'mobile' | 'email';
  scheduledFor?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  recipientCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  createdBy: string;
  createdAt: Date;
  imageUrl?: string;
  actionUrl?: string;
  actionText?: string;
}

export default function PushNotifications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
    platform: 'all',
    scheduledFor: '',
    imageUrl: '',
    actionUrl: '',
    actionText: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for notifications
  const mockNotifications: PushNotification[] = [
    {
      id: 1,
      title: 'New Service Available',
      message: 'We now offer 24/7 emergency technical support. Get help when you need it most!',
      type: 'info',
      targetAudience: 'customers',
      platform: 'all',
      sentAt: new Date('2024-01-15T10:00:00'),
      status: 'sent',
      recipientCount: 1250,
      deliveredCount: 1198,
      openedCount: 456,
      clickedCount: 123,
      createdBy: 'Admin',
      createdAt: new Date('2024-01-15T09:30:00'),
      actionUrl: '/services/emergency',
      actionText: 'Learn More'
    },
    {
      id: 2,
      title: 'System Maintenance Notice',
      message: 'Scheduled maintenance will occur tonight from 2-4 AM EST. Services may be temporarily unavailable.',
      type: 'warning',
      targetAudience: 'all',
      platform: 'all',
      scheduledFor: new Date('2024-01-20T20:00:00'),
      status: 'scheduled',
      recipientCount: 2500,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      createdBy: 'Admin',
      createdAt: new Date('2024-01-18T14:30:00')
    },
    {
      id: 3,
      title: '20% Off First Service',
      message: 'Welcome! Get 20% off your first technical support service. Use code WELCOME20 at checkout.',
      type: 'promotion',
      targetAudience: 'customers',
      platform: 'mobile',
      sentAt: new Date('2024-01-10T12:00:00'),
      status: 'sent',
      recipientCount: 850,
      deliveredCount: 832,
      openedCount: 298,
      clickedCount: 89,
      createdBy: 'Marketing',
      createdAt: new Date('2024-01-10T11:00:00'),
      actionUrl: '/services',
      actionText: 'Book Now'
    }
  ];

  const { data: notifications = mockNotifications } = useQuery({
    queryKey: ['/api/admin/notifications'],
    queryFn: async () => {
      // Mock API call
      return mockNotifications;
    }
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async (notificationData: any) => {
      // Mock API call
      return { success: true, notification: { ...notificationData, id: Date.now() } };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification sent successfully"
      });
      setShowCreateDialog(false);
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        targetAudience: 'all',
        platform: 'all',
        scheduledFor: '',
        imageUrl: '',
        actionUrl: '',
        actionText: ''
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
    }
  });

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || notification.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSendNotification = () => {
    sendNotificationMutation.mutate({
      ...newNotification,
      status: newNotification.scheduledFor ? 'scheduled' : 'sent',
      sentAt: newNotification.scheduledFor ? undefined : new Date(),
      createdBy: 'Admin',
      createdAt: new Date()
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: "secondary", color: "bg-gray-100 text-gray-800" },
      scheduled: { variant: "default", color: "bg-blue-100 text-blue-800" },
      sent: { variant: "success", color: "bg-green-100 text-green-800" },
      failed: { variant: "destructive", color: "bg-red-100 text-red-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <Badge className={`${config.color} border-0`}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'promotion': return <Target className="h-4 w-4 text-purple-600" />;
      default: return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'web': return <Monitor className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getEngagementRate = (opened: number, delivered: number) => {
    if (delivered === 0) return 0;
    return ((opened / delivered) * 100).toFixed(1);
  };

  const getClickRate = (clicked: number, opened: number) => {
    if (opened === 0) return 0;
    return ((clicked / opened) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.filter(n => n.status === 'sent').length}</div>
            <p className="text-xs text-muted-foreground">Notifications sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.reduce((sum, n) => sum + n.recipientCount, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Users reached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34.2%</div>
            <p className="text-xs text-muted-foreground">Engagement rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.filter(n => n.status === 'scheduled').length}</div>
            <p className="text-xs text-muted-foreground">Pending notifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Push Notifications</CardTitle>
              <p className="text-sm text-muted-foreground">
                Send notifications to users across web, mobile, and email platforms
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Notification
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Notification</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newNotification.title}
                        onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                        placeholder="Enter notification title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={newNotification.message}
                        onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                        placeholder="Enter notification message"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select value={newNotification.type} onValueChange={(value) => setNewNotification({...newNotification, type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                            <SelectItem value="promotion">Promotion</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="targetAudience">Target Audience</Label>
                        <Select value={newNotification.targetAudience} onValueChange={(value) => setNewNotification({...newNotification, targetAudience: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="customers">Customers</SelectItem>
                            <SelectItem value="serviceProviders">Service Providers</SelectItem>
                            <SelectItem value="admins">Admins</SelectItem>
                            <SelectItem value="specific">Specific Users</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="platform">Platform</Label>
                        <Select value={newNotification.platform} onValueChange={(value) => setNewNotification({...newNotification, platform: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Platforms</SelectItem>
                            <SelectItem value="web">Web Only</SelectItem>
                            <SelectItem value="mobile">Mobile Only</SelectItem>
                            <SelectItem value="email">Email Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="actionUrl">Action URL (Optional)</Label>
                        <Input
                          id="actionUrl"
                          value={newNotification.actionUrl}
                          onChange={(e) => setNewNotification({...newNotification, actionUrl: e.target.value})}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="actionText">Action Text (Optional)</Label>
                        <Input
                          id="actionText"
                          value={newNotification.actionText}
                          onChange={(e) => setNewNotification({...newNotification, actionText: e.target.value})}
                          placeholder="Learn More"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="scheduledFor">Schedule For (Optional)</Label>
                      <Input
                        id="scheduledFor"
                        type="datetime-local"
                        value={newNotification.scheduledFor}
                        onChange={(e) => setNewNotification({...newNotification, scheduledFor: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave empty to send immediately
                      </p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendNotification} disabled={sendNotificationMutation.isPending}>
                        {sendNotificationMutation.isPending ? 'Sending...' : (newNotification.scheduledFor ? 'Schedule' : 'Send Now')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notifications Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {notification.message}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(notification.type)}
                      <span className="capitalize">{notification.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{notification.targetAudience}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(notification.platform)}
                      <span className="capitalize">{notification.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{notification.deliveredCount.toLocaleString()}/{notification.recipientCount.toLocaleString()}</div>
                      <div className="text-muted-foreground">
                        {((notification.deliveredCount / notification.recipientCount) * 100).toFixed(1)}% delivered
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{getEngagementRate(notification.openedCount, notification.deliveredCount)}% opened</div>
                      <div className="text-muted-foreground">
                        {getClickRate(notification.clickedCount, notification.openedCount)}% clicked
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(notification.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {notification.sentAt 
                        ? notification.sentAt.toLocaleDateString()
                        : notification.scheduledFor
                        ? notification.scheduledFor.toLocaleDateString()
                        : '-'
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}