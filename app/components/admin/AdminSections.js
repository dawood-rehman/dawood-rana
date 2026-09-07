'use client';

import { useState, useEffect } from 'react';
import { FaArrowDown, FaArrowUp, FaCheck, FaEye, FaEyeSlash, FaHeading, FaLayerGroup } from 'react-icons/fa';
import { getFromStorage, saveContentSection, STORAGE_KEYS, DEFAULT_DATA } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminSections() {
  const [sections, setSections] = useState([]);
  const [headings, setHeadings] = useState(DEFAULT_DATA.sectionHeadings);
  const [activeSectionId, setActiveSectionId] = useState('about');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedSections = getFromStorage(STORAGE_KEYS.SECTIONS_CONFIG, DEFAULT_DATA.sectionsConfig);
    const storedHeadings = getFromStorage(STORAGE_KEYS.SECTION_HEADINGS, DEFAULT_DATA.sectionHeadings);

    setSections(storedSections ? [...storedSections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : []);
    setHeadings(storedHeadings || DEFAULT_DATA.sectionHeadings);
  };

  const handleToggleSection = async (id) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    setSections(updated);

    try {
      await saveContentSection('sectionsConfig', updated);
      toast.success('Section visibility updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update visibility');
      loadData();
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    const reordered = newSections.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(reordered);

    try {
      await saveContentSection('sectionsConfig', reordered);
      toast.success('Section order saved');
    } catch (err) {
      toast.error(err.message || 'Failed to save section order');
      loadData();
    }
  };

  const handleHeadingChange = (sectionKey, field, value) => {
    setHeadings((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [field]: value,
      },
    }));
  };

  const handleSaveHeadings = async () => {
    setLoading(true);
    try {
      await saveContentSection('sectionHeadings', headings);
      toast.success('Section headings updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update headings');
    } finally {
      setLoading(false);
    }
  };

  const activeHeading = headings[activeSectionId] || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <FaLayerGroup />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white sm:text-3xl">Page Sections Manager</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Control the arrangement, visibility, and section titles/subtitles across the entire landing page.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Section Order & Visibility */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FaLayerGroup className="text-blue-400" /> Section Order & Visibility
          </h3>
          <p className="text-xs text-slate-400">
            Use up/down arrows to reorder landing page sections. Toggle the eye button to show or hide a section.
          </p>

          <div className="divide-y divide-slate-700">
            {sections.map((sec, index) => (
              <div
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`flex items-center justify-between py-3 px-3 cursor-pointer rounded-lg transition-colors ${
                  activeSectionId === sec.id ? 'bg-slate-700/70 border border-slate-600' : 'hover:bg-slate-700/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400 w-5">
                    {index + 1}.
                  </span>
                  <div>
                    <span className="text-sm font-bold text-white block">{sec.name}</span>
                    <span className="text-xs text-slate-400 font-mono">id: #{sec.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                    title="Move Up"
                  >
                    <FaArrowUp className="text-xs" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 1)}
                    disabled={index === sections.length - 1}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                    title="Move Down"
                  >
                    <FaArrowDown className="text-xs" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSection(sec.id)}
                    className={`ml-2 px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-colors ${
                      sec.enabled
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-700 text-slate-400 border border-slate-600'
                    }`}
                  >
                    {sec.enabled ? <FaEye /> : <FaEyeSlash />}
                    {sec.enabled ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Headings Form */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FaHeading className="text-blue-400" /> Headings: <span className="text-blue-400 capitalize">{activeSectionId}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Editing #{activeSectionId}</span>
          </div>
          <p className="text-xs text-slate-400">
            Customize the eyebrow badge, headline title, and subtitle description for the selected section.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Eyebrow Badge
              </label>
              <input
                type="text"
                value={activeHeading.eyebrow || ''}
                onChange={(e) => handleHeadingChange(activeSectionId, 'eyebrow', e.target.value)}
                placeholder="e.g. Focus, Selected Work, Background"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={activeHeading.title || ''}
                onChange={(e) => handleHeadingChange(activeSectionId, 'title', e.target.value)}
                placeholder="Main Section Heading"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Subtitle / Description
              </label>
              <textarea
                value={activeHeading.subtitle || ''}
                onChange={(e) => handleHeadingChange(activeSectionId, 'subtitle', e.target.value)}
                rows="3"
                placeholder="Supporting paragraph explaining this section"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {activeSectionId === 'contact' && (
              <div className="border-t border-slate-700 pt-3 space-y-3">
                <h4 className="text-xs font-bold text-blue-400">Contact Social Card Sub-Headings</h4>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Social Profiles Card Title</label>
                  <input
                    type="text"
                    value={activeHeading.socialTitle || ''}
                    onChange={(e) => handleHeadingChange('contact', 'socialTitle', e.target.value)}
                    placeholder="Social Profiles"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Social Profiles Card Subtitle</label>
                  <input
                    type="text"
                    value={activeHeading.socialSubtitle || ''}
                    onChange={(e) => handleHeadingChange('contact', 'socialSubtitle', e.target.value)}
                    placeholder="Professional links and direct channels."
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveHeadings}
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaCheck /> {loading ? 'Saving...' : 'Save Headings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
