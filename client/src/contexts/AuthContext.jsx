import React, { createContext, useContext, useState } from 'react';
import { login as loginApi, signup as signupApi } from '../api/auth';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  };

  const signup = async (userData) => {
  const res = await axios.post(
    'http://localhost:4000/api/auth/register',
    userData,
    { withCredentials: true } 
  );
  return res.data;
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Axios instance with auth token
  const authAxios = axios.create();
  if (user?.token) {
    authAxios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
