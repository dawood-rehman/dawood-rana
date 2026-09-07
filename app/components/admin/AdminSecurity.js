'use client';

import { useState } from 'react';
import {
  FaShieldAlt,
  FaKey,
  FaLock,
  FaCheckCircle,
  FaCheck,
  FaExclamationTriangle,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

function getPasswordStrength(password) {
  if (!password) return null;
  if (password.length < 6) {
    return { label: 'Too Short', color: 'text-red-500' };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: 'Weak', color: 'text-orange-500' };
  if (score === 2) return { label: 'Medium', color: 'text-amber-500' };
  return { label: 'Strong', color: 'text-emerald-500' };
}

export default function AdminSecurity() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast.success(data.message || 'Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch {
      toast.error('Network error. Unable to update password.');
    } finally {
      setLoading(false);
    }
  };

  const inputType = showPasswordText ? 'text' : 'password';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 dark:bg-blue-500/20">
          <FaShieldAlt className="text-2xl" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white sm:text-2xl">
            Security & Access Control
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Manage your administrator credentials and review active session protections.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Change Password Card (Span 2) */}
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
            <div className="flex items-center gap-3">
              <FaKey className="text-base text-indigo-500" />
              <h3 className="text-base font-black text-slate-950 dark:text-white sm:text-lg">
                Change Admin Password
              </h3>
            </div>

            <hr className="my-5 border-slate-200/80 dark:border-slate-800" />

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="current-password"
                  className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300 sm:text-sm"
                >
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="current-password"
                  type={inputType}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-950 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder-slate-500 sm:py-3"
                  required
                />
              </div>

              {/* Two Column: New Password & Confirm */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300 sm:text-sm"
                  >
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="new-password"
                    type={inputType}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-950 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder-slate-500 sm:py-3"
                    required
                  />
                  {strength && (
                    <div className={`mt-2 text-xs font-bold ${strength.color}`}>
                      Strength: {strength.label}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300 sm:text-sm"
                  >
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="confirm-password"
                    type={inputType}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-950 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder-slate-500 sm:py-3"
                    required
                  />
                </div>
              </div>

              {/* Checkbox and Submit Button */}
              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-center gap-2.5 select-none">
                  <input
                    type="checkbox"
                    checked={showPasswordText}
                    onChange={(e) => setShowPasswordText(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                    Show password text
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3"
                >
                  <FaLock className="text-xs" />
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Security Status & Production Tip */}
        <div className="space-y-6">
          {/* Card 1: Active Protections */}
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mb-4 flex items-center gap-2 text-emerald-500">
              <FaCheckCircle className="text-lg" />
            </div>

            <ul className="space-y-4 text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
              <li className="flex items-start gap-2.5">
                <FaCheck className="mt-1 shrink-0 text-xs text-emerald-500" />
                <span>
                  <strong className="text-slate-900 dark:text-white">HTTP-Only Cookie:</strong>{' '}
                  Session tokens are signed with HMAC-SHA256 and protected against XSS attacks.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <FaCheck className="mt-1 shrink-0 text-xs text-emerald-500" />
                <span>
                  <strong className="text-slate-900 dark:text-white">Route Mutation Guard:</strong>{' '}
                  Content editing and resume uploads are locked behind backend session validation.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <FaCheck className="mt-1 shrink-0 text-xs text-emerald-500" />
                <span>
                  <strong className="text-slate-900 dark:text-white">PBKDF2 Password Hashing:</strong>{' '}
                  Passwords are salted with SHA-512 over 120,000 iterations against brute-force attacks.
                </span>
              </li>
            </ul>
          </div>

          {/* Card 2: Production Tip */}
          <div className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="mb-2 flex items-center gap-2 text-amber-500">
              <FaExclamationTriangle className="text-base" />
              <span className="text-xs font-bold sm:text-sm">Production Tip</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-300">
              When deploying to production, make sure to set a unique{' '}
              <code className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-xs text-amber-900 dark:bg-amber-900/50 dark:text-amber-200">
                ADMIN_PASSWORD
              </code>{' '}
              and{' '}
              <code className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-xs text-amber-900 dark:bg-amber-900/50 dark:text-amber-200">
                ADMIN_SESSION_SECRET
              </code>{' '}
              in your host environment variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
