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
  Crown
} from "lucide-react";

interface TechnicianEarning {
  id: number;
  technicianId: number;
  technicianName: string;
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
  const [editingTechnician, setEditingTechnician] = useState<number | null>(null);
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
  const [selectedTechnicians, setSelectedTechnicians] = useState<number[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: technicianEarnings = [], isLoading } = useQuery({
    queryKey: ["/api/admin/technician-earnings"],
  });

  const updateEarningsMutation = useMutation({
    mutationFn: async ({ technicianId, settings }: { technicianId: number; settings: EditingSettings }) => {
      return await apiRequest("PUT", `/api/admin/technician-earnings/${technicianId}`, {
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
      setEditingTechnician(null);
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
    mutationFn: async ({ technicianIds, percentage }: { technicianIds: number[]; percentage: number }) => {
      return await apiRequest("PUT", "/api/admin/technician-earnings/bulk", {
        technicianIds,
        remoteEarningPercentage: percentage,
        phoneEarningPercentage: percentage,
        onsiteEarningPercentage: percentage
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/technician-earnings"] });
      setSelectedTechnicians([]);
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

  const startEditing = (technician: TechnicianEarning) => {
    setEditingTechnician(technician.technicianId);
    setEditingSettings({
      remoteEarningPercentage: technician.remoteEarningPercentage.toString(),
      phoneEarningPercentage: technician.phoneEarningPercentage.toString(),
      onsiteEarningPercentage: technician.onsiteEarningPercentage.toString(),
      performanceBonus: technician.performanceBonus.toString(),
      loyaltyBonus: technician.loyaltyBonus.toString(),
      premiumServiceRate: technician.premiumServiceRate.toString(),
      adminNotes: technician.adminNotes || ""
    });
  };

  const saveSettings = () => {
    if (editingTechnician) {
      updateEarningsMutation.mutate({
        technicianId: editingTechnician,
        settings: editingSettings
      });
    }
  };

  const cancelEditing = () => {
    setEditingTechnician(null);
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

  const toggleTechnicianSelection = (technicianId: number) => {
    setSelectedTechnicians(prev =>
      prev.includes(technicianId)
        ? prev.filter(id => id !== technicianId)
        : [...prev, technicianId]
    );
  };

  const getEffectiveRate = (technician: TechnicianEarning, serviceType: 'remote' | 'phone' | 'onsite') => {
    const baseRate = {
      remote: technician.remoteEarningPercentage,
      phone: technician.phoneEarningPercentage,
      onsite: technician.onsiteEarningPercentage
    }[serviceType];
    
    return baseRate + technician.performanceBonus + technician.loyaltyBonus + technician.premiumServiceRate;
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Technician Earning Settings</h1>
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
                <p className="text-sm text-gray-600">Total Technicians</p>
                <p className="text-2xl font-bold text-blue-600">{technicianEarnings.length}</p>
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
                  {(technicianEarnings.reduce((sum, t) => sum + t.remoteEarningPercentage, 0) / technicianEarnings.length).toFixed(1)}%
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
                  {technicianEarnings.filter(t => t.rating >= 4.8).length}
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
                  {technicianEarnings.filter(t => t.performanceBonus > 0 || t.loyaltyBonus > 0).length}
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
                      <TableHead>Technician</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Remote Rate</TableHead>
                      <TableHead>Phone Rate</TableHead>
                      <TableHead>On-site Rate</TableHead>
                      <TableHead>Bonuses</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {technicianEarnings.map((technician) => (
                      <TableRow key={technician.technicianId}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{technician.technicianName}</div>
                            <div className="text-sm text-gray-500">
                              ${technician.totalEarnings.toLocaleString()} • {technician.completedJobs} jobs
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={getPerformanceLevel(technician.rating).color}>
                              {getPerformanceLevel(technician.rating).level}
                            </Badge>
                            <div className="text-sm text-gray-500">★ {technician.rating}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {editingTechnician === technician.technicianId ? (
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
                              <span className="font-medium">{getEffectiveRate(technician, 'remote').toFixed(1)}%</span>
                              {getEffectiveRate(technician, 'remote') > technician.remoteEarningPercentage && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingTechnician === technician.technicianId ? (
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
                              <span className="font-medium">{getEffectiveRate(technician, 'phone').toFixed(1)}%</span>
                              {getEffectiveRate(technician, 'phone') > technician.phoneEarningPercentage && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingTechnician === technician.technicianId ? (
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
                              <span className="font-medium">{getEffectiveRate(technician, 'onsite').toFixed(1)}%</span>
                              {getEffectiveRate(technician, 'onsite') > technician.onsiteEarningPercentage && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingTechnician === technician.technicianId ? (
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
                              {technician.performanceBonus > 0 && (
                                <div className="text-green-600">+{technician.performanceBonus}% Performance</div>
                              )}
                              {technician.loyaltyBonus > 0 && (
                                <div className="text-blue-600">+{technician.loyaltyBonus}% Loyalty</div>
                              )}
                              {technician.premiumServiceRate > 0 && (
                                <div className="text-purple-600">+{technician.premiumServiceRate}% Premium</div>
                              )}
                              {technician.performanceBonus === 0 && technician.loyaltyBonus === 0 && technician.premiumServiceRate === 0 && (
                                <div className="text-gray-400">No bonuses</div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingTechnician === technician.technicianId ? (
                            <div className="flex items-center gap-2">
                              <Button size="sm" onClick={saveSettings}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEditing}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => startEditing(technician)}>
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
                  <Label>Select Technicians</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-2">
                    {technicianEarnings.map((technician) => (
                      <div key={technician.technicianId} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`tech-${technician.technicianId}`}
                          checked={selectedTechnicians.includes(technician.technicianId)}
                          onChange={() => toggleTechnicianSelection(technician.technicianId)}
                        />
                        <label htmlFor={`tech-${technician.technicianId}`} className="text-sm">
                          {technician.technicianName} (★ {technician.rating})
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedTechnicians.length} technician(s) selected
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
                  disabled={selectedTechnicians.length === 0}
                  onClick={() => bulkUpdateMutation.mutate({
                    technicianIds: selectedTechnicians,
                    percentage: parseFloat(bulkUpdatePercentage)
                  })}
                >
                  Update Selected Technicians
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
                  { name: "High Performer", percentage: "90.00", description: "For top-rated technicians" },
                  { name: "New Technician", percentage: "80.00", description: "For new service providers" },
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