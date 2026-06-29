'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaDownload, FaGithub, FaLinkedin } from 'react-icons/fa';
import { getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { fadeUp, smoothTransition, staggerContainer, viewportOnce } from './motionPresets';

const fallbackPersonalInfo = {
  name: 'Dawood Rehman',
  title: 'Full-Stack Developer & Computer Science Student',
  bio: 'I build clean, responsive web experiences with modern JavaScript, thoughtful UI, and practical backend systems.',
  image: '/Dawood.jpeg',
};

const highlights = [
  { value: '10+', label: 'Projects' },
  { value: '1.5', label: 'Years Learning' },
  { value: 'Full-stack', label: 'Focus' },
];

const proofPoints = ['Next.js', 'MongoDB', 'API Design', 'Responsive UI'];

export default function AboutSection() {
  const [personalInfo, setPersonalInfo] = useState(fallbackPersonalInfo);
  const [profilePicture, setProfilePicture] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const loadContent = () => {
      const savedInfo = getFromStorage(STORAGE_KEYS.PERSONAL_INFO, fallbackPersonalInfo);
      const savedPicture = getFromStorage(STORAGE_KEYS.PROFILE_PICTURE, '');
      const savedResume = getFromStorage(STORAGE_KEYS.RESUME, null);

      setPersonalInfo({ ...fallbackPersonalInfo, ...savedInfo });
      setProfilePicture(savedPicture);
      setResumeUrl(savedResume?.url || '');
    };

    loadContent();
    window.addEventListener('personalInfoUpdated', loadContent);
    window.addEventListener('profilePictureUpdated', loadContent);
    window.addEventListener('resumeUpdated', loadContent);
    window.addEventListener('portfolioContentUpdated', loadContent);

    return () => {
      window.removeEventListener('personalInfoUpdated', loadContent);
      window.removeEventListener('profilePictureUpdated', loadContent);
      window.removeEventListener('resumeUpdated', loadContent);
      window.removeEventListener('portfolioContentUpdated', loadContent);
    };
  }, []);

  const imageSource =
    profilePicture ||
    (personalInfo.image && personalInfo.image !== '/profile.jpg' ? personalInfo.image : '/Dawood.jpeg');

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
            Portfolio
          </motion.div>

          <motion.div variants={fadeUp} transition={smoothTransition} className="space-y-4">
            <h1 className="premium-text max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              {personalInfo.name}
            </h1>
            <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 sm:text-2xl">
              {personalInfo.title}
            </p>
            <p className="section-copy max-w-2xl">
              {personalInfo.bio || fallbackPersonalInfo.bio}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} transition={smoothTransition} className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#projects"
              className="btn-primary focus-ring gap-2 px-5 py-3 text-sm"
            >
              View Projects <FaArrowRight />
            </a>
            {resumeUrl && (
              <a
                href={resumeUrl}
                download
                className="btn-secondary focus-ring gap-2 px-5 py-3 text-sm"
              >
                <FaDownload /> Resume
              </a>
            )}
          </motion.div>

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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={smoothTransition}
          className="glass-panel elevated-card mx-auto w-full max-w-[560px] p-4 sm:p-5 lg:mx-0 lg:justify-self-end"
        >
          <div className="overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-900">
            <img
              src={imageSource}
              alt={personalInfo.name}
              className="aspect-[4/4.65] max-h-[610px] w-full object-cover"
            />
          </div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-950 dark:text-white">Available for focused web work</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Next.js, React, MongoDB, APIs</p>
            </div>
            <div className="flex gap-2">
              <a
                href="https://github.com/dawood-rehman"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary focus-ring h-10 w-10 rounded-full"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/dawood-rehman-b25230383"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary focus-ring h-10 w-10 rounded-full"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Delivery</p>
              <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">Clean & responsive</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Stack</p>
              <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">React + MongoDB</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
