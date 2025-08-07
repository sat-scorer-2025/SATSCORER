import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchUserProfile = async (token) => {
    if (!token) {
      setAuthError('No authentication token found');
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAuthError(null);
        return data.user;
      } else {
        setAuthError(data.message || 'Failed to fetch user profile');
        return null;
      }
    } catch (error) {
      setAuthError(error.message || 'Network error fetching user profile');
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (!decoded.userId || !/^[0-9a-fA-F]{24}$/.test(decoded.userId)) {
          setAuthError('Invalid authentication token');
          setUser(null);
          setLoading(false);
          return;
        }
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setAuthError('Session expired, please log in again');
          setUser(null);
          setLoading(false);
          return;
        }
        const profile = await fetchUserProfile(token);
        if (profile) {
          setUser({
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            name: profile.name,
            profilePhoto: profile.profilePhoto,
          });
          setAuthError(null);
        } else {
          setAuthError('Failed to fetch user profile, please try again');
          setUser(null);
        }
      } catch (error) {
        setAuthError('Invalid or corrupted token, please log in again');
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        const decoded = jwtDecode(data.token);
        if (!decoded.userId || !/^[0-9a-fA-F]{24}$/.test(decoded.userId)) {
          localStorage.removeItem('token');
          setAuthError('Invalid token received');
          return { success: false, error: 'Invalid token: No userId' };
        }
        const profile = await fetchUserProfile(data.token);
        if (profile) {
          setUser({
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            name: profile.name,
            profilePhoto: profile.profilePhoto,
          });
          setAuthError(null);
          return { success: true };
        }
        setAuthError('Failed to fetch user profile');
        return { success: false, error: 'Failed to fetch user profile' };
      }
      setAuthError(data.message || 'Login failed');
      return { success: false, error: data.message || 'Login failed' };
    } catch (error) {
      setAuthError('Network error during login');
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (formData, photoFile) => {
    try {
      const data = new FormData();
      data.append('name', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      data.append('address', formData.city);
      data.append('dob', formData.dob);
      data.append('exam', formData.course);
      data.append('school', formData.school);
      if (photoFile) data.append('profilePhoto', photoFile);

      const response = await fetch(`${API_URL}/api/user/register`, {
        method: 'POST',
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        const decoded = jwtDecode(result.token);
        if (!decoded.userId || !/^[0-9a-fA-F]{24}$/.test(decoded.userId)) {
          localStorage.removeItem('token');
          setAuthError('Invalid token received');
          return { success: false, error: 'Invalid token: No userId' };
        }
        const profile = await fetchUserProfile(result.token);
        if (profile) {
          setUser({
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            name: profile.name,
            profilePhoto: profile.profilePhoto,
          });
          setAuthError(null);
          return { success: true };
        }
        setAuthError('Failed to fetch user profile');
        return { success: false, error: 'Failed to fetch user profile' };
      }
      setAuthError(result.message || 'Registration failed');
      return { success: false, error: result.message || 'Registration failed' };
    } catch (error) {
      setAuthError('Network error during signup');
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthError(null);
  };

  const fetchProtected = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('No authentication token found, please log in');
      throw new Error('No authentication token found, please log in');
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        setUser(null);
        setAuthError('Session expired, please log in again');
        throw new Error('Session expired, please log in again');
      }
      const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(url, { ...options, headers });
      if (response.status === 401) {
        setAuthError('Unauthorized request, please log in again');
        throw new Error('Unauthorized request, please log in again');
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const refreshUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      setAuthError('No user or token found for refresh');
      return;
    }
    try {
      const profile = await fetchUserProfile(token);
      if (profile) {
        setUser((prev) => ({
          ...prev,
          name: profile.name,
          profilePhoto: profile.profilePhoto,
        }));
        setAuthError(null);
      }
    } catch (error) {
      setAuthError(error.message || 'Failed to refresh user data');
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    login,
    signup,
    logout,
    loading,
    fetchProtected,
    refreshUserData,
    authError,
  }), [user, loading, authError]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);