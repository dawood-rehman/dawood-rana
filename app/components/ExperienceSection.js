'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { fadeUp, smoothTransition, staggerContainer, viewportOnce, cardHover, cardTap } from './motionPresets';
import { getStableGradient } from './themePalette';

export default function ExperienceSection({
  initialExperiences = DEFAULT_DATA.experiences,
  initialHeadings = DEFAULT_DATA.sectionHeadings.experiences,
}) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [headings, setHeadings] = useState({
    ...DEFAULT_DATA.sectionHeadings.experiences,
    ...initialHeadings,
  });

  useEffect(() => {
    const loadContent = () => {
      const stored = getFromStorage(STORAGE_KEYS.EXPERIENCES, null);
      const storedHeadings = getFromStorage(STORAGE_KEYS.SECTION_HEADINGS, null);

      if (stored) setExperiences(stored);
      if (storedHeadings?.experiences) {
        setHeadings((prev) => ({ ...prev, ...storedHeadings.experiences }));
      }
    };

    loadContent();
    window.addEventListener('experiencesUpdated', loadContent);
    window.addEventListener('sectionHeadingsUpdated', loadContent);
    window.addEventListener('portfolioContentUpdated', loadContent);

    return () => {
      window.removeEventListener('experiencesUpdated', loadContent);
      window.removeEventListener('sectionHeadingsUpdated', loadContent);
      window.removeEventListener('portfolioContentUpdated', loadContent);
    };
  }, []);

  const visibleExperiences = (experiences || [])
    .filter((exp) => exp.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (visibleExperiences.length === 0) return null;

  return (
    <section id="experience" className="section-frame">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp} transition={smoothTransition} className="mx-auto mb-5 eyebrow">
            {headings?.eyebrow || 'Career'}
          </motion.div>
          <motion.h2 variants={fadeUp} transition={smoothTransition} className="section-title">
            {headings?.title || 'Work Experience'}
          </motion.h2>
          <motion.p variants={fadeUp} transition={smoothTransition} className="section-copy mt-5">
            {headings?.subtitle ||
              'A timeline of roles, engineering contributions, and key technical achievements.'}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-10 grid gap-5 md:grid-cols-2"
        >
          {visibleExperiences.map((exp, index) => {
            const accentGradient = getStableGradient(exp.company || exp.role, index);

            return (
              <motion.article
                key={exp.id || `${exp.company}-${index}`}
                variants={fadeUp}
                whileHover={cardHover}
                whileTap={cardTap}
                className="quiet-card elevated-card relative flex flex-col p-6"
              >
                <div className={`mb-6 h-1.5 w-24 rounded-full bg-gradient-to-r ${accentGradient}`} />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="icon-tile h-10 w-10 flex-shrink-0">
                        <FaBriefcase className="text-sm" />
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-slate-950 dark:text-white">{exp.role}</h3>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {exp.company}
                        </p>
                      </div>
                    </div>
                  </div>

                  {exp.current && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Current
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <FaCalendarAlt className="text-[11px]" />
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'Present'}
                  </span>
                  {exp.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-[11px]" />
                      {exp.location}
                    </span>
                  )}
                  {exp.employmentType && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium dark:bg-slate-800">
                      {exp.employmentType}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {exp.description}
                </p>

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2 pt-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
