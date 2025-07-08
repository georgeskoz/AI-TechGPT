import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { 
  Users, 
  Briefcase, 
  Shield,
  ArrowRight,
  Zap,
  Star,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Award
} from "lucide-react";
import { useLocation } from "wouter";

export default function DomainSelector() {
  const [, setLocation] = useLocation();

  const domains = [
    {
      id: "customer",
      title: "Customer Support",
      description: "Get instant technical help and support for all your tech problems",
      icon: <Users className="h-12 w-12 text-blue-600" />,
      route: "/customer-home",
      color: "bg-blue-50 border-blue-200 hover:border-blue-300",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      features: [
        "AI-powered instant chat support",
        "Expert technician matching",
        "Real-time live support chat",
        "On-site service booking"
      ],
      stats: "25,000+ happy customers",
      badge: "Most Popular"
    },
    {
      id: "technician", 
      title: "Technician Platform",
      description: "Join our network of experts and earn money solving technical problems",
      icon: <Briefcase className="h-12 w-12 text-green-600" />,
      route: "/technician-home",
      color: "bg-green-50 border-green-200 hover:border-green-300",
      buttonColor: "bg-green-600 hover:bg-green-700",
      features: [
        "Flexible earning opportunities",
        "Work remotely or on-site",
        "Set your own schedule",
        "Verified secure platform"
      ],
      stats: "5,000+ active technicians",
      badge: "High Demand"
    },
    {
      id: "admin",
      title: "Admin Dashboard",
      description: "Comprehensive platform management and analytics for administrators",
      icon: <Shield className="h-12 w-12 text-purple-600" />,
      route: "/admin-home", 
      color: "bg-purple-50 border-purple-200 hover:border-purple-300",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      features: [
        "Real-time platform analytics",
        "User and technician management",
        "System monitoring tools",
        "Dispute resolution center"
      ],
      stats: "Complete oversight control",
      badge: "Admin Only"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navigation title="Platform Selector" backTo="/" showHomeButton={false} />
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">TechGPT</h1>
                <p className="text-gray-600">Technical Support Ecosystem</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto mb-16">
            <Badge className="bg-blue-100 text-blue-800 border-blue-300 mb-6">
              🚀 Multi-Domain Platform
            </Badge>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Choose Your
              <span className="text-blue-600"> Experience</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              TechGPT offers three specialized platforms tailored for different user types. 
              Select your domain to access features designed specifically for your needs.
            </p>
          </div>

          {/* Domain Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {domains.map((domain) => (
              <Card 
                key={domain.id} 
                className={`${domain.color} hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden`}
                onClick={() => setLocation(domain.route)}
              >
                {domain.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      {domain.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-6 text-center">
                  <div className="mx-auto p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform mb-4">
                    {domain.icon}
                  </div>
                  <CardTitle className="text-2xl mb-3">{domain.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {domain.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {domain.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div className="bg-white/50 rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-gray-700">{domain.stats}</p>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => setLocation(domain.route)}
                    className={`w-full ${domain.buttonColor} group-hover:scale-105 transition-transform text-white`}
                    size="lg"
                  >
                    Enter Platform
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Overview</h2>
            <p className="text-lg text-gray-600">Trusted by thousands worldwide</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">30,000+</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-3">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">150K+</div>
              <div className="text-sm text-gray-600">Issues Resolved</div>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">98.5%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-3">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <p className="text-lg text-gray-600">Jump directly to popular features</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">AI Chat</h3>
                <p className="text-sm text-gray-600 mb-4">Instant AI assistance</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setLocation("/chat")}
                  className="w-full"
                >
                  Start Chat
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Find Technician</h3>
                <p className="text-sm text-gray-600 mb-4">Expert matching</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setLocation("/find-expert")}
                  className="w-full"
                >
                  Find Expert
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Briefcase className="h-8 w-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Join Platform</h3>
                <p className="text-sm text-gray-600 mb-4">Become a technician</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setLocation("/technician-register")}
                  className="w-full"
                >
                  Register
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-gray-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Admin Panel</h3>
                <p className="text-sm text-gray-600 mb-4">Platform management</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setLocation("/admin")}
                  className="w-full"
                >
                  Access
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">TechGPT</span>
            </div>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Comprehensive technical support ecosystem connecting customers with AI-powered solutions 
              and expert technicians worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <a href="/customer-home" className="hover:text-white">Customer Platform</a>
              <a href="/technician-home" className="hover:text-white">Technician Platform</a>
              <a href="/admin-home" className="hover:text-white">Admin Platform</a>
              <a href="/about" className="hover:text-white">About</a>
              <a href="/contact" className="hover:text-white">Contact</a>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400">
              <p>&copy; 2025 TechGPT. All rights reserved. Multi-domain technical support platform.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}