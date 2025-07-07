import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MessageCircle, List, Plus, DollarSign } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/chat')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Chat
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Issue Management</h1>
                <p className="text-gray-600">Categorize and track your technical support requests</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {issues.length} Total Issues
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {issues.filter(i => i.status === 'resolved').length} Resolved
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="categorize" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Categorize New Issue
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Service Pricing
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Issue Tracker
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              AI Chat Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categorize" className="mt-6">
            <IssueCategorization
              onIssueCreated={handleIssueCreated}
              onCategorySelected={handleCategorySelected}
            />
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            <UniversalPricingCalculator
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onServiceBooked={handleServiceBooked}
            />
          </TabsContent>

          <TabsContent value="tracker" className="mt-6">
            <IssueTracker
              issues={issues}
              onIssueSelect={handleIssueSelect}
              onStatusUpdate={handleStatusUpdate}
            />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  AI Chat Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Get AI-Powered Support</h3>
                  <p className="text-gray-600 mb-6">
                    Chat with our AI assistant for immediate help with your technical issues.
                    {selectedIssue && (
                      <span className="block mt-2 text-blue-600 font-medium">
                        Current Issue: {selectedIssue.title}
                      </span>
                    )}
                  </p>
                  <Button onClick={() => setLocation('/chat')} size="lg">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Chat Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Actions Sidebar */}
      <div className="fixed bottom-6 right-6 space-y-3">
        <div className="bg-white rounded-lg shadow-lg p-4 border">
          <h4 className="font-semibold mb-2">Quick Actions</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('categorize')}
              className="w-full justify-start"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Issue
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation('/chat')}
              className="w-full justify-start"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}