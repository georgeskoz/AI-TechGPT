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
  Mail, 
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
  FileText,
  Settings,
  Eye,
  Copy,
  Edit,
  Trash2,
  Image,
  Paperclip
} from 'lucide-react';

interface EmailCampaign {
  id: number;
  subject: string;
  content: string;
  contentType: 'text' | 'html';
  recipients: string[];
  recipientGroups: string[];
  scheduledFor?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  totalRecipients: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  unsubscribedCount: number;
  createdBy: string;
  createdAt: Date;
  attachments?: string[];
  template?: string;
}

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  category: 'welcome' | 'notification' | 'marketing' | 'transactional';
  isActive: boolean;
  createdAt: Date;
}

export default function EmailSystem() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [newCampaign, setNewCampaign] = useState({
    subject: '',
    content: '',
    contentType: 'html',
    recipientGroups: [],
    scheduledFor: '',
    template: ''
  });
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    category: 'notification'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for email campaigns
  const mockCampaigns: EmailCampaign[] = [
    {
      id: 1,
      subject: 'Welcome to TechersGPT - Your Technical Support Partner',
      content: '<h1>Welcome!</h1><p>Thank you for joining TechersGPT. We are here to help with all your technical needs.</p>',
      contentType: 'html',
      recipients: [],
      recipientGroups: ['new_users'],
      sentAt: new Date('2024-01-15T10:00:00'),
      status: 'sent',
      totalRecipients: 150,
      deliveredCount: 148,
      openedCount: 89,
      clickedCount: 23,
      bouncedCount: 2,
      unsubscribedCount: 1,
      createdBy: 'Admin',
      createdAt: new Date('2024-01-15T09:00:00'),
      template: 'welcome'
    },
    {
      id: 2,
      subject: 'Monthly Newsletter - January 2024',
      content: '<h1>Monthly Update</h1><p>Here is what is new this month...</p>',
      contentType: 'html',
      recipients: [],
      recipientGroups: ['all_users'],
      scheduledFor: new Date('2024-02-01T10:00:00'),
      status: 'scheduled',
      totalRecipients: 2500,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      bouncedCount: 0,
      unsubscribedCount: 0,
      createdBy: 'Marketing',
      createdAt: new Date('2024-01-25T14:30:00'),
      template: 'newsletter'
    },
    {
      id: 3,
      subject: 'Service Invoice - Order #12345',
      content: 'Dear customer, please find attached your service invoice for order #12345.',
      contentType: 'text',
      recipients: ['customer@example.com'],
      recipientGroups: [],
      sentAt: new Date('2024-01-20T16:30:00'),
      status: 'sent',
      totalRecipients: 1,
      deliveredCount: 1,
      openedCount: 1,
      clickedCount: 0,
      bouncedCount: 0,
      unsubscribedCount: 0,
      createdBy: 'System',
      createdAt: new Date('2024-01-20T16:30:00'),
      template: 'invoice',
      attachments: ['invoice-12345.pdf']
    }
  ];

  const mockTemplates: EmailTemplate[] = [
    {
      id: 1,
      name: 'Welcome Email',
      subject: 'Welcome to TechersGPT',
      content: '<h1>Welcome to TechersGPT!</h1><p>Thank you for joining our platform...</p>',
      category: 'welcome',
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      name: 'Service Complete',
      subject: 'Your service request has been completed',
      content: '<h1>Service Complete</h1><p>Your technical support request has been successfully resolved...</p>',
      category: 'notification',
      isActive: true,
      createdAt: new Date('2024-01-05')
    },
    {
      id: 3,
      name: 'Monthly Promotion',
      subject: 'Special offer this month',
      content: '<h1>Exclusive Offer</h1><p>Get 20% off on all services this month...</p>',
      category: 'marketing',
      isActive: true,
      createdAt: new Date('2024-01-10')
    }
  ];

  const { data: campaigns = mockCampaigns } = useQuery({
    queryKey: ['/api/admin/email-campaigns'],
    queryFn: async () => mockCampaigns
  });

  const { data: templates = mockTemplates } = useQuery({
    queryKey: ['/api/admin/email-templates'],
    queryFn: async () => mockTemplates
  });

  const sendCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      return { success: true, campaign: { ...campaignData, id: Date.now() } };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Email campaign created successfully"
      });
      setShowCreateDialog(false);
      setNewCampaign({
        subject: '',
        content: '',
        contentType: 'html',
        recipientGroups: [],
        scheduledFor: '',
        template: ''
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/email-campaigns'] });
    }
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      return { success: true, template: { ...templateData, id: Date.now() } };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Email template created successfully"
      });
      setShowTemplateDialog(false);
      setNewTemplate({
        name: '',
        subject: '',
        content: '',
        category: 'notification'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/email-templates'] });
    }
  });

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSendCampaign = () => {
    sendCampaignMutation.mutate({
      ...newCampaign,
      status: newCampaign.scheduledFor ? 'scheduled' : 'sent',
      sentAt: newCampaign.scheduledFor ? undefined : new Date(),
      createdBy: 'Admin',
      createdAt: new Date()
    });
  };

  const handleCreateTemplate = () => {
    createTemplateMutation.mutate({
      ...newTemplate,
      isActive: true,
      createdAt: new Date()
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800" },
      scheduled: { color: "bg-blue-100 text-blue-800" },
      sent: { color: "bg-green-100 text-green-800" },
      failed: { color: "bg-red-100 text-red-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <Badge className={`${config.color} border-0`}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getOpenRate = (opened: number, delivered: number) => {
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
            <CardTitle className="text-sm font-medium">Campaigns Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.filter(c => c.status === 'sent').length}</div>
            <p className="text-xs text-muted-foreground">Total campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.deliveredCount, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38.2%</div>
            <p className="text-xs text-muted-foreground">Average open rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8%</div>
            <p className="text-xs text-muted-foreground">Average click rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Email System</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage email campaigns and templates for customer communication
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns..."
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
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Create Email Campaign</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={newCampaign.subject}
                          onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                          placeholder="Enter email subject"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="template">Template</Label>
                          <Select value={newCampaign.template} onValueChange={(value) => setNewCampaign({...newCampaign, template: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">No template</SelectItem>
                              {templates.map(template => (
                                <SelectItem key={template.id} value={template.name.toLowerCase()}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="contentType">Content Type</Label>
                          <Select value={newCampaign.contentType} onValueChange={(value) => setNewCampaign({...newCampaign, contentType: value as 'html' | 'text'})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="html">HTML</SelectItem>
                              <SelectItem value="text">Plain Text</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                          id="content"
                          value={newCampaign.content}
                          onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                          placeholder="Enter email content"
                          rows={8}
                        />
                      </div>

                      <div>
                        <Label htmlFor="recipientGroups">Recipient Groups</Label>
                        <Select onValueChange={(value) => setNewCampaign({...newCampaign, recipientGroups: [value]})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recipient group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all_users">All Users</SelectItem>
                            <SelectItem value="customers">Customers</SelectItem>
                            <SelectItem value="service_providers">Service Providers</SelectItem>
                            <SelectItem value="new_users">New Users</SelectItem>
                            <SelectItem value="active_users">Active Users</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="scheduledFor">Schedule For (Optional)</Label>
                        <Input
                          id="scheduledFor"
                          type="datetime-local"
                          value={newCampaign.scheduledFor}
                          onChange={(e) => setNewCampaign({...newCampaign, scheduledFor: e.target.value})}
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSendCampaign} disabled={sendCampaignMutation.isPending}>
                          {sendCampaignMutation.isPending ? 'Creating...' : (newCampaign.scheduledFor ? 'Schedule' : 'Send Now')}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Delivered</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div className="font-medium">{campaign.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          {campaign.recipientGroups.join(', ')}
                        </div>
                      </TableCell>
                      <TableCell>{campaign.totalRecipients.toLocaleString()}</TableCell>
                      <TableCell>
                        {campaign.deliveredCount.toLocaleString()}
                        <span className="text-muted-foreground ml-1">
                          ({((campaign.deliveredCount / campaign.totalRecipients) * 100).toFixed(1)}%)
                        </span>
                      </TableCell>
                      <TableCell>{getOpenRate(campaign.openedCount, campaign.deliveredCount)}%</TableCell>
                      <TableCell>{getClickRate(campaign.clickedCount, campaign.openedCount)}%</TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell>
                        {campaign.sentAt 
                          ? campaign.sentAt.toLocaleDateString()
                          : campaign.scheduledFor
                          ? campaign.scheduledFor.toLocaleDateString()
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Email Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and manage reusable email templates
                  </p>
                </div>
                <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Email Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="templateName">Template Name *</Label>
                        <Input
                          id="templateName"
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                          placeholder="Enter template name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="templateSubject">Subject *</Label>
                          <Input
                            id="templateSubject"
                            value={newTemplate.subject}
                            onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                            placeholder="Enter subject"
                          />
                        </div>
                        <div>
                          <Label htmlFor="templateCategory">Category</Label>
                          <Select value={newTemplate.category} onValueChange={(value) => setNewTemplate({...newTemplate, category: value as any})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="welcome">Welcome</SelectItem>
                              <SelectItem value="notification">Notification</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="transactional">Transactional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="templateContent">Content *</Label>
                        <Textarea
                          id="templateContent"
                          value={newTemplate.content}
                          onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                          placeholder="Enter template content"
                          rows={6}
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateTemplate} disabled={createTemplateMutation.isPending}>
                          {createTemplateMutation.isPending ? 'Creating...' : 'Create Template'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <p className="text-sm text-muted-foreground capitalize">{template.category}</p>
                        </div>
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{template.subject}</p>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {template.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </p>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Email Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure email server settings and preferences
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>SMTP Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtpHost">SMTP Host</Label>
                        <Input id="smtpHost" placeholder="smtp.gmail.com" />
                      </div>
                      <div>
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input id="smtpPort" placeholder="587" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="smtpUsername">Username</Label>
                      <Input id="smtpUsername" placeholder="your-email@gmail.com" />
                    </div>
                    <div>
                      <Label htmlFor="smtpPassword">Password</Label>
                      <Input id="smtpPassword" type="password" placeholder="Your app password" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="smtpSsl" />
                      <Label htmlFor="smtpSsl">Enable SSL/TLS</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Email Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fromName">From Name</Label>
                      <Input id="fromName" placeholder="TechersGPT Support" />
                    </div>
                    <div>
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input id="fromEmail" placeholder="support@techgpt.com" />
                    </div>
                    <div>
                      <Label htmlFor="replyTo">Reply-To Email</Label>
                      <Input id="replyTo" placeholder="noreply@techgpt.com" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="trackOpens" />
                      <Label htmlFor="trackOpens">Track email opens</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="trackClicks" />
                      <Label htmlFor="trackClicks">Track email clicks</Label>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}