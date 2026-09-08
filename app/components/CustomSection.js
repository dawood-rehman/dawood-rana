'use client';

import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { fadeUp, smoothTransition, staggerContainer, viewportOnce, cardHover, cardTap } from './motionPresets';
import { getStableGradient } from './themePalette';

export default function CustomSection({ section }) {
  if (!section || section.enabled === false) return null;

  const items = section.items || [];
  if (items.length === 0) return null;

  return (
    <section id={section.slug || section.id} className="section-frame">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mx-auto max-w-3xl text-center"
        >
          {section.eyebrow && (
            <motion.div variants={fadeUp} transition={smoothTransition} className="mx-auto mb-5 eyebrow">
              {section.eyebrow}
            </motion.div>
          )}
          <motion.h2 variants={fadeUp} transition={smoothTransition} className="section-title">
            {section.title}
          </motion.h2>
          {section.subtitle && (
            <motion.p variants={fadeUp} transition={smoothTransition} className="section-copy mt-5">
              {section.subtitle}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item, index) => {
            const accentGradient = getStableGradient(item.title, index);

            return (
              <motion.article
                key={item.id || `${item.title}-${index}`}
                variants={fadeUp}
                whileHover={cardHover}
                whileTap={cardTap}
                className="quiet-card elevated-card flex flex-col p-6"
              >
                <div className={`mb-6 h-1.5 w-20 rounded-full bg-gradient-to-r ${accentGradient}`} />

                {item.date && (
                  <span className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {item.date}
                  </span>
                )}

                <h3 className="text-xl font-bold text-slate-950 dark:text-white">{item.title}</h3>

                {item.subtitle && (
                  <p className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {item.subtitle}
                  </p>
                )}

                {item.description && (
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                )}

                {item.link && (
                  <div className="mt-auto pt-5">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                    >
                      Learn more <FaExternalLinkAlt className="text-[10px]" />
                    </a>
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
