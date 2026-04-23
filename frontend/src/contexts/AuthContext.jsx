import React, { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('bookstore_user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (payload) => {
    const { data } = await api.post('/login', payload);
    localStorage.setItem('bookstore_token', data.token);
    localStorage.setItem('bookstore_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post('/register', payload);
    localStorage.setItem('bookstore_token', data.token);
    localStorage.setItem('bookstore_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('bookstore_token');
      localStorage.removeItem('bookstore_user');
      setUser(null);
    }
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}