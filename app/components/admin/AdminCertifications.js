'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springTransition}
            onClick={() => {
              setIsAdding(true);
              resetForm();
            }}
            className="w-full sm:w-auto min-h-11 flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 text-sm sm:text-base text-white font-medium rounded-lg transition-colors"
          >
            <FaPlus /> Add Certification
          </motion.button>
        )}
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700"
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Certification name"
                className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Issuer</label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="Organization name"
                  className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Year</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2024"
                  className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                className="w-full sm:w-auto min-h-11 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base text-white font-medium rounded-lg transition-colors"
              >
                {editingId ? 'Update' : 'Add'}
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                onClick={resetForm}
                className="w-full sm:w-auto min-h-11 px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-700 hover:bg-gray-600 text-sm sm:text-base text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {certifications.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8 text-sm sm:text-base">
            No certifications yet
          </div>
        ) : (
          certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...springTransition, delay: index * 0.05 }}
              className="bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-700 hover:border-gray-600 transition-colors flex flex-col"
            >
              <div className="flex justify-between items-start mb-3 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white break-words">{cert.title}</h3>
                  {cert.issuer && <p className="text-xs sm:text-sm text-gray-400 mt-1 break-words">{cert.issuer}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={springTransition}
                    onClick={() => {
                      setEditingId(cert.id);
                      setFormData(cert);
                      setIsAdding(true);
                    }}
                    className="min-h-10 min-w-10 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={springTransition}
                    onClick={() => handleDelete(cert.id)}
                    className="min-h-10 min-w-10 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <FaTrash />
                  </motion.button>
                </div>
              </div>
              {cert.year && <p className="text-xs sm:text-sm text-gray-500 mt-auto">{cert.year}</p>}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
