import { useState, useRef } from "react";
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
  Eye
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
  budget: string;
  timeline: string;
}

interface MatchedTechnician {
  id: number;
  firstName: string;
  lastName: string;
  businessName: string;
  avatar?: string;
  rating: number;
  completedJobs: number;
  responseTime: number;
  distance: number;
  hourlyRate: number;
  matchScore: number;
  specialties: string[];
  isAvailable: boolean;
  estimatedArrival?: number;
  relevantExperience: string;
}

interface AssessmentResult {
  confidence: number;
  recommendedServiceType: string;
  estimatedDuration: number;
  requiredSkills: string[];
  priorityLevel: string;
  matchedTechnicians: MatchedTechnician[];
  costEstimate: {
    min: number;
    max: number;
    factors: string[];
  };
}

interface ImageAnalysis {
  detectedIssue: string;
  errorMessages: string[];
  troubleshootingSteps: string[];
  recommendedSupportType: string;
  difficultyLevel: string;
  confidence: number;
}

export default function ExpertTechnicianFinder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(null);
  const [showImageAnalysis, setShowImageAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [assessment, setAssessment] = useState<IssueAssessment>({
    category: '',
    subcategory: '',
    description: '',
    urgency: '',
    location: '',
    serviceType: '',
    deviceType: '',
    symptoms: [],
    previousAttempts: '',
    budget: '',
    timeline: ''
  });
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  // Fetch categories from API
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/issue-categories'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/issue-categories');
      return response.json();
    }
  });

  // Convert categories to the format expected by the component
  const formattedCategories = categories.map((cat: any) => ({
    id: cat.id.toString(),
    name: cat.name,
    icon: cat.icon === 'wrench' ? Wrench : 
          cat.icon === 'monitor' ? Monitor :
          cat.icon === 'wifi' ? Settings :
          cat.icon === 'shield' ? Settings :
          cat.icon === 'smartphone' ? Phone :
          cat.icon === 'mail' ? Settings :
          cat.icon === 'printer' ? Settings :
          cat.icon === 'hard-drive' ? Settings :
          Settings
  }));

  const urgencyLevels = [
    { value: 'low', label: 'Low - Within a week', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium - Within 2-3 days', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High - Within 24 hours', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent - Immediate help needed', color: 'bg-red-100 text-red-800' }
  ];

  const serviceTypes = [
    { value: 'remote', label: 'Remote Support', description: 'Screen sharing & remote access' },
    { value: 'phone', label: 'Phone Support', description: 'Voice guidance & troubleshooting' },
    { value: 'onsite', label: 'On-site Visit', description: 'Technician comes to your location' },
    { value: 'consultation', label: 'Consultation', description: 'Expert advice & recommendations' }
  ];

  const assessIssueMutation = useMutation({
    mutationFn: async (issueData: IssueAssessment) => {
      const response = await apiRequest("POST", "/api/technicians/assess-issue", issueData);
      return await response.json();
    },
    onSuccess: (result: AssessmentResult) => {
      setAssessmentResult(result);
      setShowResults(true);
      toast({
        title: "Assessment Complete",
        description: `Found ${result.matchedTechnicians.length} matching technicians`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Assessment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const imageAnalysisMutation = useMutation({
    mutationFn: async ({ image, description }: { image: string; description: string }) => {
      const response = await apiRequest('POST', '/api/analyze-image', { image, description });
      return response.json();
    },
    onSuccess: (result: ImageAnalysis) => {
      setImageAnalysis(result);
      setShowImageAnalysis(true);
      
      // Auto-populate description with AI analysis
      if (result.detectedIssue) {
        let enhancedDescription = assessment.description + 
          (assessment.description ? '\n\n' : '') + 
          `AI Analysis: ${result.detectedIssue}`;
        if (result.errorMessages.length > 0) {
          enhancedDescription += `\nError Messages: ${result.errorMessages.join(', ')}`;
        }
        setAssessment(prev => ({ ...prev, description: enhancedDescription }));
      }
    },
    onError: (error: Error) => {
      console.error('Image analysis error:', error);
      toast({
        title: "Image Analysis Failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive",
      });
    }
  });

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
        const imageDataUrl = e.target?.result as string;
        setUploadedImage(imageDataUrl);
        
        // Analyze image with AI
        imageAnalysisMutation.mutate({
          image: imageDataUrl,
          description: assessment.description
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setUploadedImage(imageDataUrl);
        
        // Analyze image with AI
        imageAnalysisMutation.mutate({
          image: imageDataUrl,
          description: assessment.description
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImageAnalysis(null);
    setShowImageAnalysis(false);
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      assessIssueMutation.mutate(assessment);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepProgress = () => (currentStep / 4) * 100;

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What type of issue are you experiencing?</h2>
        <p className="text-gray-600">Select the category that best describes your problem</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoriesLoading ? (
          <div className="col-span-2 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading categories...</p>
          </div>
        ) : (
          formattedCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  assessment.category === category.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleInputChange('category', category.id)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                  <span className="font-medium">{category.name}</span>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us more about your issue</h2>
        <p className="text-gray-600">Provide details to help us match you with the right expert</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Issue Description *</label>
          <Textarea
            placeholder="Describe your technical issue in detail..."
            value={assessment.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium mb-2">Upload Error Screenshot or Photo</label>
          <p className="text-sm text-gray-600 mb-3">
            Upload a photo of error messages or take a picture with your camera for AI analysis
          </p>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Take Photo
            </Button>
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

          {/* Image Preview */}
          {uploadedImage && (
            <div className="relative">
              <img
                src={uploadedImage}
                alt="Uploaded screenshot"
                className="max-w-full h-auto max-h-64 rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* AI Analysis Results */}
          {imageAnalysisMutation.isPending && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing image...</span>
            </div>
          )}

          {showImageAnalysis && imageAnalysis && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Eye className="h-5 w-5" />
                  AI Image Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-blue-900">Detected Issue:</p>
                  <p className="text-sm text-blue-800">{imageAnalysis.detectedIssue}</p>
                </div>
                
                {imageAnalysis.errorMessages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-blue-900">Error Messages:</p>
                    <ul className="text-sm text-blue-800 list-disc pl-5">
                      {imageAnalysis.errorMessages.map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-blue-900">Recommended Support Type:</p>
                  <Badge variant="secondary" className="text-blue-800">
                    {imageAnalysis.recommendedSupportType}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-blue-900">Confidence: {imageAnalysis.confidence}%</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Device/System Type</label>
          <Select value={assessment.deviceType} onValueChange={(value) => handleInputChange('deviceType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select device type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="windows-pc">Windows PC</SelectItem>
              <SelectItem value="mac">Mac</SelectItem>
              <SelectItem value="linux">Linux</SelectItem>
              <SelectItem value="mobile-android">Android Phone/Tablet</SelectItem>
              <SelectItem value="mobile-ios">iPhone/iPad</SelectItem>
              <SelectItem value="server">Server</SelectItem>
              <SelectItem value="network-equipment">Network Equipment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Previous Troubleshooting Attempts</label>
          <Textarea
            placeholder="What have you already tried to fix this issue?"
            value={assessment.previousAttempts}
            onChange={(e) => handleInputChange('previousAttempts', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Preferences</h2>
        <p className="text-gray-600">Help us understand your urgency and preferred support method</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Urgency Level *</label>
          <div className="grid grid-cols-1 gap-2">
            {urgencyLevels.map((level) => (
              <Card 
                key={level.value}
                className={`cursor-pointer transition-all duration-200 ${
                  assessment.urgency === level.value ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleInputChange('urgency', level.value)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <span className="font-medium">{level.label}</span>
                  <Badge className={level.color}>{level.value.toUpperCase()}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Preferred Service Type</label>
          <div className="grid grid-cols-1 gap-2">
            {serviceTypes.map((type) => (
              <Card 
                key={type.value}
                className={`cursor-pointer transition-all duration-200 ${
                  assessment.serviceType === type.value ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleInputChange('serviceType', type.value)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{type.label}</p>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Final Details</h2>
        <p className="text-gray-600">Location and budget information for technician matching</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Location</label>
          <Input
            placeholder="City, State or ZIP code"
            value={assessment.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Budget Range</label>
          <Select value={assessment.budget} onValueChange={(value) => handleInputChange('budget', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-50">Under $50</SelectItem>
              <SelectItem value="50-100">$50 - $100</SelectItem>
              <SelectItem value="100-200">$100 - $200</SelectItem>
              <SelectItem value="200-500">$200 - $500</SelectItem>
              <SelectItem value="500-plus">$500+</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Preferred Timeline</label>
          <Select value={assessment.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
            <SelectTrigger>
              <SelectValue placeholder="When do you need this resolved?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediately</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="this-week">This week</SelectItem>
              <SelectItem value="next-week">Next week</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!assessmentResult) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfect Match Found!</h2>
          <p className="text-gray-600">
            We found {assessmentResult.matchedTechnicians.length} technicians that match your needs
          </p>
        </div>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Confidence Level</p>
                <p className="text-2xl font-bold text-blue-600">{assessmentResult.confidence}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Duration</p>
                <p className="text-2xl font-bold text-blue-600">{assessmentResult.estimatedDuration}h</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cost Estimate</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${assessmentResult.costEstimate.min}-${assessmentResult.costEstimate.max}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommended Technicians</h3>
          {assessmentResult.matchedTechnicians.slice(0, 3).map((technician) => (
            <Card key={technician.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{technician.firstName} {technician.lastName}</h4>
                      <p className="text-sm text-gray-600">{technician.businessName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{technician.rating}</span>
                        <span className="text-sm text-gray-500">({technician.completedJobs} jobs)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800 mb-2">
                      {technician.matchScore}% Match
                    </Badge>
                    <p className="text-sm text-gray-600">${technician.hourlyRate}/hr</p>
                    <p className="text-sm text-gray-600">{technician.distance} miles away</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600 mb-2">Relevant Experience:</p>
                  <p className="text-sm">{technician.relevantExperience}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      // Navigate to technician matching with pre-filled criteria
                      setLocation(`/technician-matching?preselected=${technician.id}`);
                    }}
                  >
                    Select This Technician
                  </Button>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/technician-matching')}
            className="flex-1"
          >
            View All Technicians
          </Button>
          <Button 
            onClick={() => {
              setShowResults(false);
              setCurrentStep(1);
              setAssessment({
                category: '',
                subcategory: '',
                description: '',
                urgency: '',
                location: '',
                serviceType: '',
                deviceType: '',
                symptoms: [],
                previousAttempts: '',
                budget: '',
                timeline: ''
              });
            }}
            className="flex-1"
          >
            Start New Assessment
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation title="Find Expert Technician" backTo="/customer-home" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!showResults && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Technician</h1>
                <Badge variant="outline">Step {currentStep} of 4</Badge>
              </div>
              <Progress value={getStepProgress()} className="mb-2" />
              <p className="text-sm text-gray-600">
                We'll assess your issue and match you with the best technician for your needs
              </p>
            </div>
          )}
          
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {assessIssueMutation.isPending ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Analyzing Your Issue...</h3>
                  <p className="text-gray-600">Finding the perfect technician match</p>
                </div>
              ) : showResults ? (
                renderResults()
              ) : (
                <>
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                  {currentStep === 4 && renderStep4()}
                  
                  <div className="flex justify-between mt-8">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={handleNextStep}
                      disabled={
                        (currentStep === 1 && !assessment.category) ||
                        (currentStep === 2 && !assessment.description) ||
                        (currentStep === 3 && !assessment.urgency) ||
                        assessIssueMutation.isPending
                      }
                    >
                      {currentStep === 4 ? 'Find Technicians' : 'Next'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}