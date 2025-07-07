import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowLeft, CheckCircle, Target, Zap } from "lucide-react";
import ChatTriage from "@/components/ChatTriage";

export default function TriagePage() {
  const [, setLocation] = useLocation();
  const [username] = useState("user123"); // In real app, get from auth context

  const handlePathSelected = (path: string, data?: any) => {
    switch (path) {
      case 'ai_chat':
        setLocation('/chat');
        break;
      case 'live_chat':
        setLocation('/live-support');
        break;
      case 'phone_support':
        setLocation('/phone-support');
        break;
      case 'escalate':
        setLocation('/live-support');
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => setLocation('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold">AI-Powered Support Triage</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Smart Analysis</h3>
            </div>
            <p className="text-sm text-gray-600">
              AI analyzes your issue to recommend the most efficient support path
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Faster Resolution</h3>
            </div>
            <p className="text-sm text-gray-600">
              Get matched with the right support type to solve issues quickly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold">Cost Effective</h3>
            </div>
            <p className="text-sm text-gray-600">
              Avoid unnecessary escalation and get help at the right level
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Intelligent Support Triage
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              AI Powered
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Free Analysis
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ChatTriage username={username} onPathSelected={handlePathSelected} />
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Our AI triage system helps you find the most efficient path to resolve your technical issues.</p>
        <p>Powered by advanced GPT-4 analysis for accurate categorization and smart routing.</p>
      </div>
    </div>
  );
}