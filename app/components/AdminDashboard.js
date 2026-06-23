'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSignOutAlt, FaLock } from 'react-icons/fa';
import { useAdmin } from '@/app/context/AdminContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Tab components imports
import AdminProjects from './admin/AdminProjects';
import AdminSkills from './admin/AdminSkills';
import AdminEducation from './admin/AdminEducation';
import AdminContactInfo from './admin/AdminContactInfo';
import AdminPersonalInfo from './admin/AdminPersonalInfo';
import AdminWorkExperience from './admin/AdminWorkExperience';
import AdminCertifications from './admin/AdminCertifications';
import AdminAchievements from './admin/AdminAchievements';
import AdminPassword from './admin/AdminPassword';

const tabs = [
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'skills', label: 'Skills', icon: '⚙️' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'contact', label: 'Contact Info', icon: '📞' },
  { id: 'personal', label: 'Personal Info', icon: '👤' },
  { id: 'experience', label: 'Work Experience', icon: '💼' },
  { id: 'certifications', label: 'Certifications', icon: '📜' },
  { id: 'achievements', label: 'Achievements', icon: '🏆' },
  { id: 'password', label: 'Change Password', icon: '🔐' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('projects');
  const { isAuthenticated, loading, logout } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'projects':
        return <AdminProjects />;
      case 'skills':
        return <AdminSkills />;
      case 'education':
        return <AdminEducation />;
      case 'contact':
        return <AdminContactInfo />;
      case 'personal':
        return <AdminPersonalInfo />;
      case 'experience':
        return <AdminWorkExperience />;
      case 'certifications':
        return <AdminCertifications />;
      case 'achievements':
        return <AdminAchievements />;
      case 'password':
        return <AdminPassword />;
      default:
        return <AdminProjects />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="w-full px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
          >
            <FaArrowLeft className="text-xs sm:text-base" />
            <span className="hidden sm:inline">Back to Portfolio</span>
            <span className="sm:hidden">Back</span>
          </motion.button>
          <h1 className="text-xl sm:text-2xl font-bold text-white text-center">Admin Dashboard</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            <FaSignOutAlt className="text-xs sm:text-base" />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-3 sm:px-4 py-6 sm:py-8">
        {/* Tabs Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-800 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
}
