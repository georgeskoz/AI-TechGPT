import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Edit, Trash2, Eye, Calendar, Users, TrendingUp, FileText, Plus } from "lucide-react";

interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients: number;
  openRate: number;
  clickRate: number;
  scheduledDate?: string;
  sentDate?: string;
  createdDate: string;
}

const NewsletterManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("newsletters");
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [newNewsletter, setNewNewsletter] = useState({
    title: "",
    subject: "",
    content: "",
    recipients: "all_users",
    scheduledDate: ""
  });

  const [newsletters] = useState<Newsletter[]>([
    {
      id: "1",
      title: "Monthly Platform Updates",
      subject: "TechGPT January 2025 Updates",
      content: "Welcome to our monthly newsletter with the latest platform updates and features...",
      status: "sent",
      recipients: 2847,
      openRate: 68.5,
      clickRate: 12.3,
      sentDate: "2025-01-01",
      createdDate: "2024-12-28"
    },
    {
      id: "2",
      title: "New Features Announcement",
      subject: "Exciting New Features Coming Soon!",
      content: "We're excited to announce several new features that will enhance your experience...",
      status: "scheduled",
      recipients: 2847,
      openRate: 0,
      clickRate: 0,
      scheduledDate: "2025-01-15",
      createdDate: "2025-01-08"
    },
    {
      id: "3",
      title: "Winter Promotion",
      subject: "Special Winter Deals - Limited Time!",
      content: "Don't miss out on our special winter promotion with discounts up to 30%...",
      status: "draft",
      recipients: 0,
      openRate: 0,
      clickRate: 0,
      createdDate: "2025-01-10"
    }
  ]);

  const handleSendNewsletter = (id: string) => {
    toast({
      title: "Newsletter Sent",
      description: "The newsletter has been sent successfully to all recipients.",
    });
  };

  const handleScheduleNewsletter = () => {
    if (!newNewsletter.title || !newNewsletter.subject || !newNewsletter.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Newsletter Scheduled",
      description: "The newsletter has been scheduled successfully.",
    });
    setNewNewsletter({
      title: "",
      subject: "",
      content: "",
      recipients: "all_users",
      scheduledDate: ""
    });
  };

  const handleDeleteNewsletter = (id: string) => {
    toast({
      title: "Newsletter Deleted",
      description: "The newsletter has been removed.",
      variant: "destructive",
    });
  };

  const recipientGroups = [
    { value: "all_users", label: "All Users" },
    { value: "customers", label: "Customers Only" },
    { value: "service_providers", label: "Service Providers Only" },
    { value: "premium_users", label: "Premium Users" },
    { value: "new_users", label: "New Users (Last 30 Days)" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Newsletter Management</h2>
          <p className="text-gray-600 mt-1">Create and manage email newsletters and campaigns</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="newsletters">All Newsletters</TabsTrigger>
          <TabsTrigger value="create">Create Newsletter</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="newsletters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newsletters.map((newsletter) => (
                    <TableRow key={newsletter.id}>
                      <TableCell className="font-medium">{newsletter.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{newsletter.subject}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={newsletter.status === 'sent' ? 'default' : 
                                  newsletter.status === 'scheduled' ? 'secondary' : 'outline'}
                        >
                          {newsletter.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{newsletter.recipients.toLocaleString()}</TableCell>
                      <TableCell>{newsletter.openRate}%</TableCell>
                      <TableCell>{newsletter.clickRate}%</TableCell>
                      <TableCell>
                        {newsletter.sentDate || newsletter.scheduledDate || newsletter.createdDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedNewsletter(newsletter)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {newsletter.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendNewsletter(newsletter.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteNewsletter(newsletter.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Newsletter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newsletter-title">Newsletter Title</Label>
                  <Input
                    id="newsletter-title"
                    value={newNewsletter.title}
                    onChange={(e) => setNewNewsletter({...newNewsletter, title: e.target.value})}
                    placeholder="Enter newsletter title"
                  />
                </div>
                <div>
                  <Label htmlFor="email-subject">Email Subject</Label>
                  <Input
                    id="email-subject"
                    value={newNewsletter.subject}
                    onChange={(e) => setNewNewsletter({...newNewsletter, subject: e.target.value})}
                    placeholder="Enter email subject"
                  />
                </div>
                <div>
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select value={newNewsletter.recipients} onValueChange={(value) => setNewNewsletter({...newNewsletter, recipients: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipientGroups.map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduled-date">Scheduled Date (Optional)</Label>
                  <Input
                    id="scheduled-date"
                    type="datetime-local"
                    value={newNewsletter.scheduledDate}
                    onChange={(e) => setNewNewsletter({...newNewsletter, scheduledDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="newsletter-content">Newsletter Content</Label>
                <Textarea
                  id="newsletter-content"
                  value={newNewsletter.content}
                  onChange={(e) => setNewNewsletter({...newNewsletter, content: e.target.value})}
                  placeholder="Enter newsletter content (HTML supported)"
                  rows={10}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Save as Draft</Button>
                <Button onClick={handleScheduleNewsletter}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Newsletter
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Total Sent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-sm text-gray-600">newsletters sent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Total Recipients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34,164</div>
                <p className="text-sm text-gray-600">total recipients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-purple-600" />
                  Avg Open Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.5%</div>
                <p className="text-sm text-gray-600">average open rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
                  Avg Click Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.3%</div>
                <p className="text-sm text-gray-600">average click rate</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Newsletter Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsletters.filter(n => n.status === 'sent').map((newsletter) => (
                  <div key={newsletter.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{newsletter.title}</h4>
                      <p className="text-sm text-gray-600">{newsletter.subject}</p>
                    </div>
                    <div className="flex space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">{newsletter.recipients.toLocaleString()}</div>
                        <div className="text-gray-600">Recipients</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{newsletter.openRate}%</div>
                        <div className="text-gray-600">Open Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-600">{newsletter.clickRate}%</div>
                        <div className="text-gray-600">Click Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sender-name">Sender Name</Label>
                <Input
                  id="sender-name"
                  defaultValue="TechGPT Team"
                  placeholder="Enter sender name"
                />
              </div>
              <div>
                <Label htmlFor="sender-email">Sender Email</Label>
                <Input
                  id="sender-email"
                  type="email"
                  defaultValue="newsletter@techgpt.com"
                  placeholder="Enter sender email"
                />
              </div>
              <div>
                <Label htmlFor="reply-to">Reply-To Email</Label>
                <Input
                  id="reply-to"
                  type="email"
                  defaultValue="support@techgpt.com"
                  placeholder="Enter reply-to email"
                />
              </div>
              <div>
                <Label htmlFor="unsubscribe-url">Unsubscribe URL</Label>
                <Input
                  id="unsubscribe-url"
                  defaultValue="https://techgpt.com/unsubscribe"
                  placeholder="Enter unsubscribe URL"
                />
              </div>
              <div className="flex justify-end">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterManagement;