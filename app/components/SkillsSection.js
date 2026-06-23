'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFromStorage, STORAGE_KEYS } from '@/lib/storage';

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const loadSkills = () => {
      const data = getFromStorage(STORAGE_KEYS.SKILLS, []);
      setSkills(data);
    };

    loadSkills();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadSkills();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('skillsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('skillsUpdated', handleStorageChange);
    };
  }, []);

  return (
    <section id="skills" className="min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.2),transparent_50%)]"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v2h2v2h-2v2h2v2h-2v2h2v2H0v-2h20v-2H0v-2h20v-2H0v-2h20zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-12 md:mb-16 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent"
        >
          Skills
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id || index}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.3,
                ease: [0.34, 1.56, 0.64, 1]
              }}
              className={`bg-gradient-to-br ${skill.color} rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-default relative overflow-hidden group`}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
              />
              <motion.p 
                className="text-white text-center font-bold text-sm sm:text-base md:text-lg relative z-10"
                animate={{ 
                  textShadow: [
                    '0 0 0px rgba(255,255,255,0)',
                    '0 0 10px rgba(255,255,255,0.5)',
                    '0 0 0px rgba(255,255,255,0)'
                  ]
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: Infinity,
                  repeatDelay: 2,
                  delay: index * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {skill.name}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

