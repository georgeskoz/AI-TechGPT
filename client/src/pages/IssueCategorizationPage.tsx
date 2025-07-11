import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MessageCircle, List, Plus, DollarSign, CheckCircle, Clock, User } from 'lucide-react';
import Navigation from '@/components/Navigation';
import IssueCategorization, { TechnicalIssue } from '@/components/IssueCategorization';
import IssueTracker from '@/components/IssueTracker';
import UniversalPricingCalculator from '@/components/UniversalPricingCalculator';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function IssueCategorizationPage() {
  const [, setLocation] = useLocation();
  const [issues, setIssues] = useLocalStorage<TechnicalIssue[]>('techgpt_issues', []);
  const [selectedIssue, setSelectedIssue] = useState<TechnicalIssue | null>(null);
  const [activeTab, setActiveTab] = useState('categorize');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

  const handleIssueCreated = (newIssue: TechnicalIssue) => {
    setIssues(prev => [...prev, newIssue]);
    setActiveTab('tracker');
    
    // Navigate to chat with the issue context
    setTimeout(() => {
      setLocation('/chat');
    }, 1000);
  };

  const handleCategorySelected = (category: string, subcategory: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    if (subcategory) {
      setActiveTab('pricing');
    }
  };

  const handleServiceBooked = (category: string, subcategory: string, factors: any, price: number) => {
    const serviceBooking = {
      id: Date.now().toString(),
      title: `${subcategory} Service Booking`,
      description: `Booked ${subcategory} service in ${category} for $${price}`,
      category,
      subcategory,
      priority: factors.urgency as 'low' | 'medium' | 'high' | 'urgent',
      status: 'open' as const,
      domain: category,
      keywords: [category.toLowerCase(), subcategory.toLowerCase(), 'service', 'booking'],
      estimatedResolutionTime: `${factors.estimatedDuration} minutes`,
      reportedBy: 'user',
      timestamp: new Date()
    };
    
    setIssues(prev => [...prev, serviceBooking]);
    setActiveTab('tracker');
    
    setTimeout(() => {
      setLocation('/chat');
    }, 2000);
  };

  const handleIssueSelect = (issue: TechnicalIssue) => {
    setSelectedIssue(issue);
    // Navigate to chat with the issue context
    setLocation('/chat');
  };

  const handleStatusUpdate = (issueId: string, newStatus: TechnicalIssue['status']) => {
    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation title="Issue Management" backTo="/" />
      
      {/* Header Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Technical Support Center</h1>
            <p className="text-gray-600 mb-6">Manage your technical issues and get expert help</p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 px-4 py-2">
                <List className="w-4 h-4 mr-2" />
                {issues.length} Total Issues
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                {issues.filter(i => i.status === 'resolved').length} Resolved
              </Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                {issues.filter(i => i.status === 'in-progress').length} In Progress
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="categorize" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Issue
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              My Issues
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Pricing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categorize" className="mt-0">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <CardTitle className="text-xl">Report New Technical Issue</CardTitle>
                <p className="text-blue-100">Select your issue category to get started with expert support</p>
              </CardHeader>
              <CardContent className="p-6">
                <IssueCategorization
                  onIssueCreated={handleIssueCreated}
                  onCategorySelected={handleCategorySelected}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracker" className="mt-0">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <CardTitle className="text-xl">Issue Tracker</CardTitle>
                <p className="text-green-100">Monitor and manage all your technical support requests</p>
              </CardHeader>
              <CardContent className="p-6">
                <IssueTracker
                  issues={issues}
                  onIssueSelect={handleIssueSelect}
                  onStatusUpdate={handleStatusUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="mt-0">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="text-xl">Service Pricing Calculator</CardTitle>
                <p className="text-purple-100">Get instant pricing for technical support services</p>
              </CardHeader>
              <CardContent className="p-6">
                <UniversalPricingCalculator
                  selectedCategory={selectedCategory}
                  selectedSubcategory={selectedSubcategory}
                  onServiceBooked={handleServiceBooked}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Quick Actions Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/chat')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Chat Support</h3>
              <p className="text-gray-600 text-sm">Get instant help from our AI assistant</p>
              <Button variant="outline" className="mt-4 w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/phone-support')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
              <p className="text-gray-600 text-sm">Talk to a human expert directly</p>
              <Button variant="outline" className="mt-4 w-full">
                Call Now
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/technician-request')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Service Provider</h3>
              <p className="text-gray-600 text-sm">Book an expert technician</p>
              <Button variant="outline" className="mt-4 w-full">
                Book Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}