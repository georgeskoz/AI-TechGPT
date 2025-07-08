import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { countries, getCountryByCode, getCitiesByState } from "@/data/locations";
import { 
  User, 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  Shield, 
  Award,
  CheckCircle,
  ArrowRight,
  Plus,
  X,
  Upload,
  FileText,
  Download,
  Car,
  IdCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import TechnicianProfilePreview from "@/components/TechnicianProfilePreview";
import TechnicianProfileVisibility from "@/components/TechnicianProfileVisibility";

const technicianSchema = z.object({
  // Personal Information (Required)
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(10, "Complete address is required"),
  
  // Business Information (Optional for individual contractors)
  businessName: z.string().optional(),
  companyName: z.string().optional(),
  experience: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  hourlyRatePercentage: z.number().min(70).max(95).default(85),
  
  // Geographic location
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State/Province is required"),
  city: z.string().min(1, "City is required"),
  serviceRadius: z.number().min(5, "Minimum service radius is 5 miles").max(100, "Maximum service radius is 100 miles"),
  
  // Vehicle Information (Required for on-site services)
  vehicleType: z.enum(["car", "truck", "van", "motorcycle", "bicycle", "none"]),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.number().optional(),
  vehicleLicensePlate: z.string().optional(),
  
  // Profile
  profileDescription: z.string().min(50, "Profile description must be at least 50 characters"),
  responseTime: z.number().min(15, "Minimum response time is 15 minutes").max(240, "Maximum response time is 4 hours"),
});

type TechnicianFormData = z.infer<typeof technicianSchema>;

const techSkills = [
  "PC Hardware Repair", "Network Troubleshooting", "Software Installation", "Virus Removal",
  "Data Recovery", "System Optimization", "Printer Setup", "Wi-Fi Setup", "Smart Home Setup",
  "Mobile Device Repair", "Tablet Repair", "Gaming Console Repair", "Audio/Video Setup",
  "Security System Installation", "Business IT Support", "Mac Support", "Linux Support",
  "Cloud Services", "Database Administration", "Web Development", "Cybersecurity",
  "Server Management", "VPN Setup", "Remote Access Setup", "Email Setup"
];

const serviceCategories = [
  "Hardware Issues", "Software Issues", "Network Troubleshooting", "Mobile Devices",
  "Security Questions", "System Administration", "Database Help", "Web Development",
  "Gaming Support"
];

const languages = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Chinese",
  "Japanese", "Korean", "Arabic", "Hindi", "Russian"
];

const certifications = [
  "CompTIA A+", "CompTIA Network+", "CompTIA Security+", "Microsoft Certified",
  "Cisco Certified", "Apple Certified", "Google IT Support", "AWS Certified",
  "Azure Certified", "Linux Professional", "Certified Ethical Hacker", "ITIL Certified"
];

