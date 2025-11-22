'use client';

import { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import { useDraggable } from './useDraggable';

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);
  const { elementRef, position } = useDraggable();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isVisible) return null;

  // Calculate initial position based on screen size
  const getInitialPosition = () => {
    if (typeof window === 'undefined') return { left: '1rem', bottom: '5rem', right: 'auto' };
    if (window.innerWidth > 768) {
      return { right: '1.5rem', bottom: '6rem', left: 'auto' };
    }
    return { left: '1rem', bottom: '5rem', right: 'auto' };
  };

  const initialPos = getInitialPosition();
  const hasBeenDragged = position !== null;

  return (
    <div
      ref={elementRef}
      className="fixed z-50 cursor-move"
      style={{
        ...(hasBeenDragged
          ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
              right: 'auto',
              bottom: 'auto',
            }
          : initialPos),
      }}
    >
      <div className="clock-handle bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 dark:from-purple-800 dark:via-blue-800 dark:to-cyan-700 rounded-2xl p-4 shadow-2xl backdrop-blur-sm border border-white/20">
        <div className="flex items-center gap-2 mb-2">
          <FaClock className="text-white text-sm" />
          <button
            onClick={() => setIsVisible(false)}
            className="ml-auto text-white/80 hover:text-white text-xs"
          >
            ×
          </button>
        </div>
        <div className="text-white font-mono">
          <div className="text-2xl font-bold tracking-wider">
            {formatTime(time)}
          </div>
          <div className="text-xs mt-1 opacity-90">
            {formatDate(time)}
          </div>
        </div>
      </div>
    </div>
  );
}

