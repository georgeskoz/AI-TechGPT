import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign, 
  CheckCircle,
  User,
  MessageSquare,
  Phone,
  Monitor
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Technician } from "@shared/schema";
import NoServiceProvidersModal from "./NoServiceProvidersModal";

interface TechnicianSearchProps {
  category: string;
  subcategory: string;
  serviceType: 'remote' | 'phone' | 'onsite';
  location?: string;
  onTechnicianSelect: (technician: Technician) => void;
}

export default function TechnicianSearch({ 
  category, 
  subcategory, 
  serviceType, 
  location,
  onTechnicianSelect 
}: TechnicianSearchProps) {
  const [searchCriteria, setSearchCriteria] = useState({
    skills: [category, subcategory].filter(Boolean),
    location: location || "",
    serviceRadius: 25,
    availability: true
  });
  
  const [showNoProvidersModal, setShowNoProvidersModal] = useState(false);
  
  // Parse customer location from the location string
  const parseCustomerLocation = (locationStr: string) => {
    const parts = locationStr.split(',').map(s => s.trim());
    if (parts.length >= 2) {
      return {
        city: parts[parts.length - 2] || '',
        state: parts[parts.length - 1] || '',
        country: 'Canada', // Default to Canada based on your setup
        address: locationStr
      };
    }
    return {
      city: locationStr,
      state: '',
      country: 'Canada',
      address: locationStr
    };
  };

  const searchMutation = useMutation({
    mutationFn: async (criteria: typeof searchCriteria) => {
      const response = await apiRequest("POST", "/api/technicians/search", criteria);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.length === 0) {
        setShowNoProvidersModal(true);
      }
    }
  });

  // Auto-search when component mounts
  useEffect(() => {
    handleSearch();
  }, []);

  const customerLocation = parseCustomerLocation(searchCriteria.location);

  const handleSearch = () => {
    searchMutation.mutate(searchCriteria);
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'remote': return <Monitor className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'onsite': return <MapPin className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getExperienceBadgeColor = (experience: string) => {
    switch (experience) {
      case 'expert': return 'bg-purple-100 text-purple-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-green-100 text-green-800';
      case 'beginner': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Technicians
          </CardTitle>
          <CardDescription>
            Search for qualified technicians for {category} → {subcategory} ({serviceType} service)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={searchCriteria.location}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, State"
              />
            </div>
            <div>
              <Label htmlFor="radius">Service Radius (miles)</Label>
              <Input
                id="radius"
                type="number"
                value={searchCriteria.serviceRadius}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, serviceRadius: parseInt(e.target.value) }))}
                min="5"
                max="100"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={searchMutation.isPending} className="w-full">
                {searchMutation.isPending ? "Searching..." : "Search Technicians"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchMutation.data && (
        <Card>
          <CardHeader>
            <CardTitle>Available Technicians</CardTitle>
            <CardDescription>
              Found {searchMutation.data.length} technician(s) for your request
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchMutation.data.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Technicians Found</h3>
                <p className="text-gray-600">Try expanding your search radius or location.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchMutation.data.map((technician: Technician) => (
                  <div key={technician.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {technician.companyName || `Technician #${technician.id}`}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{technician.location}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{technician.serviceRadius} mile radius</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{technician.rating}</span>
                          <span className="text-gray-600">({technician.completedJobs} jobs)</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <DollarSign className="h-4 w-4" />
                          <span>${technician.hourlyRate}/hour</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getExperienceBadgeColor(technician.experience || "intermediate")}>
                        {technician.experience || "intermediate"}
                      </Badge>
                      {technician.isActive && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      )}
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getServiceIcon(serviceType)}
                        {serviceType}
                      </Badge>
                    </div>

                    {technician.skills && technician.skills.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {technician.skills.slice(0, 6).map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {technician.skills.length > 6 && (
                            <Badge variant="secondary" className="text-xs">
                              +{technician.skills.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {technician.certifications && technician.certifications.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Certifications:</p>
                        <div className="flex flex-wrap gap-1">
                          {technician.certifications.slice(0, 4).map((cert: string) => (
                            <Badge key={cert} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                          {technician.certifications.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{technician.certifications.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <Separator className="my-3" />

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Usually responds within 1 hour</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <MessageSquare className="h-3 w-3" />
                          Message
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => onTechnicianSelect(technician)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Select Technician
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {searchMutation.error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <Search className="h-4 w-4" />
              <span>Search failed: {(searchMutation.error as Error).message}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Service Providers Modal */}
      <NoServiceProvidersModal
        isOpen={showNoProvidersModal}
        onClose={() => setShowNoProvidersModal(false)}
        customerLocation={customerLocation}
        serviceType={serviceType}
        category={category}
        subcategory={subcategory}
      />
    </div>
  );
}