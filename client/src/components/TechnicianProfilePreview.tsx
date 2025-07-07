import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Award, 
  CheckCircle,
  Phone,
  Monitor,
  Home,
  MessageSquare
} from "lucide-react";

interface TechnicianProfilePreviewProps {
  formData: {
    businessName?: string;
    companyName?: string;
    experience: string;
    hourlyRatePercentage: number;
    location?: string;
    serviceRadius?: number;
    profileDescription?: string;
    responseTime?: number;
  };
  selectedSkills: string[];
  selectedCategories: string[];
  selectedLanguages: string[];
  selectedCertifications: string[];
  serviceAreas: string[];
}

export default function TechnicianProfilePreview({ 
  formData, 
  selectedSkills, 
  selectedCategories, 
  selectedLanguages,
  selectedCertifications,
  serviceAreas 
}: TechnicianProfilePreviewProps) {
  
  // Calculate hourly rates based on percentage (85% of platform rates)
  const calculateRate = (baseRate: number) => {
    return Math.round(baseRate * (formData.hourlyRatePercentage / 100));
  };

  const getExperienceDisplay = (level: string) => {
    const levels = {
      beginner: { label: "Beginner", color: "bg-blue-100 text-blue-800" },
      intermediate: { label: "Intermediate", color: "bg-green-100 text-green-800" },
      advanced: { label: "Advanced", color: "bg-orange-100 text-orange-800" },
      expert: { label: "Expert", color: "bg-purple-100 text-purple-800" }
    };
    return levels[level] || levels.intermediate;
  };

  const experienceLevel = getExperienceDisplay(formData.experience);
  
  // Service rates based on experience level
  const serviceRates = {
    beginner: { remote: 25, phone: 30, onsite: 50 },
    intermediate: { remote: 45, phone: 55, onsite: 75 },
    advanced: { remote: 65, phone: 80, onsite: 120 },
    expert: { remote: 85, phone: 95, onsite: 200 }
  };

  const rates = serviceRates[formData.experience] || serviceRates.intermediate;

  return (
    <Card className="h-full border-2 border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Monitor className="h-5 w-5 text-blue-600" />
          Customer View Preview
        </CardTitle>
        <p className="text-sm text-gray-600">How customers will see your profile</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Technician Card Preview */}
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-green-100 text-green-700 text-lg font-semibold">
                {formData.businessName ? formData.businessName.charAt(0) : "T"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {formData.businessName || "Your Business Name"}
                  </h3>
                  {formData.companyName && (
                    <p className="text-sm text-gray-600">{formData.companyName}</p>
                  )}
                </div>
                <Badge className={experienceLevel.color}>
                  {experienceLevel.label}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">4.8</span>
                  <span>(127 reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{formData.location || "Your Location"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>~{formData.responseTime || 60} min response</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {formData.profileDescription || "Your profile description will appear here. This helps customers understand your expertise and what makes you unique."}
              </p>

              {/* Skills Preview */}
              {selectedSkills.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedSkills.slice(0, 6).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {selectedSkills.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{selectedSkills.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Service Rates */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Monitor className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                  <p className="text-xs text-gray-600">Remote</p>
                  <p className="font-semibold text-sm">${calculateRate(rates.remote)}/hr</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Phone className="h-4 w-4 mx-auto mb-1 text-green-600" />
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="font-semibold text-sm">${calculateRate(rates.phone)}/hr</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Home className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                  <p className="text-xs text-gray-600">On-site</p>
                  <p className="font-semibold text-sm">${calculateRate(rates.onsite)}/hr</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Select Technician
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-2 text-xs">
          {selectedCategories.length > 0 && (
            <div>
              <span className="font-medium text-gray-700">Categories: </span>
              <span className="text-gray-600">{selectedCategories.join(", ")}</span>
            </div>
          )}
          
          {selectedLanguages.length > 0 && (
            <div>
              <span className="font-medium text-gray-700">Languages: </span>
              <span className="text-gray-600">{selectedLanguages.join(", ")}</span>
            </div>
          )}
          
          {selectedCertifications.length > 0 && (
            <div>
              <span className="font-medium text-gray-700">Certifications: </span>
              <span className="text-gray-600">{selectedCertifications.slice(0, 3).join(", ")}</span>
              {selectedCertifications.length > 3 && <span> +{selectedCertifications.length - 3} more</span>}
            </div>
          )}
          
          {serviceAreas.length > 0 && (
            <div>
              <span className="font-medium text-gray-700">Service Areas: </span>
              <span className="text-gray-600">{serviceAreas.join(", ")}</span>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
          <p className="text-xs font-medium text-yellow-800 mb-1">💡 Tips to improve your profile:</p>
          <ul className="text-xs text-yellow-700 space-y-1">
            {!formData.profileDescription && <li>• Add a compelling profile description or upload your CV</li>}
            {selectedSkills.length < 5 && <li>• Add more relevant skills to increase visibility</li>}
            {selectedCategories.length < 3 && <li>• Select more service categories</li>}
            {!formData.location && <li>• Add your location to help customers find you</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}