'use client';

import { useTheme } from './ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ThemeToggle({ isMobile = false, onToggle }) {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
    if (onToggle) {
      onToggle();
    }
  };

  if (isMobile) {
    return (
      <button
        onClick={handleToggle}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
        aria-label="Toggle theme"
      >
        <motion.div
          animate={{ rotate: theme === 'dark' ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          className="text-xl"
        >
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </motion.div>
        <span className="font-medium">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1, rotate: 180 }}
      whileTap={{ scale: 0.9 }}
      className="hidden md:flex fixed top-6 right-6 z-50 bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-amber-500/50 dark:hover:shadow-purple-500/50 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm items-center justify-center"
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
      </motion.div>
    </motion.button>
  );
}

