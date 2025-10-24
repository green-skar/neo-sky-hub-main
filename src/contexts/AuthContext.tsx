import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ApiResponse } from '@/types';
import { authService } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<ApiResponse<{ user: User; token: string }>>;
  register: (userData: { name: string; email: string; password: string }) => Promise<ApiResponse<{ user: User; token: string }>>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<ApiResponse<User>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize authentication on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('AuthContext: Initializing authentication...');
        console.log('AuthContext: VITE_DEMO =', import.meta.env.VITE_DEMO);
        console.log('AuthContext: Current token =', authService.getToken());
        console.log('AuthContext: Is authenticated =', authService.isAuthenticated());

        // Check for existing valid tokens and restore user session
        if (authService.isAuthenticated()) {
          console.log('AuthContext: Token exists, fetching current user...');
          const response = await authService.getCurrentUser();
          console.log('AuthContext: Get current user response =', response);
          
          if (response.success && response.data) {
            console.log('AuthContext: Setting user =', response.data);
            setUser(response.data);
          } else {
            console.log('AuthContext: Failed to get user, clearing token');
            authService.removeToken();
            localStorage.removeItem('demo_user_data');
            localStorage.removeItem('demo_token');
            localStorage.removeItem('auth_token');
          }
        } else {
          console.log('AuthContext: No valid token found - user must log in');
        }
      } catch (error) {
        console.error('AuthContext: Auth initialization error:', error);
        // Clear invalid token
        authService.removeToken();
        localStorage.removeItem('demo_user_data');
        localStorage.removeItem('demo_token');
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
        console.log('AuthContext: Auth initialization complete');
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        setUser(response.data.user);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: { name: string; email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await authService.register(userData);
      if (response.success && response.data) {
        setUser(response.data.user);
      }
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      // Clear localStorage to ensure clean logout
      localStorage.removeItem('demo_user_data');
      localStorage.removeItem('demo_token');
      localStorage.removeItem('auth_token');
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await authService.updateProfile(userData);
      if (response.success && response.data) {
        setUser(response.data);
      }
      return response;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
