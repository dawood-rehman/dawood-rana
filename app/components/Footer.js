'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/app/context/AdminContext';
import { useRouter } from 'next/navigation';
import AdminLoginModal from './AdminLoginModal';
import toast from 'react-hot-toast';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated } = useAdmin();
  const router = useRouter();

  const handleNameClick = () => {
    if (isAuthenticated) {
      router.push('/admin');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    router.push('/admin');
  };

  return (
    <>
      <footer className="relative py-6 sm:py-8 px-3 sm:px-4 border-t border-slate-200/20 dark:border-slate-700/50">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black opacity-50"></div>
        
        <div className="w-full max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-center"
          >
            <p className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm md:text-base">
              © {currentYear} Copyright:{' '}
              <motion.button
                onClick={handleNameClick}
                transition={{ duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
                className="font-semibold text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text cursor-pointer hover:opacity-80 transition-opacity inline-block"
                title={isAuthenticated ? 'Go to Admin Panel' : 'Click to login'}
              >
                Dawood Rehman
              </motion.button>
            </p>
          </motion.div>
        </div>
      </footer>

      <AdminLoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

