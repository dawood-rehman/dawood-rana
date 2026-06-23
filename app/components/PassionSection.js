'use client';

import { motion } from 'framer-motion';
import { FaCode, FaRocket, FaLightbulb, FaBrain } from 'react-icons/fa';
import CrystalEffect from './CrystalEffect';

const passions = [
  {
    icon: FaCode,
    title: 'Full-Stack Development',
    description: 'Passionate about building scalable web applications using modern technologies and best practices.',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
  },
  {
    icon: FaRocket,
    title: 'Innovation & Technology',
    description: 'Fascinated by emerging technologies and their potential to transform industries and improve lives.',
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
  },
  {
    icon: FaLightbulb,
    title: 'Problem Solving',
    description: 'Love tackling complex challenges and finding elegant solutions through creative thinking.',
    gradient: 'from-yellow-500 via-orange-500 to-red-500',
  },
  {
    icon: FaBrain,
    title: 'Continuous Learning',
    description: 'Always eager to learn new technologies, frameworks, and methodologies to stay ahead in the tech industry.',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
  },
];

export default function PassionSection() {
  return (
    <section id="passion" className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 opacity-90">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            My Passion for Tech
          </motion.h2>
            <CrystalEffect className="text-xl md:text-2xl text-slate-200 dark:text-slate-300 max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            >
              Driven by curiosity and innovation, I'm passionate about creating digital solutions that make a difference.
            </motion.p>
          </CrystalEffect>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {passions.map((passion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 rounded-3xl"
                style={{
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                }}
              >
                <div className={`bg-gradient-to-br ${passion.gradient} w-full h-full rounded-3xl`}></div>
              </div>
              <CrystalEffect className="relative bg-white/10 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl overflow-hidden">
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${passion.gradient} flex items-center justify-center mb-6 shadow-lg`}
                  transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                >
                  <passion.icon className="text-white text-2xl" />
                </motion.div>
                <motion.h3 
                  className="text-2xl font-bold mb-4 text-white dark:text-slate-100"
                  transition={{ duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
                >
                  {passion.title}
                </motion.h3>
                <motion.p 
                  className="text-slate-200 dark:text-slate-300 leading-relaxed"
                >
                  {passion.description}
                </motion.p>
              </CrystalEffect>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-[2px] rounded-full">
            <div className="bg-slate-900 dark:bg-slate-800 rounded-full px-8 py-4">
              <p className="text-lg text-slate-200 dark:text-slate-300">
                "Technology is best when it brings people together." - Matt Mullenweg
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

