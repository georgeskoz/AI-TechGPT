import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Edit, Trash2, Save, Plus, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface PriceRule {
  id: string;
  name: string;
  serviceType: string;
  category: string;
  basePrice: number;
  multiplier: number;
  conditions: string[];
  status: 'active' | 'inactive';
  lastModified: string;
}

const PriceManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("current-prices");
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [newRule, setNewRule] = useState({
    name: "",
    serviceType: "",
    category: "",
    basePrice: 0,
    multiplier: 1.0,
    conditions: []
  });

  const [priceRules] = useState<PriceRule[]>([
    {
      id: "1",
      name: "Remote Support - Basic",
      serviceType: "remote",
      category: "Basic Support",
      basePrice: 45,
      multiplier: 1.0,
      conditions: ["weekday", "business_hours"],
      status: "active",
      lastModified: "2025-01-10"
    },
    {
      id: "2",
      name: "Phone Support - Advanced",
      serviceType: "phone",
      category: "Advanced Support",
      basePrice: 95,
      multiplier: 1.2,
      conditions: ["urgent", "specialist_required"],
      status: "active",
      lastModified: "2025-01-09"
    },
    {
      id: "3",
      name: "On-Site Support - Enterprise",
      serviceType: "onsite",
      category: "Enterprise Support",
      basePrice: 150,
      multiplier: 1.5,
      conditions: ["weekend", "emergency"],
      status: "active",
      lastModified: "2025-01-08"
    }
  ]);

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

  const handleSaveRule = () => {
    toast({
      title: "Price Rule Saved",
      description: "The pricing rule has been updated successfully.",
    });
    setEditingRule(null);
  };

  const handleAddRule = () => {
    if (!newRule.name || !newRule.serviceType || !newRule.category || newRule.basePrice <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

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
  };

  const handleDeleteRule = (id: string) => {
    toast({
      title: "Price Rule Deleted",
      description: "The pricing rule has been removed.",
      variant: "destructive",
    });
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current-prices">Current Prices</TabsTrigger>
          <TabsTrigger value="pricing-rules">Pricing Rules</TabsTrigger>
          <TabsTrigger value="add-rule">Add New Rule</TabsTrigger>
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
              <CardTitle>Active Pricing Rules</CardTitle>
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
                  {priceRules.map((rule) => (
                    <TableRow key={rule.id}>
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
                            onClick={() => setEditingRule(rule.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRule(rule.id)}
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