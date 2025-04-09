import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TechGPTHeaderProps {
  username: string;
}

export default function TechGPTHeader({ username }: TechGPTHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          <h1 className="text-xl font-bold text-gray-800">TechGPT</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium text-gray-600">
            <span>{username}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-gray-100"
          >
            <Settings className="h-6 w-6 text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  );
}
