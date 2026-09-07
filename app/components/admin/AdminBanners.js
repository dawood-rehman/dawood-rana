'use client';

import { useState, useEffect } from 'react';
import { FaBullhorn, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { getFromStorage, saveContentSection, STORAGE_KEYS, DEFAULT_DATA } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: 'NOTICE',
    text: '',
    ctaText: '',
    ctaUrl: '',
    enabled: true,
    style: 'info',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = () => {
    const data = getFromStorage(STORAGE_KEYS.BANNERS, DEFAULT_DATA.banners);
    setBanners(Array.isArray(data) ? data : []);
  };

  const handleEdit = (b) => {
    setEditingId(b.id);
    setFormData({
      title: b.title || '',
      text: b.text || '',
      ctaText: b.ctaText || '',
      ctaUrl: b.ctaUrl || '',
      enabled: b.enabled !== false,
      style: b.style || 'info',
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    const updated = banners.filter((b) => b.id !== id);
    setBanners(updated);

    try {
      await saveContentSection('banners', updated);
      toast.success('Banner deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete banner');
      loadBanners();
    }
  };

  const handleToggle = async (id) => {
    const updated = banners.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b));
    setBanners(updated);

    try {
      await saveContentSection('banners', updated);
      toast.success('Banner status updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update banner');
      loadBanners();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      toast.error('Banner message text is required');
      return;
    }

    setLoading(true);

    let updatedList;
    if (editingId) {
      updatedList = banners.map((b) =>
        b.id === editingId
          ? {
              ...b,
              ...formData,
              id: editingId,
            }
          : b
      );
    } else {
      const newEntry = {
        id: Date.now().toString(),
        ...formData,
      };
      updatedList = [...banners, newEntry];
    }

    try {
      await saveContentSection('banners', updatedList);
      toast.success(editingId ? 'Banner updated' : 'Banner created');
      setBanners(updatedList);
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        title: 'NOTICE',
        text: '',
        ctaText: '',
        ctaUrl: '',
        enabled: true,
        style: 'info',
      });
    } catch (err) {
      toast.error(err.message || 'Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaBullhorn className="text-blue-400" /> Announcement Banners
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Display urgent notifications, job updates, or availability callouts at the very top of the page.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setEditingId(null);
              setFormData({
                title: 'NOTICE',
                text: '',
                ctaText: '',
                ctaUrl: '',
                enabled: true,
                style: 'info',
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <FaPlus /> Create Banner
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-4">
          <h3 className="text-lg font-bold text-white">
            {editingId ? 'Edit Banner' : 'Create Banner'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. NEW, UPDATE, AVAILABLE"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  />
                  Banner is active & visible on landing page
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Banner Announcement Text *</label>
              <input
                type="text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Currently open for contract Full-Stack and Next.js projects."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">CTA Action Link Text</label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="e.g. Get in touch"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">CTA Destination URL</label>
                <input
                  type="text"
                  value={formData.ctaUrl}
                  onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                  placeholder="e.g. #contact or mailto:..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg"
              >
                {loading ? 'Saving...' : 'Save Banner'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                }}
                className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {banners.length === 0 ? (
          <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center text-slate-400 text-sm">
            No banners created. Click &quot;Create Banner&quot; to display top announcement alerts.
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b.id}
              className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  {b.title && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-600/30 text-blue-400">
                      {b.title}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-white">{b.text}</span>
                </div>
                {b.ctaText && b.ctaUrl && (
                  <p className="text-xs text-blue-400 mt-1">
                    Link: {b.ctaText} &rarr; {b.ctaUrl}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggle(b.id)}
                  className={`px-2.5 py-1 text-xs font-bold rounded ${
                    b.enabled
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {b.enabled ? 'Active' : 'Disabled'}
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(b)}
                  className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(b.id)}
                  className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
