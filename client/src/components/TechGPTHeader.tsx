import { useLocation } from 'wouter';
import { Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/UserAuthProvider';
import techGPTLogoPath from "@assets/image_1752537953157.png";

interface TechGPTHeaderProps {
  username: string;
}

export default function TechGPTHeader({ username }: TechGPTHeaderProps) {
  const [, navigate] = useLocation();
  const { logout } = useAuth();

  const handleProfileClick = () => {
    navigate(`/${username}/profile`);
  };
  
  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleLogoClick}
            className="focus:outline-none hover:bg-white hover:opacity-80"
            title="Go to Home"
          >
            <img 
              src={techGPTLogoPath} 
              alt="TechGPT Logo" 
              className="h-16 w-32"
            />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/marketplace')}
            className="hidden md:inline-flex"
          >
            Find Technician
          </Button>
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
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
