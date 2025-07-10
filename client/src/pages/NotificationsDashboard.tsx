import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationsCenter from '@/components/NotificationsCenter';
import NotificationStats from '@/components/NotificationStats';
import RealTimeNotificationService from '@/components/RealTimeNotificationService';
import Navigation from '@/components/Navigation';
import { Bell, BarChart3, Settings, Zap, Activity, RefreshCw } from 'lucide-react';

const NotificationsDashboard: React.FC = () => {
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('center');

  const handleNotificationReceived = (notification: any) => {
    console.log('New notification received:', notification);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="Notifications Dashboard" backTo="/admin" />
      
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Real-time notification center with priority and category filtering
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-green-600" />
                <Label htmlFor="realtime-toggle">Real-time Updates</Label>
                <Switch
                  id="realtime-toggle"
                  checked={realTimeEnabled}
                  onCheckedChange={setRealTimeEnabled}
                />
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="center" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications Center
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Notifications Center Tab */}
          <TabsContent value="center" className="space-y-6">
            <NotificationsCenter />
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <NotificationStats />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Real-time Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="realtime-notifications">Real-time Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Enable WebSocket-based real-time notifications
                      </p>
                    </div>
                    <Switch
                      id="realtime-notifications"
                      checked={realTimeEnabled}
                      onCheckedChange={setRealTimeEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-refresh">Auto Refresh</Label>
                      <p className="text-sm text-gray-600">
                        Automatically refresh notifications every 30 seconds
                      </p>
                    </div>
                    <Switch id="auto-refresh" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sound-alerts">Sound Alerts</Label>
                      <p className="text-sm text-gray-600">
                        Play sound for urgent notifications
                      </p>
                    </div>
                    <Switch id="sound-alerts" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Show browser notifications for new alerts
                      </p>
                    </div>
                    <Switch id="desktop-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Send email for critical notifications
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="mobile-push">Mobile Push</Label>
                      <p className="text-sm text-gray-600">
                        Send push notifications to mobile devices
                      </p>
                    </div>
                    <Switch id="mobile-push" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Priority Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Low Priority</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Medium Priority</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>High Priority</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Urgent Priority</Label>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>System</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>User</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Payment</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Support</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Security</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Performance</Label>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Real-time Notification Service */}
      <RealTimeNotificationService
        enabled={realTimeEnabled}
        onNotificationReceived={handleNotificationReceived}
      />
    </div>
  );
};

export default NotificationsDashboard;