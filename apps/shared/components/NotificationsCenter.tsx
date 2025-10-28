import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Bell, 
  BellRing, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  X, 
  Search, 
  Filter,
  Settings,
  Check,
  Archive,
  Trash2,
  Users,
  DollarSign,
  Wrench,
  MessageSquare,
  Shield,
  TrendingUp,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'system' | 'user' | 'payment' | 'support' | 'security' | 'performance';
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  actionUrl?: string;
  metadata?: {
    userId?: string;
    amount?: number;
    ticketId?: string;
    severity?: string;
  };
}

const NotificationsCenter: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Build query parameters for API request
  const queryParams = new URLSearchParams();
  if (categoryFilter !== "all") queryParams.append("category", categoryFilter);
  if (priorityFilter !== "all") queryParams.append("priority", priorityFilter);
  if (showOnlyUnread) queryParams.append("read", "false");
  if (searchTerm) queryParams.append("search", searchTerm);
  
  const queryString = queryParams.toString();

  // Fetch notifications from API
  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['/api/admin/notifications', queryString],
    queryFn: () => apiRequest("GET", `/api/admin/notifications?${queryString}`).then(res => res.json()),
    refetchInterval: realTimeEnabled ? 30000 : false, // Refetch every 30 seconds if real-time is enabled
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => 
      apiRequest("PATCH", `/api/admin/notifications/${notificationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
      toast({
        title: "Notification marked as read",
        description: "Notification has been marked as read successfully.",
      });
    },
  });

  // Archive notification mutation
  const archiveMutation = useMutation({
    mutationFn: (notificationId: string) => 
      apiRequest("PATCH", `/api/admin/notifications/${notificationId}/archive`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
      toast({
        title: "Notification archived",
        description: "Notification has been archived successfully.",
      });
    },
  });

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: (notificationId: string) => 
      apiRequest("DELETE", `/api/admin/notifications/${notificationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
      toast({
        title: "Notification deleted",
        description: "Notification has been deleted successfully.",
      });
    },
  });

  // Bulk action mutation
  const bulkActionMutation = useMutation({
    mutationFn: ({ action, notificationIds }: { action: string; notificationIds: string[] }) => 
      apiRequest("POST", "/api/admin/notifications/bulk-action", { action, notificationIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
      setSelectedNotifications([]);
      toast({
        title: "Bulk action completed",
        description: "Selected notifications have been updated successfully.",
      });
    },
  });



  const priorityConfig = {
    low: { color: "bg-green-100 text-green-800", icon: Info, label: "Low" },
    medium: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "Medium" },
    high: { color: "bg-orange-100 text-orange-800", icon: AlertTriangle, label: "High" },
    urgent: { color: "bg-red-100 text-red-800", icon: AlertTriangle, label: "Urgent" }
  };

  const categoryConfig = {
    system: { color: "bg-blue-100 text-blue-800", icon: Settings, label: "System" },
    user: { color: "bg-purple-100 text-purple-800", icon: Users, label: "User" },
    payment: { color: "bg-green-100 text-green-800", icon: DollarSign, label: "Payment" },
    support: { color: "bg-orange-100 text-orange-800", icon: Wrench, label: "Support" },
    security: { color: "bg-red-100 text-red-800", icon: Shield, label: "Security" },
    performance: { color: "bg-indigo-100 text-indigo-800", icon: TrendingUp, label: "Performance" }
  };

  // Show loading state for mutations
  const isActionLoading = markAsReadMutation.isPending || archiveMutation.isPending || deleteMutation.isPending || bulkActionMutation.isPending;

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all" || notification.category === categoryFilter;
    const matchesReadStatus = !showOnlyUnread || !notification.isRead;
    const matchesTab = activeTab === "all" || 
                      (activeTab === "unread" && !notification.isRead) ||
                      (activeTab === "archived" && notification.isArchived) ||
                      (activeTab === "priority" && (notification.priority === "high" || notification.priority === "urgent"));

    return matchesSearch && matchesPriority && matchesCategory && matchesReadStatus && matchesTab && !notification.isArchived;
  });

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;
  const urgentCount = notifications.filter(n => (n.priority === "urgent" || n.priority === "high") && !n.isRead).length;

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    const unreadNotifications = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadNotifications.length > 0) {
      bulkActionMutation.mutate({ action: 'markAsRead', notificationIds: unreadNotifications });
    }
  };

  const handleArchive = (notificationId: string) => {
    archiveMutation.mutate(notificationId);
  };

  const handleDelete = (notificationId: string) => {
    deleteMutation.mutate(notificationId);
  };

  const handleBulkAction = (action: string) => {
    if (selectedNotifications.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select notifications to perform bulk actions.",
        variant: "destructive",
      });
      return;
    }

    let mutationAction = action;
    switch (action) {
      case "read":
        mutationAction = "markAsRead";
        break;
      case "archive":
        mutationAction = "archive";
        break;
      case "delete":
        mutationAction = "delete";
        break;
    }

    bulkActionMutation.mutate({ action: mutationAction, notificationIds: selectedNotifications });
  };

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Notifications Center</h2>
          <p className="text-gray-600 mt-1">Real-time notifications with priority and category filtering</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="realtime">Real-time</Label>
            <Switch
              id="realtime"
              checked={realTimeEnabled}
              onCheckedChange={setRealTimeEnabled}
            />
          </div>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Bell className="h-4 w-4" />
            <span>{unreadCount} unread</span>
          </Badge>
          {urgentCount > 0 && (
            <Badge variant="destructive" className="flex items-center space-x-1">
              <AlertTriangle className="h-4 w-4" />
              <span>{urgentCount} urgent</span>
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-32">
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
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Switch
            checked={showOnlyUnread}
            onCheckedChange={setShowOnlyUnread}
          />
          <Label>Unread only</Label>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>All ({notifications.filter(n => !n.isArchived).length})</span>
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center space-x-2">
            <BellRing className="h-4 w-4" />
            <span>Unread ({unreadCount})</span>
          </TabsTrigger>
          <TabsTrigger value="priority" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Priority ({urgentCount})</span>
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center space-x-2">
            <Archive className="h-4 w-4" />
            <span>Archived ({notifications.filter(n => n.isArchived).length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {selectedNotifications.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    {selectedNotifications.length} notification(s) selected
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("read")}>
                      <Check className="h-4 w-4 mr-1" />
                      Mark Read
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("archive")}>
                      <Archive className="h-4 w-4 mr-1" />
                      Archive
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("delete")}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {filteredNotifications.length} notification(s)
            </span>
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          </div>

          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                  <p className="text-gray-600">Try adjusting your filters or check back later for new notifications.</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => {
                const priorityInfo = priorityConfig[notification.priority];
                const categoryInfo = categoryConfig[notification.category];
                const PriorityIcon = priorityInfo.icon;
                const CategoryIcon = categoryInfo.icon;

                return (
                  <Card 
                    key={notification.id} 
                    className={`transition-all hover:shadow-md ${
                      !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                    } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={() => toggleNotificationSelection(notification.id)}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h3>
                                {!notification.isRead && (
                                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-3">{notification.message}</p>
                              <div className="flex items-center space-x-3">
                                <Badge className={priorityInfo.color}>
                                  <PriorityIcon className="h-3 w-3 mr-1" />
                                  {priorityInfo.label}
                                </Badge>
                                <Badge variant="outline" className={categoryInfo.color}>
                                  <CategoryIcon className="h-3 w-3 mr-1" />
                                  {categoryInfo.label}
                                </Badge>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTimestamp(notification.timestamp)}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  title="Mark as read"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleArchive(notification.id)}
                                title="Archive"
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(notification.id)}
                                title="Delete"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsCenter;