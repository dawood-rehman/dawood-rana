'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaSchool, FaUniversity } from 'react-icons/fa';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { fadeUp, smoothTransition, staggerContainer, viewportOnce, cardHover, cardTap } from './motionPresets';
import { getStableGradient } from './themePalette';

const icons = {
  FaSchool,
  FaGraduationCap,
  FaUniversity,
};

export default function EducationSection({
  initialEducation = DEFAULT_DATA.education,
  initialHeadings = DEFAULT_DATA.sectionHeadings.education,
}) {
  const [education, setEducation] = useState(initialEducation);
  const [headings, setHeadings] = useState({
    ...DEFAULT_DATA.sectionHeadings.education,
    ...initialHeadings,
  });

  useEffect(() => {
    const loadContent = () => {
      const stored = getFromStorage(STORAGE_KEYS.EDUCATION, null);
      const storedHeadings = getFromStorage(STORAGE_KEYS.SECTION_HEADINGS, null);

      if (stored) setEducation(stored);
      if (storedHeadings?.education) {
        setHeadings((prev) => ({ ...prev, ...storedHeadings.education }));
      }
    };

    loadContent();
    window.addEventListener('storage', loadContent);
    window.addEventListener('educationUpdated', loadContent);
    window.addEventListener('sectionHeadingsUpdated', loadContent);
    window.addEventListener('portfolioContentUpdated', loadContent);

    return () => {
      window.removeEventListener('storage', loadContent);
      window.removeEventListener('educationUpdated', loadContent);
      window.removeEventListener('sectionHeadingsUpdated', loadContent);
      window.removeEventListener('portfolioContentUpdated', loadContent);
    };
  }, []);

  const visibleEducation = education.filter((edu) => edu.enabled !== false);

  return (
    <section id="education" className="section-frame">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp} transition={smoothTransition} className="mx-auto mb-5 eyebrow">
            {headings.eyebrow || 'Background'}
          </motion.div>
          <motion.h2 variants={fadeUp} transition={smoothTransition} className="section-title">
            {headings.title || 'Education'}
          </motion.h2>
          <motion.p variants={fadeUp} transition={smoothTransition} className="section-copy mt-5">
            {headings.subtitle ||
              'A learning path shaped by science, computer science, and practical development.'}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="relative mt-10 grid gap-5 md:grid-cols-3"
        >
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-12 hidden h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 md:block" />
          {visibleEducation.map((edu, index) => {
            const Icon = icons[edu.icon] || FaGraduationCap;
            const accentGradient = getStableGradient(edu.title, index);

            return (
              <motion.article
                key={edu.id || edu.title}
                variants={fadeUp}
                whileHover={cardHover}
                whileTap={cardTap}
                className="quiet-card elevated-card relative p-6 text-center"
              >
                <span className="mb-4 inline-flex rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-black uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
                  Step {String(index + 1).padStart(2, '0')}
                </span>
                <div
                  className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${accentGradient} text-white shadow-md ring-4 ring-white/70 dark:ring-slate-950/70`}
                >
                  <Icon />
                </div>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">{edu.title}</h3>
                <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{edu.institution}</p>
                {edu.stream && (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{edu.stream}</p>
                )}
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
