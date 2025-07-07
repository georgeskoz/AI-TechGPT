import { useLocation } from 'wouter';
import { Settings, User, List, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TechGPTHeaderProps {
  username: string;
}

export default function TechGPTHeader({ username }: TechGPTHeaderProps) {
  const [, navigate] = useLocation();

  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
  };
  
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 focus:outline-none hover:opacity-80"
            title="Go to Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <h1 className="text-xl font-bold text-gray-800">TechGPT</h1>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium text-gray-600 mr-2">
            <span>{username}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-gray-100"
              >
                <Settings className="h-6 w-6 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/issues')} className="cursor-pointer">
                <List className="h-4 w-4 mr-2" />
                <span>Issue Tracker</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                <span>Edit Profile</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
