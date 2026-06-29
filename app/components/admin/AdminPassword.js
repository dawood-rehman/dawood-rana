'use client';

import { useState } from 'react';
import { useAdmin } from '@/app/context/AdminContext';
import toast from 'react-hot-toast';

export default function AdminPassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const result = await updatePassword(currentPassword, newPassword);
      if (result.success) {
        toast.success(result.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="bg-slate-800 rounded-lg p-4 sm:p-6 md:p-8 border border-slate-700"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Change Password</h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8">Update your admin login password</p>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
              Current Password *
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
              New Password *
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
              disabled={loading}
            />
            <p className="text-xs sm:text-xs text-slate-400 mt-1.5 sm:mt-2">Minimum 8 characters</p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
              Confirm New Password *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
              disabled={loading}
            />
          </div>

          <div
            className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 sm:p-4"
          >
            <p className="text-yellow-200 text-xs sm:text-sm">
              Make sure to remember your new password. There is no password recovery option.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-11 px-4 py-3 sm:py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-blue-600"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
