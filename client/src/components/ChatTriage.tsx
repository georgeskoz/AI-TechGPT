import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  MessageSquare, 
  Phone, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Brain,
  Zap
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface TriageResult {
  category: string;
  complexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number;
  confidence: number;
  recommendedPath: 'ai_chat' | 'live_chat' | 'phone_support' | 'escalate';
  reasoning: string;
  suggestedActions: string[];
  requiredSkills: string[];
}

interface ChatTriageProps {
  username: string;
  onPathSelected: (path: string, data?: any) => void;
}

export default function ChatTriage({ username, onPathSelected }: ChatTriageProps) {
  const [userInput, setUserInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!userInput.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const response = await apiRequest("POST", "/api/support/triage", {
        issue: userInput,
        username,
      });
      
      const result = await response.json();
      setTriageResult(result);
      setAnalysisProgress(100);
      
    } catch (error) {
      console.error("Error analyzing issue:", error);
      // Fallback triage
      setTriageResult({
        category: "General Support",
        complexity: "intermediate",
        urgency: "medium",
        estimatedDuration: 30,
        confidence: 0.5,
        recommendedPath: "ai_chat",
        reasoning: "Unable to perform full analysis. Defaulting to AI chat for initial assistance.",
        suggestedActions: ["Start with AI chat", "Escalate if needed"],
        requiredSkills: ["General technical knowledge"]
      });
      setAnalysisProgress(100);
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  const getPathIcon = (path: string) => {
    switch (path) {
      case 'ai_chat': return <Bot className="h-4 w-4" />;
      case 'live_chat': return <MessageSquare className="h-4 w-4" />;
      case 'phone_support': return <Phone className="h-4 w-4" />;
      case 'escalate': return <AlertTriangle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getPathColor = (path: string) => {
    switch (path) {
      case 'ai_chat': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'live_chat': return 'bg-green-100 text-green-800 border-green-200';
      case 'phone_support': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'escalate': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPathLabel = (path: string) => {
    switch (path) {
      case 'ai_chat': return 'AI Chat Support';
      case 'live_chat': return 'Live Chat with Human';
      case 'phone_support': return 'Phone Support';
      case 'escalate': return 'Escalate to Specialist';
      default: return 'General Support';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI-Powered Chat Triage
          </CardTitle>
          <p className="text-sm text-gray-600">
            Describe your technical issue and I'll analyze it to recommend the best support path
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe your technical issue:</label>
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Example: My website is loading very slowly and users are complaining about timeouts. I suspect it might be a database issue but I'm not sure how to diagnose it..."
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={handleAnalyze}
            disabled={!userInput.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-pulse" />
                Analyzing Issue...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze & Recommend Support Path
              </>
            )}
          </Button>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>AI Analysis Progress</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {triageResult && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Triage Analysis Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Category</div>
                  <Badge variant="outline" className="mt-1">
                    {triageResult.category}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Complexity</div>
                  <Badge className={`mt-1 ${getComplexityColor(triageResult.complexity)}`}>
                    {triageResult.complexity}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Urgency</div>
                  <Badge className={`mt-1 ${getUrgencyColor(triageResult.urgency)}`}>
                    {triageResult.urgency}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Est. Duration</div>
                  <div className="flex items-center justify-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span className="text-sm font-medium">{triageResult.estimatedDuration}min</span>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Analysis:</strong> {triageResult.reasoning}
                </AlertDescription>
              </Alert>

              {triageResult.suggestedActions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Suggested Actions:</h4>
                  <ul className="text-sm space-y-1">
                    {triageResult.suggestedActions.map((action, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {triageResult.requiredSkills.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {triageResult.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">
                  Confidence: {Math.round(triageResult.confidence * 100)}%
                </div>
                <Progress value={triageResult.confidence * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Support Path</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg border ${getPathColor(triageResult.recommendedPath)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getPathIcon(triageResult.recommendedPath)}
                    <span className="font-medium">{getPathLabel(triageResult.recommendedPath)}</span>
                  </div>
                  <Button
                    onClick={() => onPathSelected(triageResult.recommendedPath, triageResult)}
                    size="sm"
                  >
                    Start Support
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                <div className="text-sm">
                  {triageResult.recommendedPath === 'ai_chat' && (
                    <div>
                      <p className="mb-2">Start with AI assistance for immediate help and troubleshooting.</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Instant response
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Free
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {triageResult.recommendedPath === 'live_chat' && (
                    <div>
                      <p className="mb-2">Connect with a human technician for personalized assistance.</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          First 10 min free
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Human expert
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {triageResult.recommendedPath === 'phone_support' && (
                    <div>
                      <p className="mb-2">Phone support recommended for complex troubleshooting.</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Voice guidance
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Real-time help
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {triageResult.recommendedPath === 'escalate' && (
                    <div>
                      <p className="mb-2">This issue requires specialist attention and escalation.</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Specialist required
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Expert consultation
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Not satisfied with the recommendation? Choose a different path:
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {['ai_chat', 'live_chat', 'phone_support'].map((path) => (
                    <Button
                      key={path}
                      variant="outline"
                      size="sm"
                      onClick={() => onPathSelected(path, triageResult)}
                      className="flex items-center gap-1"
                    >
                      {getPathIcon(path)}
                      {getPathLabel(path)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}