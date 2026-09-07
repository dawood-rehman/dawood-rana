'use client';

import { useState, useEffect } from 'react';
import { FaCommentDots, FaEdit, FaPlus, FaStar, FaTrash } from 'react-icons/fa';
import { getFromStorage, saveContentSection, STORAGE_KEYS, DEFAULT_DATA } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    position: '',
    company: '',
    content: '',
    rating: 5,
    avatar: '',
    enabled: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = () => {
    const data = getFromStorage(STORAGE_KEYS.TESTIMONIALS, DEFAULT_DATA.testimonials);
    setTestimonials(Array.isArray(data) ? data : []);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      clientName: item.clientName || '',
      position: item.position || '',
      company: item.company || '',
      content: item.content || '',
      rating: item.rating ?? 5,
      avatar: item.avatar || '',
      enabled: item.enabled !== false,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    const updated = testimonials.filter((t) => t.id !== id);
    setTestimonials(updated);

    try {
      await saveContentSection('testimonials', updated);
      toast.success('Testimonial deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete testimonial');
      loadTestimonials();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clientName.trim() || !formData.content.trim()) {
      toast.error('Client Name and Feedback Content are required');
      return;
    }

    setLoading(true);

    let updatedList;
    if (editingId) {
      updatedList = testimonials.map((t) =>
        t.id === editingId
          ? {
              ...t,
              ...formData,
              id: editingId,
            }
          : t
      );
    } else {
      const newEntry = {
        id: Date.now().toString(),
        ...formData,
        order: testimonials.length + 1,
      };
      updatedList = [...testimonials, newEntry];
    }

    try {
      await saveContentSection('testimonials', updatedList);
      toast.success(editingId ? 'Testimonial updated' : 'Testimonial added');
      setTestimonials(updatedList);
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        clientName: '',
        position: '',
        company: '',
        content: '',
        rating: 5,
        avatar: '',
        enabled: true,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaCommentDots className="text-blue-400" /> Client Testimonials
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Display quotes, endorsements, and peer feedback to build credibility.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setEditingId(null);
              setFormData({
                clientName: '',
                position: '',
                company: '',
                content: '',
                rating: 5,
                avatar: '',
                enabled: true,
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <FaPlus /> Add Testimonial
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-4">
          <h3 className="text-lg font-bold text-white">
            {editingId ? 'Edit Testimonial' : 'New Testimonial'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Client Name *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Sarah Connor"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Position / Role</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g. Lead Tech Recruiter"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. TechCorp Inc."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Feedback / Quote *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows="3"
                placeholder="Dawood was brilliant to work with. He built our web app ahead of schedule..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Star Rating (1 - 5)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                >
                  <option value={5}>5 Stars (Exceptional)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Good)</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Avatar Image URL (optional)</label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://... (or leave empty for initials)"
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
                {loading ? 'Saving...' : 'Save Testimonial'}
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
        {testimonials.length === 0 ? (
          <div className="md:col-span-2 bg-slate-800 p-8 rounded-lg border border-slate-700 text-center text-slate-400 text-sm">
            No testimonials added yet. Click &quot;Add Testimonial&quot; above to add client feedback.
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{t.clientName}</h4>
                  <div className="flex text-amber-400 text-xs">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>

                {(t.position || t.company) && (
                  <p className="text-xs text-blue-400 mt-0.5">
                    {[t.position, t.company].filter(Boolean).join(' • ')}
                  </p>
                )}

                <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-700/60 mt-4">
                <button
                  type="button"
                  onClick={() => handleEdit(t)}
                  className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
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
