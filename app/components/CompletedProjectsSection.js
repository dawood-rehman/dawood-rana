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
    <section id="completed-projects" className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 dark:from-gray-950 dark:via-emerald-950 dark:to-teal-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.2),transparent_50%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <div className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-2xl border border-white/20`}>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-200 text-sm md:text-base">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section Header */}
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
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Completed Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Delivering excellence, one project at a time
          </motion.p>
        </motion.div>

        {/* Projects with Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {completedProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group relative"
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${project.gradient} rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500`}></div>
              <div className="relative bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 dark:border-gray-600/30 shadow-2xl h-full flex flex-col">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <FaUser className="text-white text-2xl" />
                </div>
                
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white dark:text-gray-100 mb-2">
                    {project.projectName}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{project.client}</p>
                  <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(project.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-700/50">
                  <FaQuoteLeft className="text-gray-500 mb-3" />
                  <p className="text-gray-300 dark:text-gray-400 text-sm italic mb-4">
                    "{project.testimonial}"
                  </p>
                  <div>
                    <p className="text-white dark:text-gray-200 font-semibold text-sm">
                      {project.clientName}
                    </p>
                    <p className="text-gray-400 text-xs">{project.clientRole}</p>
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

