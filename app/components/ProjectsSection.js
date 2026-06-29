'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaExternalLinkAlt, FaGithub, FaServer } from 'react-icons/fa';
import { getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { fadeUp, quickTransition, smoothTransition, staggerContainer, viewportOnce } from './motionPresets';
import { getStableGradient } from './themePalette';

const icons = {
  FaCode,
  FaServer,
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = () => {
      setProjects(getFromStorage(STORAGE_KEYS.PROJECTS, []));
    };

    loadProjects();
    window.addEventListener('storage', loadProjects);
    window.addEventListener('projectsUpdated', loadProjects);
    window.addEventListener('portfolioContentUpdated', loadProjects);

    return () => {
      window.removeEventListener('storage', loadProjects);
      window.removeEventListener('projectsUpdated', loadProjects);
      window.removeEventListener('portfolioContentUpdated', loadProjects);
    };
  }, []);

  return (
    <section id="projects" className="section-frame">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-3xl">
            <motion.div variants={fadeUp} transition={smoothTransition} className="mb-5 eyebrow">
              Selected Work
            </motion.div>
            <motion.h2 variants={fadeUp} transition={smoothTransition} className="section-title">
              Projects With Real Product Shape
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} transition={smoothTransition} className="section-copy max-w-md md:text-right">
            A focused set of apps showing frontend craft, API integration, and database-backed workflows.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-10 grid gap-5 md:grid-cols-2"
        >
          {projects.length === 0 ? (
            <div className="quiet-card p-8 text-center text-slate-500 dark:text-slate-400 md:col-span-2">
              No projects available yet.
            </div>
          ) : (
            projects.map((project, index) => {
              const Icon = icons[project.icon] || FaCode;
              const accentGradient = getStableGradient(project.title, index);

              return (
                <motion.article
                  key={project.id || project.title}
                  variants={fadeUp}
                  transition={smoothTransition}
                  className="quiet-card elevated-card group flex h-full min-h-[320px] flex-col overflow-hidden p-6 hover:-translate-y-1"
                >
                  <div className={`mb-6 h-1.5 w-24 rounded-full bg-gradient-to-r ${accentGradient}`} />

                  <div className="flex items-start gap-4">
                    <div className="icon-tile h-12 w-12 flex-shrink-0">
                      <Icon />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-950 dark:text-white">{project.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {project.tech?.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileTap={{ scale: 0.98 }}
                        transition={quickTransition}
                        className="btn-secondary focus-ring gap-2 px-4 py-2.5 text-sm"
                      >
                        <FaGithub /> Code
                      </motion.a>
                    )}
                    {project.live && (
                      <motion.a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileTap={{ scale: 0.98 }}
                        transition={quickTransition}
                        className="btn-primary focus-ring gap-2 px-4 py-2.5 text-sm"
                      >
                        <FaExternalLinkAlt /> Live
                      </motion.a>
                    )}
                  </div>
                </motion.article>
              );
            })
          )}
        </motion.div>
      </div>
    </section>
  );
}
