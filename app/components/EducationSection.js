'use client';

import { motion } from 'framer-motion';
import { FaGraduationCap, FaSchool, FaUniversity } from 'react-icons/fa';

const education = [
  {
    icon: FaSchool,
    title: 'High School',
    institution: 'Government MC High School',
    stream: 'Science Stream',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FaGraduationCap,
    title: 'Higher Secondary',
    institution: 'Government MC Higher Secondary School',
    stream: 'Pre-Medical',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FaUniversity,
    title: 'Bachelor\'s Degree',
    institution: 'Government College University Faisalabad',
    stream: 'Computer Science',
    color: 'from-orange-500 to-red-500',
  },
];

export default function EducationSection() {
  return (
    <section id="education" className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Enhanced background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 dark:from-gray-950 dark:via-violet-950 dark:to-purple-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent"
        >
          Education
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 dark:border-gray-700/50"
            >
              <motion.div 
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${edu.color} flex items-center justify-center mb-6 mx-auto relative overflow-hidden`}
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6, type: 'spring' }}
              >
                {/* Rotating gradient ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    background: [
                      `conic-gradient(from 0deg, transparent, ${edu.color.includes('blue') ? 'rgba(59,130,246,0.5)' : edu.color.includes('purple') ? 'rgba(139,92,246,0.5)' : 'rgba(249,115,22,0.5)'}, transparent)`,
                      `conic-gradient(from 360deg, transparent, ${edu.color.includes('blue') ? 'rgba(59,130,246,0.5)' : edu.color.includes('purple') ? 'rgba(139,92,246,0.5)' : 'rgba(249,115,22,0.5)'}, transparent)`,
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <edu.icon className="text-white text-2xl relative z-10" />
              </motion.div>
              <motion.h3 
                className="text-2xl font-bold text-center mb-2 text-white dark:text-gray-100"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {edu.title}
              </motion.h3>
              <motion.p 
                className="text-lg text-center mb-2 text-gray-200 dark:text-gray-300 font-semibold"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.02 }}
              >
                {edu.institution}
              </motion.p>
              <motion.p 
                className="text-center text-gray-300 dark:text-gray-400"
                whileHover={{ scale: 1.05 }}
              >
                {edu.stream}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

