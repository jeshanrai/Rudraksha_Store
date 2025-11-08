// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Helper to verify and decode token
  const verifyAndLoadToken = (tokenKey, userKey) => {
    const storedToken = localStorage.getItem(tokenKey);
    const storedUser = localStorage.getItem(userKey);

    if (!storedToken || !storedUser) return false;

    try {
      const decoded = jwtDecode(storedToken);
      if (!decoded.exp) throw new Error('Invalid token structure');
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
        return false;
      }

      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      return true;
    } catch (err) {
      console.error('Token decode error:', err);
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
      return false;
    }
  };

  // ✅ On mount: check both admin and user tokens
  useEffect(() => {
    const adminValid = verifyAndLoadToken('adminToken', 'adminUser');
    const userValid = verifyAndLoadToken('userToken', 'user');
    if (!adminValid && !userValid) {
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  }, []);

  // ✅ Login (common for admin & user)
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      const { token, user } = data;
      if (!token || !user) throw new Error('Invalid server response');

      // Save based on role
      if (user.role === 'admin') {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
      } else {
        localStorage.setItem('userToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
      }

      setUser(user);
      setToken(token);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Registration (optional)
  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      const { token, user } = data;
      if (user.role === 'admin') {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
      } else {
        localStorage.setItem('userToken', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      setUser(user);
      setToken(token);
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Logout clears both admin and user data
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  // ✅ Update user details
  const updateUser = (updatedUser) => {
    if (user?.role === 'admin') {
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));
    } else {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    setUser(updatedUser);
  };

  // ✅ Utility methods
  const isAdmin = () => user?.role === 'admin';
  const isAuthenticated = () => !!token && !!user;

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
