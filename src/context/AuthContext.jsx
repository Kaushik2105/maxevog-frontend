import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('maxevog_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('maxevog_token'));
  const [loading, setLoading] = useState(true);

  // Fetch verified user details on initial load
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.data?.success) {
            const userData = res.data.data.user || res.data.data;
            setUser(userData);
            localStorage.setItem('maxevog_user', JSON.stringify(userData));
          }
        } catch (err) {
          console.error('Session validation failed:', err);
          // Only clear if 401
          if (err.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data?.success) {
      const { token: receivedToken, user: receivedUser } = res.data.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('maxevog_token', receivedToken);
      localStorage.setItem('maxevog_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.data?.success) {
      const { token: receivedToken, user: receivedUser } = res.data.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('maxevog_token', receivedToken);
      localStorage.setItem('maxevog_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('maxevog_token');
    localStorage.removeItem('maxevog_user');
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.data?.success) {
        const userData = res.data.data.user || res.data.data;
        setUser(userData);
        localStorage.setItem('maxevog_user', JSON.stringify(userData));
        return userData;
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role?.toUpperCase() === 'ADMIN',
    isAgent: user?.role?.toUpperCase() === 'AGENT',
    isPro: user?.isProMember || false,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
