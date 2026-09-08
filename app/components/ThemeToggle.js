'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { playThemeSound } from '@/lib/soundManager';

/* ─── Premium Radiant Sun SVG with Gradient Core & Rays ─── */
function SunGraphic({ className = '', glow = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} ${
        glow ? 'drop-shadow-[0_0_7px_rgba(251,191,36,0.85)]' : ''
      }`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sun-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <radialGradient id="sun-core" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
      </defs>
      {/* Central Sun Core */}
      <circle cx="12" cy="12" r="4.75" fill="url(#sun-core)" />
      {/* 8 Cardinal & Diagonal Radiant Rays */}
      <g stroke="url(#sun-gradient)" strokeWidth="2.1" strokeLinecap="round">
        <line x1="12" y1="1.75" x2="12" y2="4.25" />
        <line x1="12" y1="19.75" x2="12" y2="22.25" />
        <line x1="4.75" y1="4.75" x2="6.5" y2="6.5" />
        <line x1="17.5" y1="17.5" x2="19.25" y2="19.25" />
        <line x1="1.75" y1="12" x2="4.25" y2="12" />
        <line x1="19.75" y1="12" x2="22.25" y2="12" />
        <line x1="4.75" y1="19.25" x2="6.5" y2="17.5" />
        <line x1="17.5" y1="6.5" x2="19.25" y2="4.75" />
      </g>
    </svg>
  );
}

/* ─── Premium Celestial Moon SVG with Gradient & Twinkling Stars ─── */
function MoonGraphic({ className = '', glow = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} ${
        glow ? 'drop-shadow-[0_0_8px_rgba(129,140,248,0.9)]' : ''
      }`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="moon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
        <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>
      </defs>
      {/* Crescent Moon Silhouette */}
      <path
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        fill="url(#moon-gradient)"
      />
      {/* Primary Sparkling 4-point Star */}
      <path
        d="M17.5 2.2L18.15 3.85L19.8 4.5L18.15 5.15L17.5 6.8L16.85 5.15L15.2 4.5L16.85 3.85L17.5 2.2Z"
        fill="url(#star-gradient)"
      />
      {/* Secondary Ambient Twinkle */}
      <circle cx="21" cy="9" r="0.9" fill="#E0E7FF" />
    </svg>
  );
}

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
        className="focus-ring flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white/90 p-3 text-sm font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-850"
        aria-label="Toggle theme"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 p-1.5 dark:bg-slate-800">
            {mounted && isDark ? (
              <SunGraphic className="h-full w-full" glow />
            ) : (
              <MoonGraphic className="h-full w-full" glow />
            )}
          </span>
          <span className="font-semibold">
            {mounted && isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </span>
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-300">
          {mounted && isDark ? (
            <>
              <MoonGraphic className="h-3.5 w-3.5" /> Dark
            </>
          ) : (
            <>
              <SunGraphic className="h-3.5 w-3.5" /> Light
            </>
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`focus-ring group relative ${
        alwaysVisible ? 'flex' : 'hidden md:flex'
      } h-9 w-[5rem] items-center rounded-full border border-slate-200/90 bg-gradient-to-r from-amber-500/10 via-slate-100 to-indigo-500/15 p-1 shadow-inner backdrop-blur-xl transition-all duration-300 hover:border-slate-300 hover:shadow-sm dark:border-slate-800/90 dark:bg-gradient-to-r dark:from-amber-950/20 dark:via-slate-900 dark:to-indigo-950/40 dark:hover:border-slate-700`}
      aria-label="Toggle theme"
      title={mounted && isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Background Track Icons (Dual Dock: Off-side is clearly visible and inviting) */}
      <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none select-none">
        {/* Left Dock: Sun (visible on off-side when Dark Mode is active) */}
        <div
          className={`flex h-[30px] w-[30px] items-center justify-center transition-all duration-300 ${
            mounted && isDark
              ? 'opacity-85 scale-100 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.4)]'
              : 'opacity-0 scale-90'
          }`}
        >
          <SunGraphic className="h-[17px] w-[17px]" />
        </div>

        {/* Right Dock: Moon with Stars (visible on off-side when Light Mode is active) */}
        <div
          className={`flex h-[30px] w-[30px] items-center justify-center transition-all duration-300 ${
            !mounted || !isDark
              ? 'opacity-85 scale-100 filter drop-shadow-[0_0_4px_rgba(129,140,248,0.5)]'
              : 'opacity-0 scale-90'
          }`}
        >
          <MoonGraphic className="h-[17px] w-[17px]" />
        </div>
      </div>

      {/* Tactile Sliding Active Knob */}
      <span
        className={`relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full shadow-md transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
          mounted && isDark
            ? 'translate-x-[42px] bg-slate-950 border border-indigo-500/40 shadow-indigo-950/60 ring-1 ring-white/10'
            : 'translate-x-0 bg-white border border-amber-200/70 shadow-amber-500/15 ring-1 ring-black/5'
        }`}
      >
        {mounted && isDark ? (
          <MoonGraphic
            className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105"
            glow
          />
        ) : (
          <SunGraphic
            className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-45 group-hover:scale-105"
            glow
          />
        )}
      </span>
    </button>
  );
}
