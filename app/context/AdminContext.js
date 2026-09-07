'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/session', {
        method: 'GET',
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(Boolean(data.authenticated));
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Clean up legacy sessionStorage key if present
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_auth');
    }
    checkSession();
  }, [checkSession]);

  const login = async (password) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const result = await response.json().catch(() => ({}));
      if (response.ok && result.success) {
        setIsAuthenticated(true);
        return { success: true, message: result.message || 'Login successful' };
      }

      return {
        success: false,
        message: result.message || (response.status === 429 ? 'Too many attempts. Try again later.' : 'Invalid password'),
      };
    } catch {
      return { success: false, message: 'Unable to reach admin login service' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout request error:', err);
    } finally {
      setIsAuthenticated(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
        checkSession,
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

