'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

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
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.a
            href="#about"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg relative overflow-hidden"
              style={{
                border: `3px solid ${circleColor}`,
                background: `linear-gradient(135deg, ${bgColor}, ${circleColor})`,
                boxShadow: `0 0 20px ${circleColor}60, 0 0 40px ${circleColor}30`,
              }}
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Profile Picture or Fallback */}
         
         
                <span className="relative z-10">DR</span>
          
              
              {/* Pulsing rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: circleColor }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
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
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative font-semibold transition-all duration-300"
                >
                  <span className={`bg-gradient-to-r ${colorClass} bg-clip-text text-transparent hover:drop-shadow-lg`}>
                    {item.name}
                  </span>
                  <motion.div
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r ${colorClass}`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 dark:text-gray-300 p-2"
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
              className="md:hidden py-4 space-y-4 border-t border-gray-200 dark:border-gray-700 mt-2"
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
                  <a
                    key={index}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg bg-gradient-to-r ${colorClass} bg-clip-text text-transparent hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold transition-all hover:scale-105`}
                  >
                    {item.name}
                  </a>
                );
              })}
              <div className="px-4 pt-2">
                <ThemeToggle 
                  isMobile={true} 
                  onToggle={() => setIsMobileMenuOpen(false)} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

