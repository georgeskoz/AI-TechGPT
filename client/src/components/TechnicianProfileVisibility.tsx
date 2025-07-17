import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { countries, getCountryByCode } from "@/data/locations";
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
  MessageSquare,
  Eye,
  EyeOff,
  Search,
  Filter,
  Users,
  TrendingUp,
  Shield
} from "lucide-react";

interface TechnicianData {
  id?: number;
  businessName?: string;
  companyName?: string;
  experience: string;
  hourlyRatePercentage: number;
  country?: string;
  state?: string;
  city?: string;
  serviceRadius?: number;
  profileDescription?: string;
  responseTime?: number;
  skills?: string[];
  categories?: string[];
  languages?: string[];
  certifications?: string[];
  serviceAreas?: string[];
  rating?: string;
  completedJobs?: number;
  isVerified?: boolean;
  isActive?: boolean;
}

interface TechnicianProfileVisibilityProps {
  technicianData: TechnicianData;
  viewMode?: 'search' | 'detailed' | 'comparison';
}

export default function TechnicianProfileVisibility({ 
  technicianData, 
  viewMode = 'search' 
}: TechnicianProfileVisibilityProps) {
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [currentView, setCurrentView] = useState(viewMode);

  // Calculate hourly rates based on percentage
  const calculateRate = (baseRate: number) => {
    return Math.round(baseRate * (technicianData.hourlyRatePercentage / 100));
  };

  const getExperienceDisplay = (level: string) => {
    switch (level) {
      case "beginner": return { label: "Beginner", color: "bg-green-100 text-green-800" };
      case "intermediate": return { label: "Intermediate", color: "bg-blue-100 text-blue-800" };
      case "advanced": return { label: "Advanced", color: "bg-purple-100 text-purple-800" };
      case "expert": return { label: "Expert", color: "bg-orange-100 text-orange-800" };
      default: return { label: "Intermediate", color: "bg-blue-100 text-blue-800" };
    }
  };

  const experienceLevel = getExperienceDisplay(technicianData.experience);

  const formatLocation = () => {
    if (technicianData.city && technicianData.state && technicianData.country) {
      const country = getCountryByCode(technicianData.country);
      if (country && country.states) {
        const state = country.states.find(s => s.code === technicianData.state);
        return `${technicianData.city}, ${state?.name || technicianData.state}, ${country.name}`;
      } else {
        return `${technicianData.city}, ${technicianData.state}, ${technicianData.country}`;
      }
    }
    return "Location not specified";
  };

  const SearchResultView = () => (
    <Card className="w-full max-w-md hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {technicianData.businessName?.[0] || 'T'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate">
                {technicianData.businessName || "Tech Professional"}
              </h3>
              {technicianData.isVerified && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span>{technicianData.rating || "4.8"}</span>
              </div>
              <span>•</span>
              <span>{technicianData.completedJobs || 127} jobs</span>
              <span>•</span>
              <Badge className={`${experienceLevel.color} text-xs`}>
                {experienceLevel.label}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{formatLocation()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">
                <Clock className="h-3 w-3 inline mr-1" />
                ~{technicianData.responseTime || 60} min
              </div>
              <div className="text-sm font-semibold text-green-600">
                ${calculateRate(50)}-{calculateRate(120)}/hr
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DetailedView = () => (
    <Card className="w-full max-w-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                {technicianData.businessName?.[0] || 'T'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold">
                  {technicianData.businessName || "Tech Professional"}
                </h2>
                {technicianData.isVerified && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              {technicianData.companyName && (
                <p className="text-sm text-gray-600">{technicianData.companyName}</p>
              )}
              <Badge className={experienceLevel.color}>
                {experienceLevel.label}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              ${calculateRate(50)}-{calculateRate(120)}/hr
            </div>
            <div className="text-xs text-gray-500">Your earnings: 85%</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="font-medium">{technicianData.rating || "4.8"}</span>
            <span>({technicianData.completedJobs || 127} reviews)</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>~{technicianData.responseTime || 60} min response</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{formatLocation()}</span>
          <span className="text-xs">({technicianData.serviceRadius || 25} mi radius)</span>
        </div>

        <p className="text-sm text-gray-700">
          {technicianData.profileDescription || "Professional technician with extensive experience in technical support and problem solving."}
        </p>

        {/* Service Types */}
        <div>
          <h4 className="text-sm font-medium mb-2">Service Types</h4>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Monitor className="h-3 w-3" />
              Remote: ${calculateRate(35)}-{calculateRate(75)}/hr
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              Phone: ${calculateRate(30)}-{calculateRate(95)}/hr
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Home className="h-3 w-3" />
              On-site: ${calculateRate(50)}-{calculateRate(200)}/hr
            </Badge>
          </div>
        </div>

        {/* Skills */}
        {technicianData.skills && technicianData.skills.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {technicianData.skills.slice(0, 8).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {technicianData.skills.length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{technicianData.skills.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Languages */}
        {technicianData.languages && technicianData.languages.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Languages</h4>
            <div className="flex flex-wrap gap-1">
              {technicianData.languages.map((language) => (
                <Badge key={language} variant="outline" className="text-xs">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button className="flex-1" size="sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            Contact
          </Button>
          <Button variant="outline" size="sm">
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ComparisonView = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* This Technician */}
      <Card className="border-2 border-blue-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge className="bg-blue-100 text-blue-800">Your Profile</Badge>
            <div className="text-sm font-semibold text-green-600">
              ${calculateRate(50)}-{calculateRate(120)}/hr
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                {technicianData.businessName?.[0] || 'T'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-sm">{technicianData.businessName || "Tech Professional"}</h4>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span>{technicianData.rating || "4.8"}</span>
                <span>({technicianData.completedJobs || 127})</span>
              </div>
            </div>
          </div>
          <Badge className={`${experienceLevel.color} text-xs`}>
            {experienceLevel.label}
          </Badge>
          <div className="text-xs text-gray-600">
            <MapPin className="h-3 w-3 inline mr-1" />
            {formatLocation()}
          </div>
        </CardContent>
      </Card>

      {/* Competitor 1 */}
      <Card className="opacity-75">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline">Competitor</Badge>
            <div className="text-sm font-semibold text-green-600">$45-$110/hr</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">TC</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-sm">TechCare Solutions</h4>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span>4.6</span>
                <span>(89)</span>
              </div>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800 text-xs">Intermediate</Badge>
          <div className="text-xs text-gray-600">
            <MapPin className="h-3 w-3 inline mr-1" />
            Same area
          </div>
        </CardContent>
      </Card>

      {/* Competitor 2 */}
      <Card className="opacity-75">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline">Competitor</Badge>
            <div className="text-sm font-semibold text-green-600">$55-$140/hr</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">QF</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-sm">QuickFix Pro</h4>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span>4.9</span>
                <span>(203)</span>
              </div>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800 text-xs">Advanced</Badge>
          <div className="text-xs text-gray-600">
            <MapPin className="h-3 w-3 inline mr-1" />
            Same area
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Profile Visibility Preview
        </CardTitle>
        <p className="text-sm text-gray-600">
          See how customers will view your technician profile
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Privacy Controls */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-600" />
            <Label htmlFor="sensitive-info" className="text-sm">
              Show sensitive information preview
            </Label>
          </div>
          <Switch
            id="sensitive-info"
            checked={showSensitiveInfo}
            onCheckedChange={setShowSensitiveInfo}
          />
        </div>

        {/* View Mode Tabs */}
        <Tabs value={currentView} onValueChange={setCurrentView}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" className="flex items-center gap-1">
              <Search className="h-4 w-4" />
              Search Result
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Full Profile
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Comparison
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                How you appear in search results:
              </h4>
              <div className="flex justify-center">
                <SearchResultView />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="mt-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                Your complete profile view:
              </h4>
              <div className="flex justify-center">
                <DetailedView />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                How you compare to competitors in your area:
              </h4>
              <ComparisonView />
            </div>
          </TabsContent>
        </Tabs>

        {/* Visibility Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Tips to improve visibility:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Complete your profile description (currently {technicianData.profileDescription?.length || 0}/200 characters)</li>
              <li>• Add more technical skills to appear in more searches</li>
              <li>• Maintain quick response times to rank higher</li>
              <li>• Get verified to build customer trust</li>
              <li>• Competitive pricing helps win more jobs</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}