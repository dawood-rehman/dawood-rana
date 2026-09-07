'use client';

import { useState, useEffect } from 'react';
import { FaGlobe, FaSave, FaSearch } from 'react-icons/fa';
import { getFromStorage, saveContentSection, STORAGE_KEYS, DEFAULT_DATA } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminSEO() {
  const [seo, setSeo] = useState(DEFAULT_DATA.seoConfig);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSEO();
  }, []);

  const loadSEO = () => {
    const data = getFromStorage(STORAGE_KEYS.SEO_CONFIG, DEFAULT_DATA.seoConfig);
    if (data) {
      setSeo({ ...DEFAULT_DATA.seoConfig, ...data });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await saveContentSection('seoConfig', seo);
      toast.success('SEO & Meta tags updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save SEO configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <FaSearch />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white sm:text-3xl">SEO & Social Meta</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Control search engine rankings, OpenGraph rich previews on WhatsApp/LinkedIn, and Twitter Cards.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Metadata */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
            <FaGlobe className="text-blue-400" /> Primary Search Engine Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Default Page Title *</label>
              <input
                type="text"
                value={seo.siteTitle || ''}
                onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                placeholder="Dawood Rehman | Full-Stack Developer & Software Engineer"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Canonical Site URL</label>
              <input
                type="text"
                value={seo.canonicalUrl || ''}
                onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                placeholder="https://dawoodrana.com"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Meta Description *</label>
            <textarea
              value={seo.metaDescription || ''}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              rows="3"
              placeholder="Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Keywords (Comma separated)</label>
            <input
              type="text"
              value={
                Array.isArray(seo.keywords)
                  ? seo.keywords.join(', ')
                  : seo.keywords || ''
              }
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
              placeholder="Dawood Rehman, Full-Stack Developer, Next.js, React, Node.js"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={seo.robotsIndex !== false}
                onChange={(e) => setSeo({ ...seo, robotsIndex: e.target.checked })}
              />
              Allow search engines to index this site (robots: index)
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={seo.robotsFollow !== false}
                onChange={(e) => setSeo({ ...seo, robotsFollow: e.target.checked })}
              />
              Allow search engines to follow links (robots: follow)
            </label>
          </div>
        </div>

        {/* Social Sharing / Open Graph */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-700 pb-2">
            Social Sharing Previews (Open Graph & Twitter)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">OG / Facebook / LinkedIn Title</label>
              <input
                type="text"
                value={seo.ogTitle || ''}
                onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                placeholder="Leave blank to use main site title"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">OG Share Image URL</label>
              <input
                type="text"
                value={seo.ogImage || ''}
                onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                placeholder="https://.../preview.jpg"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">OG Share Description</label>
            <textarea
              value={seo.ogDescription || ''}
              onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
              rows="2"
              placeholder="Leave blank to use main meta description"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Twitter Card Format</label>
              <select
                value={seo.twitterCard || 'summary_large_image'}
                onChange={(e) => setSeo({ ...seo, twitterCard: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
              >
                <option value="summary_large_image">Summary Large Image</option>
                <option value="summary">Summary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Twitter Share Image URL</label>
              <input
                type="text"
                value={seo.twitterImage || ''}
                onChange={(e) => setSeo({ ...seo, twitterImage: e.target.value })}
                placeholder="https://.../twitter-preview.jpg"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            <FaSave /> {loading ? 'Saving...' : 'Save SEO Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
