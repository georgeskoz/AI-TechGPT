import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Plus, 
  Eye, 
  EyeOff, 
  Check, 
  X,
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  Search,
  Calendar,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Globe,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Receipt
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Types for Payment Gateway Management
interface PaymentGateway {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'apple_pay' | 'google_pay';
  status: 'active' | 'inactive' | 'pending' | 'error';
  isEnabled: boolean;
  apiKey: string;
  webhookUrl: string;
  fees: {
    percentage: number;
    fixed: number;
  };
  supportedCurrencies: string[];
  supportedCountries: string[];
  createdAt: Date;
  updatedAt: Date;
  lastSync: Date;
  totalTransactions: number;
  totalVolume: number;
  monthlyVolume: number;
  config: Record<string, any>;
}

interface PaymentTransaction {
  id: string;
  gatewayId: string;
  gatewayName: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed';
  type: 'payment' | 'refund' | 'chargeback';
  customerId: number;
  technicianId: number;
  jobId: number;
  fees: number;
  netAmount: number;
  createdAt: Date;
  completedAt: Date | null;
  failureReason: string | null;
  metadata: Record<string, any>;
}

interface PaymentAnalytics {
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
  averageTransactionValue: number;
  monthlyGrowth: number;
  topGateway: string;
  gatewayBreakdown: Record<string, { volume: number; count: number; fees: number }>;
  recentTransactions: PaymentTransaction[];
}

