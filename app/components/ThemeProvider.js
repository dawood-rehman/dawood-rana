'use client';

import { createContext, useContext, useCallback, useSyncExternalStore } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

function getThemeSnapshot() {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function subscribeToTheme(callback) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('theme-changed', callback);
  return () => window.removeEventListener('theme-changed', callback);
}

export function ThemeProvider({ children }) {
  // CRITICAL ARCHITECTURAL DECISION:
  // We do NOT store theme in useState at this RootLayout level because root state updates
  // force React to reconcile and re-render the entire application tree (including heavy
  // Framer Motion sections and canvasses), introducing a 1-1.5s freeze.
  // Instead, theme switching is 100% synchronous DOM-first (0ms latency), and consumers
  // subscribe via useSyncExternalStore without causing full page re-renders.

  const toggleTheme = useCallback(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const isDark = root.classList.toggle('dark');
    const newTheme = isDark ? 'dark' : 'light';
    root.dataset.theme = newTheme;
    root.style.colorScheme = newTheme;

    try {
      localStorage.setItem('theme', newTheme);
    } catch {}

    window.dispatchEvent(new CustomEvent('theme-changed', { detail: newTheme }));
  }, []);

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => 'light');
  return {
    theme,
    toggleTheme: context?.toggleTheme || (() => {}),
  };
};
