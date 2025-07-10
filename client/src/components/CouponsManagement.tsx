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
import { useToast } from '@/hooks/use-toast';
import { 
  Percent, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar, 
  Target, 
  Users,
  DollarSign,
  TrendingUp,
  Gift,
  Copy,
  MoreVertical
} from 'lucide-react';

interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableTo: 'all' | 'newUsers' | 'returningUsers' | 'specific';
  categories?: string[];
  createdBy: string;
  createdAt: Date;
}

export default function CouponsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: '',
    applicableTo: 'all',
    categories: []
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for coupons
  const mockCoupons: Coupon[] = [
    {
      id: 1,
      code: 'WELCOME20',
      description: 'Welcome discount for new users',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 50,
      usageLimit: 1000,
      usedCount: 245,
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2024-12-31'),
      isActive: true,
      applicableTo: 'newUsers',
      createdBy: 'Admin',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      code: 'SAVE50',
      description: '$50 off on orders over $200',
      discountType: 'fixed',
      discountValue: 50,
      minOrderAmount: 200,
      usageLimit: 500,
      usedCount: 127,
      validFrom: new Date('2024-02-01'),
      validUntil: new Date('2024-06-30'),
      isActive: true,
      applicableTo: 'all',
      createdBy: 'Admin',
      createdAt: new Date('2024-02-01')
    },
    {
      id: 3,
      code: 'EXPIRED10',
      description: '10% off (expired)',
      discountType: 'percentage',
      discountValue: 10,
      usageLimit: 100,
      usedCount: 85,
      validFrom: new Date('2023-01-01'),
      validUntil: new Date('2023-12-31'),
      isActive: false,
      applicableTo: 'all',
      createdBy: 'Admin',
      createdAt: new Date('2023-01-01')
    }
  ];

  const { data: coupons = mockCoupons } = useQuery({
    queryKey: ['/api/admin/coupons'],
    queryFn: async () => {
      // Mock API call
      return mockCoupons;
    }
  });

  const createCouponMutation = useMutation({
    mutationFn: async (couponData: any) => {
      // Mock API call
      return { success: true, coupon: { ...couponData, id: Date.now() } };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Coupon created successfully"
      });
      setShowCreateDialog(false);
      setNewCoupon({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minOrderAmount: '',
        maxDiscountAmount: '',
        usageLimit: '',
        validFrom: '',
        validUntil: '',
        applicableTo: 'all',
        categories: []
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/coupons'] });
    }
  });

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && coupon.isActive) ||
                         (filterStatus === 'inactive' && !coupon.isActive);
    return matchesSearch && matchesFilter;
  });

  const handleCreateCoupon = () => {
    createCouponMutation.mutate(newCoupon);
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon({ ...newCoupon, code: result });
  };

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date();
    if (!coupon.isActive || coupon.validUntil < now) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    if (coupon.validFrom > now) {
      return <Badge variant="secondary">Scheduled</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  const getUsagePercentage = (used: number, limit?: number) => {
    if (!limit) return 0;
    return (used / limit) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons.filter(c => c.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Redemptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Given</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">Customer savings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Coupons Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create and manage discount coupons for customers
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Coupon
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Coupon</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="code">Coupon Code *</Label>
                        <div className="flex gap-2">
                          <Input
                            id="code"
                            value={newCoupon.code}
                            onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                            placeholder="Enter coupon code"
                          />
                          <Button variant="outline" onClick={generateCouponCode}>
                            Generate
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="discountType">Discount Type *</Label>
                        <Select value={newCoupon.discountType} onValueChange={(value) => setNewCoupon({...newCoupon, discountType: value as 'percentage' | 'fixed'})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={newCoupon.description}
                        onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                        placeholder="Enter coupon description"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="discountValue">
                          {newCoupon.discountType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                        </Label>
                        <Input
                          id="discountValue"
                          type="number"
                          value={newCoupon.discountValue}
                          onChange={(e) => setNewCoupon({...newCoupon, discountValue: parseFloat(e.target.value) || 0})}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="minOrderAmount">Min Order Amount ($)</Label>
                        <Input
                          id="minOrderAmount"
                          type="number"
                          value={newCoupon.minOrderAmount}
                          onChange={(e) => setNewCoupon({...newCoupon, minOrderAmount: e.target.value})}
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <Label htmlFor="usageLimit">Usage Limit</Label>
                        <Input
                          id="usageLimit"
                          type="number"
                          value={newCoupon.usageLimit}
                          onChange={(e) => setNewCoupon({...newCoupon, usageLimit: e.target.value})}
                          placeholder="Unlimited"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="validFrom">Valid From</Label>
                        <Input
                          id="validFrom"
                          type="date"
                          value={newCoupon.validFrom}
                          onChange={(e) => setNewCoupon({...newCoupon, validFrom: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="validUntil">Valid Until</Label>
                        <Input
                          id="validUntil"
                          type="date"
                          value={newCoupon.validUntil}
                          onChange={(e) => setNewCoupon({...newCoupon, validUntil: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="applicableTo">Applicable To</Label>
                      <Select value={newCoupon.applicableTo} onValueChange={(value) => setNewCoupon({...newCoupon, applicableTo: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="newUsers">New Users Only</SelectItem>
                          <SelectItem value="returningUsers">Returning Users Only</SelectItem>
                          <SelectItem value="specific">Specific Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateCoupon} disabled={createCouponMutation.isPending}>
                        {createCouponMutation.isPending ? 'Creating...' : 'Create Coupon'}
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
                placeholder="Search coupons..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Coupons Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                  <TableCell className="max-w-xs truncate">{coupon.description}</TableCell>
                  <TableCell>
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountValue}%` 
                      : `$${coupon.discountValue}`
                    }
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                      </div>
                      {coupon.usageLimit && (
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full" 
                            style={{ width: `${getUsagePercentage(coupon.usedCount, coupon.usageLimit)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{coupon.validFrom.toLocaleDateString()}</div>
                      <div className="text-muted-foreground">to {coupon.validUntil.toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(coupon)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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