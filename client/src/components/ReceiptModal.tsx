import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CustomerReceipt from "./CustomerReceipt";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: {
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
    serviceDetails: {
      category: string;
      description: string;
      duration: number;
      hourlyRate: number;
      total: number;
    };
    hardwareItems: Array<{
      name: string;
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    subtotal: number;
    gst: number;
    tvq: number;
    total: number;
    paymentMethod: string;
    paymentStatus: 'paid' | 'pending' | 'failed';
    completedAt: string;
  };
}

export default function ReceiptModal({ isOpen, onClose, jobData }: ReceiptModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendEmail = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/receipts/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: jobData.jobId,
          customerEmail: jobData.customerEmail,
          receiptData: jobData
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email receipt');
      }
      
    } catch (error) {
      console.error('Error sending email receipt:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendText = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/receipts/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: jobData.jobId,
          customerPhone: jobData.customerPhone,
          receiptData: jobData
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send text receipt');
      }
      
    } catch (error) {
      console.error('Error sending text receipt:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/receipts/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: jobData.jobId,
          receiptData: jobData
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF receipt');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TechGPT_Receipt_${jobData.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Error downloading PDF receipt:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              Service Receipt - Invoice #{jobData.invoiceNumber}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <CustomerReceipt
          {...jobData}
          onSendEmail={handleSendEmail}
          onSendText={handleSendText}
          onDownloadPDF={handleDownloadPDF}
        />
      </DialogContent>
    </Dialog>
  );
}