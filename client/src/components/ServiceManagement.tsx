import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  DollarSign, 
  Clock,
  Star,
  Grid,
  List,
  Settings,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Service {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  supportLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  basePrice: number;
  minimumTime: number;
  isActive: boolean;
  includes: string[];
  createdAt: string;
  updatedAt: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
  subcategories: string[];
}

const mockServices: Service[] = [
  {
    id: "1",
    name: "Basic Computer Setup",
    category: "Hardware Issues",
    subcategory: "Computer Setup",
    description: "Basic computer setup and configuration",
    supportLevel: "basic",
    basePrice: 45,
    minimumTime: 30,
    isActive: true,
    includes: ["Hardware connection", "Basic software installation", "Initial configuration"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Advanced Network Configuration",
    category: "Network Troubleshooting",
    subcategory: "Network Setup",
    description: "Complex network setup and security configuration",
    supportLevel: "advanced",
    basePrice: 85,
    minimumTime: 60,
    isActive: true,
    includes: ["Network architecture design", "Security configuration", "Performance optimization"],
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16"
  },
  {
    id: "3",
    name: "Web Development Consultation",
    category: "Web Development",
    subcategory: "Consultation",
    description: "Expert consultation for web development projects",
    supportLevel: "expert",
    basePrice: 120,
    minimumTime: 45,
    isActive: true,
    includes: ["Architecture review", "Technology recommendations", "Best practices guidance"],
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17"
  },
  {
    id: "4",
    name: "Mobile App Troubleshooting",
    category: "Mobile Devices",
    subcategory: "App Issues",
    description: "Troubleshooting mobile application problems",
    supportLevel: "intermediate",
    basePrice: 35,
    minimumTime: 25,
    isActive: false,
    includes: ["App diagnosis", "Configuration fixes", "Performance optimization"],
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18"
  }
];

const mockCategories: ServiceCategory[] = [
  {
    id: "1",
    name: "Web Development",
    description: "Web development and design services",
    icon: "🌐",
    isActive: true,
    sortOrder: 1,
    subcategories: ["Frontend Development", "Backend Development", "Full-Stack Development", "E-commerce", "CMS", "API Development", "Consultation"]
  },
  {
    id: "2",
    name: "Hardware Issues",
    description: "Computer and hardware troubleshooting",
    icon: "🖥️",
    isActive: true,
    sortOrder: 2,
    subcategories: ["Computer Setup", "Hardware Repair", "Upgrades", "Peripherals", "Gaming Systems", "Server Hardware", "Diagnostic"]
  },
  {
    id: "3",
    name: "Network Troubleshooting",
    description: "Network setup and troubleshooting services",
    icon: "🌐",
    isActive: true,
    sortOrder: 3,
    subcategories: ["Network Setup", "WiFi Issues", "Router Configuration", "VPN Setup", "Network Security", "Performance Issues", "Enterprise Networks"]
  },
  {
    id: "4",
    name: "Mobile Devices",
    description: "Mobile device support and troubleshooting",
    icon: "📱",
    isActive: true,
    sortOrder: 4,
    subcategories: ["Phone Setup", "App Issues", "Data Recovery", "Screen Repair", "Battery Issues", "Software Updates", "Sync Problems"]
  }
];

interface ServiceManagementProps {
  activeTab?: string;
}

export default function ServiceManagement({ activeTab: externalActiveTab }: ServiceManagementProps = {}) {
  const [internalActiveTab, setInternalActiveTab] = useState("services-list");
  const activeTab = externalActiveTab || internalActiveTab;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    description: "",
    supportLevel: "basic" as const,
    basePrice: 0,
    minimumTime: 30,
    includes: [""]
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    icon: "",
    subcategories: [""]
  });

  // Mock queries - in real app, these would fetch from API
  const { data: services = mockServices, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/admin/services"],
    queryFn: async () => {
      // Simulate API call
      return mockServices;
    }
  });

  const { data: categories = mockCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/admin/service-categories"],
    queryFn: async () => {
      // Simulate API call
      return mockCategories;
    }
  });

  const createServiceMutation = useMutation({
    mutationFn: async (service: Partial<Service>) => {
      // Simulate API call
      const newService = {
        ...service,
        id: Date.now().toString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return newService;
    },
    onSuccess: () => {
      toast({
        title: "Service Created",
        description: "New service has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      setShowAddDialog(false);
      resetServiceForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateServiceMutation = useMutation({
    mutationFn: async (service: Service) => {
      // Simulate API call
      return { ...service, updatedAt: new Date().toISOString() };
    },
    onSuccess: () => {
      toast({
        title: "Service Updated",
        description: "Service has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      setEditingService(null);
      resetServiceForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update service. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      // Simulate API call
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Service Deleted",
        description: "Service has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    }
  });

  const toggleServiceStatusMutation = useMutation({
    mutationFn: async ({ serviceId, isActive }: { serviceId: string; isActive: boolean }) => {
      // Simulate API call
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Service Status Updated",
        description: "Service status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update service status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const resetServiceForm = () => {
    setServiceForm({
      name: "",
      category: "",
      subcategory: "",
      description: "",
      supportLevel: "basic",
      basePrice: 0,
      minimumTime: 30,
      includes: [""]
    });
  };

  const handleAddIncludeItem = () => {
    setServiceForm(prev => ({
      ...prev,
      includes: [...prev.includes, ""]
    }));
  };

  const handleRemoveIncludeItem = (index: number) => {
    setServiceForm(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const handleIncludeChange = (index: number, value: string) => {
    setServiceForm(prev => ({
      ...prev,
      includes: prev.includes.map((item, i) => i === index ? value : item)
    }));
  };

  const handleSaveService = () => {
    if (!serviceForm.name || !serviceForm.category || !serviceForm.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const cleanIncludes = serviceForm.includes.filter(item => item.trim() !== "");
    
    if (editingService) {
      updateServiceMutation.mutate({
        ...editingService,
        ...serviceForm,
        includes: cleanIncludes
      });
    } else {
      createServiceMutation.mutate({
        ...serviceForm,
        includes: cleanIncludes
      });
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      category: service.category,
      subcategory: service.subcategory,
      description: service.description,
      supportLevel: service.supportLevel,
      basePrice: service.basePrice,
      minimumTime: service.minimumTime,
      includes: service.includes
    });
    setShowAddDialog(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteServiceMutation.mutate(serviceId);
    }
  };

  const handleToggleStatus = (serviceId: string, currentStatus: boolean) => {
    toggleServiceStatusMutation.mutate({
      serviceId,
      isActive: !currentStatus
    });
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || service.category === filterCategory;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && service.isActive) ||
                         (filterStatus === "inactive" && !service.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case "basic": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-blue-100 text-blue-800";
      case "advanced": return "bg-orange-100 text-orange-800";
      case "expert": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const ServicesList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Services Management</h2>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Support Level</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Min Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.subcategory}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSupportLevelColor(service.supportLevel)}>
                        {service.supportLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>${service.basePrice}</TableCell>
                    <TableCell>{service.minimumTime} min</TableCell>
                    <TableCell>
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditService(service)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(service.id, service.isActive)}>
                            {service.isActive ? <XCircle className="h-4 w-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                            {service.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Service Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {editingService ? "Update the service details below." : "Create a new service by filling in the details below."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter service name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={serviceForm.category} onValueChange={(value) => setServiceForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={serviceForm.subcategory}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, subcategory: e.target.value }))}
                  placeholder="Enter subcategory"
                />
              </div>
              <div>
                <Label htmlFor="supportLevel">Support Level</Label>
                <Select value={serviceForm.supportLevel} onValueChange={(value: any) => setServiceForm(prev => ({ ...prev, supportLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter service description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="basePrice">Base Price ($)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={serviceForm.basePrice}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="minimumTime">Minimum Time (minutes)</Label>
                <Input
                  id="minimumTime"
                  type="number"
                  value={serviceForm.minimumTime}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, minimumTime: Number(e.target.value) }))}
                  placeholder="30"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>What's Included</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddIncludeItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              {serviceForm.includes.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={item}
                    onChange={(e) => handleIncludeChange(index, e.target.value)}
                    placeholder="What's included in this service"
                  />
                  {serviceForm.includes.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveIncludeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setEditingService(null);
              resetServiceForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveService} disabled={createServiceMutation.isPending || updateServiceMutation.isPending}>
              {editingService ? "Update Service" : "Create Service"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const ServiceCategories = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Service Categories</h2>
        <Button onClick={() => setShowCategoryDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                <span>{category.name}</span>
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              <div className="space-y-2">
                <div className="text-sm font-medium">Subcategories:</div>
                <div className="flex flex-wrap gap-1">
                  {category.subcategories.map((sub, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {sub}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "services-list":
        return <ServicesList />;
      case "add-service":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Add New Service</CardTitle>
              <CardDescription>
                Create a new service by filling in the form below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Service
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case "service-categories":
        return <ServiceCategories />;
      case "service-settings":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Service Settings</CardTitle>
              <CardDescription>
                Configure global service settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  Service settings configuration coming soon...
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <ServicesList />;
    }
  };

  return (
    <div className="p-6">
      {externalActiveTab ? (
        // When controlled by external component, render content directly
        renderContent()
      ) : (
        // When used standalone, render with tabs
        <Tabs value={activeTab} onValueChange={setInternalActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services-list">Services List</TabsTrigger>
            <TabsTrigger value="add-service">Add Service</TabsTrigger>
            <TabsTrigger value="service-categories">Categories</TabsTrigger>
            <TabsTrigger value="service-settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services-list" className="mt-6">
            <ServicesList />
          </TabsContent>
          
          <TabsContent value="add-service" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Service</CardTitle>
                <CardDescription>
                  Create a new service by filling in the form below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="service-categories" className="mt-6">
            <ServiceCategories />
          </TabsContent>
          
          <TabsContent value="service-settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Settings</CardTitle>
                <CardDescription>
                  Configure global service settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    Service settings configuration coming soon...
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}