import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  userType: 'customer' | 'service_provider' | 'admin';
  role?: string;
  permissions?: string[];
  verified: boolean;
  profileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  switchRole: (newRole: 'customer' | 'service_provider' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function UnifiedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app start
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await apiRequest('GET', '/api/auth/me');
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const response = await apiRequest('POST', '/api/auth/login', credentials);
    const { user: userData, token } = await response.json();
    
    localStorage.setItem('auth_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const register = async (userData: any) => {
    const response = await apiRequest('POST', '/api/auth/register', userData);
    const { user: newUser, token } = await response.json();
    
    localStorage.setItem('auth_token', token);
    setUser(newUser);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No authenticated user');
    
    const response = await apiRequest('PATCH', `/api/users/${user.id}`, updates);
    const updatedUser = await response.json();
    setUser(updatedUser);
  };

  const switchRole = async (newRole: 'customer' | 'service_provider' | 'admin') => {
    if (!user) throw new Error('No authenticated user');
    
    const response = await apiRequest('POST', '/api/auth/switch-role', { role: newRole });
    const updatedUser = await response.json();
    setUser(updatedUser);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
    switchRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUnifiedAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within UnifiedAuthProvider');
  }
  return context;
}