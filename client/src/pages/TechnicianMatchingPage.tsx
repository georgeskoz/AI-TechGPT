import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import { 
  MapPin, 
  Star, 
  Clock, 
  User, 
  Shield, 
  Phone,
  MessageSquare,
  ArrowLeft,
  Home,
  CheckCircle,
  Loader2,
  Calendar,
  FileText,
  Wrench
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface MatchedServiceProvider {
  id: number;
  userId: number;
  businessName: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  rating: number;
  completedJobs: number;
  responseTime: number;
  distance: number;
  isAvailable: boolean;
  skills: string[];
  matchedSkills: string[];
  hourlyRate: number;
  location: string;
  estimatedArrival?: number;
  isVerified: boolean;
}

interface NotificationState {
  isVisible: boolean;
  status: 'searching' | 'found' | 'confirmed' | 'arriving';
  selectedTechnician?: MatchedTechnician;
  estimatedTime?: number;
}

export default function TechnicianMatchingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchCriteria, setSearchCriteria] = useState({
    skills: ['hardware_repair', 'network_setup'],
    location: 'San Francisco, CA',
    serviceType: 'onsite',
    urgency: 'medium'
  });
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    status: 'searching'
  });
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<number | null>(null);

  // Fetch matched technicians
  const { data: matchedTechnicians, isLoading } = useQuery({
    queryKey: ['/api/technicians/search', searchCriteria],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/technicians/search", searchCriteria);
      return await response.json();
    },
  });

  // Request technician mutation
  const requestTechnicianMutation = useMutation({
    mutationFn: async (technicianId: number) => {
      const response = await apiRequest("POST", "/api/technicians/request", {
        technicianId,
        serviceDetails: searchCriteria
      });
      return await response.json();
    },
    onSuccess: (data) => {
      const technician = matchedTechnicians?.find((t: MatchedTechnician) => t.id === selectedTechnicianId);
      
      setNotification({
        isVisible: true,
        status: 'found',
        selectedTechnician: technician,
        estimatedTime: technician?.estimatedArrival || 30
      });

      // Simulate technician response flow
      setTimeout(() => {
        setNotification(prev => ({
          ...prev,
          status: 'confirmed'
        }));
      }, 3000);

      setTimeout(() => {
        setNotification(prev => ({
          ...prev,
          status: 'arriving'
        }));
      }, 6000);

      toast({
        title: "Technician Requested",
        description: `${technician?.businessName} has been notified of your request.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to request technician.",
        variant: "destructive",
      });
    },
  });

  const handleSelectTechnician = (technician: MatchedTechnician) => {
    setSelectedTechnicianId(technician.id);
    setNotification({
      isVisible: true,
      status: 'searching',
      selectedTechnician: technician
    });
    requestTechnicianMutation.mutate(technician.id);
  };

  const getSkillBadgeColor = (skill: string, isMatched: boolean) => {
    if (isMatched) return "bg-green-100 text-green-800 border-green-300";
    return "bg-gray-100 text-gray-600 border-gray-300";
  };

  const getDistanceColor = (distance: number) => {
    if (distance <= 5) return "text-green-600";
    if (distance <= 15) return "text-yellow-600";
    return "text-red-600";
  };

  // Mock data for demonstration
  const mockTechnicians: MatchedTechnician[] = [
    {
      id: 1,
      userId: 101,
      businessName: "TechFix Pro",
      firstName: "John",
      lastName: "Smith",
      rating: 4.9,
      completedJobs: 156,
      responseTime: 15,
      distance: 2.3,
      isAvailable: true,
      skills: ['hardware_repair', 'network_setup', 'data_recovery', 'virus_removal'],
      matchedSkills: ['hardware_repair', 'network_setup'],
      hourlyRate: 75,
      location: "Downtown SF",
      estimatedArrival: 25,
      isVerified: true
    },
    {
      id: 2,
      userId: 102,
      businessName: "QuickFix Solutions",
      firstName: "Sarah",
      lastName: "Johnson",
      rating: 4.8,
      completedJobs: 89,
      responseTime: 20,
      distance: 4.1,
      isAvailable: true,
      skills: ['hardware_repair', 'software_installation', 'network_setup'],
      matchedSkills: ['hardware_repair', 'network_setup'],
      hourlyRate: 65,
      location: "Mission District",
      estimatedArrival: 35,
      isVerified: true
    },
    {
      id: 3,
      userId: 103,
      businessName: "Elite Tech Services",
      firstName: "Mike",
      lastName: "Chen",
      rating: 4.7,
      completedJobs: 203,
      responseTime: 12,
      distance: 6.8,
      isAvailable: true,
      skills: ['hardware_repair', 'network_setup', 'security_setup', 'server_maintenance'],
      matchedSkills: ['hardware_repair', 'network_setup'],
      hourlyRate: 85,
      location: "SOMA",
      estimatedArrival: 45,
      isVerified: true
    }
  ];

  const techniciansToShow = matchedTechnicians || mockTechnicians;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="Technician Matching" backTo="/" />
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/issues")}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/")}
                className="flex items-center gap-1"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
            <h1 className="text-lg font-semibold">Find Technician</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-4xl">
        {/* Search Criteria */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Service Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Skills Needed</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {searchCriteria.skills.map(skill => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-700">Location</p>
                <p className="text-gray-600">{searchCriteria.location}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Service Type</p>
                <p className="text-gray-600 capitalize">{searchCriteria.serviceType}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Urgency</p>
                <p className="text-gray-600 capitalize">{searchCriteria.urgency}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/chat')}>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">AI Chat Support</h3>
                <p className="text-xs text-gray-600">AI-powered assistance</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/live-support')}>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Live Support</h3>
                <p className="text-xs text-gray-600">Live Service Providers</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/phone-support')}>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Phone Support</h3>
                <p className="text-xs text-gray-600">Phone Service Providers</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/issues')}>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Issue Tracker</h3>
                <p className="text-xs text-gray-600">Track requests</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/technician-matching')}>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Service Provider Matching</h3>
                <p className="text-xs text-gray-600">Find matched Service Providers</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Matched Technicians */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Technicians</h2>
            <p className="text-sm text-gray-600">
              {techniciansToShow.length} technicians found • Sorted by distance
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-3">
              {techniciansToShow.map((technician: MatchedTechnician) => (
                <Card key={technician.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={technician.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {technician.firstName[0]}{technician.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{technician.businessName}</h3>
                              {technician.isVerified && (
                                <Shield className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {technician.firstName} {technician.lastName} • {technician.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${technician.hourlyRate}/hr</p>
                            <p className={`text-sm font-medium ${getDistanceColor(technician.distance)}`}>
                              {technician.distance} mi away
                            </p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{technician.rating}</span>
                            <span className="text-gray-600">({technician.completedJobs} jobs)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>~{technician.responseTime} min response</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>~{technician.estimatedArrival} min arrival</span>
                          </div>
                        </div>

                        {/* Matched Skills */}
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-700 mb-2">
                            Skills ({technician.matchedSkills.length}/{searchCriteria.skills.length} match)
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {technician.skills.map(skill => (
                              <Badge 
                                key={skill} 
                                variant="outline" 
                                className={`text-xs ${getSkillBadgeColor(
                                  skill, 
                                  technician.matchedSkills.includes(skill)
                                )}`}
                              >
                                {skill.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSelectTechnician(technician)}
                            disabled={requestTechnicianMutation.isPending}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            {requestTechnicianMutation.isPending && selectedTechnicianId === technician.id
                              ? "Requesting..." 
                              : "Select Service Provider"
                            }
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Uber-style Notification Overlay */}
      {notification.isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="max-w-md mx-auto">
              {notification.status === 'searching' && (
                <div className="text-center">
                  <div className="mb-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Finding your technician...</h3>
                  <p className="text-gray-600">We're notifying {notification.selectedTechnician?.businessName}</p>
                  <Progress value={33} className="mt-4" />
                </div>
              )}

              {notification.status === 'found' && (
                <div className="text-center">
                  <div className="mb-4">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Technician Found!</h3>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {notification.selectedTechnician?.firstName[0]}
                        {notification.selectedTechnician?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-medium">{notification.selectedTechnician?.businessName}</p>
                      <p className="text-sm text-gray-600">
                        {notification.selectedTechnician?.firstName} {notification.selectedTechnician?.lastName}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600">Waiting for confirmation...</p>
                  <Progress value={66} className="mt-4" />
                </div>
              )}

              {notification.status === 'confirmed' && (
                <div className="text-center">
                  <div className="mb-4">
                    <User className="h-12 w-12 text-blue-600 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Request Accepted!</h3>
                  <p className="text-gray-600 mb-4">
                    {notification.selectedTechnician?.businessName} is preparing to help you
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-sm">
                      <strong>Estimated arrival:</strong> {notification.estimatedTime} minutes
                    </p>
                  </div>
                  <Progress value={100} className="mb-4" />
                </div>
              )}

              {notification.status === 'arriving' && (
                <div className="text-center">
                  <div className="mb-4">
                    <MapPin className="h-12 w-12 text-green-600 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Technician On The Way!</h3>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {notification.selectedTechnician?.firstName[0]}
                        {notification.selectedTechnician?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-medium">{notification.selectedTechnician?.businessName}</p>
                      <p className="text-sm text-gray-600">ETA: {notification.estimatedTime} min</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                onClick={() => setNotification({ isVisible: false, status: 'searching' })}
                className="w-full mt-4"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}