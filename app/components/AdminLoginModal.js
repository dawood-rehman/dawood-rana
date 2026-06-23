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

    // Simulate async operation
    setTimeout(() => {
      const result = login(password);
      if (result.success) {
        toast.success('Login successful!');
        setPassword('');
        onLoginSuccess?.();
        onClose();
      } else {
        toast.error('Invalid password');
      }
      setLoading(false);
    }, 500);
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
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-auto px-4 sm:px-0"
          >
            <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-700">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Admin Login</h2>
              <p className="text-sm sm:text-base text-slate-400 mb-6">Enter your admin password to access the dashboard.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <motion.input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm sm:text-base"
                    disabled={loading}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || !password}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg hover:shadow-xl"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </motion.button>
              </form>

              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
                className="mt-4 w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all text-sm sm:text-base font-medium"
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
