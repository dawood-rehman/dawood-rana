'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminPersonalInfo() {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    title: '',
    bio: '',
    image: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const springTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 25,
    duration: 0.35,
  };

  useEffect(() => {
    loadPersonalInfo();
  }, []);

  const loadPersonalInfo = () => {
    const data = getFromStorage(STORAGE_KEYS.PERSONAL_INFO, {
      name: '',
      title: '',
      bio: '',
      image: '',
    });
    setPersonalInfo(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!personalInfo.name || !personalInfo.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    saveToStorage(STORAGE_KEYS.PERSONAL_INFO, personalInfo);
    toast.success('Personal info updated successfully');
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Personal Information</h2>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springTransition}
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto min-h-11 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base text-white font-medium rounded-lg transition-colors"
          >
            Edit
          </motion.button>
        )}
      </div>

      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700 space-y-4 sm:space-y-5"
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Name *</label>
              <input
                type="text"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                value={personalInfo.title}
                onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                placeholder="e.g., Full-Stack Developer"
                className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                value={personalInfo.bio}
                onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                rows="4"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Image URL</label>
              <input
                type="text"
                value={personalInfo.image}
                onChange={(e) => setPersonalInfo({ ...personalInfo, image: e.target.value })}
                className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                className="w-full sm:w-auto min-h-11 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base text-white font-medium rounded-lg transition-colors"
              >
                Save Changes
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                onClick={() => {
                  setIsEditing(false);
                  loadPersonalInfo();
                }}
                className="w-full sm:w-auto min-h-11 px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-700 hover:bg-gray-600 text-sm sm:text-base text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700 space-y-4 sm:space-y-5"
        >
          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Name</p>
            <p className="text-base sm:text-lg text-white font-semibold">{personalInfo.name}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Title</p>
            <p className="text-base sm:text-lg text-white font-semibold">{personalInfo.title}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Bio</p>
            <p className="text-sm sm:text-base text-gray-300">{personalInfo.bio}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Image URL</p>
            <p className="text-xs sm:text-sm text-gray-400 break-all">{personalInfo.image}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
