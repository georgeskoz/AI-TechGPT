import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/components/UserAuthProvider";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Filter,
  Search,
  Calendar,
  User,
  Zap,
  AlertCircle,
  CheckCircle,
  Eye,
  Send
} from "lucide-react";

interface JobOpportunity {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  distance: number;
  budget: {
    min: number;
    max: number;
  };
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  duration: string;
  skillsRequired: string[];
  postedDate: string;
  deadline: string;
  clientRating: number;
  applicants: number;
  status: 'open' | 'in_progress' | 'closed';
  serviceType: 'remote' | 'phone' | 'onsite';
}

export default function TechnicianOpportunities() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedServiceType, setSelectedServiceType] = useState("all");

  const opportunities: JobOpportunity[] = [
    {
      id: "1",
      title: "Laptop Hardware Repair - Screen Replacement",
      category: "Hardware Issues",
      description: "MacBook Pro 2020 screen cracked and needs replacement. Customer has replacement part already.",
      location: "Downtown Ottawa",
      distance: 2.1,
      budget: { min: 80, max: 120 },
      urgency: "medium",
      duration: "2-3 hours",
      skillsRequired: ["Laptop Repair", "Screen Replacement", "Hardware Installation"],
      postedDate: "2024-01-18",
      deadline: "2024-01-20",
      clientRating: 4.8,
      applicants: 3,
      status: "open",
      serviceType: "onsite"
    },
    {
      id: "2",
      title: "Network Setup and Configuration",
      category: "Network Troubleshooting",
      description: "Small office network setup with 5 computers, printer sharing, and WiFi configuration.",
      location: "Gatineau, QC",
      distance: 8.3,
      budget: { min: 150, max: 250 },
      urgency: "high",
      duration: "3-4 hours",
      skillsRequired: ["Network Configuration", "Router Setup", "WiFi Setup"],
      postedDate: "2024-01-17",
      deadline: "2024-01-19",
      clientRating: 4.9,
      applicants: 7,
      status: "open",
      serviceType: "onsite"
    },
    {
      id: "3",
      title: "Remote Software Installation and Setup",
      category: "Software Issues",
      description: "Install and configure Adobe Creative Suite, set up licenses, and provide basic training.",
      location: "Remote",
      distance: 0,
      budget: { min: 60, max: 100 },
      urgency: "low",
      duration: "1-2 hours",
      skillsRequired: ["Software Installation", "Remote Support", "Training"],
      postedDate: "2024-01-16",
      deadline: "2024-01-22",
      clientRating: 4.6,
      applicants: 12,
      status: "open",
      serviceType: "remote"
    },
    {
      id: "4",
      title: "Urgent: Computer Won't Boot",
      category: "Hardware Issues",
      description: "Desktop computer won't start, need immediate diagnosis and repair. Business critical.",
      location: "Kanata, ON",
      distance: 15.2,
      budget: { min: 100, max: 200 },
      urgency: "urgent",
      duration: "2-4 hours",
      skillsRequired: ["Hardware Repair", "Diagnostic", "Troubleshooting"],
      postedDate: "2024-01-18",
      deadline: "2024-01-18",
      clientRating: 4.7,
      applicants: 2,
      status: "open",
      serviceType: "onsite"
    },
    {
      id: "5",
      title: "Phone Support - Email Setup Issues",
      category: "Software Issues",
      description: "Help customer set up email clients on multiple devices, troubleshoot sync issues.",
      location: "Phone Support",
      distance: 0,
      budget: { min: 40, max: 80 },
      urgency: "medium",
      duration: "1 hour",
      skillsRequired: ["Email Setup", "Phone Support", "Mobile Configuration"],
      postedDate: "2024-01-17",
      deadline: "2024-01-20",
      clientRating: 4.5,
      applicants: 8,
      status: "open",
      serviceType: "phone"
    },
    {
      id: "6",
      title: "Database Migration and Backup",
      category: "Database Help",
      description: "Migrate MySQL database to new server, set up automated backups, and documentation.",
      location: "Remote",
      distance: 0,
      budget: { min: 200, max: 350 },
      urgency: "high",
      duration: "4-6 hours",
      skillsRequired: ["Database Management", "MySQL", "Server Migration"],
      postedDate: "2024-01-15",
      deadline: "2024-01-19",
      clientRating: 4.9,
      applicants: 5,
      status: "open",
      serviceType: "remote"
    }
  ];

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || opportunity.category === selectedCategory;
    const matchesUrgency = selectedUrgency === "all" || opportunity.urgency === selectedUrgency;
    const matchesServiceType = selectedServiceType === "all" || opportunity.serviceType === selectedServiceType;
    
    return matchesSearch && matchesCategory && matchesUrgency && matchesServiceType;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return <AlertCircle className="h-4 w-4" />;
      case 'high': return <Zap className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case 'remote': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-purple-100 text-purple-800';
      case 'onsite': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApply = (opportunityId: string) => {
    console.log("Applying to opportunity:", opportunityId);
    // Logic to apply to job opportunity
  };

  const handleViewDetails = (opportunityId: string) => {
    console.log("Viewing details for opportunity:", opportunityId);
    // Logic to view full job details
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
          <p className="text-gray-600">Find and apply to available service requests in your area</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Jobs</p>
                  <p className="text-2xl font-bold text-blue-600">{filteredOpportunities.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Budget</p>
                  <p className="text-2xl font-bold text-green-600">$145</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Urgent Jobs</p>
                  <p className="text-2xl font-bold text-red-600">
                    {opportunities.filter(o => o.urgency === 'urgent').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Remote Jobs</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {opportunities.filter(o => o.serviceType === 'remote').length}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Hardware Issues">Hardware Issues</SelectItem>
                    <SelectItem value="Software Issues">Software Issues</SelectItem>
                    <SelectItem value="Network Troubleshooting">Network Troubleshooting</SelectItem>
                    <SelectItem value="Database Help">Database Help</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Urgencies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgencies</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Opportunities */}
        <div className="space-y-6">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{opportunity.title}</h3>
                      <Badge className={getUrgencyColor(opportunity.urgency)}>
                        {getUrgencyIcon(opportunity.urgency)}
                        <span className="ml-1 capitalize">{opportunity.urgency}</span>
                      </Badge>
                      <Badge className={getServiceTypeColor(opportunity.serviceType)}>
                        {opportunity.serviceType}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{opportunity.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {opportunity.skillsRequired.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{opportunity.location}</span>
                        {opportunity.distance > 0 && (
                          <span className="text-gray-500">({opportunity.distance} km)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${opportunity.budget.min} - ${opportunity.budget.max}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{opportunity.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{opportunity.applicants} applicants</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{opportunity.clientRating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Posted: {opportunity.postedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>Deadline: {opportunity.deadline}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      onClick={() => handleViewDetails(opportunity.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleApply(opportunity.id)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No opportunities found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later for new opportunities.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}