import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import ActiveServiceTracker from "@/components/ActiveServiceTracker";
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
  Phone,
  Home,
  MessageCircle,
  HelpCircle,
  FileText,
  Book,
  ExternalLink,
  Building2,
  Mail,
  Globe,
  DollarSign,
  TrendingUp,
  BarChart3,
  Calendar,
  Bell,
  Download,
  Plus,
  Trash2,
  Send,
  Smartphone,
  Apple,
  Lock
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Country data
const countries = [
  { code: 'CA', name: 'Canada', flag: '🇨🇦', phoneCode: '+1' },
  { code: 'US', name: 'United States', flag: '🇺🇸', phoneCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', phoneCode: '+44' },
  { code: 'FR', name: 'France', flag: '🇫🇷', phoneCode: '+33' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', phoneCode: '+49' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', phoneCode: '+61' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', phoneCode: '+81' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', phoneCode: '+55' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', phoneCode: '+52' },
  { code: 'IN', name: 'India', flag: '🇮🇳', phoneCode: '+91' },
];

// Canadian provinces
const canadianProvinces = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
  'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
  'Quebec', 'Saskatchewan', 'Yukon'
];

// US states
const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

// Form schema
const customerProfileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  phoneCountryCode: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  preferences: z.object({
    notifications: z.boolean().default(true),
    newsletter: z.boolean().default(false),
    sms: z.boolean().default(false),
    emailSupport: z.boolean().default(true),
  }).optional(),
  businessInfo: z.object({
    isBusinessCustomer: z.boolean().default(false),
    businessName: z.string().optional(),
    businessType: z.string().optional(),
    taxId: z.string().optional(),
    billingAddress: z.string().optional(),
  }).optional(),
});

type CustomerProfileForm = z.infer<typeof customerProfileSchema>;

