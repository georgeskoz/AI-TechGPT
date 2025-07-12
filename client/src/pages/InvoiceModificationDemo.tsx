import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Settings,
  AlertCircle
} from "lucide-react";
import ServiceProviderJobActions from "@/components/ServiceProviderJobActions";

export default function InvoiceModificationDemo() {
  const [currentJob, setCurrentJob] = useState({
    id: "JOB-2025-0002",
    customerId: 1,
    customerName: "Marie Dubois",
    customerPhone: "(514) 555-0456",
    category: "Hardware Issues",
    description: "Computer running slow, suspected RAM issue and possibly needs SSD upgrade",
    serviceType: "onsite" as const,
    status: "in_progress" as const,
    startTime: "2025-01-11T14:30:00Z",
    estimatedDuration: 90, // 1.5 hours
    baseRate: 85,
    currentTotal: 127.50, // 1.5 hours * $85/hr
    customerAddress: "456 Rue Saint-Denis, Montreal, QC H2X 3L4",
    hardwareItems: [
      {
        id: "hw1",
        name: "SSD Drive",
        description: "500GB NVMe SSD",
        quantity: 1,
        unitPrice: 89.99,
        total: 89.99
      }
    ],
    additionalServices: [
      {
        id: "svc1",
        name: "Data Migration",
        description: "Transfer data from old HDD to new SSD",
        duration: 45,
        rate: 85,
        total: 63.75
      }
    ]
  });

  const handleStatusUpdate = (jobId: string, status: string, modifications?: any) => {
    setCurrentJob(prev => ({
      ...prev,
      status: status as any,
      ...(modifications && {
        hardwareItems: modifications.hardwareItems || prev.hardwareItems,
        additionalServices: modifications.additionalServices || prev.additionalServices,
        currentTotal: prev.currentTotal + (modifications.totalAdjustment || 0)
      })
    }));
  };

  // Sample jobs for different statuses
  const sampleJobs = [
    {
      id: "JOB-2025-0001",
      customerId: 1,
      customerName: "Jean Tremblay",
      customerPhone: "(514) 555-0123",
      category: "Network Troubleshooting",
      description: "Wi-Fi connection issues in office environment",
      serviceType: "onsite" as const,
      status: "assigned" as const,
      estimatedDuration: 60,
      baseRate: 75,
      currentTotal: 75.00,
      customerAddress: "123 Rue Sainte-Catherine, Montreal, QC H3B 1A7"
    },
    currentJob,
    {
      id: "JOB-2025-0003",
      customerId: 3,
      customerName: "Sophie Lefebvre",
      customerPhone: "(514) 555-0789",
      category: "Software Issues",
      description: "Windows update problems and software installation",
      serviceType: "remote" as const,
      status: "completed" as const,
      estimatedDuration: 120,
      baseRate: 70,
      currentTotal: 140.00,
      hardwareItems: [
        {
          id: "hw2",
          name: "Windows 11 Pro License",
          description: "Official Windows 11 Professional License",
          quantity: 1,
          unitPrice: 199.99,
          total: 199.99
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Service Provider Invoice Modification Demo
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Demonstration of the invoice modification system that allows service providers to add 
            hardware items and additional services to customer invoices during job execution, 
            before job completion and customer receipt generation.
          </p>
        </div>

        {/* Key Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Key Features of Invoice Modification System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Pre-Completion Modification</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Add hardware items during job execution</li>
                  <li>• Add additional services as needed</li>
                  <li>• Real-time price calculation with taxes</li>
                  <li>• Customer notification of changes</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Hardware Management</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Item name and detailed description</li>
                  <li>• Quantity and unit price tracking</li>
                  <li>• Automatic total calculation</li>
                  <li>• Remove items if needed</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Service Extensions</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Additional service time tracking</li>
                  <li>• Custom hourly rates</li>
                  <li>• Service description and duration</li>
                  <li>• Transparent billing breakdown</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Invoice Modification Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <h4 className="font-medium mb-2">1. Job In Progress</h4>
                <p className="text-sm text-gray-600">Service provider working on assigned job</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-2">2. Add Items/Services</h4>
                <p className="text-sm text-gray-600">Add hardware or additional services to invoice</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">3. Customer Notification</h4>
                <p className="text-sm text-gray-600">Customer is notified of invoice changes</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">4. Job Completion</h4>
                <p className="text-sm text-gray-600">Complete job and generate final receipt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Jobs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Sample Jobs - Different Statuses</h2>
          
          {sampleJobs.map((job, index) => (
            <div key={job.id} className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">Job {index + 1}: {job.status.replace('_', ' ').toUpperCase()}</h3>
                {job.status === 'in_progress' && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Active - Can Modify Invoice
                  </Badge>
                )}
              </div>
              
              <ServiceProviderJobActions
                job={job}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
          ))}
        </div>

        {/* System Integration */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>System Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Invoice Modification Process</h3>
                <p className="text-sm text-gray-600 mb-3">
                  The invoice modification system is seamlessly integrated into the service provider 
                  workflow. When a job is in progress, service providers can add hardware items and 
                  additional services through an intuitive interface.
                </p>
                <div className="space-y-2">
                  <Badge variant="outline">Real-time Price Calculation</Badge>
                  <Badge variant="outline">Quebec Tax Compliance</Badge>
                  <Badge variant="outline">Customer Notification</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Receipt Generation</h3>
                <p className="text-sm text-gray-600 mb-3">
                  After invoice modifications are saved, the system automatically generates the 
                  final receipt with all items, services, and proper tax calculations before 
                  allowing job completion.
                </p>
                <div className="space-y-2">
                  <Badge variant="outline">Automatic Tax Calculation</Badge>
                  <Badge variant="outline">Detailed Item Breakdown</Badge>
                  <Badge variant="outline">Professional Receipt Format</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}