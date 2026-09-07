'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { fadeUp, smoothTransition, staggerContainer, viewportOnce } from './motionPresets';
import { getStableGradient } from './themePalette';

export default function TestimonialsSection({
  initialTestimonials = DEFAULT_DATA.testimonials,
  initialHeadings = DEFAULT_DATA.sectionHeadings.testimonials,
}) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [headings, setHeadings] = useState({
    ...DEFAULT_DATA.sectionHeadings.testimonials,
    ...initialHeadings,
  });

  useEffect(() => {
    const loadContent = () => {
      const stored = getFromStorage(STORAGE_KEYS.TESTIMONIALS, null);
      const storedHeadings = getFromStorage(STORAGE_KEYS.SECTION_HEADINGS, null);

      if (stored) setTestimonials(stored);
      if (storedHeadings?.testimonials) {
        setHeadings((prev) => ({ ...prev, ...storedHeadings.testimonials }));
      }
    };

    loadContent();
    window.addEventListener('testimonialsUpdated', loadContent);
    window.addEventListener('sectionHeadingsUpdated', loadContent);
    window.addEventListener('portfolioContentUpdated', loadContent);

    return () => {
      window.removeEventListener('testimonialsUpdated', loadContent);
      window.removeEventListener('sectionHeadingsUpdated', loadContent);
      window.removeEventListener('portfolioContentUpdated', loadContent);
    };
  }, []);

  const visibleTestimonials = (testimonials || [])
    .filter((t) => t.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (visibleTestimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section-frame">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp} transition={smoothTransition} className="mx-auto mb-5 eyebrow">
            {headings?.eyebrow || 'Testimonials'}
          </motion.div>
          <motion.h2 variants={fadeUp} transition={smoothTransition} className="section-title">
            {headings?.title || 'What People Say'}
          </motion.h2>
          <motion.p variants={fadeUp} transition={smoothTransition} className="section-copy mt-5">
            {headings?.subtitle || 'Feedback from collaborators, clients, and team members.'}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {visibleTestimonials.map((item, index) => {
            const accentGradient = getStableGradient(item.clientName, index);
            const initials = (item.clientName || 'Client')
              .split(' ')
              .map((n) => n[0])
              .filter(Boolean)
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <motion.article
                key={item.id || `${item.clientName}-${index}`}
                variants={fadeUp}
                transition={smoothTransition}
                className="quiet-card elevated-card flex flex-col p-6 hover:-translate-y-1"
              >
                <div className={`mb-6 h-1.5 w-20 rounded-full bg-gradient-to-r ${accentGradient}`} />
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xl text-blue-500/80 dark:text-blue-400/80">
                    <FaQuoteLeft />
                  </span>
                  {item.rating > 0 && (
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      {Array.from({ length: item.rating }).map((_, rIdx) => (
                        <FaStar key={rIdx} />
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-sm leading-7 text-slate-600 dark:text-slate-400 italic">
                  &ldquo;{item.content}&rdquo;
                </p>

                <div className="mt-auto flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.clientName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${accentGradient} text-xs font-bold text-white shadow-sm`}
                    >
                      {initials}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                      {item.clientName}
                    </h4>
                    {(item.position || item.company) && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {[item.position, item.company].filter(Boolean).join(' • ')}
                      </p>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
