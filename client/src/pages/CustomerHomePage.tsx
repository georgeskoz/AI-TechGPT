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
  Lock,
  Plus,
  Trash2,
  Download,
  Send,
  Apple,
  Smartphone
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

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'card', last4: '1234', brand: 'Visa', expiry: '12/26', isDefault: true },
    { id: 2, type: 'card', last4: '5678', brand: 'Mastercard', expiry: '08/25', isDefault: false }
  ]);

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

  const handleRemoveCard = (cardId: number) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(prev => prev.filter(card => card.id !== cardId));
      alert('Payment method removed successfully.');
    }
  };

  const handleAddCard = () => {
    const newCard = {
      id: Date.now(),
      type: 'card',
      last4: '9999',
      brand: 'Visa',
      expiry: '12/27',
      isDefault: false
    };
    setPaymentMethods(prev => [...prev, newCard]);
    alert('New payment method added successfully.');
  };

  const handleApplePay = () => {
    alert('Apple Pay setup initiated. Please complete the setup on your device.');
  };

  const handleExportPDF = (invoice: any) => {
    alert(`Exporting invoice for ${invoice.service} (${invoice.date}) to PDF...`);
  };

  const handleEmailInvoice = (invoice: any) => {
    const email = prompt('Enter email address to send invoice:');
    if (email) {
      alert(`Invoice for ${invoice.service} sent to ${email}`);
    }
  };

  const handleDownloadAccountData = () => {
    alert('Preparing your account data for download. This may take a few minutes. You will receive an email when your data is ready.');
  };

  const handlePrivacySettings = () => {
    alert('Privacy settings updated. You can control data sharing, visibility, and communication preferences.');
  };

  const handleDeleteAccount = () => {
    const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.');
    if (confirmation) {
      const finalConfirmation = confirm('This will permanently delete your account and all associated data. Type "DELETE" to confirm.');
      if (finalConfirmation) {
        alert('Account deletion initiated. You will receive a confirmation email within 24 hours.');
      }
    }
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
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                                  onClick={() => handleTwoFactorToggle('sms')}
                                >
                                  {twoFactorSettings.smsEnabled ? '🔓 Disable' : '🔒 Enable'}
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
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                                  onClick={() => handleTwoFactorToggle('email')}
                                >
                                  {twoFactorSettings.emailEnabled ? '🔓 Disable' : '🔒 Enable'}
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
                          <div className="space-y-4">
                            <div className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Monitor className="h-5 w-5 text-blue-600" />
                                  <span className="font-semibold text-lg">Hardware Troubleshooting</span>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-700 font-medium">Issue: Computer not starting - resolved with power supply replacement</p>
                                <p className="text-sm text-gray-600">
                                  <strong>Details:</strong> Customer reported desktop computer wouldn't power on. Diagnosed faulty power supply unit (PSU) after testing with multimeter. Replaced 650W PSU with new 750W unit. Verified all components working properly. Tested system stability for 15 minutes.
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Technician:</strong> Mike Johnson • <strong>Service Type:</strong> On-site
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                  <span>📅 January 5, 2025</span>
                                  <span>⏱️ Duration: 45 minutes</span>
                                  <span>💰 Cost: $65.00</span>
                                  <span>⭐ Rating: 5/5</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Settings className="h-5 w-5 text-purple-600" />
                                  <span className="font-semibold text-lg">Software Installation</span>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-700 font-medium">Issue: Installing and configuring development environment</p>
                                <p className="text-sm text-gray-600">
                                  <strong>Details:</strong> Set up complete web development environment including Node.js, VS Code, Git, and Docker. Configured development server, installed necessary extensions, and created project templates. Provided documentation and quick start guide.
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Technician:</strong> Sarah Chen • <strong>Service Type:</strong> Remote
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                  <span>📅 December 28, 2024</span>
                                  <span>⏱️ Duration: 30 minutes</span>
                                  <span>💰 Cost: $45.00</span>
                                  <span>⭐ Rating: 4/5</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-5 w-5 text-green-600" />
                                  <span className="font-semibold text-lg">Network Setup</span>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-700 font-medium">Issue: Wi-Fi configuration and router setup</p>
                                <p className="text-sm text-gray-600">
                                  <strong>Details:</strong> Configured new mesh Wi-Fi system covering 3000 sq ft home. Set up main router and 2 satellite units. Optimized channel settings for minimal interference. Configured guest network and parental controls. Speed test showed 95% of ISP bandwidth throughout home.
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Technician:</strong> David Martinez • <strong>Service Type:</strong> On-site
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                  <span>📅 December 20, 2024</span>
                                  <span>⏱️ Duration: 60 minutes</span>
                                  <span>💰 Cost: $85.00</span>
                                  <span>⭐ Rating: 5/5</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-5 w-5 text-red-600" />
                                  <span className="font-semibold text-lg">Security Audit</span>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-700 font-medium">Issue: Comprehensive security assessment and hardening</p>
                                <p className="text-sm text-gray-600">
                                  <strong>Details:</strong> Performed full security audit of home network and devices. Updated router firmware, changed default passwords, enabled WPA3 encryption. Installed antivirus on all devices, configured firewalls, and set up automatic security updates. Provided security best practices guide.
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Technician:</strong> Alex Thompson • <strong>Service Type:</strong> Remote + On-site
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                  <span>📅 December 15, 2024</span>
                                  <span>⏱️ Duration: 90 minutes</span>
                                  <span>💰 Cost: $120.00</span>
                                  <span>⭐ Rating: 5/5</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-5 w-5 text-orange-600" />
                                  <span className="font-semibold text-lg">Phone Support Session</span>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-700 font-medium">Issue: Email client configuration and troubleshooting</p>
                                <p className="text-sm text-gray-600">
                                  <strong>Details:</strong> Guided customer through Outlook setup with new email provider. Configured IMAP settings, SSL encryption, and folder synchronization. Resolved sending issues by updating SMTP port settings. Tested email functionality and set up mobile sync.
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Technician:</strong> Lisa Rodriguez • <strong>Service Type:</strong> Phone Support
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                  <span>📅 December 10, 2024</span>
                                  <span>⏱️ Duration: 25 minutes</span>
                                  <span>💰 Cost: $35.00</span>
                                  <span>⭐ Rating: 4/5</span>
                                </div>
                              </div>
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
                          <div className="space-y-6">
                            <div className="space-y-4">
                              <h3 className="font-medium text-gray-900 mb-3">Saved Payment Methods</h3>
                              {paymentMethods.map((method) => (
                                <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <CreditCard className="h-5 w-5 text-gray-600" />
                                    <div>
                                      <p className="font-medium">{method.brand} •••• {method.last4}</p>
                                      <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                                    </div>
                                    {method.isDefault && (
                                      <Badge variant="secondary">Default</Badge>
                                    )}
                                  </div>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleRemoveCard(method.id)}
                                    className="flex items-center gap-1"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Remove
                                  </Button>
                                </div>
                              ))}
                            </div>
                            
                            <div className="space-y-3">
                              <h3 className="font-medium text-gray-900">Add New Payment Method</h3>
                              <div className="grid grid-cols-2 gap-3">
                                <Button 
                                  variant="outline" 
                                  onClick={handleAddCard}
                                  className="flex items-center gap-2"
                                >
                                  <Plus className="h-4 w-4" />
                                  Add Card
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={handleApplePay}
                                  className="flex items-center gap-2"
                                >
                                  <Apple className="h-4 w-4" />
                                  Apple Pay
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-4 pt-4 border-t">
                              <h3 className="font-medium text-gray-900">Add New Card</h3>
                              <div>
                                <label className="block text-sm font-medium mb-1">Card Number</label>
                                <Input placeholder="1234 5678 9012 3456" />
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
                              <Button className="w-full">Add Payment Method</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Billing History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { id: 1, service: 'Hardware Support', date: 'January 5, 2025', amount: '$65.00', invoice: 'INV-2025-001' },
                              { id: 2, service: 'Software Installation', date: 'December 28, 2024', amount: '$45.00', invoice: 'INV-2024-089' },
                              { id: 3, service: 'Network Setup', date: 'December 20, 2024', amount: '$85.00', invoice: 'INV-2024-088' },
                              { id: 4, service: 'Security Audit', date: 'December 15, 2024', amount: '$120.00', invoice: 'INV-2024-087' },
                              { id: 5, service: 'Phone Support', date: 'December 10, 2024', amount: '$35.00', invoice: 'INV-2024-086' }
                            ].map((invoice) => (
                              <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">{invoice.service}</p>
                                      <p className="text-sm text-gray-600">{invoice.date} • {invoice.invoice}</p>
                                    </div>
                                    <span className="font-medium text-lg">{invoice.amount}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleExportPDF(invoice)}
                                    className="flex items-center gap-1"
                                  >
                                    <Download className="h-4 w-4" />
                                    PDF
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEmailInvoice(invoice)}
                                    className="flex items-center gap-1"
                                  >
                                    <Send className="h-4 w-4" />
                                    Email
                                  </Button>
                                </div>
                              </div>
                            ))}
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
                                  className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                                  onClick={() => handleNotificationToggle('emailNotifications')}
                                >
                                  {notifications.emailNotifications ? '🔕 Disable' : '🔔 Enable'}
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
                                  className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                                  onClick={() => handleNotificationToggle('smsNotifications')}
                                >
                                  {notifications.smsNotifications ? '🔕 Disable' : '🔔 Enable'}
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
                                  className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                                  onClick={() => handleNotificationToggle('marketingEmails')}
                                >
                                  {notifications.marketingEmails ? '🔕 Disable' : '🔔 Enable'}
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
                            <Button 
                              variant="outline" 
                              className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-colors"
                              onClick={handleDownloadAccountData}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Account Data
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start hover:bg-gray-50 hover:text-gray-700 transition-colors"
                              onClick={handlePrivacySettings}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Privacy Settings
                            </Button>
                            <Button 
                              variant="destructive" 
                              className="w-full justify-start hover:bg-red-600 hover:text-white transition-colors"
                              onClick={handleDeleteAccount}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
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