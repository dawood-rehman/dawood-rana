'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode, FaServer } from 'react-icons/fa';
import { getFromStorage, STORAGE_KEYS } from '@/lib/storage';

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = () => {
      const data = getFromStorage(STORAGE_KEYS.PROJECTS, []);
      setProjects(data);
    };

    loadProjects();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadProjects();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom events from admin panel
    window.addEventListener('projectsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('projectsUpdated', handleStorageChange);
    };
  }, []);

  const getIcon = (iconName) => {
    const icons = {
      FaCode: FaCode,
      FaServer: FaServer,
    };
    return icons[iconName] || FaCode;
  };

  return (
    <section id="projects" className="min-h-screen flex items-center justify-center py-16 sm:py-20 px-3 sm:px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-gray-950 dark:to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(219,39,119,0.2),transparent_50%)]"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent"
          >
            My Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 dark:text-gray-400 max-w-3xl mx-auto px-2"
          >
            Exploring innovative solutions through code and creativity
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id || index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative"
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${project.gradient} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500 group-hover:duration-200`}></div>
              <div className="relative bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-700/50 dark:border-gray-600/30 shadow-2xl h-full hover:shadow-xl transition-shadow">
                <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-4 sm:mb-6 shadow-lg`}>
                  {getIcon(project.icon) && getIcon(project.icon)({ className: "text-white text-lg sm:text-xl" })}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white dark:text-gray-100">
                  {project.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  {project.tech && project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 sm:px-3 py-1 bg-gray-700/50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-400 rounded-full text-xs sm:text-sm border border-gray-600/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {project.github && (
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-700/50 dark:bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors border border-gray-600/50 text-sm sm:text-base"
                    >
                      <FaGithub /> Code
                    </motion.a>
                  )}
                  {project.live && (
                    <motion.a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r ${project.gradient} text-white rounded-lg shadow-lg hover:shadow-xl transition-all text-sm sm:text-base`}
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

