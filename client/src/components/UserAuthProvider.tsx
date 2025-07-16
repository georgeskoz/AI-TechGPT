import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
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
    // Check for existing user session
    const savedUser = localStorage.getItem('tech_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('tech_user');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('tech_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // Clear all authentication-related localStorage keys
    localStorage.removeItem('tech_user');
    localStorage.removeItem('techgpt_username');
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