import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Phone, 
  Navigation,
  Receipt,
  Plus
} from "lucide-react";
import InvoiceModificationModal from "./InvoiceModificationModal";
import { useToast } from "@/hooks/use-toast";

interface ServiceProviderJobActionsProps {
  job: {
    id: string;
    customerId: number;
    customerName: string;
    customerPhone: string;
    category: string;
    description: string;
    serviceType: 'onsite' | 'remote' | 'phone';
    status: 'assigned' | 'in_progress' | 'completed';
    startTime?: string;
    estimatedDuration: number;
    baseRate: number;
    currentTotal: number;
    customerAddress?: string;
    hardwareItems?: Array<{
      id: string;
      name: string;
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    additionalServices?: Array<{
      id: string;
      name: string;
      description: string;
      duration: number;
      rate: number;
      total: number;
    }>;
  };
  onStatusUpdate: (jobId: string, status: string, modifications?: any) => void;
}

export default function ServiceProviderJobActions({ 
  job, 
  onStatusUpdate 
}: ServiceProviderJobActionsProps) {
  const { toast } = useToast();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStartJob = async () => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onStatusUpdate(job.id, 'in_progress');
      
      toast({
        title: "Job Started",
        description: `Job ${job.id} has been started. Timer is now running.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteJob = () => {
    // Open invoice modification modal before completion
    setShowInvoiceModal(true);
  };

  const handleInvoiceModification = (modifications: any) => {
    setShowInvoiceModal(false);
    
    // Update job with modifications and mark as completed
    onStatusUpdate(job.id, 'completed', modifications);
    
    toast({
      title: "Job Completed",
      description: `Job ${job.id} has been completed. Invoice has been sent to customer.`,
    });
  };

  const handleNavigate = () => {
    if (job.customerAddress) {
      const encodedAddress = encodeURIComponent(job.customerAddress);
      const geoUrl = `geo:0,0?q=${encodedAddress}`;
      window.open(geoUrl, '_blank');
    }
  };

  const handleContactCustomer = () => {
    if (job.customerPhone) {
      window.open(`tel:${job.customerPhone}`, '_self');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Job {job.id}</span>
            <Badge className={getStatusColor(job.status)}>
              {getStatusIcon(job.status)}
              <span className="ml-2 capitalize">{job.status.replace('_', ' ')}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {job.customerName}</p>
                <p><span className="font-medium">Phone:</span> {job.customerPhone}</p>
                <p><span className="font-medium">Service Type:</span> {job.serviceType}</p>
                {job.customerAddress && (
                  <p><span className="font-medium">Address:</span> {job.customerAddress}</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Job Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Category:</span> {job.category}</p>
                <p><span className="font-medium">Duration:</span> {Math.floor(job.estimatedDuration / 60)}h {job.estimatedDuration % 60}m</p>
                <p><span className="font-medium">Base Rate:</span> ${job.baseRate}/hr</p>
                <p><span className="font-medium">Current Total:</span> <span className="font-bold text-green-600">${job.currentTotal.toFixed(2)}</span></p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-600">{job.description}</p>
          </div>

          {/* Current Additions */}
          {((job.hardwareItems && job.hardwareItems.length > 0) || (job.additionalServices && job.additionalServices.length > 0)) && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Current Invoice Additions</h4>
              
              {job.hardwareItems && job.hardwareItems.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Hardware Items:</p>
                  <div className="space-y-1">
                    {job.hardwareItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} ({item.quantity}x)</span>
                        <span>${item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {job.additionalServices && job.additionalServices.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Additional Services:</p>
                  <div className="space-y-1">
                    {job.additionalServices.map((service, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{service.name} ({Math.floor(service.duration / 60)}h {service.duration % 60}m)</span>
                        <span>${service.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {job.status === 'assigned' && (
              <Button 
                onClick={handleStartJob}
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {isUpdating ? 'Starting...' : 'Start Job'}
              </Button>
            )}

            {job.status === 'in_progress' && (
              <>
                <Button 
                  onClick={() => setShowInvoiceModal(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Items/Services
                </Button>
                
                <Button 
                  onClick={handleCompleteJob}
                  className="flex items-center gap-2"
                >
                  <Receipt className="h-4 w-4" />
                  Complete & Invoice
                </Button>
              </>
            )}

            {/* Communication & Navigation */}
            <Button 
              onClick={handleContactCustomer}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Call Customer
            </Button>

            {job.serviceType === 'onsite' && job.customerAddress && (
              <Button 
                onClick={handleNavigate}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                Navigate
              </Button>
            )}

            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Message Customer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Modification Modal */}
      <InvoiceModificationModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onSave={handleInvoiceModification}
        initialData={{
          jobId: job.id,
          customerName: job.customerName,
          originalTotal: job.currentTotal,
          existingHardware: job.hardwareItems,
          existingServices: job.additionalServices
        }}
      />
    </>
  );
}