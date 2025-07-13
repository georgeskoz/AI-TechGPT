import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Bell, AlertTriangle, Info, Settings, Users, DollarSign, Wrench, Shield, TrendingUp } from 'lucide-react';

interface NotificationMessage {
  id: string;
  type: 'notification' | 'system' | 'alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'system' | 'user' | 'payment' | 'support' | 'security' | 'performance';
  timestamp: string;
  actionUrl?: string;
  autoHide?: boolean;
  duration?: number;
}

interface RealTimeNotificationServiceProps {
  enabled: boolean;
  onNotificationReceived?: (notification: NotificationMessage) => void;
}

const RealTimeNotificationService: React.FC<RealTimeNotificationServiceProps> = ({ 
  enabled, 
  onNotificationReceived 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState<NotificationMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const priorityConfig = {
    low: { color: 'bg-green-100 text-green-800', icon: Info },
    medium: { color: 'bg-yellow-100 text-yellow-800', icon: Bell },
    high: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
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

  const connectWebSocket = () => {
    if (!enabled) return;

    setConnectionStatus('connecting');
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const port = window.location.port || (window.location.protocol === "https:" ? "443" : "80");
    // In development, use port 5000, in production use current port
    const wsPort = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "5000" : port;
    const wsUrl = `${protocol}//${host}:${wsPort}/ws/notifications`;
    
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('NotificationService WebSocket connected');
      setIsConnected(true);
      setConnectionStatus('connected');
      
      // Send authentication or subscription message
      try {
        wsRef.current?.send(JSON.stringify({
          type: 'subscribe',
          channel: 'admin-notifications'
        }));
      } catch (error) {
        console.error('Error sending subscription message:', error);
      }
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'notification') {
          const notification: NotificationMessage = {
            id: data.id || Date.now().toString(),
            type: data.type || 'notification',
            title: data.title,
            message: data.message,
            priority: data.priority || 'medium',
            category: data.category || 'system',
            timestamp: data.timestamp || new Date().toISOString(),
            actionUrl: data.actionUrl,
            autoHide: data.autoHide !== false,
            duration: data.duration || 5000
          };

          handleNewNotification(notification);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    wsRef.current.onclose = () => {
      console.log('NotificationService WebSocket disconnected');
      setIsConnected(false);
      setConnectionStatus('disconnected');
      
      // Attempt to reconnect after 3 seconds
      if (enabled) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('NotificationService WebSocket error:', error);
      setConnectionStatus('disconnected');
    };
  };

  const handleNewNotification = (notification: NotificationMessage) => {
    // Add to active notifications
    setActiveNotifications(prev => [...prev, notification]);
    
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.priority === 'urgent' || notification.priority === 'high' ? 'destructive' : 'default',
      duration: notification.priority === 'urgent' ? 0 : 5000 // Urgent notifications don't auto-hide
    });
    
    // Auto-hide notification after duration
    if (notification.autoHide) {
      setTimeout(() => {
        dismissNotification(notification.id);
      }, notification.duration || 5000);
    }
    
    // Invalidate notification queries to refresh the main center
    queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
    queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications/stats'] });
    
    // Call callback if provided
    if (onNotificationReceived) {
      onNotificationReceived(notification);
    }
  };

  const dismissNotification = (notificationId: string) => {
    setActiveNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const dismissAllNotifications = () => {
    setActiveNotifications([]);
  };

  useEffect(() => {
    if (enabled) {
      connectWebSocket();
    } else {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [enabled]);

  // Don't render if disabled
  if (!enabled) return null;

  return (
    <>
      {/* Connection Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
          connectionStatus === 'connected' 
            ? 'bg-green-100 text-green-800' 
            : connectionStatus === 'connecting'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' 
              ? 'bg-green-500 animate-pulse' 
              : connectionStatus === 'connecting'
              ? 'bg-yellow-500 animate-pulse'
              : 'bg-red-500'
          }`}></div>
          {connectionStatus === 'connected' && 'Live'}
          {connectionStatus === 'connecting' && 'Connecting...'}
          {connectionStatus === 'disconnected' && 'Disconnected'}
        </div>
      </div>

      {/* Active Notifications */}
      <div className="fixed top-16 right-4 z-40 space-y-2 max-w-sm">
        {activeNotifications.map((notification) => {
          const priorityInfo = priorityConfig[notification.priority];
          const categoryInfo = categoryConfig[notification.category];
          const PriorityIcon = priorityInfo.icon;
          const CategoryIcon = categoryInfo.icon;

          return (
            <Card 
              key={notification.id}
              className={`shadow-lg transition-all duration-300 hover:shadow-xl ${
                notification.priority === 'urgent' ? 'border-red-500 bg-red-50' :
                notification.priority === 'high' ? 'border-orange-500 bg-orange-50' :
                'border-gray-200 bg-white'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm">{notification.title}</h4>
                      <Badge className={priorityInfo.color + ' text-xs'}>
                        <PriorityIcon className="h-3 w-3 mr-1" />
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={categoryInfo.color + ' text-xs'}>
                        <CategoryIcon className="h-3 w-3 mr-1" />
                        {notification.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissNotification(notification.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {activeNotifications.length > 1 && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={dismissAllNotifications}
              className="text-xs"
            >
              Dismiss All ({activeNotifications.length})
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default RealTimeNotificationService;