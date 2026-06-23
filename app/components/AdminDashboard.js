'use client';

import { useState, useEffect } from 'react';
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
import AdminProfilePicture from './admin/AdminProfilePicture';
import AdminResume from './admin/AdminResume';

const tabs = [
  { id: 'profile-pic', label: 'Profile Picture', icon: '🖼️' },
  { id: 'resume', label: 'Resume', icon: '📄' },
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile-pic':
        return <AdminProfilePicture />;
      case 'resume':
        return <AdminResume />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="w-full px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-all text-sm sm:text-base duration-150 hover:translate-x-0.5"
          >
            <FaArrowLeft className="text-xs sm:text-base" />
            <span className="hidden sm:inline">Back to Portfolio</span>
            <span className="sm:hidden">Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-white text-center">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all text-sm sm:text-base duration-150 font-medium"
          >
            <FaSignOutAlt className="text-xs sm:text-base" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-3 sm:px-4 py-6 sm:py-8">
        {/* Tabs Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-700 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all text-xs sm:text-sm font-medium duration-150 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div
          key={activeTab}
          className="transition-all duration-200"
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
