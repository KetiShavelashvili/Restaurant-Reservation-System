import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// ProtectedRoute gets any route that needs authentication and checks  user roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Get current user and loading from AuthContext
  const { user, loading } = useAuth();

  // While authentication state is still loading, show a temporary loader
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If there is no logged-in user, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If route requires certain roles and the current user's role is not inside allowedRoles, send home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected page
  return children;
};

export default ProtectedRoute;