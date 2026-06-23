'use client';

import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    year: '',
  });

  const springTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 25,
    duration: 0.35,
  };

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = () => {
    const data = getFromStorage(STORAGE_KEYS.CERTIFICATIONS, []);
    setCertifications(data);
  };

  const resetForm = () => {
    setFormData({ title: '', issuer: '', year: '' });
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
      const updated = certifications.map((c) => (c.id === editingId ? { ...c, ...formData } : c));
      setCertifications(updated);
      saveToStorage(STORAGE_KEYS.CERTIFICATIONS, updated);
      toast.success('Certification updated');
    } else {
      const updated = [...certifications, { id: Date.now().toString(), ...formData }];
      setCertifications(updated);
      saveToStorage(STORAGE_KEYS.CERTIFICATIONS, updated);
      toast.success('Certification added');
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this certification?')) {
      const updated = certifications.filter((c) => c.id !== id);
      setCertifications(updated);
      saveToStorage(STORAGE_KEYS.CERTIFICATIONS, updated);
      toast.success('Deleted');
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Certifications</h2>
        {!isAdding && (
          <button
            onClick={() => {
              setIsAdding(true);
              resetForm();
            }}
            className="w-full sm:w-auto min-h-11 flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm sm:text-base text-white font-medium rounded-lg transition-colors duration-150"
          >
            <FaPlus /> Add Certification
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
                placeholder="Certification name"
                className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Issuer</label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="Organization name"
                  className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-green-500 transition-colors"
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
        {certifications.length === 0 ? (
          <div className="col-span-full text-center text-slate-400 py-8 text-sm sm:text-base">
            No certifications yet
          </div>
        ) : (
          certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="bg-slate-800 rounded-lg p-4 sm:p-5 border border-slate-700 hover:border-slate-600 transition-colors flex flex-col"
            >
              <div className="flex justify-between items-start mb-3 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white break-words">{cert.title}</h3>
                  {cert.issuer && <p className="text-xs sm:text-sm text-slate-400 mt-1 break-words">{cert.issuer}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditingId(cert.id);
                      setFormData(cert);
                      setIsAdding(true);
                    }}
                    className="min-h-10 min-w-10 p-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg transition-colors duration-150 flex items-center justify-center font-medium"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="min-h-10 min-w-10 p-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-colors duration-150 flex items-center justify-center font-medium"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              {cert.year && <p className="text-xs sm:text-sm text-slate-500 mt-auto\">{cert.year}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
