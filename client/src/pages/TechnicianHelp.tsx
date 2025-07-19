import { useState } from 'react';
import { useAuth } from '@/components/UserAuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Navigation from '@/components/Navigation';
import { 
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Book,
  Video,
  Users,
  Settings,
  DollarSign,
  Shield,
  Headphones
} from 'lucide-react';

export default function TechnicianHelp() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    message: ''
  });

  // FAQ data for service providers
  const faqs = [
    {
      id: 1,
      question: "How do I get more job opportunities?",
      answer: "To increase job opportunities: Complete your profile 100%, add more skills and certifications, maintain high ratings (4.5+), respond quickly to job notifications, expand your service areas, and upload recent work samples.",
      category: "Jobs"
    },
    {
      id: 2,
      question: "When and how do I get paid?",
      answer: "Payments are processed weekly every Friday for completed jobs. You receive 85% of the job value after the 15% platform fee. Payments are sent to your chosen method (bank transfer, PayPal, or Stripe) within 2-3 business days.",
      category: "Payments"
    },
    {
      id: 3,
      question: "How can I improve my service provider rating?",
      answer: "Maintain high ratings by: Arriving on time, communicating clearly with customers, completing jobs thoroughly, being professional and courteous, following up after service, and asking satisfied customers to leave reviews.",
      category: "Ratings"
    },
    {
      id: 4,
      question: "What should I do if a customer cancels last minute?",
      answer: "If a customer cancels within 2 hours of scheduled service, you may be eligible for a cancellation fee (usually 50% of job value). Contact support immediately with the job details to process the cancellation fee.",
      category: "Jobs"
    },
    {
      id: 5,
      question: "How do I handle difficult customers?",
      answer: "Stay professional, document all interactions, try to resolve issues calmly, and contact support if the situation escalates. Never argue or become confrontational. Our support team is here to mediate disputes.",
      category: "Customer Relations"
    },
    {
      id: 6,
      question: "Can I set my own prices?",
      answer: "Service rates are standardized by category to ensure fair pricing for customers. However, you can add premium charges for emergency services, complex jobs, or specialized equipment with customer approval.",
      category: "Pricing"
    },
    {
      id: 7,
      question: "What happens if I can't complete a job?",
      answer: "If you encounter issues beyond your expertise, contact support immediately. We can assign additional specialists or arrange for partial payment based on work completed. Always communicate with the customer and platform support.",
      category: "Jobs"
    },
    {
      id: 8,
      question: "How do I report a safety concern?",
      answer: "Safety is our priority. Immediately report any unsafe working conditions, threatening behavior, or security concerns to our 24/7 support line: 1-800-TECHERS. Leave the location if you feel unsafe.",
      category: "Safety"
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // TODO: Implement contact form submission
    alert('Your message has been sent! We\'ll respond within 24 hours.');
    setContactForm({ subject: '', category: '', priority: 'medium', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Provider Help Center</h1>
              <p className="text-gray-600 mt-1">
                Get support, find answers, and connect with our team
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                24/7 Support Available
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Emergency Support</h3>
                  <p className="text-sm text-gray-600">24/7 phone support</p>
                  <p className="text-sm font-mono text-green-600">1-800-TECHERS</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Live Chat</h3>
                  <p className="text-sm text-gray-600">Chat with support agent</p>
                  <p className="text-sm text-blue-600">Usually responds in 5 min</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Support</h3>
                  <p className="text-sm text-gray-600">Send detailed inquiries</p>
                  <p className="text-sm text-purple-600">support@techersGPT.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
            <TabsTrigger value="guides">Guides & Resources</TabsTrigger>
            <TabsTrigger value="status">Service Status</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                          {faq.question}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-8">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">Try adjusting your search terms</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Support Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Support Team
                </CardTitle>
                <p className="text-gray-600">
                  Can't find what you're looking for? Send us a message and we'll help you out.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Input
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select
                        value={contactForm.category}
                        onChange={(e) => setContactForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="jobs">Jobs & Opportunities</option>
                        <option value="payments">Payments & Earnings</option>
                        <option value="technical">Technical Issues</option>
                        <option value="account">Account & Profile</option>
                        <option value="customer">Customer Relations</option>
                        <option value="safety">Safety Concerns</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <div className="flex space-x-4">
                      {['low', 'medium', 'high', 'urgent'].map((priority) => (
                        <label key={priority} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value={priority}
                            checked={contactForm.priority === priority}
                            onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                            className="text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm capitalize">{priority}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Please provide detailed information about your issue or question..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guides & Resources Tab */}
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-blue-600" />
                    Getting Started Guides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Complete Your Profile</span>
                    <Badge variant="secondary">Essential</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Understanding Job Types</span>
                    <Badge variant="outline">Guide</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Payment & Earnings Process</span>
                    <Badge variant="outline">Guide</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-red-600" />
                    Video Tutorials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Platform Navigation (5 min)</span>
                    <Badge variant="secondary">New</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Managing Job Requests (8 min)</span>
                    <Badge variant="outline">Popular</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Customer Communication (6 min)</span>
                    <Badge variant="outline">Tutorial</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Community Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Service Provider Forum</span>
                    <Badge variant="outline">Community</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Best Practices Database</span>
                    <Badge variant="outline">Resources</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Monthly Webinars</span>
                    <Badge variant="secondary">Live</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Policies & Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Service Provider Agreement</span>
                    <Badge variant="outline">Legal</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Safety Guidelines</span>
                    <Badge variant="secondary">Important</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Quality Standards</span>
                    <Badge variant="outline">Policy</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Service Status Tab */}
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Platform Status & Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">All Systems Operational</p>
                        <p className="text-sm text-green-700">Platform is running smoothly</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Live
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Recent Updates</h4>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900">New Feature: Enhanced Job Matching</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Our improved algorithm now provides better job matches based on your skills and location.
                          </p>
                          <p className="text-xs text-blue-600 mt-2">January 19, 2025</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-900">Scheduled Maintenance</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Planned system maintenance this Sunday 2:00-4:00 AM EST. Limited functionality during this time.
                          </p>
                          <p className="text-xs text-yellow-600 mt-2">Scheduled: January 21, 2025</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}