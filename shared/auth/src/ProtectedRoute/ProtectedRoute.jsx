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
    const hostname = window.location.hostname;
    const isSubdomain = hostname.split('.').length > 2 && hostname !== 'localhost';

    if (isSubdomain) {
      // For a subdomain like 'budget.wade.com', redirect to 'wade.com/login'
      const mainDomain = hostname.split('.').slice(-2).join('.');
      const loginUrl = `//${mainDomain}/login`;
      window.location.replace(loginUrl); // Perform a full redirect
      return null; // Render nothing while redirecting
    }

    return <Navigate to="/login" state={{ from: location }} replace />; // Standard local redirect
  }


  // Keep the role check (optional)
  if (allowedRoles.length > 0) {
    const userRoleName = user?.role?.name; // Note: You used 'name' here previously
    const userRoleId = user?.role; // Your login page uses the ID directly
    
    // Choose the value that matches how you define allowedRoles in App.js (UUIDs)
    if (!allowedRoles.includes(userRoleId)) { 
      const hostname = window.location.hostname;
      const isSubdomain = hostname.split('.').length > 2 && hostname !== 'localhost';

      if (isSubdomain) {
        const mainDomain = hostname.split('.').slice(-2).join('.');
        const unauthorizedUrl = `//${mainDomain}/unauthorized`;
        window.location.replace(unauthorizedUrl);
        return null;
      }
      return <Navigate to="/unauthorized" replace />; // Standard local redirect
    }
  }

  return children;
};