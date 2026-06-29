'use client';

import { useEffect, useState } from 'react';
import { FaBrain, FaCode, FaEdit, FaLightbulb, FaPlus, FaRocket, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { DEFAULT_DATA, getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';

const iconOptions = [
  { value: 'FaCode', label: 'Code', icon: FaCode },
  { value: 'FaRocket', label: 'Product', icon: FaRocket },
  { value: 'FaLightbulb', label: 'Ideas', icon: FaLightbulb },
  { value: 'FaBrain', label: 'Learning', icon: FaBrain },
];

const emptyForm = {
  title: '',
  description: '',
  icon: 'FaCode',
};

export default function AdminPassion() {
  const [passions, setPassions] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadPassions();
  }, []);

  const loadPassions = () => {
    setPassions(getFromStorage(STORAGE_KEYS.PASSIONS, DEFAULT_DATA.passions));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in title and description');
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    const updatedPassions = editingId
      ? passions.map((item) => (item.id === editingId ? { ...item, ...payload } : item))
      : [...passions, { id: Date.now().toString(), ...payload }];

    setPassions(updatedPassions);
    saveToStorage(STORAGE_KEYS.PASSIONS, updatedPassions);
    toast.success(editingId ? 'Passion card updated' : 'Passion card added');
    resetForm();
  };

  const handleEdit = (passion) => {
    setFormData({
      title: passion.title,
      description: passion.description,
      icon: passion.icon || 'FaCode',
    });
    setEditingId(passion.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this passion card?')) {
      const updatedPassions = passions.filter((item) => item.id !== id);
      setPassions(updatedPassions);
      saveToStorage(STORAGE_KEYS.PASSIONS, updatedPassions);
      toast.success('Passion card deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white sm:text-3xl">Passion Section</h2>
          <p className="mt-2 text-sm text-slate-400">
            Edit the focus cards shown under the homepage passion section.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors duration-150 hover:from-green-700 hover:to-emerald-700 sm:w-auto"
          >
            <FaPlus />
            Add Card
          </button>
        )}
      </div>

      {isEditing && (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                className="w-full resize-none rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className="min-h-11 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white transition-colors duration-150 hover:from-blue-700 hover:to-indigo-700"
              >
                {editingId ? 'Update Card' : 'Add Card'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="min-h-11 rounded-lg bg-slate-700 px-5 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {passions.map((passion) => {
          const option = iconOptions.find((item) => item.value === passion.icon) || iconOptions[0];
          const Icon = option.icon;

          return (
            <article
              key={passion.id}
              className="rounded-lg border border-slate-700 bg-slate-800 p-4 transition-colors duration-150 hover:border-slate-600 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Icon />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white">{passion.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{passion.description}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleEdit(passion)}
                    className="flex h-9 w-9 items-center justify-center rounded bg-blue-600 text-white transition-colors duration-150 hover:bg-blue-700"
                    title="Edit card"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(passion.id)}
                    className="flex h-9 w-9 items-center justify-center rounded bg-red-600 text-white transition-colors duration-150 hover:bg-red-700"
                    title="Delete card"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
