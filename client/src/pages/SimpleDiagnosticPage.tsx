import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import SimpleNavigation from "@/components/SimpleNavigation";
import { 
  Monitor, 
  Wifi, 
  HardDrive, 
  Smartphone, 
  Shield, 
  Settings, 
  Globe,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Phone,
  MessageSquare,
  User
} from "lucide-react";

interface DiagnosticStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  result?: 'success' | 'failed' | 'partial';
}

interface DiagnosticCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: DiagnosticStep[];
}

const diagnosticCategories: DiagnosticCategory[] = [
  {
    id: "computer_slow",
    title: "Computer Running Slow",
    icon: <Monitor className="h-6 w-6" />,
    description: "System performance and speed issues",
    steps: [
      { id: "1", title: "Check Available Storage", description: "Ensure you have at least 15% free disk space", completed: false },
      { id: "2", title: "Close Unnecessary Programs", description: "Check Task Manager and close programs you're not using", completed: false },
      { id: "3", title: "Restart Your Computer", description: "Perform a full restart to clear temporary files", completed: false },
      { id: "4", title: "Check for Windows Updates", description: "Install any pending system updates", completed: false },
      { id: "5", title: "Run Disk Cleanup", description: "Use built-in disk cleanup tool to remove temporary files", completed: false },
      { id: "6", title: "Check for Malware", description: "Run a full system scan with your antivirus software", completed: false }
    ]
  },
  {
    id: "wifi_issues",
    title: "Wi-Fi Connection Problems",
    icon: <Wifi className="h-6 w-6" />,
    description: "Internet connectivity and network issues",
    steps: [
      { id: "1", title: "Check Wi-Fi is Enabled", description: "Ensure Wi-Fi is turned on in your device settings", completed: false },
      { id: "2", title: "Restart Your Router", description: "Unplug router for 30 seconds, then plug back in", completed: false },
      { id: "3", title: "Forget and Reconnect", description: "Forget the Wi-Fi network and reconnect with password", completed: false },
      { id: "4", title: "Check Other Devices", description: "Test if other devices can connect to the same network", completed: false },
      { id: "5", title: "Update Network Drivers", description: "Update your computer's network adapter drivers", completed: false },
      { id: "6", title: "Reset Network Settings", description: "Reset your device's network settings if issue persists", completed: false }
    ]
  },
  {
    id: "hard_drive",
    title: "Hard Drive Issues",
    icon: <HardDrive className="h-6 w-6" />,
    description: "Storage device problems and errors",
    steps: [
      { id: "1", title: "Check Disk Health", description: "Run disk check utility to scan for errors", completed: false },
      { id: "2", title: "Listen for Unusual Sounds", description: "Check if hard drive is making clicking or grinding noises", completed: false },
      { id: "3", title: "Check Available Space", description: "Ensure you have adequate free space (at least 15%)", completed: false },
      { id: "4", title: "Run CHKDSK", description: "Use Windows disk check tool to fix file system errors", completed: false },
      { id: "5", title: "Check S.M.A.R.T. Status", description: "Use disk utility to check drive health indicators", completed: false },
      { id: "6", title: "Backup Important Data", description: "Create backup of critical files immediately", completed: false }
    ]
  },
  {
    id: "mobile_issues",
    title: "Mobile Device Problems",
    icon: <Smartphone className="h-6 w-6" />,
    description: "Smartphone and tablet troubleshooting",
    steps: [
      { id: "1", title: "Restart Your Device", description: "Power off completely and turn back on", completed: false },
      { id: "2", title: "Check Available Storage", description: "Ensure you have at least 1GB free space", completed: false },
      { id: "3", title: "Close Background Apps", description: "Force close apps running in the background", completed: false },
      { id: "4", title: "Check for App Updates", description: "Update all apps through the app store", completed: false },
      { id: "5", title: "Check System Updates", description: "Install any pending OS updates", completed: false },
      { id: "6", title: "Reset Network Settings", description: "Reset Wi-Fi and cellular network settings", completed: false }
    ]
  },
  {
    id: "security_issues",
    title: "Security Concerns",
    icon: <Shield className="h-6 w-6" />,
    description: "Virus, malware, and security problems",
    steps: [
      { id: "1", title: "Run Full Antivirus Scan", description: "Perform complete system scan with updated antivirus", completed: false },
      { id: "2", title: "Check for Suspicious Programs", description: "Review installed programs for unknown software", completed: false },
      { id: "3", title: "Update Security Software", description: "Ensure antivirus and firewall are up to date", completed: false },
      { id: "4", title: "Check Browser for Malware", description: "Scan browser for malicious extensions or changes", completed: false },
      { id: "5", title: "Change Important Passwords", description: "Update passwords for critical accounts", completed: false },
      { id: "6", title: "Enable Two-Factor Authentication", description: "Set up 2FA on important accounts", completed: false }
    ]
  },
  {
    id: "software_issues",
    title: "Software Not Working",
    icon: <Settings className="h-6 w-6" />,
    description: "Application crashes and software problems",
    steps: [
      { id: "1", title: "Restart the Application", description: "Close and reopen the problematic software", completed: false },
      { id: "2", title: "Check for Updates", description: "Update the software to the latest version", completed: false },
      { id: "3", title: "Restart Your Computer", description: "Perform a full system restart", completed: false },
      { id: "4", title: "Run as Administrator", description: "Try running the software with admin privileges", completed: false },
      { id: "5", title: "Check System Requirements", description: "Verify your system meets minimum requirements", completed: false },
      { id: "6", title: "Reinstall the Software", description: "Uninstall and reinstall the application", completed: false }
    ]
  }
];

