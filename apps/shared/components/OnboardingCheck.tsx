import { useEffect } from "react";
import { useLocation } from "wouter";

interface OnboardingCheckProps {
  children: React.ReactNode;
}

export default function OnboardingCheck({ children }: OnboardingCheckProps) {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const onboardingSkipped = localStorage.getItem('onboardingSkipped');
    const isOnOnboardingPage = location === '/onboarding';
    const isOnAdminPage = location.startsWith('/admin');
    const isOnTechnicianPage = location.startsWith('/technician');
    
    // Skip onboarding check for admin and technician pages
    if (isOnAdminPage || isOnTechnicianPage) {
      return;
    }
    
    // If onboarding is not completed or skipped and user is not on the onboarding page, redirect
    if (!onboardingCompleted && !onboardingSkipped && !isOnOnboardingPage) {
      setLocation('/onboarding');
    }
  }, [location, setLocation]);

  return <>{children}</>;
}