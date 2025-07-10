import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Monitor, 
  Wifi, 
  HardDrive, 
  Smartphone, 
  Shield, 
  Settings, 
  Globe,
  Wrench,
  AlertCircle,
  CheckCircle,
  Eye,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

interface DiagnosticTool {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  isActive: boolean;
  steps: DiagnosticStep[];
  createdAt: string;
  updatedAt: string;
}

interface DiagnosticStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

const diagnosticToolSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  icon: z.string().min(1, "Please select an icon"),
  isActive: z.boolean().default(true),
  steps: z.array(z.object({
    title: z.string().min(5, "Step title must be at least 5 characters"),
    description: z.string().min(10, "Step description must be at least 10 characters"),
    order: z.number().min(1, "Order must be at least 1"),
  })).min(1, "At least one step is required"),
});

type DiagnosticToolForm = z.infer<typeof diagnosticToolSchema>;

const iconOptions = [
  { value: "monitor", label: "Monitor", icon: Monitor },
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "hard-drive", label: "Hard Drive", icon: HardDrive },
  { value: "smartphone", label: "Smartphone", icon: Smartphone },
  { value: "shield", label: "Shield", icon: Shield },
  { value: "settings", label: "Settings", icon: Settings },
  { value: "globe", label: "Globe", icon: Globe },
  { value: "wrench", label: "Wrench", icon: Wrench },
];

const categoryOptions = [
  { value: "hardware", label: "Hardware Issues" },
  { value: "network", label: "Network Problems" },
  { value: "software", label: "Software Issues" },
  { value: "security", label: "Security Issues" },
  { value: "performance", label: "Performance Issues" },
  { value: "mobile", label: "Mobile Device Issues" },
  { value: "general", label: "General Troubleshooting" },
];

export default function DiagnosticToolsManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<DiagnosticTool | null>(null);
  const [steps, setSteps] = useState<DiagnosticStep[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<DiagnosticToolForm>({
    resolver: zodResolver(diagnosticToolSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      icon: "",
      isActive: true,
      steps: [],
    },
  });

  // Fetch diagnostic tools
  const { data: diagnosticTools = [], isLoading } = useQuery({
    queryKey: ['/api/admin/diagnostic-tools'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/diagnostic-tools');
      return response.json();
    },
  });

  // Add diagnostic tool mutation
  const addToolMutation = useMutation({
    mutationFn: async (toolData: DiagnosticToolForm) => {
      const response = await apiRequest('POST', '/api/admin/diagnostic-tools', toolData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/diagnostic-tools'] });
      toast({
        title: "Success",
        description: "Diagnostic tool added successfully",
      });
      setIsAddDialogOpen(false);
      form.reset();
      setSteps([]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add diagnostic tool",
        variant: "destructive",
      });
    },
  });

  // Update diagnostic tool mutation
  const updateToolMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: DiagnosticToolForm }) => {
      const response = await apiRequest('PUT', `/api/admin/diagnostic-tools/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/diagnostic-tools'] });
      toast({
        title: "Success",
        description: "Diagnostic tool updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedTool(null);
      form.reset();
      setSteps([]);
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
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/admin/diagnostic-tools/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/diagnostic-tools'] });
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

  // Toggle tool active status
  const toggleToolMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await apiRequest('PATCH', `/api/admin/diagnostic-tools/${id}/toggle`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/diagnostic-tools'] });
      toast({
        title: "Success",
        description: "Tool status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update tool status",
        variant: "destructive",
      });
    },
  });

  const addStep = () => {
    const newStep: DiagnosticStep = {
      id: Date.now().toString(),
      title: "",
      description: "",
      order: steps.length + 1,
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (index: number, field: keyof DiagnosticStep, value: string | number) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setSteps(updatedSteps);
  };

  const removeStep = (index: number) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
  };

  const handleSubmit = (data: DiagnosticToolForm) => {
    const toolData = {
      ...data,
      steps: steps.map((step, index) => ({
        ...step,
        order: index + 1,
      })),
    };

    if (selectedTool) {
      updateToolMutation.mutate({ id: selectedTool.id, data: toolData });
    } else {
      addToolMutation.mutate(toolData);
    }
  };

  const handleEdit = (tool: DiagnosticTool) => {
    setSelectedTool(tool);
    setSteps(tool.steps);
    form.reset({
      title: tool.title,
      description: tool.description,
      category: tool.category,
      icon: tool.icon,
      isActive: tool.isActive,
      steps: tool.steps,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this diagnostic tool?")) {
      deleteToolMutation.mutate(id);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Monitor;
  };

  const getCategoryLabel = (category: string) => {
    const categoryOption = categoryOptions.find(opt => opt.value === category);
    return categoryOption ? categoryOption.label : category;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quick Diagnostic Tools</h2>
          <p className="text-gray-600 mt-1">Manage diagnostic tools available to users</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Diagnostic Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Diagnostic Tool</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tool Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Computer Running Slow" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryOptions.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of what this tool helps with..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon.value} value={icon.value}>
                              <div className="flex items-center gap-2">
                                <icon.icon className="w-4 h-4" />
                                {icon.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel>Diagnostic Steps</FormLabel>
                    <Button type="button" onClick={addStep} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                  
                  {steps.map((step, index) => (
                    <div key={step.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Step {index + 1}</span>
                        <Button 
                          type="button" 
                          onClick={() => removeStep(index)}
                          variant="ghost" 
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <Input
                          placeholder="Step title"
                          value={step.title}
                          onChange={(e) => updateStep(index, 'title', e.target.value)}
                        />
                        <Textarea
                          placeholder="Step description"
                          value={step.description}
                          onChange={(e) => updateStep(index, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    type="submit" 
                    disabled={addToolMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {addToolMutation.isPending ? "Adding..." : "Add Tool"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Diagnostic Tools ({diagnosticTools.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diagnosticTools.map((tool: DiagnosticTool) => {
                const IconComponent = getIconComponent(tool.icon);
                return (
                  <TableRow key={tool.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">{tool.title}</div>
                          <div className="text-sm text-gray-500">{tool.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getCategoryLabel(tool.category)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{tool.steps.length} steps</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleToolMutation.mutate({ 
                            id: tool.id, 
                            isActive: !tool.isActive 
                          })}
                        >
                          {tool.isActive ? (
                            <ToggleRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                        <Badge variant={tool.isActive ? "default" : "secondary"}>
                          {tool.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(tool)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tool.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Diagnostic Tool</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tool Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Computer Running Slow" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief description of what this tool helps with..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              <icon.icon className="w-4 h-4" />
                              {icon.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel>Diagnostic Steps</FormLabel>
                  <Button type="button" onClick={addStep} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </div>
                
                {steps.map((step, index) => (
                  <div key={step.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Step {index + 1}</span>
                      <Button 
                        type="button" 
                        onClick={() => removeStep(index)}
                        variant="ghost" 
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <Input
                        placeholder="Step title"
                        value={step.title}
                        onChange={(e) => updateStep(index, 'title', e.target.value)}
                      />
                      <Textarea
                        placeholder="Step description"
                        value={step.description}
                        onChange={(e) => updateStep(index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={updateToolMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updateToolMutation.isPending ? "Updating..." : "Update Tool"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}