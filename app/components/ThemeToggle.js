'use client';

import { useTheme } from './ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';

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
        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-slate-200 to-slate-100 dark:from-indigo-900 dark:to-purple-900 hover:from-slate-300 hover:to-slate-200 dark:hover:from-indigo-800 dark:hover:to-purple-800 text-slate-700 dark:text-indigo-100 transition-all duration-150 font-medium"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
        <span>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="hidden md:flex fixed top-6 right-6 z-50 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 text-white dark:text-slate-900 p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-150 border-2 border-white/30 dark:border-white/20 items-center justify-center"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
    </button>
  );
}

