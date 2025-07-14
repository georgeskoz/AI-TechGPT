import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SimpleNavigation from "@/components/SimpleNavigation";
import { 
  Users, 
  Star, 
  Clock, 
  Shield, 
  DollarSign,
  ArrowRight,
  CheckCircle,
  Zap,
  Award,
  TrendingUp
} from "lucide-react";

export default function TechnicianLanding() {
  const features = [
    {
      icon: DollarSign,
      title: "Flexible Earnings",
      description: "Set your own rates from $25-$500+ per hour. Top technicians earn over $100/hour.",
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      icon: Clock,
      title: "Work on Your Schedule",
      description: "Choose your availability and work when it suits you. Full or part-time options.",
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      icon: Shield,
      title: "Verified Platform",
      description: "Professional verification, secure payments, and customer screening.",
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      icon: Zap,
      title: "Instant Job Matching",
      description: "Get matched with customers looking for your specific skills instantly.",
      color: "text-yellow-600",
      bg: "bg-yellow-100"
    },
    {
      icon: Award,
      title: "Build Your Reputation",
      description: "Earn ratings and reviews to attract more high-paying customers.",
      color: "text-red-600",
      bg: "bg-red-100"
    },
    {
      icon: TrendingUp,
      title: "Growing Platform",
      description: "Join thousands of service providers on the fastest-growing tech support platform.",
      color: "text-indigo-600",
      bg: "bg-indigo-100"
    }
  ];

  const serviceTypes = [
    {
      title: "Remote Support",
      description: "Help customers via screen sharing and remote access tools",
      rate: "$25-75/hour",
      icon: "💻"
    },
    {
      title: "Phone Support",
      description: "Provide technical guidance over the phone",
      rate: "$30-95/hour", 
      icon: "📞"
    },
    {
      title: "On-Site Service",
      description: "Visit customers for hands-on hardware and setup assistance",
      rate: "$50-200+/hour",
      icon: "🏠"
    }
  ];

  const requirements = [
    "2+ years of technical support experience",
    "Strong communication skills", 
    "Background check clearance",
    "Valid driver's license (for on-site services)",
    "Professional liability insurance (provided)",
    "Smartphone for job management app"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SimpleNavigation title="Service Provider Opportunities" backTo="/domains" />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">
            Now Hiring Service Providers
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Turn Your Tech Skills Into <span className="text-blue-600">Income</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join TechGPT's marketplace and connect with customers who need your expertise. 
            Earn money helping solve technical problems while working on your own schedule.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/technician-register">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Earning Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/technician-dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Service Provider Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-blue-600">$95</div>
            <div className="text-gray-600">Average Hourly Rate</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-green-600">2,500+</div>
            <div className="text-gray-600">Active Service Providers</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-purple-600">50k+</div>
            <div className="text-gray-600">Jobs Completed</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-orange-600">4.8★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>

        {/* Service Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Service Type</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {serviceTypes.map((service) => (
              <Card key={service.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <CardTitle>{service.title}</CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto">
                    {service.rate}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join TechGPT?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-gray-600 mb-6">
                Join our community of professional technicians and start earning money 
                by helping customers solve their technical problems. The registration 
                process is quick and our team will guide you through verification.
              </p>
              <Link href="/technician-register">
                <Button size="lg">
                  Register Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Basic Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirements.map((requirement) => (
                    <li key={requirement} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Start Your Technician Journey Today</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of technicians who are earning great money while helping others. 
              Complete registration takes less than 10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/technician-register">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Register as Technician <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/technician-dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
                  Existing Technician Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}