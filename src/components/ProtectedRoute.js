// src/components/ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { token, user, logout, loading } = useAuth();
  const location = useLocation();

  // Validate token only as a side effect to prevent render loop
  useEffect(() => {
    if (loading || !token || !user) return;

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded?.exp * 1000 < Date.now();
      if (isExpired) logout();
    } catch (err) {
      logout();
    }
  }, [token, user, loading, logout]);

  // Wait until auth loading finishes
  if (loading) return null;

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin-only route
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
