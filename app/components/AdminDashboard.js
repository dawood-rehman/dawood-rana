'use client';

import { useEffect, useState } from 'react';
import {
  FaAddressBook,
  FaArrowLeft,
  FaFolderOpen,
  FaGraduationCap,
  FaRocket,
  FaSignOutAlt,
  FaTools,
  FaUser,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAdmin } from '@/app/context/AdminContext';
import AdminAbout from './admin/AdminAbout';
import AdminContactInfo from './admin/AdminContactInfo';
import AdminEducation from './admin/AdminEducation';
import AdminPassion from './admin/AdminPassion';
import AdminProjects from './admin/AdminProjects';
import AdminSkills from './admin/AdminSkills';

const tabs = [
  { id: 'about', label: 'About', helper: 'Profile, bio, resume', icon: FaUser },
  { id: 'passion', label: 'Passion', helper: 'Focus cards', icon: FaRocket },
  { id: 'projects', label: 'Projects', helper: 'Portfolio work', icon: FaFolderOpen },
  { id: 'education', label: 'Education', helper: 'Academic timeline', icon: FaGraduationCap },
  { id: 'skills', label: 'Skills', helper: 'Tech stack', icon: FaTools },
  { id: 'contact', label: 'Contact', helper: 'Info and socials', icon: FaAddressBook },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('about');
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
      <div className="admin-shell flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-400">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <AdminAbout />;
      case 'passion':
        return <AdminPassion />;
      case 'projects':
        return <AdminProjects />;
      case 'education':
        return <AdminEducation />;
      case 'skills':
        return <AdminSkills />;
      case 'contact':
        return <AdminContactInfo />;
      default:
        return <AdminAbout />;
    }
  };

  return (
    <div className="admin-shell min-h-screen">
      <header className="admin-shell-header sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => router.push('/')}
              className="btn-secondary flex min-h-11 items-center justify-center gap-2 px-3 py-2 text-sm sm:w-auto"
            >
              <FaArrowLeft className="text-xs" />
              Back to Portfolio
            </button>
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-black sm:text-2xl">Admin Dashboard</h1>
              <p className="mt-1 text-xs text-slate-500">
                Manage only the sections that appear on the portfolio homepage.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-red-700"
            >
              <FaSignOutAlt className="text-xs" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <nav
          className="mb-6 grid grid-cols-2 gap-2 rounded-lg border border-slate-800 bg-slate-900/40 p-2 sm:grid-cols-3 lg:grid-cols-6"
          aria-label="Admin sections"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-16 rounded-lg px-3 py-3 text-left transition-colors duration-150 ${
                  isActive ? 'admin-tab-active' : 'admin-tab-idle'
                }`}
                aria-pressed={isActive}
              >
                <span className="flex items-center gap-2 text-sm font-black">
                  <Icon className="text-xs" />
                  {tab.label}
                </span>
                <span className="mt-1 block text-xs font-medium opacity-75">{tab.helper}</span>
              </button>
            );
          })}
        </nav>

        <section key={activeTab}>{renderTabContent()}</section>
      </main>
    </div>
  );
}
