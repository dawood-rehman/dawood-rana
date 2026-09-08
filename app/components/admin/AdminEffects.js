'use client';

import { useState, useEffect } from 'react';
import {
  FaMagic,
  FaVolumeUp,
  FaVolumeMute,
  FaPlay,
  FaSave,
  FaUndo,
  FaSlidersH,
  FaSun,
  FaMoon,
  FaMousePointer,
  FaWindowRestore,
} from 'react-icons/fa';
import {
  getFromStorage,
  saveContentSection,
  STORAGE_KEYS,
  DEFAULT_DATA,
} from '@/lib/storage';
import {
  playClickSound,
  playModalSound,
  playThemeSound,
} from '@/lib/soundManager';
import toast from 'react-hot-toast';

export default function AdminEffects() {
  const [particles, setParticles] = useState(DEFAULT_DATA.particleConfig);
  const [sound, setSound] = useState(DEFAULT_DATA.soundConfig);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedParticles = getFromStorage(
      STORAGE_KEYS.PARTICLE_CONFIG,
      DEFAULT_DATA.particleConfig
    );
    if (savedParticles) {
      setParticles({ ...DEFAULT_DATA.particleConfig, ...savedParticles });
    }

    const savedSound = getFromStorage(
      STORAGE_KEYS.SOUND_CONFIG,
      DEFAULT_DATA.soundConfig
    );
    if (savedSound) {
      setSound({ ...DEFAULT_DATA.soundConfig, ...savedSound });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await Promise.all([
        saveContentSection('particleConfig', particles),
        saveContentSection('soundConfig', sound),
      ]);
      toast.success('Effects & Audio settings saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save effects and audio settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all particle and audio settings to default?')) {
      setParticles(DEFAULT_DATA.particleConfig);
      setSound(DEFAULT_DATA.soundConfig);
      toast.success('Settings reset to default values. Click Save to persist.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg">
            <FaMagic />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              Visual Effects & Sound Cues
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Customize the ambient 60fps mesh particle canvas background and professional Web Audio API sound cues. Everything is dynamically configurable and can be toggled on or off instantly.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ================= PARTICLE CANVAS SETTINGS ================= */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <FaSlidersH className="text-indigo-400" />
              <h3 className="text-lg font-bold text-white">
                Interactive Mesh Particle Canvas
              </h3>
            </div>
            {/* Master Toggle */}
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={particles.enabled}
                onChange={(e) =>
                  setParticles({ ...particles, enabled: e.target.checked })
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              <span className="ml-3 text-sm font-semibold text-slate-200">
                {particles.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className={`space-y-4 transition-opacity ${particles.enabled ? 'opacity-100' : 'pointer-events-none opacity-40'}`}>
            {/* Particle Density Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Particle Density (Count)
                </label>
                <span className="rounded bg-slate-700 px-2 py-0.5 text-xs font-mono font-bold text-indigo-300">
                  {particles.particleCount} particles
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={particles.particleCount}
                onChange={(e) =>
                  setParticles({
                    ...particles,
                    particleCount: parseInt(e.target.value, 10),
                  })
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-xs text-slate-400 mt-1">
                Controls ambient dots on screen. Automatically scaled on mobile devices for smooth 60fps performance.
              </p>
            </div>

            {/* Particle Speed Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Motion Speed
                </label>
                <span className="rounded bg-slate-700 px-2 py-0.5 text-xs font-mono font-bold text-indigo-300">
                  {particles.speed}x
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={particles.speed}
                onChange={(e) =>
                  setParticles({
                    ...particles,
                    speed: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-xs text-slate-400 mt-1">
                Float velocity of particles. Paused automatically when visitor switches tabs or prefers reduced motion.
              </p>
            </div>

            {/* Color Theme Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Color Palette Theme
              </label>
              <select
                value={particles.colorTheme || 'auto'}
                onChange={(e) =>
                  setParticles({ ...particles, colorTheme: e.target.value })
                }
                className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="auto">Auto (Theme Adaptive: Cyan/Indigo Dark, Slate/Indigo Light)</option>
                <option value="cyan">Vibrant Cyan & Sky Blue</option>
                <option value="purple">Cosmic Purple & Pink</option>
                <option value="emerald">Emerald & Mint Green</option>
                <option value="amber">Warm Amber & Gold</option>
              </select>
            </div>

            {/* Toggles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Connect Lines */}
              <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/40 p-3 cursor-pointer hover:bg-slate-700/70 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-white">Constellation Web Lines</p>
                  <p className="text-xs text-slate-400">Connects nearby particles with glowing lines</p>
                </div>
                <input
                  type="checkbox"
                  checked={particles.connectLines}
                  onChange={(e) =>
                    setParticles({ ...particles, connectLines: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-500 text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              {/* Cursor Interaction */}
              <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/40 p-3 cursor-pointer hover:bg-slate-700/70 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-white">Cursor / Touch Proximity</p>
                  <p className="text-xs text-slate-400">Particles react and connect to mouse position</p>
                </div>
                <input
                  type="checkbox"
                  checked={particles.interactive}
                  onChange={(e) =>
                    setParticles({ ...particles, interactive: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-500 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ================= SOUND SETTINGS ================= */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <FaVolumeUp className="text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Professional UI Sound Effects
              </h3>
            </div>
            {/* Master Toggle */}
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={sound.enabled}
                onChange={(e) =>
                  setSound({ ...sound, enabled: e.target.checked })
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              <span className="ml-3 text-sm font-semibold text-slate-200">
                {sound.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className={`space-y-4 transition-opacity ${sound.enabled ? 'opacity-100' : 'pointer-events-none opacity-40'}`}>
            {/* Volume Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Master Sound Volume
                </label>
                <span className="rounded bg-slate-700 px-2 py-0.5 text-xs font-mono font-bold text-emerald-300">
                  {Math.round((sound.volume ?? 0.2) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={sound.volume ?? 0.2}
                onChange={(e) =>
                  setSound({
                    ...sound,
                    volume: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-xs text-slate-400 mt-1">
                Zero external audio downloads. Audio is generated in real-time via the Web Audio API at velvety, non-fatiguing amplitudes.
              </p>
            </div>

            {/* Sound Preset Theme */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Acoustic Tone Style
              </label>
              <select
                value={sound.soundTheme || 'modern'}
                onChange={(e) =>
                  setSound({ ...sound, soundTheme: e.target.value })
                }
                className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="modern">Modern Crystal (Velvety Sine Harmonizers)</option>
                <option value="subtle">Subtle Haptic (Gentle Triangle Micro-cues)</option>
              </select>
            </div>

            {/* Specific Feature Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/40 p-3 cursor-pointer hover:bg-slate-700/70 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-white">Theme Switch</p>
                  <p className="text-xs text-slate-400">Dawn / dusk chimes</p>
                </div>
                <input
                  type="checkbox"
                  checked={sound.enableThemeToggle}
                  onChange={(e) =>
                    setSound({ ...sound, enableThemeToggle: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-500 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/40 p-3 cursor-pointer hover:bg-slate-700/70 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-white">Button Clicks</p>
                  <p className="text-xs text-slate-400">Tactile micro-tick</p>
                </div>
                <input
                  type="checkbox"
                  checked={sound.enableButtonClicks}
                  onChange={(e) =>
                    setSound({ ...sound, enableButtonClicks: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-500 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/40 p-3 cursor-pointer hover:bg-slate-700/70 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-white">Modal Popups</p>
                  <p className="text-xs text-slate-400">Harmonic modal chord</p>
                </div>
                <input
                  type="checkbox"
                  checked={sound.enableModals}
                  onChange={(e) =>
                    setSound({ ...sound, enableModals: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-500 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>

            {/* Live Audio Preview Tests */}
            <div className="mt-4 rounded-lg border border-slate-700/80 bg-slate-900/60 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <FaPlay className="text-emerald-400 text-[10px]" /> Live Sound Cue Previews
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => playThemeSound(false, true)}
                  className="flex items-center justify-center gap-2 rounded bg-slate-700 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-slate-600 active:scale-95 transition-all"
                  title="Test Light Mode Chime"
                >
                  <FaSun className="text-amber-400" /> Light Chime
                </button>

                <button
                  type="button"
                  onClick={() => playThemeSound(true, true)}
                  className="flex items-center justify-center gap-2 rounded bg-slate-700 px-3 py-2 text-xs font-semibold text-sky-300 hover:bg-slate-600 active:scale-95 transition-all"
                  title="Test Dark Mode Tone"
                >
                  <FaMoon className="text-sky-400" /> Dark Tone
                </button>

                <button
                  type="button"
                  onClick={() => playClickSound(true)}
                  className="flex items-center justify-center gap-2 rounded bg-slate-700 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-slate-600 active:scale-95 transition-all"
                  title="Test Click Sound"
                >
                  <FaMousePointer className="text-emerald-400" /> Click Tick
                </button>

                <button
                  type="button"
                  onClick={() => playModalSound(true, true)}
                  className="flex items-center justify-center gap-2 rounded bg-slate-700 px-3 py-2 text-xs font-semibold text-purple-300 hover:bg-slate-600 active:scale-95 transition-all"
                  title="Test Modal Chord"
                >
                  <FaWindowRestore className="text-purple-400" /> Modal Chord
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors w-full sm:w-auto"
          >
            <FaUndo className="text-xs" /> Reset Defaults
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition-colors w-full sm:w-auto"
          >
            <FaSave className="text-xs" />
            {loading ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
