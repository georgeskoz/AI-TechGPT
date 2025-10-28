import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  DollarSign, 
  TrendingUp, 
  Award, 
  Edit, 
  Save, 
  X,
  Users,
  Calculator,
  Crown,
  ArrowLeft,
  Home
} from "lucide-react";
import { useLocation } from "wouter";

interface ServiceProviderEarning {
  id: number;
  serviceProviderId: number;
  serviceProviderName: string;
  remoteEarningPercentage: number;
  phoneEarningPercentage: number;
  onsiteEarningPercentage: number;
  performanceBonus: number;
  loyaltyBonus: number;
  premiumServiceRate: number;
  adminNotes?: string;
  effectiveDate: string;
  lastModifiedBy?: number;
  isActive: boolean;
  totalEarnings: number;
  completedJobs: number;
  rating: number;
}

interface EditingSettings {
  remoteEarningPercentage: string;
  phoneEarningPercentage: string;
  onsiteEarningPercentage: string;
  performanceBonus: string;
  loyaltyBonus: string;
  premiumServiceRate: string;
  adminNotes: string;
}

export default function AdminEarningSettings() {
  const [editingServiceProvider, setEditingServiceProvider] = useState<number | null>(null);
  const [editingSettings, setEditingSettings] = useState<EditingSettings>({
    remoteEarningPercentage: "85.00",
    phoneEarningPercentage: "85.00",
    onsiteEarningPercentage: "85.00",
    performanceBonus: "0.00",
    loyaltyBonus: "0.00",
    premiumServiceRate: "0.00",
    adminNotes: ""
  });
  const [bulkUpdatePercentage, setBulkUpdatePercentage] = useState("85.00");
  const [selectedServiceProviders, setSelectedServiceProviders] = useState<number[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: serviceProviderEarnings = [], isLoading } = useQuery({
    queryKey: ["/api/admin/technician-earnings"],
  });

  const updateEarningsMutation = useMutation({
    mutationFn: async ({ serviceProviderId, settings }: { serviceProviderId: number; settings: EditingSettings }) => {
      return await apiRequest("PUT", `/api/admin/technician-earnings/${serviceProviderId}`, {
        ...settings,
        remoteEarningPercentage: parseFloat(settings.remoteEarningPercentage),
        phoneEarningPercentage: parseFloat(settings.phoneEarningPercentage),
        onsiteEarningPercentage: parseFloat(settings.onsiteEarningPercentage),
        performanceBonus: parseFloat(settings.performanceBonus),
        loyaltyBonus: parseFloat(settings.loyaltyBonus),
        premiumServiceRate: parseFloat(settings.premiumServiceRate)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/technician-earnings"] });
      setEditingServiceProvider(null);
      toast({
        title: "Success",
        description: "Earning settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update earning settings",
        variant: "destructive",
      });
    }
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ serviceProviderIds, percentage }: { serviceProviderIds: number[]; percentage: number }) => {
      return await apiRequest("PUT", "/api/admin/technician-earnings/bulk", {
        technicianIds: serviceProviderIds,
        remoteEarningPercentage: percentage,
        phoneEarningPercentage: percentage,
        onsiteEarningPercentage: percentage
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/technician-earnings"] });
      setSelectedServiceProviders([]);
      toast({
        title: "Success",
        description: "Bulk earning settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bulk earning settings",
        variant: "destructive",
      });
    }
  });

  const startEditing = (serviceProvider: ServiceProviderEarning) => {
    setEditingServiceProvider(serviceProvider.serviceProviderId);
    setEditingSettings({
      remoteEarningPercentage: serviceProvider.remoteEarningPercentage.toString(),
      phoneEarningPercentage: serviceProvider.phoneEarningPercentage.toString(),
      onsiteEarningPercentage: serviceProvider.onsiteEarningPercentage.toString(),
      performanceBonus: serviceProvider.performanceBonus.toString(),
      loyaltyBonus: serviceProvider.loyaltyBonus.toString(),
      premiumServiceRate: serviceProvider.premiumServiceRate.toString(),
      adminNotes: serviceProvider.adminNotes || ""
    });
  };

  const saveSettings = () => {
    if (editingServiceProvider) {
      updateEarningsMutation.mutate({
        serviceProviderId: editingServiceProvider,
        settings: editingSettings
      });
    }
  };

  const cancelEditing = () => {
    setEditingServiceProvider(null);
    setEditingSettings({
      remoteEarningPercentage: "85.00",
      phoneEarningPercentage: "85.00",
      onsiteEarningPercentage: "85.00",
      performanceBonus: "0.00",
      loyaltyBonus: "0.00",
      premiumServiceRate: "0.00",
      adminNotes: ""
    });
  };

  const toggleServiceProviderSelection = (serviceProviderId: number) => {
    setSelectedServiceProviders(prev =>
      prev.includes(serviceProviderId)
        ? prev.filter(id => id !== serviceProviderId)
        : [...prev, serviceProviderId]
    );
  };

  const getEffectiveRate = (serviceProvider: ServiceProviderEarning, serviceType: 'remote' | 'phone' | 'onsite') => {
    const baseRate = {
      remote: serviceProvider.remoteEarningPercentage,
      phone: serviceProvider.phoneEarningPercentage,
      onsite: serviceProvider.onsiteEarningPercentage
    }[serviceType];
    
    return baseRate + serviceProvider.performanceBonus + serviceProvider.loyaltyBonus + serviceProvider.premiumServiceRate;
  };

  const getPerformanceLevel = (rating: number) => {
    if (rating >= 4.8) return { level: "Excellent", color: "bg-green-100 text-green-800" };
    if (rating >= 4.5) return { level: "Good", color: "bg-blue-100 text-blue-800" };
    if (rating >= 4.0) return { level: "Average", color: "bg-yellow-100 text-yellow-800" };
    return { level: "Needs Improvement", color: "bg-red-100 text-red-800" };
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLocation("/admin")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLocation("/")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setLocation("/admin")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
          Close
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Provider Earning Settings</h1>
        <p className="text-gray-600">Manage earning percentages and bonuses for each service provider</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Service Providers</p>
                <p className="text-2xl font-bold text-blue-600">{serviceProviderEarnings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Earning Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {(serviceProviderEarnings.reduce((sum, t) => sum + t.remoteEarningPercentage, 0) / serviceProviderEarnings.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Performers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {serviceProviderEarnings.filter(t => t.rating >= 4.8).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">With Bonuses</p>
                <p className="text-2xl font-bold text-orange-600">
                  {serviceProviderEarnings.filter(t => t.performanceBonus > 0 || t.loyaltyBonus > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual Settings</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        {/* Individual Settings */}
        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Individual Earning Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Provider</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Remote Rate</TableHead>
                      <TableHead>Phone Rate</TableHead>
                      <TableHead>On-site Rate</TableHead>
                      <TableHead>Bonuses</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceProviderEarnings.map((serviceProvider) => (
                      <TableRow key={serviceProvider.serviceProviderId}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{serviceProvider.serviceProviderName}</div>
                            <div className="text-sm text-gray-500">
                              ${serviceProvider.totalEarnings.toLocaleString()} • {serviceProvider.completedJobs} jobs
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={getPerformanceLevel(serviceProvider.rating).color}>
                              {getPerformanceLevel(serviceProvider.rating).level}
                            </Badge>
                            <div className="text-sm text-gray-500">★ {serviceProvider.rating}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {editingServiceProvider === serviceProvider.serviceProviderId ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editingSettings.remoteEarningPercentage}
                              onChange={(e) => setEditingSettings(prev => ({
                                ...prev,
                                remoteEarningPercentage: e.target.value
                              }))}
                              className="w-20"
                            />
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{getEffectiveRate(serviceProvider, 'remote').toFixed(1)}%</span>
                              {getEffectiveRate(serviceProvider, 'remote') > serviceProvider.remoteEarningPercentage && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingServiceProvider === serviceProvider.serviceProviderId ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editingSettings.phoneEarningPercentage}
                              onChange={(e) => setEditingSettings(prev => ({
                                ...prev,
                                phoneEarningPercentage: e.target.value
                              }))}
                              className="w-20"
                            />
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{getEffectiveRate(serviceProvider, 'phone').toFixed(1)}%</span>
                              {getEffectiveRate(serviceProvider, 'phone') > serviceProvider.phoneEarningPercentage && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingServiceProvider === serviceProvider.serviceProviderId ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editingSettings.onsiteEarningPercentage}
                              onChange={(e) => setEditingSettings(prev => ({
                                ...prev,
                                onsiteEarningPercentage: e.target.value
                              }))}
                              className="w-20"
                            />
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{getEffectiveRate(serviceProvider, 'onsite').toFixed(1)}%</span>
                              {getEffectiveRate(serviceProvider, 'onsite') > serviceProvider.onsiteEarningPercentage && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingServiceProvider === serviceProvider.serviceProviderId ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Perf:</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editingSettings.performanceBonus}
                                  onChange={(e) => setEditingSettings(prev => ({
                                    ...prev,
                                    performanceBonus: e.target.value
                                  }))}
                                  className="w-16 h-8"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Loyal:</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editingSettings.loyaltyBonus}
                                  onChange={(e) => setEditingSettings(prev => ({
                                    ...prev,
                                    loyaltyBonus: e.target.value
                                  }))}
                                  className="w-16 h-8"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm">
                              {serviceProvider.performanceBonus > 0 && (
                                <div className="text-green-600">+{serviceProvider.performanceBonus}% Performance</div>
                              )}
                              {serviceProvider.loyaltyBonus > 0 && (
                                <div className="text-blue-600">+{serviceProvider.loyaltyBonus}% Loyalty</div>
                              )}
                              {serviceProvider.premiumServiceRate > 0 && (
                                <div className="text-purple-600">+{serviceProvider.premiumServiceRate}% Premium</div>
                              )}
                              {serviceProvider.performanceBonus === 0 && serviceProvider.loyaltyBonus === 0 && serviceProvider.premiumServiceRate === 0 && (
                                <div className="text-gray-400">No bonuses</div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingServiceProvider === serviceProvider.serviceProviderId ? (
                            <div className="flex items-center gap-2">
                              <Button size="sm" onClick={saveSettings}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEditing}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => startEditing(serviceProvider)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Operations */}
        <TabsContent value="bulk">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Bulk Update Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Service Providers</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-2">
                    {serviceProviderEarnings.map((serviceProvider) => (
                      <div key={serviceProvider.serviceProviderId} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`sp-${serviceProvider.serviceProviderId}`}
                          checked={selectedServiceProviders.includes(serviceProvider.serviceProviderId)}
                          onChange={() => toggleServiceProviderSelection(serviceProvider.serviceProviderId)}
                        />
                        <label htmlFor={`sp-${serviceProvider.serviceProviderId}`} className="text-sm">
                          {serviceProvider.serviceProviderName} (★ {serviceProvider.rating})
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedServiceProviders.length} service provider(s) selected
                  </p>
                </div>

                <div>
                  <Label>New Earning Percentage</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      value={bulkUpdatePercentage}
                      onChange={(e) => setBulkUpdatePercentage(e.target.value)}
                      placeholder="85.00"
                    />
                    <span className="absolute right-3 top-3 text-gray-500">%</span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  disabled={selectedServiceProviders.length === 0}
                  onClick={() => bulkUpdateMutation.mutate({
                    serviceProviderIds: selectedServiceProviders,
                    percentage: parseFloat(bulkUpdatePercentage)
                  })}
                >
                  Update Selected Service Providers
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preset Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Standard Rate", percentage: "85.00", description: "Default earning rate" },
                  { name: "High Performer", percentage: "90.00", description: "For top-rated service providers" },
                  { name: "New Service Provider", percentage: "80.00", description: "For new service providers" },
                  { name: "Premium Partner", percentage: "95.00", description: "For exclusive partners" },
                ].map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-gray-500">{template.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{template.percentage}%</Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setBulkUpdatePercentage(template.percentage)}
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}