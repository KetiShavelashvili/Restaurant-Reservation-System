import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to access AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Safety check: ensures hook is used inside AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Context provider component that wraps the entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // Stores logged-in user data
  const [loading, setLoading] = useState(true);  // Indicates if checking login state

  useEffect(() => {
    // On first load, check localStorage for an existing user session. This prevents losing login state on refresh.
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); // Mark finish of loading auth state
  }, []);

  // Saves user login information both in React state and localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Clears the user session completely (state + localStorage)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Values exposed to the rest of the app: user info, login/logout functions, boolean helpers (isAdmin, isStaff, etc.)
  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,            // True if user is logged in
    isAdmin: user?.role === 'admin',    // True if user role matches
    isStaff: user?.role === 'staff',
    isCustomer: user?.role === 'customer',
  };

  // Provide the authentication state to children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
