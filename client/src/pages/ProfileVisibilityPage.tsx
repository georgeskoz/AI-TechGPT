import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SimpleNavigation from "@/components/SimpleNavigation";
import TechnicianProfileVisibility from "@/components/TechnicianProfileVisibility";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Eye, 
  Settings, 
  TrendingUp, 
  Users, 
  Search,
  RefreshCw,
  BarChart3,
  Target,
  Star,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function ProfileVisibilityPage() {
  const [activeTab, setActiveTab] = useState("preview");
  const [simulatedChanges, setSimulatedChanges] = useState({
    profileDescription: "",
    responseTime: 60,
    skills: [] as string[],
    experience: "intermediate"
  });

  // Mock technician data - in real app, this would come from user's profile
  const [technicianData, setTechnicianData] = useState({
    id: 1,
    businessName: "Professional Tech Services",
    companyName: "TechCorp Solutions",
    experience: "intermediate",
    hourlyRatePercentage: 85,
    country: "US",
    state: "CA",
    city: "San Francisco",
    serviceRadius: 25,
    profileDescription: "Experienced technician specializing in hardware troubleshooting, network setup, and software installation. Available for remote and on-site support.",
    responseTime: 60,
    skills: ["PC Hardware Repair", "Network Troubleshooting", "Software Installation", "Virus Removal", "Wi-Fi Setup"],
    categories: ["Hardware Issues", "Software Issues", "Network Troubleshooting"],
    languages: ["English", "Spanish"],
    certifications: ["CompTIA A+", "CompTIA Network+"],
    serviceAreas: ["San Francisco", "Oakland", "San Jose"],
    rating: "4.8",
    completedJobs: 127,
    isVerified: true,
    isActive: true
  });

  const [visibilityScore, setVisibilityScore] = useState(0);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState({
    ranking: 0,
    totalInArea: 0,
    pricePosition: "",
    strengthAreas: [] as string[],
    improvementAreas: [] as string[]
  });

  // Calculate visibility score based on profile completeness
  useEffect(() => {
    let score = 0;
    
    // Basic information (30 points)
    if (technicianData.businessName) score += 10;
    if (technicianData.profileDescription && technicianData.profileDescription.length > 50) score += 20;
    
    // Skills and experience (25 points)
    if (technicianData.skills.length >= 5) score += 15;
    if (technicianData.experience !== "beginner") score += 10;
    
    // Credentials (20 points)
    if (technicianData.certifications.length > 0) score += 10;
    if (technicianData.isVerified) score += 10;
    
    // Performance metrics (25 points)
    if (parseFloat(technicianData.rating) >= 4.5) score += 15;
    if (technicianData.responseTime <= 60) score += 10;
    
    setVisibilityScore(score);
    
    // Mock competitive analysis
    setCompetitiveAnalysis({
      ranking: Math.max(1, Math.ceil(score / 10)),
      totalInArea: 23,
      pricePosition: score > 80 ? "Competitive" : score > 60 ? "Average" : "Below Average",
      strengthAreas: [
        ...(technicianData.isVerified ? ["Verified Profile"] : []),
        ...(parseFloat(technicianData.rating) >= 4.5 ? ["High Rating"] : []),
        ...(technicianData.responseTime <= 60 ? ["Quick Response"] : []),
        ...(technicianData.skills.length >= 5 ? ["Diverse Skills"] : [])
      ],
      improvementAreas: [
        ...(technicianData.profileDescription.length < 100 ? ["Profile Description"] : []),
        ...(technicianData.certifications.length === 0 ? ["Certifications"] : []),
        ...(technicianData.skills.length < 5 ? ["More Skills"] : []),
        ...(technicianData.responseTime > 60 ? ["Response Time"] : [])
      ]
    });
  }, [technicianData]);

  const handleSimulatedChange = (field: string, value: any) => {
    setSimulatedChanges(prev => ({ ...prev, [field]: value }));
    setTechnicianData(prev => ({ ...prev, [field]: value }));
  };

  const VisibilityScoreCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Visibility Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-4xl font-bold text-blue-600">{visibilityScore}</div>
            <div className="text-sm text-gray-500">/100</div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                visibilityScore >= 80 ? 'bg-green-500' : 
                visibilityScore >= 60 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${visibilityScore}%` }}
            />
          </div>
          
          <Badge 
            className={
              visibilityScore >= 80 ? 'bg-green-100 text-green-800' : 
              visibilityScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }
          >
            {visibilityScore >= 80 ? 'Excellent' : 
             visibilityScore >= 60 ? 'Good' : 
             'Needs Improvement'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const CompetitiveAnalysisCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Competitive Position
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              #{competitiveAnalysis.ranking}
            </div>
            <div className="text-sm text-gray-500">
              of {competitiveAnalysis.totalInArea} in area
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {competitiveAnalysis.pricePosition}
            </div>
            <div className="text-sm text-gray-500">Pricing</div>
          </div>
        </div>
        
        {competitiveAnalysis.strengthAreas.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-2">Strengths:</h4>
            <div className="flex flex-wrap gap-1">
              {competitiveAnalysis.strengthAreas.map((strength) => (
                <Badge key={strength} className="bg-green-100 text-green-800 text-xs">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {competitiveAnalysis.improvementAreas.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-orange-700 mb-2">Improve:</h4>
            <div className="flex flex-wrap gap-1">
              {competitiveAnalysis.improvementAreas.map((area) => (
                <Badge key={area} variant="outline" className="text-orange-700 border-orange-300 text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const OptimizationTips = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Optimization Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {visibilityScore < 80 && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  Complete your profile description
                </h4>
                <p className="text-sm text-blue-700">
                  Add more details about your experience and specialties to rank higher in search results.
                </p>
              </div>
            </div>
          )}
          
          {technicianData.skills.length < 8 && (
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-green-900">
                  Add more technical skills
                </h4>
                <p className="text-sm text-green-700">
                  More skills = more search visibility. Add {8 - technicianData.skills.length} more skills to improve ranking.
                </p>
              </div>
            </div>
          )}
          
          {!technicianData.isVerified && (
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-orange-900">
                  Get profile verified
                </h4>
                <p className="text-sm text-orange-700">
                  Verified profiles get 3x more customer inquiries and build trust.
                </p>
              </div>
            </div>
          )}
          
          {technicianData.responseTime > 60 && (
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-purple-900">
                  Improve response time
                </h4>
                <p className="text-sm text-purple-700">
                  Faster response times (under 60 minutes) rank higher in search results.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavigation title="Profile Visibility" backTo="/technician-dashboard" />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Visibility & Optimization
          </h1>
          <p className="text-gray-600">
            See how customers view your profile and optimize for better visibility
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Live Preview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="optimize" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Optimize
            </TabsTrigger>
            <TabsTrigger value="simulator" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Simulator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TechnicianProfileVisibility
                  technicianData={technicianData}
                />
              </div>
              <div className="space-y-4">
                <VisibilityScoreCard />
                <CompetitiveAnalysisCard />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <VisibilityScoreCard />
              <CompetitiveAnalysisCard />
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">127</div>
                      <div className="text-sm text-gray-500">Profile Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">23</div>
                      <div className="text-sm text-gray-500">Contact Requests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">18%</div>
                      <div className="text-sm text-gray-500">Conversion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">#{competitiveAnalysis.ranking}</div>
                      <div className="text-sm text-gray-500">Local Ranking</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="optimize">
            <div className="grid lg:grid-cols-2 gap-6">
              <OptimizationTips />
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    Request Customer Reviews
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Start Verification Process
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Update Skills & Certifications
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Optimize Pricing Strategy
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="simulator">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TechnicianProfileVisibility
                  technicianData={technicianData}
                />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Simulator</CardTitle>
                  <p className="text-sm text-gray-600">
                    Test changes to see instant impact
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="sim-description">Profile Description</Label>
                    <Textarea
                      id="sim-description"
                      value={technicianData.profileDescription}
                      onChange={(e) => handleSimulatedChange('profileDescription', e.target.value)}
                      placeholder="Describe your expertise..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sim-response">Response Time (minutes)</Label>
                    <Input
                      id="sim-response"
                      type="number"
                      value={technicianData.responseTime}
                      onChange={(e) => handleSimulatedChange('responseTime', parseInt(e.target.value))}
                      min="15"
                      max="240"
                    />
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      // Reset to original values
                      setTechnicianData(prev => ({
                        ...prev,
                        profileDescription: "Experienced technician specializing in hardware troubleshooting, network setup, and software installation. Available for remote and on-site support.",
                        responseTime: 60
                      }));
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}