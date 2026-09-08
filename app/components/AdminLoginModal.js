'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '@/app/context/AdminContext';
import toast from 'react-hot-toast';
import { playModalSound } from '@/lib/soundManager';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const previousFocusRef = useRef(null);

  const handleClose = () => {
    playModalSound(false);
    onClose();
  };

  // Focus management & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    playModalSound(true);

    // Save active element to restore focus when closed
    previousFocusRef.current = document.activeElement;

    // Focus the password input automatically
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

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
            onClick={handleClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
            aria-describedby="admin-modal-desc"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-auto px-4 sm:px-0"
          >
            <div className="glass-panel rounded-lg p-6 sm:p-8">
              <h2 id="admin-modal-title" className="mb-2 text-xl font-black text-slate-950 dark:text-white sm:text-2xl">
                Admin Login
              </h2>
              <p id="admin-modal-desc" className="mb-6 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                Enter your admin password to access the dashboard.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-modal-password"
                    className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300 sm:text-sm"
                  >
                    Password
                  </label>
                  <input
                    ref={inputRef}
                    id="admin-modal-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 sm:px-4 sm:py-2.5 sm:text-base"
                    disabled={loading}
                    required
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
                type="button"
                onClick={handleClose}
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
