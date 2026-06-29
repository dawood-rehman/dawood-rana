'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Apply theme to DOM and localStorage
  const applyTheme = (newTheme) => {
    const normalizedTheme = newTheme === 'dark' ? 'dark' : 'light';
    const root = document.documentElement;
    root.dataset.theme = normalizedTheme;
    root.style.colorScheme = normalizedTheme;

    if (normalizedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', normalizedTheme);
    return normalizedTheme;
  };

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let savedTheme = localStorage.getItem('theme');
    if (savedTheme !== 'dark' && savedTheme !== 'light') {
      savedTheme = null;
    }
    
    // If no saved theme, detect from system preference
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      savedTheme = prefersDark ? 'dark' : 'light';
    }
    
    setTheme(applyTheme(savedTheme));
    setMounted(true);
  }, []);

  // Toggle theme - apply synchronously first, then update state
  const toggleTheme = () => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    // Read current theme from DOM, not from stale state
    const currentTheme = root.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    setTheme(applyTheme(newTheme));
  };

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
