'use client';

import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminWorkExperience() {
  const [experiences, setExperiences] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    duration: '',
    description: '',
  });

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = () => {
    const data = getFromStorage(STORAGE_KEYS.WORK_EXPERIENCE, []);
    setExperiences(data);
  };

  const resetForm = () => {
    setFormData({ title: '', company: '', duration: '', description: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.company) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingId) {
      const updated = experiences.map((e) => (e.id === editingId ? { ...e, ...formData } : e));
      setExperiences(updated);
      saveToStorage(STORAGE_KEYS.WORK_EXPERIENCE, updated);
      toast.success('Experience updated');
    } else {
      const updated = [...experiences, { id: Date.now().toString(), ...formData }];
      setExperiences(updated);
      saveToStorage(STORAGE_KEYS.WORK_EXPERIENCE, updated);
      toast.success('Experience added');
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this work experience?')) {
      const updated = experiences.filter((e) => e.id !== id);
      setExperiences(updated);
      saveToStorage(STORAGE_KEYS.WORK_EXPERIENCE, updated);
      toast.success('Deleted');
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Work Experience</h2>
        {!isAdding && (
          <button
            onClick={() => {
              setIsAdding(true);
              resetForm();
            }}
            className="w-full sm:w-auto min-h-11 flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm sm:text-base text-white font-medium rounded-lg transition-colors duration-150"
          >
            <FaPlus /> Add Experience
          </button>
        )}
      </div>

      {isAdding && (
        <div
          className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700"
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., Jan 2023 - Present"
                className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto min-h-11 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-sm sm:text-base text-white font-medium rounded-lg transition-colors duration-150"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto min-h-11 px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-700 hover:bg-slate-600 text-sm sm:text-base text-white font-medium rounded-lg transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4 sm:space-y-5">
        {experiences.length === 0 ? (
          <div className="text-center text-slate-400 py-8 text-sm sm:text-base">No work experiences yet</div>
        ) : (
          experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white break-words">{exp.title}</h3>
                  <p className="text-sm sm:text-base text-slate-400 break-words">{exp.company}</p>
                  {exp.duration && <p className="text-xs sm:text-sm text-slate-500 mt-1">{exp.duration}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditingId(exp.id);
                      setFormData(exp);
                      setIsAdding(true);
                    }}
                    className="min-h-11 min-w-11 p-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg transition-colors duration-150 flex items-center justify-center font-medium"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="min-h-11 min-w-11 p-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-colors duration-150 flex items-center justify-center font-medium"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
                  {exp.description && <p className="text-sm sm:text-base text-slate-300">{exp.description}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
