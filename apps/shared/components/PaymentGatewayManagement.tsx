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

  const handleAddGateway = () => {
    if (!newGateway.name || !newGateway.apiKey || !newGateway.secretKey) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    createGateway.mutate(newGateway);
  };

  // Helper functions
  const getGatewayIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'stripe': return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'paypal': return <DollarSign className="h-5 w-5 text-blue-600" />;
      case 'apple_pay': return <Shield className="h-5 w-5 text-gray-800" />;
      case 'google_pay': return <Zap className="h-5 w-5 text-green-600" />;
      default: return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">Payment Gateway Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure and manage payment gateways: Stripe, PayPal, Apple Pay, Google Pay
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
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
                          placeholder="Optional: webhook endpoint secret"
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
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <div className="mb-6">
              <div className="flex flex-col gap-4">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 max-w-2xl">
                  <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                  <TabsTrigger value="gateways" className="text-sm">Gateways</TabsTrigger>
                  <TabsTrigger value="transactions" className="text-sm">Transactions</TabsTrigger>
                  <TabsTrigger value="payouts" className="text-sm">Payouts</TabsTrigger>
                </TabsList>
                
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-48"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="All Status" />
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
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Last 7 days" />
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
            </div>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gateway Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics?.gatewayBreakdown && Object.entries(analytics.gatewayBreakdown).map(([name, data]: [string, any]) => (
                        <div key={name} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getGatewayIcon(name)}
                            <div>
                              <p className="font-medium capitalize">{name.replace('_', ' ')}</p>
                              <p className="text-sm text-muted-foreground">{data.count} transactions</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${data.volume.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">${data.fees} fees</p>
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
                    {analyticsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {analytics?.recentTransactions?.slice(0, 5).map((transaction: PaymentTransaction) => (
                          <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                {getGatewayIcon(transaction.gatewayName)}
                              </div>
                              <div>
                                <p className="font-medium">${transaction.amount.toFixed(2)} {transaction.currency}</p>
                                <p className="text-sm text-muted-foreground">
                                  {transaction.transactionId.slice(0, 16)}...
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(transaction.status)}>
                                {transaction.status}
                              </Badge>
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
              </div>
            </TabsContent>

            <TabsContent value="gateways" className="space-y-4">
              {gatewaysLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Loading gateways...
                </div>
              ) : (
                <div className="space-y-4">
                  {gateways?.map((gateway: PaymentGateway) => (
                    <Card key={gateway.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              {getGatewayIcon(gateway.type)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{gateway.name}</h3>
                              <p className="text-sm text-muted-foreground capitalize">{gateway.type.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(gateway.status)}>
                              {gateway.status}
                            </Badge>
                            <Switch
                              checked={gateway.isEnabled}
                              onCheckedChange={(checked) => console.log('Toggle gateway', gateway.id, checked)}
                            />
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

                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Loading transactions...
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions?.map((transaction: PaymentTransaction) => (
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
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
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
              <Card>
                <CardHeader>
                  <CardTitle>Service Provider Payouts</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage automated payouts to service providers
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Payout Management</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure automated payout settings and view payout history
                    </p>
                    <Button>
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Payouts
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