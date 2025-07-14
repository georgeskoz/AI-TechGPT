import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import SimpleNavigation from "@/components/SimpleNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import type { User } from "@shared/schema";
import { 
  Wrench, 
  Wifi, 
  Monitor, 
  Smartphone, 
  Shield, 
  Database, 
  Globe, 
  Settings,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  ChevronLeft,
  User as UserIcon,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  Zap,
  DollarSign,
  FileText,
  MessageCircle,
  AlertCircle,
  Timer,
  XCircle,
  X,
  Navigation as NavigationIcon
} from "lucide-react";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";

interface Category {
  id: string;
  name: string;
  icon: any;
  description: string;
  basePrice: number;
}

interface ServiceProvider {
  id: number;
  name: string;
  rating: number;
  completedJobs: number;
  hourlyRate: number;
  skills: string[];
  distance: number;
  eta: string;
  availability: "available" | "busy" | "offline";
  image: string;
}

const categories: Category[] = [
  { id: "hardware", name: "Hardware Issues", icon: Wrench, description: "Computer repairs, upgrades", basePrice: 75 },
  { id: "network", name: "Network & WiFi", icon: Wifi, description: "Internet, router problems", basePrice: 65 },
  { id: "software", name: "Software Issues", icon: Monitor, description: "OS, app problems", basePrice: 60 },
  { id: "mobile", name: "Mobile Devices", icon: Smartphone, description: "Phone, tablet issues", basePrice: 55 },
  { id: "security", name: "Security & Virus", icon: Shield, description: "Malware, security setup", basePrice: 85 },
  { id: "database", name: "Database Help", icon: Database, description: "Data recovery, setup", basePrice: 95 },
  { id: "web", name: "Web Development", icon: Globe, description: "Website issues, hosting", basePrice: 80 },
  { id: "system", name: "System Admin", icon: Settings, description: "Server, system setup", basePrice: 90 }
];

const mockServiceProviders: ServiceProvider[] = [
  {
    id: 1,
    name: "Michael Chen",
    rating: 4.9,
    completedJobs: 247,
    hourlyRate: 85,
    skills: ["Hardware", "Network", "Security"],
    distance: 2.3,
    eta: "15-20 min",
    availability: "available",
    image: "/api/placeholder/64/64"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    rating: 4.8,
    completedJobs: 189,
    hourlyRate: 75,
    skills: ["Software", "Mobile", "Web"],
    distance: 3.7,
    eta: "25-30 min",
    availability: "available",
    image: "/api/placeholder/64/64"
  },
  {
    id: 3,
    name: "David Rodriguez",
    rating: 4.7,
    completedJobs: 156,
    hourlyRate: 90,
    skills: ["Database", "System", "Security"],
    distance: 5.1,
    eta: "35-40 min",
    availability: "available",
    image: "/api/placeholder/64/64"
  }
];

