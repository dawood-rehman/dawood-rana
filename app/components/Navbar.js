'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Passion', href: '#passion' },
  { name: 'Projects', href: '#projects' },
  { name: 'Completed', href: '#completed-projects' },
  { name: 'Education', href: '#education' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [circleColor, setCircleColor] = useState('#3b82f6');
  const [bgColor, setBgColor] = useState('#8b5cf6');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const colors = [
      { border: '#3b82f6', bg: '#8b5cf6' }, // blue to purple
      { border: '#8b5cf6', bg: '#ec4899' }, // purple to pink
      { border: '#ec4899', bg: '#f59e0b' }, // pink to amber
      { border: '#f59e0b', bg: '#10b981' }, // amber to green
      { border: '#10b981', bg: '#06b6d4' }, // green to cyan
      { border: '#06b6d4', bg: '#3b82f6' }, // cyan to blue
      { border: '#ef4444', bg: '#f97316' }, // red to orange
      { border: '#f97316', bg: '#8b5cf6' }, // orange to purple
    ];

    const interval = setInterval(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setCircleColor(randomColor.border);
      setBgColor(randomColor.bg);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-150 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-16">
          <motion.a
            href="#about"
            transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
            className="relative flex-shrink-0"
          >
            <motion.div
              className="w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-lg relative overflow-hidden"
              style={{
                border: `3px solid ${circleColor}`,
                background: `linear-gradient(135deg, ${bgColor}, ${circleColor})`,
                boxShadow: `0 0 20px ${circleColor}, 0 0 40px ${circleColor}`,
              }}
            >
              {/* Animated shine effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              
              {/* Profile Picture or Fallback */}
         
         
                <span className="relative z-10">DR</span>
          
            </motion.div>
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            {navItems.map((item, index) => {
              const colors = [
                'from-cyan-400 to-blue-500',
                'from-purple-400 to-pink-500',
                'from-orange-400 to-red-500',
                'from-green-400 to-emerald-500',
                'from-indigo-400 to-purple-500',
                'from-pink-400 to-rose-500',
                'from-blue-400 to-cyan-500',
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <motion.a
                  key={index}
                  href={item.href}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                  className="relative font-semibold transition-all duration-300 text-sm lg:text-base"
                >
                  <span className={`bg-gradient-to-r ${colorClass} bg-clip-text text-transparent hover:drop-shadow-lg`}>
                    {item.name}
                  </span>
                  <motion.div
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r ${colorClass}`}
                    initial={{ scaleX: 0 }}
                    transition={{ duration: 0.2, ease: [0.165, 0.84, 0.44, 1] }}
                  />
                </motion.a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-700 dark:text-slate-300 p-2 text-lg sm:text-xl"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.165, 0.84, 0.44, 1] }}
              className="md:hidden py-3 sm:py-4 space-y-2 sm:space-y-3 border-t border-slate-200 dark:border-slate-700 mt-2"
            >
              {navItems.map((item, index) => {
                const colors = [
                  'from-cyan-400 to-blue-500',
                  'from-purple-400 to-pink-500',
                  'from-orange-400 to-red-500',
                  'from-green-400 to-emerald-500',
                  'from-indigo-400 to-purple-500',
                  'from-pink-400 to-rose-500',
                  'from-blue-400 to-cyan-500',
                ];
                const colorClass = colors[index % colors.length];
                
                return (
                  <motion.a
                    key={index}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
                    className={`block px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gradient-to-r ${colorClass} bg-clip-text text-transparent hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-all hover:scale-105 text-sm sm:text-base duration-150`}
                  >
                    {item.name}
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

