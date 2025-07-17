import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  userType: string;
  authMethod: string;
  avatar: string;
  bio: string;
  lastLoginMethod: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  accountActive: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  currentPortal: 'customer' | 'service_provider' | 'admin';
  setCurrentPortal: (portal: 'customer' | 'service_provider' | 'admin') => void;
  isUserAllowedInPortal: (portal: 'customer' | 'service_provider' | 'admin') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentPortal, setCurrentPortal] = useState<'customer' | 'service_provider' | 'admin'>('customer');

  useEffect(() => {
    // Check for existing user session from multiple localStorage keys
    try {
      const savedUser = localStorage.getItem('tech_user') || localStorage.getItem('currentUser');
      const savedPortal = localStorage.getItem('currentPortal');
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        // Validate user data structure
        if (userData && userData.id && userData.username && userData.userType) {
          setUser(userData);
          // Set portal based on user type if not explicitly set
          if (savedPortal && ['customer', 'service_provider', 'admin'].includes(savedPortal)) {
            setCurrentPortal(savedPortal as 'customer' | 'service_provider' | 'admin');
          } else {
            // Auto-set portal based on user type
            if (userData.userType === 'service_provider') {
              setCurrentPortal('service_provider');
            } else if (userData.userType === 'admin') {
              setCurrentPortal('admin');
            } else {
              setCurrentPortal('customer');
            }
          }
        } else {
          // Clear invalid data
          localStorage.removeItem('tech_user');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('currentPortal');
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('tech_user');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentPortal');
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('tech_user', JSON.stringify(userData));
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Set portal based on user type
    let portal: 'customer' | 'service_provider' | 'admin' = 'customer';
    if (userData.userType === 'service_provider') {
      portal = 'service_provider';
    } else if (userData.userType === 'admin') {
      portal = 'admin';
    }
    
    setCurrentPortal(portal);
    localStorage.setItem('currentPortal', portal);
  };

  const setCurrentPortalAndSave = (portal: 'customer' | 'service_provider' | 'admin') => {
    setCurrentPortal(portal);
    localStorage.setItem('currentPortal', portal);
  };

  const isUserAllowedInPortal = (portal: 'customer' | 'service_provider' | 'admin'): boolean => {
    if (!user) return false;
    
    switch (portal) {
      case 'customer':
        // Anyone can view customer portal, but only customers can perform actions
        return true;
      case 'service_provider':
        // Only service providers can access service provider portal
        return user.userType === 'service_provider';
      case 'admin':
        // Only admins can access admin portal
        return user.userType === 'admin';
      default:
        return false;
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentPortal('customer');
    // Clear all authentication-related localStorage keys
    localStorage.removeItem('tech_user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentPortal');
    localStorage.removeItem('techgpt_username');
    localStorage.removeItem('techgpt_user_id');
    localStorage.removeItem('techgpt_auth_method');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('serviceAnnouncementShown');
    localStorage.removeItem('activeServiceBooking');
    // Force page reload to reset application state
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      currentPortal,
      setCurrentPortal: setCurrentPortalAndSave,
      isUserAllowedInPortal
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}