export default function SimpleDiagnosticPage() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSteps, setCurrentSteps] = useState<DiagnosticStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const startDiagnostic = (categoryId: string) => {
    const category = diagnosticCategories.find(c => c.id === categoryId);
    if (category) {
      setSelectedCategory(categoryId);
      setCurrentSteps([...category.steps]);
      setCurrentStepIndex(0);
      setShowResults(false);
    }
  };

  const markStepComplete = (stepId: string, result: 'success' | 'failed' | 'partial') => {
    setCurrentSteps(prev => 
      prev.map(step => 
        step.id === stepId 
          ? { ...step, completed: true, result }
          : step
      )
    );
  };

  const nextStep = () => {
    if (currentStepIndex < currentSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const restartDiagnostic = () => {
    setSelectedCategory(null);
    setCurrentSteps([]);
    setCurrentStepIndex(0);
    setShowResults(false);
  };

  const getCompletedSteps = () => {
    return currentSteps.filter(step => step.completed).length;
  };

  const getSuccessfulSteps = () => {
    return currentSteps.filter(step => step.result === 'success').length;
  };

  const currentCategory = diagnosticCategories.find(c => c.id === selectedCategory);
  const currentStep = currentSteps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / currentSteps.length) * 100;

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SimpleNavigation title="Quick Diagnostics" />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Quick Diagnostic Tools</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow step-by-step guides to troubleshoot common technical issues. 
              Each diagnostic provides simple, actionable steps to resolve your problem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagnosticCategories.map((category) => (
              <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {category.icon}
                    </div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{category.steps.length} steps</Badge>
                    <Button 
                      onClick={() => startDiagnostic(category.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Start Diagnostic
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Need More Help?</h2>
              <p className="text-gray-600 mb-6">
                If these diagnostics don't solve your problem, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setLocation('/chat')}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat with AI Support
                </Button>
                <Button 
                  onClick={() => setLocation('/live-support')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Get Human Help
                </Button>
                <Button 
                  onClick={() => setLocation('/phone-support')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Phone Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const completedSteps = getCompletedSteps();
    const successfulSteps = getSuccessfulSteps();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <SimpleNavigation title="Diagnostic Results" />
        
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Diagnostic Complete: {currentCategory?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">Steps Completed</p>
                    <p className="text-sm text-green-700">{completedSteps} of {currentSteps.length} steps</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((completedSteps / currentSteps.length) * 100)}%
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Step Results</h3>
                  {currentSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{step.title}</p>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      {step.completed && (
                        <Badge 
                          variant={step.result === 'success' ? 'default' : 'secondary'}
                          className={step.result === 'success' ? 'bg-green-600' : ''}
                        >
                          {step.result === 'success' ? 'Resolved' : 
                           step.result === 'failed' ? 'Failed' : 'Partial'}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    onClick={restartDiagnostic}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Another Diagnostic
                  </Button>
                  
                  {successfulSteps < currentSteps.length && (
                    <>
                      <Button 
                        onClick={() => setLocation('/chat')}
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Get AI Help
                      </Button>
                      <Button 
                        onClick={() => setLocation('/live-support')}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Human Support
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SimpleNavigation title={`Diagnostic: ${currentCategory?.title}`} />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{currentCategory?.title}</h1>
            <Badge variant="secondary">
              Step {currentStepIndex + 1} of {currentSteps.length}
            </Badge>
          </div>
          <Progress value={progress} className="w-full h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                {currentStepIndex + 1}
              </div>
              {currentStep?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">{currentStep?.description}</p>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Did this step resolve your issue?
                </Label>
                <RadioGroup 
                  onValueChange={(value) => markStepComplete(currentStep.id, value as 'success' | 'failed' | 'partial')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="success" id="success" />
                    <Label htmlFor="success">✅ Yes, this fixed the problem</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="partial" id="partial" />
                    <Label htmlFor="partial">⚠️ Partially helped</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="failed" id="failed" />
                    <Label htmlFor="failed">❌ This didn't help</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost"
                  onClick={restartDiagnostic}
                  className="text-gray-500"
                >
                  Exit Diagnostic
                </Button>
                
                <Button 
                  onClick={nextStep}
                  disabled={!currentStep?.completed}
                  className="flex items-center gap-2"
                >
                  {currentStepIndex === currentSteps.length - 1 ? 'View Results' : 'Next Step'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}