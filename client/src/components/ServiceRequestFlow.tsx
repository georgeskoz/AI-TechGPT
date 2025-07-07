import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle,
  Clock,
  User,
  MessageSquare,
  DollarSign,
  AlertTriangle,
  MapPin,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TechnicianSearch from "./TechnicianSearch";
import type { Technician } from "@shared/schema";

interface ServiceRequestFlowProps {
  category: string;
  subcategory: string;
  userId: number;
  onComplete: () => void;
}

interface RequestData {
  title: string;
  description: string;
  serviceType: 'remote' | 'phone' | 'onsite';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number;
  location: string;
  budget: number;
}

const STEPS = [
  "Service Details",
  "Find Technician", 
  "Confirm & Book",
  "Request Submitted"
];

export default function ServiceRequestFlow({ 
  category, 
  subcategory, 
  userId, 
  onComplete 
}: ServiceRequestFlowProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [requestData, setRequestData] = useState<RequestData>({
    title: "",
    description: "",
    serviceType: "remote",
    urgency: "medium",
    estimatedDuration: 60,
    location: "",
    budget: 0
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/service-requests", data);
      return response.json();
    },
    onSuccess: () => {
      setCurrentStep(3);
      toast({
        title: "Service Request Created",
        description: "Your request has been submitted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to create service request",
        variant: "destructive",
      });
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/jobs", data);
      return response.json();
    },
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTechnicianSelect = (technician: Technician) => {
    setSelectedTechnician(technician);
    
    // Calculate estimated budget based on technician's hourly rate
    const estimatedCost = (parseFloat(technician.hourlyRate || "75") * (requestData.estimatedDuration / 60));
    setRequestData(prev => ({ ...prev, budget: estimatedCost }));
    
    handleNext();
  };

  const handleSubmitRequest = async () => {
    const serviceRequestData = {
      customerId: userId,
      technicianId: selectedTechnician?.id,
      category,
      subcategory,
      title: requestData.title,
      description: requestData.description,
      serviceType: requestData.serviceType,
      urgency: requestData.urgency,
      estimatedDuration: requestData.estimatedDuration,
      location: requestData.location,
      budget: requestData.budget.toString()
    };

    try {
      const serviceRequest = await createRequestMutation.mutateAsync(serviceRequestData);
      
      if (selectedTechnician) {
        // Also create a job if technician is pre-selected
        await createJobMutation.mutateAsync({
          serviceRequestId: serviceRequest.id,
          technicianId: selectedTechnician.id,
          customerId: userId,
          finalPrice: requestData.budget.toString()
        });
      }
      
      setTimeout(() => onComplete(), 2000);
    } catch (error) {
      console.error("Failed to submit request:", error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Request Technical Support</CardTitle>
          <CardDescription>
            {category} → {subcategory}
          </CardDescription>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              {STEPS.map((step, index) => (
                <span 
                  key={step}
                  className={index <= currentStep ? "text-blue-600 font-medium" : ""}
                >
                  {step}
                </span>
              ))}
            </div>
            <Progress value={(currentStep / (STEPS.length - 1)) * 100} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>
              Describe your technical issue and service requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Service Title</Label>
              <Input
                id="title"
                value={requestData.title}
                onChange={(e) => setRequestData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of what you need help with"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                value={requestData.description}
                onChange={(e) => setRequestData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed information about your technical issue..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceType">Service Type</Label>
                <Select
                  value={requestData.serviceType}
                  onValueChange={(value: any) => setRequestData(prev => ({ ...prev, serviceType: value }))}
                >
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

              <div>
                <Label htmlFor="urgency">Priority Level</Label>
                <Select
                  value={requestData.urgency}
                  onValueChange={(value: any) => setRequestData(prev => ({ ...prev, urgency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Can wait a few days</SelectItem>
                    <SelectItem value="medium">Medium - Within 24 hours</SelectItem>
                    <SelectItem value="high">High - Within a few hours</SelectItem>
                    <SelectItem value="urgent">Urgent - Immediate attention</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={requestData.estimatedDuration}
                  onChange={(e) => setRequestData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                  min="15"
                  max="480"
                />
              </div>

              {requestData.serviceType === 'onsite' && (
                <div>
                  <Label htmlFor="location">Service Location</Label>
                  <Input
                    id="location"
                    value={requestData.location}
                    onChange={(e) => setRequestData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Address or general location"
                    required
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 1 && (
        <TechnicianSearch
          category={category}
          subcategory={subcategory}
          serviceType={requestData.serviceType}
          location={requestData.location}
          onTechnicianSelect={handleTechnicianSelect}
        />
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Your Request</CardTitle>
            <CardDescription>
              Review your service request details before submitting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Request Summary */}
            <div>
              <h3 className="font-semibold mb-3">Service Request Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Service:</span>
                  <span>{category} → {subcategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Title:</span>
                  <span>{requestData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span className="capitalize">{requestData.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Priority:</span>
                  <Badge className={getUrgencyColor(requestData.urgency)}>
                    {requestData.urgency}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span>{requestData.estimatedDuration} minutes</span>
                </div>
                {requestData.location && (
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span>{requestData.location}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Selected Technician */}
            {selectedTechnician && (
              <div>
                <h3 className="font-semibold mb-3">Selected Technician</h3>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">
                        {selectedTechnician.companyName || `Technician #${selectedTechnician.id}`}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>{selectedTechnician.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        ${selectedTechnician.hourlyRate}/hour
                      </div>
                      <div className="text-sm text-gray-600">
                        Rating: {selectedTechnician.rating}/5
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Pricing */}
            <div>
              <h3 className="font-semibold mb-3">Estimated Cost</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Base Rate ({requestData.estimatedDuration} min):</span>
                  <span>${requestData.budget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total Estimated Cost:</span>
                  <span className="text-green-600">${requestData.budget.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  * Final cost may vary based on actual time spent and additional factors
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Request Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your service request has been created and {selectedTechnician ? 'assigned to your selected technician' : 'is being reviewed by available technicians'}.
            </p>
            
            <div className="space-y-3 text-left max-w-md mx-auto mb-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span className="text-sm">You'll receive updates via chat</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Expected response within 1 hour</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-500" />
                <span className="text-sm">Technician will contact you soon</span>
              </div>
            </div>

            <Button onClick={onComplete} className="w-full max-w-sm">
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {currentStep < 3 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {currentStep === 0 && (
                <Button
                  onClick={handleNext}
                  disabled={!requestData.title || !requestData.description}
                  className="flex items-center gap-2"
                >
                  Find Technician
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}

              {currentStep === 2 && (
                <Button
                  onClick={handleSubmitRequest}
                  disabled={createRequestMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {createRequestMutation.isPending ? "Submitting..." : "Submit Request"}
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}