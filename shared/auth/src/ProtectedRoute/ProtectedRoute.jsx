import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@wade/auth'; // Assuming auth package is aliased as @wade/auth

// In ProtectedRoute.jsx
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // --- REMOVE ALL THIS LOGIC ABOUT 'isPending' AND 'isPendingPage' ---
  /*
  const isPending = user?.status === 'pending';
  const isPendingPage = location.pathname === '/pending';

  if (isPending && !isPendingPage) {
    return <Navigate to="/pending" replace />;
  }

  if (!isPending && isPendingPage) {
    return <Navigate to="/" replace />;
  }
  */
  // ------------------------------------------------------------------

  // Keep the role check (optional)
  if (allowedRoles.length > 0) {
    const userRoleName = user?.role?.name; // Note: You used 'name' here previously
    const userRoleId = user?.role; // Your login page uses the ID directly
    
    // Choose the value that matches how you define allowedRoles in App.js (UUIDs)
    if (!allowedRoles.includes(userRoleId)) { 
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};