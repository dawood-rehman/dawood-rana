'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode, FaServer } from 'react-icons/fa';

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with payment integration, user authentication, and admin dashboard.',
    tech: ['Next.js', 'MongoDB', 'Redux'],
    github: 'https://github.com/saabra926/stoehub',
    live: 'https://stoehub.vercel.app/',
    gradient: 'from-blue-500 to-cyan-500',
    icon: FaCode,
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates and team collaboration features.',
    tech: ['TypeScript', 'Next.js', 'REST API'],
    github: 'https://github.com/saabra926/project2',
    live: 'https://task-app-one-ivory.vercel.app',
    gradient: 'from-purple-500 to-pink-500',
    icon: FaServer,
  },
  {
    title: 'Post Data Dashboard',
    description: 'Analytics dashboard for social media management with data visualization and reporting tools.',
    tech: ['React', 'REST API', 'MongoDB'],
    github: 'https://github.com/saabra926/post-data',
    live: 'https://post-data-bice.vercel.app/',
    gradient: 'from-orange-500 to-red-500',
    icon: FaCode,
  },
  {
    title: 'Weather Forecast App',
    description: 'Real-time weather forecasting application with location-based services and beautiful UI.',
    tech: ['JavaScript', 'API Integration', 'CSS3', 'HTML5'],
    github: 'https://github.com/saabra926/earning',
    live: 'https://www.exploreweather.site/',
    gradient: 'from-green-500 to-emerald-500',
    icon: FaCode,
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-gray-950 dark:to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(219,39,119,0.2),transparent_50%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent"
          >
            My Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 dark:text-gray-400 max-w-3xl mx-auto"
          >
            Exploring innovative solutions through code and creativity
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative"
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${project.gradient} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`}></div>
              <div className="relative bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 dark:border-gray-600/30 shadow-2xl h-full">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <project.icon className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white dark:text-gray-100">
                  {project.title}
                </h3>
                <p className="text-gray-300 dark:text-gray-400 mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-gray-700/50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-400 rounded-full text-sm border border-gray-600/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 dark:bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors border border-gray-600/50"
                  >
                    <FaGithub /> Code
                  </motion.a>
                  <motion.a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${project.gradient} text-white rounded-lg shadow-lg hover:shadow-xl transition-all`}
                  >
                    <FaExternalLinkAlt /> Live Demo
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

