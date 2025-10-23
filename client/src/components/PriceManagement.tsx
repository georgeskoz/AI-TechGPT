import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Edit, Trash2, Save, Plus, TrendingUp, TrendingDown, AlertTriangle, X } from "lucide-react";

interface PriceRule {
  id: number;
  name: string;
  serviceType: string;
  category: string;
  basePrice: number;
  multiplier: number;
  conditions: string[];
  status: 'active' | 'inactive';
  lastModified: string;
}

interface CommissionRule {
  id: number;
  name: string;
  region: string;
  country?: string;
  state?: string;
  commissionRate: number;
  serviceType?: string;
  minAmount?: number;
  maxAmount?: number;
  status: 'active' | 'inactive';
  description?: string;
  lastModified: string;
}


const PriceManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("current-prices");
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'none'>('none');
  const [newRule, setNewRule] = useState({
    name: "",
    serviceType: "",
    category: "",
    basePrice: 0,
    multiplier: 1.0,
    conditions: []
  });

  const [editingValues, setEditingValues] = useState<Partial<PriceRule>>({});

  // Commission rules state
  const [editingCommission, setEditingCommission] = useState<string | null>(null);
  const [editingCommissionValues, setEditingCommissionValues] = useState<Partial<CommissionRule>>({});
  const [newCommission, setNewCommission] = useState({
    name: "",
    region: "",
    country: "",
    state: "",
    commissionRate: 0,
    serviceType: "",
    minAmount: 0,
    maxAmount: 0,
    description: ""
  });

  // Fetch pricing rules from API
  const { data: priceRules = [], isLoading } = useQuery<PriceRule[]>({
    queryKey: ['/api/admin/pricing-rules'],
  });

  // Fetch commission rules from API
  const { data: commissionRules = [], isLoading: isLoadingCommissions } = useQuery<CommissionRule[]>({
    queryKey: ['/api/admin/commission-rules'],
  });

  // Create pricing rule mutation
  const createRuleMutation = useMutation({
    mutationFn: (rule: Omit<PriceRule, 'id' | 'lastModified' | 'createdAt' | 'updatedAt'>) =>
      apiRequest('/api/admin/pricing-rules', 'POST', rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pricing-rules'] });
    },
  });

  // Update pricing rule mutation
  const updateRuleMutation = useMutation({
    mutationFn: ({ id, ...updates }: Partial<PriceRule> & { id: number }) =>
      apiRequest(`/api/admin/pricing-rules/${id}`, 'PUT', updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pricing-rules'] });
    },
  });

  // Delete pricing rule mutation
  const deleteRuleMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/admin/pricing-rules/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pricing-rules'] });
    },
  });

  // Commission rules mutations
  const createCommissionMutation = useMutation({
    mutationFn: (rule: Omit<CommissionRule, 'id' | 'lastModified' | 'createdAt' | 'updatedAt'>) =>
      apiRequest('/api/admin/commission-rules', 'POST', rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/commission-rules'] });
    },
  });

  const updateCommissionMutation = useMutation({
    mutationFn: ({ id, ...updates }: Partial<CommissionRule> & { id: number }) =>
      apiRequest(`/api/admin/commission-rules/${id}`, 'PUT', updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/commission-rules'] });
    },
  });

  const deleteCommissionMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/admin/commission-rules/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/commission-rules'] });
    },
  });

  const serviceTypes = [
    { value: "remote", label: "Remote Support" },
    { value: "phone", label: "Phone Support" },
    { value: "onsite", label: "On-Site Support" },
    { value: "consultation", label: "Consultation" }
  ];

  const categories = [
    { value: "basic", label: "Basic Support" },
    { value: "intermediate", label: "Intermediate Support" },
    { value: "advanced", label: "Advanced Support" },
    { value: "expert", label: "Expert Support" },
    { value: "enterprise", label: "Enterprise Support" }
  ];

  const handleSaveRule = async () => {
    if (editingRule && editingValues) {
      // Validation
      if (!editingValues.name || editingValues.name.trim() === '') {
        toast({
          title: "Validation Error",
          description: "Rule name is required and cannot be empty.",
          variant: "destructive",
        });
        return;
      }

      if (!editingValues.basePrice || !Number.isFinite(editingValues.basePrice) || editingValues.basePrice <= 0) {
        toast({
          title: "Validation Error",
          description: "Base price must be a valid positive number.",
          variant: "destructive",
        });
        return;
      }

      if (!editingValues.multiplier || !Number.isFinite(editingValues.multiplier) || editingValues.multiplier <= 0) {
        toast({
          title: "Validation Error",
          description: "Multiplier must be a valid positive number.",
          variant: "destructive",
        });
        return;
      }

      if (!editingValues.category || editingValues.category.trim() === '') {
        toast({
          title: "Validation Error",
          description: "Category is required and cannot be empty.",
          variant: "destructive",
        });
        return;
      }

      try {
        await updateRuleMutation.mutateAsync({ id: parseInt(editingRule), ...editingValues });
        toast({
          title: "Price Rule Saved",
          description: "The pricing rule has been updated successfully.",
        });
        setEditingRule(null);
        setEditingValues({});
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update pricing rule.",
          variant: "destructive",
        });
      }
    }
  };

  const handleStartEdit = (rule: PriceRule) => {
    setEditingRule(rule.id.toString());
    setEditingValues(rule);
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
    setEditingValues({});
  };

  const handleAddRule = async () => {
    if (!newRule.name || newRule.name.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Rule name is required and cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (!newRule.serviceType) {
      toast({
        title: "Validation Error",
        description: "Please select a service type.",
        variant: "destructive",
      });
      return;
    }

    if (!newRule.category || newRule.category.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Category is required and cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (!newRule.basePrice || !Number.isFinite(newRule.basePrice) || newRule.basePrice <= 0) {
      toast({
        title: "Validation Error",
        description: "Base price must be a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    if (!newRule.multiplier || !Number.isFinite(newRule.multiplier) || newRule.multiplier <= 0) {
      toast({
        title: "Validation Error",
        description: "Multiplier must be a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createRuleMutation.mutateAsync({
        name: newRule.name,
        serviceType: newRule.serviceType,
        category: newRule.category,
        basePrice: newRule.basePrice,
        multiplier: newRule.multiplier,
        conditions: newRule.conditions,
        status: "active"
      });

      toast({
        title: "Price Rule Added",
        description: "New pricing rule has been created successfully.",
      });

      setNewRule({
        name: "",
        serviceType: "",
        category: "",
        basePrice: 0,
        multiplier: 1.0,
        conditions: []
      });

      setActiveTab("pricing-rules");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create pricing rule.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRule = async (id: number) => {
    try {
      await deleteRuleMutation.mutateAsync(id);
      toast({
        title: "Price Rule Deleted",
        description: "The pricing rule has been removed.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete pricing rule.",
        variant: "destructive",
      });
    }
  };

  const getSortedPriceRules = () => {
    const rulesCopy = [...priceRules];
    
    if (sortBy === 'name') {
      return rulesCopy.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'category') {
      return rulesCopy.sort((a, b) => a.category.localeCompare(b.category));
    }
    
    return rulesCopy;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Price Management</h2>
          <p className="text-gray-600 mt-1">Manage dynamic pricing rules and service rates</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Price Analytics
          </Button>
          <Button variant="outline" size="sm">
            <DollarSign className="h-4 w-4 mr-2" />
            Bulk Update
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="current-prices">Current Prices</TabsTrigger>
          <TabsTrigger value="pricing-rules">Pricing Rules</TabsTrigger>
          <TabsTrigger value="add-rule">Add New Rule</TabsTrigger>
          <TabsTrigger value="commissions">Commission Rules</TabsTrigger>
          <TabsTrigger value="price-history">Price History</TabsTrigger>
        </TabsList>

        <TabsContent value="current-prices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Remote Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Basic</span>
                    <span className="font-semibold">$45/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Advanced</span>
                    <span className="font-semibold">$75/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expert</span>
                    <span className="font-semibold">$95/hr</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Basic</span>
                    <span className="font-semibold">$55/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Advanced</span>
                    <span className="font-semibold">$85/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expert</span>
                    <span className="font-semibold">$125/hr</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
                  On-Site Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Basic</span>
                    <span className="font-semibold">$85/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Advanced</span>
                    <span className="font-semibold">$150/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Enterprise</span>
                    <span className="font-semibold">$250/hr</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dynamic Pricing Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Time-Based Multipliers</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Business Hours (9AM-5PM)</span>
                      <span className="text-green-600">1.0x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Evening (5PM-9PM)</span>
                      <span className="text-yellow-600">1.2x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Night (9PM-9AM)</span>
                      <span className="text-red-600">1.5x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekend</span>
                      <span className="text-orange-600">1.3x</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Urgency Multipliers</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Standard</span>
                      <span className="text-green-600">1.0x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High Priority</span>
                      <span className="text-yellow-600">1.3x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Urgent</span>
                      <span className="text-red-600">1.5x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emergency</span>
                      <span className="text-red-600">2.0x</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing-rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Pricing Rules</CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="sort-select" className="text-sm text-gray-600">Sort by:</Label>
                  <Select value={sortBy} onValueChange={(value: 'name' | 'category' | 'none') => setSortBy(value)}>
                    <SelectTrigger className="w-40" id="sort-select" data-testid="select-sort-rules">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Default</SelectItem>
                      <SelectItem value="name">Alphabetically (A-Z)</SelectItem>
                      <SelectItem value="category">By Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Multiplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getSortedPriceRules().map((rule) => (
                    <TableRow key={rule.id}>
                      {editingRule === rule.id.toString() ? (
                        <>
                          <TableCell>
                            <Input
                              value={editingValues.name || ''}
                              onChange={(e) => setEditingValues({...editingValues, name: e.target.value})}
                              className="max-w-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={editingValues.serviceType || rule.serviceType}
                              onValueChange={(value) => setEditingValues({...editingValues, serviceType: value})}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {serviceTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editingValues.category || ''}
                              onChange={(e) => setEditingValues({...editingValues, category: e.target.value})}
                              className="max-w-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editingValues.basePrice || 0}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (Number.isFinite(value) && value >= 0) {
                                  setEditingValues({...editingValues, basePrice: value});
                                }
                              }}
                              className="w-24"
                              min="0"
                              step="1"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.1"
                              value={editingValues.multiplier || 1.0}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (Number.isFinite(value) && value >= 0) {
                                  setEditingValues({...editingValues, multiplier: value});
                                }
                              }}
                              className="w-20"
                              min="0"
                            />
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={editingValues.status || rule.status}
                              onValueChange={(value: 'active' | 'inactive') => setEditingValues({...editingValues, status: value})}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={handleSaveRule}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium">{rule.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{rule.serviceType}</Badge>
                          </TableCell>
                          <TableCell>{rule.category}</TableCell>
                          <TableCell>${rule.basePrice}</TableCell>
                          <TableCell>{rule.multiplier}x</TableCell>
                          <TableCell>
                            <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                              {rule.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartEdit(rule)}
                                data-testid={`button-edit-rule-${rule.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteRule(rule.id)}
                                data-testid={`button-delete-rule-${rule.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-rule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Pricing Rule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    value={newRule.name}
                    onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                    placeholder="Enter rule name"
                  />
                </div>
                <div>
                  <Label htmlFor="service-type">Service Type</Label>
                  <Select value={newRule.serviceType} onValueChange={(value) => setNewRule({...newRule, serviceType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newRule.category} onValueChange={(value) => setNewRule({...newRule, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="base-price">Base Price ($)</Label>
                  <Input
                    id="base-price"
                    type="number"
                    value={newRule.basePrice}
                    onChange={(e) => setNewRule({...newRule, basePrice: parseFloat(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="multiplier">Multiplier</Label>
                  <Input
                    id="multiplier"
                    type="number"
                    step="0.1"
                    value={newRule.multiplier}
                    onChange={(e) => setNewRule({...newRule, multiplier: parseFloat(e.target.value)})}
                    placeholder="1.0"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleAddRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Management</CardTitle>
              <p className="text-sm text-gray-600">Set company commission rates by region and country</p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="comm-name">Commission Rule Name</Label>
                    <Input
                      id="comm-name"
                      value={newCommission.name}
                      onChange={(e) => setNewCommission({...newCommission, name: e.target.value})}
                      placeholder="e.g., North America Standard"
                      data-testid="input-commission-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comm-region">Region</Label>
                    <Input
                      id="comm-region"
                      value={newCommission.region}
                      onChange={(e) => setNewCommission({...newCommission, region: e.target.value})}
                      placeholder="e.g., North America, Europe"
                      data-testid="input-commission-region"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comm-country">Country (Optional)</Label>
                    <Input
                      id="comm-country"
                      value={newCommission.country}
                      onChange={(e) => setNewCommission({...newCommission, country: e.target.value})}
                      placeholder="e.g., Canada, USA"
                      data-testid="input-commission-country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comm-state">State/Province (Optional)</Label>
                    <Input
                      id="comm-state"
                      value={newCommission.state}
                      onChange={(e) => setNewCommission({...newCommission, state: e.target.value})}
                      placeholder="e.g., Ontario, California"
                      data-testid="input-commission-state"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comm-rate">Commission Rate (%)</Label>
                    <Input
                      id="comm-rate"
                      type="number"
                      step="0.1"
                      value={newCommission.commissionRate}
                      onChange={(e) => setNewCommission({...newCommission, commissionRate: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 15.5"
                      data-testid="input-commission-rate"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comm-service-type">Service Type (Optional)</Label>
                    <Select value={newCommission.serviceType || "all"} onValueChange={(value) => setNewCommission({...newCommission, serviceType: value === "all" ? "" : value})}>
                      <SelectTrigger data-testid="select-commission-service-type">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="comm-description">Description</Label>
                    <Input
                      id="comm-description"
                      value={newCommission.description}
                      onChange={(e) => setNewCommission({...newCommission, description: e.target.value})}
                      placeholder="Description of this commission rule"
                      data-testid="input-commission-description"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    if (!newCommission.name || !newCommission.region || !newCommission.commissionRate) {
                      toast({
                        title: "Validation Error",
                        description: "Name, region, and commission rate are required.",
                        variant: "destructive",
                      });
                      return;
                    }
                    // Normalize empty strings to undefined for optional fields
                    const normalizedData = {
                      name: newCommission.name,
                      region: newCommission.region,
                      country: newCommission.country || undefined,
                      state: newCommission.state || undefined,
                      commissionRate: newCommission.commissionRate,
                      serviceType: newCommission.serviceType || undefined,
                      minAmount: newCommission.minAmount || undefined,
                      maxAmount: newCommission.maxAmount || undefined,
                      description: newCommission.description || undefined,
                      status: 'active' as const
                    };
                    createCommissionMutation.mutate(normalizedData);
                    setNewCommission({
                      name: "",
                      region: "",
                      country: "",
                      state: "",
                      commissionRate: 0,
                      serviceType: "",
                      minAmount: 0,
                      maxAmount: 0,
                      description: ""
                    });
                    toast({
                      title: "Success",
                      description: "Commission rule created successfully.",
                    });
                  }}
                  data-testid="button-add-commission"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Commission Rule
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Rate (%)</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingCommissions ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : commissionRules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500">No commission rules yet. Add your first rule above.</TableCell>
                    </TableRow>
                  ) : (
                    commissionRules.map((rule) => (
                      <TableRow key={rule.id}>
                        {editingCommission === rule.id.toString() ? (
                          <>
                            <TableCell>
                              <Input
                                value={editingCommissionValues.name || ''}
                                onChange={(e) => setEditingCommissionValues({...editingCommissionValues, name: e.target.value})}
                                data-testid={`input-edit-commission-name-${rule.id}`}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editingCommissionValues.region || ''}
                                onChange={(e) => setEditingCommissionValues({...editingCommissionValues, region: e.target.value})}
                                data-testid={`input-edit-commission-region-${rule.id}`}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editingCommissionValues.country || ''}
                                onChange={(e) => setEditingCommissionValues({...editingCommissionValues, country: e.target.value})}
                                data-testid={`input-edit-commission-country-${rule.id}`}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editingCommissionValues.state || ''}
                                onChange={(e) => setEditingCommissionValues({...editingCommissionValues, state: e.target.value})}
                                data-testid={`input-edit-commission-state-${rule.id}`}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.1"
                                value={editingCommissionValues.commissionRate || 0}
                                onChange={(e) => setEditingCommissionValues({...editingCommissionValues, commissionRate: parseFloat(e.target.value) || 0})}
                                data-testid={`input-edit-commission-rate-${rule.id}`}
                              />
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={editingCommissionValues.serviceType || 'all'} 
                                onValueChange={(value) => setEditingCommissionValues({...editingCommissionValues, serviceType: value === 'all' ? '' : value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All</SelectItem>
                                  {serviceTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={editingCommissionValues.status || 'active'} 
                                onValueChange={(value) => setEditingCommissionValues({...editingCommissionValues, status: value as 'active' | 'inactive'})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (!editingCommissionValues.name || !editingCommissionValues.region || !editingCommissionValues.commissionRate) {
                                      toast({
                                        title: "Validation Error",
                                        description: "Name, region, and commission rate are required.",
                                        variant: "destructive",
                                      });
                                      return;
                                    }
                                    // Normalize empty strings to undefined for optional fields
                                    const normalizedUpdates = {
                                      ...editingCommissionValues,
                                      country: editingCommissionValues.country || undefined,
                                      state: editingCommissionValues.state || undefined,
                                      serviceType: editingCommissionValues.serviceType || undefined,
                                      description: editingCommissionValues.description || undefined,
                                    };
                                    updateCommissionMutation.mutate({ id: rule.id, ...normalizedUpdates });
                                    setEditingCommission(null);
                                    setEditingCommissionValues({});
                                    toast({
                                      title: "Success",
                                      description: "Commission rule updated successfully.",
                                    });
                                  }}
                                  data-testid={`button-save-commission-${rule.id}`}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCommission(null);
                                    setEditingCommissionValues({});
                                  }}
                                  data-testid={`button-cancel-commission-${rule.id}`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell data-testid={`text-commission-name-${rule.id}`}>{rule.name}</TableCell>
                            <TableCell data-testid={`text-commission-region-${rule.id}`}>{rule.region}</TableCell>
                            <TableCell data-testid={`text-commission-country-${rule.id}`}>{rule.country || '-'}</TableCell>
                            <TableCell data-testid={`text-commission-state-${rule.id}`}>{rule.state || '-'}</TableCell>
                            <TableCell data-testid={`text-commission-rate-${rule.id}`}>{rule.commissionRate}%</TableCell>
                            <TableCell data-testid={`text-commission-service-type-${rule.id}`}>{rule.serviceType || 'All'}</TableCell>
                            <TableCell>
                              <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                                {rule.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCommission(rule.id.toString());
                                    setEditingCommissionValues(rule);
                                  }}
                                  data-testid={`button-edit-commission-${rule.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (window.confirm(`Delete commission rule "${rule.name}"?`)) {
                                      deleteCommissionMutation.mutate(rule.id);
                                      toast({
                                        title: "Success",
                                        description: "Commission rule deleted successfully.",
                                      });
                                    }
                                  }}
                                  data-testid={`button-delete-commission-${rule.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="price-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Change History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "2025-01-10", change: "Remote Support - Basic increased from $40 to $45", type: "increase" },
                  { date: "2025-01-09", change: "Phone Support - Expert decreased from $130 to $125", type: "decrease" },
                  { date: "2025-01-08", change: "On-Site Support - Enterprise increased from $200 to $250", type: "increase" },
                  { date: "2025-01-07", change: "Weekend multiplier updated from 1.2x to 1.3x", type: "update" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {item.type === "increase" && <TrendingUp className="h-5 w-5 text-green-600" />}
                    {item.type === "decrease" && <TrendingDown className="h-5 w-5 text-red-600" />}
                    {item.type === "update" && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.change}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PriceManagement;