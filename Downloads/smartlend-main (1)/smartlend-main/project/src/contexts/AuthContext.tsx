import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting login with:', email);

      const response = await apiService.login(email, password);
      console.log('🔍 Login response:', response);

      // Backend returns user data directly in response.data (without wrapper)
      if (response.data && response.data.id && response.data.email) {
        console.log('✅ Login successful (direct user data):', response.data);
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        return true;
      }
      // Fallback: Handle case where backend returns { user: ... } wrapped
      else if (response.data && response.data.user) {
        console.log('✅ Login successful (wrapped):', response.data.user);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return true;
      } else {
        console.error('❌ Login failed:', response.error || 'Unknown error');
        console.error('❌ Response structure:', response);
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      console.log('🔐 Attempting registration with:', userData.email);

      // Prepare data for backend
      const registerData = {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: userData.password,
        department: userData.department,
        phone: userData.phoneNumber
      };

      const response = await apiService.register(registerData);
      console.log('🔍 Registration response:', response);

      // Backend returns { user: ... } directly in response.data
      if (response.data && response.data.user) {
        console.log('✅ Registration successful:', response.data.user);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return true;
      } else {
        console.error('❌ Registration failed:', response.error || 'Unknown error');
        console.error('❌ Response structure:', response);
        return false;
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    updateUser
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};