export default function QuickServiceProviderRequest() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedServiceProvider, setSelectedServiceProvider] = useState<ServiceProvider | null>(null);
  const [timeSlot, setTimeSlot] = useState("asap");
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [jobRequestSent, setJobRequestSent] = useState(false);
  const [providerResponse, setProviderResponse] = useState<'pending' | 'accepted' | 'rejected' | 'timeout' | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [, setLocationPath] = useLocation();
  
  // Payment method state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentMethodDetails, setPaymentMethodDetails] = useState<any>(null);
  const [isPaymentSetupComplete, setIsPaymentSetupComplete] = useState(false);

  // Get username from localStorage
  const username = localStorage.getItem('username');
  
  // Fetch user profile data
  const { data: user, isLoading: isUserLoading, error: userError } = useQuery({
    queryKey: [`/api/users/${username}`],
    enabled: !!username,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Auto-detect location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation("Current Location");
        },
        () => {
          // Fallback - ask user to enter manually
        }
      );
    }
  }, []);

  // Auto-fill contact information from user profile
  useEffect(() => {
    if (user) {
      setContactInfo({
        name: user.fullName || "",
        phone: user.phone || "",
        email: user.email || ""
      });
      
      // Auto-fill location from user's address
      if (user.street && user.city && user.state) {
        const fullAddress = `${user.street}${user.apartment ? ', ' + user.apartment : ''}, ${user.city}, ${user.state}`;
        setLocation(fullAddress);
      }
    }
  }, [user]);

  // Countdown timer for provider response
  useEffect(() => {
    if (providerResponse === 'pending' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (providerResponse === 'pending' && countdown === 0) {
      setProviderResponse('timeout');
      // In real app, reassign to next provider
      setTimeout(() => {
        setProviderResponse('accepted');
        setStep(9);
      }, 2000);
    }
  }, [providerResponse, countdown]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setStep(2);
  };

  const handleNext = () => {
    if (step < 10) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleServiceProviderSelect = (serviceProvider: ServiceProvider) => {
    setSelectedServiceProvider(serviceProvider);
    setStep(7);
  };

  const handleSendJobRequest = () => {
    setJobRequestSent(true);
    setProviderResponse('pending');
    setCountdown(60);
    setStep(8);
    
    // Simulate provider response after 10 seconds
    setTimeout(() => {
      setProviderResponse('accepted');
      setStep(9);
    }, 10000);
  };

  const handleBookingComplete = () => {
    setStep(10);
    // Set localStorage flag to show active service tracker
    localStorage.setItem('activeServiceBooking', 'true');
  };

  // Handle Call button click
  const handleCall = () => {
    if (selectedServiceProvider?.phone) {
      window.location.href = `tel:${selectedServiceProvider.phone}`;
    } else {
      // Generate a mock phone number for demo
      const demoPhone = `+1-555-0${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
      window.location.href = `tel:${demoPhone}`;
    }
  };

  // Handle Message button click
  const handleMessage = () => {
    // Navigate to service provider chat
    setLocationPath('/service-provider-chat');
  };

  // Handle Track button click
  const handleTrack = () => {
    // Navigate to tracking page
    setLocationPath('/tracking');
  };

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
    setIsPaymentSetupComplete(false);
  };

  const handlePaymentSetupComplete = (method: string, details: any) => {
    setPaymentMethodDetails(details);
    setIsPaymentSetupComplete(true);
  };

  const calculateServiceFee = () => {
    if (!selectedCategory) return 0;
    const baseFee = selectedCategory.basePrice;
    const urgencyMultiplier = timeSlot === "asap" ? 1.2 : 1.0;
    return Math.round(baseFee * urgencyMultiplier);
  };

  // Step 1: Category Selection
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What do you need help with?</h2>
        <p className="text-gray-600">Select the category that best describes your issue</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-500 rounded-lg border-gray-200 bg-white"
            onClick={() => handleCategorySelect(category)}
          >
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <category.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <p className="text-sm font-medium text-green-600">From ${category.basePrice}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Step 2: Issue Details
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your issue</h2>
        <p className="text-gray-600">The more details you provide, the better we can help</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Describe your issue</Label>
          <Textarea
            id="description"
            placeholder="Please describe what's happening, what you've tried, and any error messages..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="location">Service location</Label>
          <Input
            id="location"
            placeholder="Enter your address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1"
            readOnly={!!(user?.street && user?.city && user?.state)}
            disabled={!!(user?.street && user?.city && user?.state)}
          />
          {user?.street && user?.city && user?.state && (
            <p className="text-xs text-gray-500 mt-1">Auto-filled from your profile</p>
          )}
        </div>

        <div>
          <Label>When do you need help?</Label>
          <RadioGroup value={timeSlot} onValueChange={setTimeSlot} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="asap" id="asap" />
              <Label htmlFor="asap">As soon as possible (+20% urgency fee)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="today" id="today" />
              <Label htmlFor="today">Later today</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tomorrow" id="tomorrow" />
              <Label htmlFor="tomorrow">Tomorrow</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible" id="flexible" />
              <Label htmlFor="flexible">I'm flexible</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              placeholder="Full name"
              value={contactInfo.name}
              onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
              className="mt-1"
              readOnly={!!user?.fullName}
              disabled={!!user?.fullName}
            />
            {user?.fullName && (
              <p className="text-xs text-gray-500 mt-1">Auto-filled from your profile</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              placeholder="(555) 123-4567"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
              className="mt-1"
              readOnly={!!user?.phone}
              disabled={!!user?.phone}
            />
            {user?.phone && (
              <p className="text-xs text-gray-500 mt-1">Auto-filled from your profile</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
              className="mt-1"
              readOnly={!!user?.email}
              disabled={!!user?.email}
            />
            {user?.email && (
              <p className="text-xs text-gray-500 mt-1">Auto-filled from your profile</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={!description || !location || !contactInfo.name}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Step 3: Cart Review
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review your service request</h2>
        <p className="text-gray-600">Review the details and pricing before proceeding</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Service Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Service Category</span>
            <span className="font-semibold">{selectedCategory?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Base Service Fee</span>
            <span>${selectedCategory?.basePrice}</span>
          </div>
          {timeSlot === "asap" && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Urgency Fee (20%)</span>
              <span>+${Math.round((selectedCategory?.basePrice || 0) * 0.2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Service Location</span>
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Priority</span>
            <Badge variant={timeSlot === "asap" ? "destructive" : "secondary"}>
              {timeSlot === "asap" ? "ASAP" : "Standard"}
            </Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Service Fee</span>
            <span>${calculateServiceFee()}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Hardware/equipment costs are not included in this service fee. 
                If any parts or equipment are needed, your service provider will discuss options and pricing with you before proceeding.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext}>
          Continue to Agreement
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Step 4: Payment Method Selection
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Payment Method</h2>
        <p className="text-gray-600">Choose how you'd like to pay for the service</p>
      </div>
      
      <PaymentMethodSelector
        selectedMethod={selectedPaymentMethod}
        onMethodChange={handlePaymentMethodChange}
        onSetupComplete={handlePaymentSetupComplete}
        isSetupComplete={isPaymentSetupComplete}
      />
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!selectedPaymentMethod || !isPaymentSetupComplete}
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Step 5: Legal Agreement
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Terms of Service</h2>
        <p className="text-gray-600">Please review and accept our terms to continue</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Service Agreement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg text-sm space-y-2">
            <h4 className="font-semibold">TechGPT Service Terms</h4>
            <p>By using our service, you agree to the following terms:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Service fees are due upon completion of work</li>
              <li>Service providers are independent contractors, not employees</li>
              <li>We strive to match you with qualified service providers based on your needs</li>
              <li>Additional costs for hardware/parts will be discussed before purchase</li>
              <li>You have the right to cancel service before service provider arrives</li>
              <li>Both parties can leave reviews after service completion</li>
              <li>We protect your privacy and data according to our Privacy Policy</li>
              <li>Disputes will be resolved through our customer service team</li>
              <li>Service availability may vary by location</li>
              <li>Emergency services may incur additional fees</li>
            </ul>
            <p className="mt-4 text-xs text-gray-500">
              Last updated: January 2025. Full terms available at techgpt.com/terms
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="agreement"
          checked={agreementAccepted}
          onCheckedChange={(checked) => setAgreementAccepted(checked as boolean)}
        />
        <Label htmlFor="agreement" className="text-sm">
          I have read and agree to the Terms of Service and Privacy Policy
        </Label>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={!agreementAccepted}>
          Find Service Providers
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Step 6: Provider Matching
  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Service Providers</h2>
        <p className="text-gray-600">We found {mockServiceProviders.length} qualified service providers in your area</p>
      </div>

      <div className="space-y-4">
        {mockServiceProviders.map((serviceProvider) => (
          <Card key={serviceProvider.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{serviceProvider.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{serviceProvider.rating} ({serviceProvider.completedJobs} jobs)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{serviceProvider.distance} miles away</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>ETA: {serviceProvider.eta}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {serviceProvider.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">${serviceProvider.hourlyRate}/hr</div>
                  <Button 
                    onClick={() => handleServiceProviderSelect(serviceProvider)}
                    className="mt-2"
                  >
                    Select
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );

  // Step 7: Send Job Request
  const renderStep7 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Selection</h2>
        <p className="text-gray-600">Ready to send your request to {selectedServiceProvider?.name}?</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selected Service Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{selectedServiceProvider?.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{selectedServiceProvider?.rating} rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>ETA: {selectedServiceProvider?.eta}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Category</span>
            <span>{selectedCategory?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Issue</span>
            <span className="text-sm max-w-xs text-right">{description}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location</span>
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service Fee</span>
            <span className="font-semibold">${calculateServiceFee()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleSendJobRequest} className="bg-green-600 hover:bg-green-700">
          <Zap className="w-4 h-4 mr-2" />
          Send Job Request
        </Button>
      </div>
    </div>
  );

  // Step 8: Provider Response
  const renderStep8 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
        <p className="text-gray-600">Waiting for {selectedServiceProvider?.name} to respond...</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            {providerResponse === 'pending' && (
              <>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Timer className="w-8 h-8 text-yellow-600 animate-pulse" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">Response Timer</h3>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{countdown}s</div>
                  <Progress value={((60 - countdown) / 60) * 100} className="w-64" />
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedServiceProvider?.name} has 60 seconds to respond
                  </p>
                </div>
              </>
            )}
            
            {providerResponse === 'timeout' && (
              <>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg text-orange-600">Request Timed Out</h3>
                  <p className="text-gray-600">Reassigning to next available service provider...</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Your request includes:</strong> Job category, estimated duration, your location, 
                distance from service provider, and AI-generated tool recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 9: Provider Accepted
  const renderStep9 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">Request Accepted!</h2>
        <p className="text-gray-600">{selectedServiceProvider?.name} is on the way to your location</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Job Confirmed</h3>
              <p className="text-gray-600">
                Your service provider has been notified and GPS navigation has been activated
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Provider Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{selectedServiceProvider?.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{selectedServiceProvider?.rating} rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>ETA: {selectedServiceProvider?.eta}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="flex items-center gap-2" onClick={handleCall}>
              <Phone className="w-4 h-4" />
              Call
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleMessage}>
              <MessageCircle className="w-4 h-4" />
              Message
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleTrack}>
              <NavigationIcon className="w-4 h-4" />
              Track
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setLocationPath('/chat')}>
          AI Support Chat
        </Button>
        <Button onClick={handleBookingComplete} className="bg-green-600 hover:bg-green-700">
          Continue to Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Step 10: Booking Complete
  const renderStep10 = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Booking Complete!</h2>
        <p className="text-gray-600 mt-2">
          {selectedServiceProvider?.name} will be with you in {selectedServiceProvider?.eta}
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Booking ID</span>
              <span className="text-sm font-mono">#TG-{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Service Provider</span>
              <span className="text-sm font-semibold">{selectedServiceProvider?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Service</span>
              <span className="text-sm">{selectedCategory?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ETA</span>
              <span className="text-sm">{selectedServiceProvider?.eta}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          onClick={() => setLocationPath('/dashboard')}
          className="flex-1"
        >
          View Dashboard
        </Button>
        <Button 
          onClick={() => setLocationPath('/technician-dashboard')}
          className="flex-1"
        >
          View Service Provider Details
        </Button>
      </div>
    </div>
  );

  const getStepTitle = (stepNum: number) => {
    const titles = [
      "Category",
      "Details", 
      "Review",
      "Agreement",
      "Match",
      "Request",
      "Response",
      "Confirmed",
      "Complete"
    ];
    return titles[stepNum - 1];
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <SimpleNavigation 
        title="Request Service Provider" 
        showBackButton={true}
        backTo="/"
      />
      <div className="max-w-3xl mx-auto p-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Request Service Provider</h1>
              <p className="text-gray-600">Get professional technical support</p>
              {user?.fullName && (
                <p className="text-sm text-blue-600 mt-1">
                  Welcome, {user.fullName}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocationPath('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {num}
                  </div>
                  {num < 9 && (
                    <div className={`w-6 h-1 ${
                      step > num ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <span key={num} className="text-center">{getStepTitle(num)}</span>
              ))}
            </div>
          </div>

          {/* Step content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}
          {step === 7 && renderStep7()}
          {step === 8 && renderStep8()}
          {step === 9 && renderStep9()}
          {step === 10 && renderStep10()}
        </div>
      </div>
    </div>
  );
}