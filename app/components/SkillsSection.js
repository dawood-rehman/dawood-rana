'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { fadeUp, smoothTransition, staggerContainer, viewportOnce } from './motionPresets';
import { getStableGradient } from './themePalette';

export default function SkillsSection({
  initialSkills = DEFAULT_DATA.skills,
  initialHeadings = DEFAULT_DATA.sectionHeadings.skills,
}) {
  const [skills, setSkills] = useState(initialSkills);
  const [headings, setHeadings] = useState({
    ...DEFAULT_DATA.sectionHeadings.skills,
    ...initialHeadings,
  });

  useEffect(() => {
    const loadContent = () => {
      const stored = getFromStorage(STORAGE_KEYS.SKILLS, null);
      const storedHeadings = getFromStorage(STORAGE_KEYS.SECTION_HEADINGS, null);

      if (stored) setSkills(stored);
      if (storedHeadings?.skills) {
        setHeadings((prev) => ({ ...prev, ...storedHeadings.skills }));
      }
    };

    loadContent();
    window.addEventListener('storage', loadContent);
    window.addEventListener('skillsUpdated', loadContent);
    window.addEventListener('sectionHeadingsUpdated', loadContent);
    window.addEventListener('portfolioContentUpdated', loadContent);

    return () => {
      window.removeEventListener('storage', loadContent);
      window.removeEventListener('skillsUpdated', loadContent);
      window.removeEventListener('sectionHeadingsUpdated', loadContent);
      window.removeEventListener('portfolioContentUpdated', loadContent);
    };
  }, []);

  const visibleSkills = skills.filter((s) => s.enabled !== false);

  return (
    <section id="skills" className="section-frame">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp} transition={smoothTransition} className="mx-auto mb-5 eyebrow">
            {headings.eyebrow || 'Toolkit'}
          </motion.div>
          <motion.h2 variants={fadeUp} transition={smoothTransition} className="section-title">
            {headings.title || 'Skills'}
          </motion.h2>
          <motion.p variants={fadeUp} transition={smoothTransition} className="section-copy mt-5">
            {headings.subtitle ||
              'Technologies I use to design, build, connect, and ship modern web applications.'}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {visibleSkills.map((skill, index) => (
            <motion.div
              key={skill.id || skill.name}
              variants={fadeUp}
              transition={smoothTransition}
              className="quiet-card elevated-card flex min-h-20 items-center gap-3 p-4 hover:-translate-y-1"
            >
              <span
                className={`h-3 w-3 flex-shrink-0 rounded-full bg-gradient-to-br ${getStableGradient(
                  skill.name,
                  index
                )}`}
              />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 sm:text-base">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
