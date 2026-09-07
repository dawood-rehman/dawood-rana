'use client';

import { useState, useEffect } from 'react';
import { FaBriefcase, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { getFromStorage, saveContentSection, STORAGE_KEYS, DEFAULT_DATA } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminExperience() {
  const [experiences, setExperiences] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    employmentType: 'Full-time',
    startDate: '',
    endDate: 'Present',
    current: false,
    location: '',
    description: '',
    technologies: '',
    enabled: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = () => {
    const data = getFromStorage(STORAGE_KEYS.EXPERIENCES, DEFAULT_DATA.experiences);
    setExperiences(Array.isArray(data) ? data : []);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      company: item.company || '',
      role: item.role || '',
      employmentType: item.employmentType || 'Full-time',
      startDate: item.startDate || '',
      endDate: item.endDate || 'Present',
      current: Boolean(item.current),
      location: item.location || '',
      description: item.description || '',
      technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : '',
      enabled: item.enabled !== false,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    const updated = experiences.filter((e) => e.id !== id);
    setExperiences(updated);

    try {
      await saveContentSection('experiences', updated);
      toast.success('Experience deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete experience');
      loadExperiences();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company.trim() || !formData.role.trim() || !formData.startDate.trim()) {
      toast.error('Company, Role, and Start Date are required');
      return;
    }

    setLoading(true);

    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    let updatedList;
    if (editingId) {
      updatedList = experiences.map((exp) =>
        exp.id === editingId
          ? {
              ...exp,
              ...formData,
              technologies: techArray,
              id: editingId,
            }
          : exp
      );
    } else {
      const newEntry = {
        id: Date.now().toString(),
        ...formData,
        technologies: techArray,
        order: experiences.length + 1,
      };
      updatedList = [...experiences, newEntry];
    }

    try {
      await saveContentSection('experiences', updatedList);
      toast.success(editingId ? 'Experience updated' : 'Experience added');
      setExperiences(updatedList);
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        company: '',
        role: '',
        employmentType: 'Full-time',
        startDate: '',
        endDate: 'Present',
        current: false,
        location: '',
        description: '',
        technologies: '',
        enabled: true,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaBriefcase className="text-blue-400" /> Work Experience
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your employment history, engineering positions, and technical milestones.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setEditingId(null);
              setFormData({
                company: '',
                role: '',
                employmentType: 'Full-time',
                startDate: '',
                endDate: 'Present',
                current: false,
                location: '',
                description: '',
                technologies: '',
                enabled: true,
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <FaPlus /> Add Experience
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-4">
          <h3 className="text-lg font-bold text-white">
            {editingId ? 'Edit Experience' : 'New Experience'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Company / Organization *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Acme Software"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Job Role / Title *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Employment Type</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Remote / Faisalabad"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.current}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        current: e.target.checked,
                        endDate: e.target.checked ? 'Present' : formData.endDate,
                      })
                    }
                  />
                  I currently work here
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Start Date *</label>
                <input
                  type="text"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  placeholder="e.g. Jan 2023"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">End Date</label>
                <input
                  type="text"
                  value={formData.endDate}
                  disabled={formData.current}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  placeholder="e.g. Dec 2024 or Present"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                placeholder="Key accomplishments, systems built, and responsibilities..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Technologies Used (comma separated)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, Next.js, TypeScript, PostgreSQL"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg"
              >
                {loading ? 'Saving...' : 'Save Experience'}
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
        {experiences.length === 0 ? (
          <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center text-slate-400 text-sm">
            No work experience entries added yet. Click &quot;Add Experience&quot; above.
          </div>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">{exp.role}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-sm font-semibold text-blue-400">{exp.company}</span>
                  {exp.current && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate} {exp.location && `| ${exp.location}`}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(exp)}
                  className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(exp.id)}
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