export default function PaymentGatewayManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showAddGatewayDialog, setShowAddGatewayDialog] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  
  // New gateway form state
  const [newGateway, setNewGateway] = useState({
    name: '',
    type: 'stripe' as const,
    apiKey: '',
    secretKey: '',
    webhookSecret: '',
    isEnabled: true,
    fees: { percentage: 2.9, fixed: 0.30 },
    supportedCurrencies: ['USD'],
    supportedCountries: ['US'],
    config: {}
  });

  // API calls
  const { data: gateways, isLoading: gatewaysLoading } = useQuery({
    queryKey: ['/api/admin/payment-gateways'],
    queryFn: () => apiRequest('GET', '/api/admin/payment-gateways').then(res => res.json())
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/admin/payment-transactions', searchTerm, statusFilter, dateRange],
    queryFn: () => apiRequest('GET', `/api/admin/payment-transactions?search=${searchTerm}&status=${statusFilter}&range=${dateRange}`).then(res => res.json())
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/admin/payment-analytics', dateRange],
    queryFn: () => apiRequest('GET', `/api/admin/payment-analytics?range=${dateRange}`).then(res => res.json())
  });

  // Mutations
  const createGateway = useMutation({
    mutationFn: (gatewayData: any) => apiRequest('POST', '/api/admin/payment-gateways', gatewayData).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payment-gateways'] });
      setShowAddGatewayDialog(false);
      setNewGateway({
        name: '',
        type: 'stripe',
        apiKey: '',
        secretKey: '',
        webhookSecret: '',
        isEnabled: true,
        fees: { percentage: 2.9, fixed: 0.30 },
        supportedCurrencies: ['USD'],
        supportedCountries: ['US'],
        config: {}
      });
      toast({
        title: "Success",
        description: "Payment gateway added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add payment gateway",
        variant: "destructive",
      });
    }
  });

  const updateGateway = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest('PUT', `/api/admin/payment-gateways/${id}`, data).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payment-gateways'] });
      toast({
        title: "Success",
        description: "Payment gateway updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment gateway",
        variant: "destructive",
      });
    }
  });

  const deleteGateway = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/payment-gateways/${id}`).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payment-gateways'] });
      toast({
        title: "Success",
        description: "Payment gateway deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete payment gateway",
        variant: "destructive",
      });
    }
  });

  const toggleGatewayStatus = useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
      apiRequest('PUT', `/api/admin/payment-gateways/${id}/toggle`, { isEnabled }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payment-gateways'] });
      toast({
        title: "Success",
        description: "Gateway status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update gateway status",
        variant: "destructive",
      });
    }
  });

  const syncGateway = useMutation({
    mutationFn: (id: string) => apiRequest('POST', `/api/admin/payment-gateways/${id}/sync`).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payment-gateways'] });
      toast({
        title: "Success",
        description: "Gateway synchronized successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to sync gateway",
        variant: "destructive",
      });
    }
  });

  // Helper functions
  const getGatewayIcon = (type: string) => {
    switch (type) {
      case 'stripe': return <CreditCard className="h-4 w-4" />;
      case 'paypal': return <Globe className="h-4 w-4" />;
      case 'apple_pay': return <Shield className="h-4 w-4" />;
      case 'google_pay': return <Zap className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline',
      error: 'destructive'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  const getTransactionStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'outline',
      failed: 'destructive',
      refunded: 'secondary',
      disputed: 'destructive'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  const handleAddGateway = () => {
    if (!newGateway.name || !newGateway.apiKey) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createGateway.mutate(newGateway);
  };

  const toggleApiKeyVisibility = (gatewayId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [gatewayId]: !prev[gatewayId]
    }));
  };

  const handleDeleteGateway = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the ${name} gateway? This action cannot be undone.`)) {
      deleteGateway.mutate(id);
    }
  };

  const filteredGateways = gateways?.filter((gateway: PaymentGateway) => {
    const matchesSearch = gateway.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gateway.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || gateway.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTransactions = transactions?.filter((transaction: PaymentTransaction) => {
    const matchesSearch = transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.gatewayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics?.totalVolume?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.monthlyGrowth >= 0 ? '+' : ''}{analytics?.monthlyGrowth || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalTransactions?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.successRate || 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics?.averageTransactionValue?.toFixed(2) || 0}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Gateways</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gateways?.filter((g: PaymentGateway) => g.isEnabled).length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Top: {analytics?.topGateway || 'None'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Payment Gateway Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure and manage payment gateways: Stripe, PayPal, Apple Pay
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={showAddGatewayDialog} onOpenChange={setShowAddGatewayDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Gateway
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Payment Gateway</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gatewayName">Gateway Name *</Label>
                        <Input
                          id="gatewayName"
                          value={newGateway.name}
                          onChange={(e) => setNewGateway({...newGateway, name: e.target.value})}
                          placeholder="e.g., Stripe Production"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gatewayType">Gateway Type *</Label>
                        <Select value={newGateway.type} onValueChange={(value: any) => setNewGateway({...newGateway, type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gateway type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stripe">Stripe</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="apple_pay">Apple Pay</SelectItem>
                            <SelectItem value="google_pay">Google Pay</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="apiKey">API Key *</Label>
                        <Input
                          id="apiKey"
                          type="password"
                          value={newGateway.apiKey}
                          onChange={(e) => setNewGateway({...newGateway, apiKey: e.target.value})}
                          placeholder="Enter API key"
                        />
                      </div>
                      <div>
                        <Label htmlFor="secretKey">Secret Key *</Label>
                        <Input
                          id="secretKey"
                          type="password"
                          value={newGateway.secretKey}
                          onChange={(e) => setNewGateway({...newGateway, secretKey: e.target.value})}
                          placeholder="Enter secret key"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="webhookSecret">Webhook Secret</Label>
                      <Input
                        id="webhookSecret"
                        type="password"
                        value={newGateway.webhookSecret}
                        onChange={(e) => setNewGateway({...newGateway, webhookSecret: e.target.value})}
                        placeholder="Enter webhook secret"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="feePercentage">Fee Percentage (%)</Label>
                        <Input
                          id="feePercentage"
                          type="number"
                          step="0.1"
                          value={newGateway.fees.percentage}
                          onChange={(e) => setNewGateway({
                            ...newGateway, 
                            fees: { ...newGateway.fees, percentage: parseFloat(e.target.value) || 0 }
                          })}
                          placeholder="2.9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="feeFixed">Fixed Fee ($)</Label>
                        <Input
                          id="feeFixed"
                          type="number"
                          step="0.01"
                          value={newGateway.fees.fixed}
                          onChange={(e) => setNewGateway({
                            ...newGateway, 
                            fees: { ...newGateway.fees, fixed: parseFloat(e.target.value) || 0 }
                          })}
                          placeholder="0.30"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableGateway"
                        checked={newGateway.isEnabled}
                        onCheckedChange={(checked) => setNewGateway({...newGateway, isEnabled: checked})}
                      />
                      <Label htmlFor="enableGateway">Enable gateway immediately</Label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddGatewayDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddGateway} disabled={createGateway.isPending}>
                        {createGateway.isPending ? 'Adding...' : 'Add Gateway'}
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
              <TabsList className="grid w-full grid-cols-4 sm:w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gateways">Gateways</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="payouts">Service Provider Payouts</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gateway Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analytics?.gatewayBreakdown || {}).map(([gateway, data]: [string, any]) => (
                        <div key={gateway} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {getGatewayIcon(gateway)}
                            <span className="font-medium capitalize">{gateway}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${data.volume.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">{data.count} transactions</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics?.recentTransactions?.slice(0, 5).map((transaction: PaymentTransaction) => (
                        <div key={transaction.id} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">${transaction.amount.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">{transaction.gatewayName}</div>
                          </div>
                          <div className="text-right">
                            {getTransactionStatusBadge(transaction.status)}
                            <div className="text-sm text-muted-foreground mt-1">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gateways" className="space-y-4">
              <div className="grid gap-4">
                {gatewaysLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading gateways...</span>
                  </div>
                ) : filteredGateways?.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Payment Gateways</h3>
                    <p className="text-muted-foreground mb-4">
                      Get started by adding your first payment gateway.
                    </p>
                    <Button onClick={() => setShowAddGatewayDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Gateway
                    </Button>
                  </div>
                ) : (
                  filteredGateways?.map((gateway: PaymentGateway) => (
                    <Card key={gateway.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {getGatewayIcon(gateway.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{gateway.name}</h3>
                              <p className="text-sm text-muted-foreground capitalize">{gateway.type} Gateway</p>
                              <div className="flex items-center gap-2 mt-2">
                                {getStatusBadge(gateway.status)}
                                <Badge variant="outline">
                                  {gateway.supportedCurrencies.join(', ')}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={gateway.isEnabled}
                              onCheckedChange={(checked) => 
                                toggleGatewayStatus.mutate({ id: gateway.id, isEnabled: checked })
                              }
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => syncGateway.mutate(gateway.id)}
                              disabled={syncGateway.isPending}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteGateway(gateway.id, gateway.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium">Total Volume</p>
                            <p className="text-lg font-semibold">${gateway.totalVolume.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Transactions</p>
                            <p className="text-lg font-semibold">{gateway.totalTransactions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Fees</p>
                            <p className="text-lg font-semibold">{gateway.fees.percentage}% + ${gateway.fees.fixed}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Last Sync</p>
                            <p className="text-lg font-semibold">
                              {new Date(gateway.lastSync).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-medium">API Key</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleApiKeyVisibility(gateway.id)}
                            >
                              {showApiKeys[gateway.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <p className="text-sm font-mono bg-muted p-2 rounded">
                            {showApiKeys[gateway.id] ? gateway.apiKey : '••••••••••••••••••••••••••••••••'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading transactions...</span>
                    </div>
                  ) : filteredTransactions?.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Transactions</h3>
                      <p className="text-muted-foreground">
                        Transaction history will appear here once payments are processed.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTransactions?.map((transaction: PaymentTransaction) => (
                        <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {getGatewayIcon(transaction.gatewayName)}
                            </div>
                            <div>
                              <p className="font-medium">${transaction.amount.toFixed(2)} {transaction.currency}</p>
                              <p className="text-sm text-muted-foreground">
                                {transaction.transactionId} • {transaction.gatewayName}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getTransactionStatusBadge(transaction.status)}
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payouts" className="space-y-4">
              <ServiceProviderPayouts />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Service Provider Payout Management Component
function ServiceProviderPayouts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [payoutTab, setPayoutTab] = useState('dashboard');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showProcessPayoutDialog, setShowProcessPayoutDialog] = useState(false);
  const [showPayoutMethodDialog, setShowPayoutMethodDialog] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutNote, setPayoutNote] = useState('');

  // API calls for payout management
  const { data: payoutDashboard, isLoading: payoutDashboardLoading } = useQuery({
    queryKey: ['/api/admin/service-provider-payouts/dashboard'],
    queryFn: () => apiRequest('GET', '/api/admin/service-provider-payouts/dashboard').then(res => res.json())
  });

  const { data: serviceProviders, isLoading: serviceProvidersLoading } = useQuery({
    queryKey: ['/api/admin/service-providers/earnings'],
    queryFn: () => apiRequest('GET', '/api/admin/service-providers/earnings').then(res => res.json())
  });

  const { data: payoutHistory, isLoading: payoutHistoryLoading } = useQuery({
    queryKey: ['/api/admin/payouts/history'],
    queryFn: () => apiRequest('GET', '/api/admin/payouts/history').then(res => res.json())
  });

  const { data: payoutSettings, isLoading: payoutSettingsLoading } = useQuery({
    queryKey: ['/api/admin/payout-settings'],
    queryFn: () => apiRequest('GET', '/api/admin/payout-settings').then(res => res.json())
  });

  // Mutations for payout operations
  const processPayoutMutation = useMutation({
    mutationFn: (payoutData: any) => apiRequest('POST', '/api/admin/process-payout', payoutData).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/service-provider-payouts/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/service-providers/earnings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payouts/history'] });
      setShowProcessPayoutDialog(false);
      setPayoutAmount('');
      setPayoutNote('');
      toast({
        title: "Success",
        description: "Payout processed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process payout",
        variant: "destructive",
      });
    }
  });

  const bulkPayoutMutation = useMutation({
    mutationFn: (payoutData: any) => apiRequest('POST', '/api/admin/bulk-payout', payoutData).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/service-provider-payouts/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/service-providers/earnings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payouts/history'] });
      toast({
        title: "Success",
        description: "Bulk payout processed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process bulk payout",
        variant: "destructive",
      });
    }
  });

  const updatePayoutSettingsMutation = useMutation({
    mutationFn: (settingsData: any) => apiRequest('PUT', '/api/admin/payout-settings', settingsData).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payout-settings'] });
      toast({
        title: "Success",
        description: "Payout settings updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update payout settings",
        variant: "destructive",
      });
    }
  });

  const handleProcessPayout = () => {
    if (!selectedProvider || !payoutAmount) {
      toast({
        title: "Error",
        description: "Please select a provider and enter payout amount",
        variant: "destructive",
      });
      return;
    }

    processPayoutMutation.mutate({
      providerId: selectedProvider,
      amount: parseFloat(payoutAmount),
      note: payoutNote,
      method: 'stripe_transfer'
    });
  };

  const handleBulkPayout = () => {
    const eligibleProviders = serviceProviders?.filter((p: any) => p.pendingEarnings >= 50);
    if (!eligibleProviders || eligibleProviders.length === 0) {
      toast({
        title: "No Eligible Providers",
        description: "No service providers meet the minimum payout threshold",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Process payouts for ${eligibleProviders.length} service providers?`)) {
      bulkPayoutMutation.mutate({
        providers: eligibleProviders.map((p: any) => ({
          providerId: p.id,
          amount: p.pendingEarnings,
          method: 'stripe_transfer'
        }))
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Payout Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${payoutDashboard?.totalPendingPayouts?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {payoutDashboard?.eligibleProviders || 0} providers eligible
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week's Payouts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${payoutDashboard?.weeklyPayouts?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {payoutDashboard?.weeklyPayoutCount || 0} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Fees</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${payoutDashboard?.processingFees?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {payoutDashboard?.feePercentage || 2.5}% average fee
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Auto Payout</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payoutDashboard?.nextPayoutDate || 'Friday'}</div>
            <p className="text-xs text-muted-foreground">
              Weekly schedule
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payout Management Tabs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Service Provider Payouts</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage automatic payouts and payment methods for service providers
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleBulkPayout}
                disabled={bulkPayoutMutation.isPending}
                className="flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Process All Eligible
              </Button>
              <Dialog open={showProcessPayoutDialog} onOpenChange={setShowProcessPayoutDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Manual Payout
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Process Manual Payout</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="provider">Service Provider</Label>
                      <Select value={selectedProvider || ''} onValueChange={setSelectedProvider}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceProviders?.map((provider: any) => (
                            <SelectItem key={provider.id} value={provider.id.toString()}>
                              {provider.name} - ${provider.pendingEarnings} pending
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="amount">Payout Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="note">Note (Optional)</Label>
                      <Input
                        id="note"
                        value={payoutNote}
                        onChange={(e) => setPayoutNote(e.target.value)}
                        placeholder="Payout reason or reference"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowProcessPayoutDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleProcessPayout} disabled={processPayoutMutation.isPending}>
                        {processPayoutMutation.isPending ? 'Processing...' : 'Process Payout'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={payoutTab} onValueChange={setPayoutTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="providers">Service Providers</TabsTrigger>
              <TabsTrigger value="history">Payout History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Payouts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {payoutHistory?.slice(0, 5).map((payout: any) => (
                        <div key={payout.id} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{payout.providerName}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(payout.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${payout.amount.toFixed(2)}</div>
                            <Badge variant={payout.status === 'completed' ? 'default' : 'outline'}>
                              {payout.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payout Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Automatic Payouts</h4>
                        <p className="text-sm text-blue-800">
                          Service providers receive automatic payouts every Friday for earnings above $50 minimum threshold.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Next payout date:</span>
                          <span className="font-medium">{payoutDashboard?.nextPayoutDate || 'Friday'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Minimum threshold:</span>
                          <span className="font-medium">${payoutSettings?.minimumPayout || 50}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Processing fee:</span>
                          <span className="font-medium">{payoutSettings?.processingFee || 2.5}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="providers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Service Provider Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  {serviceProvidersLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading service providers...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {serviceProviders?.map((provider: any) => (
                        <div key={provider.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={provider.avatar} />
                              <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{provider.name}</p>
                              <p className="text-sm text-muted-foreground">{provider.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${provider.pendingEarnings} pending</div>
                            <div className="text-sm text-muted-foreground">
                              ${provider.totalEarnings} total
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProvider(provider.id.toString());
                                setPayoutAmount(provider.pendingEarnings.toString());
                                setShowProcessPayoutDialog(true);
                              }}
                              disabled={provider.pendingEarnings < 1}
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payout History</CardTitle>
                </CardHeader>
                <CardContent>
                  {payoutHistoryLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading payout history...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {payoutHistory?.map((payout: any) => (
                        <div key={payout.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">{payout.providerName}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(payout.createdAt).toLocaleDateString()} • {payout.method}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${payout.amount.toFixed(2)}</div>
                            <Badge variant={payout.status === 'completed' ? 'default' : 'outline'}>
                              {payout.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payout Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="minimumPayout">Minimum Payout Threshold</Label>
                      <Input
                        id="minimumPayout"
                        type="number"
                        defaultValue={payoutSettings?.minimumPayout || 50}
                        placeholder="50"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Service providers must reach this amount before automatic payout
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="processingFee">Processing Fee (%)</Label>
                      <Input
                        id="processingFee"
                        type="number"
                        step="0.1"
                        defaultValue={payoutSettings?.processingFee || 2.5}
                        placeholder="2.5"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Fee charged for processing payouts
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="payoutSchedule">Payout Schedule</Label>
                      <Select defaultValue={payoutSettings?.schedule || 'weekly'}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="autoPayout" defaultChecked={payoutSettings?.autoPayoutEnabled || true} />
                      <Label htmlFor="autoPayout">Enable automatic payouts</Label>
                    </div>
                    <Button
                      onClick={() => updatePayoutSettingsMutation.mutate({
                        minimumPayout: parseFloat((document.getElementById('minimumPayout') as HTMLInputElement)?.value || '50'),
                        processingFee: parseFloat((document.getElementById('processingFee') as HTMLInputElement)?.value || '2.5'),
                        schedule: 'weekly',
                        autoPayoutEnabled: true
                      })}
                      disabled={updatePayoutSettingsMutation.isPending}
                    >
                      {updatePayoutSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}