'use client';

import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from './ThemeProvider';
import { playThemeSound } from '@/lib/soundManager';

export default function ThemeToggle({ isMobile = false, alwaysVisible = false, onToggle }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const nextIsDark = theme !== 'dark';
    toggleTheme();
    playThemeSound(nextIsDark);
    onToggle?.();
  };

  const isDark = theme === 'dark';

  if (isMobile) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className="focus-ring flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        aria-label="Toggle theme"
      >
        <span className="flex items-center gap-3">
          <FaSun className="text-cyan-300 hidden dark:inline-block" />
          <FaMoon className="text-blue-600 inline-block dark:hidden" />
          <span className="hidden dark:inline">Switch to light</span>
          <span className="inline dark:hidden">Switch to dark</span>
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          <span className="hidden dark:inline">Dark</span>
          <span className="inline dark:hidden">Light</span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`focus-ring relative ${
        alwaysVisible ? 'flex' : 'hidden md:flex'
      } h-9 w-[4.5rem] items-center rounded-full border border-slate-200 bg-white/85 p-1 shadow-sm backdrop-blur-xl hover:bg-white dark:border-slate-800 dark:bg-slate-950/80 dark:hover:bg-slate-900`}
      aria-label="Toggle theme"
      title={mounted && isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-transform duration-100 ease-out ${
          mounted && isDark
            ? 'translate-x-7 bg-cyan-300 text-slate-950'
            : 'translate-x-0 bg-blue-600 text-white'
        }`}
      >
        {mounted && isDark ? (
          <FaMoon className="text-xs" />
        ) : (
          <FaSun className="text-xs" />
        )}
      </span>
    </button>
  );
}
