import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3,
  Receipt,
  CreditCard,
  Wallet
} from "lucide-react";

const FinancialStatements: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profit-loss");
  const [selectedPeriod, setSelectedPeriod] = useState("2025-01");

  const handleDownloadStatement = (type: string) => {
    toast({
      title: "Download Started",
      description: `${type} statement is being generated and will be downloaded as PDF.`,
    });
  };

  const profitLossData = {
    period: "January 2025",
    revenue: {
      remoteSupport: 125000,
      phoneSupport: 85000,
      onsiteSupport: 52000,
      consultation: 22750,
      total: 284750
    },
    expenses: {
      servicProviderPayouts: 242037.5, // 85% of revenue
      platformFees: 15000,
      operatingExpenses: 8500,
      marketingExpenses: 4200,
      total: 269737.5
    },
    netProfit: 15012.5
  };

  const balanceSheetData = {
    assets: {
      currentAssets: {
        cash: 485000,
        accountsReceivable: 42000,
        prepaidExpenses: 8500,
        total: 535500
      },
      fixedAssets: {
        equipment: 125000,
        software: 85000,
        total: 210000
      },
      totalAssets: 745500
    },
    liabilities: {
      currentLiabilities: {
        accountsPayable: 35000,
        accruedExpenses: 12000,
        deferredRevenue: 8500,
        total: 55500
      },
      longTermLiabilities: {
        loans: 150000,
        total: 150000
      },
      totalLiabilities: 205500
    },
    equity: {
      retainedEarnings: 440000,
      currentEarnings: 100000,
      totalEquity: 540000
    }
  };

  const cashFlowData = {
    operatingActivities: {
      netIncome: 15012.5,
      depreciation: 8500,
      accountsReceivableChange: -5000,
      accountsPayableChange: 3500,
      totalOperating: 22012.5
    },
    investingActivities: {
      equipmentPurchases: -25000,
      softwareInvestments: -15000,
      totalInvesting: -40000
    },
    financingActivities: {
      loanRepayments: -8500,
      totalFinancing: -8500
    },
    netCashFlow: -26487.5
  };

  const monthlyComparison = [
    { month: "Aug 2024", revenue: 185000, expenses: 165000, profit: 20000 },
    { month: "Sep 2024", revenue: 210000, expenses: 185000, profit: 25000 },
    { month: "Oct 2024", revenue: 235000, expenses: 205000, profit: 30000 },
    { month: "Nov 2024", revenue: 255000, expenses: 225000, profit: 30000 },
    { month: "Dec 2024", revenue: 270000, expenses: 245000, profit: 25000 },
    { month: "Jan 2025", revenue: 284750, expenses: 269737.5, profit: 15012.5 }
  ];

  const taxLiabilities = [
    { jurisdiction: "United States - Federal", amount: 4500, status: "pending" },
    { jurisdiction: "California - State", amount: 2250, status: "paid" },
    { jurisdiction: "Canada - Federal (GST)", amount: 8500, status: "pending" },
    { jurisdiction: "Ontario - Provincial (HST)", amount: 5200, status: "paid" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Financial Statements</h2>
          <p className="text-gray-600 mt-1">Comprehensive financial reports and analysis</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-01">January 2025</SelectItem>
              <SelectItem value="2024-12">December 2024</SelectItem>
              <SelectItem value="2024-11">November 2024</SelectItem>
              <SelectItem value="2024-10">October 2024</SelectItem>
              <SelectItem value="2024-q4">Q4 2024</SelectItem>
              <SelectItem value="2024-year">Year 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => handleDownloadStatement("All Statements")}>
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profit-loss">P&L Statement</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="tax-summary">Tax Summary</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="profit-loss" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Profit & Loss Statement - {profitLossData.period}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleDownloadStatement("Profit & Loss")}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Revenue</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remote Support Services</span>
                      <span className="font-semibold">${profitLossData.revenue.remoteSupport.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone Support Services</span>
                      <span className="font-semibold">${profitLossData.revenue.phoneSupport.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">On-site Support Services</span>
                      <span className="font-semibold">${profitLossData.revenue.onsiteSupport.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consultation Services</span>
                      <span className="font-semibold">${profitLossData.revenue.consultation.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold text-gray-900">Total Revenue</span>
                      <span className="font-bold text-lg">${profitLossData.revenue.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Expenses</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Provider Payouts (85%)</span>
                      <span className="font-semibold">${profitLossData.expenses.servicProviderPayouts.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Fees & Processing</span>
                      <span className="font-semibold">${profitLossData.expenses.platformFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operating Expenses</span>
                      <span className="font-semibold">${profitLossData.expenses.operatingExpenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Marketing & Advertising</span>
                      <span className="font-semibold">${profitLossData.expenses.marketingExpenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold text-gray-900">Total Expenses</span>
                      <span className="font-bold text-lg">${profitLossData.expenses.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xl text-gray-900">Net Profit</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-bold text-xl text-green-600">${profitLossData.netProfit.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Profit Margin: {((profitLossData.netProfit / profitLossData.revenue.total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance-sheet" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Balance Sheet - As of January 31, 2025</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleDownloadStatement("Balance Sheet")}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Current Assets</h4>
                      <div className="space-y-1 ml-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cash & Cash Equivalents</span>
                          <span className="font-semibold">${balanceSheetData.assets.currentAssets.cash.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accounts Receivable</span>
                          <span className="font-semibold">${balanceSheetData.assets.currentAssets.accountsReceivable.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Prepaid Expenses</span>
                          <span className="font-semibold">${balanceSheetData.assets.currentAssets.prepaidExpenses.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span className="font-medium">Total Current Assets</span>
                          <span className="font-semibold">${balanceSheetData.assets.currentAssets.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Fixed Assets</h4>
                      <div className="space-y-1 ml-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Equipment</span>
                          <span className="font-semibold">${balanceSheetData.assets.fixedAssets.equipment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Software & Technology</span>
                          <span className="font-semibold">${balanceSheetData.assets.fixedAssets.software.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span className="font-medium">Total Fixed Assets</span>
                          <span className="font-semibold">${balanceSheetData.assets.fixedAssets.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-bold text-blue-900">Total Assets</span>
                        <span className="font-bold text-blue-900">${balanceSheetData.assets.totalAssets.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Liabilities & Equity</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Current Liabilities</h4>
                      <div className="space-y-1 ml-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accounts Payable</span>
                          <span className="font-semibold">${balanceSheetData.liabilities.currentLiabilities.accountsPayable.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accrued Expenses</span>
                          <span className="font-semibold">${balanceSheetData.liabilities.currentLiabilities.accruedExpenses.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deferred Revenue</span>
                          <span className="font-semibold">${balanceSheetData.liabilities.currentLiabilities.deferredRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span className="font-medium">Total Current Liabilities</span>
                          <span className="font-semibold">${balanceSheetData.liabilities.currentLiabilities.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Long-term Liabilities</h4>
                      <div className="space-y-1 ml-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Long-term Loans</span>
                          <span className="font-semibold">${balanceSheetData.liabilities.longTermLiabilities.loans.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span className="font-medium">Total Long-term Liabilities</span>
                          <span className="font-semibold">${balanceSheetData.liabilities.longTermLiabilities.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-bold text-red-900">Total Liabilities</span>
                        <span className="font-bold text-red-900">${balanceSheetData.liabilities.totalLiabilities.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Equity</h4>
                      <div className="space-y-1 ml-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Retained Earnings</span>
                          <span className="font-semibold">${balanceSheetData.equity.retainedEarnings.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Period Earnings</span>
                          <span className="font-semibold">${balanceSheetData.equity.currentEarnings.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span className="font-medium">Total Equity</span>
                          <span className="font-semibold">${balanceSheetData.equity.totalEquity.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-bold text-green-900">Total Liabilities & Equity</span>
                        <span className="font-bold text-green-900">${(balanceSheetData.liabilities.totalLiabilities + balanceSheetData.equity.totalEquity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cash Flow Statement - {profitLossData.period}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleDownloadStatement("Cash Flow")}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Operating Activities</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Net Income</span>
                      <span className="font-semibold">${cashFlowData.operatingActivities.netIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Depreciation & Amortization</span>
                      <span className="font-semibold">${cashFlowData.operatingActivities.depreciation.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Change in Accounts Receivable</span>
                      <span className="font-semibold text-red-600">${cashFlowData.operatingActivities.accountsReceivableChange.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Change in Accounts Payable</span>
                      <span className="font-semibold text-green-600">${cashFlowData.operatingActivities.accountsPayableChange.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold text-gray-900">Net Cash from Operating Activities</span>
                      <span className="font-bold text-green-600">${cashFlowData.operatingActivities.totalOperating.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Investing Activities</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equipment Purchases</span>
                      <span className="font-semibold text-red-600">${cashFlowData.investingActivities.equipmentPurchases.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Software Investments</span>
                      <span className="font-semibold text-red-600">${cashFlowData.investingActivities.softwareInvestments.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold text-gray-900">Net Cash from Investing Activities</span>
                      <span className="font-bold text-red-600">${cashFlowData.investingActivities.totalInvesting.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Financing Activities</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Repayments</span>
                      <span className="font-semibold text-red-600">${cashFlowData.financingActivities.loanRepayments.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold text-gray-900">Net Cash from Financing Activities</span>
                      <span className="font-bold text-red-600">${cashFlowData.financingActivities.totalFinancing.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xl text-gray-900">Net Change in Cash</span>
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <span className="font-bold text-xl text-red-600">${cashFlowData.netCashFlow.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Summary - {profitLossData.period}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Authority</TableHead>
                    <TableHead>Amount Due</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxLiabilities.map((tax, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{tax.jurisdiction}</TableCell>
                      <TableCell>${tax.amount.toLocaleString()}</TableCell>
                      <TableCell>Feb 15, 2025</TableCell>
                      <TableCell>
                        <Badge variant={tax.status === 'paid' ? 'default' : 'secondary'}>
                          {tax.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Receipt className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>6-Month Financial Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyComparison.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{month.month}</span>
                      <div className="flex space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">${month.revenue.toLocaleString()}</div>
                          <div className="text-gray-600">Revenue</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-600">${month.expenses.toLocaleString()}</div>
                          <div className="text-gray-600">Expenses</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">${month.profit.toLocaleString()}</div>
                          <div className="text-gray-600">Profit</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Financial Ratios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gross Profit Margin</span>
                    <span className="font-semibold">15.0%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Operating Margin</span>
                    <span className="font-semibold">5.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Ratio</span>
                    <span className="font-semibold">9.6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Debt-to-Equity</span>
                    <span className="font-semibold">0.38</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Return on Assets</span>
                    <span className="font-semibold">13.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Return on Equity</span>
                    <span className="font-semibold">18.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialStatements;