import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // Initialize token from localStorage
    const storedToken = localStorage.getItem('token');
    return storedToken;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const login = (newToken) => {
    // Remove Bearer prefix if present and store just the token
    const cleanToken = newToken.replace('Bearer ', '');
    setToken(cleanToken);
    localStorage.setItem('token', cleanToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear token from state and localStorage
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);

    // Clear any OAuth2 session data
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });

    // Force a hard reload to clear any cached OAuth2 state
    window.location.href = '/login';
  };

  // Check for token in URL parameters (for OAuth redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      login(tokenFromUrl);
    }
  }, []);

  const value = {
    token,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;