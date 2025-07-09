import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Phone, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Navigation from '@/components/Navigation';

interface ServiceProvider {
  id: number;
  name: string;
  rating: number;
  completedJobs: number;
  skills: string[];
  hourlyRate: number;
  responseTime: string;
  distance: number;
  currentLocation: string;
  arrivalTime: string;
  estimatedArrival: string;
}

interface BookingForm {
  category: string;
  description: string;
  location: string;
  urgency: 'now' | 'later';
  serviceType: 'remote' | 'phone' | 'onsite';
  preferredDate?: string;
}

export default function BookServicePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'form' | 'providers' | 'confirmation'>('form');
  const [form, setForm] = useState<BookingForm>({
    category: '',
    description: '',
    location: '',
    urgency: 'now',
    serviceType: 'onsite',
    preferredDate: ''
  });
  
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/issue-categories'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/issue-categories');
      return response.json();
    }
  });

  // Find providers mutation
  const findProvidersMutation = useMutation({
    mutationFn: async (formData: BookingForm) => {
      // Generate mock providers based on location and category
      const mockProviders = generateMockProviders(formData.location, formData.category);
      return mockProviders;
    },
    onSuccess: (data) => {
      setProviders(data);
      setStep('providers');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to find service providers. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Book service mutation
  const bookServiceMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      // Create service request
      const serviceRequest = {
        customerId: 1, // Fixed customer ID
        category: bookingData.category,
        subcategory: bookingData.category,
        title: `${bookingData.category} - ${bookingData.serviceType}`,
        description: bookingData.description,
        serviceType: bookingData.serviceType,
        urgency: bookingData.urgency,
        location: bookingData.location,
        budget: bookingData.hourlyRate * 2,
        scheduledAt: bookingData.preferredDate || null
      };
      
      // Create service request
      const serviceResponse = await apiRequest('POST', '/api/service-requests', serviceRequest);
      const serviceData = await serviceResponse.json();
      
      // Create booking
      const booking = {
        ...bookingData,
        serviceRequestId: serviceData.id,
        customerId: 1 // Fixed customer ID
      };
      
      const bookingResponse = await apiRequest('POST', '/api/service-bookings', booking);
      return bookingResponse.json();
    },
    onSuccess: (data) => {
      setStep('confirmation');
      toast({
        title: "Service Booked!",
        description: "Your service provider has been notified and will contact you soon."
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

  const generateMockProviders = (location: string, category: string): ServiceProvider[] => {
    const baseProviders = [
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

    return baseProviders.map(provider => {
      const baseTime = Math.round(provider.distance * 15);
      const trafficMultiplier = new Date().getHours() >= 7 && new Date().getHours() <= 19 ? 1.2 : 1.0;
      const totalMinutes = Math.round(baseTime * trafficMultiplier);
      
      const now = new Date();
      const eta = new Date(now.getTime() + totalMinutes * 60000);
      
      return {
        ...provider,
        arrivalTime: eta.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        estimatedArrival: `${totalMinutes - 5}-${totalMinutes + 10} min`
      };
    }).sort((a, b) => a.distance - b.distance);
  };

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

    findProvidersMutation.mutate(form);
  };

  const handleProviderSelect = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
  };

  const handleBooking = () => {
    if (!selectedProvider) return;

    const selectedCategory = categories?.find(cat => cat.name === form.category);
    const isNow = form.urgency === 'now';
    const bookingFee = isNow ? 0 : 15;

    const bookingData = {
      customerId: 1, // Fixed customer ID
      technicianId: selectedProvider.id,
      categoryId: selectedCategory?.id,
      category: form.category,
      description: form.description,
      location: form.location,
      urgency: form.urgency,
      serviceType: form.serviceType,
      scheduledDate: form.preferredDate || null,
      bookingFee: bookingFee.toString(),
      hourlyRate: selectedProvider.hourlyRate,
      estimatedCost: `$${selectedProvider.hourlyRate * 2}-$${selectedProvider.hourlyRate * 4}`
    };

    bookServiceMutation.mutate(bookingData);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Navigation title="Book Service" backTo="/customer-home" />
      
      {step === 'form' && (
        <Card>
          <CardHeader>
            <CardTitle>Book Technical Support Service</CardTitle>
            <CardDescription>
              Tell us about your technical issue and we'll connect you with the best service provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Issue Category</label>
                  <Select value={form.category} onValueChange={(value) => setForm({...form, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category: any) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Urgency Level</label>
                  <Select value={form.urgency} onValueChange={(value: any) => setForm({...form, urgency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Now</SelectItem>
                      <SelectItem value="later">Book for Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Describe Your Issue</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Please describe your technical issue in detail..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Location</label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({...form, location: e.target.value})}
                    placeholder="Enter your address or city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Service Type</label>
                  <Select value={form.serviceType} onValueChange={(value: any) => setForm({...form, serviceType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote Support</SelectItem>
                      <SelectItem value="phone">Phone Support</SelectItem>
                      <SelectItem value="onsite">On-Site Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Date (Optional)</label>
                <Input
                  type="datetime-local"
                  value={form.preferredDate}
                  onChange={(e) => setForm({...form, preferredDate: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full" disabled={findProvidersMutation.isPending}>
                {findProvidersMutation.isPending ? "Finding Providers..." : "Find Service Providers"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 'providers' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setStep('form')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h2 className="text-2xl font-bold">Available Service Providers</h2>
          </div>
          
          <div className="grid gap-4">
            {providers.map((provider) => (
              <Card key={provider.id} className={`cursor-pointer transition-all ${selectedProvider?.id === provider.id ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">{provider.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{provider.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{provider.rating}</span>
                            <span>•</span>
                            <span>{provider.completedJobs} jobs</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {provider.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{provider.distance} miles away</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>ETA: {provider.arrivalTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">${provider.hourlyRate}/hr</div>
                      <div className="text-sm text-gray-600">
                        <div>Travel: {provider.estimatedArrival}</div>
                      </div>
                      <Button 
                        onClick={() => handleProviderSelect(provider)}
                        className="mt-2"
                        variant={selectedProvider?.id === provider.id ? "default" : "outline"}
                      >
                        {selectedProvider?.id === provider.id ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Selected
                          </>
                        ) : (
                          "Select"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedProvider && (
            <div className="flex justify-center">
              <Button onClick={handleBooking} size="lg" disabled={bookServiceMutation.isPending}>
                {bookServiceMutation.isPending ? "Booking..." : "Book Service"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {step === 'confirmation' && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Service Booked Successfully!</h2>
              <p className="text-gray-600">
                {selectedProvider?.name} has been notified and will contact you soon.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service Provider:</span>
                  <span className="font-medium">{selectedProvider?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{form.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Type:</span>
                  <span className="font-medium capitalize">{form.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Urgency:</span>
                  <span className="font-medium capitalize">{form.urgency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span className="font-medium">${selectedProvider?.hourlyRate}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span>ETA:</span>
                  <span className="font-medium">{selectedProvider?.arrivalTime}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/dashboard')}>
                View Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/customer-home')}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}