import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { 
  DollarSign, 
  Users, 
  Clock, 
  Star,
  TrendingUp,
  Shield,
  MapPin,
  Briefcase,
  Award,
  Zap,
  ArrowRight,
  CheckCircle,
  Target,
  Calendar,
  User,
  BookOpen,
  HelpCircle,
  Inbox,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Video,
  GraduationCap,
  PlayCircle,
  Download,
  Search,
  Filter,
  MoreHorizontal,
  Bell,
  Archive
} from "lucide-react";
import { useLocation } from "wouter";

export default function ServiceProviderHomePage() {
  const [, setLocation] = useLocation();
  const [selectedAccountSection, setSelectedAccountSection] = useState('learning');

  const benefits = [
    {
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      title: "Flexible Earnings",
      description: "Earn $50-200/hour based on your expertise. Set your own rates and work schedule.",
      stats: "Average: $75/hour",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Growing Customer Base",
      description: "Access thousands of customers needing technical support across multiple categories.",
      stats: "25,000+ active users",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Verified Platform",
      description: "Join a trusted platform with background checks, secure payments, and customer protection.",
      stats: "100% payment guarantee",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: "Work When You Want",
      description: "Choose your availability. Work full-time, part-time, or just when you have spare time.",
      stats: "24/7 flexibility",
      color: "bg-orange-50 border-orange-200"
    }
  ];

  const serviceTypes = [
    {
      type: "Remote Support",
      description: "Help customers via chat, screen sharing, and remote access tools",
      rate: "$25-75/hour",
      icon: <Briefcase className="h-6 w-6" />
    },
    {
      type: "Phone Support",
      description: "Provide technical guidance and troubleshooting over the phone",
      rate: "$30-95/hour",
      icon: <Clock className="h-6 w-6" />
    },
    {
      type: "On-Site Services",
      description: "Visit customer locations for hands-on repairs and installations",
      rate: "$50-200/hour",
      icon: <MapPin className="h-6 w-6" />
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Register & Verify",
      description: "Complete our simple registration process and background verification"
    },
    {
      step: "2", 
      title: "Set Your Skills",
      description: "Choose your technical specialties and set your availability"
    },
    {
      step: "3",
      title: "Start Earning",
      description: "Receive job notifications and start helping customers immediately"
    }
  ];

  const stats = [
    { label: "Active Service Providers", value: "5,000+", icon: <Users className="h-5 w-5" /> },
    { label: "Jobs Completed", value: "150,000+", icon: <CheckCircle className="h-5 w-5" /> },
    { label: "Average Rating", value: "4.8/5", icon: <Star className="h-5 w-5" /> },
    { label: "Countries Served", value: "25+", icon: <MapPin className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navigation title="Service Provider Portal" backTo="/domains" />
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TechGPT Pro</h1>
                <p className="text-sm text-gray-600">Service Provider Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-green-600">
                      Service Provider Account
                    </DialogTitle>
                  </DialogHeader>
                  <Tabs value={selectedAccountSection} onValueChange={setSelectedAccountSection} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="learning" className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Learning Center
                      </TabsTrigger>
                      <TabsTrigger value="help" className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Help
                      </TabsTrigger>
                      <TabsTrigger value="inbox" className="flex items-center gap-2">
                        <Inbox className="h-4 w-4" />
                        Inbox
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="learning" className="space-y-6">
                      <div className="bg-green-50 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-green-600 p-2 rounded-lg">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">Learning Center</h3>
                            <p className="text-gray-600">Enhance your skills and grow your service provider career</p>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <Card className="bg-white">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Video className="h-5 w-5 text-blue-600" />
                                Training Videos
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <PlayCircle className="h-5 w-5 text-green-600" />
                                  <span className="text-sm font-medium">Getting Started Guide</span>
                                </div>
                                <Badge variant="secondary">12 min</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <PlayCircle className="h-5 w-5 text-green-600" />
                                  <span className="text-sm font-medium">Best Practices</span>
                                </div>
                                <Badge variant="secondary">18 min</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <PlayCircle className="h-5 w-5 text-green-600" />
                                  <span className="text-sm font-medium">Customer Communication</span>
                                </div>
                                <Badge variant="secondary">15 min</Badge>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-white">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-purple-600" />
                                Resources
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Download className="h-5 w-5 text-blue-600" />
                                  <span className="text-sm font-medium">Service Provider Handbook</span>
                                </div>
                                <Button variant="outline" size="sm">Download</Button>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Download className="h-5 w-5 text-blue-600" />
                                  <span className="text-sm font-medium">Troubleshooting Guide</span>
                                </div>
                                <Button variant="outline" size="sm">Download</Button>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Download className="h-5 w-5 text-blue-600" />
                                  <span className="text-sm font-medium">Pricing Guidelines</span>
                                </div>
                                <Button variant="outline" size="sm">Download</Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-white">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-orange-600" />
                                Certifications
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                  <span className="text-sm font-medium">Basic Technician</span>
                                </div>
                                <Badge className="bg-green-100 text-green-800">Completed</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Clock className="h-5 w-5 text-orange-600" />
                                  <span className="text-sm font-medium">Advanced Networking</span>
                                </div>
                                <Badge variant="outline">In Progress</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Target className="h-5 w-5 text-gray-400" />
                                  <span className="text-sm font-medium">Expert Certification</span>
                                </div>
                                <Button variant="outline" size="sm">Start</Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-white">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-green-600" />
                                Community
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <MessageCircle className="h-5 w-5 text-blue-600" />
                                  <span className="text-sm font-medium">Service Provider Forum</span>
                                </div>
                                <Button variant="outline" size="sm">Join</Button>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-5 w-5 text-purple-600" />
                                  <span className="text-sm font-medium">Monthly Webinars</span>
                                </div>
                                <Button variant="outline" size="sm">Register</Button>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Zap className="h-5 w-5 text-yellow-600" />
                                  <span className="text-sm font-medium">Success Stories</span>
                                </div>
                                <Button variant="outline" size="sm">Read</Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="help" className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-blue-600 p-2 rounded-lg">
                            <HelpCircle className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">Help & Support</h3>
                            <p className="text-gray-600">Get assistance with your service provider account</p>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <Card className="bg-white">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-green-600" />
                                Contact Support
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <MessageCircle className="h-5 w-5 text-green-600" />
                                  <div>
                                    <span className="text-sm font-medium">Live Chat</span>
                                    <p className="text-xs text-gray-500">Available 24/7</p>
                                  </div>
                                </div>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  Start Chat
                                </Button>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Phone className="h-5 w-5 text-blue-600" />
                                  <div>
                                    <span className="text-sm font-medium">Phone Support</span>
                                    <p className="text-xs text-gray-500">1-800-TECHGPT</p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">Call</Button>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Mail className="h-5 w-5 text-purple-600" />
                                  <div>
                                    <span className="text-sm font-medium">Email Support</span>
                                    <p className="text-xs text-gray-500">support@techgpt.com</p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">Email</Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-white">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5 text-orange-600" />
                                Knowledge Base
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                  <span className="text-sm font-medium">Getting Started</span>
                                </div>
                                <Button variant="outline" size="sm">View</Button>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                  <span className="text-sm font-medium">Payment & Billing</span>
                                </div>
                                <Button variant="outline" size="sm">View</Button>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                  <span className="text-sm font-medium">Technical Issues</span>
                                </div>
                                <Button variant="outline" size="sm">View</Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-white">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-green-600" />
                                Submit Ticket
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Issue Type</label>
                                <select className="w-full p-2 border rounded-lg">
                                  <option>Account Issues</option>
                                  <option>Payment Problems</option>
                                  <option>Technical Support</option>
                                  <option>Feature Request</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Priority</label>
                                <select className="w-full p-2 border rounded-lg">
                                  <option>Low</option>
                                  <option>Medium</option>
                                  <option>High</option>
                                  <option>Urgent</option>
                                </select>
                              </div>
                              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                Submit Ticket
                              </Button>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-white">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-purple-600" />
                                Community Help
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <MessageCircle className="h-5 w-5 text-green-600" />
                                  <span className="text-sm font-medium">Provider Forum</span>
                                </div>
                                <Button variant="outline" size="sm">Join</Button>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <HelpCircle className="h-5 w-5 text-blue-600" />
                                  <span className="text-sm font-medium">FAQ</span>
                                </div>
                                <Button variant="outline" size="sm">Browse</Button>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Video className="h-5 w-5 text-red-600" />
                                  <span className="text-sm font-medium">Video Tutorials</span>
                                </div>
                                <Button variant="outline" size="sm">Watch</Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="inbox" className="space-y-6">
                      <div className="bg-purple-50 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-purple-600 p-2 rounded-lg">
                            <Inbox className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">Inbox</h3>
                            <p className="text-gray-600">Messages, notifications, and updates</p>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <Card className="bg-white">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                  <Mail className="h-5 w-5 text-blue-600" />
                                  Messages
                                </CardTitle>
                                <Badge variant="destructive">3</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                                <div className="bg-blue-600 p-1 rounded-full">
                                  <Bell className="h-3 w-3 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">New Job Opportunity</span>
                                    <span className="text-xs text-gray-500">2 hours ago</span>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">Network troubleshooting job in downtown area</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="bg-gray-400 p-1 rounded-full">
                                  <Mail className="h-3 w-3 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Payment Processed</span>
                                    <span className="text-xs text-gray-500">1 day ago</span>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">Weekly payment of $450 has been processed</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="bg-gray-400 p-1 rounded-full">
                                  <Users className="h-3 w-3 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Customer Review</span>
                                    <span className="text-xs text-gray-500">3 days ago</span>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">Sarah M. left you a 5-star review</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-white">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                  <Bell className="h-5 w-5 text-orange-600" />
                                  Notifications
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                  <Filter className="h-4 w-4 text-gray-400" />
                                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Bell className="h-5 w-5 text-green-600" />
                                  <span className="text-sm font-medium">Job Notifications</span>
                                </div>
                                <Button variant="outline" size="sm">On</Button>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Mail className="h-5 w-5 text-blue-600" />
                                  <span className="text-sm font-medium">Email Updates</span>
                                </div>
                                <Button variant="outline" size="sm">On</Button>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <DollarSign className="h-5 w-5 text-green-600" />
                                  <span className="text-sm font-medium">Payment Alerts</span>
                                </div>
                                <Button variant="outline" size="sm">On</Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-white">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Archive className="h-5 w-5 text-gray-600" />
                                Recent Activity
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                  <div>
                                    <span className="text-sm font-medium">Job Completed</span>
                                    <p className="text-xs text-gray-500">Hardware repair - $85</p>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">Today</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Clock className="h-5 w-5 text-orange-600" />
                                  <div>
                                    <span className="text-sm font-medium">Job Started</span>
                                    <p className="text-xs text-gray-500">Network setup - $120</p>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">Yesterday</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Star className="h-5 w-5 text-yellow-600" />
                                  <div>
                                    <span className="text-sm font-medium">Rating Received</span>
                                    <p className="text-xs text-gray-500">5 stars from John D.</p>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">2 days ago</span>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-white">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-purple-600" />
                                Quick Actions
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <Button variant="outline" className="w-full justify-start">
                                <Mail className="h-4 w-4 mr-2" />
                                Compose Message
                              </Button>
                              <Button variant="outline" className="w-full justify-start">
                                <HelpCircle className="h-4 w-4 mr-2" />
                                Contact Support
                              </Button>
                              <Button variant="outline" className="w-full justify-start">
                                <Archive className="h-4 w-4 mr-2" />
                                View Archive
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" onClick={() => setLocation("/technician-dashboard")}>
                Dashboard
              </Button>
              <Button onClick={() => setLocation("/technician-register")}>
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-100 text-green-800 border-green-300 mb-6">
                💼 Professional Opportunity
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Earn Money Helping
                <span className="text-green-600"> People With Tech</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of verified service providers earning flexible income by solving technical problems. 
                Work remotely, by phone, or on-site - your choice, your schedule.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => setLocation("/technician-register")}
                  className="bg-green-600 hover:bg-green-700 text-lg px-8"
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Start Earning Today
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setLocation("/technician-dashboard")}
                  className="text-lg px-8"
                >
                  <Users className="h-5 w-5 mr-2" />
                  View Dashboard
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-white/50 backdrop-blur border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Monthly Earnings</h3>
                        <p className="text-sm text-gray-600">Top technicians</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">$8,500</p>
                      <p className="text-sm text-gray-500">+22% this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/50 backdrop-blur border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Target className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Jobs Available</h3>
                        <p className="text-sm text-gray-600">This week</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">2,847</p>
                      <p className="text-sm text-gray-500">High demand</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2 text-green-600">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Join TechGPT Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join the leading platform for technical professionals and start building your freelance career
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className={`${benefit.color} hover:shadow-lg transition-all duration-300 group`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                      <CardDescription className="text-gray-600 mb-3">
                        {benefit.description}
                      </CardDescription>
                      <Badge variant="secondary" className="bg-white/70">
                        {benefit.stats}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Types */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Multiple Ways to Work
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the service types that match your skills and preferences
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {serviceTypes.map((service, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-4 bg-green-100 rounded-full w-fit group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.type}</CardTitle>
                  <div className="text-2xl font-bold text-green-600">{service.rate}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Getting Started is Simple
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From registration to earning - start helping customers in just 3 steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 group-hover:scale-110 transition-transform">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-gray-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-4">Ready to Start Your Tech Career?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful technicians earning flexible income on TechGPT Pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setLocation("/technician-register")}
              className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8"
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Register as Technician
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setLocation("/technician-dashboard")}
              className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8"
            >
              <Users className="h-5 w-5 mr-2" />
              Access Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-600 p-1 rounded">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">TechGPT Pro</span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional platform for technical experts to earn flexible income helping customers worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Technicians</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/technician-register" className="hover:text-white">Join Platform</a></li>
                <li><a href="/technician-dashboard" className="hover:text-white">Dashboard</a></li>
                <li><a href="/technicians" className="hover:text-white">Learn More</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/help" className="hover:text-white">Help Center</a></li>
                <li><a href="/community" className="hover:text-white">Community</a></li>
                <li><a href="/training" className="hover:text-white">Training</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/careers" className="hover:text-white">Careers</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 TechGPT Pro. All rights reserved. Professional technical services platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}