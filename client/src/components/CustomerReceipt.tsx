import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Mail, 
  MessageSquare, 
  Calendar,
  Clock,
  User,
  Wrench,
  CreditCard,
  MapPin,
  Phone,
  Receipt as ReceiptIcon
} from "lucide-react";

interface HardwareItem {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ServiceDetails {
  category: string;
  description: string;
  duration: number; // in minutes
  hourlyRate: number;
  total: number;
}

interface CustomerReceiptProps {
  jobId: string;
  invoiceNumber: string;
  serviceDate: string;
  serviceTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  serviceProviderName: string;
  serviceProviderId: string;
  serviceType: 'onsite' | 'remote' | 'phone';
  serviceDetails: ServiceDetails;
  hardwareItems: HardwareItem[];
  subtotal: number;
  gst: number; // 5% GST/TPS
  tvq: number; // 9.975% TVQ for Quebec
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  completedAt: string;
  onSendEmail?: () => void;
  onSendText?: () => void;
  onDownloadPDF?: () => void;
}

export default function CustomerReceipt({
  jobId,
  invoiceNumber,
  serviceDate,
  serviceTime,
  customerName,
  customerEmail,
  customerPhone,
  customerAddress,
  serviceProviderName,
  serviceProviderId,
  serviceType,
  serviceDetails,
  hardwareItems,
  subtotal,
  gst,
  tvq,
  total,
  paymentMethod,
  paymentStatus,
  completedAt,
  onSendEmail,
  onSendText,
  onDownloadPDF
}: CustomerReceiptProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      if (onSendEmail) {
        await onSendEmail();
      }
      toast({
        title: "Receipt Sent",
        description: `Receipt emailed to ${customerEmail}`,
      });
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to send receipt email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendText = async () => {
    setIsLoading(true);
    try {
      if (onSendText) {
        await onSendText();
      }
      toast({
        title: "Receipt Sent",
        description: `Receipt sent via text to ${customerPhone}`,
      });
    } catch (error) {
      toast({
        title: "Text Failed",
        description: "Failed to send receipt via text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    try {
      if (onDownloadPDF) {
        await onDownloadPDF();
      }
      toast({
        title: "Receipt Downloaded",
        description: "Receipt PDF has been downloaded to your device.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download receipt PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'onsite': return 'On-Site Service';
      case 'remote': return 'Remote Support';
      case 'phone': return 'Phone Support';
      default: return 'Technical Support';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center border-b">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-2 bg-blue-600 rounded-lg">
            <ReceiptIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              TechersGPT Service Receipt
            </CardTitle>
            <p className="text-sm text-gray-600">Professional Technical Support Services</p>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mt-4">
          <Button 
            onClick={handleSendEmail} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Email Receipt
          </Button>
          <Button 
            onClick={handleSendText} 
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Text Receipt
          </Button>
          <Button 
            onClick={handleDownloadPDF} 
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Receipt Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Invoice Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Invoice Number:</span> {invoiceNumber}</p>
              <p><span className="font-medium">Job ID:</span> {jobId}</p>
              <p><span className="font-medium">Service Date:</span> {serviceDate}</p>
              <p><span className="font-medium">Service Time:</span> {serviceTime}</p>
              <p><span className="font-medium">Completed:</span> {completedAt}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Payment Method:</span> {paymentMethod}</p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge className={getPaymentStatusColor(paymentStatus)}>
                  {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                </Badge>
              </p>
              <p><span className="font-medium">Total Amount:</span> <span className="font-bold text-green-600">${total.toFixed(2)} CAD</span></p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {customerName}</p>
              <p><span className="font-medium">Email:</span> {customerEmail}</p>
              <p><span className="font-medium">Phone:</span> {customerPhone}</p>
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                <span>{customerAddress}</span>
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Service Provider
            </h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {serviceProviderName}</p>
              <p><span className="font-medium">Provider ID:</span> {serviceProviderId}</p>
              <p><span className="font-medium">Service Type:</span> {getServiceTypeLabel(serviceType)}</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Service Details */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Service Details
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Category</p>
                <p>{serviceDetails.category}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Duration</p>
                <p>{Math.floor(serviceDetails.duration / 60)}h {serviceDetails.duration % 60}m</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Rate</p>
                <p>${serviceDetails.hourlyRate.toFixed(2)}/hour</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Service Cost</p>
                <p className="font-bold">${serviceDetails.total.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium text-gray-700">Description</p>
              <p className="mt-1">{serviceDetails.description}</p>
            </div>
          </div>
        </div>

        {/* Hardware Items */}
        {hardwareItems.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Hardware & Parts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Item</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Description</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">Unit Price</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {hardwareItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2 font-medium">{item.name}</td>
                      <td className="px-4 py-2 text-gray-600">{item.description}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right font-medium">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Separator className="my-6" />

        {/* Billing Summary */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Service Cost:</span>
              <span>${serviceDetails.total.toFixed(2)}</span>
            </div>
            {hardwareItems.length > 0 && (
              <div className="flex justify-between">
                <span>Hardware & Parts:</span>
                <span>${hardwareItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>GST (5%):</span>
              <span>${gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>TVQ (9.975%):</span>
              <span>${tvq.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold text-lg">
              <span>Total Amount:</span>
              <span className="text-green-600">${total.toFixed(2)} CAD</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Thank you for choosing TechersGPT Technical Support Services</p>
          <p className="mt-2">For support or questions, contact us at support@techgpt.com</p>
          <p className="mt-1">© {new Date().getFullYear()} TechersGPT. All rights reserved.</p>
        </div>
      </CardContent>
    </Card>
  );
}