'use client';

import { useState, useEffect } from 'react';
import { FaConciergeBell, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { getFromStorage, saveContentSection, STORAGE_KEYS, DEFAULT_DATA } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'FaCode',
    features: '',
    ctaLabel: '',
    ctaUrl: '',
    enabled: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    const data = getFromStorage(STORAGE_KEYS.SERVICES, DEFAULT_DATA.services);
    setServices(Array.isArray(data) ? data : []);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      icon: item.icon || 'FaCode',
      features: Array.isArray(item.features) ? item.features.join(', ') : '',
      ctaLabel: item.ctaLabel || '',
      ctaUrl: item.ctaUrl || '',
      enabled: item.enabled !== false,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const updated = services.filter((s) => s.id !== id);
    setServices(updated);

    try {
      await saveContentSection('services', updated);
      toast.success('Service deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete service');
      loadServices();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and Description are required');
      return;
    }

    setLoading(true);

    const featuresArray = formData.features
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    let updatedList;
    if (editingId) {
      updatedList = services.map((s) =>
        s.id === editingId
          ? {
              ...s,
              ...formData,
              features: featuresArray,
              id: editingId,
            }
          : s
      );
    } else {
      const newEntry = {
        id: Date.now().toString(),
        ...formData,
        features: featuresArray,
        order: services.length + 1,
      };
      updatedList = [...services, newEntry];
    }

    try {
      await saveContentSection('services', updatedList);
      toast.success(editingId ? 'Service updated' : 'Service added');
      setServices(updatedList);
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        icon: 'FaCode',
        features: '',
        ctaLabel: '',
        ctaUrl: '',
        enabled: true,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaConciergeBell className="text-blue-400" /> Services & Offerings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Showcase your technical specialties, deliverables, and service packages.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setEditingId(null);
              setFormData({
                title: '',
                description: '',
                icon: 'FaCode',
                features: '',
                ctaLabel: '',
                ctaUrl: '',
                enabled: true,
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <FaPlus /> Add Service
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-4">
          <h3 className="text-lg font-bold text-white">
            {editingId ? 'Edit Service' : 'New Service'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Service Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Web Application Development"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                >
                  <option value="FaCode">FaCode (General / Code)</option>
                  <option value="FaServer">FaServer (Backend / APIs)</option>
                  <option value="FaLaptopCode">FaLaptopCode (Frontend / UI)</option>
                  <option value="FaMobileAlt">FaMobileAlt (Mobile / Responsive)</option>
                  <option value="FaRocket">FaRocket (Performance / Launch)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                placeholder="High-level summary of what this service provides..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Feature Bullets (comma separated)
              </label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Next.js architecture, Responsive Tailwind CSS, MongoDB integration"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">CTA Button Label</label>
                <input
                  type="text"
                  value={formData.ctaLabel}
                  onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
                  placeholder="e.g. Request Quote"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">CTA URL or Link</label>
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
                {loading ? 'Saving...' : 'Save Service'}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.length === 0 ? (
          <div className="md:col-span-2 bg-slate-800 p-8 rounded-lg border border-slate-700 text-center text-slate-400 text-sm">
            No services configured yet. Click &quot;Add Service&quot; above to add your offerings.
          </div>
        ) : (
          services.map((svc) => (
            <div
              key={svc.id}
              className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-white">{svc.title}</h3>
                  <span className="text-xs font-mono text-slate-400">{svc.icon}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{svc.description}</p>

                {svc.features && svc.features.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {svc.features.map((f, i) => (
                      <span key={i} className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-700/60 mt-4">
                <button
                  type="button"
                  onClick={() => handleEdit(svc)}
                  className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(svc.id)}
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
