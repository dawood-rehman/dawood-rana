'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaSchool, FaUniversity } from 'react-icons/fa';
import { getFromStorage, STORAGE_KEYS } from '@/lib/storage';

export default function EducationSection() {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    const loadEducation = () => {
      const data = getFromStorage(STORAGE_KEYS.EDUCATION, []);
      setEducation(data);
    };

    loadEducation();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadEducation();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('educationUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('educationUpdated', handleStorageChange);
    };
  }, []);

  const getIcon = (iconName) => {
    const icons = {
      FaSchool,
      FaGraduationCap,
      FaUniversity,
    };
    return icons[iconName] || FaGraduationCap;
  };

  return (
    <section id="education" className="min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 relative overflow-hidden">
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
          transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.35 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-12 md:mb-16 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent"
        >
          Education
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id || index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.35, delay: index * 0.15 }}
              whileHover={{ scale: 1.05, y: -8, transition: { type: 'spring', stiffness: 300, damping: 25 } }}
              className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 dark:border-gray-700/50"
            >
              <motion.div 
                className={`w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gradient-to-br ${edu.color} flex items-center justify-center mb-4 sm:mb-6 mx-auto relative overflow-hidden`}
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.35 }}
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
                {getIcon(edu.icon) && getIcon(edu.icon)({ className: "text-white text-lg sm:text-2xl relative z-10" })}
              </motion.div>
              <motion.h3 
                className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-1 sm:mb-2 text-white dark:text-gray-100"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {edu.title}
              </motion.h3>
              <motion.p 
                className="text-sm sm:text-base md:text-lg text-center mb-1 sm:mb-2 text-gray-200 dark:text-gray-300 font-semibold"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.02 }}
              >
                {edu.institution}
              </motion.p>
              <motion.p 
                className="text-xs sm:text-sm text-center text-gray-300 dark:text-gray-400"
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

