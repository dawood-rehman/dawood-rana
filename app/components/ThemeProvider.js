'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    
    let initialTheme = 'dark';
    if (savedTheme === 'light' || savedTheme === 'dark') {
      initialTheme = savedTheme;
    }
    
    // Apply theme immediately
    if (initialTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setTheme(initialTheme);
    if (!savedTheme) {
      localStorage.setItem('theme', initialTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    // Always check DOM directly for the most accurate state
    const isDark = root.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    
    // Update DOM immediately
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Update state using functional update
    setTheme((prevTheme) => {
      // Double-check: if state and DOM don't match, trust DOM
      const actualTheme = root.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('theme', actualTheme);
      return actualTheme;
    });
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'dark', toggleTheme }}>
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
