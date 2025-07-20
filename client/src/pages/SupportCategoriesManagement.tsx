import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Wrench, 
  Phone, 
  Monitor, 
  Settings, 
  Users, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface SupportCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  basePrice: number;
  serviceType: 'remote' | 'phone' | 'onsite';
  estimatedDuration: number;
  skillsRequired: string[];
  isActive: boolean;
  isPublic: boolean;
  adminId: number;
  createdAt: string;
  updatedAt: string;
}

interface ServiceProviderService {
  id: number;
  serviceProviderId: number;
  categoryId: number;
  customPrice?: number;
  isActive: boolean;
  experienceLevel: string;
  providerName: string;
  categoryName: string;
}

const iconOptions = [
  { value: 'Wrench', label: 'Wrench', icon: Wrench },
  { value: 'Phone', label: 'Phone', icon: Phone },
  { value: 'Monitor', label: 'Monitor', icon: Monitor },
  { value: 'Settings', label: 'Settings', icon: Settings },
  { value: 'Users', label: 'Users', icon: Users }
];

export default function SupportCategoriesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState<SupportCategory | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch support categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/admin/support-categories'],
  });

  // Fetch service provider services
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/admin/service-provider-services'],
  });

  // Fetch availability stats
  const { data: availabilityStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/service-availability'],
  });

  const categories: SupportCategory[] = categoriesData?.categories || [];
  const services: ServiceProviderService[] = servicesData?.services || [];

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/admin/support-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/support-categories'] });
      setIsCreateDialogOpen(false);
      toast({ title: 'Success', description: 'Support category created successfully!' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create support category', variant: 'destructive' });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest(`/api/admin/support-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/support-categories'] });
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      toast({ title: 'Success', description: 'Support category updated successfully!' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update support category', variant: 'destructive' });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/support-categories/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/support-categories'] });
      toast({ title: 'Success', description: 'Support category deleted successfully!' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete support category', variant: 'destructive' });
    },
  });

  const handleCreateCategory = (formData: FormData) => {
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      icon: formData.get('icon'),
      basePrice: parseFloat(formData.get('basePrice') as string),
      serviceType: formData.get('serviceType'),
      estimatedDuration: parseInt(formData.get('estimatedDuration') as string),
      skillsRequired: (formData.get('skillsRequired') as string).split(',').map(s => s.trim()).filter(Boolean),
      isActive: formData.get('isActive') === 'on',
      isPublic: formData.get('isPublic') === 'on',
    };
    createCategoryMutation.mutate(data);
  };

  const handleUpdateCategory = (formData: FormData) => {
    if (!selectedCategory) return;
    
    const data = {
      id: selectedCategory.id,
      name: formData.get('name'),
      description: formData.get('description'),
      icon: formData.get('icon'),
      basePrice: parseFloat(formData.get('basePrice') as string),
      serviceType: formData.get('serviceType'),
      estimatedDuration: parseInt(formData.get('estimatedDuration') as string),
      skillsRequired: (formData.get('skillsRequired') as string).split(',').map(s => s.trim()).filter(Boolean),
      isActive: formData.get('isActive') === 'on',
      isPublic: formData.get('isPublic') === 'on',
    };
    updateCategoryMutation.mutate(data);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case 'remote': return Monitor;
      case 'phone': return Phone;
      case 'onsite': return Wrench;
      default: return Settings;
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'remote': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'onsite': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Support Categories Management</h2>
          <p className="text-gray-600 mt-1">Manage technical support services and track service provider availability</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <CreateCategoryDialog 
            onSubmit={handleCreateCategory} 
            isLoading={createCategoryMutation.isPending}
          />
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.filter(c => c.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-gray-900">
                  {services.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">No Providers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.filter(c => !services.some(s => s.categoryId === c.id && s.isActive)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="services">Provider Services</TabsTrigger>
          <TabsTrigger value="availability">Availability Report</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => {
              const ServiceTypeIcon = getServiceTypeIcon(category.serviceType);
              const IconComponent = iconOptions.find(opt => opt.value === category.icon)?.icon || Wrench;
              
              return (
                <Card key={category.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCategoryMutation.mutate(category.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{category.description}</p>
                    
                    <div className="flex items-center space-x-2">
                      <ServiceTypeIcon className="h-4 w-4" />
                      <Badge className={getServiceTypeColor(category.serviceType)}>
                        {category.serviceType}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3 text-green-500" />
                        <span>${category.basePrice}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-blue-500" />
                        <span>{category.estimatedDuration}min</span>
                      </div>
                    </div>
                    
                    {category.skillsRequired && category.skillsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {category.skillsRequired.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {category.skillsRequired.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.skillsRequired.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex space-x-2">
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant={category.isPublic ? "default" : "outline"}>
                          {category.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {services.filter(s => s.categoryId === category.id && s.isActive).length} providers
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <ServiceProviderServicesTab services={services} categories={categories} />
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <AvailabilityReportTab categories={categories} services={services} />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <EditCategoryDialog 
          category={selectedCategory}
          onSubmit={handleUpdateCategory} 
          isLoading={updateCategoryMutation.isPending}
        />
      </Dialog>
    </div>
  );
}

// Create Category Dialog Component
function CreateCategoryDialog({ onSubmit, isLoading }: { onSubmit: (data: FormData) => void; isLoading: boolean }) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Create Support Category</DialogTitle>
        <DialogDescription>
          Add a new technical support service category
        </DialogDescription>
      </DialogHeader>
      
      <form action={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Category Name *</Label>
          <Input id="name" name="name" placeholder="e.g., Network Configuration" required />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="Brief description of the service..." />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="icon">Icon</Label>
            <Select name="icon" defaultValue="Wrench">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <option.icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="serviceType">Service Type *</Label>
            <Select name="serviceType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="basePrice">Base Price ($) *</Label>
            <Input id="basePrice" name="basePrice" type="number" step="0.01" placeholder="50.00" required />
          </div>
          
          <div>
            <Label htmlFor="estimatedDuration">Duration (min) *</Label>
            <Input id="estimatedDuration" name="estimatedDuration" type="number" placeholder="60" required />
          </div>
        </div>
        
        <div>
          <Label htmlFor="skillsRequired">Required Skills (comma-separated)</Label>
          <Input id="skillsRequired" name="skillsRequired" placeholder="networking, troubleshooting, cisco" />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch id="isActive" name="isActive" defaultChecked />
            <Label htmlFor="isActive">Active</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="isPublic" name="isPublic" defaultChecked />
            <Label htmlFor="isPublic">Public</Label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Category'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

// Edit Category Dialog Component  
function EditCategoryDialog({ category, onSubmit, isLoading }: { 
  category: SupportCategory | null; 
  onSubmit: (data: FormData) => void; 
  isLoading: boolean 
}) {
  if (!category) return null;
  
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Support Category</DialogTitle>
        <DialogDescription>
          Update the technical support service category
        </DialogDescription>
      </DialogHeader>
      
      <form action={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Category Name *</Label>
          <Input id="name" name="name" defaultValue={category.name} required />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={category.description} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="icon">Icon</Label>
            <Select name="icon" defaultValue={category.icon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <option.icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="serviceType">Service Type *</Label>
            <Select name="serviceType" defaultValue={category.serviceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="basePrice">Base Price ($) *</Label>
            <Input id="basePrice" name="basePrice" type="number" step="0.01" defaultValue={category.basePrice} required />
          </div>
          
          <div>
            <Label htmlFor="estimatedDuration">Duration (min) *</Label>
            <Input id="estimatedDuration" name="estimatedDuration" type="number" defaultValue={category.estimatedDuration} required />
          </div>
        </div>
        
        <div>
          <Label htmlFor="skillsRequired">Required Skills (comma-separated)</Label>
          <Input 
            id="skillsRequired" 
            name="skillsRequired" 
            defaultValue={category.skillsRequired?.join(', ')} 
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch id="isActive" name="isActive" defaultChecked={category.isActive} />
            <Label htmlFor="isActive">Active</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="isPublic" name="isPublic" defaultChecked={category.isPublic} />
            <Label htmlFor="isPublic">Public</Label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Category'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

// Service Provider Services Tab
function ServiceProviderServicesTab({ services, categories }: {
  services: ServiceProviderService[];
  categories: SupportCategory[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Provider Activations</CardTitle>
        <CardDescription>View which services are activated by service providers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Services</h3>
              <p className="text-gray-600">Service providers haven't activated any services yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {services.map((service) => {
                const category = categories.find(c => c.id === service.categoryId);
                return (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-semibold">{service.providerName}</h4>
                        <p className="text-sm text-gray-600">{category?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge>{service.experienceLevel}</Badge>
                      {service.customPrice && (
                        <span className="text-sm font-medium">${service.customPrice}</span>
                      )}
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Availability Report Tab
function AvailabilityReportTab({ categories, services }: {
  categories: SupportCategory[];
  services: ServiceProviderService[];
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Service Availability Report</CardTitle>
          <CardDescription>See which services have available providers and potential fallback scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const activeProviders = services.filter(s => 
                s.categoryId === category.id && s.isActive
              );
              const hasProviders = activeProviders.length > 0;
              
              return (
                <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${hasProviders ? 'bg-green-100' : 'bg-orange-100'}`}>
                      {hasProviders ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.serviceType} • ${category.basePrice}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold">{activeProviders.length} providers</p>
                      <p className="text-sm text-gray-600">
                        {hasProviders ? 'Available' : 'AI Chat Fallback'}
                      </p>
                    </div>
                    
                    <Badge 
                      variant={hasProviders ? "default" : "secondary"}
                      className={hasProviders ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                    >
                      {hasProviders ? 'Ready' : 'Fallback'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
          
          {categories.filter(c => !services.some(s => s.categoryId === c.id && s.isActive)).length > 0 && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-orange-900">AI Chat Fallback Active</h4>
              </div>
              <p className="text-orange-800 text-sm">
                For categories without available service providers, customers will be notified that the service 
                is available through AI chat support while we work to connect them with qualified technicians.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}