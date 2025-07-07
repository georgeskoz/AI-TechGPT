import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Filter,
  Search,
  Calendar,
  User,
  Tag,
  ArrowRight
} from 'lucide-react';
import { TechnicalIssue } from './IssueCategorization';

interface IssueTrackerProps {
  issues: TechnicalIssue[];
  onIssueSelect: (issue: TechnicalIssue) => void;
  onStatusUpdate: (issueId: string, status: TechnicalIssue['status']) => void;
}

const statusConfig = {
  'open': { 
    color: 'bg-red-100 text-red-800', 
    icon: AlertTriangle, 
    label: 'Open' 
  },
  'in-progress': { 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Clock, 
    label: 'In Progress' 
  },
  'resolved': { 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle, 
    label: 'Resolved' 
  }
};

const priorityConfig = {
  'low': { color: 'bg-green-100 text-green-800', label: 'Low' },
  'medium': { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
  'high': { color: 'bg-orange-100 text-orange-800', label: 'High' },
  'urgent': { color: 'bg-red-100 text-red-800', label: 'Urgent' }
};

export default function IssueTracker({ issues, onIssueSelect, onStatusUpdate }: IssueTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || issue.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getIssuesByStatus = (status: string) => {
    return filteredIssues.filter(issue => issue.status === status);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = (issueId: string, newStatus: TechnicalIssue['status']) => {
    onStatusUpdate(issueId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">Technical Issue Tracker</h2>
          <p className="text-gray-600">Monitor and manage your technical support requests</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold">{issues.length}</p>
              </div>
              <Tag className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Issues</p>
                <p className="text-2xl font-bold text-red-600">
                  {issues.filter(i => i.status === 'open').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {issues.filter(i => i.status === 'in-progress').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {issues.filter(i => i.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Issues</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <IssuesList 
            issues={filteredIssues} 
            onIssueSelect={onIssueSelect}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="open">
          <IssuesList 
            issues={getIssuesByStatus('open')} 
            onIssueSelect={onIssueSelect}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="in-progress">
          <IssuesList 
            issues={getIssuesByStatus('in-progress')} 
            onIssueSelect={onIssueSelect}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="resolved">
          <IssuesList 
            issues={getIssuesByStatus('resolved')} 
            onIssueSelect={onIssueSelect}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface IssuesListProps {
  issues: TechnicalIssue[];
  onIssueSelect: (issue: TechnicalIssue) => void;
  onStatusChange: (issueId: string, status: TechnicalIssue['status']) => void;
}

function IssuesList({ issues, onIssueSelect, onStatusChange }: IssuesListProps) {
  if (issues.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No issues found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => {
        const StatusIcon = statusConfig[issue.status].icon;
        return (
          <Card key={issue.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1" onClick={() => onIssueSelect(issue)}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={statusConfig[issue.status].color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[issue.status].label}
                    </Badge>
                    <Badge className={priorityConfig[issue.priority].color}>
                      {priorityConfig[issue.priority].label}
                    </Badge>
                    <Badge variant="outline">{issue.category}</Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1">{issue.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{issue.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(issue.timestamp)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {issue.reportedBy}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      ETA: {issue.estimatedResolutionTime}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {issue.status === 'open' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onStatusChange(issue.id, 'in-progress')}
                    >
                      Start Work
                    </Button>
                  )}
                  {issue.status === 'in-progress' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onStatusChange(issue.id, 'resolved')}
                    >
                      Mark Resolved
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => onIssueSelect(issue)}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}