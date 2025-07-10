import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, FileText, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TaxManagement() {
  const [taxRates, setTaxRates] = useState({
    gst: 5,
    pst: 7,
    hst: 13
  });
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const { toast } = useToast();

  const regions = [
    { id: 'bc', name: 'British Columbia', gst: 5, pst: 7, total: 12 },
    { id: 'ab', name: 'Alberta', gst: 5, pst: 0, total: 5 },
    { id: 'sk', name: 'Saskatchewan', gst: 5, pst: 6, total: 11 },
    { id: 'mb', name: 'Manitoba', gst: 5, pst: 7, total: 12 },
    { id: 'on', name: 'Ontario', hst: 13, total: 13 },
    { id: 'qc', name: 'Quebec', gst: 5, pst: 9.975, total: 14.975 },
    { id: 'nb', name: 'New Brunswick', hst: 15, total: 15 },
    { id: 'pe', name: 'Prince Edward Island', hst: 15, total: 15 },
    { id: 'ns', name: 'Nova Scotia', hst: 15, total: 15 },
    { id: 'nl', name: 'Newfoundland and Labrador', hst: 15, total: 15 },
    { id: 'yt', name: 'Yukon', gst: 5, pst: 0, total: 5 },
    { id: 'nt', name: 'Northwest Territories', gst: 5, pst: 0, total: 5 },
    { id: 'nu', name: 'Nunavut', gst: 5, pst: 0, total: 5 }
  ];

  const calculateTax = () => {
    const amount = parseFloat(invoiceAmount);
    const region = regions.find(r => r.id === selectedRegion);
    
    if (!amount || !region) return null;

    const taxAmount = (amount * region.total) / 100;
    const totalAmount = amount + taxAmount;

    return {
      subtotal: amount,
      taxRate: region.total,
      taxAmount: taxAmount,
      total: totalAmount,
      region: region.name
    };
  };

  const handleSaveTaxRates = () => {
    toast({
      title: "Tax Rates Updated",
      description: "Tax rates have been saved successfully."
    });
  };

  const calculation = calculateTax();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tax Management</h2>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Simple Tax System
        </Badge>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
          <TabsTrigger value="rates">Tax Rates</TabsTrigger>
          <TabsTrigger value="summary">Tax Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Invoice Tax Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Service Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter service amount"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="region">Customer Region</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name} ({region.total}% tax)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {calculation && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Tax Calculation for {calculation.region}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Service Amount:</span>
                      <span>${calculation.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({calculation.taxRate}%):</span>
                      <span>${calculation.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total Amount:</span>
                      <span>${calculation.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tax Rates by Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regions.map(region => (
                  <div key={region.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{region.name}</div>
                      <div className="text-sm text-gray-600">
                        {region.hst ? `HST: ${region.hst}%` : 
                         `GST: ${region.gst}%${region.pst ? `, PST: ${region.pst}%` : ''}`}
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {region.total}% Total
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Customer Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">$12,450</div>
                <p className="text-sm text-gray-600 mt-1">
                  Total tax collected from customers this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Service Providers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">$10,582</div>
                <p className="text-sm text-gray-600 mt-1">
                  Tax collected by service providers for platform
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  GST Remittance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">$1,868</div>
                <p className="text-sm text-gray-600 mt-1">
                  GST to be paid to government
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tax Flow Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800">1. Customer Invoice</div>
                  <div className="text-sm text-green-600">Customer pays service amount + applicable tax</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800">2. Service Provider Collection</div>
                  <div className="text-sm text-blue-600">Service providers collect tax on behalf of platform</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-800">3. Government Remittance</div>
                  <div className="text-sm text-purple-600">GST collected by service providers paid to government</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}