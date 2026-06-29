'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaCode, FaLightbulb, FaRocket } from 'react-icons/fa';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { fadeUp, smoothTransition, staggerContainer, viewportOnce } from './motionPresets';
import { getStableGradient } from './themePalette';

const passionIcons = {
  FaBrain,
  FaCode,
  FaLightbulb,
  FaRocket,
};

export default function PassionSection() {
  const [passions, setPassions] = useState(DEFAULT_DATA.passions);

  useEffect(() => {
    const loadPassions = () => {
      setPassions(getFromStorage(STORAGE_KEYS.PASSIONS, DEFAULT_DATA.passions));
    };

    loadPassions();
    window.addEventListener('passionsUpdated', loadPassions);
    window.addEventListener('portfolioContentUpdated', loadPassions);

    return () => {
      window.removeEventListener('passionsUpdated', loadPassions);
      window.removeEventListener('portfolioContentUpdated', loadPassions);
    };
  }, []);

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
            Focus
          </motion.div>
          <motion.h2 variants={fadeUp} transition={smoothTransition} className="section-title">
            Building Useful Digital Products
          </motion.h2>
          <motion.p variants={fadeUp} transition={smoothTransition} className="section-copy mt-5">
            My work sits at the intersection of clean UI, reliable data, and practical problem solving.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-10 grid gap-5 md:grid-cols-2"
        >
          {passions.map((passion, index) => {
            const Icon = passionIcons[passion.icon] || FaCode;
            const accentGradient = getStableGradient(passion.title, index);

            return (
              <motion.article
                key={passion.id || passion.title}
                variants={fadeUp}
                transition={smoothTransition}
                className="quiet-card elevated-card p-6 hover:-translate-y-1"
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
