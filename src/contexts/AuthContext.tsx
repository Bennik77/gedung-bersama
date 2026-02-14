import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, UserRole, LoginCredentials, RegisterData } from '@/types';
import { fetchApi } from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials, role: UserRole) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (password: string, token: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'pinjamgedungku_auth';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved session
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      try {
        const parsedUser = JSON.parse(savedAuth);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials, role: UserRole): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);

    const endpoint = role === 'admin' ? 'auth/login_admin.php' : 'auth/login.php';
    const result = await fetchApi<AuthUser>(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (result.success) {
      setUser(result.data);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(result.data));
      setIsLoading(false);
      return { success: true, message: result.message };
    }

    setIsLoading(false);
    return { success: false, message: result.message };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);

    const result = await fetchApi('auth/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    setIsLoading(false);
    return { success: result.success, message: result.message };
  };

  const verifyOtp = async (email: string, otp: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);

    const result = await fetchApi('auth/verify_otp.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });

    setIsLoading(false);
    return { success: result.success, message: result.message };
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const result = await fetchApi('auth/forgot_password.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setIsLoading(false);
    return { success: result.success, message: result.message };
  };

  const resetPassword = async (password: string, token: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const result = await fetchApi('auth/reset_password.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, token })
    });
    setIsLoading(false);
    return { success: result.success, message: result.message };
  };

  const logout = () => {
    fetchApi('auth/logout.php'); // Optional: notify backend
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!user) return false;

    // Optimistic update
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        verifyOtp,
        forgotPassword,
        resetPassword,
        logout,
        updateProfile, // Exported
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
