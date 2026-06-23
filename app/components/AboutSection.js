'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import TypingAnimation from './TypingAnimation';
import CrystalEffect from './CrystalEffect';

export default function AboutSection() {
  const [borderColor, setBorderColor] = useState('#3b82f6');
  const [imageError, setImageError] = useState(false);
  const [customImage, setCustomImage] = useState('');

  useEffect(() => {
    const colors = [
      '#3b82f6', // blue
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#f59e0b', // amber
      '#10b981', // green
      '#ef4444', // red
      '#06b6d4', // cyan
      '#f97316', // orange
    ];

    const interval = setInterval(() => {
      setBorderColor(colors[Math.floor(Math.random() * colors.length)]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load custom profile picture from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem('cms_profilePicture');
    if (savedImage) {
      setCustomImage(savedImage);
    }
  }, []);

  return (
    <section id="about" className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.2),transparent_50%)]"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="mb-8 flex justify-center">
            <motion.div
              className="relative"
            >
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: borderColor,
                  opacity: 0.5,
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: borderColor,
                  opacity: 0.3,
                }}
              />
              <div
                className="w-48 h-48 rounded-full p-2 transition-all duration-1000 relative z-10"
                style={{
                  border: `4px solid ${borderColor}`,
                  boxShadow: `0 0 30px ${borderColor}, 0 0 60px ${borderColor}`,
                }}
              >
                <motion.div 
                  className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-800 overflow-hidden flex items-center justify-center"
                >
                  {customImage ? (
                    <motion.img
                      src={customImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : !imageError ? (
                    <motion.img
                      src="https://media-mct1-1.cdn.whatsapp.net/v/t61.24694-24/534417144_829629556262347_5461019414251980250_n.jpg?ccb=11-4&oh=01_Q5Aa3AGW9UgBUOQqwQq0MwU291D32BOhAnyaAN04LC65cBL1TA&oe=692EB927&_nc_sid=5e03e0&_nc_cat=109"
                      alt="Dawood Rehman"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="text-white text-4xl font-bold">
                      DR
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: 0.05, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent min-h-[4rem] flex items-center justify-center"
          >
            <TypingAnimation text="Dawood Rehman" className="bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-xl md:text-2xl text-slate-200 dark:text-slate-300 max-w-3xl mx-auto mb-8"
          >
            Computer Science Student | Full-Stack Developer | Tech Enthusiast
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className="max-w-4xl mx-auto mt-8"
          >
            <CrystalEffect className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
              <p className="text-lg text-slate-200 dark:text-slate-300 leading-relaxed relative z-10">
                I'm deeply passionate about the technology industry and constantly driven to explore the latest innovations. 
                From building scalable web applications to diving into emerging technologies, I thrive on solving complex 
                problems and creating digital solutions that make a real impact. My journey in tech is fueled by curiosity, 
                continuous learning, and the excitement of turning ideas into reality through code.
              </p>
            </CrystalEffect>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

