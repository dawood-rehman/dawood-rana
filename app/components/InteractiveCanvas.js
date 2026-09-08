'use client';

import { useEffect, useRef, useState } from 'react';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';

export default function InteractiveCanvas({ initialConfig = DEFAULT_DATA.particleConfig }) {
  const canvasRef = useRef(null);
  const [config, setConfig] = useState({
    ...DEFAULT_DATA.particleConfig,
    ...(initialConfig || {}),
  });
  const [isDark, setIsDark] = useState(false);

  // Sync config from localStorage & event listener
  useEffect(() => {
    const checkDark = () => {
      if (typeof document !== 'undefined') {
        setIsDark(document.documentElement.classList.contains('dark'));
      }
    };
    checkDark();

    const loadConfig = () => {
      const saved = getFromStorage(STORAGE_KEYS.PARTICLE_CONFIG, null);
      if (saved) {
        setConfig((prev) => ({ ...prev, ...saved }));
      }
      checkDark();
    };

    loadConfig();

    const handleConfigUpdate = () => loadConfig();
    const handleThemeChanged = () => checkDark();

    window.addEventListener('particleConfigUpdated', handleConfigUpdate);
    window.addEventListener('theme-changed', handleThemeChanged);

    const observer = new MutationObserver(() => checkDark());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => {
      window.removeEventListener('particleConfigUpdated', handleConfigUpdate);
      window.removeEventListener('theme-changed', handleThemeChanged);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!config.enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let mouse = { x: -9999, y: -9999, radius: 130 };
    let isVisible = !document.hidden;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Palette generator based on theme
    const getColors = () => {
      const theme = config.colorTheme || 'auto';
      if (theme === 'cyan') {
        return {
          particle1: 'rgba(6, 182, 212, ', // cyan-500
          particle2: 'rgba(56, 189, 248, ', // sky-400
          line: '6, 182, 212',
        };
      }
      if (theme === 'purple') {
        return {
          particle1: 'rgba(168, 85, 247, ', // purple-500
          particle2: 'rgba(236, 72, 153, ', // pink-500
          line: '168, 85, 247',
        };
      }
      if (theme === 'emerald') {
        return {
          particle1: 'rgba(16, 185, 129, ', // emerald-500
          particle2: 'rgba(52, 211, 153, ', // emerald-400
          line: '16, 185, 129',
        };
      }
      if (theme === 'amber') {
        return {
          particle1: 'rgba(245, 158, 11, ', // amber-500
          particle2: 'rgba(251, 191, 36, ', // amber-400
          line: '245, 158, 11',
        };
      }
      // 'auto' mode adapts to dark / light
      if (isDark) {
        return {
          particle1: 'rgba(99, 102, 241, ', // indigo-500
          particle2: 'rgba(56, 189, 248, ', // sky-400
          line: '99, 102, 241',
        };
      }
      return {
        particle1: 'rgba(79, 70, 229, ', // indigo-600
        particle2: 'rgba(14, 165, 233, ', // sky-500
        line: '79, 70, 229',
      };
    };

    let colors = getColors();

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const width = window.innerWidth;
      const isMobile = width < 768;
      // Cap particle density on mobile to preserve battery & 60fps
      const baseCount = Math.max(10, Math.min(100, config.particleCount || 45));
      const effectiveCount = isMobile ? Math.min(baseCount, 22) : baseCount;

      for (let i = 0; i < effectiveCount; i++) {
        const size = Math.random() * 2 + 1;
        const speed = (config.speed || 0.8) * (prefersReducedMotion ? 0 : 0.6);
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: size,
          baseAlpha: Math.random() * 0.4 + (isDark ? 0.35 : 0.2),
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseVal: Math.random() * Math.PI,
          colorType: Math.random() > 0.4 ? 1 : 2,
        });
      }
    };

    const render = () => {
      if (!isVisible) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      // Draw connection lines between nearby particles
      if (config.connectLines) {
        const maxDist = width < 768 ? 85 : 125;
        const maxDistSq = maxDist * maxDist;

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
              const distance = Math.sqrt(distSq);
              const opacity = (1 - distance / maxDist) * (isDark ? 0.16 : 0.08);
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(${colors.line}, ${opacity})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }

      // Draw and update each particle
      particles.forEach((p) => {
        // Move particle
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Bounce off boundaries gently
          if (p.x < 0) {
            p.x = 0;
            p.vx *= -1;
          } else if (p.x > width) {
            p.x = width;
            p.vx *= -1;
          }

          if (p.y < 0) {
            p.y = 0;
            p.vy *= -1;
          } else if (p.y > height) {
            p.y = height;
            p.vy *= -1;
          }

          // Mouse interaction (repel gently and connect)
          if (config.interactive && mouse.x > 0 && mouse.y > 0) {
            const mdx = mouse.x - p.x;
            const mdy = mouse.y - p.y;
            const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mouseDist < mouse.radius) {
              const force = (1 - mouseDist / mouse.radius) * 1.5;
              p.x -= (mdx / mouseDist) * force;
              p.y -= (mdy / mouseDist) * force;

              // Draw subtle connection to cursor
              const cursorLineAlpha = (1 - mouseDist / mouse.radius) * (isDark ? 0.22 : 0.12);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(${colors.line}, ${cursorLineAlpha})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        // Pulse alpha
        p.pulseVal += p.pulseSpeed;
        const currentAlpha =
          p.baseAlpha + Math.sin(p.pulseVal) * (isDark ? 0.15 : 0.08);

        // Draw particle node
        const prefix = p.colorType === 1 ? colors.particle1 : colors.particle2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${prefix}${Math.max(0.05, Math.min(0.9, currentAlpha))})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // Event listeners
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    resizeCanvas();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config, isDark]);

  if (!config.enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full select-none"
    />
  );
}
