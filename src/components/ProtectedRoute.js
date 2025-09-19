// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');

  // Check if token exists
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode token to get user info
    const decodedToken = jwtDecode(token);
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }

    // Check admin requirement
    if (requireAdmin && decodedToken.role !== 'admin') {
      return <Navigate to="/profile" replace />;
    }

    // Token is valid, render the protected component
    return children;
  } catch (error) {
    console.error('Token decode error:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;