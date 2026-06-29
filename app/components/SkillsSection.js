'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { fadeUp, smoothTransition, staggerContainer, viewportOnce } from './motionPresets';
import { getStableGradient } from './themePalette';

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const loadSkills = () => {
      setSkills(getFromStorage(STORAGE_KEYS.SKILLS, []));
    };

    loadSkills();
    window.addEventListener('storage', loadSkills);
    window.addEventListener('skillsUpdated', loadSkills);
    window.addEventListener('portfolioContentUpdated', loadSkills);

    return () => {
      window.removeEventListener('storage', loadSkills);
      window.removeEventListener('skillsUpdated', loadSkills);
      window.removeEventListener('portfolioContentUpdated', loadSkills);
    };
  }, []);

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
            Toolkit
          </motion.div>
          <motion.h2 variants={fadeUp} transition={smoothTransition} className="section-title">
            Skills
          </motion.h2>
          <motion.p variants={fadeUp} transition={smoothTransition} className="section-copy mt-5">
            Technologies I use to design, build, connect, and ship modern web applications.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id || skill.name}
              variants={fadeUp}
              transition={smoothTransition}
              className="quiet-card elevated-card flex min-h-20 items-center gap-3 p-4 hover:-translate-y-1"
            >
              <span className={`h-3 w-3 flex-shrink-0 rounded-full bg-gradient-to-br ${getStableGradient(skill.name, index)}`} />
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
