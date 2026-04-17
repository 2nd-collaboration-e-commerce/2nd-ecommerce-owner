import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, register as registerAPI, getMe } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginAPI({ email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    toast.success(`Welcome back, ${res.data.user.name}!`);
    return res.data;
  };

  const register = async (data) => {
    const res = await registerAPI(data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    toast.success(`Account created! Welcome, ${res.data.user.name}!`);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
