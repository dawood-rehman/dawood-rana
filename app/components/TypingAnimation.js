'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TypingAnimation({ text, className = '', speed = 100 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [displayedText, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.2, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-0.5 h-full bg-current ml-1"
        >
          |
        </motion.span>
      )}
    </span>
  );
}

