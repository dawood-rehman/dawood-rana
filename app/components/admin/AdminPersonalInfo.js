'use client';

import { useState, useEffect } from 'react';
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
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Personal Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto min-h-11 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-sm sm:text-base text-white font-medium rounded-lg transition-colors duration-150"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div
          className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700 space-y-4 sm:space-y-5"
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Name *</label>
              <input
                type="text"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Title *</label>
              <input
                type="text"
                value={personalInfo.title}
                onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                placeholder="e.g., Full-Stack Developer"
                className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Bio</label>
              <textarea
                value={personalInfo.bio}
                onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                rows="4"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Image URL</label>
              <input
                type="text"
                value={personalInfo.image}
                onChange={(e) => setPersonalInfo({ ...personalInfo, image: e.target.value })}
                className="w-full min-h-11 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto min-h-11 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-sm sm:text-base text-white font-medium rounded-lg transition-colors duration-150"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  loadPersonalInfo();
                }}
                className="w-full sm:w-auto min-h-11 px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-700 hover:bg-slate-600 text-sm sm:text-base text-white font-medium rounded-lg transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div
          className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700 space-y-4 sm:space-y-5"
        >
          <div>
            <p className="text-xs sm:text-sm text-slate-400 mb-1">Name</p>
            <p className="text-base sm:text-lg text-white font-semibold">{personalInfo.name}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-slate-400 mb-1">Title</p>
            <p className="text-base sm:text-lg text-white font-semibold">{personalInfo.title}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-slate-400 mb-1">Bio</p>
            <p className="text-sm sm:text-base text-slate-300">{personalInfo.bio}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-slate-400 mb-1">Image URL</p>
            <p className="text-xs sm:text-sm text-slate-400 break-all">{personalInfo.image}</p>
          </div>
        </div>
      )}
    </div>
  );
}
