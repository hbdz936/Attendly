import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await authAPI.getMe();
          setUser(data.user);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (email, password) => {
    try {
      setError(null);
      const data = await authAPI.signup(email, password);
      const { token, user } = data;
      
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      const message = err.message || 'Signup failed';
      setError(message);
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authAPI.login(email, password);
      const { token, user } = data;
      
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;