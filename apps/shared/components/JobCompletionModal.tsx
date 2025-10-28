import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Receipt, Star, X } from "lucide-react";
import ReceiptModal from "./ReceiptModal";

interface JobCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: {
    jobId: string;
    customerName: string;
    serviceProviderName: string;
    serviceType: 'onsite' | 'remote' | 'phone';
    category: string;
    description: string;
    duration: number;
    total: number;
    completedAt: string;
    hardwareItems?: Array<{
      name: string;
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
  };
}

export default function JobCompletionModal({ isOpen, onClose, jobData }: JobCompletionModalProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [rating, setRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Calculate Quebec taxes
  const calculateTaxes = (subtotal: number) => {
    const gst = subtotal * 0.05; // 5% GST
    const tvq = subtotal * 0.09975; // 9.975% TVQ
    const total = subtotal + gst + tvq;
    
    return {
      gst: Math.round(gst * 100) / 100,
      tvq: Math.round(tvq * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  };

  // Generate complete receipt data
  const generateReceiptData = () => {
    const serviceTotal = jobData.total;
    const hardwareTotal = jobData.hardwareItems?.reduce((sum, item) => sum + item.total, 0) || 0;
    const subtotal = serviceTotal + hardwareTotal;
    const taxes = calculateTaxes(subtotal);
    
    return {
      jobId: jobData.jobId,
      invoiceNumber: `INV-${Date.now()}-${jobData.jobId}`,
      serviceDate: new Date().toLocaleDateString('en-CA'),
      serviceTime: new Date().toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }),
      customerName: jobData.customerName,
      customerEmail: "customer@example.com", // In production, get from user profile
      customerPhone: "(514) 555-0123", // In production, get from user profile
      customerAddress: "123 Main St, Montreal, QC H3A 1B1", // In production, get from user profile
      serviceProviderName: jobData.serviceProviderName,
      serviceProviderId: `SP-${Math.floor(Math.random() * 10000)}`,
      serviceType: jobData.serviceType,
      serviceDetails: {
        category: jobData.category,
        description: jobData.description,
        duration: jobData.duration,
        hourlyRate: Math.round((serviceTotal / (jobData.duration / 60)) * 100) / 100,
        total: serviceTotal
      },
      hardwareItems: jobData.hardwareItems || [],
      subtotal: subtotal,
      gst: taxes.gst,
      tvq: taxes.tvq,
      total: taxes.total,
      paymentMethod: "Credit Card",
      paymentStatus: "paid" as const,
      completedAt: jobData.completedAt
    };
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmittingRating(true);
    try {
      // Simulate API call to submit rating
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Rating submitted: ${rating} stars for job ${jobData.jobId}`);
      
      // Show receipt after rating is submitted
      setShowReceipt(true);
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleViewReceipt = () => {
    setShowReceipt(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Service Completed Successfully!
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Service Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Service Details</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Job ID:</span> {jobData.jobId}</p>
                      <p><span className="font-medium">Category:</span> {jobData.category}</p>
                      <p><span className="font-medium">Service Type:</span> {jobData.serviceType}</p>
                      <p><span className="font-medium">Duration:</span> {Math.floor(jobData.duration / 60)}h {jobData.duration % 60}m</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Service Provider</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {jobData.serviceProviderName}</p>
                      <p><span className="font-medium">Completed:</span> {jobData.completedAt}</p>
                      <p><span className="font-medium">Total Cost:</span> <span className="font-bold text-green-600">${jobData.total.toFixed(2)}</span></p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{jobData.description}</p>
                </div>

                {/* Hardware Items */}
                {jobData.hardwareItems && jobData.hardwareItems.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Hardware & Parts Added</h4>
                    <div className="space-y-2">
                      {jobData.hardwareItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">${item.total.toFixed(2)}</p>
                            <p className="text-xs text-gray-600">{item.quantity}x ${item.unitPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rating Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Rate Your Experience</h3>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 rounded transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    >
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleRatingSubmit}
                    disabled={rating === 0 || isSubmittingRating}
                    className="flex-1"
                  >
                    {isSubmittingRating ? "Submitting..." : "Submit Rating"}
                  </Button>
                  <Button 
                    onClick={handleViewReceipt}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Receipt className="h-4 w-4" />
                    View Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Service Status */}
            <div className="text-center">
              <Badge className="bg-green-100 text-green-800">
                Service Completed
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                Your receipt will be sent automatically via email and text message.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <ReceiptModal 
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        jobData={generateReceiptData()}
      />
    </>
  );
}