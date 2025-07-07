import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { 
  MessageSquare, 
  Users, 
  Zap, 
  Shield, 
  Clock, 
  Star,
  ArrowRight,
  Headphones,
  Monitor,
  MapPin,
  CheckCircle
} from "lucide-react";
import { useLocation } from "wouter";

export default function CustomerHomePage() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Chat Support",
      description: "Get instant help from our advanced AI assistant for common technical issues",
      action: "Start Chat",
      route: "/chat",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Expert Technicians",
      description: "Connect with verified technicians for complex problems requiring human expertise",
      action: "Find Technician",
      route: "/technician-matching",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Headphones className="h-8 w-8 text-purple-600" />,
      title: "Live Support Chat",
      description: "Real-time chat with technical experts for immediate assistance",
      action: "Start Live Chat",
      route: "/live-support",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <MapPin className="h-8 w-8 text-orange-600" />,
      title: "On-Site Services",
      description: "Book technicians to come to your location for hands-on repairs",
      action: "Book On-Site",
      route: "/phone-support",
      color: "bg-orange-50 border-orange-200"
    }
  ];

  const stats = [
    { label: "Happy Customers", value: "25,000+", icon: <Users className="h-5 w-5" /> },
    { label: "Issues Resolved", value: "150,000+", icon: <CheckCircle className="h-5 w-5" /> },
    { label: "Average Response", value: "< 2 min", icon: <Clock className="h-5 w-5" /> },
    { label: "Customer Rating", value: "4.9/5", icon: <Star className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation title="Customer Portal" backTo="/domains" />
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TechGPT</h1>
                <p className="text-sm text-gray-600">Customer Support</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setLocation("/dashboard")}>
                Dashboard
              </Button>
              <Button onClick={() => setLocation("/chat")}>
                Get Help Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="bg-blue-100 text-blue-800 border-blue-300 mb-6">
              ⚡ Instant Technical Support
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Get Technical Help
              <span className="text-blue-600"> Instantly</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              From AI-powered instant solutions to expert technician support - we've got you covered. 
              Get help with hardware issues, software problems, and everything in between.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setLocation("/chat")}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Start Free AI Chat
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setLocation("/technician-matching")}
                className="text-lg px-8"
              >
                <Users className="h-5 w-5 mr-2" />
                Find Expert Technician
              </Button>
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
                <div className="flex items-center justify-center mb-2 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Multiple Ways to Get Help
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the support option that works best for your situation and urgency level
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className={`${feature.color} hover:shadow-lg transition-all duration-300 cursor-pointer group`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                        <CardDescription className="text-gray-600">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setLocation(feature.route)}
                    className="w-full group-hover:scale-105 transition-transform"
                    variant="default"
                  >
                    {feature.action}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands</h3>
            <p className="text-lg text-gray-600 mb-8">
              Our platform connects you with verified, experienced technicians who have helped solve 
              over 150,000 technical issues. All technicians are background-checked and rated by customers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="bg-white">✓ 24/7 Availability</Badge>
              <Badge variant="outline" className="bg-white">✓ Verified Technicians</Badge>
              <Badge variant="outline" className="bg-white">✓ Money-Back Guarantee</Badge>
              <Badge variant="outline" className="bg-white">✓ Secure Platform</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-4">Ready to Solve Your Tech Problems?</h3>
          <p className="text-xl mb-8 opacity-90">
            Start with our free AI assistant or connect directly with a human expert
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setLocation("/chat")}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Try AI Assistant (Free)
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setLocation("/technician-matching")}
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8"
            >
              <Users className="h-5 w-5 mr-2" />
              Get Human Expert
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
                <div className="bg-blue-600 p-1 rounded">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">TechGPT</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered technical support platform connecting users with instant solutions and expert technicians.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support Options</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/chat" className="hover:text-white">AI Chat Support</a></li>
                <li><a href="/live-support" className="hover:text-white">Live Chat</a></li>
                <li><a href="/technician-matching" className="hover:text-white">Find Technician</a></li>
                <li><a href="/phone-support" className="hover:text-white">Phone Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/issues" className="hover:text-white">Issue Categories</a></li>
                <li><a href="/triage" className="hover:text-white">AI Triage</a></li>
                <li><a href="/diagnostic" className="hover:text-white">Diagnostics</a></li>
                <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Technicians</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/technicians" className="hover:text-white">Join Platform</a></li>
                <li><a href="/technician-register" className="hover:text-white">Register</a></li>
                <li><a href="/technician-dashboard" className="hover:text-white">Dashboard</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 TechGPT. All rights reserved. Instant technical support powered by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}