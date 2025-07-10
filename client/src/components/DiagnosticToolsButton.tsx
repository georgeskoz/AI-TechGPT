import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Wrench, ChevronRight, CheckCircle } from 'lucide-react';

interface DiagnosticTool {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  isActive: boolean;
  steps: {
    id: string;
    title: string;
    description: string;
    order: number;
  }[];
}

export default function DiagnosticToolsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<DiagnosticTool | null>(null);

  const { data: tools = [], isLoading } = useQuery({
    queryKey: ['/api/admin/diagnostic-tools'],
    enabled: isOpen,
  });

  const categories = Array.from(new Set(tools.map((tool: DiagnosticTool) => tool.category)));

  const handleToolSelect = (tool: DiagnosticTool) => {
    setSelectedTool(tool);
  };

  const handleBack = () => {
    setSelectedTool(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          Quick Fixes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm max-h-[50vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            {selectedTool ? selectedTool.title : 'Quick Diagnostic Tools'}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : selectedTool ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                ← Back to Tools
              </Button>
              <Badge variant="outline" className="capitalize">
                {selectedTool.category}
              </Badge>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">{selectedTool.description}</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Steps to Follow:</h3>
              {selectedTool.steps
                .sort((a, b) => a.order - b.order)
                .map((step, index) => (
                  <div key={step.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600 text-sm">
              Quick fixes for common issues:
            </p>
            
            <div className="space-y-2">
              {tools
                .filter((tool: DiagnosticTool) => tool.isActive)
                .map((tool: DiagnosticTool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool)}
                    className="flex items-center gap-2 p-2 w-full text-left hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900">{tool.title}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}