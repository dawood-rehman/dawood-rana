'use client';

import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';
import toast from 'react-hot-toast';

const gradientOptions = [
  'from-orange-500 to-red-500',
  'from-blue-500 to-cyan-500',
  'from-yellow-500 to-orange-500',
  'from-blue-600 to-indigo-600',
  'from-green-500 to-emerald-500',
  'from-purple-500 to-pink-500',
  'from-slate-700 to-slate-900',
  'from-blue-700 to-blue-900',
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500',
];

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: 'from-blue-500 to-cyan-500',
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = () => {
    const data = getFromStorage(STORAGE_KEYS.SKILLS, []);
    setSkills(data);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: 'from-blue-500 to-cyan-500',
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error('Please enter a skill name');
      return;
    }

    if (editingId) {
      const updatedSkills = skills.map((s) =>
        s.id === editingId ? { ...s, ...formData } : s
      );
      setSkills(updatedSkills);
      saveToStorage(STORAGE_KEYS.SKILLS, updatedSkills);
      toast.success('Skill updated successfully');
    } else {
      const newSkill = {
        id: Date.now().toString(),
        ...formData,
      };
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      saveToStorage(STORAGE_KEYS.SKILLS, updatedSkills);
      toast.success('Skill added successfully');
    }

    resetForm();
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      color: skill.color,
    });
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      const updatedSkills = skills.filter((s) => s.id !== id);
      setSkills(updatedSkills);
      saveToStorage(STORAGE_KEYS.SKILLS, updatedSkills);
      toast.success('Skill deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Manage Skills</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start font-medium duration-150"
          >
            <FaPlus /> Add Skill
          </button>
        )}
      </div>

      {/* Form */}
      {isAdding && (
        <div
          className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 sm:p-6 border border-slate-600 transition-all duration-200"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                Skill Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., React, JavaScript, etc."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                Gradient Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {gradientOptions.map((gradient) => (
                  <button
                    key={gradient}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: gradient })}
                    className={`h-8 sm:h-10 rounded-lg bg-gradient-to-br ${gradient} border-2 ${
                      formData.color === gradient
                        ? 'border-white shadow-lg'
                        : 'border-transparent'
                    } transition-all duration-150`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">{formData.color}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg transition-all text-sm sm:text-base font-medium duration-150"
              >
                {editingId ? 'Update Skill' : 'Add Skill'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all text-sm sm:text-base font-medium duration-150"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {skills.length === 0 ? (
          <div className="col-span-full text-center text-slate-400 py-8">
            No skills yet
          </div>
        ) : (
          skills.map((skill, index) => (
            <div
              key={skill.id}
              className="relative group transition-all duration-200"
            >
              <div
                className={`bg-gradient-to-br ${skill.color} rounded-xl p-4 sm:p-6 h-24 sm:h-32 flex items-center justify-center relative overflow-hidden hover:shadow-lg transition-shadow duration-150`}
              >
                <p className="text-white text-center font-bold text-sm sm:text-lg z-10">
                  {skill.name}
                </p>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-150" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  onClick={() => handleEdit(skill)}
                  className="flex-1 p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded transition-all duration-150 text-sm font-medium"
                  title="Edit skill"
                >
                  <FaEdit className="mx-auto" />
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="flex-1 p-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded transition-all duration-150 text-sm font-medium"
                  title="Delete skill"
                >
                  <FaTrash className="mx-auto" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
