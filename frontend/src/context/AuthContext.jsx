import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const loginUser = (tok, user) => {
    setToken(tok);
    setUsername(user);
    localStorage.setItem('token', tok);
    localStorage.setItem('username', user);
  };

  const loginAdmin = (tok) => {
    setAdminToken(tok);
    localStorage.setItem('adminToken', tok);
  };

  const logoutUser = () => {
    setToken('');
    setUsername('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  const logoutAdmin = () => {
    setAdminToken('');
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider value={{ token, adminToken, username, loginUser, loginAdmin, logoutUser, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);