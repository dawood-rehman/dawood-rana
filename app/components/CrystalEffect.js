'use client';

import { motion } from 'framer-motion';

export default function CrystalEffect({ children, className = '' }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Crystal shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
        initial={{ x: '-100%', skewX: -20 }}
        animate={{ x: '200%', skewX: -20 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatDelay: 3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />
      
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.2), transparent)',
            'radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.2), transparent)',
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2), transparent)',
            'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.2), transparent)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

