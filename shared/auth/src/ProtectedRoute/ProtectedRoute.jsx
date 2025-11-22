import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@wade/auth'; // Assuming auth package is aliased as @wade/auth

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Optional: show a loading spinner while auth state is being determined
    return <div>Loading...</div>; // Or a loading component
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page, preserving the intended destination.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isPending = user?.status === 'pending';
  const isPendingPage = location.pathname === '/pending';

  // If a user's status is 'pending', they should be redirected to the '/pending' page,
  // unless they are already there.
  if (isPending && !isPendingPage) {
    return <Navigate to="/pending" replace />;
  }

  // If a user's status is not 'pending' but they are trying to access the '/pending' page,
  // redirect them to the homepage.
  if (!isPending && isPendingPage) {
    return <Navigate to="/" replace />;
  }

  // If the route has role restrictions, check if the user has one of the allowed roles.
  // This check is skipped for the pending page if the user is pending.
  if (!isPending && allowedRoles.length > 0) {
    const userRole = user?.role?.name;
    if (!allowedRoles.includes(userRole)) {
      // User does not have the required role, redirect to an unauthorized page.
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If all checks pass, render the requested component.
  return children;
};