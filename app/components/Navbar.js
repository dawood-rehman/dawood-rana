'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { quickTransition } from './motionPresets';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';

export default function Navbar({
  initialNavbarConfig = DEFAULT_DATA.navbarConfig,
  initialPersonalInfo = DEFAULT_DATA.personalInfo,
}) {
  const [navbarConfig, setNavbarConfig] = useState({
    ...DEFAULT_DATA.navbarConfig,
    ...initialNavbarConfig,
  });
  const [personalInfo, setPersonalInfo] = useState({
    ...DEFAULT_DATA.personalInfo,
    ...initialPersonalInfo,
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const loadConfig = () => {
      const storedNav = getFromStorage(STORAGE_KEYS.NAVBAR_CONFIG, null);
      const storedPersonal = getFromStorage(STORAGE_KEYS.PERSONAL_INFO, null);

      if (storedNav) {
        setNavbarConfig((prev) => ({ ...prev, ...storedNav }));
      }
      if (storedPersonal) {
        setPersonalInfo((prev) => ({ ...prev, ...storedPersonal }));
      }
    };

    loadConfig();
    window.addEventListener('navbarConfigUpdated', loadConfig);
    window.addEventListener('personalInfoUpdated', loadConfig);
    window.addEventListener('portfolioContentUpdated', loadConfig);

    return () => {
      window.removeEventListener('navbarConfigUpdated', loadConfig);
      window.removeEventListener('personalInfoUpdated', loadConfig);
      window.removeEventListener('portfolioContentUpdated', loadConfig);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = (navbarConfig.navItems || DEFAULT_DATA.navbarConfig.navItems)
    .filter((item) => item.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  useEffect(() => {
    const sections = navItems
      .filter((item) => item.href && item.href.startsWith('#'))
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.12, 0.24, 0.4],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [navItems]);

  if (navbarConfig.enabled === false) return null;

  // Auto-sync brand name and initials from personalInfo.name unless a specific custom text was set
  const displayName = personalInfo.name || navbarConfig.logoText || 'Dawood Rehman';
  const displayInitials =
    displayName
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() ||
    navbarConfig.logoInitials ||
    'DR';

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={quickTransition}
      className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-300 ease-out ${
        isScrolled
          ? 'border-slate-200/80 bg-white/86 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/82'
          : 'border-slate-200/50 bg-white/58 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/54'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href={navbarConfig.logoHref || '#about'}
          className="focus-ring group flex items-center gap-3 rounded-full"
        >
          <span className="icon-tile h-10 w-10 rounded-full text-sm font-black transition-transform duration-200 group-hover:scale-105">
            {displayInitials}
          </span>
          <span className="hidden text-sm font-black text-slate-900 dark:text-white sm:block">
            {displayName}
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isAnchor = item.href && item.href.startsWith('#');
            const isActive = isAnchor && activeSection === item.href.slice(1);

            return (
              <a
                key={item.id || item.href}
                href={item.href}
                target={item.isExternal ? '_blank' : undefined}
                rel={item.isExternal ? 'noopener noreferrer' : undefined}
                className={`focus-ring rounded-full px-3.5 py-2 text-sm font-bold transition-colors duration-200 ease-out ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-sm ring-1 ring-slate-950/10 dark:bg-white/10 dark:text-white dark:ring-white/10'
                    : 'text-slate-600 hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                {item.name}
              </a>
            );
          })}

          {navbarConfig.ctaButton?.enabled && navbarConfig.ctaButton?.label && (
            <a
              href={navbarConfig.ctaButton.href || '#contact'}
              className="btn-primary ml-2 px-3.5 py-2 text-xs font-bold"
            >
              {navbarConfig.ctaButton.label}
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/70 bg-white text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={quickTransition}
            className="border-t border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 md:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-1">
              {navItems.map((item) => {
                const isAnchor = item.href && item.href.startsWith('#');
                const isActive = isAnchor && activeSection === item.href.slice(1);

                return (
                  <a
                    key={item.id || item.href}
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`focus-ring rounded-lg px-3 py-3 text-sm font-semibold ${
                      isActive
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}

              {navbarConfig.ctaButton?.enabled && navbarConfig.ctaButton?.label && (
                <a
                  href={navbarConfig.ctaButton.href || '#contact'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary mt-1 text-center py-2.5 text-sm"
                >
                  {navbarConfig.ctaButton.label}
                </a>
              )}
              <ThemeToggle isMobile onToggle={() => setIsMobileMenuOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
