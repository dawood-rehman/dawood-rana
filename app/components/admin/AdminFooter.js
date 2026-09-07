'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaLink, FaPlus, FaSave, FaShoePrints, FaTrash } from 'react-icons/fa';
import { getFromStorage, saveContentSection, STORAGE_KEYS, DEFAULT_DATA } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminFooter() {
  const [footerConfig, setFooterConfig] = useState(DEFAULT_DATA.footerConfig);
  const [legalLinks, setLegalLinks] = useState([]);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkForm, setLinkForm] = useState({ name: '', href: '', isExternal: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFooter();
  }, []);

  const loadFooter = () => {
    const data = getFromStorage(STORAGE_KEYS.FOOTER_CONFIG, DEFAULT_DATA.footerConfig);
    if (data) {
      setFooterConfig({ ...DEFAULT_DATA.footerConfig, ...data });
      setLegalLinks(Array.isArray(data.legalLinks) ? data.legalLinks : []);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const payload = {
      ...footerConfig,
      legalLinks,
    };

    try {
      await saveContentSection('footerConfig', payload);
      toast.success('Footer settings saved successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save footer settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!linkForm.name.trim() || !linkForm.href.trim()) {
      toast.error('Link name and href are required');
      return;
    }

    setLegalLinks([...legalLinks, { ...linkForm }]);
    setLinkForm({ name: '', href: '', isExternal: false });
    setIsAddingLink(false);
  };

  const handleDeleteLink = (index) => {
    setLegalLinks(legalLinks.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <FaShoePrints />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white sm:text-3xl">Footer Configuration</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Manage the bottom footer copyright note, optional footer description, legal links, and admin button.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-700 pb-2">
            General Footer Settings
          </h3>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Copyright Notice (Use <code className="text-blue-400">&#123;year&#125;</code> for auto-year)
            </label>
            <input
              type="text"
              value={footerConfig.copyrightText || ''}
              onChange={(e) => setFooterConfig({ ...footerConfig, copyrightText: e.target.value })}
              placeholder="© {year} Dawood Rehman. All rights reserved."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Short Footer Description (Optional)
            </label>
            <textarea
              value={footerConfig.description || ''}
              onChange={(e) => setFooterConfig({ ...footerConfig, description: e.target.value })}
              rows="2"
              placeholder="Built with Next.js, Tailwind CSS, and MongoDB."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white resize-none"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-700">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={footerConfig.showSocialLinks !== false}
                onChange={(e) =>
                  setFooterConfig({ ...footerConfig, showSocialLinks: e.target.checked })
                }
              />
              Show social profile links in footer
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={footerConfig.showAdminButton !== false}
                onChange={(e) =>
                  setFooterConfig({ ...footerConfig, showAdminButton: e.target.checked })
                }
              />
              Show &quot;Admin&quot; login trigger button
            </label>
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaSave /> {loading ? 'Saving...' : 'Save Footer Settings'}
            </button>
          </div>
        </div>

        {/* Legal Links */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FaLink className="text-blue-400" /> Legal & Custom Footer Links
            </h3>
            {!isAddingLink && (
              <button
                type="button"
                onClick={() => setIsAddingLink(true)}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded flex items-center gap-1"
              >
                <FaPlus /> Add Link
              </button>
            )}
          </div>

          {isAddingLink && (
            <form onSubmit={handleAddLink} className="p-3 bg-slate-900/60 rounded border border-slate-700 space-y-2">
              <input
                type="text"
                value={linkForm.name}
                onChange={(e) => setLinkForm({ ...linkForm, name: e.target.value })}
                placeholder="Link Title (e.g. Privacy Policy)"
                className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-xs text-white"
                required
              />
              <input
                type="text"
                value={linkForm.href}
                onChange={(e) => setLinkForm({ ...linkForm, href: e.target.value })}
                placeholder="URL (e.g. /privacy or https://...)"
                className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-xs text-white"
                required
              />
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={linkForm.isExternal}
                    onChange={(e) => setLinkForm({ ...linkForm, isExternal: e.target.checked })}
                  />
                  External link
                </label>
                <div className="flex gap-2">
                  <button type="submit" className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingLink(false)}
                    className="px-3 py-1 bg-slate-700 text-white text-xs rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {legalLinks.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No extra footer links configured.</p>
            ) : (
              legalLinks.map((l, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/40 rounded text-xs">
                  <div>
                    <span className="font-bold text-white">{l.name}</span>
                    <span className="font-mono text-slate-400 ml-2">{l.href}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteLink(idx)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
