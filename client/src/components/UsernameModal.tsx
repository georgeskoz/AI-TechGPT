import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface UsernameModalProps {
  isOpen: boolean;
  onSave: (username: string) => void;
}

export default function UsernameModal({ isOpen, onSave }: UsernameModalProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSave(username.trim());
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-blue-500" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Welcome to TechGPT</DialogTitle>
            <DialogDescription className="text-gray-600">Your personal AI assistant for technical support</DialogDescription>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="username-input" className="block text-sm font-medium text-gray-700 mb-1">
              How should we call you?
            </Label>
            <Input
              id="username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2"
              placeholder="Enter your name"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              This will be used to personalize your experience
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
            disabled={!username.trim()}
          >
            Start Chatting
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