export default function TechnicianRegistration() {
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [newServiceArea, setNewServiceArea] = useState("");
  const [uploadedCV, setUploadedCV] = useState<File | null>(null);
  const [cvText, setCvText] = useState("");
  const [backgroundCheckFile, setBackgroundCheckFile] = useState<File | null>(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [availableStates, setAvailableStates] = useState<any[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availability, setAvailability] = useState({
    monday: { start: "09:00", end: "17:00", available: true },
    tuesday: { start: "09:00", end: "17:00", available: true },
    wednesday: { start: "09:00", end: "17:00", available: true },
    thursday: { start: "09:00", end: "17:00", available: true },
    friday: { start: "09:00", end: "17:00", available: true },
    saturday: { start: "10:00", end: "16:00", available: false },
    sunday: { start: "10:00", end: "16:00", available: false },
  });

  const { toast } = useToast();

  const form = useForm<TechnicianFormData>({
    resolver: zodResolver(technicianSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      businessName: "",
      companyName: "",
      experience: "intermediate",
      hourlyRatePercentage: 85,
      country: "",
      state: "",
      city: "",
      serviceRadius: 25,
      vehicleType: "car",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: new Date().getFullYear(),
      vehicleLicensePlate: "",
      profileDescription: "",
      responseTime: 60,
    },
    mode: "onChange", // Enable real-time validation and updates
  });

  // Watch form values for real-time preview updates
  const watchedValues = form.watch();

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/technicians/register", data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful!",
        description: "Your technician profile has been created and is pending verification.",
      });
      setStep(5);
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error creating your profile.",
        variant: "destructive",
      });
    },
  });

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedState("");
    form.setValue("country", countryCode);
    form.setValue("state", "");
    form.setValue("city", "");
    
    const country = getCountryByCode(countryCode);
    setAvailableStates(country?.states || []);
    setAvailableCities([]);
  };

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    form.setValue("state", stateCode);
    form.setValue("city", "");
    
    const cities = getCitiesByState(selectedCountry, stateCode);
    setAvailableCities(cities);
  };

  const handleCityChange = (city: string) => {
    form.setValue("city", city);
  };

  const handleSubmit = (data: TechnicianFormData) => {
    console.log("Form data:", data);
    console.log("Form errors:", form.formState.errors);
    
    const registrationData = {
      // Personal Information
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      // Business Information
      businessName: data.businessName,
      companyName: data.companyName,
      experience: data.experience,
      hourlyRate: data.hourlyRatePercentage.toString(), // Convert to string for backend
      // Geographic location
      country: data.country,
      state: data.state,
      city: data.city,
      location: `${data.city}, ${availableStates.find(s => s.code === data.state)?.name}, ${countries.find(c => c.code === data.country)?.name}`,
      serviceRadius: data.serviceRadius,
      // Vehicle Information
      vehicleType: data.vehicleType,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      vehicleYear: data.vehicleYear,
      vehicleLicensePlate: data.vehicleLicensePlate,
      // Document URLs (will be uploaded later via separate endpoint)
      backgroundCheckUrl: null,
      driverLicenseUrl: null,
      insuranceUrl: null,
      // Profile and settings
      profileDescription: data.profileDescription,
      responseTime: data.responseTime,
      // Skills and categories from form state
      skills: selectedSkills,
      categories: selectedCategories,
      languages: selectedLanguages,
      certifications: selectedCertifications,
      serviceAreas,
      availability,
    };

    console.log("Registration data:", registrationData);
    registerMutation.mutate(registrationData);
  };

  const addServiceArea = () => {
    if (newServiceArea && !serviceAreas.includes(newServiceArea)) {
      setServiceAreas([...serviceAreas, newServiceArea]);
      setNewServiceArea("");
    }
  };

  const removeServiceArea = (area: string) => {
    setServiceAreas(serviceAreas.filter(a => a !== area));
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const toggleCertification = (certification: string) => {
    setSelectedCertifications(prev =>
      prev.includes(certification) 
        ? prev.filter(c => c !== certification)
        : [...prev, certification]
    );
  };

  const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedCV(file);
      
      // Read file content for text extraction (simple text files)
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setCvText(text);
          form.setValue('profileDescription', text);
        };
        reader.readAsText(file);
      } else {
        // For PDF/DOC files, just show the file is uploaded - don't auto-fill
        setCvText("");
      }
    }
  };

  const removeCVUpload = () => {
    setUploadedCV(null);
    setCvText("");
  };

  const toggleAvailability = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], available: !prev[day].available }
    }));
  };

  const updateAvailabilityTime = (day: string, field: 'start' | 'end', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const progress = (step / 5) * 100;

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Navigation title="Technician Registration" backTo="/technician-landing" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a TechGPT Technician</h1>
        <p className="text-gray-600">Join our network of skilled technicians and start earning</p>
        <Progress value={progress} className="mt-4" />
        <p className="text-sm text-gray-500 mt-2">Step {step} of 5</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <p className="text-sm text-gray-600">
                Basic personal information required for verification and background checks
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    placeholder="John"
                    className={form.formState.errors.firstName ? "border-red-500" : ""}
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    placeholder="Smith"
                    className={form.formState.errors.lastName ? "border-red-500" : ""}
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="john.smith@email.com"
                    className={form.formState.errors.email ? "border-red-500" : ""}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    {...form.register("phoneNumber")}
                    placeholder="+1 (555) 123-4567"
                    className={form.formState.errors.phoneNumber ? "border-red-500" : ""}
                  />
                  {form.formState.errors.phoneNumber && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.phoneNumber.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="address">Complete Address *</Label>
                <Textarea
                  id="address"
                  {...form.register("address")}
                  placeholder="123 Main Street, Apartment 4B, City, Province/State, Postal/Zip Code"
                  rows={3}
                  className={form.formState.errors.address ? "border-red-500" : ""}
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.address.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Complete address including street, city, province/state, and postal/zip code
                </p>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2"
                  disabled={!form.getValues("firstName") || !form.getValues("lastName") || !form.getValues("email") || !form.getValues("phoneNumber") || !form.getValues("address")}
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name (Optional)</Label>
                  <Input
                    id="businessName"
                    {...form.register("businessName")}
                    placeholder="Your Tech Solutions (if working with a fleet)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Only required if you're a technician working with another fleet, not mandatory for direct work
                  </p>
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input
                    id="companyName"
                    {...form.register("companyName")}
                    placeholder="ABC Tech Company (if applicable)"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Experience Level *</Label>
                  <Select onValueChange={(value) => form.setValue("experience", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (5-10 years)</SelectItem>
                      <SelectItem value="expert">Expert (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hourlyRatePercentage">Revenue Share (%) *</Label>
                  <div className="relative">
                    <Input
                      id="hourlyRatePercentage"
                      type="number"
                      {...form.register("hourlyRatePercentage", { valueAsNumber: true })}
                      placeholder="85"
                      min="70"
                      max="95"
                      disabled
                      className="bg-gray-50"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Revenue percentage set by administrator. You receive 85% of service fees, platform takes 15%
                  </p>
                  <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-2">Estimated Earnings (85% share):</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Remote Support: <span className="font-medium">$21-64/hour</span></div>
                      <div>Phone Support: <span className="font-medium">$26-81/hour</span></div>
                      <div>On-Site Service: <span className="font-medium">$43-170/hour</span></div>
                      <div>Expert Consultation: <span className="font-medium">$128-170/hour</span></div>
                    </div>
                  </div>
                  {form.formState.errors.hourlyRatePercentage && (
                    <p className="text-red-500 text-sm">{form.formState.errors.hourlyRatePercentage.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="profileDescription">Profile Description *</Label>
                <p className="text-sm text-gray-600 mb-3">
                  Tell customers about your technical expertise, specialties, and what makes you unique.
                </p>
                
                <Textarea
                  id="profileDescription"
                  {...form.register("profileDescription")}
                  placeholder="Example: I'm a certified network engineer with 8+ years of experience in troubleshooting complex IT issues. I specialize in network security, hardware diagnostics, and system optimization. What sets me apart is my ability to explain technical concepts in simple terms while providing fast, reliable solutions..."
                  className="min-h-[140px]"
                />
                {form.formState.errors.profileDescription && (
                  <p className="text-red-500 text-sm">{form.formState.errors.profileDescription.message}</p>
                )}

                {/* Optional CV Upload Helper */}
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Optional: Upload CV to reference</span>
                  </div>
                  
                  {!uploadedCV ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleCVUpload}
                        className="hidden"
                        id="cv-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('cv-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload CV/Resume
                      </Button>
                      <span className="text-xs text-gray-500">
                        PDF, DOC, DOCX, TXT (Max 5MB)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md border">
                      <FileText className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{uploadedCV.name}</p>
                        <p className="text-xs text-gray-500">
                          {(uploadedCV.size / 1024).toFixed(1)} KB - Use as reference while writing above
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeCVUpload}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setStep(3)} className="flex items-center gap-2">
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Information
              </CardTitle>
              <p className="text-sm text-gray-600">
                Vehicle details required for on-site service verification
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vehicleType">Vehicle Type *</Label>
                <Select onValueChange={(value) => form.setValue("vehicleType", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="bicycle">Bicycle</SelectItem>
                    <SelectItem value="none">No Vehicle (Remote/Phone Support Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.watch("vehicleType") !== "none" && form.watch("vehicleType") !== "bicycle" && (
                <>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="vehicleMake">Make</Label>
                      <Input
                        id="vehicleMake"
                        {...form.register("vehicleMake")}
                        placeholder="Toyota"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicleModel">Model</Label>
                      <Input
                        id="vehicleModel"
                        {...form.register("vehicleModel")}
                        placeholder="Camry"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicleYear">Year</Label>
                      <Input
                        id="vehicleYear"
                        type="number"
                        {...form.register("vehicleYear", { valueAsNumber: true })}
                        placeholder="2020"
                        min={1980}
                        max={new Date().getFullYear() + 1}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="vehicleLicensePlate">License Plate</Label>
                    <Input
                      id="vehicleLicensePlate"
                      {...form.register("vehicleLicensePlate")}
                      placeholder="ABC-1234"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <Button type="button" onClick={() => setStep(1)} variant="outline">
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setStep(4)}
                  className="flex items-center gap-2"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IdCard className="h-5 w-5" />
                Document Upload
              </CardTitle>
              <p className="text-sm text-gray-600">
                Upload required documents for verification and approval
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="backgroundCheck">Police Background Check *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-sm text-gray-600">
                    <label htmlFor="backgroundCheck" className="cursor-pointer">
                      <span className="text-blue-600 font-medium hover:text-blue-500">
                        Click to upload
                      </span>
                      {" "}or drag and drop
                    </label>
                    <input
                      id="backgroundCheck"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => setBackgroundCheckFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                  {backgroundCheckFile && (
                    <p className="mt-2 text-sm text-green-600">✓ {backgroundCheckFile.name}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="driverLicense">Driver's License (if applicable)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-sm text-gray-600">
                    <label htmlFor="driverLicense" className="cursor-pointer">
                      <span className="text-blue-600 font-medium hover:text-blue-500">
                        Click to upload
                      </span>
                      {" "}or drag and drop
                    </label>
                    <input
                      id="driverLicense"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => setDriverLicenseFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                  {driverLicenseFile && (
                    <p className="mt-2 text-sm text-green-600">✓ {driverLicenseFile.name}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="insurance">Vehicle Insurance (if applicable)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-sm text-gray-600">
                    <label htmlFor="insurance" className="cursor-pointer">
                      <span className="text-blue-600 font-medium hover:text-blue-500">
                        Click to upload
                      </span>
                      {" "}or drag and drop
                    </label>
                    <input
                      id="insurance"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => setInsuranceFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                  {insuranceFile && (
                    <p className="mt-2 text-sm text-green-600">✓ {insuranceFile.name}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" onClick={() => setStep(2)} variant="outline">
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setStep(5)}
                  className="flex items-center gap-2"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Service Area & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  📍 Please select your service location to continue with registration
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleCountryChange("US");
                      setTimeout(() => handleStateChange("CA"), 100);
                      setTimeout(() => handleCityChange("Los Angeles"), 200);
                    }}
                    className="text-xs"
                  >
                    Quick: US - California - Los Angeles
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleCountryChange("CA");
                      setTimeout(() => handleStateChange("QC"), 100);
                      setTimeout(() => handleCityChange("Gatineau"), 200);
                    }}
                    className="text-xs"
                  >
                    Quick: Canada - Quebec - Gatineau
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select 
                    value={form.watch("country")} 
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger className={form.formState.errors.country ? "border-red-500" : ""}>
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
                  {form.formState.errors.country && (
                    <p className="text-red-500 text-sm">{form.formState.errors.country.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="state">State/Province *</Label>
                  <Select 
                    value={form.watch("state")} 
                    onValueChange={handleStateChange}
                    disabled={!selectedCountry}
                  >
                    <SelectTrigger className={form.formState.errors.state ? "border-red-500" : ""}>
                      <SelectValue placeholder={selectedCountry ? "Select state/province" : "Select country first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStates.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.state && (
                    <p className="text-red-500 text-sm">{form.formState.errors.state.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Select 
                    value={form.watch("city")} 
                    onValueChange={handleCityChange}
                    disabled={!selectedState}
                  >
                    <SelectTrigger className={form.formState.errors.city ? "border-red-500" : ""}>
                      <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.city && (
                    <p className="text-red-500 text-sm">{form.formState.errors.city.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceRadius">Service Radius (miles) *</Label>
                  <Input
                    id="serviceRadius"
                    type="number"
                    {...form.register("serviceRadius", { valueAsNumber: true })}
                    placeholder="25"
                    min="5"
                    max="100"
                  />
                  {form.formState.errors.serviceRadius && (
                    <p className="text-red-500 text-sm">{form.formState.errors.serviceRadius.message}</p>
                  )}
                </div>
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    <p>Selected Location:</p>
                    <p className="font-medium">
                      {form.watch("city") && form.watch("state") && form.watch("country") 
                        ? `${form.watch("city")}, ${availableStates.find(s => s.code === form.watch("state"))?.name}, ${countries.find(c => c.code === form.watch("country"))?.name}`
                        : "Please select location"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label>Additional Service Areas</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newServiceArea}
                    onChange={(e) => setNewServiceArea(e.target.value)}
                    placeholder="Add additional service area"
                  />
                  <Button type="button" onClick={addServiceArea} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {serviceAreas.map((area) => (
                    <Badge key={area} variant="secondary" className="flex items-center gap-1">
                      {area}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeServiceArea(area)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="responseTime">Average Response Time (minutes) *</Label>
                <Input
                  id="responseTime"
                  type="number"
                  {...form.register("responseTime", { valueAsNumber: true })}
                  placeholder="60"
                  min="15"
                  max="240"
                />
                {form.formState.errors.responseTime && (
                  <p className="text-red-500 text-sm">{form.formState.errors.responseTime.message}</p>
                )}
              </div>

              <div className="flex justify-between">
                <Button type="button" onClick={() => setStep(3)} variant="outline">
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(5)} className="flex items-center gap-2">
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Skills & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Technical Skills * (Select at least 3)</Label>
                <div className="grid md:grid-cols-3 gap-2 mt-2">
                  {techSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={() => toggleSkill(skill)}
                      />
                      <Label htmlFor={skill} className="text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
                {selectedSkills.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">Please select at least 3 skills</p>
                )}
              </div>

              <div>
                <Label>Service Categories * (Select at least 2)</Label>
                <div className="grid md:grid-cols-3 gap-2 mt-2">
                  {serviceCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={category} className="text-sm">{category}</Label>
                    </div>
                  ))}
                </div>
                {selectedCategories.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">Please select at least 2 categories</p>
                )}
              </div>

              <div>
                <Label>Languages Spoken</Label>
                <div className="grid md:grid-cols-4 gap-2 mt-2">
                  {languages.map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox
                        id={language}
                        checked={selectedLanguages.includes(language)}
                        onCheckedChange={() => toggleLanguage(language)}
                      />
                      <Label htmlFor={language} className="text-sm">{language}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Certifications</Label>
                <div className="grid md:grid-cols-3 gap-2 mt-2">
                  {certifications.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Checkbox
                        id={cert}
                        checked={selectedCertifications.includes(cert)}
                        onCheckedChange={() => toggleCertification(cert)}
                      />
                      <Label htmlFor={cert} className="text-sm">{cert}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" onClick={() => setStep(2)} variant="outline">
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setStep(4)} 
                  className="flex items-center gap-2"
                  disabled={selectedSkills.length < 3 || selectedCategories.length < 2}
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Availability Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {Object.entries(availability).map(([day, schedule]) => (
                  <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={schedule.available}
                        onCheckedChange={() => toggleAvailability(day)}
                      />
                      <Label className="font-medium capitalize">{day}</Label>
                    </div>
                    {schedule.available && (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={schedule.start}
                          onChange={(e) => updateAvailabilityTime(day, 'start', e.target.value)}
                          className="w-24"
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={schedule.end}
                          onChange={(e) => updateAvailabilityTime(day, 'end', e.target.value)}
                          className="w-24"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button type="button" onClick={() => setStep(3)} variant="outline">
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={registerMutation.isPending}
                  className="flex items-center gap-2"
                  onClick={() => {
                    const errors = form.formState.errors;
                    console.log("Form validation errors:", errors);
                    console.log("Form is valid:", form.formState.isValid);
                    console.log("Form values:", form.getValues());
                  }}
                >
                  {registerMutation.isPending ? "Registering..." : "Complete Registration"}
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Registration Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Welcome to TechGPT!</h3>
                <p className="text-green-700 mb-4">
                  Your technician profile has been successfully created. Here's what happens next:
                </p>
                <ul className="space-y-2 text-green-700">
                  <li>• Profile verification (24-48 hours)</li>
                  <li>• Background check completion</li>
                  <li>• Skills assessment scheduling</li>
                  <li>• Platform training access</li>
                  <li>• Job notifications activation</li>
                </ul>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={() => window.location.href = '/technician-dashboard'}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
          </form>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-4 space-y-4">
          <TechnicianProfilePreview
            formData={watchedValues}
            selectedSkills={selectedSkills}
            selectedCategories={selectedCategories}
            selectedLanguages={selectedLanguages}
            selectedCertifications={selectedCertifications}
            serviceAreas={serviceAreas}
          />
          
          {/* Enhanced Profile Visibility Preview */}
          <TechnicianProfileVisibility
            technicianData={{
              ...watchedValues,
              skills: selectedSkills,
              categories: selectedCategories,
              languages: selectedLanguages,
              certifications: selectedCertifications,
              serviceAreas: serviceAreas,
              rating: "5.0",
              completedJobs: 0,
              isVerified: false,
              isActive: true
            }}
          />
        </div>
      </div>
    </div>
  );
}