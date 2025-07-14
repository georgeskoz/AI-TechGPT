import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';

// Unified user management hook that handles both localStorage and API state
export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Try to get user from localStorage first
  useEffect(() => {
    const getStoredUser = () => {
      try {
        // Check multiple possible localStorage keys
        const legacyUser = localStorage.getItem('tech_user');
        const username = localStorage.getItem('username');
        const userEmail = localStorage.getItem('userEmail');
        
        if (legacyUser) {
          const userData = JSON.parse(legacyUser);
          setCurrentUser(userData);
          return userData;
        }
        
        if (username) {
          // If we have username, try to fetch full user data
          return { username, email: userEmail };
        }
        
        return null;
      } catch (error) {
        console.error('Error reading user from localStorage:', error);
        return null;
      }
    };

    const storedUser = getStoredUser();
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // Query to get full user data from API if we have identifier
  const { data: apiUser, isLoading: isApiLoading } = useQuery({
    queryKey: ['/api/users', currentUser?.username || currentUser?.email],
    queryFn: async () => {
      if (!currentUser?.username && !currentUser?.email) return null;
      
      const identifier = currentUser.username || currentUser.email;
      const response = await fetch(`/api/users/${encodeURIComponent(identifier)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // User doesn't exist yet
        }
        throw new Error('Failed to fetch user data');
      }
      
      return response.json();
    },
    enabled: !!(currentUser?.username || currentUser?.email),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update current user when API data is fetched
  useEffect(() => {
    if (apiUser) {
      setCurrentUser(apiUser);
      // Update localStorage with complete user data
      localStorage.setItem('tech_user', JSON.stringify(apiUser));
    }
  }, [apiUser]);

  // Function to update user data
  const updateUser = (userData: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem('tech_user', JSON.stringify(updatedUser));
    }
  };

  // Function to set user (for login/registration)
  const setUser = (userData: User) => {
    setCurrentUser(userData);
    localStorage.setItem('tech_user', JSON.stringify(userData));
    localStorage.setItem('username', userData.username || '');
    localStorage.setItem('userEmail', userData.email || '');
  };

  // Function to clear user (for logout)
  const clearUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('tech_user');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('auth_token');
  };

  return {
    user: currentUser,
    isLoading: isLoading || isApiLoading,
    updateUser,
    setUser,
    clearUser,
    hasUser: !!currentUser,
    userId: currentUser?.id
  };
}

// Helper function to get current user ID for API calls
export function getCurrentUserId(): number | null {
  try {
    const storedUser = localStorage.getItem('tech_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      return userData.id || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
}

// Helper function to get current username
export function getCurrentUsername(): string | null {
  try {
    const storedUser = localStorage.getItem('tech_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      return userData.username || null;
    }
    return localStorage.getItem('username');
  } catch (error) {
    console.error('Error getting current username:', error);
    return localStorage.getItem('username');
  }
}