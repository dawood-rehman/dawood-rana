'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaDownload,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from 'react-icons/fa';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { fadeUp, smoothTransition, staggerContainer, viewportOnce } from './motionPresets';

const defaultHighlights = [
  { value: '10+', label: 'Projects' },
  { value: '1.5', label: 'Years Learning' },
  { value: 'Full-stack', label: 'Focus' },
];

const defaultProofPoints = ['Next.js', 'MongoDB', 'API Design', 'Responsive UI'];

const socialIconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  whatsapp: FaWhatsapp,
  facebook: FaFacebook,
  instagram: FaInstagram,
};

const getSocialIcon = (name = '') => {
  const lower = name.toLowerCase();
  for (const [key, Icon] of Object.entries(socialIconMap)) {
    if (lower.includes(key)) return Icon;
  }
  return FaGlobe;
};

export default function AboutSection({
  initialPersonalInfo = DEFAULT_DATA.personalInfo,
  initialProfilePicture = '',
  initialResumeUrl = '',
  initialSocialLinks = DEFAULT_DATA.socialLinks,
}) {
  const [personalInfo, setPersonalInfo] = useState({
    ...DEFAULT_DATA.personalInfo,
    ...initialPersonalInfo,
  });
  const [profilePicture, setProfilePicture] = useState(initialProfilePicture);
  const [resumeUrl, setResumeUrl] = useState(initialResumeUrl);
  const [socialLinks, setSocialLinks] = useState(initialSocialLinks);

  useEffect(() => {
    const loadContent = () => {
      const savedInfo = getFromStorage(STORAGE_KEYS.PERSONAL_INFO, null);
      const savedPicture = getFromStorage(STORAGE_KEYS.PROFILE_PICTURE, null);
      const savedResume = getFromStorage(STORAGE_KEYS.RESUME, null);
      const savedSocials = getFromStorage(STORAGE_KEYS.SOCIAL_LINKS, null);

      if (savedInfo) setPersonalInfo((prev) => ({ ...prev, ...savedInfo }));
      if (savedPicture !== null && savedPicture !== undefined) setProfilePicture(savedPicture);
      if (savedResume?.url) setResumeUrl(savedResume.url);
      if (savedSocials) setSocialLinks(savedSocials);
    };

    loadContent();
    window.addEventListener('personalInfoUpdated', loadContent);
    window.addEventListener('profilePictureUpdated', loadContent);
    window.addEventListener('resumeUpdated', loadContent);
    window.addEventListener('socialsUpdated', loadContent);
    window.addEventListener('portfolioContentUpdated', loadContent);

    return () => {
      window.removeEventListener('personalInfoUpdated', loadContent);
      window.removeEventListener('profilePictureUpdated', loadContent);
      window.removeEventListener('resumeUpdated', loadContent);
      window.removeEventListener('socialsUpdated', loadContent);
      window.removeEventListener('portfolioContentUpdated', loadContent);
    };
  }, []);

  const initials = (personalInfo.name || 'Dawood Rehman')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const highlights =
    personalInfo.highlights && personalInfo.highlights.length > 0
      ? personalInfo.highlights
      : defaultHighlights;

  const proofPoints =
    personalInfo.proofPoints && personalInfo.proofPoints.length > 0
      ? personalInfo.proofPoints
      : defaultProofPoints;

  const ctaPrimary = personalInfo.ctaPrimary || {
    label: 'View Projects',
    href: '#projects',
    enabled: true,
  };

  const ctaSecondary = personalInfo.ctaSecondary || {
    label: 'Resume',
    href: '',
    enabled: true,
  };

  const effectiveResumeHref = resumeUrl || ctaSecondary.href;

  const activeSocials =
    socialLinks && socialLinks.length > 0
      ? socialLinks.filter((s) => s.enabled !== false).slice(0, 3)
      : [
          { name: 'GitHub', url: 'https://github.com/dawood-rehman' },
          { name: 'LinkedIn', url: 'https://www.linkedin.com/in/dawood-rehman-b25230383' },
        ];

  const ProfilePanel = ({ className = '', compact = false }) => (
    <div className={`glass-panel elevated-card mx-auto w-full max-w-[560px] p-4 sm:p-5 ${className}`}>
      <div className="overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-900">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={personalInfo.name || 'Profile'}
            width="560"
            height="650"
            decoding="async"
            fetchPriority="high"
            className="aspect-[4/4.65] max-h-[610px] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/4.65] max-h-[610px] w-full items-center justify-center bg-gradient-to-br from-sky-400 via-teal-300 to-emerald-400">
            <span className="text-5xl font-black text-slate-950 sm:text-6xl">{initials || 'DR'}</span>
          </div>
        )}
      </div>

      {!compact && (
        <>
          <div className="mt-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-950 dark:text-white">
                {personalInfo.availabilityTitle || 'Available for focused web work'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {personalInfo.availabilitySubtitle || 'Next.js, React, MongoDB, APIs'}
              </p>
            </div>
            <div className="flex gap-2">
              {activeSocials.map((s) => {
                const Icon = getSocialIcon(s.icon || s.name);
                return (
                  <a
                    key={s.id || s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary focus-ring h-10 w-10 rounded-full flex items-center justify-center"
                    aria-label={s.name}
                    title={s.name}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {personalInfo.deliveryTitle || 'Delivery'}
              </p>
              <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">
                {personalInfo.deliveryValue || 'Clean & responsive'}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {personalInfo.stackTitle || 'Stack'}
              </p>
              <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">
                {personalInfo.stackValue || 'React + MongoDB'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <section id="about" className="section-frame hero-section flex items-center">
      <div className="section-container grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] xl:gap-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-7"
        >
          <motion.div variants={fadeUp} transition={smoothTransition} className="eyebrow">
            {personalInfo.eyebrow || 'Portfolio'}
          </motion.div>

          <motion.div variants={fadeUp} transition={smoothTransition} className="space-y-4">
            <h1 className="premium-text max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              {personalInfo.name || 'Dawood Rehman'}
            </h1>
            <ProfilePanel compact className="lg:hidden" />
            <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 sm:text-2xl">
              {personalInfo.title || 'Full-Stack Developer & Computer Science Student'}
            </p>
            <p className="section-copy max-w-2xl">
              {personalInfo.bio || DEFAULT_DATA.personalInfo.bio}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} transition={smoothTransition} className="flex flex-col gap-3 sm:flex-row">
            {ctaPrimary.enabled !== false && (
              <a
                href={ctaPrimary.href || '#projects'}
                className="btn-primary focus-ring gap-2 px-5 py-3 text-sm"
              >
                {ctaPrimary.label || 'View Projects'} <FaArrowRight />
              </a>
            )}
            {ctaSecondary.enabled !== false && effectiveResumeHref && (
              <a
                href={effectiveResumeHref}
                download
                className="btn-secondary focus-ring gap-2 px-5 py-3 text-sm"
              >
                <FaDownload /> {ctaSecondary.label || 'Resume'}
              </a>
            )}
          </motion.div>

          {proofPoints.length > 0 && (
            <motion.div
              variants={fadeUp}
              transition={smoothTransition}
              className="flex flex-wrap items-center gap-2"
              aria-label="Core proof points"
            >
              {proofPoints.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-slate-200 bg-white/72 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200"
                >
                  {point}
                </span>
              ))}
            </motion.div>
          )}

          {highlights.length > 0 && (
            <motion.div variants={fadeUp} transition={smoothTransition} className="grid grid-cols-3 gap-3 sm:max-w-xl">
              {highlights.map((item) => (
                <div key={item.label} className="quiet-card px-4 py-4">
                  <div className="text-xl font-black text-slate-950 dark:text-white">{item.value}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={smoothTransition}
          className="hidden lg:block lg:justify-self-end"
        >
          <ProfilePanel className="lg:mx-0" />
        </motion.div>
      </div>
    </section>
  );
}
