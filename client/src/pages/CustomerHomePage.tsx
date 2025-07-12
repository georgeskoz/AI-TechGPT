import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  User as UserIcon, 
  MessageSquare,
  Phone,
  Monitor,
  UserCheck
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { apiRequest } from '@/lib/queryClient';
import { canadianProvinces, usStates, countries } from '@/data/locations';

// Schema for customer profile form
const customerProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State/Province is required'),
  country: z.string().min(2, 'Country is required'),
  postalCode: z.string().min(5, 'Postal/ZIP code must be at least 5 characters'),
  preferredContactMethod: z.enum(['email', 'phone', 'text']),
  timeZone: z.string().min(1, 'Time zone is required'),
  businessInfo: z.object({
    companyName: z.string().optional(),
    businessType: z.string().optional(),
    industry: z.string().optional(),
    employeeCount: z.string().optional(),
    annualRevenue: z.string().optional(),
    businessHours: z.string().optional(),
    website: z.string().optional(),
    taxId: z.string().optional()
  }).optional(),
  preferences: z.object({
    communicationFrequency: z.enum(['daily', 'weekly', 'monthly', 'asNeeded']),
    serviceTypes: z.array(z.string()),
    techExpertiseLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    preferredLanguage: z.enum(['en', 'fr', 'es', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ru']),
    newsletter: z.boolean(),
    promotionalEmails: z.boolean(),
    smsNotifications: z.boolean(),
    pushNotifications: z.boolean()
  }).optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().optional()
  }).optional(),
  notes: z.string().optional()
});

type CustomerProfileForm = z.infer<typeof customerProfileSchema>;

