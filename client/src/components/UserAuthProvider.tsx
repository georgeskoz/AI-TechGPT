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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing user session from multiple localStorage keys
    const savedUser = localStorage.getItem('tech_user') || localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('tech_user');
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('tech_user', JSON.stringify(userData));
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // Clear all authentication-related localStorage keys
    localStorage.removeItem('tech_user');
    localStorage.removeItem('currentUser');
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
      isAuthenticated: !!user
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