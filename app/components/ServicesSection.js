'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaCode, FaLaptopCode, FaMobileAlt, FaRocket, FaServer } from 'react-icons/fa';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { fadeUp, smoothTransition, staggerContainer, viewportOnce, cardHover, cardTap } from './motionPresets';
import { getStableGradient } from './themePalette';

const serviceIcons = {
  FaCode,
  FaServer,
  FaLaptopCode,
  FaMobileAlt,
  FaRocket,
};

export default function ServicesSection({
  initialServices = DEFAULT_DATA.services,
  initialHeadings = DEFAULT_DATA.sectionHeadings.services,
}) {
  const [services, setServices] = useState(initialServices);
  const [headings, setHeadings] = useState({
    ...DEFAULT_DATA.sectionHeadings.services,
    ...initialHeadings,
  });

  useEffect(() => {
    const loadContent = () => {
      const stored = getFromStorage(STORAGE_KEYS.SERVICES, null);
      const storedHeadings = getFromStorage(STORAGE_KEYS.SECTION_HEADINGS, null);

      if (stored) setServices(stored);
      if (storedHeadings?.services) {
        setHeadings((prev) => ({ ...prev, ...storedHeadings.services }));
      }
    };

    loadContent();
    window.addEventListener('servicesUpdated', loadContent);
    window.addEventListener('sectionHeadingsUpdated', loadContent);
    window.addEventListener('portfolioContentUpdated', loadContent);

    return () => {
      window.removeEventListener('servicesUpdated', loadContent);
      window.removeEventListener('sectionHeadingsUpdated', loadContent);
      window.removeEventListener('portfolioContentUpdated', loadContent);
    };
  }, []);

  const visibleServices = (services || [])
    .filter((s) => s.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (visibleServices.length === 0) return null;

  return (
    <section id="services" className="section-frame">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp} transition={smoothTransition} className="mx-auto mb-5 eyebrow">
            {headings?.eyebrow || 'Services'}
          </motion.div>
          <motion.h2 variants={fadeUp} transition={smoothTransition} className="section-title">
            {headings?.title || 'What I Can Deliver'}
          </motion.h2>
          <motion.p variants={fadeUp} transition={smoothTransition} className="section-copy mt-5">
            {headings?.subtitle ||
              'Modern web development, high-performance APIs, and end-to-end full-stack solutions.'}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {visibleServices.map((service, index) => {
            const Icon = serviceIcons[service.icon] || FaCode;
            const accentGradient = getStableGradient(service.title, index);

            return (
              <motion.article
                key={service.id || `${service.title}-${index}`}
                variants={fadeUp}
                whileHover={cardHover}
                whileTap={cardTap}
                className="quiet-card elevated-card flex flex-col p-6"
              >
                <div className={`mb-6 h-1.5 w-20 rounded-full bg-gradient-to-r ${accentGradient}`} />
                <div className="icon-tile mb-5 h-12 w-12">
                  <Icon />
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {service.description}
                </p>

                {service.features && service.features.length > 0 && (
                  <ul className="mt-5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] text-emerald-500">
                          <FaCheck />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {service.ctaLabel && service.ctaUrl && (
                  <div className="mt-auto pt-6">
                    <a
                      href={service.ctaUrl}
                      className="btn-secondary w-full py-2 text-center text-xs font-bold"
                    >
                      {service.ctaLabel}
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
