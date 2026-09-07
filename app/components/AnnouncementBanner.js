'use client';

import { useEffect, useState } from 'react';
import { FaArrowRight, FaTimes } from 'react-icons/fa';
import { getFromStorage, STORAGE_KEYS } from '@/lib/storage';

export default function AnnouncementBanner({ initialBanners = [] }) {
  const [banners, setBanners] = useState(initialBanners);
  const [dismissedIds, setDismissedIds] = useState([]);

  useEffect(() => {
    const loadBanners = () => {
      const stored = getFromStorage(STORAGE_KEYS.BANNERS, null);
      if (stored && Array.isArray(stored)) {
        setBanners(stored);
      }
    };

    loadBanners();
    window.addEventListener('bannersUpdated', loadBanners);
    window.addEventListener('portfolioContentUpdated', loadBanners);

    return () => {
      window.removeEventListener('bannersUpdated', loadBanners);
      window.removeEventListener('portfolioContentUpdated', loadBanners);
    };
  }, []);

  const activeBanner = banners.find(
    (b) => b.enabled && !dismissedIds.includes(b.id)
  );

  if (!activeBanner) return null;

  const handleDismiss = () => {
    setDismissedIds((prev) => [...prev, activeBanner.id]);
  };

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="relative z-50 border-b border-blue-500/20 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-4 py-2.5 text-white shadow-sm"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-xs font-semibold sm:text-sm">
        <div className="flex flex-1 items-center justify-center gap-2 text-center">
          {activeBanner.title && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-black uppercase tracking-wider">
              {activeBanner.title}
            </span>
          )}
          <span>{activeBanner.text}</span>
          {activeBanner.ctaText && activeBanner.ctaUrl && (
            <a
              href={activeBanner.ctaUrl}
              className="inline-flex items-center gap-1 font-bold underline hover:opacity-90"
            >
              {activeBanner.ctaText} <FaArrowRight className="text-[10px]" />
            </a>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white"
          aria-label="Dismiss banner"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>
    </div>
  );
}
