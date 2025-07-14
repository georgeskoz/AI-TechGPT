import { useLocation } from 'wouter';
import { Settings, User, LogOut, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

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

  const handleLogout = () => {
    // Clear username from localStorage
    localStorage.removeItem('techgpt_username');
    // Clear any other user-specific data
    localStorage.removeItem('serviceAnnouncementShown');
    localStorage.removeItem('activeServiceBooking');
    // Navigate to home page
    navigate('/');
    // Reload the page to reset the app state
    window.location.reload();
  };

  const handleUploadPicture = () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataUrl = e.target?.result as string;
          // Store the image in localStorage
          localStorage.setItem(`techgpt_profile_picture_${username}`, imageDataUrl);
          // You could also update the UI or make an API call here
          console.log('Profile picture uploaded successfully');
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const handleTakeLivePhoto = () => {
    // Check if camera is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera not supported in this browser');
      return;
    }

    // Request camera access
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        // Create a video element to show camera preview
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.style.width = '100%';
        video.style.maxWidth = '400px';
        video.style.height = 'auto';

        // Create a canvas to capture the photo
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Create a modal-like overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '9999';

        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.marginTop = '20px';
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '10px';

        // Create capture button
        const captureButton = document.createElement('button');
        captureButton.textContent = 'Take Photo';
        captureButton.style.padding = '10px 20px';
        captureButton.style.backgroundColor = '#3b82f6';
        captureButton.style.color = 'white';
        captureButton.style.border = 'none';
        captureButton.style.borderRadius = '5px';
        captureButton.style.cursor = 'pointer';

        // Create cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '10px 20px';
        cancelButton.style.backgroundColor = '#6b7280';
        cancelButton.style.color = 'white';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '5px';
        cancelButton.style.cursor = 'pointer';

        // Add event listeners
        captureButton.addEventListener('click', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx?.drawImage(video, 0, 0);
          
          // Convert to data URL
          const imageDataUrl = canvas.toDataURL('image/jpeg');
          
          // Store the image in localStorage
          localStorage.setItem(`techgpt_profile_picture_${username}`, imageDataUrl);
          
          console.log('Live photo captured successfully');
          
          // Stop camera stream
          stream.getTracks().forEach(track => track.stop());
          
          // Remove overlay
          document.body.removeChild(overlay);
        });

        cancelButton.addEventListener('click', () => {
          // Stop camera stream
          stream.getTracks().forEach(track => track.stop());
          
          // Remove overlay
          document.body.removeChild(overlay);
        });

        // Assemble the UI
        buttonsContainer.appendChild(captureButton);
        buttonsContainer.appendChild(cancelButton);
        overlay.appendChild(video);
        overlay.appendChild(buttonsContainer);
        document.body.appendChild(overlay);
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please check permissions.');
      });
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleUploadPicture} className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                <span>Upload Picture</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTakeLivePhoto} className="cursor-pointer">
                <Camera className="h-4 w-4 mr-2" />
                <span>Take Live Photo</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
