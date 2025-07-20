import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  Settings,
  Copy,
  Download,
  Eye,
  Zap,
  Activity,
  Wifi,
  Monitor,
  Database,
  Shield,
  Globe,
  Wrench,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3
} from 'lucide-react';

interface DiagnosticTool {
  id: number;
  name: string;
  description: string;
  category: string;
  type: 'network' | 'system' | 'browser' | 'hardware' | 'security' | 'database';
  script: string;
  parameters: any[];
  isActive: boolean;
  estimatedDuration: number; // in seconds
  successRate: number;
  usageCount: number;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

const DiagnosticToolsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<DiagnosticTool | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch diagnostic tools
  const { data: diagnosticTools = [], isLoading } = useQuery({
    queryKey: ['/api/admin/diagnostic-tools'],
    retry: false,
  });

  // Fetch diagnostic analytics
  const { data: analytics } = useQuery({
    queryKey: ['/api/admin/diagnostic-analytics'],
    retry: false,
  });

  // Create diagnostic tool mutation
  const createToolMutation = useMutation({
    mutationFn: (toolData: Partial<DiagnosticTool>) => 
      apiRequest('/api/admin/diagnostic-tools', {
        method: 'POST',
        body: JSON.stringify(toolData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/diagnostic-tools'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/diagnostic-analytics'] });
      toast({
        title: "Success",
        description: "Diagnostic tool created successfully",
      });
      setIsAddModalOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create diagnostic tool",
        variant: "destructive",
      });
    },
  });

  // Update diagnostic tool mutation
  const updateToolMutation = useMutation({
    mutationFn: ({ id, ...toolData }: Partial<DiagnosticTool> & { id: number }) => 
      apiRequest(`/api/admin/diagnostic-tools/${id}`, {
        method: 'PUT',
        body: JSON.stringify(toolData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/diagnostic-tools'] });
      toast({
        title: "Success",
        description: "Diagnostic tool updated successfully",
      });
      setIsEditModalOpen(false);
      setSelectedTool(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update diagnostic tool",
        variant: "destructive",
      });
    },
  });

  // Delete diagnostic tool mutation
  const deleteToolMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/admin/diagnostic-tools/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/diagnostic-tools'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/diagnostic-analytics'] });
      toast({
        title: "Success",
        description: "Diagnostic tool deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete diagnostic tool",
        variant: "destructive",
      });
    },
  });

  const filteredTools = diagnosticTools.filter((tool: DiagnosticTool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || tool.category === filterCategory;
    const matchesType = filterType === 'all' || tool.type === filterType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      network: Wifi,
      system: Monitor,
      browser: Globe,
      hardware: Wrench,
      security: Shield,
      database: Database
    };
    const IconComponent = icons[type as keyof typeof icons] || Activity;
    return <IconComponent className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      network: 'bg-blue-100 text-blue-800',
      system: 'bg-green-100 text-green-800',
      browser: 'bg-purple-100 text-purple-800',
      hardware: 'bg-orange-100 text-orange-800',
      security: 'bg-red-100 text-red-800',
      database: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const DiagnosticToolForm = ({ tool, onSubmit, isEdit = false }: {
    tool?: DiagnosticTool;
    onSubmit: (data: any) => void;
    isEdit?: boolean;
  }) => {
    const [formData, setFormData] = useState({
      name: tool?.name || '',
      description: tool?.description || '',
      category: tool?.category || '',
      type: tool?.type || 'system',
      script: tool?.script || '',
      estimatedDuration: tool?.estimatedDuration || 30,
      isActive: tool?.isActive ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Tool Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Network Connectivity Test"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Connectivity"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Tests network connectivity and identifies connection issues"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Tool Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="network">Network</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="browser">Browser</SelectItem>
                <SelectItem value="hardware">Hardware</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="database">Database</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="duration">Estimated Duration (seconds)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
              min="1"
              max="300"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="script">Diagnostic Script</Label>
          <Textarea
            id="script"
            value={formData.script}
            onChange={(e) => setFormData(prev => ({ ...prev, script: e.target.value }))}
            placeholder="// JavaScript diagnostic script
function runNetworkTest() {
  // Test network connectivity
  // Return diagnostic results
}"
            rows={8}
            className="font-mono text-sm"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
          />
          <Label htmlFor="isActive">Active Tool</Label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => isEdit ? setIsEditModalOpen(false) : setIsAddModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={createToolMutation.isPending || updateToolMutation.isPending}>
            {isEdit ? 'Update Tool' : 'Create Tool'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Quick Diagnostic Tools</h2>
          <p className="text-gray-600">Manage diagnostic tools for automated technical troubleshooting</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Diagnostic Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Diagnostic Tool</DialogTitle>
              <DialogDescription>
                Create a new diagnostic tool that users and technicians can run to troubleshoot issues.
              </DialogDescription>
            </DialogHeader>
            <DiagnosticToolForm
              onSubmit={(data) => createToolMutation.mutate(data)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diagnosticTools.length}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3 this month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {diagnosticTools.filter((tool: DiagnosticTool) => tool.isActive).length}
            </div>
            <div className="text-xs text-gray-600">
              {Math.round((diagnosticTools.filter((tool: DiagnosticTool) => tool.isActive).length / diagnosticTools.length) * 100)}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalUsage || '2.4k'}</div>
            <div className="flex items-center text-xs text-blue-600">
              <Users className="h-3 w-3 mr-1" />
              This month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.averageSuccessRate || '94.2'}%</div>
            <div className="flex items-center text-xs text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Above target
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Tools List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Diagnostic Tools</CardTitle>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Category Filter */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Connectivity">Connectivity</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="browser">Browser</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTools.map((tool: DiagnosticTool) => (
                <div key={tool.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(tool.type)}`}>
                        {getTypeIcon(tool.type)}
                        <span className="capitalize">{tool.type}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-lg">{tool.name}</h3>
                          <Badge variant={tool.isActive ? "default" : "secondary"}>
                            {tool.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{tool.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            ~{tool.estimatedDuration}s
                          </span>
                          <span className="flex items-center">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            {tool.successRate}% success
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Used {tool.usageCount} times
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            setSelectedTool(tool);
                            setIsEditModalOpen(true);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => deleteToolMutation.mutate(tool.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTools.length === 0 && (
                <div className="text-center py-12">
                  <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No diagnostic tools found</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first diagnostic tool.</p>
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Diagnostic Tool
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Diagnostic Tool</DialogTitle>
            <DialogDescription>
              Update the diagnostic tool configuration and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedTool && (
            <DiagnosticToolForm
              tool={selectedTool}
              onSubmit={(data) => updateToolMutation.mutate({ ...data, id: selectedTool.id })}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiagnosticToolsManagement;