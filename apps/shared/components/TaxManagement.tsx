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
  const [selectedCountry, setSelectedCountry] = useState('canada');
  const { toast } = useToast();

  const canadianRegions = [
    { id: 'bc', name: 'British Columbia', gst: 5, pst: 7, total: 12, country: 'canada' },
    { id: 'ab', name: 'Alberta', gst: 5, pst: 0, total: 5, country: 'canada' },
    { id: 'sk', name: 'Saskatchewan', gst: 5, pst: 6, total: 11, country: 'canada' },
    { id: 'mb', name: 'Manitoba', gst: 5, pst: 7, total: 12, country: 'canada' },
    { id: 'on', name: 'Ontario', hst: 13, total: 13, country: 'canada' },
    { id: 'qc', name: 'Quebec', gst: 5, pst: 9.975, total: 14.975, country: 'canada' },
    { id: 'nb', name: 'New Brunswick', hst: 15, total: 15, country: 'canada' },
    { id: 'pe', name: 'Prince Edward Island', hst: 15, total: 15, country: 'canada' },
    { id: 'ns', name: 'Nova Scotia', hst: 15, total: 15, country: 'canada' },
    { id: 'nl', name: 'Newfoundland and Labrador', hst: 15, total: 15, country: 'canada' },
    { id: 'yt', name: 'Yukon', gst: 5, pst: 0, total: 5, country: 'canada' },
    { id: 'nt', name: 'Northwest Territories', gst: 5, pst: 0, total: 5, country: 'canada' },
    { id: 'nu', name: 'Nunavut', gst: 5, pst: 0, total: 5, country: 'canada' }
  ];

  const usStates = [
    { id: 'al', name: 'Alabama', salesTax: 4, total: 4, country: 'usa' },
    { id: 'ak', name: 'Alaska', salesTax: 0, total: 0, country: 'usa' },
    { id: 'az', name: 'Arizona', salesTax: 5.6, total: 5.6, country: 'usa' },
    { id: 'ar', name: 'Arkansas', salesTax: 6.5, total: 6.5, country: 'usa' },
    { id: 'ca', name: 'California', salesTax: 7.25, total: 7.25, country: 'usa' },
    { id: 'co', name: 'Colorado', salesTax: 2.9, total: 2.9, country: 'usa' },
    { id: 'ct', name: 'Connecticut', salesTax: 6.35, total: 6.35, country: 'usa' },
    { id: 'de', name: 'Delaware', salesTax: 0, total: 0, country: 'usa' },
    { id: 'fl', name: 'Florida', salesTax: 6, total: 6, country: 'usa' },
    { id: 'ga', name: 'Georgia', salesTax: 4, total: 4, country: 'usa' },
    { id: 'hi', name: 'Hawaii', salesTax: 4, total: 4, country: 'usa' },
    { id: 'id', name: 'Idaho', salesTax: 6, total: 6, country: 'usa' },
    { id: 'il', name: 'Illinois', salesTax: 6.25, total: 6.25, country: 'usa' },
    { id: 'in', name: 'Indiana', salesTax: 7, total: 7, country: 'usa' },
    { id: 'ia', name: 'Iowa', salesTax: 6, total: 6, country: 'usa' },
    { id: 'ks', name: 'Kansas', salesTax: 6.5, total: 6.5, country: 'usa' },
    { id: 'ky', name: 'Kentucky', salesTax: 6, total: 6, country: 'usa' },
    { id: 'la', name: 'Louisiana', salesTax: 4.45, total: 4.45, country: 'usa' },
    { id: 'me', name: 'Maine', salesTax: 5.5, total: 5.5, country: 'usa' },
    { id: 'md', name: 'Maryland', salesTax: 6, total: 6, country: 'usa' },
    { id: 'ma', name: 'Massachusetts', salesTax: 6.25, total: 6.25, country: 'usa' },
    { id: 'mi', name: 'Michigan', salesTax: 6, total: 6, country: 'usa' },
    { id: 'mn', name: 'Minnesota', salesTax: 6.875, total: 6.875, country: 'usa' },
    { id: 'ms', name: 'Mississippi', salesTax: 7, total: 7, country: 'usa' },
    { id: 'mo', name: 'Missouri', salesTax: 4.225, total: 4.225, country: 'usa' },
    { id: 'mt', name: 'Montana', salesTax: 0, total: 0, country: 'usa' },
    { id: 'ne', name: 'Nebraska', salesTax: 5.5, total: 5.5, country: 'usa' },
    { id: 'nv', name: 'Nevada', salesTax: 6.85, total: 6.85, country: 'usa' },
    { id: 'nh', name: 'New Hampshire', salesTax: 0, total: 0, country: 'usa' },
    { id: 'nj', name: 'New Jersey', salesTax: 6.625, total: 6.625, country: 'usa' },
    { id: 'nm', name: 'New Mexico', salesTax: 5.125, total: 5.125, country: 'usa' },
    { id: 'ny', name: 'New York', salesTax: 4, total: 4, country: 'usa' },
    { id: 'nc', name: 'North Carolina', salesTax: 4.75, total: 4.75, country: 'usa' },
    { id: 'nd', name: 'North Dakota', salesTax: 5, total: 5, country: 'usa' },
    { id: 'oh', name: 'Ohio', salesTax: 5.75, total: 5.75, country: 'usa' },
    { id: 'ok', name: 'Oklahoma', salesTax: 4.5, total: 4.5, country: 'usa' },
    { id: 'or', name: 'Oregon', salesTax: 0, total: 0, country: 'usa' },
    { id: 'pa', name: 'Pennsylvania', salesTax: 6, total: 6, country: 'usa' },
    { id: 'ri', name: 'Rhode Island', salesTax: 7, total: 7, country: 'usa' },
    { id: 'sc', name: 'South Carolina', salesTax: 6, total: 6, country: 'usa' },
    { id: 'sd', name: 'South Dakota', salesTax: 4.5, total: 4.5, country: 'usa' },
    { id: 'tn', name: 'Tennessee', salesTax: 7, total: 7, country: 'usa' },
    { id: 'tx', name: 'Texas', salesTax: 6.25, total: 6.25, country: 'usa' },
    { id: 'ut', name: 'Utah', salesTax: 5.95, total: 5.95, country: 'usa' },
    { id: 'vt', name: 'Vermont', salesTax: 6, total: 6, country: 'usa' },
    { id: 'va', name: 'Virginia', salesTax: 5.3, total: 5.3, country: 'usa' },
    { id: 'wa', name: 'Washington', salesTax: 6.5, total: 6.5, country: 'usa' },
    { id: 'wv', name: 'West Virginia', salesTax: 6, total: 6, country: 'usa' },
    { id: 'wi', name: 'Wisconsin', salesTax: 5, total: 5, country: 'usa' },
    { id: 'wy', name: 'Wyoming', salesTax: 4, total: 4, country: 'usa' }
  ];

  const regions = selectedCountry === 'canada' ? canadianRegions : usStates;

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
          Canada & USA Tax System
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
              <div className="grid grid-cols-3 gap-4">
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
                  <Label htmlFor="country">Country</Label>
                  <Select value={selectedCountry} onValueChange={(value) => {
                    setSelectedCountry(value);
                    setSelectedRegion(''); // Reset region when country changes
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="region">
                    {selectedCountry === 'canada' ? 'Province/Territory' : 'State'}
                  </Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${selectedCountry === 'canada' ? 'province' : 'state'}`} />
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
                      <span>
                        {selectedCountry === 'canada' ? 'Tax' : 'Sales Tax'} ({calculation.taxRate}%):
                      </span>
                      <span>${calculation.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total Amount:</span>
                      <span>${calculation.total.toFixed(2)}</span>
                    </div>
                    {selectedCountry === 'canada' && (
                      <div className="text-xs text-gray-600 mt-2">
                        {regions.find(r => r.id === selectedRegion)?.hst 
                          ? `HST: ${regions.find(r => r.id === selectedRegion)?.hst}%`
                          : `GST: ${regions.find(r => r.id === selectedRegion)?.gst}%${regions.find(r => r.id === selectedRegion)?.pst ? `, PST: ${regions.find(r => r.id === selectedRegion)?.pst}%` : ''}`
                        }
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button 
              variant={selectedCountry === 'canada' ? 'default' : 'outline'}
              onClick={() => setSelectedCountry('canada')}
            >
              Canada
            </Button>
            <Button 
              variant={selectedCountry === 'usa' ? 'default' : 'outline'}
              onClick={() => setSelectedCountry('usa')}
            >
              United States
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {selectedCountry === 'canada' ? 'Canadian' : 'US'} Tax Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regions.map(region => (
                  <div key={region.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{region.name}</div>
                      <div className="text-sm text-gray-600">
                        {selectedCountry === 'canada' 
                          ? (region.hst ? `HST: ${region.hst}%` : `GST: ${region.gst}%${region.pst ? `, PST: ${region.pst}%` : ''}`)
                          : `Sales Tax: ${region.salesTax}%`
                        }
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
                  <div className="text-sm text-green-600">
                    Customer pays service amount + applicable {selectedCountry === 'canada' ? 'GST/PST/HST' : 'sales tax'}
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800">2. Service Provider Collection</div>
                  <div className="text-sm text-blue-600">Service providers collect tax on behalf of platform</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-800">3. Government Remittance</div>
                  <div className="text-sm text-purple-600">
                    {selectedCountry === 'canada' 
                      ? 'GST/HST collected by service providers paid to Canada Revenue Agency'
                      : 'Sales tax collected by service providers paid to respective state tax authorities'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}