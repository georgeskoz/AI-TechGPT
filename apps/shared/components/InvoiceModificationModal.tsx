import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Calculator, 
  Package, 
  Settings, 
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HardwareItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface AdditionalService {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  rate: number; // per hour
  total: number;
}

interface InvoiceModificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (modifications: {
    hardwareItems: HardwareItem[];
    additionalServices: AdditionalService[];
    totalAdjustment: number;
  }) => void;
  initialData: {
    jobId: string;
    customerName: string;
    originalTotal: number;
    existingHardware?: HardwareItem[];
    existingServices?: AdditionalService[];
  };
}

export default function InvoiceModificationModal({
  isOpen,
  onClose,
  onSave,
  initialData
}: InvoiceModificationModalProps) {
  const { toast } = useToast();
  
  const [hardwareItems, setHardwareItems] = useState<HardwareItem[]>(
    initialData.existingHardware || []
  );
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>(
    initialData.existingServices || []
  );
  
  // New item forms
  const [newHardware, setNewHardware] = useState({
    name: "",
    description: "",
    quantity: 1,
    unitPrice: 0
  });
  
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    duration: 30,
    rate: 75
  });
  
  const [activeTab, setActiveTab] = useState<'hardware' | 'services'>('hardware');

  // Calculate totals
  const hardwareTotal = hardwareItems.reduce((sum, item) => sum + item.total, 0);
  const servicesTotal = additionalServices.reduce((sum, service) => sum + service.total, 0);
  const subtotalAdditions = hardwareTotal + servicesTotal;
  const newSubtotal = initialData.originalTotal + subtotalAdditions;
  const gst = newSubtotal * 0.05; // 5% GST
  const tvq = newSubtotal * 0.09975; // 9.975% TVQ
  const newTotal = newSubtotal + gst + tvq;

  const addHardwareItem = () => {
    if (!newHardware.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a hardware item name",
        variant: "destructive"
      });
      return;
    }

    const total = newHardware.quantity * newHardware.unitPrice;
    const item: HardwareItem = {
      id: Date.now().toString(),
      name: newHardware.name,
      description: newHardware.description,
      quantity: newHardware.quantity,
      unitPrice: newHardware.unitPrice,
      total: total
    };

    setHardwareItems([...hardwareItems, item]);
    setNewHardware({
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0
    });

    toast({
      title: "Hardware Added",
      description: `${item.name} added to invoice`,
    });
  };

  const addService = () => {
    if (!newService.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a service name",
        variant: "destructive"
      });
      return;
    }

    const total = (newService.duration / 60) * newService.rate;
    const service: AdditionalService = {
      id: Date.now().toString(),
      name: newService.name,
      description: newService.description,
      duration: newService.duration,
      rate: newService.rate,
      total: total
    };

    setAdditionalServices([...additionalServices, service]);
    setNewService({
      name: "",
      description: "",
      duration: 30,
      rate: 75
    });

    toast({
      title: "Service Added",
      description: `${service.name} added to invoice`,
    });
  };

  const removeHardwareItem = (id: string) => {
    setHardwareItems(hardwareItems.filter(item => item.id !== id));
  };

  const removeService = (id: string) => {
    setAdditionalServices(additionalServices.filter(service => service.id !== id));
  };

  const handleSave = () => {
    const modifications = {
      hardwareItems,
      additionalServices,
      totalAdjustment: subtotalAdditions
    };

    onSave(modifications);
    toast({
      title: "Invoice Updated",
      description: `Invoice modifications saved. New total: $${newTotal.toFixed(2)} CAD`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Modify Invoice - Job {initialData.jobId}
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Add hardware items or additional services to {initialData.customerName}'s invoice
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Original Total</p>
                  <p className="text-xl font-bold">${initialData.originalTotal.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Additions</p>
                  <p className="text-xl font-bold text-blue-600">+${subtotalAdditions.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Taxes (GST + TVQ)</p>
                  <p className="text-xl font-bold text-orange-600">+${(gst + tvq).toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">New Total</p>
                  <p className="text-2xl font-bold text-green-600">${newTotal.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab('hardware')}
              className={`px-4 py-2 font-medium rounded-t-lg ${
                activeTab === 'hardware'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="h-4 w-4 inline mr-2" />
              Hardware & Parts ({hardwareItems.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 font-medium rounded-t-lg ${
                activeTab === 'services'
                  ? 'bg-green-100 text-green-700 border-b-2 border-green-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Additional Services ({additionalServices.length})
            </button>
          </div>

          {/* Hardware Tab */}
          {activeTab === 'hardware' && (
            <div className="space-y-4">
              {/* Add Hardware Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Hardware Item
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="hardware-name">Item Name *</Label>
                      <Input
                        id="hardware-name"
                        value={newHardware.name}
                        onChange={(e) => setNewHardware({...newHardware, name: e.target.value})}
                        placeholder="e.g., RAM Module, Power Supply"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hardware-quantity">Quantity</Label>
                      <Input
                        id="hardware-quantity"
                        type="number"
                        min="1"
                        value={newHardware.quantity}
                        onChange={(e) => setNewHardware({...newHardware, quantity: parseInt(e.target.value) || 1})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hardware-price">Unit Price ($)</Label>
                      <Input
                        id="hardware-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newHardware.unitPrice}
                        onChange={(e) => setNewHardware({...newHardware, unitPrice: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={addHardwareItem} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="hardware-description">Description</Label>
                    <Textarea
                      id="hardware-description"
                      value={newHardware.description}
                      onChange={(e) => setNewHardware({...newHardware, description: e.target.value})}
                      placeholder="Optional: Detailed description of the hardware item"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Hardware Items List */}
              {hardwareItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hardware Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {hardwareItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{item.name}</h4>
                              <Badge variant="outline">{item.quantity}x ${item.unitPrice.toFixed(2)}</Badge>
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg">${item.total.toFixed(2)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHardwareItem(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-right">
                      <p className="text-lg font-bold">
                        Hardware Total: ${hardwareTotal.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              {/* Add Service Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Additional Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="service-name">Service Name *</Label>
                      <Input
                        id="service-name"
                        value={newService.name}
                        onChange={(e) => setNewService({...newService, name: e.target.value})}
                        placeholder="e.g., Data Recovery, Software Installation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="service-duration">Duration (minutes)</Label>
                      <Input
                        id="service-duration"
                        type="number"
                        min="1"
                        value={newService.duration}
                        onChange={(e) => setNewService({...newService, duration: parseInt(e.target.value) || 30})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="service-rate">Rate ($/hour)</Label>
                      <Input
                        id="service-rate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newService.rate}
                        onChange={(e) => setNewService({...newService, rate: parseFloat(e.target.value) || 75})}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={addService} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="service-description">Description</Label>
                    <Textarea
                      id="service-description"
                      value={newService.description}
                      onChange={(e) => setNewService({...newService, description: e.target.value})}
                      placeholder="Optional: Detailed description of the additional service"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Services List */}
              {additionalServices.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {additionalServices.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{service.name}</h4>
                              <Badge variant="outline">
                                {Math.floor(service.duration / 60)}h {service.duration % 60}m @ ${service.rate}/hr
                              </Badge>
                            </div>
                            {service.description && (
                              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg">${service.total.toFixed(2)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeService(service.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-right">
                      <p className="text-lg font-bold">
                        Services Total: ${servicesTotal.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Tax Breakdown */}
          {(hardwareItems.length > 0 || additionalServices.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Updated Tax Calculation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Original Service Total:</span>
                    <span>${initialData.originalTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hardware Items:</span>
                    <span>${hardwareTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Services:</span>
                    <span>${servicesTotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Subtotal:</span>
                      <span>${newSubtotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (5%):</span>
                    <span>${gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TVQ (9.975%):</span>
                    <span>${tvq.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total with Taxes:</span>
                      <span>${newTotal.toFixed(2)} CAD</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle className="h-4 w-4" />
              Customer will be notified of invoice changes
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={hardwareItems.length === 0 && additionalServices.length === 0}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Invoice Modifications
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}