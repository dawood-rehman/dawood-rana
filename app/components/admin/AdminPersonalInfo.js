'use client';

import { useState, useEffect } from 'react';
import { getFromStorage, saveContentSection, STORAGE_KEYS, DEFAULT_DATA } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminPersonalInfo() {
  const [personalInfo, setPersonalInfo] = useState({
    ...DEFAULT_DATA.personalInfo,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPersonalInfo();
  }, []);

  const loadPersonalInfo = () => {
    const data = getFromStorage(STORAGE_KEYS.PERSONAL_INFO, DEFAULT_DATA.personalInfo);
    const { image, ...safeData } = data || {};
    setPersonalInfo({
      ...DEFAULT_DATA.personalInfo,
      ...safeData,
      ctaPrimary: { ...DEFAULT_DATA.personalInfo.ctaPrimary, ...(safeData.ctaPrimary || {}) },
      ctaSecondary: { ...DEFAULT_DATA.personalInfo.ctaSecondary, ...(safeData.ctaSecondary || {}) },
    });
  };

  const handleHighlightChange = (index, field, value) => {
    const newHighlights = [...(personalInfo.highlights || [])];
    if (!newHighlights[index]) {
      newHighlights[index] = { value: '', label: '' };
    }
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setPersonalInfo({ ...personalInfo, highlights: newHighlights });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!personalInfo.name?.trim() || !personalInfo.title?.trim()) {
      toast.error('Name and Title are required');
      return;
    }

    setLoading(true);
    try {
      await saveContentSection('personalInfo', personalInfo);

      // Also sync navbar logo text and initials with the new name
      try {
        const navConfig = getFromStorage(STORAGE_KEYS.NAVBAR_CONFIG, DEFAULT_DATA.navbarConfig);
        if (navConfig) {
          const initials = personalInfo.name
            .split(' ')
            .map((n) => n[0])
            .filter(Boolean)
            .slice(0, 2)
            .join('')
            .toUpperCase();

          const updatedNav = {
            ...navConfig,
            logoText: personalInfo.name,
            logoInitials: initials || navConfig.logoInitials || 'DR',
          };
          await saveContentSection('navbarConfig', updatedNav);
        }
      } catch (navErr) {
        console.warn('Auto navbar sync note:', navErr);
      }

      toast.success('Hero & About information updated (Navbar & Footer synced)');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update personal info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Hero & About Info</h2>
          <p className="text-xs text-slate-400 mt-1">
            Headlines, bio, call-to-actions, proof points, delivery cards, and statistics.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto min-h-11 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-sm sm:text-base text-white font-medium rounded-lg transition-colors duration-150"
          >
            Edit Content
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Core Info */}
            <div className="border-b border-slate-700 pb-5 space-y-4">
              <h3 className="text-base font-bold text-blue-400">Core Identity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                    Section Eyebrow
                  </label>
                  <input
                    type="text"
                    value={personalInfo.eyebrow || ''}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, eyebrow: e.target.value })}
                    placeholder="Portfolio"
                    className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={personalInfo.name || ''}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Headline Title *
                </label>
                <input
                  type="text"
                  value={personalInfo.title || ''}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                  placeholder="e.g. Full-Stack Developer & Computer Science Student"
                  className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Bio Summary
                </label>
                <textarea
                  value={personalInfo.bio || ''}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                  rows="3"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>

            {/* CTAs */}
            <div className="border-b border-slate-700 pb-5 space-y-4">
              <h3 className="text-base font-bold text-blue-400">Call-To-Action Buttons</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Primary Button</span>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={personalInfo.ctaPrimary?.enabled !== false}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            ctaPrimary: { ...personalInfo.ctaPrimary, enabled: e.target.checked },
                          })
                        }
                      />
                      Show
                    </label>
                  </div>
                  <input
                    type="text"
                    value={personalInfo.ctaPrimary?.label || ''}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        ctaPrimary: { ...personalInfo.ctaPrimary, label: e.target.value },
                      })
                    }
                    placeholder="Button Label (e.g. View Projects)"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  />
                  <input
                    type="text"
                    value={personalInfo.ctaPrimary?.href || ''}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        ctaPrimary: { ...personalInfo.ctaPrimary, href: e.target.value },
                      })
                    }
                    placeholder="Link URL or Hash (e.g. #projects)"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  />
                </div>

                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Secondary Button</span>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={personalInfo.ctaSecondary?.enabled !== false}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            ctaSecondary: { ...personalInfo.ctaSecondary, enabled: e.target.checked },
                          })
                        }
                      />
                      Show
                    </label>
                  </div>
                  <input
                    type="text"
                    value={personalInfo.ctaSecondary?.label || ''}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        ctaSecondary: { ...personalInfo.ctaSecondary, label: e.target.value },
                      })
                    }
                    placeholder="Button Label (e.g. Resume)"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  />
                  <input
                    type="text"
                    value={personalInfo.ctaSecondary?.href || ''}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        ctaSecondary: { ...personalInfo.ctaSecondary, href: e.target.value },
                      })
                    }
                    placeholder="Custom URL (leave empty to use uploaded resume)"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  />
                </div>
              </div>
            </div>

            {/* Availability & Side Cards */}
            <div className="border-b border-slate-700 pb-5 space-y-4">
              <h3 className="text-base font-bold text-blue-400">Profile Card Badges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Availability Headline</label>
                  <input
                    type="text"
                    value={personalInfo.availabilityTitle || ''}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, availabilityTitle: e.target.value })
                    }
                    placeholder="Available for focused web work"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Availability Subtitle</label>
                  <input
                    type="text"
                    value={personalInfo.availabilitySubtitle || ''}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, availabilitySubtitle: e.target.value })
                    }
                    placeholder="Next.js, React, MongoDB, APIs"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Card 1 Title</label>
                    <input
                      type="text"
                      value={personalInfo.deliveryTitle || ''}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, deliveryTitle: e.target.value })
                      }
                      placeholder="Delivery"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Card 1 Value</label>
                    <input
                      type="text"
                      value={personalInfo.deliveryValue || ''}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, deliveryValue: e.target.value })
                      }
                      placeholder="Clean & responsive"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Card 2 Title</label>
                    <input
                      type="text"
                      value={personalInfo.stackTitle || ''}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, stackTitle: e.target.value })
                      }
                      placeholder="Stack"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Card 2 Value</label>
                    <input
                      type="text"
                      value={personalInfo.stackValue || ''}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, stackValue: e.target.value })
                      }
                      placeholder="React + MongoDB"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Proof Points & Highlights */}
            <div className="border-b border-slate-700 pb-5 space-y-4">
              <h3 className="text-base font-bold text-blue-400">Proof Points & Stat Highlights</h3>
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Core Proof Points (comma-separated badges)
                </label>
                <input
                  type="text"
                  value={
                    Array.isArray(personalInfo.proofPoints)
                      ? personalInfo.proofPoints.join(', ')
                      : personalInfo.proofPoints || ''
                  }
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      proofPoints: e.target.value.split(',').map((p) => p.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Next.js, MongoDB, API Design, Responsive UI"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-2">3 Highlight Stats</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => {
                    const item = personalInfo.highlights?.[idx] || { value: '', label: '' };
                    return (
                      <div key={idx} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 space-y-2">
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => handleHighlightChange(idx, 'value', e.target.value)}
                          placeholder="Stat Value (e.g. 10+)"
                          className="w-full px-2.5 py-1.5 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                        />
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => handleHighlightChange(idx, 'label', e.target.value)}
                          placeholder="Stat Label (e.g. Projects)"
                          className="w-full px-2.5 py-1.5 bg-slate-700 border border-slate-600 rounded text-xs text-white"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto min-h-11 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-sm font-bold text-white rounded-lg transition-colors"
              >
                {loading ? 'Saving...' : 'Save All Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  loadPersonalInfo();
                }}
                className="w-full sm:w-auto min-h-11 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-sm font-medium text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Name</p>
              <p className="text-base text-white font-semibold">{personalInfo.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Eyebrow Tag</p>
              <p className="text-base text-white font-semibold">{personalInfo.eyebrow || 'Portfolio'}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-1">Headline</p>
            <p className="text-base text-white font-semibold">{personalInfo.title}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-1">Bio</p>
            <p className="text-sm text-slate-300">{personalInfo.bio}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-700 pt-4">
            {(personalInfo.highlights || []).map((h, i) => (
              <div key={i} className="bg-slate-900/40 p-3 rounded border border-slate-700">
                <div className="text-lg font-black text-white">{h.value}</div>
                <div className="text-xs uppercase text-slate-400">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
