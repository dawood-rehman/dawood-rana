'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/app/context/AdminContext';
import AdminLoginModal from './AdminLoginModal';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated } = useAdmin();
  const router = useRouter();

  const handleNameClick = () => {
    if (isAuthenticated) {
      router.push('/admin');
      return;
    }

    setIsLoginOpen(true);
  };

  return (
    <>
      <footer className="border-t border-slate-200/80 px-4 py-8 dark:border-slate-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {currentYear} Dawood Rehman. All rights reserved.
          </p>
          <button
            onClick={handleNameClick}
            className="focus-ring rounded-full px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            title={isAuthenticated ? 'Go to admin panel' : 'Admin login'}
          >
            Admin
          </button>
        </div>
      </footer>

      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={() => router.push('/admin')}
      />
    </>
  );
}
