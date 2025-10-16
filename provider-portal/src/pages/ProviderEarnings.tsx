import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Download, Calendar } from "lucide-react";
import ProviderLayout from "../components/ProviderLayout";

export default function ProviderEarnings() {
  const { data: earnings } = useQuery({
    queryKey: ["/api/provider/earnings"],
  });

  return (
    <ProviderLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Earnings</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your income and payouts</p>
          </div>
          <Button variant="outline" data-testid="button-download-report">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                  <h3 className="text-2xl font-bold mt-1">${earnings?.total || 0}</h3>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                  <h3 className="text-2xl font-bold mt-1">${earnings?.thisMonth || 0}</h3>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payout</p>
                  <h3 className="text-2xl font-bold mt-1">${earnings?.pending || 0}</h3>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {earnings?.transactions?.length > 0 ? (
                earnings.transactions.map((transaction: any) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.date}</p>
                    </div>
                    <p className="font-semibold text-green-600">${transaction.amount}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No transactions yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProviderLayout>
  );
}
