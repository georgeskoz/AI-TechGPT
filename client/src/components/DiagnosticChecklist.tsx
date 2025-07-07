import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Brain, 
  Loader2,
  Download,
  RotateCcw,
  Clock,
  Target
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ChecklistItem {
  id: string;
  step: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  estimatedTime: number;
  completed: boolean;
  result?: 'success' | 'failed' | 'partial';
  notes?: string;
}

interface DiagnosticChecklist {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTotalTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  items: ChecklistItem[];
  generatedAt: Date;
}

interface DiagnosticChecklistProps {
  issue: string;
  category?: string;
  onComplete?: (checklist: DiagnosticChecklist, results: any) => void;
}

export default function DiagnosticChecklist({ 
  issue, 
  category, 
  onComplete 
}: DiagnosticChecklistProps) {
  const [checklist, setChecklist] = useState<DiagnosticChecklist | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [itemResults, setItemResults] = useState<Record<string, any>>({});

  const generateChecklist = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate progress during generation
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const response = await apiRequest("POST", "/api/diagnostic/generate", {
        issue,
        category: category || "General Support"
      });
      
      const result = await response.json();
      setChecklist(result);
      setGenerationProgress(100);
      
    } catch (error) {
      console.error("Error generating diagnostic checklist:", error);
      // Fallback checklist
      setChecklist({
        id: `checklist_${Date.now()}`,
        title: "Basic Troubleshooting Checklist",
        description: "General diagnostic steps for your issue",
        category: category || "General Support",
        estimatedTotalTime: 30,
        difficulty: "beginner",
        items: [
          {
            id: "step_1",
            step: "Restart your device",
            description: "Turn off your device completely, wait 30 seconds, then turn it back on",
            priority: "high",
            category: "Basic Steps",
            estimatedTime: 5,
            completed: false
          },
          {
            id: "step_2", 
            step: "Check for updates",
            description: "Ensure your system and software are up to date",
            priority: "medium",
            category: "System Maintenance",
            estimatedTime: 10,
            completed: false
          },
          {
            id: "step_3",
            step: "Run system diagnostics",
            description: "Use built-in diagnostic tools to identify potential issues",
            priority: "medium", 
            category: "Diagnostics",
            estimatedTime: 15,
            completed: false
          }
        ],
        generatedAt: new Date()
      });
      setGenerationProgress(100);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  const toggleItemCompletion = (itemId: string, result?: 'success' | 'failed' | 'partial', notes?: string) => {
    setCompletedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
    
    if (result || notes) {
      setItemResults(prev => ({
        ...prev,
        [itemId]: { result, notes }
      }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCompletionPercentage = () => {
    if (!checklist) return 0;
    return Math.round((completedItems.length / checklist.items.length) * 100);
  };

  const exportChecklist = () => {
    if (!checklist) return;
    
    const checklistData = {
      ...checklist,
      completedItems,
      results: itemResults,
      completionPercentage: getCompletionPercentage(),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(checklistData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostic-checklist-${Date.now()}.json`;
    a.click();
  };

  useEffect(() => {
    if (issue) {
      generateChecklist();
    }
  }, [issue, category]);

  if (!checklist && !isGenerating) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ready to Generate Diagnostic Checklist
          </h3>
          <p className="text-gray-600 mb-4">
            Click below to create a customized troubleshooting checklist for your issue.
          </p>
          <Button onClick={generateChecklist}>
            <Brain className="h-4 w-4 mr-2" />
            Generate Checklist
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Generating Diagnostic Checklist
            </h3>
            <p className="text-gray-600 mb-4">
              AI is analyzing your issue and creating a customized troubleshooting plan...
            </p>
            <Progress value={generationProgress} className="mb-2" />
            <p className="text-sm text-gray-500">{generationProgress}% complete</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Checklist Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                {checklist.title}
              </CardTitle>
              <p className="text-gray-600 mt-1">{checklist.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportChecklist}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={generateChecklist}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Regenerate
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="outline">{checklist.category}</Badge>
            <Badge variant="outline">{checklist.difficulty}</Badge>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              ~{checklist.estimatedTotalTime} min
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">
                {completedItems.length} of {checklist.items.length} completed
              </span>
            </div>
            <Progress value={getCompletionPercentage()} />
          </div>
        </CardHeader>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-3">
        {checklist.items.map((item, index) => {
          const isCompleted = completedItems.includes(item.id);
          const result = itemResults[item.id];
          
          return (
            <Card key={item.id} className={`transition-all ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleItemCompletion(item.id)}
                    className="mt-1 transition-colors"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          Step {index + 1}: {item.step}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Badge 
                          variant="outline" 
                          className={getPriorityColor(item.priority)}
                        >
                          {item.priority}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.estimatedTime}m
                        </span>
                      </div>
                    </div>
                    
                    {isCompleted && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Step completed</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs font-medium text-gray-700">Result:</label>
                            <div className="flex gap-2 mt-1">
                              {['success', 'partial', 'failed'].map((resultType) => (
                                <button
                                  key={resultType}
                                  onClick={() => toggleItemCompletion(item.id, resultType as any, result?.notes)}
                                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                    result?.result === resultType
                                      ? resultType === 'success' ? 'bg-green-100 text-green-800'
                                        : resultType === 'partial' ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  {resultType}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-xs font-medium text-gray-700">Notes:</label>
                            <Textarea
                              placeholder="Add notes about this step..."
                              value={result?.notes || ''}
                              onChange={(e) => toggleItemCompletion(item.id, result?.result, e.target.value)}
                              className="mt-1 text-sm"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Summary */}
      {getCompletionPercentage() === 100 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">
                  Diagnostic Checklist Complete!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  You've completed all troubleshooting steps. If your issue persists, consider getting additional support.
                </p>
              </div>
            </div>
            
            {onComplete && (
              <Button 
                onClick={() => onComplete(checklist, { completedItems, results: itemResults })}
                className="mt-3"
                size="sm"
              >
                Get Additional Support
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}