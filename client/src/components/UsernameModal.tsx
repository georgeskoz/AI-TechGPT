import { useState } from 'react';
import { useLocation } from 'wouter';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, LogIn, UserPlus } from 'lucide-react';

interface UsernameModalProps {
  isOpen: boolean;
  onSave: (username: string) => void;
}

export default function UsernameModal({ isOpen, onSave }: UsernameModalProps) {
  const [username, setUsername] = useState('');
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSave(username.trim());
    }
  };

  const handleLogin = () => {
    setLocation('/login');
  };

  const handleSignup = () => {
    setLocation('/register');
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-blue-500" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Welcome to TechersGPT</DialogTitle>
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

        <div className="mt-6">
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-xs text-gray-500">or</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Button
              onClick={handleLogin}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
            
            <Button
              onClick={handleSignup}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </Button>
          </div>

          <p className="mt-3 text-xs text-center text-gray-500">
            Have an account? Login for personalized support and history tracking
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
