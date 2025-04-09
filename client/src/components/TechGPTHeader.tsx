import { useLocation } from 'wouter';
import { Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logoSvg from '../assets/techgpt-logo-simple.svg';

interface TechGPTHeaderProps {
  username: string;
}

export default function TechGPTHeader({ username }: TechGPTHeaderProps) {
  const [, navigate] = useLocation();

  const handleProfileClick = () => {
    navigate(`/${username}/profile`);
  };
  
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={handleLogoClick} 
            className="flex items-center focus:outline-none transition-transform hover:scale-105"
            title="Go to Home"
          >
            <img src={logoSvg} alt="TechGPT Logo" className="h-10" />
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
