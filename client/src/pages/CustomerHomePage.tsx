import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { 
  MessageSquare, 
  Users, 
  Zap, 
  Shield, 
  Clock, 
  Star,
  ArrowRight,
  Headphones,
  Monitor,
  MapPin,
  CheckCircle,
  User,
  Settings,
  CreditCard,
  History,
  Bell,
  Mail,
  Phone,
  Home,
  Calendar,
  Lock
} from "lucide-react";
import { useLocation } from "wouter";

export default function CustomerHomePage() {
  const [, setLocation] = useLocation();
  const [selectedAccountSection, setSelectedAccountSection] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorSettings, setTwoFactorSettings] = useState({
    smsEnabled: false,
    emailEnabled: false
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true
  });

  const handleProfileUpdate = () => {
    // Validate required fields
    if (!profileData.fullName || !profileData.email || !profileData.username) {
      alert('Please fill in all required fields (Full Name, Email, Username)');
      return;
    }

    // Simulate profile update
    alert('Profile updated successfully!');
    console.log('Profile data:', profileData);
  };

  const handlePasswordChange = () => {
    if (!profileData.currentPassword || !profileData.newPassword || !profileData.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (profileData.newPassword !== profileData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (profileData.newPassword.length < 8) {
      alert('New password must be at least 8 characters long');
      return;
    }

    alert('Password changed successfully!');
    setProfileData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleTwoFactorToggle = (method: 'sms' | 'email') => {
    if (method === 'sms') {
      if (!twoFactorSettings.smsEnabled) {
        // Enable SMS 2FA
        const phoneNumber = profileData.phone || prompt('Please enter your phone number for SMS authentication:');
        if (phoneNumber) {
          setTwoFactorSettings(prev => ({ ...prev, smsEnabled: true }));
          alert('SMS Two-Factor Authentication enabled successfully! You will receive a verification code via SMS when logging in.');
        }
      } else {
        // Disable SMS 2FA
        if (confirm('Are you sure you want to disable SMS Two-Factor Authentication?')) {
          setTwoFactorSettings(prev => ({ ...prev, smsEnabled: false }));
          alert('SMS Two-Factor Authentication has been disabled.');
        }
      }
    } else if (method === 'email') {
      if (!twoFactorSettings.emailEnabled) {
        // Enable Email 2FA
        const email = profileData.email || prompt('Please enter your email address for email authentication:');
        if (email) {
          setTwoFactorSettings(prev => ({ ...prev, emailEnabled: true }));
          alert('Email Two-Factor Authentication enabled successfully! You will receive a verification code via email when logging in.');
        }
      } else {
        // Disable Email 2FA
        if (confirm('Are you sure you want to disable Email Two-Factor Authentication?')) {
          setTwoFactorSettings(prev => ({ ...prev, emailEnabled: false }));
          alert('Email Two-Factor Authentication has been disabled.');
        }
      }
    }
  };

  const handleNotificationToggle = (setting: 'emailNotifications' | 'smsNotifications' | 'marketingEmails') => {
    setNotifications(prev => ({ ...prev, [setting]: !prev[setting] }));
    const settingName = setting === 'emailNotifications' ? 'Email Notifications' : 
                       setting === 'smsNotifications' ? 'SMS Notifications' : 'Marketing Emails';
    const newStatus = !notifications[setting] ? 'enabled' : 'disabled';
    alert(`${settingName} has been ${newStatus}.`);
  };

  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Chat Support",
      description: "Get instant help from our advanced AI assistant for common technical issues",
      action: "Start Chat",
      route: "/chat",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Expert Technicians",
      description: "Connect with verified technicians for complex problems requiring human expertise",
      action: "Find Technician",
      route: "/technician-matching",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Headphones className="h-8 w-8 text-purple-600" />,
      title: "Live Support Chat",
      description: "Real-time chat with technical experts for immediate assistance",
      action: "Start Live Chat",
      route: "/live-support",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <MapPin className="h-8 w-8 text-orange-600" />,
      title: "On-Site Services",
      description: "Book technicians to come to your location for hands-on repairs",
      action: "Book On-Site",
      route: "/phone-support",
      color: "bg-orange-50 border-orange-200"
    }
  ];

  const stats = [
    { label: "Happy Customers", value: "25,000+", icon: <Users className="h-5 w-5" /> },
    { label: "Issues Resolved", value: "150,000+", icon: <CheckCircle className="h-5 w-5" /> },
    { label: "Average Response", value: "< 2 min", icon: <Clock className="h-5 w-5" /> },
    { label: "Customer Rating", value: "4.9/5", icon: <Star className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation title="Customer Portal" backTo="/domains" />
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TechGPT</h1>
                <p className="text-sm text-gray-600">Customer Support</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Customer Account Management</DialogTitle>
                  </DialogHeader>
                  <Tabs value={selectedAccountSection} onValueChange={setSelectedAccountSection}>
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                      <TabsTrigger value="billing">Billing</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Full Name *</label>
                              <Input 
                                placeholder="Enter your full name" 
                                value={profileData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Email Address *</label>
                              <Input 
                                type="email" 
                                placeholder="Enter your email" 
                                value={profileData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Phone Number</label>
                              <Input 
                                type="tel" 
                                placeholder="Enter your phone number" 
                                value={profileData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Username *</label>
                              <Input 
                                placeholder="Choose a username" 
                                value={profileData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-1">Address</label>
                              <Input 
                                placeholder="Enter your address (for onsite services)" 
                                value={profileData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button onClick={handleProfileUpdate}>Update Profile</Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Account Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span>Account Type</span>
                              <Badge variant="outline">Standard Customer</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Member Since</span>
                              <span className="text-sm text-gray-600">January 2025</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Email Verified</span>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Phone Verified</span>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="security" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Password & Security
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Current Password</label>
                              <Input 
                                type="password" 
                                placeholder="Enter current password" 
                                value={profileData.currentPassword}
                                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">New Password</label>
                              <Input 
                                type="password" 
                                placeholder="Enter new password (min 8 characters)" 
                                value={profileData.newPassword}
                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                              <Input 
                                type="password" 
                                placeholder="Confirm new password" 
                                value={profileData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              />
                            </div>
                            <Button onClick={handlePasswordChange}>Change Password</Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Two-Factor Authentication</CardTitle>
                          <CardDescription>
                            Add an extra layer of security to your account
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">SMS Authentication</p>
                                <p className="text-sm text-gray-600">
                                  {twoFactorSettings.smsEnabled 
                                    ? 'Receive codes via SMS' 
                                    : 'Get verification codes sent to your phone'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {twoFactorSettings.smsEnabled && (
                                  <Badge variant="secondary">Active</Badge>
                                )}
                                <Button 
                                  variant={twoFactorSettings.smsEnabled ? "destructive" : "default"}
                                  size="sm"
                                  onClick={() => handleTwoFactorToggle('sms')}
                                >
                                  {twoFactorSettings.smsEnabled ? 'Disable' : 'Enable'}
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">Email Authentication</p>
                                <p className="text-sm text-gray-600">
                                  {twoFactorSettings.emailEnabled 
                                    ? 'Receive codes via email' 
                                    : 'Get verification codes sent to your email'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {twoFactorSettings.emailEnabled && (
                                  <Badge variant="secondary">Active</Badge>
                                )}
                                <Button 
                                  variant={twoFactorSettings.emailEnabled ? "destructive" : "default"}
                                  size="sm"
                                  onClick={() => handleTwoFactorToggle('email')}
                                >
                                  {twoFactorSettings.emailEnabled ? 'Disable' : 'Enable'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="history" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Service History
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Hardware Troubleshooting</span>
                                <Badge variant="outline">Completed</Badge>
                              </div>
                              <p className="text-sm text-gray-600">Computer not starting - resolved with power supply replacement</p>
                              <p className="text-xs text-gray-500 mt-1">January 5, 2025 • Duration: 45 minutes • Cost: $65</p>
                            </div>
                            <div className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Software Installation</span>
                                <Badge variant="outline">Completed</Badge>
                              </div>
                              <p className="text-sm text-gray-600">Installing and configuring development environment</p>
                              <p className="text-xs text-gray-500 mt-1">December 28, 2024 • Duration: 30 minutes • Cost: $45</p>
                            </div>
                            <div className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Network Setup</span>
                                <Badge variant="outline">Completed</Badge>
                              </div>
                              <p className="text-sm text-gray-600">Wi-Fi configuration and router setup</p>
                              <p className="text-xs text-gray-500 mt-1">December 20, 2024 • Duration: 60 minutes • Cost: $85</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="billing" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Card Number</label>
                              <Input placeholder="**** **** **** 1234" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                                <Input placeholder="MM/YY" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">CVV</label>
                                <Input placeholder="123" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Billing Address</label>
                              <Input placeholder="Enter billing address" />
                            </div>
                            <Button>Update Payment Method</Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Billing History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <div>
                                <p className="font-medium">Hardware Support</p>
                                <p className="text-sm text-gray-600">January 5, 2025</p>
                              </div>
                              <span className="font-medium">$65.00</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                              <div>
                                <p className="font-medium">Software Installation</p>
                                <p className="text-sm text-gray-600">December 28, 2024</p>
                              </div>
                              <span className="font-medium">$45.00</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                              <div>
                                <p className="font-medium">Network Setup</p>
                                <p className="text-sm text-gray-600">December 20, 2024</p>
                              </div>
                              <span className="font-medium">$85.00</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="settings" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notification Preferences
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-gray-600">Receive updates about your support requests</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {notifications.emailNotifications && (
                                  <Badge variant="secondary">Active</Badge>
                                )}
                                <Button 
                                  variant={notifications.emailNotifications ? "destructive" : "default"}
                                  size="sm"
                                  onClick={() => handleNotificationToggle('emailNotifications')}
                                >
                                  {notifications.emailNotifications ? 'Disable' : 'Enable'}
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">SMS Notifications</p>
                                <p className="text-sm text-gray-600">Get text messages for urgent updates</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {notifications.smsNotifications && (
                                  <Badge variant="secondary">Active</Badge>
                                )}
                                <Button 
                                  variant={notifications.smsNotifications ? "destructive" : "default"}
                                  size="sm"
                                  onClick={() => handleNotificationToggle('smsNotifications')}
                                >
                                  {notifications.smsNotifications ? 'Disable' : 'Enable'}
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">Marketing Emails</p>
                                <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {notifications.marketingEmails && (
                                  <Badge variant="secondary">Active</Badge>
                                )}
                                <Button 
                                  variant={notifications.marketingEmails ? "destructive" : "default"}
                                  size="sm"
                                  onClick={() => handleNotificationToggle('marketingEmails')}
                                >
                                  {notifications.marketingEmails ? 'Disable' : 'Enable'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Account Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                              <Mail className="h-4 w-4 mr-2" />
                              Download Account Data
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <Settings className="h-4 w-4 mr-2" />
                              Privacy Settings
                            </Button>
                            <Button variant="destructive" className="w-full justify-start">
                              <User className="h-4 w-4 mr-2" />
                              Delete Account
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" onClick={() => setLocation("/dashboard")}>
                Dashboard
              </Button>
              <Button onClick={() => setLocation("/chat")}>
                Get Help Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="bg-blue-100 text-blue-800 border-blue-300 mb-6">
              ⚡ Instant Technical Support
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Get Technical Help
              <span className="text-blue-600"> Instantly</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              From AI-powered instant solutions to expert technician support - we've got you covered. 
              Get help with hardware issues, software problems, and everything in between.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setLocation("/chat")}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Start Free AI Chat
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setLocation("/technician-matching")}
                className="text-lg px-8"
              >
                <Users className="h-5 w-5 mr-2" />
                Find Expert Technician
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Multiple Ways to Get Help
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the support option that works best for your situation and urgency level
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className={`${feature.color} hover:shadow-lg transition-all duration-300 cursor-pointer group`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                        <CardDescription className="text-gray-600">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setLocation(feature.route)}
                    className="w-full group-hover:scale-105 transition-transform"
                    variant="default"
                  >
                    {feature.action}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands</h3>
            <p className="text-lg text-gray-600 mb-8">
              Our platform connects you with verified, experienced technicians who have helped solve 
              over 150,000 technical issues. All technicians are background-checked and rated by customers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="bg-white">✓ 24/7 Availability</Badge>
              <Badge variant="outline" className="bg-white">✓ Verified Technicians</Badge>
              <Badge variant="outline" className="bg-white">✓ Money-Back Guarantee</Badge>
              <Badge variant="outline" className="bg-white">✓ Secure Platform</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-4">Ready to Solve Your Tech Problems?</h3>
          <p className="text-xl mb-8 opacity-90">
            Start with our free AI assistant or connect directly with a human expert
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setLocation("/chat")}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Try AI Assistant (Free)
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setLocation("/technician-matching")}
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8"
            >
              <Users className="h-5 w-5 mr-2" />
              Get Human Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-1 rounded">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">TechGPT</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered technical support platform connecting users with instant solutions and expert technicians.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support Options</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/chat" className="hover:text-white">AI Chat Support</a></li>
                <li><a href="/live-support" className="hover:text-white">Live Chat</a></li>
                <li><a href="/technician-matching" className="hover:text-white">Find Technician</a></li>
                <li><a href="/phone-support" className="hover:text-white">Phone Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/issues" className="hover:text-white">Issue Categories</a></li>
                <li><a href="/triage" className="hover:text-white">AI Triage</a></li>
                <li><a href="/diagnostic" className="hover:text-white">Diagnostics</a></li>
                <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Technicians</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/technicians" className="hover:text-white">Join Platform</a></li>
                <li><a href="/technician-register" className="hover:text-white">Register</a></li>
                <li><a href="/technician-dashboard" className="hover:text-white">Dashboard</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 TechGPT. All rights reserved. Instant technical support powered by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}