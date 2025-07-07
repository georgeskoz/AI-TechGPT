import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Monitor, 
  Smartphone, 
  Wifi, 
  Database, 
  Shield, 
  Code, 
  HardDrive, 
  Server,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';

export interface TechnicalIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved';
  domain: string;
  keywords: string[];
  estimatedResolutionTime: string;
  reportedBy: string;
  timestamp: Date;
}

interface IssueCategorizationProps {
  onIssueCreated: (issue: TechnicalIssue) => void;
  onCategorySelected: (category: string, subcategory: string) => void;
}

const technicalCategories = {
  'Web Development': {
    icon: Code,
    color: 'bg-blue-100 text-blue-800',
    subcategories: [
      'Frontend Issues',
      'Backend Problems',
      'Database Connectivity',
      'API Integration',
      'Performance Issues',
      'Security Vulnerabilities',
      'Deployment Problems'
    ]
  },
  'Hardware Issues': {
    icon: Monitor,
    color: 'bg-orange-100 text-orange-800',
    subcategories: [
      'Computer Won\'t Start',
      'Overheating',
      'Hardware Failure',
      'Peripheral Problems',
      'Power Issues',
      'Memory Problems',
      'Storage Issues'
    ]
  },
  'Network Troubleshooting': {
    icon: Wifi,
    color: 'bg-green-100 text-green-800',
    subcategories: [
      'No Internet Connection',
      'Slow Connection',
      'WiFi Problems',
      'Network Configuration',
      'VPN Issues',
      'DNS Problems',
      'Firewall Issues'
    ]
  },
  'Database Help': {
    icon: Database,
    color: 'bg-purple-100 text-purple-800',
    subcategories: [
      'Query Performance',
      'Data Migration',
      'Backup & Recovery',
      'Schema Design',
      'Index Optimization',
      'Connection Issues',
      'Data Corruption'
    ]
  },
  'Mobile Devices': {
    icon: Smartphone,
    color: 'bg-pink-100 text-pink-800',
    subcategories: [
      'App Crashes',
      'Battery Issues',
      'Storage Problems',
      'Connectivity Issues',
      'OS Updates',
      'Performance Issues',
      'Security Concerns'
    ]
  },
  'Security Questions': {
    icon: Shield,
    color: 'bg-red-100 text-red-800',
    subcategories: [
      'Malware Detection',
      'Password Security',
      'Data Encryption',
      'Network Security',
      'Phishing Attempts',
      'Access Control',
      'Vulnerability Assessment'
    ]
  },
  'System Administration': {
    icon: Server,
    color: 'bg-indigo-100 text-indigo-800',
    subcategories: [
      'Server Configuration',
      'User Management',
      'Backup Systems',
      'Monitoring & Alerts',
      'Automation Scripts',
      'System Updates',
      'Performance Tuning'
    ]
  },
  'Software Issues': {
    icon: HardDrive,
    color: 'bg-yellow-100 text-yellow-800',
    subcategories: [
      'Installation Problems',
      'Software Crashes',
      'License Issues',
      'Compatibility Problems',
      'Update Failures',
      'Configuration Issues',
      'Performance Problems'
    ]
  },
  'Online Remote Support': {
    icon: Wrench,
    color: 'bg-gray-100 text-gray-800',
    subcategories: [
      'Phone Support - Basic Diagnosis',
      'Phone Support - Technical Guidance', 
      'Phone Support - Problem Solving',
      'Phone Support - Configuration Support',
      'Phone Support - Advanced Consultation',
      'Phone Support - Emergency Response',
      'Phone Support - Expert Architecture Review'
    ]
  },
  'On-Site Support Services': {
    icon: Wrench,
    color: 'bg-purple-100 text-purple-800',
    subcategories: [
      'On-site Technician Visit',
      'Training & Documentation',
      'Consulting Services', 
      'Emergency On-site Support',
      'Maintenance Services',
      'System Assessment',
      'Installation Services'
    ]
  }
};

