import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const MOCK_USERS = {
  admin: {
    id: 'user_admin',
    name: 'Administrador TF Hub',
    email: 'admin@tfhub.com.br',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop'
  },
  client: {
    id: 'user_client',
    name: 'Thiago Alencar',
    email: 'thiago@cliente.com.br',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tf_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (role) => {
    const targetUser = MOCK_USERS[role];
    if (targetUser) {
      setUser(targetUser);
      localStorage.setItem('tf_auth_user', JSON.stringify(targetUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tf_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};
