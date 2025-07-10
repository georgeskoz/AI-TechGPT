import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MessageCircle, List, Plus, DollarSign } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      <Navigation title="Issue Management" backTo="/" />
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">Support Options</h1>
          <div className="flex justify-center gap-2 mt-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
              {issues.length} Issues
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
              {issues.filter(i => i.status === 'resolved').length} Resolved
            </Badge>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categorize" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Issue
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              My Issues
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categorize" className="mt-4">
            <IssueCategorization
              onIssueCreated={handleIssueCreated}
              onCategorySelected={handleCategorySelected}
            />
          </TabsContent>

          <TabsContent value="tracker" className="mt-4">
            <IssueTracker
              issues={issues}
              onIssueSelect={handleIssueSelect}
              onStatusUpdate={handleStatusUpdate}
            />
          </TabsContent>
        </Tabs>
        
        {/* Quick Help Actions */}
        <div className="mt-6 space-y-3">
          <Card>
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <h3 className="font-semibold">Need Help Right Now?</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => setLocation('/chat')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    AI Chat
                  </Button>
                  <Button 
                    onClick={() => setLocation('/phone-support')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    Phone Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}