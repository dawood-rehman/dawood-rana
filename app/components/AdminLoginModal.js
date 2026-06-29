'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '@/app/context/AdminContext';
import toast from 'react-hot-toast';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(password);
      if (result.success) {
        toast.success('Login successful!');
        setPassword('');
        onLoginSuccess?.();
        onClose();
      } else {
        toast.error(result.message || 'Invalid password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-auto px-4 sm:px-0"
          >
            <div className="glass-panel rounded-lg p-6 sm:p-8">
              <h2 className="mb-2 text-xl font-black text-slate-950 dark:text-white sm:text-2xl">Admin Login</h2>
              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400 sm:text-base">Enter your admin password to access the dashboard.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300 sm:text-sm">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 sm:px-4 sm:py-2.5 sm:text-base"
                    disabled={loading}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || !password}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
                  className="btn-primary w-full px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2.5 sm:text-base"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </motion.button>
              </form>

              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
                className="btn-secondary mt-4 w-full px-3 py-2 text-sm sm:px-4 sm:py-2.5 sm:text-base"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
