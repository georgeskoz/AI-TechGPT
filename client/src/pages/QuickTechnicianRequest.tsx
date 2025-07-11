import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  User,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  Zap
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: any;
  description: string;
  basePrice: number;
}

interface Technician {
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

const mockTechnicians: Technician[] = [
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

export default function QuickTechnicianRequest() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [timeSlot, setTimeSlot] = useState("asap");
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [, setLocationPath] = useLocation();

  // Auto-detect location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd use reverse geocoding
          setLocation("Current Location");
        },
        () => {
          // Fallback - ask user to enter manually
        }
      );
    }
  }, []);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setStep(2);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleTechnicianSelect = (technician: Technician) => {
    setSelectedTechnician(technician);
    setStep(4);
  };

  const handleBooking = () => {
    // In a real app, this would create the booking
    console.log("Booking created:", {
      category: selectedCategory,
      description,
      location,
      technician: selectedTechnician,
      timeSlot,
      contactInfo
    });
    setStep(5);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">What do you need help with?</h2>
        <p className="text-gray-600 mt-2">Select the category that best describes your issue</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card 
              key={category.id}
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-500"
              onClick={() => handleCategorySelect(category)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                    <div className="mt-1">
                      <Badge variant="secondary">From ${category.basePrice}/hour</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Tell us more about your issue</h2>
        <p className="text-gray-600 mt-2">Optional: Help us find the best technician for you</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Describe your issue (optional)</Label>
          <Textarea
            id="description"
            placeholder="e.g., My computer won't start, blue screen error..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="location">Your location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="location"
              placeholder="Enter your address or ZIP code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} className="flex-1">
            Find Technicians
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Available Technicians</h2>
        <p className="text-gray-600 mt-2">Choose a technician or let us auto-match</p>
      </div>

      <div className="space-y-4">
        {mockTechnicians.map((tech) => (
          <Card 
            key={tech.id}
            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-500"
            onClick={() => handleTechnicianSelect(tech)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Zap className="w-3 h-3 mr-1" />
                      Available Now
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{tech.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">{tech.completedJobs} jobs</span>
                    <span className="text-sm text-gray-600">{tech.distance} mi away</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">ETA: {tech.eta}</span>
                    </div>
                    <span className="font-semibold text-blue-600">${tech.hourlyRate}/hour</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={() => handleTechnicianSelect(mockTechnicians[0])} className="flex-1">
          Auto-Match Best Technician
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Confirm & Book</h2>
        <p className="text-gray-600 mt-2">Final details for your service request</p>
      </div>

      {selectedTechnician && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedTechnician.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedCategory?.name} • ${selectedTechnician.hourlyRate}/hour
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div>
          <Label>When do you need help?</Label>
          <RadioGroup value={timeSlot} onValueChange={setTimeSlot} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="asap" id="asap" />
              <Label htmlFor="asap">As soon as possible</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="today" id="today" />
              <Label htmlFor="today">Later today</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tomorrow" id="tomorrow" />
              <Label htmlFor="tomorrow">Tomorrow</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact-name">Your name</Label>
            <Input
              id="contact-name"
              placeholder="John Doe"
              value={contactInfo.name}
              onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="contact-phone">Phone number</Label>
            <Input
              id="contact-phone"
              placeholder="(555) 123-4567"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="contact-email">Email address</Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="john@example.com"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
            className="mt-1"
          />
        </div>

        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estimated cost</span>
              <span className="font-semibold">${selectedTechnician?.hourlyRate}/hour</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-600">Service fee</span>
              <span className="text-sm text-gray-600">$5</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total (minimum)</span>
              <span className="font-semibold text-blue-600">
                ${(selectedTechnician?.hourlyRate || 0) + 5}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleBooking} className="flex-1">
            <CreditCard className="w-4 h-4 mr-2" />
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
        <p className="text-gray-600 mt-2">
          {selectedTechnician?.name} will be with you in {selectedTechnician?.eta}
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
              <span className="text-sm text-gray-600">Technician</span>
              <span className="text-sm font-semibold">{selectedTechnician?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Service</span>
              <span className="text-sm">{selectedCategory?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ETA</span>
              <span className="text-sm">{selectedTechnician?.eta}</span>
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
          View Technician Details
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {num}
                  </div>
                  {num < 5 && (
                    <div className={`w-8 h-1 ${
                      step > num ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Category</span>
              <span>Details</span>
              <span>Match</span>
              <span>Book</span>
              <span>Done</span>
            </div>
          </div>

          {/* Step content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>
      </div>
    </div>
  );
}