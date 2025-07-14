import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import SimpleNavigation from "@/components/SimpleNavigation";
import { 
  DollarSign, 
  Clock, 
  MapPin, 
  Calendar,
  Download,
  Settings,
  TrendingUp,
  FileText,
  CreditCard,
  Calculator,
  Receipt,
  PiggyBank,
  Building,
  Briefcase
} from "lucide-react";

interface JobActivity {
  id: number;
  date: string;
  type: 'remote' | 'phone' | 'onsite';
  customer: string;
  duration: string;
  location?: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: 'completed' | 'pending' | 'processing' | 'paid';
  requestedAt: string;
  startedAt: string;
  completedAt: string;
  arrivedAt?: string; // for onsite jobs
}

interface TaxInfo {
  province?: string;
  state?: string;
  country: string;
  gst?: number;
  pst?: number;
  hst?: number;
  salesTax?: number;
  totalTaxRate: number;
}

export default function TechnicianEarnings() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-week");
  const [paymentFrequency, setPaymentFrequency] = useState("weekly");
  const [minimumPayout, setMinimumPayout] = useState("25.00");

  // Mock data - in real app this would come from API
  const jobActivities: JobActivity[] = [
    {
      id: 1,
      date: "2025-01-07",
      type: "onsite",
      customer: "John Smith",
      duration: "2h 30m",
      location: "Toronto, ON",
      grossAmount: 200.00,
      platformFee: 30.00,
      netAmount: 170.00,
      status: "completed",
      requestedAt: "09:00 AM",
      startedAt: "10:15 AM",
      arrivedAt: "10:45 AM",
      completedAt: "01:15 PM"
    },
    {
      id: 2,
      date: "2025-01-06",
      type: "remote",
      customer: "Sarah Johnson",
      duration: "1h 15m",
      grossAmount: 75.00,
      platformFee: 11.25,
      netAmount: 63.75,
      status: "paid",
      requestedAt: "02:00 PM",
      startedAt: "02:30 PM",
      completedAt: "03:45 PM"
    },
    {
      id: 3,
      date: "2025-01-05",
      type: "phone",
      customer: "Mike Davis",
      duration: "45m",
      grossAmount: 56.25,
      platformFee: 8.44,
      netAmount: 47.81,
      status: "processing",
      requestedAt: "11:00 AM",
      startedAt: "11:20 AM",
      completedAt: "12:05 PM"
    }
  ];

  const canadianTaxRates: Record<string, TaxInfo> = {
    "Ontario": { province: "Ontario", country: "CA", gst: 0.05, pst: 0.08, totalTaxRate: 0.13 },
    "Quebec": { province: "Quebec", country: "CA", gst: 0.05, pst: 0.09975, totalTaxRate: 0.14975 },
    "British Columbia": { province: "British Columbia", country: "CA", gst: 0.05, pst: 0.07, totalTaxRate: 0.12 },
    "Alberta": { province: "Alberta", country: "CA", gst: 0.05, totalTaxRate: 0.05 },
    "Manitoba": { province: "Manitoba", country: "CA", gst: 0.05, pst: 0.07, totalTaxRate: 0.12 },
    "Saskatchewan": { province: "Saskatchewan", country: "CA", gst: 0.05, pst: 0.06, totalTaxRate: 0.11 },
    "Nova Scotia": { province: "Nova Scotia", country: "CA", hst: 0.15, totalTaxRate: 0.15 },
    "New Brunswick": { province: "New Brunswick", country: "CA", hst: 0.15, totalTaxRate: 0.15 },
    "Newfoundland and Labrador": { province: "Newfoundland and Labrador", country: "CA", hst: 0.15, totalTaxRate: 0.15 },
    "Prince Edward Island": { province: "Prince Edward Island", country: "CA", hst: 0.15, totalTaxRate: 0.15 },
  };

  const usTaxRates: Record<string, TaxInfo> = {
    "California": { state: "California", country: "US", salesTax: 0.0725, totalTaxRate: 0.0725 },
    "New York": { state: "New York", country: "US", salesTax: 0.08, totalTaxRate: 0.08 },
    "Texas": { state: "Texas", country: "US", salesTax: 0.0625, totalTaxRate: 0.0625 },
    "Florida": { state: "Florida", country: "US", salesTax: 0.06, totalTaxRate: 0.06 },
  };

  const totalEarnings = jobActivities.reduce((sum, job) => sum + job.netAmount, 0);
  const totalJobs = jobActivities.length;
  const avgJobValue = totalEarnings / totalJobs;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case 'remote': return '💻';
      case 'phone': return '📞';
      case 'onsite': return '🏠';
      default: return '🔧';
    }
  };

  const generateStatement = (type: string) => {
    // In real app, this would call API to generate PDF statement
    console.log(`Generating ${type} statement...`);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <SimpleNavigation title="Earnings Dashboard" backTo="/technician-dashboard" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings & Financial Dashboard</h1>
        <p className="text-gray-600">Track your income, manage payments, and prepare for taxes</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Jobs</p>
                <p className="text-2xl font-bold text-blue-600">{totalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Job Value</p>
                <p className="text-2xl font-bold text-purple-600">${avgJobValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Payout</p>
                <p className="text-lg font-bold text-orange-600">Friday</p>
                <p className="text-xs text-gray-500">Jan 10, 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="activities">Job Activities</TabsTrigger>
          <TabsTrigger value="payments">Payment Settings</TabsTrigger>
          <TabsTrigger value="statements">Tax Statements</TabsTrigger>
          <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Job Activities */}
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Detailed Job Activities
                </CardTitle>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-week">Current Week</SelectItem>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="current-year">Current Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobActivities.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getServiceTypeIcon(job.type)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{job.customer}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {job.date}
                            {job.location && (
                              <>
                                <MapPin className="h-4 w-4 ml-2" />
                                {job.location}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Timeline</h4>
                        <div className="text-xs space-y-1">
                          <div>Requested: {job.requestedAt}</div>
                          <div>Started: {job.startedAt}</div>
                          {job.arrivedAt && <div>Arrived: {job.arrivedAt}</div>}
                          <div>Completed: {job.completedAt}</div>
                          <div className="font-medium">Duration: {job.duration}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Service Details</h4>
                        <div className="text-xs space-y-1">
                          <div>Type: <span className="capitalize">{job.type}</span> Support</div>
                          {job.type === 'onsite' && job.location && (
                            <div>Location: {job.location}</div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Earnings Breakdown</h4>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span>Gross Amount:</span>
                            <span>${job.grossAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>Platform Fee (15%):</span>
                            <span>-${job.platformFee.toFixed(2)}</span>
                          </div>
                          <Separator className="my-1" />
                          <div className="flex justify-between font-semibold text-green-600">
                            <span>Net Earnings:</span>
                            <span>${job.netAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="frequency">Payment Frequency</Label>
                  <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly (Every Friday)</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly (Every 2 weeks)</SelectItem>
                      <SelectItem value="monthly">Monthly (1st of month)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="minimum">Minimum Payout Threshold</Label>
                  <div className="relative">
                    <Input
                      id="minimum"
                      type="number"
                      value={minimumPayout}
                      onChange={(e) => setMinimumPayout(e.target.value)}
                      className="pl-8"
                    />
                    <DollarSign className="h-4 w-4 absolute left-2 top-3 text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum amount before automatic payout is triggered
                  </p>
                </div>

                <Button className="w-full">Update Payment Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Banking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="account">Account Number</Label>
                  <Input 
                    id="account" 
                    type="password" 
                    placeholder="•••••••••1234"
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="routing">Routing Number</Label>
                  <Input 
                    id="routing" 
                    type="password" 
                    placeholder="•••••••123"
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="type">Account Type</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Checking" />
                    </SelectTrigger>
                  </Select>
                </div>

                <Button variant="outline" className="w-full">
                  Update Banking Info
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tax Statements */}
        <TabsContent value="statements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Tax Statements & Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { type: "Current Week", period: "Jan 6-12, 2025", amount: "$281.56" },
                  { type: "Current Month", period: "January 2025", amount: "$1,247.89" },
                  { type: "Last Month", period: "December 2024", amount: "$2,156.34" },
                  { type: "Q4 2024", period: "Oct-Dec 2024", amount: "$6,890.12" },
                  { type: "Annual 2024", period: "Jan-Dec 2024", amount: "$24,567.89" },
                  { type: "T4A Statement", period: "2024 Tax Year", amount: "$24,567.89" },
                ].map((statement, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{statement.type}</h3>
                        <p className="text-sm text-gray-600">{statement.period}</p>
                      </div>
                      <Receipt className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-lg font-bold text-green-600 mb-3">{statement.amount}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => generateStatement(statement.type)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Calculator */}
        <TabsContent value="calculator">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Tax Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Country</Label>
                  <Select defaultValue="CA">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Province/State</Label>
                  <Select defaultValue="Ontario">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(canadianTaxRates).map((province) => (
                        <SelectItem key={province} value={province}>{province}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Annual Earnings</Label>
                  <div className="relative">
                    <Input type="number" placeholder="25000" className="pl-8" />
                    <DollarSign className="h-4 w-4 absolute left-2 top-3 text-gray-500" />
                  </div>
                </div>

                <Button className="w-full">Calculate Tax Estimates</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Breakdown - Ontario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Gross Earnings:</span>
                    <span className="font-semibold">$25,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%):</span>
                    <span>$1,250.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PST (8%):</span>
                    <span>$2,000.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Tax Owing:</span>
                    <span className="text-red-600">$3,250.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net After Tax:</span>
                    <span className="text-green-600 font-semibold">$21,750.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Service Type Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "On-site", count: 8, earnings: "$1,360", percentage: 60 },
                    { type: "Remote", count: 5, earnings: "$875", percentage: 30 },
                    { type: "Phone", count: 3, earnings: "$285", percentage: 10 },
                  ].map((service, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{service.type}</span>
                        <span className="text-sm text-gray-600">{service.earnings}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${service.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{service.count} jobs</span>
                        <span>{service.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  Monthly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">$2,520.00</div>
                    <div className="text-sm text-gray-600">Total January Earnings</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-semibold">16</div>
                      <div className="text-sm text-gray-600">Jobs Completed</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold">$157.50</div>
                      <div className="text-sm text-gray-600">Avg Job Value</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}