const priorityConfig = {
  low: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  medium: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  high: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
  urgent: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
};

export default function IssueCategorization({ onIssueCreated, onCategorySelected }: IssueCategorizationProps) {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [issueTitle, setIssueTitle] = useState<string>('');
  const [issueDescription, setIssueDescription] = useState<string>('');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
    onCategorySelected(category, '');
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    onCategorySelected(selectedCategory, subcategory);
    
    // Navigate to phone support if a phone support subcategory is selected
    if (subcategory.startsWith('Phone Support')) {
      setLocation('/phone-support');
      return;
    }
  };

  const handleCreateIssue = () => {
    if (!selectedCategory || !selectedSubcategory || !issueTitle.trim()) return;

    const issue: TechnicalIssue = {
      id: Date.now().toString(),
      title: issueTitle,
      description: issueDescription,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      priority: selectedPriority,
      status: 'open',
      domain: selectedCategory,
      keywords: [selectedCategory, selectedSubcategory, ...issueTitle.toLowerCase().split(' ')],
      estimatedResolutionTime: getEstimatedTime(selectedPriority),
      reportedBy: 'User',
      timestamp: new Date()
    };

    onIssueCreated(issue);
    
    // Reset form
    setIssueTitle('');
    setIssueDescription('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedPriority('medium');
  };

  const getEstimatedTime = (priority: string): string => {
    const timeMap = {
      low: '2-3 days',
      medium: '1-2 days',
      high: '4-8 hours',
      urgent: '1-2 hours'
    };
    return timeMap[priority as keyof typeof timeMap] || '1-2 days';
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Technical Issue Categorization
          </CardTitle>
          <CardDescription>
            Select the category that best describes your technical issue for specialized assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(technicalCategories).map(([category, config]) => {
              const IconComponent = config.icon;
              return (
                <Card
                  key={category}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedCategory === category ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${config.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{category}</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {config.subcategories.length} subcategories
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Subcategory Selection */}
      {selectedCategory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedCategory} - Specific Issues
            </CardTitle>
            <CardDescription>
              Choose the specific type of {selectedCategory.toLowerCase()} issue you're experiencing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {technicalCategories[selectedCategory as keyof typeof technicalCategories].subcategories.map((subcategory) => (
                <Button
                  key={subcategory}
                  variant={selectedSubcategory === subcategory ? "default" : "outline"}
                  className="justify-start text-left h-auto p-3"
                  onClick={() => handleSubcategorySelect(subcategory)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedSubcategory === subcategory ? 'bg-white' : 'bg-gray-400'
                    }`} />
                    {subcategory}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issue Details Form */}
      {selectedCategory && selectedSubcategory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Issue Details</CardTitle>
            <CardDescription>
              Provide specific details about your {selectedSubcategory.toLowerCase()} issue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Issue Title</label>
              <input
                type="text"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Brief description of the issue..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Detailed Description</label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="w-full p-2 border rounded-md h-24 resize-none"
                placeholder="Provide more details about what you're experiencing..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority Level</label>
              <Select value={selectedPriority} onValueChange={(value: any) => setSelectedPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityConfig).map(([priority, config]) => {
                    const IconComponent = config.icon;
                    return (
                      <SelectItem key={priority} value={priority}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span className="capitalize">{priority}</span>
                          <Badge className={`ml-2 ${config.color}`}>
                            {getEstimatedTime(priority)}
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateIssue} className="flex-1">
                <User className="w-4 h-4 mr-2" />
                Create Issue & Get Help
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Category Summary */}
      {selectedCategory && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={technicalCategories[selectedCategory as keyof typeof technicalCategories].color}>
                {selectedCategory}
              </Badge>
              {selectedSubcategory && (
                <Badge variant="outline">{selectedSubcategory}</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">
              AI will provide specialized assistance for {selectedCategory.toLowerCase()} 
              {selectedSubcategory && ` focusing on ${selectedSubcategory.toLowerCase()}`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}