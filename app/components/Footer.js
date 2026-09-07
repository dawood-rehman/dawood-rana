'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/app/context/AdminContext';
import AdminLoginModal from './AdminLoginModal';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';

export default function Footer({
  initialFooterConfig = DEFAULT_DATA.footerConfig,
  initialSocialLinks = DEFAULT_DATA.socialLinks,
  initialPersonalInfo = DEFAULT_DATA.personalInfo,
}) {
  const currentYear = new Date().getFullYear();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [footerConfig, setFooterConfig] = useState({
    ...DEFAULT_DATA.footerConfig,
    ...initialFooterConfig,
  });
  const [personalInfo, setPersonalInfo] = useState({
    ...DEFAULT_DATA.personalInfo,
    ...initialPersonalInfo,
  });
  const [socialLinks, setSocialLinks] = useState(initialSocialLinks);
  const { isAuthenticated } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    const loadFooter = () => {
      const storedConfig = getFromStorage(STORAGE_KEYS.FOOTER_CONFIG, null);
      const storedSocials = getFromStorage(STORAGE_KEYS.SOCIAL_LINKS, null);
      const storedPersonal = getFromStorage(STORAGE_KEYS.PERSONAL_INFO, null);

      if (storedConfig) setFooterConfig((prev) => ({ ...prev, ...storedConfig }));
      if (storedSocials) setSocialLinks(storedSocials);
      if (storedPersonal) setPersonalInfo((prev) => ({ ...prev, ...storedPersonal }));
    };

    loadFooter();
    window.addEventListener('footerConfigUpdated', loadFooter);
    window.addEventListener('socialsUpdated', loadFooter);
    window.addEventListener('personalInfoUpdated', loadFooter);
    window.addEventListener('portfolioContentUpdated', loadFooter);

    return () => {
      window.removeEventListener('footerConfigUpdated', loadFooter);
      window.removeEventListener('socialsUpdated', loadFooter);
      window.removeEventListener('personalInfoUpdated', loadFooter);
      window.removeEventListener('portfolioContentUpdated', loadFooter);
    };
  }, []);

  const handleNameClick = () => {
    setIsLoginOpen(true);
  };

  const name = personalInfo.name || 'Dawood Rehman';
  const rawText = footerConfig.copyrightText || '© {year} {name}. All rights reserved.';

  let copyrightText = rawText.replace('{year}', String(currentYear));
  if (copyrightText.includes('{name}')) {
    copyrightText = copyrightText.replace('{name}', name);
  } else {
    // Dynamically replace default name with the updated personalInfo name
    copyrightText = copyrightText.replace(/Dawood Rehman/gi, name);
  }

  return (
    <>
      <footer className="border-t border-slate-200/80 px-4 py-8 dark:border-slate-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {copyrightText}
            </p>
            {footerConfig.description && (
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md">
                {footerConfig.description}
              </p>
            )}
          </div>

          {footerConfig.legalLinks && footerConfig.legalLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {footerConfig.legalLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noopener noreferrer' : undefined}
                  className="hover:text-slate-900 dark:hover:text-white"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {footerConfig.showSocialLinks && socialLinks && socialLinks.length > 0 && (
              <div className="flex items-center gap-2">
                {socialLinks
                  .filter((s) => s.enabled !== false)
                  .map((s) => (
                    <a
                      key={s.id || s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      title={s.name}
                    >
                      {s.name}
                    </a>
                  ))}
              </div>
            )}

            {footerConfig.showAdminButton !== false && (
              <button
                onClick={handleNameClick}
                className="focus-ring rounded-full px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                title={isAuthenticated ? 'Go to admin panel' : 'Admin login'}
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </footer>

      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={() => router.push('/admin')}
      />
    </>
  );
}
