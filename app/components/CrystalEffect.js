'use client';

import { motion } from 'framer-motion';

export default function CrystalEffect({ children, className = '' }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Crystal shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%', skewX: -20 }}
        animate={{ x: '200%', skewX: -20 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
      />
      
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.3), transparent)',
            'radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.3), transparent)',
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3), transparent)',
            'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.3), transparent)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

