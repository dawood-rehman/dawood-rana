'use client';

import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaUser } from 'react-icons/fa';

const completedProjects = [
  {
    projectName: 'E-Commerce Platform',
    client: 'Tech Solutions Inc.',
    description: 'Complete website redesign with modern UI/UX, improved performance, and mobile responsiveness.',
    rating: 5,
    testimonial: 'Dawood delivered an exceptional website that exceeded our expectations. Professional, timely, and innovative!',
    clientName: 'John Smith',
    clientRole: 'CEO, Tech Solutions Inc.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    projectName: 'E-Learning Platform',
    client: 'EduTech Academy',
    description: 'Built a comprehensive e-learning platform with video streaming, quizzes, and progress tracking.',
    rating: 5,
    testimonial: 'The platform is user-friendly and robust. Our students love it! Great work on the implementation.',
    clientName: 'Sarah Johnson',
    clientRole: 'Director, EduTech Academy',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    projectName: 'Weather Forecast App',
    client: 'Fine Dining Restaurant',
    description: 'Created a modern Weather Forecast App with real-time weather updates, location-based forecasting.',
    rating: 5,
    testimonial: 'This system has streamlined our operations significantly. Highly recommend Dawood for any tech project!',
    clientName: 'Michael Chen',
    clientRole: 'Owner, Fine Dining Restaurant',
    gradient: 'from-orange-500 to-red-600',
  },
];

const stats = [
  { number: '10+', label: 'Projects Completed', gradient: 'from-cyan-500 to-blue-500' },
  { number: '5+', label: 'Happy Clients', gradient: 'from-purple-500 to-pink-500' },
  { number: '100%', label: 'Client Satisfaction', gradient: 'from-green-500 to-emerald-500' },
  { number: '1+', label: 'Years Experience', gradient: 'from-orange-500 to-red-500' },
];

export default function CompletedProjectsSection() {
  return (
    <section id="completed-projects" className="min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.2),transparent_50%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.35 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12 sm:mb-16 md:mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-center"
            >
              <div className={`bg-gradient-to-br ${stat.gradient} p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-white/20`}>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-slate-200 text-xs sm:text-sm md:text-base font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center mb-10 sm:mb-12 md:mb-16 px-2"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Completed Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-200 dark:text-slate-300 max-w-3xl mx-auto"
          >
            Delivering excellence, one project at a time
          </motion.p>
        </motion.div>

        {/* Projects with Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {completedProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
              className="group relative"
            >
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${project.gradient} rounded-2xl sm:rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-all duration-300`}
              ></div>
              <div className="relative bg-slate-800/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-slate-700/50 dark:border-slate-600/30 shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
                <div className={`w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-lg sm:rounded-2xl bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-4 sm:mb-6 shadow-md`}>
                  <FaUser className="text-white text-lg sm:text-xl md:text-2xl" />
                </div>
                
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white dark:text-slate-100 mb-2">
                    {project.projectName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mb-2 sm:mb-3">{project.client}</p>
                  <p className="text-slate-300 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="flex gap-1 mb-4 sm:mb-5">
                  {[...Array(project.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xs sm:text-sm" />
                  ))}
                </div>

                <div className="mt-auto pt-3 sm:pt-4 md:pt-5 border-t border-slate-700/50">
                  <FaQuoteLeft className="text-slate-500 mb-2 sm:mb-3 text-sm sm:text-base" />
                  <p className="text-slate-300 dark:text-slate-400 text-xs sm:text-sm italic mb-3 sm:mb-4 leading-relaxed">
                    "{project.testimonial}"
                  </p>
                  <div>
                    <p className="text-white dark:text-slate-200 font-semibold text-xs sm:text-sm">
                      {project.clientName}
                    </p>
                    <p className="text-slate-400 text-[10px] sm:text-xs">{project.clientRole}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

