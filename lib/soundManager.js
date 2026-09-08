import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from './storage';

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

export function getCurrentSoundConfig() {
  if (typeof window === 'undefined') return DEFAULT_DATA.soundConfig;
  return getFromStorage(STORAGE_KEYS.SOUND_CONFIG, DEFAULT_DATA.soundConfig);
}

/**
 * Play synthesized theme toggle sound
 * @param {boolean} isDark - Target theme is dark
 * @param {boolean} isTest - If true, ignores feature toggle
 */
export function playThemeSound(isDark, isTest = false) {
  const config = getCurrentSoundConfig();
  if (!isTest && (!config.enabled || !config.enableThemeToggle)) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const baseVol = Math.max(0, Math.min(1, config.volume ?? 0.2)) * 0.4;
  const now = ctx.currentTime;
  const theme = config.soundTheme || 'modern';

  const oscType = theme === 'subtle' ? 'triangle' : 'sine';

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = oscType;

  if (isDark) {
    // Settling warm tone for dark mode: 659Hz (E5) -> 440Hz (A4)
    osc.frequency.setValueAtTime(659, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.14);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(baseVol, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  } else {
    // Rising crisp chime for light mode: 523Hz (C5) -> 784Hz (G5)
    osc.frequency.setValueAtTime(523, now);
    osc.frequency.exponentialRampToValueAtTime(784, now + 0.12);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(baseVol, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }
}

/**
 * Play subtle micro-click tactile sound
 * @param {boolean} isTest - If true, ignores feature toggle
 */
export function playClickSound(isTest = false) {
  const config = getCurrentSoundConfig();
  if (!isTest && (!config.enabled || !config.enableButtonClicks)) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const baseVol = Math.max(0, Math.min(1, config.volume ?? 0.2)) * 0.35;
  const now = ctx.currentTime;
  const theme = config.soundTheme || 'modern';

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = theme === 'subtle' ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(900, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(baseVol, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.045);
}

/**
 * Play modal popup chime / close sound
 * @param {boolean} isOpen - true if modal opened, false if closed
 * @param {boolean} isTest - If true, ignores feature toggle
 */
export function playModalSound(isOpen, isTest = false) {
  const config = getCurrentSoundConfig();
  if (!isTest && (!config.enabled || !config.enableModals)) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const baseVol = Math.max(0, Math.min(1, config.volume ?? 0.2)) * 0.3;
  const now = ctx.currentTime;

  if (isOpen) {
    // Dual harmonic chime chord (440Hz + 659Hz)
    [440, 659].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(baseVol * 0.6, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.24);
    });
  } else {
    // Soft descending dismiss tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(261, now + 0.12);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(baseVol * 0.5, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }
}
