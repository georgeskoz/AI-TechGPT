import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SimpleNavigation from "@/components/SimpleNavigation";
import { 
  User, 
  Zap, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Star,
  MessageSquare,
  Phone,
  Monitor,
  Users,
  Shield,
  Clock,
  Award,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  // Step 1: Profile Setup
  name: string;
  email: string;
  location: string;
  timezone: string;
  
  // Step 2: User Type & Goals
  userType: 'individual' | 'business' | 'student' | 'developer';
  primaryGoals: string[];
  techExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  // Step 3: Tech Support Preferences
  preferredSupportTypes: string[];
  urgencyPreferences: string;
  budgetRange: string;
  availabilitySchedule: string;
  
  // Step 4: Technical Categories
  techCategories: string[];
  specificNeeds: string;
  deviceTypes: string[];
  
  // Step 5: Communication Preferences
  communicationStyle: 'casual' | 'professional' | 'technical';
  notificationPreferences: string[];
  followUpPreferences: string;
}

const STEPS = [
  { id: 1, title: "Profile Setup", description: "Tell us about yourself" },
  { id: 2, title: "User Type & Goals", description: "What brings you here?" },
  { id: 3, title: "Support Preferences", description: "How you like to get help" },
  { id: 4, title: "Technical Categories", description: "Your areas of interest" },
  { id: 5, title: "Communication Style", description: "Personalize your experience" },
  { id: 6, title: "Journey Complete", description: "You're all set!" }
];

const TECH_CATEGORIES = [
  "Web Development", "Hardware Issues", "Network Troubleshooting", 
  "Database Help", "Mobile Devices", "Security Questions", 
  "System Administration", "Software Issues", "Cloud Services"
];

const DEVICE_TYPES = [
  "Desktop PC", "Laptop", "Smartphone", "Tablet", "Server", 
  "Router/Network", "Smart Home", "Gaming Console", "IoT Devices"
];

