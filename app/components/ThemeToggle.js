'use client';

import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle({ isMobile = false, onToggle }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleToggle = () => {
    toggleTheme();
    onToggle?.();
  };

  if (isMobile) {
    return (
      <button
        onClick={handleToggle}
        className="focus-ring flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        aria-label="Toggle theme"
      >
        <span className="flex items-center gap-3">
          {isDark ? <FaSun className="text-cyan-300" /> : <FaMoon className="text-blue-600" />}
          {isDark ? 'Switch to light' : 'Switch to dark'}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{isDark ? 'Dark' : 'Light'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="focus-ring hidden h-10 w-[4.75rem] items-center rounded-full border border-slate-200 bg-white/85 p-1 shadow-sm backdrop-blur-xl hover:bg-white dark:border-slate-800 dark:bg-slate-950/80 dark:hover:bg-slate-900 md:flex"
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm ${
          isDark
            ? 'translate-x-8 bg-cyan-300 text-slate-950'
            : 'translate-x-0 bg-blue-600 text-white'
        }`}
      >
        {isDark ? <FaMoon className="text-sm" /> : <FaSun className="text-sm" />}
      </span>
    </button>
  );
}
