'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaCode, FaLightbulb, FaRocket } from 'react-icons/fa';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { fadeUp, smoothTransition, staggerContainer, viewportOnce, cardHover, cardTap } from './motionPresets';
import { getStableGradient } from './themePalette';

const passionIcons = {
  FaBrain,
  FaCode,
  FaLightbulb,
  FaRocket,
};

export default function PassionSection({
  initialPassions = DEFAULT_DATA.passions,
  initialHeadings = DEFAULT_DATA.sectionHeadings.passion,
}) {
  const [passions, setPassions] = useState(initialPassions);
  const [headings, setHeadings] = useState({
    ...DEFAULT_DATA.sectionHeadings.passion,
    ...initialHeadings,
  });

  useEffect(() => {
    const loadContent = () => {
      const storedPassions = getFromStorage(STORAGE_KEYS.PASSIONS, null);
      const storedHeadings = getFromStorage(STORAGE_KEYS.SECTION_HEADINGS, null);

      if (storedPassions) setPassions(storedPassions);
      if (storedHeadings?.passion) {
        setHeadings((prev) => ({ ...prev, ...storedHeadings.passion }));
      }
    };

    loadContent();
    window.addEventListener('passionsUpdated', loadContent);
    window.addEventListener('sectionHeadingsUpdated', loadContent);
    window.addEventListener('portfolioContentUpdated', loadContent);

    return () => {
      window.removeEventListener('passionsUpdated', loadContent);
      window.removeEventListener('sectionHeadingsUpdated', loadContent);
      window.removeEventListener('portfolioContentUpdated', loadContent);
    };
  }, []);

  const visiblePassions = passions.filter((p) => p.enabled !== false);

  return (
    <section id="passion" className="section-frame">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp} transition={smoothTransition} className="mx-auto mb-5 eyebrow">
            {headings.eyebrow || 'Focus'}
          </motion.div>
          <motion.h2 variants={fadeUp} transition={smoothTransition} className="section-title">
            {headings.title || 'Building Useful Digital Products'}
          </motion.h2>
          <motion.p variants={fadeUp} transition={smoothTransition} className="section-copy mt-5">
            {headings.subtitle ||
              'My work sits at the intersection of clean UI, reliable data, and practical problem solving.'}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-10 grid gap-5 md:grid-cols-2"
        >
          {visiblePassions.map((passion, index) => {
            const Icon = passionIcons[passion.icon] || FaCode;
            const accentGradient = getStableGradient(passion.title, index);

            return (
              <motion.article
                key={passion.id || passion.title}
                variants={fadeUp}
                whileHover={cardHover}
                whileTap={cardTap}
                className="quiet-card elevated-card p-6"
              >
                <div className={`mb-6 h-1.5 w-20 rounded-full bg-gradient-to-r ${accentGradient}`} />
                <div className="icon-tile mb-5 h-12 w-12">
                  <Icon />
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">{passion.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {passion.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
