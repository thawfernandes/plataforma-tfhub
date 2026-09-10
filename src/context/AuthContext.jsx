import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const DEFAULT_ADMIN = {
  id: 'user_admin',
  name: 'Administrador TF Hub',
  email: 'admin@tfhub.com.br',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop'
};

const DEFAULT_CLIENT = {
  id: 'user_client',
  name: 'Thiago Alencar',
  email: 'thiago@cliente.com.br',
  role: 'client',
  avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tf_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem('tf_users');
      return saved ? JSON.parse(saved) : [DEFAULT_ADMIN, DEFAULT_CLIENT];
    } catch {
      return [DEFAULT_ADMIN, DEFAULT_CLIENT];
    }
  });

  useEffect(() => {
    localStorage.setItem('tf_users', JSON.stringify(usersList));
  }, [usersList]);

  // Quick role login
  const login = (role) => {
    let targetUser = role === 'admin' ? DEFAULT_ADMIN : DEFAULT_CLIENT;
    setUser(targetUser);
    localStorage.setItem('tf_auth_user', JSON.stringify(targetUser));
    return { success: true, user: targetUser };
  };

  // Login with email & password
  const loginWithCredentials = (email, password) => {
    if (!email) {
      return { success: false, message: 'Digite seu e-mail.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if it matches admin credentials
    if (cleanEmail === 'admin@tfhub.com.br' || cleanEmail === 'admin') {
      setUser(DEFAULT_ADMIN);
      localStorage.setItem('tf_auth_user', JSON.stringify(DEFAULT_ADMIN));
      return { success: true, user: DEFAULT_ADMIN };
    }

    // Check registered users
    const found = usersList.find(u => u.email?.toLowerCase() === cleanEmail);
    if (found) {
      setUser(found);
      localStorage.setItem('tf_auth_user', JSON.stringify(found));
      return { success: true, user: found };
    }

    // Fallback: If not found, create client session automatically for smooth UX
    const newClient = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: cleanEmail,
      role: 'client',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`
    };

    const updated = [...usersList, newClient];
    setUsersList(updated);
    setUser(newClient);
    localStorage.setItem('tf_auth_user', JSON.stringify(newClient));
    return { success: true, user: newClient };
  };

  // Register new client user
  const registerClient = ({ name, email, phone, password }) => {
    if (!name || !email) {
      return { success: false, message: 'Nome e e-mail são obrigatórios.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already registered
    const existing = usersList.find(u => u.email?.toLowerCase() === cleanEmail);
    if (existing) {
      setUser(existing);
      localStorage.setItem('tf_auth_user', JSON.stringify(existing));
      return { success: true, user: existing, message: 'Conta já existente, efetuamos o login!' };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim() || '',
      role: 'client',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      createdAt: new Date().toISOString()
    };

    const updated = [...usersList, newUser];
    setUsersList(updated);
    setUser(newUser);
    localStorage.setItem('tf_auth_user', JSON.stringify(newUser));

    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tf_auth_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithCredentials, 
      registerClient, 
      logout, 
      isAuthenticated: !!user, 
      isAdmin: user?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
