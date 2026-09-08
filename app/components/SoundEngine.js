'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import {
  playClickSound,
  playModalSound,
  playThemeSound,
} from '@/lib/soundManager';

export default function SoundEngine({ initialConfig = DEFAULT_DATA.soundConfig }) {
  const [config, setConfig] = useState({
    ...DEFAULT_DATA.soundConfig,
    ...(initialConfig || {}),
  });

  useEffect(() => {
    const loadConfig = () => {
      const saved = getFromStorage(STORAGE_KEYS.SOUND_CONFIG, null);
      if (saved) {
        setConfig((prev) => ({ ...prev, ...saved }));
      }
    };

    loadConfig();

    const handleUpdate = () => loadConfig();
    window.addEventListener('soundConfigUpdated', handleUpdate);

    // Listen for custom play-ui-sound events
    const handlePlaySound = (event) => {
      const detail = event?.detail;
      if (!detail) return;

      if (detail.type === 'theme') {
        playThemeSound(detail.isDark, detail.isTest);
      } else if (detail.type === 'click') {
        playClickSound(detail.isTest);
      } else if (detail.type === 'modal') {
        playModalSound(detail.isOpen, detail.isTest);
      }
    };

    window.addEventListener('play-ui-sound', handlePlaySound);

    // Warm up audio context on first user interaction to comply with autoplay policy
    const warmUpAudio = () => {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          const dummy = new AudioCtx();
          if (dummy.state === 'suspended') dummy.resume();
          dummy.close();
        } catch (_) {}
      }
      window.removeEventListener('click', warmUpAudio);
      window.removeEventListener('keydown', warmUpAudio);
      window.removeEventListener('touchstart', warmUpAudio);
    };

    window.addEventListener('click', warmUpAudio, { once: true, passive: true });
    window.addEventListener('keydown', warmUpAudio, { once: true, passive: true });
    window.addEventListener('touchstart', warmUpAudio, { once: true, passive: true });

    return () => {
      window.removeEventListener('soundConfigUpdated', handleUpdate);
      window.removeEventListener('play-ui-sound', handlePlaySound);
      window.removeEventListener('click', warmUpAudio);
      window.removeEventListener('keydown', warmUpAudio);
      window.removeEventListener('touchstart', warmUpAudio);
    };
  }, []);

  // Invisible helper component
  return null;
}
