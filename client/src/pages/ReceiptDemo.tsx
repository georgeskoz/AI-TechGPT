import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, Plus, CheckCircle } from "lucide-react";
import JobCompletionModal from "@/components/JobCompletionModal";
import CustomerReceipt from "@/components/CustomerReceipt";

export default function ReceiptDemo() {
  const [showJobCompletion, setShowJobCompletion] = useState(false);
  const [showDirectReceipt, setShowDirectReceipt] = useState(false);

  // Sample job data with hardware items
  const sampleJobData = {
    jobId: "JOB-2025-0001",
    customerName: "Jean Dupont",
    serviceProviderName: "Marie-Claude Tremblay",
    serviceType: "onsite" as const,
    category: "Hardware Issues",
    description: "Computer not starting, replaced power supply and added RAM upgrade",
    duration: 120, // 2 hours
    total: 150.00,
    completedAt: new Date().toLocaleString('en-CA'),
    hardwareItems: [
      {
        name: "Power Supply Unit",
        description: "750W 80+ Gold Certified PSU",
        quantity: 1,
        unitPrice: 89.99,
        total: 89.99
      },
      {
        name: "RAM Module",
        description: "16GB DDR4 3200MHz",
        quantity: 1,
        unitPrice: 75.00,
        total: 75.00
      }
    ]
  };

  // Sample receipt data for direct display
  const sampleReceiptData = {
    jobId: "JOB-2025-0001",
    invoiceNumber: "INV-1736644800-JOB-2025-0001",
    serviceDate: new Date().toLocaleDateString('en-CA'),
    serviceTime: "14:30",
    customerName: "Jean Dupont",
    customerEmail: "jean.dupont@example.com",
    customerPhone: "(514) 555-0123",
    customerAddress: "123 Rue Sainte-Catherine, Montreal, QC H3B 1A7",
    serviceProviderName: "Marie-Claude Tremblay",
    serviceProviderId: "SP-7834",
    serviceType: "onsite" as const,
    serviceDetails: {
      category: "Hardware Issues",
      description: "Computer not starting, replaced power supply and added RAM upgrade",
      duration: 120,
      hourlyRate: 75.00,
      total: 150.00
    },
    hardwareItems: [
      {
        name: "Power Supply Unit",
        description: "750W 80+ Gold Certified PSU",
        quantity: 1,
        unitPrice: 89.99,
        total: 89.99
      },
      {
        name: "RAM Module",
        description: "16GB DDR4 3200MHz",
        quantity: 1,
        unitPrice: 75.00,
        total: 75.00
      }
    ],
    subtotal: 314.99,
    gst: 15.75, // 5% GST
    tvq: 31.42, // 9.975% TVQ
    total: 362.16,
    paymentMethod: "Credit Card",
    paymentStatus: "paid" as const,
    completedAt: new Date().toLocaleString('en-CA')
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TechGPT Receipt System Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Demonstration of the comprehensive receipt system for completed technical support jobs, 
            including Quebec tax compliance (GST 5% + TVQ 9.975%) and hardware itemization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Job Completion Flow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Job Completion Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                This demonstrates the complete customer experience when a service job is completed, 
                including rating submission and automatic receipt generation.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">Sample Job Details:</p>
                  <p className="text-sm text-blue-700">Job ID: {sampleJobData.jobId}</p>
                  <p className="text-sm text-blue-700">Service: {sampleJobData.category}</p>
                  <p className="text-sm text-blue-700">Hardware Added: Power Supply + RAM</p>
                  <p className="text-sm text-blue-700">Total: ${sampleJobData.total.toFixed(2)}</p>
                </div>
                <Button 
                  onClick={() => setShowJobCompletion(true)}
                  className="w-full"
                >
                  View Job Completion Modal
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Direct Receipt View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-purple-600" />
                Direct Receipt View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                View the detailed receipt component directly, showing Quebec tax structure 
                and comprehensive service breakdown.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-900">Tax Breakdown:</p>
                  <p className="text-sm text-purple-700">Subtotal: ${sampleReceiptData.subtotal.toFixed(2)}</p>
                  <p className="text-sm text-purple-700">GST (5%): ${sampleReceiptData.gst.toFixed(2)}</p>
                  <p className="text-sm text-purple-700">TVQ (9.975%): ${sampleReceiptData.tvq.toFixed(2)}</p>
                  <p className="text-sm text-purple-700 font-medium">Total: ${sampleReceiptData.total.toFixed(2)} CAD</p>
                </div>
                <Button 
                  onClick={() => setShowDirectReceipt(true)}
                  className="w-full"
                  variant="outline"
                >
                  View Full Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Receipt System Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Quebec Tax Compliance</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• GST (5%) calculation</li>
                  <li>• TVQ (9.975%) calculation</li>
                  <li>• Proper tax labeling</li>
                  <li>• Total with taxes</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Hardware Itemization</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Individual item details</li>
                  <li>• Quantity and unit prices</li>
                  <li>• Part descriptions</li>
                  <li>• Subtotal calculations</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Delivery Options</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Email receipt (HTML format)</li>
                  <li>• Text message receipt</li>
                  <li>• PDF download</li>
                  <li>• Real-time generation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Integration */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>System Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Customer Dashboard Integration</h3>
                <p className="text-sm text-gray-600 mb-3">
                  The receipt system integrates seamlessly with the customer dashboard popup that appears 
                  when a service job is completed. Customers can rate their experience and immediately 
                  access their receipt.
                </p>
                <div className="space-y-2">
                  <Badge variant="outline">Job Completion Popup</Badge>
                  <Badge variant="outline">Rating System</Badge>
                  <Badge variant="outline">Receipt Generation</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">API Endpoints</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Complete API backend supports receipt generation, email sending, SMS delivery, 
                  and PDF creation for comprehensive receipt management.
                </p>
                <div className="space-y-2">
                  <Badge variant="outline">POST /api/receipts/email</Badge>
                  <Badge variant="outline">POST /api/receipts/text</Badge>
                  <Badge variant="outline">POST /api/receipts/pdf</Badge>
                  <Badge variant="outline">POST /api/receipts/generate</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Completion Modal */}
      <JobCompletionModal
        isOpen={showJobCompletion}
        onClose={() => setShowJobCompletion(false)}
        jobData={sampleJobData}
      />

      {/* Direct Receipt Modal */}
      {showDirectReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Complete Receipt View</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowDirectReceipt(false)}
                >
                  ×
                </Button>
              </div>
              <CustomerReceipt {...sampleReceiptData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}