export default function CustomerHomePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showServiceAnnouncement, setShowServiceAnnouncement] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [profileData, setProfileData] = useState<CustomerProfileForm>({
    fullName: '',
    email: '',
    phoneNumber: '',
    phoneCountryCode: '+1',
    country: 'CA',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    preferences: {
      notifications: true,
      newsletter: false,
      sms: false,
      emailSupport: true,
    },
    businessInfo: {
      isBusinessCustomer: false,
      businessName: '',
      businessType: '',
      taxId: '',
      billingAddress: '',
    },
  });

  const form = useForm<CustomerProfileForm>({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: profileData,
  });

  const watchedCountry = form.watch('country');

  // Handle input changes
  const handleInputChange = (field: keyof CustomerProfileForm, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    form.setValue(field, value);
  };

  // Handle nested object changes
  const handleNestedChange = (parent: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof CustomerProfileForm],
        [field]: value
      }
    }));
    form.setValue(`${parent}.${field}` as any, value);
  };

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const response = await apiRequest('GET', '/api/customer/profile');
        const data = await response.json();
        if (data.success) {
          setProfileData(data.profile);
          form.reset(data.profile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfileData();
  }, []);

  // Save profile data
  const handleSaveProfile = async (data: CustomerProfileForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/customer/profile', data);
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been saved successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Service announcement modal
  useEffect(() => {
    const hasSeenAnnouncement = localStorage.getItem('hasSeenServiceAnnouncement');
    if (!hasSeenAnnouncement) {
      setShowServiceAnnouncement(true);
    }
  }, []);

  const handleCloseAnnouncement = () => {
    setShowServiceAnnouncement(false);
    localStorage.setItem('hasSeenServiceAnnouncement', 'true');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ActiveServiceTracker />
      
      {/* Service Announcement Modal */}
      <Dialog open={showServiceAnnouncement} onOpenChange={setShowServiceAnnouncement}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Service Availability Notice
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Onsite Services</h4>
                <p className="text-sm text-blue-700">
                  Available in the Ottawa–Gatineau region only
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <Globe className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">Online Services</h4>
                <p className="text-sm text-green-700">
                  Available across Canada and United States
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleCloseAnnouncement}>
              Got it, thanks!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome to TechGPT</h1>
                <p className="text-gray-600">Your comprehensive technical support platform</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Customer Portal</Badge>
                <Badge variant="outline">Free Tier</Badge>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-blue-700">AI Support</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">500+</div>
                <div className="text-sm text-green-700">Experts Available</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-purple-700">Issue Resolution</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">5min</div>
                <div className="text-sm text-orange-700">Average Response</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => setLocation('/chat')}
                className="h-auto py-4 flex flex-col items-center space-y-2"
              >
                <MessageSquare className="h-6 w-6" />
                <span>Start AI Chat</span>
              </Button>
              <Button 
                onClick={() => setLocation('/live-support')}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center space-y-2"
              >
                <Headphones className="h-6 w-6" />
                <span>Live Support</span>
              </Button>
              <Button 
                onClick={() => setLocation('/technician-request')}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center space-y-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <Users className="h-6 w-6" />
                <span>Request Technician</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
            <TabsTrigger value="personal">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Chat Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    AI Chat Support
                  </CardTitle>
                  <CardDescription>
                    Get instant help with our AI-powered technical assistant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Availability</span>
                      <Badge variant="secondary">24/7</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cost</span>
                      <Badge variant="secondary">Free</Badge>
                    </div>
                    <Button onClick={() => setLocation('/chat')} className="w-full">
                      Start Chat
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Live Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-green-600" />
                    Live Support
                  </CardTitle>
                  <CardDescription>
                    Connect with human experts for complex issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">First 10 minutes</span>
                      <Badge variant="secondary">Free</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">After 10 minutes</span>
                      <Badge variant="outline">$2/min</Badge>
                    </div>
                    <Button onClick={() => setLocation('/live-support')} className="w-full">
                      Start Live Chat
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Phone Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-purple-600" />
                    Phone Support
                  </CardTitle>
                  <CardDescription>
                    Professional phone support for urgent issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Starting at</span>
                      <Badge variant="outline">$25/call</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Response time</span>
                      <Badge variant="secondary">Under 5 min</Badge>
                    </div>
                    <Button onClick={() => setLocation('/phone-support')} className="w-full">
                      Call Support
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Screen Sharing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-orange-600" />
                    Screen Sharing
                  </CardTitle>
                  <CardDescription>
                    Let experts see and control your screen remotely
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Session rate</span>
                      <Badge variant="outline">$35/session</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Secure connection</span>
                      <Badge variant="secondary">WebRTC</Badge>
                    </div>
                    <Button onClick={() => setLocation('/screen-sharing')} className="w-full">
                      Start Screen Share
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Onsite Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-red-600" />
                    Onsite Support
                  </CardTitle>
                  <CardDescription>
                    Professional technicians come to your location
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Starting at</span>
                      <Badge variant="outline">$75/visit</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Service area</span>
                      <Badge variant="secondary">Ottawa–Gatineau</Badge>
                    </div>
                    <Button onClick={() => setLocation('/technician-request')} className="w-full">
                      Request Technician
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Issue Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Issue Tracking
                  </CardTitle>
                  <CardDescription>
                    Track and manage your technical issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active issues</span>
                      <Badge variant="outline">0</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Resolved issues</span>
                      <Badge variant="secondary">0</Badge>
                    </div>
                    <Button onClick={() => setLocation('/issues')} className="w-full">
                      View Issues
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Overview</CardTitle>
                  <CardDescription>
                    Your account status and subscription details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Account Type</span>
                      <Badge variant="secondary">Free</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Status</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Member since</span>
                      <span className="text-sm text-gray-600">Today</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Services Used</span>
                      <span className="text-sm text-gray-600">0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" className="h-auto py-3 flex flex-col gap-1">
                      <Settings className="h-4 w-4" />
                      <span className="text-xs">Settings</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-auto py-3 flex flex-col gap-1">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-xs">Billing</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-auto py-3 flex flex-col gap-1">
                      <History className="h-4 w-4" />
                      <span className="text-xs">History</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-auto py-3 flex flex-col gap-1">
                      <Download className="h-4 w-4" />
                      <span className="text-xs">Export</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Help & Support Center
                </CardTitle>
                <CardDescription>
                  Get assistance with your account and technical issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <MessageCircle className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium">Live Chat Support</h3>
                      </div>
                      <p className="text-sm text-gray-600">Start a conversation with our support team</p>
                      <Button size="sm" className="mt-2" onClick={() => setLocation('/live-support')}>
                        Start Chat
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <Phone className="h-5 w-5 text-green-600" />
                        <h3 className="font-medium">Phone Support</h3>
                      </div>
                      <p className="text-sm text-gray-600">Call our technical support hotline</p>
                      <p className="text-sm font-medium text-green-600">1-800-TECHGPT</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="h-5 w-5 text-purple-600" />
                        <h3 className="font-medium">Email Support</h3>
                      </div>
                      <p className="text-sm text-gray-600">Send us an email for detailed assistance</p>
                      <p className="text-sm font-medium text-purple-600">support@techgpt.com</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <Book className="h-5 w-5 text-orange-600" />
                        <h3 className="font-medium">Knowledge Base</h3>
                      </div>
                      <p className="text-sm text-gray-600">Browse our comprehensive help articles</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Browse Articles
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-indigo-600" />
                        <h3 className="font-medium">Submit a Ticket</h3>
                      </div>
                      <p className="text-sm text-gray-600">Create a support ticket for complex issues</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Create Ticket
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-pink-600" />
                        <h3 className="font-medium">Community Forum</h3>
                      </div>
                      <p className="text-sm text-gray-600">Connect with other customers and experts</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Join Forum
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phoneCountryCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Country Code</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country code" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country.code} value={country.phoneCode}>
                                    {country.flag} {country.phoneCode} {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country.code} value={country.code}>
                                    {country.flag} {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province/State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select province/state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {watchedCountry === 'CA' && canadianProvinces.map((province) => (
                                  <SelectItem key={province} value={province}>
                                    {province}
                                  </SelectItem>
                                ))}
                                {watchedCountry === 'US' && usStates.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your postal code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Profile"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}