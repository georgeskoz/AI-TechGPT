import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/components/UserAuthProvider";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Share2, 
  Mail, 
  MessageSquare, 
  Copy,
  Gift,
  Star,
  Clock,
  Award,
  UserPlus
} from "lucide-react";

interface ReferralData {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  monthlyEarnings: number;
  conversionRate: number;
  avgEarningsPerReferral: number;
}

interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'active' | 'completed';
  earnings: number;
  joinDate: string;
  lastActivity: string;
}

export default function TechnicianReferrals() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState("TECH_" + (user?.username?.toUpperCase() || "USER"));
  const [referralEmail, setReferralEmail] = useState("");
  const [referralMessage, setReferralMessage] = useState("");

  const referralData: ReferralData = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: 2450,
    monthlyEarnings: 380,
    conversionRate: 67,
    avgEarningsPerReferral: 204
  };

  const referrals: Referral[] = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      status: "active",
      earnings: 420,
      joinDate: "2024-01-15",
      lastActivity: "2 hours ago"
    },
    {
      id: "2", 
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      status: "active",
      earnings: 380,
      joinDate: "2024-01-20",
      lastActivity: "1 day ago"
    },
    {
      id: "3",
      name: "Mike Rodriguez",
      email: "mike.rodriguez@email.com",
      status: "completed",
      earnings: 525,
      joinDate: "2023-12-10",
      lastActivity: "3 days ago"
    },
    {
      id: "4",
      name: "Emma Wilson",
      email: "emma.wilson@email.com",
      status: "pending",
      earnings: 0,
      joinDate: "2024-01-25",
      lastActivity: "5 days ago"
    }
  ];

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
  };

  const handleSendReferral = () => {
    // Logic to send referral invitation
    console.log("Sending referral to:", referralEmail);
    setReferralEmail("");
    setReferralMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Program</h1>
          <p className="text-gray-600">Earn commissions by referring new service providers to our platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Referrals</p>
                  <p className="text-2xl font-bold text-gray-900">{referralData.totalReferrals}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Referrals</p>
                  <p className="text-2xl font-bold text-green-600">{referralData.activeReferrals}</p>
                </div>
                <UserPlus className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-600">${referralData.totalEarnings}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Earnings</p>
                  <p className="text-2xl font-bold text-blue-600">${referralData.monthlyEarnings}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{referralData.conversionRate}%</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg per Referral</p>
                  <p className="text-2xl font-bold text-orange-600">${referralData.avgEarningsPerReferral}</p>
                </div>
                <Gift className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Referral Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Referral Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Referral Code
                </label>
                <div className="flex gap-2">
                  <Input 
                    value={referralCode}
                    readOnly
                    className="flex-1"
                  />
                  <Button onClick={handleCopyReferralCode} variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send Referral Invitation
                </label>
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={referralEmail}
                    onChange={(e) => setReferralEmail(e.target.value)}
                  />
                  <Textarea
                    placeholder="Personal message (optional)"
                    value={referralMessage}
                    onChange={(e) => setReferralMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button 
                    onClick={handleSendReferral}
                    className="w-full"
                    disabled={!referralEmail}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Share</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{referral.name}</h3>
                        <Badge className={getStatusColor(referral.status)}>
                          {referral.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{referral.email}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {referral.lastActivity}
                        </span>
                        <span>Joined: {referral.joinDate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        ${referral.earnings}
                      </div>
                      <div className="text-xs text-gray-500">earned</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Program Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Share2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Share Your Code</h3>
                <p className="text-sm text-gray-600">
                  Share your unique referral code with potential service providers
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">They Join</h3>
                <p className="text-sm text-gray-600">
                  When they sign up using your code, they become your referral
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">You Earn</h3>
                <p className="text-sm text-gray-600">
                  Earn 10% commission on all their earnings for the first 6 months
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}