const SUPPORT_TYPES = [
  { id: "ai_chat", label: "AI Chat Support", icon: MessageSquare, desc: "Quick answers from AI" },
  { id: "live_chat", label: "Live Chat Support", icon: Users, desc: "Real-time human help" },
  { id: "phone_support", label: "Phone Support", icon: Phone, desc: "Voice assistance" },
  { id: "remote_support", label: "Remote Support", icon: Monitor, desc: "Screen sharing help" },
  { id: "onsite_support", label: "On-site Support", icon: User, desc: "In-person assistance" }
];

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: "",
    email: "",
    location: "",
    timezone: "",
    userType: "individual",
    primaryGoals: [],
    techExperience: "intermediate",
    preferredSupportTypes: [],
    urgencyPreferences: "balanced",
    budgetRange: "moderate",
    availabilitySchedule: "flexible",
    techCategories: [],
    specificNeeds: "",
    deviceTypes: [],
    communicationStyle: "professional",
    notificationPreferences: [],
    followUpPreferences: "email"
  });

  const updateData = (field: keyof OnboardingData, value: any) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof OnboardingData, item: string) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter(i => i !== item)
        : [...(prev[field] as string[]), item]
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = () => {
    // Save onboarding data to localStorage
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    localStorage.setItem('onboardingCompleted', 'true');
    
    toast({
      title: "Welcome to TechGPT!",
      description: "Your personalized tech support journey is ready.",
    });
    
    // Redirect based on user type
    if (onboardingData.userType === 'business') {
      setLocation('/customer-home');
    } else {
      setLocation('/chat');
    }
  };

  const skipOnboarding = () => {
    // Mark onboarding as skipped
    localStorage.setItem('onboardingSkipped', 'true');
    
    toast({
      title: "Onboarding Skipped",
      description: "You can access the onboarding wizard anytime from your profile.",
    });
    
    // Redirect to chat page
    setLocation('/chat');
  };

  const getPersonalizedRecommendations = () => {
    const recommendations = [];
    
    if (onboardingData.preferredSupportTypes.includes('ai_chat')) {
      recommendations.push({
        type: "AI Chat",
        description: "Start with our AI assistant for quick answers",
        action: "Try AI Chat",
        route: "/chat"
      });
    }
    
    if (onboardingData.techExperience === 'beginner') {
      recommendations.push({
        type: "Guided Support",
        description: "Step-by-step guidance for your technical journey",
        action: "Get Started",
        route: "/triage"
      });
    }
    
    if (onboardingData.techCategories.includes('Hardware Issues')) {
      recommendations.push({
        type: "Hardware Diagnostics",
        description: "AI-powered hardware troubleshooting",
        action: "Run Diagnostics",
        route: "/diagnostic"
      });
    }
    
    return recommendations;
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SimpleNavigation title="Getting Started" showBackButton={false} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Welcome to TechGPT</h1>
            </div>
            <Badge variant="secondary">Step {currentStep} of {STEPS.length}</Badge>
          </div>
          <Progress value={progress} className="w-full h-3" />
          <div className="flex justify-between mt-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  index + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
                <span className={`text-xs mt-1 ${
                  index + 1 === currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <User className="h-5 w-5" />}
              {currentStep === 2 && <Target className="h-5 w-5" />}
              {currentStep === 3 && <Zap className="h-5 w-5" />}
              {currentStep === 4 && <Monitor className="h-5 w-5" />}
              {currentStep === 5 && <MessageSquare className="h-5 w-5" />}
              {currentStep === 6 && <CheckCircle className="h-5 w-5" />}
              {STEPS[currentStep - 1]?.title}
            </CardTitle>
            <p className="text-gray-600">{STEPS[currentStep - 1]?.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Step 1: Profile Setup */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={onboardingData.name}
                      onChange={(e) => updateData('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={onboardingData.email}
                      onChange={(e) => updateData('email', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State/Country"
                      value={onboardingData.location}
                      onChange={(e) => updateData('location', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={onboardingData.timezone} onValueChange={(value) => updateData('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PST">Pacific Standard Time</SelectItem>
                        <SelectItem value="MST">Mountain Standard Time</SelectItem>
                        <SelectItem value="CST">Central Standard Time</SelectItem>
                        <SelectItem value="EST">Eastern Standard Time</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: User Type & Goals */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">What best describes you?</Label>
                  <RadioGroup value={onboardingData.userType} onValueChange={(value) => updateData('userType', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual">Individual User</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="business" />
                      <Label htmlFor="business">Business Owner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="developer" id="developer" />
                      <Label htmlFor="developer">Developer/IT Professional</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Your technical experience level?</Label>
                  <RadioGroup value={onboardingData.techExperience} onValueChange={(value) => updateData('techExperience', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner">Beginner - I need simple explanations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate">Intermediate - I have some experience</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced">Advanced - I'm comfortable with technical details</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="expert" id="expert" />
                      <Label htmlFor="expert">Expert - I want in-depth technical information</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">What are your primary goals? (Select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["Solve immediate problems", "Learn new skills", "Improve system performance", "Get regular maintenance help", "Find reliable service providers", "Build technical knowledge"].map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={goal}
                          checked={onboardingData.primaryGoals.includes(goal)}
                          onCheckedChange={() => toggleArrayItem('primaryGoals', goal)}
                        />
                        <Label htmlFor={goal} className="text-sm">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Support Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Preferred support types (Select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SUPPORT_TYPES.map((support) => (
                      <Card key={support.id} className={`cursor-pointer transition-all ${
                        onboardingData.preferredSupportTypes.includes(support.id) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`} onClick={() => toggleArrayItem('preferredSupportTypes', support.id)}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <support.icon className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{support.label}</p>
                              <p className="text-sm text-gray-600">{support.desc}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-medium mb-3 block">How urgent are your typical issues?</Label>
                    <RadioGroup value={onboardingData.urgencyPreferences} onValueChange={(value) => updateData('urgencyPreferences', value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="immediate" id="immediate" />
                        <Label htmlFor="immediate">Immediate - I need help right now</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="balanced" id="balanced" />
                        <Label htmlFor="balanced">Balanced - Within a few hours</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flexible" id="flexible" />
                        <Label htmlFor="flexible">Flexible - Within a day or two</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">Budget preference for paid support</Label>
                    <RadioGroup value={onboardingData.budgetRange} onValueChange={(value) => updateData('budgetRange', value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="budget" id="budget" />
                        <Label htmlFor="budget">Budget-friendly ($25-50/hour)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate">Moderate ($50-100/hour)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="premium" id="premium" />
                        <Label htmlFor="premium">Premium ($100+/hour)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Technical Categories */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Which technical areas interest you most?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TECH_CATEGORIES.map((category) => (
                      <Card key={category} className={`cursor-pointer transition-all ${
                        onboardingData.techCategories.includes(category) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`} onClick={() => toggleArrayItem('techCategories', category)}>
                        <CardContent className="p-3 text-center">
                          <p className="text-sm font-medium">{category}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">Device types you commonly use</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {DEVICE_TYPES.map((device) => (
                      <div key={device} className="flex items-center space-x-2">
                        <Checkbox
                          id={device}
                          checked={onboardingData.deviceTypes.includes(device)}
                          onCheckedChange={() => toggleArrayItem('deviceTypes', device)}
                        />
                        <Label htmlFor={device} className="text-sm">{device}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="specificNeeds" className="text-base font-medium mb-3 block">
                    Any specific technical needs or challenges? (Optional)
                  </Label>
                  <Textarea
                    id="specificNeeds"
                    placeholder="Tell us about any specific technical challenges you're facing..."
                    value={onboardingData.specificNeeds}
                    onChange={(e) => updateData('specificNeeds', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Communication Preferences */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Preferred communication style</Label>
                  <RadioGroup value={onboardingData.communicationStyle} onValueChange={(value) => updateData('communicationStyle', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="casual" id="casual" />
                      <Label htmlFor="casual">Casual - Friendly and conversational</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professional" id="professional" />
                      <Label htmlFor="professional">Professional - Clear and business-like</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="technical" id="technical" />
                      <Label htmlFor="technical">Technical - Detailed and precise</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Notification preferences</Label>
                  <div className="space-y-3">
                    {["Email updates", "SMS alerts", "Push notifications", "Weekly summaries"].map((pref) => (
                      <div key={pref} className="flex items-center space-x-2">
                        <Checkbox
                          id={pref}
                          checked={onboardingData.notificationPreferences.includes(pref)}
                          onCheckedChange={() => toggleArrayItem('notificationPreferences', pref)}
                        />
                        <Label htmlFor={pref} className="text-sm">{pref}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Follow-up preferences</Label>
                  <RadioGroup value={onboardingData.followUpPreferences} onValueChange={(value) => updateData('followUpPreferences', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email">Email follow-ups</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="chat" id="chat" />
                      <Label htmlFor="chat">In-app chat follow-ups</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none">No follow-ups</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 6: Journey Complete */}
            {currentStep === 6 && (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TechGPT, {onboardingData.name}!</h3>
                  <p className="text-gray-600">Your personalized tech support journey is ready. Based on your preferences, here are our recommendations:</p>
                </div>

                <div className="space-y-4">
                  {getPersonalizedRecommendations().map((rec, index) => (
                    <Card key={index} className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <p className="font-medium text-blue-900">{rec.type}</p>
                            <p className="text-sm text-blue-700">{rec.description}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(rec.route)}
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                          >
                            {rec.action}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <p className="font-medium text-gray-900">Pro Tips for Your Journey</p>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1 text-left">
                    <li>• Start with AI chat for quick answers - it's free and available 24/7</li>
                    <li>• Use the diagnostic tool for hardware issues before requesting on-site help</li>
                    <li>• Set up your notification preferences to stay updated on your cases</li>
                    <li>• Explore our service provider network for specialized assistance</li>
                  </ul>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            {currentStep < STEPS.length && (
              <Button 
                variant="ghost"
                onClick={skipOnboarding}
                className="text-gray-500 hover:text-gray-700"
              >
                Skip Onboarding
              </Button>
            )}
          </div>
          
          {currentStep < STEPS.length ? (
            <Button 
              onClick={nextStep}
              className="flex items-center gap-2"
              disabled={currentStep === 1 && (!onboardingData.name || !onboardingData.email)}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={completeOnboarding}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              Complete Setup
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}