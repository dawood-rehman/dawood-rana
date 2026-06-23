'use client';

import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: '',
  });

  const springTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 25,
    duration: 0.35,
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = () => {
    const data = getFromStorage(STORAGE_KEYS.ACHIEVEMENTS, []);
    setAchievements(data);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', year: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingId) {
      const updated = achievements.map((a) => (a.id === editingId ? { ...a, ...formData } : a));
      setAchievements(updated);
      saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, updated);
      toast.success('Achievement updated');
    } else {
      const updated = [...achievements, { id: Date.now().toString(), ...formData }];
      setAchievements(updated);
      saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, updated);
      toast.success('Achievement added');
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this achievement?')) {
      const updated = achievements.filter((a) => a.id !== id);
      setAchievements(updated);
      saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, updated);
      toast.success('Deleted');
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Achievements</h2>
        {!isAdding && (
          <button
            onClick={() => {
              setIsAdding(true);
              resetForm();
            }}
            className="w-full sm:w-auto min-h-11 flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm sm:text-base text-white font-medium rounded-lg transition-colors duration-150"
          >
            <FaPlus /> Add Achievement
          </button>
        )}
      </div>

      {isAdding && (
        <div
          className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700"
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Achievement title"
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

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
                className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-green-500 transition-colors"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {achievements.length === 0 ? (
          <div className="col-span-full text-center text-slate-400 py-8 text-sm sm:text-base">
            No achievements yet
          </div>
        ) : (
          achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="bg-slate-800 rounded-lg p-4 sm:p-5 border border-slate-700 hover:border-slate-600 transition-colors flex flex-col"
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1 break-words">{achievement.title}</h3>
                  {achievement.description && (
                    <p className="text-xs sm:text-sm text-slate-400 mb-2">{achievement.description}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditingId(achievement.id);
                      setFormData(achievement);
                      setIsAdding(true);
                    }}
                    className="min-h-10 min-w-10 p-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg transition-colors duration-150 flex items-center justify-center font-medium"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(achievement.id)}
                    className="min-h-10 min-w-10 p-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-colors duration-150 flex items-center justify-center font-medium"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              {achievement.year && <p className="text-xs sm:text-sm text-slate-500 mt-auto">{achievement.year}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