export default function CustomerHomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<CustomerProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    preferredContactMethod: 'email',
    timeZone: '',
    businessInfo: {
      companyName: '',
      businessType: '',
      industry: '',
      employeeCount: '',
      annualRevenue: '',
      businessHours: '',
      website: '',
      taxId: ''
    },
    preferences: {
      communicationFrequency: 'asNeeded',
      serviceTypes: [],
      techExpertiseLevel: 'intermediate',
      preferredLanguage: 'en',
      newsletter: false,
      promotionalEmails: false,
      smsNotifications: false,
      pushNotifications: false
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: '',
      email: ''
    },
    notes: ''
  });

  const form = useForm<CustomerProfileForm>({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: profileData,
  });

  const watchedCountry = form.watch('country');

  // Handle input changes
  const handleInputChange = (field: keyof CustomerProfileForm, value: any) => {
    setProfileData(prevData => ({
      ...prevData,
      [field]: value
    }));
    form.setValue(field, value);
  };

  // Handle nested object changes
  const handleNestedChange = (parent: string, field: string, value: any) => {
    setProfileData(prevData => ({
      ...prevData,
      [parent]: {
        ...(prevData[parent as keyof CustomerProfileForm] as any),
        [field]: value
      }
    }));
    form.setValue(`${parent}.${field}` as any, value);
  };

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const response = await apiRequest('GET', '/api/customer/profile?userId=1');
        const data = await response.json();
        if (data) {
          setProfileData(data);
          form.reset(data);
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
      const profileDataWithUserId = { ...data, userId: 1 };
      const response = await apiRequest('POST', '/api/customer/profile', profileDataWithUserId);
      const result = await response.json();
      
      if (result) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get states/provinces based on country
  const getStateOptions = () => {
    if (watchedCountry === 'CA') {
      return canadianProvinces.map(province => ({
        value: province.code,
        label: province.name
      }));
    } else if (watchedCountry === 'US') {
      return usStates.map(state => ({
        value: state.code,
        label: state.name
      }));
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Portal</h1>
          <p className="text-gray-600">Manage your profile and access technical support services</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Chat Support</h3>
                  <p className="text-sm text-gray-600">Get instant help from AI</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone Support</h3>
                  <p className="text-sm text-gray-600">Talk to an expert</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Monitor className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Screen Sharing</h3>
                  <p className="text-sm text-gray-600">Remote assistance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Service Provider</h3>
                  <p className="text-sm text-gray-600">Book a technician</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5" />
              <span>Profile Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="business">Business Info</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter your city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select value={profileData.country} onValueChange={(value) => handleInputChange('country', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Select value={profileData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state/province" />
                        </SelectTrigger>
                        <SelectContent>
                          {getStateOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal/ZIP Code</Label>
                      <Input
                        id="postalCode"
                        value={profileData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        placeholder="Enter postal/ZIP code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                      <Select value={profileData.preferredContactMethod} onValueChange={(value) => handleInputChange('preferredContactMethod', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="text">Text Message</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeZone">Time Zone</Label>
                    <Select value={profileData.timeZone} onValueChange={(value) => handleInputChange('timeZone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="America/Anchorage">Alaska Time (AKT)</SelectItem>
                        <SelectItem value="Pacific/Honolulu">Hawaii Time (HT)</SelectItem>
                        <SelectItem value="America/Toronto">Eastern Time Canada</SelectItem>
                        <SelectItem value="America/Winnipeg">Central Time Canada</SelectItem>
                        <SelectItem value="America/Edmonton">Mountain Time Canada</SelectItem>
                        <SelectItem value="America/Vancouver">Pacific Time Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="business" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={profileData.businessInfo?.companyName || ''}
                        onChange={(e) => handleNestedChange('businessInfo', 'companyName', e.target.value)}
                        placeholder="Enter company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select value={profileData.businessInfo?.businessType || ''} onValueChange={(value) => handleNestedChange('businessInfo', 'businessType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="corporation">Corporation</SelectItem>
                          <SelectItem value="llc">LLC</SelectItem>
                          <SelectItem value="non_profit">Non-Profit</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={profileData.businessInfo?.industry || ''} onValueChange={(value) => handleNestedChange('businessInfo', 'industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="real_estate">Real Estate</SelectItem>
                          <SelectItem value="construction">Construction</SelectItem>
                          <SelectItem value="hospitality">Hospitality</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeCount">Employee Count</Label>
                      <Select value={profileData.businessInfo?.employeeCount || ''} onValueChange={(value) => handleNestedChange('businessInfo', 'employeeCount', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 (Just me)</SelectItem>
                          <SelectItem value="2-10">2-10</SelectItem>
                          <SelectItem value="11-50">11-50</SelectItem>
                          <SelectItem value="51-200">51-200</SelectItem>
                          <SelectItem value="201-500">201-500</SelectItem>
                          <SelectItem value="501-1000">501-1000</SelectItem>
                          <SelectItem value="1000+">1000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="annualRevenue">Annual Revenue</Label>
                      <Select value={profileData.businessInfo?.annualRevenue || ''} onValueChange={(value) => handleNestedChange('businessInfo', 'annualRevenue', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select revenue range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under_100k">Under $100K</SelectItem>
                          <SelectItem value="100k_500k">$100K - $500K</SelectItem>
                          <SelectItem value="500k_1m">$500K - $1M</SelectItem>
                          <SelectItem value="1m_5m">$1M - $5M</SelectItem>
                          <SelectItem value="5m_10m">$5M - $10M</SelectItem>
                          <SelectItem value="10m_50m">$10M - $50M</SelectItem>
                          <SelectItem value="50m_plus">$50M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profileData.businessInfo?.website || ''}
                        onChange={(e) => handleNestedChange('businessInfo', 'website', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessHours">Business Hours</Label>
                      <Input
                        id="businessHours"
                        value={profileData.businessInfo?.businessHours || ''}
                        onChange={(e) => handleNestedChange('businessInfo', 'businessHours', e.target.value)}
                        placeholder="Mon-Fri 9AM-5PM"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID</Label>
                      <Input
                        id="taxId"
                        value={profileData.businessInfo?.taxId || ''}
                        onChange={(e) => handleNestedChange('businessInfo', 'taxId', e.target.value)}
                        placeholder="Enter tax ID"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="communicationFrequency">Communication Frequency</Label>
                      <Select value={profileData.preferences?.communicationFrequency || 'asNeeded'} onValueChange={(value) => handleNestedChange('preferences', 'communicationFrequency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="asNeeded">As Needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="techExpertiseLevel">Technical Expertise Level</Label>
                      <Select value={profileData.preferences?.techExpertiseLevel || 'intermediate'} onValueChange={(value) => handleNestedChange('preferences', 'techExpertiseLevel', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage">Preferred Language</Label>
                    <Select value={profileData.preferences?.preferredLanguage || 'en'} onValueChange={(value) => handleNestedChange('preferences', 'preferredLanguage', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="ko">Korean</SelectItem>
                        <SelectItem value="ru">Russian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Notification Preferences</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="newsletter">Newsletter</Label>
                        <Switch
                          id="newsletter"
                          checked={profileData.preferences?.newsletter || false}
                          onCheckedChange={(checked) => handleNestedChange('preferences', 'newsletter', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="promotionalEmails">Promotional Emails</Label>
                        <Switch
                          id="promotionalEmails"
                          checked={profileData.preferences?.promotionalEmails || false}
                          onCheckedChange={(checked) => handleNestedChange('preferences', 'promotionalEmails', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        <Switch
                          id="smsNotifications"
                          checked={profileData.preferences?.smsNotifications || false}
                          onCheckedChange={(checked) => handleNestedChange('preferences', 'smsNotifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <Switch
                          id="pushNotifications"
                          checked={profileData.preferences?.pushNotifications || false}
                          onCheckedChange={(checked) => handleNestedChange('preferences', 'pushNotifications', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="emergency" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                      <Input
                        id="emergencyName"
                        value={profileData.emergencyContact?.name || ''}
                        onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                        placeholder="Enter emergency contact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelationship">Relationship</Label>
                      <Input
                        id="emergencyRelationship"
                        value={profileData.emergencyContact?.relationship || ''}
                        onChange={(e) => handleNestedChange('emergencyContact', 'relationship', e.target.value)}
                        placeholder="e.g., Spouse, Parent, Sibling"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        value={profileData.emergencyContact?.phoneNumber || ''}
                        onChange={(e) => handleNestedChange('emergencyContact', 'phoneNumber', e.target.value)}
                        placeholder="Enter emergency contact phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyEmail">Emergency Contact Email</Label>
                      <Input
                        id="emergencyEmail"
                        type="email"
                        value={profileData.emergencyContact?.email || ''}
                        onChange={(e) => handleNestedChange('emergencyContact', 'email', e.target.value)}
                        placeholder="Enter emergency contact email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={profileData.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any additional information or special requirements"
                      rows={4}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}