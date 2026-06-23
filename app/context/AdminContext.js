'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already authenticated (session)
    const authToken = sessionStorage.getItem('admin_auth');
    if (authToken) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (password) => {
    const credentials = getFromStorage(STORAGE_KEYS.ADMIN_CREDENTIALS, { password: 'Rd535328@' });
    if (password === credentials.password) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: 'Invalid password' };
  };

  const logout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  const updatePassword = (currentPassword, newPassword) => {
    const credentials = getFromStorage(STORAGE_KEYS.ADMIN_CREDENTIALS, { password: 'Rd535328@' });
    if (currentPassword === credentials.password) {
      saveToStorage(STORAGE_KEYS.ADMIN_CREDENTIALS, { password: newPassword });
      return { success: true, message: 'Password updated successfully' };
    }
    return { success: false, message: 'Current password is incorrect' };
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
        updatePassword,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
