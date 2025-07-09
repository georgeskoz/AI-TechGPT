import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  MapPin, 
  Clock, 
  Star, 
  User, 
  CheckCircle, 
  Phone, 
  MessageSquare,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useLocation } from "wouter";

interface BookingForm {
  category: string;
  description: string;
  location: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  serviceType: 'remote' | 'phone' | 'onsite';
  preferredDate?: string;
}

interface Technician {
  id: number;
  name: string;
  rating: number;
  completedJobs: number;
  skills: string[];
  hourlyRate: number;
  responseTime: string;
  estimatedArrival: string;
  distance: number;
  currentLocation?: string;
  arrivalTime?: string;
  totalMinutes?: number;
}

export default function SimpleBooking() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [form, setForm] = useState<BookingForm>({
    category: '',
    description: '',
    location: '',
    urgency: 'medium',
    serviceType: 'onsite',
    preferredDate: ''
  });
  
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [step, setStep] = useState<'form' | 'technicians' | 'confirmation'>('form');

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/issue-categories'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/issue-categories');
      return response.json();
    }
  });

  // Find technicians mutation
  const findTechniciansMutation = useMutation({
    mutationFn: async (formData: BookingForm) => {
      const response = await apiRequest('POST', '/api/technicians/search', {
        category: formData.category,
        location: formData.location,
        serviceType: formData.serviceType,
        urgency: formData.urgency
      });
      return response.json();
    },
    onSuccess: (data) => {
      setStep('technicians');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to find technicians. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Book technician mutation
  const bookTechnicianMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest('POST', '/api/bookings', bookingData);
      return response.json();
    },
    onSuccess: () => {
      setShowConfirmation(true);
      toast({
        title: "Booking Confirmed!",
        description: "Your technician has been notified and will contact you soon."
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.category || !form.description || !form.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    findTechniciansMutation.mutate(form);
  };

  const handleTechnicianSelect = (technician: Technician) => {
    setSelectedTechnician(technician);
  };

  const handleBooking = () => {
    if (!selectedTechnician) return;

    const selectedCategory = categories?.find(cat => cat.name === form.category);
    const isUrgent = form.urgency === 'urgent';
    const bookingFee = isUrgent ? 0 : 15; // Free for urgent, $15 for scheduled

    const bookingData = {
      customerId: 1, // Demo user
      technicianId: selectedTechnician.id,
      categoryId: selectedCategory?.id,
      description: form.description,
      location: form.location,
      urgency: form.urgency,
      serviceType: form.serviceType,
      scheduledDate: form.preferredDate || null,
      bookingFee: bookingFee.toString(),
      estimatedCost: `$${selectedTechnician.hourlyRate * 2}-$${selectedTechnician.hourlyRate * 4}`,
    };

    bookTechnicianMutation.mutate(bookingData);
  };

  // Calculate ETA based on distance and current time
  const calculateETA = (distance: number, currentLocation: string, customerLocation: string) => {
    const baseTime = Math.round(distance * 15); // 15 minutes per mile average
    const trafficMultiplier = new Date().getHours() >= 7 && new Date().getHours() <= 19 ? 1.2 : 1.0;
    const totalMinutes = Math.round(baseTime * trafficMultiplier);
    
    const now = new Date();
    const eta = new Date(now.getTime() + totalMinutes * 60000);
    
    return {
      minutes: totalMinutes,
      arrivalTime: eta.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      range: `${totalMinutes - 5}-${totalMinutes + 10} min`
    };
  };

  const generateMockTechnicians = (customerLocation: string): Technician[] => {
    const baseTechnicians = [
      {
        id: 1,
        name: "Alex Johnson",
        rating: 4.9,
        completedJobs: 245,
        skills: ["Hardware", "Network", "Software"],
        hourlyRate: 75,
        responseTime: "5 min",
        distance: 2.3,
        currentLocation: "Downtown Tech Hub"
      },
      {
        id: 2,
        name: "Sarah Chen",
        rating: 4.8,
        completedJobs: 198,
        skills: ["Software", "Database", "Web Dev"],
        hourlyRate: 85,
        responseTime: "8 min",
        distance: 4.1,
        currentLocation: "Business District"
      },
      {
        id: 3,
        name: "Mike Rodriguez",
        rating: 4.7,
        completedJobs: 156,
        skills: ["Hardware", "Mobile", "Security"],
        hourlyRate: 70,
        responseTime: "12 min",
        distance: 1.8,
        currentLocation: "Residential Area"
      }
    ];

    return baseTechnicians.map(tech => {
      const eta = calculateETA(tech.distance, tech.currentLocation, customerLocation);
      return {
        ...tech,
        estimatedArrival: eta.range,
        arrivalTime: eta.arrivalTime,
        totalMinutes: eta.minutes
      };
    }).sort((a, b) => a.totalMinutes - b.totalMinutes); // Sort by closest ETA
  };

  const mockTechnicians = generateMockTechnicians(form.location);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-6 pt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book a Technician
          </h1>
          <p className="text-xl text-gray-600">
            Get expert help in 3 simple steps
          </p>
        </div>

        {/* Step 1: Form */}
        {step === 'form' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                Describe Your Issue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="category">Issue Category *</Label>
                  <Select value={form.category} onValueChange={(value) => setForm({...form, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Problem Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your technical issue..."
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Your Location *</Label>
                  <Input
                    id="location"
                    placeholder="Enter your address"
                    value={form.location}
                    onChange={(e) => setForm({...form, location: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select value={form.urgency} onValueChange={(value: any) => setForm({...form, urgency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Within a week</SelectItem>
                        <SelectItem value="medium">Medium - Within 2 days</SelectItem>
                        <SelectItem value="high">High - Today</SelectItem>
                        <SelectItem value="urgent">Urgent - ASAP (FREE)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select value={form.serviceType} onValueChange={(value: any) => setForm({...form, serviceType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">Remote Support</SelectItem>
                        <SelectItem value="phone">Phone Support</SelectItem>
                        <SelectItem value="onsite">On-site Visit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={findTechniciansMutation.isPending}
                >
                  {findTechniciansMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding Technicians...
                    </>
                  ) : (
                    'Find Available Technicians'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Technician Selection */}
        {step === 'technicians' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Available Technicians</h2>
              </div>
              <p className="text-gray-600">Select your preferred technician</p>
            </div>

            <div className="grid gap-4">
              {mockTechnicians.map((technician) => (
                <Card 
                  key={technician.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTechnician?.id === technician.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleTechnicianSelect(technician)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {technician.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{technician.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {technician.rating} ({technician.completedJobs} jobs)
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {technician.responseTime} response
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {technician.distance} miles away
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {technician.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">${technician.hourlyRate}/hr</div>
                        <div className="text-sm text-gray-600">
                          <div>ETA: {technician.arrivalTime}</div>
                          <div>Travel: {technician.estimatedArrival}</div>
                        </div>
                        {selectedTechnician?.id === technician.id && (
                          <CheckCircle className="h-6 w-6 text-blue-500 mt-2 ml-auto" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setStep('form')}>
                Back to Form
              </Button>
              <Button 
                onClick={handleBooking}
                disabled={!selectedTechnician || bookTechnicianMutation.isPending}
                className="min-w-[200px]"
              >
                {bookTechnicianMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  `Book ${selectedTechnician?.name || 'Technician'}`
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Success Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Booking Confirmed!
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-600">
                  {selectedTechnician?.name} has been notified and will contact you shortly.
                </p>
              </div>
              
              {selectedTechnician && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3 text-blue-900">Technician Details</h4>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedTechnician.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-blue-900">{selectedTechnician.name}</div>
                      <div className="text-sm text-blue-700">
                        Currently at: {selectedTechnician.currentLocation}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded">
                      <div className="text-gray-600">Distance</div>
                      <div className="font-medium">{selectedTechnician.distance} miles</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="text-gray-600">Travel Time</div>
                      <div className="font-medium">{selectedTechnician.estimatedArrival}</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="text-gray-600">ETA</div>
                      <div className="font-medium text-green-600">{selectedTechnician.arrivalTime}</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="text-gray-600">Your Location</div>
                      <div className="font-medium">{form.location}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-yellow-800">What's next?</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Technician will call you within 15 minutes</li>
                  <li>• Estimated arrival: {selectedTechnician?.arrivalTime}</li>
                  <li>• Live tracking available in your dashboard</li>
                  <li>• Payment after service completion</li>
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
                  View Dashboard
                </Button>
                <Button onClick={() => navigate('/chat')} className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat Support
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}