'use client';

import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';
import toast from 'react-hot-toast';

const iconOptions = ['FaSchool', 'FaGraduationCap', 'FaUniversity'];
const gradientOptions = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-500',
  'from-yellow-500 to-orange-500',
];

export default function AdminEducation() {
  const [education, setEducation] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    stream: '',
    icon: 'FaGraduationCap',
    color: 'from-blue-500 to-cyan-500',
  });

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = () => {
    const data = getFromStorage(STORAGE_KEYS.EDUCATION, []);
    setEducation(data);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      institution: '',
      stream: '',
      icon: 'FaGraduationCap',
      color: 'from-blue-500 to-cyan-500',
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.institution) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingId) {
      const updatedEducation = education.map((e) =>
        e.id === editingId ? { ...e, ...formData } : e
      );
      setEducation(updatedEducation);
      saveToStorage(STORAGE_KEYS.EDUCATION, updatedEducation);
      toast.success('Education updated successfully');
    } else {
      const newEducation = {
        id: Date.now().toString(),
        ...formData,
      };
      const updatedEducation = [...education, newEducation];
      setEducation(updatedEducation);
      saveToStorage(STORAGE_KEYS.EDUCATION, updatedEducation);
      toast.success('Education added successfully');
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      institution: item.institution,
      stream: item.stream,
      icon: item.icon,
      color: item.color,
    });
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      const updatedEducation = education.filter((e) => e.id !== id);
      setEducation(updatedEducation);
      saveToStorage(STORAGE_KEYS.EDUCATION, updatedEducation);
      toast.success('Education deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Manage Education</h2>
        {!isAdding && (
          <button
            onClick={() => {
              setIsAdding(true);
              resetForm();
            }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-colors duration-150 text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start font-medium"
          >
            <FaPlus /> Add Education
          </button>
        )}
      </div>

      {/* Form */}
      {isAdding && (
        <div
          className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Bachelor's Degree"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                Institution *
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g., University Name"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                Stream / Field
              </label>
              <input
                type="text"
                value={formData.stream}
                onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                placeholder="e.g., Computer Science"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                Gradient Color
              </label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              >
                {gradientOptions.map((gradient) => (
                  <option key={gradient} value={gradient}>
                    {gradient}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg transition-colors duration-150 text-sm sm:text-base font-medium"
              >
                {editingId ? 'Update Education' : 'Add Education'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-150 text-sm sm:text-base font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Education List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {education.length === 0 ? (
          <div className="col-span-full text-center text-slate-400 py-8">
            No education entries yet
          </div>
        ) : (
          education.map((item, index) => (
            <div
              key={item.id}
              className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-lg sm:text-xl`}>
                  📚
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded transition-colors duration-150 font-medium"
                    title="Edit education"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded transition-colors duration-150 font-medium"
                    title="Delete education"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">{item.title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-2">{item.institution}</p>
              <p className="text-slate-500 text-xs">{item.stream}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
