import { useState, useRef, useEffect } from 'react';
import { Send, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onToggleTopics: () => void;
}

export default function ChatInput({ onSendMessage, isLoading, onToggleTopics }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Update textarea height when message changes
  useEffect(() => {
    autoResizeTextarea();
  }, [message]);

  return (
    <div className="border-t border-gray-200 bg-white p-4 shadow-md">
      <div className="container mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-grow relative">
            <Textarea
              ref={textareaRef}
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500"
              placeholder="Ask me about any technical issue..."
              disabled={isLoading}
            />
            
            {/* Mobile topic suggestions toggle */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden absolute left-2 bottom-2 text-gray-400 hover:text-gray-600"
              onClick={onToggleTopics}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-3 flex-shrink-0 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            disabled={!message.trim() || isLoading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        
        <div className="mt-2 text-xs text-gray-500">
          <p>TechersGPT is optimized for technical problem-solving. For more complex issues, provide detailed information.</p>
        </div>
      </div>
    </div>
  );
}
