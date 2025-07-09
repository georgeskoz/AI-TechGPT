import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/components/UserAuthProvider";
import AuthModal from "@/components/AuthModal";
import { 
  Search, 
  Zap, 
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Star,
  MapPin,
  Phone,
  Monitor,
  Wrench,
  Settings,
  Loader2,
  ArrowRight,
  Upload,
  Camera,
  Image,
  X,
  Eye,
  Calendar,
  DollarSign,
  FileText,
  User
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface IssueAssessment {
  category: string;
  subcategory: string;
  description: string;
  urgency: string;
  location: string;
  serviceType: string;
  deviceType: string;
  symptoms: string[];
  previousAttempts: string;
  timeline: string;
  schedule: string;
  specificTime?: string;
  preferredDate?: string;
}

interface BookingData {
  customerId: number;
  technicianId?: number;
  categoryId: number;
  description: string;
  deviceType?: string;
  previousAttempts?: string;
  expectedBehavior?: string;
  urgency: string;
  serviceType: string;
  scheduledDate?: string;
  location?: string;
  bookingFee: string;
  estimatedCost?: string;
  aiAnalysis?: string;
}

interface BookingSettings {
  sameDayFee: string;
  futureDayFee: string;
}

interface TechnicianMatch {
  id: number;
  name: string;
  skills: string[];
  experience: string;
  rating: number;
  completedJobs: number;
  responseTime: string;
  priceRange: string;
  availability: string;
  distance: string;
  estimatedArrival: string;
  profileImage: string;
  specialties: string[];
  certifications: string[];
}

interface AssessmentResult {
  aiAnalysis: string;
  urgencyLevel: string;
  serviceRecommendation: string;
  estimatedCost: string;
  estimatedDuration: string;
  matchedTechnicians: TechnicianMatch[];
  confidence: number;
  nextSteps: string[];
}

interface ImageAnalysis {
  success: boolean;
  detectedIssue: string;
  errorMessages: string[];
  troubleshootingSteps: string[];
  supportType: string;
  difficultyLevel: string;
  analysis: string;
}

interface IssueCategory {
  id: number;
  name: string;
  description: string;
  subcategories: string[];
  commonSymptoms: string[];
  estimatedDuration: string;
  difficulty: string;
  basePrice: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const steps = [
  { id: 1, title: "Issue Details", description: "Describe your technical issue" },
  { id: 2, title: "Service Preferences", description: "Choose location and timing" },
  { id: 3, title: "Booking Confirmation", description: "Confirm your service request" }
];

const urgencyOptions = [
  { value: "low", label: "Low Priority", description: "Can wait a few days", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium Priority", description: "Needs attention soon", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High Priority", description: "Urgent, same day", color: "bg-orange-100 text-orange-800" },
  { value: "urgent", label: "Critical", description: "Emergency, ASAP", color: "bg-red-100 text-red-800" }
];

const serviceTypes = [
  { value: "onsite", label: "On-Site Visit", description: "Technician comes to you", icon: MapPin },
  { value: "remote", label: "Remote Support", description: "Screen sharing session", icon: Monitor },
  { value: "phone", label: "Phone Support", description: "Guided troubleshooting", icon: Phone }
];

const timelineOptions = [
  { value: "asap", label: "As Soon As Possible", description: "Same day service" },
  { value: "today", label: "Today", description: "Within next few hours" },
  { value: "tomorrow", label: "Tomorrow", description: "Next business day" },
  { value: "week", label: "This Week", description: "Within 7 days" },
  { value: "flexible", label: "Flexible", description: "Any time convenient" }
];

export default function ExpertTechnicianFinder() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const [hasError, setHasError] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [showImageAnalysis, setShowImageAnalysis] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>({ sameDayFee: "20.00", futureDayFee: "30.00" });
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  
  const [assessment, setAssessment] = useState<IssueAssessment>({
    category: '',
    subcategory: '',
    description: '',
    urgency: 'medium',
    location: '',
    serviceType: 'onsite',
    deviceType: '',
    symptoms: [],
    previousAttempts: '',
    timeline: 'asap',
    schedule: 'asap',
    specificTime: '',
    preferredDate: ''
  });

  // Auto-fill location if user has address
  useEffect(() => {
    if (authUser && authUser.address) {
      setAssessment(prev => ({ ...prev, location: authUser.address }));
    }
  }, [authUser]);

  // Fetch booking settings
  const { data: settings } = useQuery({
    queryKey: ['/api/booking-settings'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/booking-settings');
      return response.json();
    }
  });

  // Update booking settings when data changes
  useEffect(() => {
    if (settings) {
      setBookingSettings(settings);
    }
  }, [settings]);

  // Fetch issue categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/issue-categories'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/issue-categories');
      return response.json();
    }
  });

  const assessmentMutation = useMutation({
    mutationFn: async (data: IssueAssessment) => {
      const response = await apiRequest('POST', '/api/assess-issue', data);
      return response.json();
    }
  });

  // Handle assessment results
  useEffect(() => {
    if (assessmentMutation.isSuccess && assessmentMutation.data) {
      setAssessmentResult(assessmentMutation.data);
      setShowResults(true);
      toast({
        title: "Assessment Complete",
        description: `Found ${assessmentMutation.data.matchedTechnicians.length} matching technicians`,
      });
    }
  }, [assessmentMutation.isSuccess, assessmentMutation.data, toast]);

  // Handle assessment errors
  useEffect(() => {
    if (assessmentMutation.isError) {
      toast({
        title: "Assessment Failed",
        description: assessmentMutation.error?.message || "An error occurred",
        variant: "destructive",
      });
    }
  }, [assessmentMutation.isError, assessmentMutation.error, toast]);

  const imageAnalysisMutation = useMutation({
    mutationFn: async ({ image, description }: { image: string; description: string }) => {
      const response = await apiRequest('POST', '/api/analyze-image', { image, description });
      return response.json();
    },
    onError: (error) => {
      console.error("Image analysis error:", error);
      toast({
        title: "Image Analysis Failed",
        description: "Unable to analyze the image. Please try again or continue without image analysis.",
        variant: "destructive",
      });
    }
  });

  // Handle image analysis results
  useEffect(() => {
    if (imageAnalysisMutation.isSuccess && imageAnalysisMutation.data) {
      const result = imageAnalysisMutation.data;
      setImageAnalysis(result);
      setShowImageAnalysis(true);
      
      // Auto-populate description with AI analysis (only if successful)
      if (result.success && result.detectedIssue && result.detectedIssue !== "Unable to identify specific issue") {
        let enhancedDescription = assessment.description + 
          (assessment.description ? '\n\n' : '') + 
          `AI Analysis: ${result.detectedIssue}`;
        if (result.errorMessages && result.errorMessages.length > 0) {
          enhancedDescription += `\nError Messages: ${result.errorMessages.join(', ')}`;
        }
        setAssessment(prev => ({ ...prev, description: enhancedDescription }));
      }
      
      // Show success or failure toast
      if (result.success) {
        toast({
          title: "Image Analysis Complete",
          description: "The image has been analyzed and findings have been added to your description.",
        });
      } else {
        toast({
          title: "Image Analysis Failed",
          description: result.error || "Unable to analyze the image",
          variant: "destructive",
        });
      }
    }
  }, [imageAnalysisMutation.isSuccess, imageAnalysisMutation.data, assessment.description, toast]);

  // Handle image analysis errors
  useEffect(() => {
    if (imageAnalysisMutation.isError) {
      console.error('Image analysis error:', imageAnalysisMutation.error);
      toast({
        title: "Image Analysis Failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive",
      });
    }
  }, [imageAnalysisMutation.isError, imageAnalysisMutation.error, toast]);

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingData) => {
      console.log('Booking data:', data);
      try {
        const response = await apiRequest('POST', '/api/service-bookings', data);
        const result = await response.json();
        console.log('Booking response:', result);
        return result;
      } catch (error) {
        console.error('Booking error:', error);
        throw error;
      }
    },
    onError: (error) => {
      console.error('Booking mutation error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "An error occurred while booking",
        variant: "destructive",
      });
    }
  });

  // Handle booking results
  useEffect(() => {
    if (bookingMutation.isSuccess) {
      setShowBookingConfirmation(true);
      toast({
        title: "Booking Confirmed",
        description: "Your service request has been submitted successfully",
      });
    }
  }, [bookingMutation.isSuccess, toast]);

  // Handle booking errors
  useEffect(() => {
    if (bookingMutation.isError) {
      toast({
        title: "Booking Failed",
        description: bookingMutation.error?.message || "An error occurred",
        variant: "destructive",
      });
    }
  }, [bookingMutation.isError, bookingMutation.error, toast]);

  const handleInputChange = (field: keyof IssueAssessment, value: string | string[]) => {
    setAssessment(prev => ({ ...prev, [field]: value }));
  };

  const handleSymptomToggle = (symptom: string) => {
    setAssessment(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        
        // Extract base64 data
        const base64Data = result.split(',')[1];
        imageAnalysisMutation.mutate({ 
          image: base64Data, 
          description: assessment.description 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAssessment = () => {
    if (!assessment.category || !assessment.description) {
      toast({
        title: "Missing Information",
        description: "Please select a category and provide a description",
        variant: "destructive",
      });
      return;
    }
    assessmentMutation.mutate(assessment);
  };

  const calculateBookingFee = () => {
    const isToday = assessment.timeline === 'today' || assessment.timeline === 'asap';
    return isToday ? parseFloat(bookingSettings.sameDayFee) : parseFloat(bookingSettings.futureDayFee);
  };

  const handleBookingConfirmation = () => {
    // Check if user is logged in
    if (!authUser) {
      setShowAuthModal(true);
      return;
    }

    // Validate required fields
    if (!assessment.category || !assessment.description) {
      toast({
        title: "Missing Information",
        description: "Please select a category and provide a description",
        variant: "destructive",
      });
      return;
    }

    if (!assessment.location) {
      toast({
        title: "Missing Location",
        description: "Please provide your location for the service",
        variant: "destructive",
      });
      return;
    }

    const selectedCategory = categories.find(cat => cat.name === assessment.category);
    if (!selectedCategory) {
      toast({
        title: "Invalid Category",
        description: "Please select a valid category",
        variant: "destructive",
      });
      return;
    }

    const bookingFee = calculateBookingFee();
    const booking: BookingData = {
      customerId: authUser.id,
      categoryId: selectedCategory.id,
      description: assessment.description,
      deviceType: assessment.deviceType || null,
      previousAttempts: assessment.previousAttempts || null,
      urgency: assessment.urgency,
      serviceType: assessment.serviceType,
      scheduledDate: assessment.preferredDate || null,
      location: assessment.location,
      bookingFee: bookingFee.toString(),
      estimatedCost: assessmentResult?.estimatedCost || null,
      aiAnalysis: assessmentResult?.aiAnalysis || null,
    };

    console.log('Submitting booking:', booking);
    setBookingData(booking);
    bookingMutation.mutate(booking);
  };

  const selectedCategory = categories?.find(cat => cat.name === assessment.category);
  const availableSymptoms = selectedCategory?.commonSymptoms || [];
  const progress = (currentStep / steps.length) * 100;

  // Show loading state while fetching data
  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6 pt-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading technician categories...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-6 pt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Expert Technicians
          </h1>
          <p className="text-xl text-gray-600">
            Get matched with qualified technicians for your technical issues
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Step 1: Issue Details */}
        {currentStep === 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Issue Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Issue Category *</label>
                <Select value={assessment.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories && categories.length > 0 ? (
                      categories.map((category: IssueCategory) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        Loading categories...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory Selection */}
              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium mb-2">Subcategory</label>
                  <Select value={assessment.subcategory} onValueChange={(value) => handleInputChange('subcategory', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory.subcategories.map((subcategory: string) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Issue Description *</label>
                <Textarea
                  value={assessment.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your technical issue in detail..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Upload Image (Optional)</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload File
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Take Photo
                  </Button>
                  {uploadedImage && (
                    <Button
                      variant="outline"
                      onClick={() => setShowImageAnalysis(true)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Analysis
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraCapture}
                  className="hidden"
                />
              </div>

              {/* Common Symptoms */}
              {availableSymptoms.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Common Symptoms</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSymptoms.map((symptom) => (
                      <Button
                        key={symptom}
                        variant={assessment.symptoms.includes(symptom) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSymptomToggle(symptom)}
                      >
                        {symptom}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Device Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Device Type</label>
                <Input
                  value={assessment.deviceType}
                  onChange={(e) => handleInputChange('deviceType', e.target.value)}
                  placeholder="e.g., MacBook Pro, iPhone 13, Dell XPS 13"
                />
              </div>

              {/* Previous Attempts */}
              <div>
                <label className="block text-sm font-medium mb-2">Previous Troubleshooting Attempts</label>
                <Textarea
                  value={assessment.previousAttempts}
                  onChange={(e) => handleInputChange('previousAttempts', e.target.value)}
                  placeholder="What have you already tried to fix this issue?"
                  className="min-h-[80px]"
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium mb-2">Urgency Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {urgencyOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={assessment.urgency === option.value ? "default" : "outline"}
                      onClick={() => handleInputChange('urgency', option.value)}
                      className="text-left justify-start p-4 h-auto"
                    >
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleNextStep} disabled={!assessment.category || !assessment.description}>
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Service Preferences */}
        {currentStep === 2 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Service Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Service Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {serviceTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant={assessment.serviceType === type.value ? "default" : "outline"}
                      onClick={() => handleInputChange('serviceType', type.value)}
                      className="p-4 h-auto text-left justify-start"
                    >
                      <div className="flex items-center gap-3">
                        <type.icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location {assessment.serviceType === 'onsite' && '*'}
                </label>
                <Input
                  value={assessment.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder={
                    assessment.serviceType === 'onsite' 
                      ? "Full address for technician visit" 
                      : "Your general location (city, state)"
                  }
                />
                {authUser?.address && (
                  <p className="text-sm text-gray-500 mt-1">
                    Auto-filled from your profile. Update if different location needed.
                  </p>
                )}
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium mb-2">Timeline</label>
                <Select value={assessment.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelineOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Specific Date/Time */}
              {assessment.timeline !== 'asap' && assessment.timeline !== 'today' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Date</label>
                    <Input
                      type="date"
                      value={assessment.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Time</label>
                    <Input
                      type="time"
                      value={assessment.specificTime}
                      onChange={(e) => handleInputChange('specificTime', e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevStep}>
                  Previous
                </Button>
                <Button onClick={handleAssessment}>
                  Find Technicians
                  <Search className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Booking Confirmation */}
        {currentStep === 3 && assessmentResult && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Booking Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Booking Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Service Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Category:</span> {assessment.category}
                  </div>
                  <div>
                    <span className="text-gray-600">Service Type:</span> {assessment.serviceType}
                  </div>
                  <div>
                    <span className="text-gray-600">Urgency:</span> {assessment.urgency}
                  </div>
                  <div>
                    <span className="text-gray-600">Timeline:</span> {assessment.timeline}
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Location:</span> {assessment.location}
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Description:</span> {assessment.description}
                  </div>
                </div>
              </div>

              {/* Booking Fee */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Booking Fee
                </h3>
                <div className="text-2xl font-bold text-blue-600">
                  ${calculateBookingFee().toFixed(2)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {assessment.timeline === 'today' || assessment.timeline === 'asap' 
                    ? 'Same-day booking fee' 
                    : 'Standard booking fee'}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  This fee covers technician matching, scheduling, and booking confirmation to both parties.
                </p>
              </div>

              {/* Estimated Cost */}
              {assessmentResult.estimatedCost && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Estimated Service Cost</h3>
                  <div className="text-lg font-semibold text-green-600">
                    {assessmentResult.estimatedCost}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Final cost will be determined by the technician based on actual work required.
                  </p>
                </div>
              )}

              {/* Matched Technicians */}
              {assessmentResult.matchedTechnicians.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Available Technicians</h3>
                  <div className="space-y-3">
                    {assessmentResult.matchedTechnicians.slice(0, 3).map((tech) => (
                      <div key={tech.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{tech.name}</div>
                              <div className="text-sm text-gray-500">
                                {tech.rating} stars • {tech.completedJobs} jobs • {tech.distance}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{tech.priceRange}</div>
                            <div className="text-sm text-gray-500">{tech.estimatedArrival}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevStep}>
                  Previous
                </Button>
                <Button 
                  onClick={handleBookingConfirmation}
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assessment Results Dialog */}
        <Dialog open={showResults} onOpenChange={setShowResults}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assessment Results</DialogTitle>
            </DialogHeader>
            {assessmentResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        <span className="font-medium">Urgency</span>
                      </div>
                      <Badge className={urgencyOptions.find(u => u.value === assessmentResult.urgencyLevel)?.color}>
                        {assessmentResult.urgencyLevel}
                      </Badge>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Duration</span>
                      </div>
                      <p className="text-sm">{assessmentResult.estimatedDuration}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Cost</span>
                      </div>
                      <p className="text-sm">{assessmentResult.estimatedCost}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{assessmentResult.aiAnalysis}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Matched Technicians ({assessmentResult.matchedTechnicians.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assessmentResult.matchedTechnicians.map((tech) => (
                        <div key={tech.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{tech.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  {tech.rating} ({tech.completedJobs} jobs)
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{tech.priceRange}</div>
                              <div className="text-sm text-gray-500">{tech.estimatedArrival}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Distance:</span> {tech.distance}
                            </div>
                            <div>
                              <span className="text-gray-600">Response Time:</span> {tech.responseTime}
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {tech.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={() => { setShowResults(false); setCurrentStep(3); }}>
                    Continue to Booking
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Image Analysis Dialog */}
        <Dialog open={showImageAnalysis} onOpenChange={setShowImageAnalysis}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Image Analysis Results</DialogTitle>
            </DialogHeader>
            {imageAnalysis && (
              <div className="space-y-4">
                {uploadedImage && (
                  <div className="text-center">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Detected Issue:</h4>
                    <p className="text-gray-700">{imageAnalysis.detectedIssue}</p>
                  </div>
                  {imageAnalysis.errorMessages.length > 0 && (
                    <div>
                      <h4 className="font-medium">Error Messages:</h4>
                      <ul className="list-disc list-inside text-gray-700">
                        {imageAnalysis.errorMessages.map((msg, index) => (
                          <li key={index}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">Recommended Support:</h4>
                    <Badge className="mt-1">{imageAnalysis.supportType}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium">Difficulty Level:</h4>
                    <Badge variant="outline" className="mt-1">{imageAnalysis.difficultyLevel}</Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Booking Confirmation Dialog */}
        <Dialog open={showBookingConfirmation} onOpenChange={setShowBookingConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Booking Confirmed!
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Service Request Submitted</h3>
                <p className="text-green-700">
                  Your booking has been confirmed and both you and the technician will be notified.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Fee:</span>
                  <span className="font-medium">${calculateBookingFee().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Type:</span>
                  <span className="font-medium">{assessment.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeline:</span>
                  <span className="font-medium">{assessment.timeline}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => navigate('/client-dashboard')}>
                  View Dashboard
                </Button>
                <Button onClick={() => setShowBookingConfirmation(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            // Try booking again after successful authentication
            handleBookingConfirmation();
          }}
        />
      </div>
    </div>
  );
}