'use client';

import { useEffect, useState } from 'react';
import {
  FaAddressBook,
  FaArrowLeft,
  FaBriefcase,
  FaBullhorn,
  FaChartLine,
  FaCommentDots,
  FaCompass,
  FaConciergeBell,
  FaFolderOpen,
  FaGraduationCap,
  FaLayerGroup,
  FaMagic,
  FaPuzzlePiece,
  FaRocket,
  FaSearch,
  FaShieldAlt,
  FaShoePrints,
  FaSignOutAlt,
  FaTools,
  FaUser,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAdmin } from '@/app/context/AdminContext';
import AdminAbout from './admin/AdminAbout';
import AdminSections from './admin/AdminSections';
import AdminPassion from './admin/AdminPassion';
import AdminProjects from './admin/AdminProjects';
import AdminExperience from './admin/AdminExperience';
import AdminEducation from './admin/AdminEducation';
import AdminSkills from './admin/AdminSkills';
import AdminServices from './admin/AdminServices';
import AdminTestimonials from './admin/AdminTestimonials';
import AdminCustomSections from './admin/AdminCustomSections';
import AdminNavbar from './admin/AdminNavbar';
import AdminFooter from './admin/AdminFooter';
import AdminBanners from './admin/AdminBanners';
import AdminSEO from './admin/AdminSEO';
import AdminEffects from './admin/AdminEffects';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminContactInfo from './admin/AdminContactInfo';
import AdminSecurity from './admin/AdminSecurity';

const tabs = [
  { id: 'about', label: 'About', helper: 'Hero, bio, resume', icon: FaUser },
  { id: 'sections', label: 'Sections', helper: 'Order & headings', icon: FaLayerGroup },
  { id: 'projects', label: 'Projects', helper: 'Portfolio work', icon: FaFolderOpen },
  { id: 'skills', label: 'Skills', helper: 'Tech stack', icon: FaTools },
  { id: 'passion', label: 'Passion', helper: 'Focus cards', icon: FaRocket },
  { id: 'education', label: 'Education', helper: 'Academic timeline', icon: FaGraduationCap },
  { id: 'experience', label: 'Experience', helper: 'Career timeline', icon: FaBriefcase },
  { id: 'services', label: 'Services', helper: 'Offerings & packages', icon: FaConciergeBell },
  { id: 'testimonials', label: 'Reviews', helper: 'Endorsements', icon: FaCommentDots },
  { id: 'custom', label: 'Custom', helper: 'Custom sections', icon: FaPuzzlePiece },
  { id: 'navbar', label: 'Header', helper: 'Brand & navigation', icon: FaCompass },
  { id: 'footer', label: 'Footer', helper: 'Copyright & links', icon: FaShoePrints },
  { id: 'banners', label: 'Banners', helper: 'Announcements', icon: FaBullhorn },
  { id: 'seo', label: 'SEO', helper: 'Meta & search', icon: FaSearch },
  { id: 'effects', label: 'Effects', helper: 'Particles & audio', icon: FaMagic },
  { id: 'analytics', label: 'Analytics', helper: 'Traffic & stats', icon: FaChartLine },
  { id: 'contact', label: 'Contact', helper: 'Info and socials', icon: FaAddressBook },
  { id: 'security', label: 'Security', helper: 'Password & access', icon: FaShieldAlt },
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
      <div className="admin-shell flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="loading-mark text-xl">DR</div>
          <div className="loading-copy">
            <p>Loading Control Center...</p>
            <span />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <AdminAbout />;
      case 'sections':
        return <AdminSections />;
      case 'projects':
        return <AdminProjects />;
      case 'skills':
        return <AdminSkills />;
      case 'passion':
        return <AdminPassion />;
      case 'education':
        return <AdminEducation />;
      case 'experience':
        return <AdminExperience />;
      case 'services':
        return <AdminServices />;
      case 'testimonials':
        return <AdminTestimonials />;
      case 'custom':
        return <AdminCustomSections />;
      case 'navbar':
        return <AdminNavbar />;
      case 'footer':
        return <AdminFooter />;
      case 'banners':
        return <AdminBanners />;
      case 'seo':
        return <AdminSEO />;
      case 'effects':
        return <AdminEffects />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'contact':
        return <AdminContactInfo />;
      case 'security':
        return <AdminSecurity />;
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
              <h1 className="text-xl font-black sm:text-2xl">Admin Control Center</h1>
              <p className="mt-1 text-xs text-slate-500">
                Manage every piece of content, section, header, and SEO across the portfolio.
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
          className="mb-6 grid grid-cols-2 gap-2 rounded-lg border border-slate-800 bg-slate-900/40 p-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8"
          aria-label="Admin sections"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-16 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ${
                  isActive ? 'admin-tab-active' : 'admin-tab-idle'
                }`}
                aria-pressed={isActive}
              >
                <span className="flex items-center gap-2 text-xs sm:text-sm font-black">
                  <Icon className="text-xs shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </span>
                <span className="mt-1 block text-[11px] font-medium opacity-75 truncate">
                  {tab.helper}
                </span>
              </button>
            );
          })}
        </nav>

        <section key={activeTab}>{renderTabContent()}</section>
      </main>
    </div>
  );
}
