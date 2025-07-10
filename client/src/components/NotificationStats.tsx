import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Bell, 
  BellRing, 
  AlertTriangle, 
  CheckCircle, 
  Archive, 
  Settings, 
  Users, 
  DollarSign, 
  Wrench, 
  Shield, 
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface NotificationStats {
  total: number;
  unread: number;
  archived: number;
  priorityStats: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  categoryStats: {
    system: number;
    user: number;
    payment: number;
    support: number;
    security: number;
    performance: number;
  };
}

const NotificationStats: React.FC = () => {
  const { data: stats, isLoading } = useQuery<NotificationStats>({
    queryKey: ['/api/admin/notifications/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/notifications/stats').then(res => res.json()),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const priorityConfig = {
    low: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    medium: { color: 'bg-yellow-100 text-yellow-800', icon: Bell },
    high: { color: 'bg-orange-100 text-orange-800', icon: BellRing },
    urgent: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
  };

  const categoryConfig = {
    system: { color: 'bg-blue-100 text-blue-800', icon: Settings },
    user: { color: 'bg-purple-100 text-purple-800', icon: Users },
    payment: { color: 'bg-green-100 text-green-800', icon: DollarSign },
    support: { color: 'bg-orange-100 text-orange-800', icon: Wrench },
    security: { color: 'bg-red-100 text-red-800', icon: Shield },
    performance: { color: 'bg-indigo-100 text-indigo-800', icon: TrendingUp }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-orange-600">{stats.unread}</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <BellRing className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Archived</p>
                <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
              </div>
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Archive className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent/High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.priorityStats.urgent + stats.priorityStats.high}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Priority Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.priorityStats).map(([priority, count]) => {
              const config = priorityConfig[priority as keyof typeof priorityConfig];
              const Icon = config.icon;
              return (
                <div key={priority} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Badge className={config.color}>
                      <Icon className="h-3 w-3 mr-1" />
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Category Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(stats.categoryStats).map(([category, count]) => {
              const config = categoryConfig[category as keyof typeof categoryConfig];
              const Icon = config.icon;
              return (
                <div key={category} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Badge variant="outline" className={config.color}>
                      <Icon className="h-3 w-3 mr-1" />
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live notifications enabled</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Auto-refresh: 30s
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationStats;