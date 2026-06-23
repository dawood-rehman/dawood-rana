// Local Storage utility functions
const STORAGE_KEYS = {
  ADMIN_CREDENTIALS: 'cms_admin_credentials',
  PROJECTS: 'cms_projects',
  SKILLS: 'cms_skills',
  EDUCATION: 'cms_education',
  CONTACT_INFO: 'cms_contact_info',
  SOCIAL_LINKS: 'cms_social_links',
  PERSONAL_INFO: 'cms_personal_info',
  WORK_EXPERIENCE: 'cms_work_experience',
  CERTIFICATIONS: 'cms_certifications',
  ACHIEVEMENTS: 'cms_achievements',
};

const DEFAULT_DATA = {
  adminCredentials: {
    password: 'Rd535328@',
  },
  projects: [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with payment integration, user authentication, and admin dashboard.',
      tech: ['Next.js', 'MongoDB', 'Redux'],
      github: 'https://github.com/saabra926/stoehub',
      live: 'https://stoehub.vercel.app/',
      gradient: 'from-blue-500 to-cyan-500',
      icon: 'FaCode',
    },
    {
      id: '2',
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates and team collaboration features.',
      tech: ['TypeScript', 'Next.js', 'REST API'],
      github: 'https://github.com/saabra926/project2',
      live: 'https://task-app-one-ivory.vercel.app',
      gradient: 'from-purple-500 to-pink-500',
      icon: 'FaServer',
    },
    {
      id: '3',
      title: 'Post Data Dashboard',
      description: 'Analytics dashboard for social media management with data visualization and reporting tools.',
      tech: ['React', 'REST API', 'MongoDB'],
      github: 'https://github.com/saabra926/post-data',
      live: 'https://post-data-bice.vercel.app/',
      gradient: 'from-orange-500 to-red-500',
      icon: 'FaCode',
    },
    {
      id: '4',
      title: 'Weather Forecast App',
      description: 'Real-time weather forecasting application with location-based services and beautiful UI.',
      tech: ['JavaScript', 'API Integration', 'CSS3', 'HTML5'],
      github: 'https://github.com/saabra926/earning',
      live: 'https://www.exploreweather.site/',
      gradient: 'from-green-500 to-emerald-500',
      icon: 'FaCode',
    },
  ],
  skills: [
    { id: '1', name: 'HTML', color: 'from-orange-500 to-red-500' },
    { id: '2', name: 'CSS', color: 'from-blue-500 to-cyan-500' },
    { id: '3', name: 'JavaScript', color: 'from-yellow-500 to-orange-500' },
    { id: '4', name: 'TypeScript', color: 'from-blue-600 to-indigo-600' },
    { id: '5', name: 'MongoDB', color: 'from-green-500 to-emerald-500' },
    { id: '6', name: 'API Integration', color: 'from-purple-500 to-pink-500' },
    { id: '7', name: 'GitHub', color: 'from-gray-700 to-gray-900' },
    { id: '8', name: 'C++', color: 'from-blue-700 to-blue-900' },
  ],
  education: [
    {
      id: '1',
      icon: 'FaSchool',
      title: 'High School',
      institution: 'Government MC High School',
      stream: 'Science Stream',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: '2',
      icon: 'FaGraduationCap',
      title: 'Higher Secondary',
      institution: 'Government MC Higher Secondary School',
      stream: 'Pre-Medical',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: '3',
      icon: 'FaUniversity',
      title: "Bachelor's Degree",
      institution: 'Government College University Faisalabad',
      stream: 'Computer Science',
      color: 'from-orange-500 to-red-500',
    },
  ],
  socialLinks: [
    {
      id: '1',
      icon: 'FaFacebook',
      name: 'Facebook',
      url: 'https://www.facebook.com/itx.rajpootdawood',
      color: 'from-blue-600 to-blue-700',
      description: 'Connect with me',
    },
    {
      id: '2',
      icon: 'FaInstagram',
      name: 'Instagram',
      url: 'https://www.instagram.com/_vibe_with_dawood?igsh=MW5lenhobzZxcHM4Zg==',
      color: 'from-pink-500 via-purple-500 to-rose-500',
      description: 'Follow my journey',
    },
    {
      id: '3',
      icon: 'FaLinkedin',
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/dawood-rehman-b25230383?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      color: 'from-blue-700 to-blue-800',
      description: 'Professional network',
    },
    {
      id: '4',
      icon: 'FaGithub',
      name: 'GitHub',
      url: 'https://github.com/saabra926',
      color: 'from-gray-700 via-gray-800 to-gray-900',
      description: 'View my code',
    },
    {
      id: '5',
      icon: 'FaWhatsapp',
      name: 'WhatsApp',
      url: 'https://wa.me/923144885177',
      color: 'from-green-500 to-green-600',
      description: 'Chat with me',
    },
  ],
  contactInfo: [
    {
      id: '1',
      icon: 'FaEnvelope',
      label: 'Email',
      value: 'rd535328@gmail.com',
      link: 'mailto:rd535328@gmail.com',
    },
    {
      id: '2',
      icon: 'FaPhone',
      label: 'Phone',
      value: '+92 314 4885177',
      link: 'tel:+923144885177',
    },
    {
      id: '3',
      icon: 'FaMapMarkerAlt',
      label: 'Location',
      value: 'Faisalabad, Pakistan',
      link: 'https://maps.google.com/?q=Faisalabad,Pakistan',
    },
  ],
  personalInfo: {
    name: 'Dawood Rehman',
    title: 'Full-Stack Developer & Computer Science Student',
    bio: 'Passionate about creating beautiful and functional web experiences. Always learning and exploring new technologies.',
    image: '/profile.jpg',
  },
  workExperience: [
    {
      id: '1',
      title: 'Full-Stack Developer',
      company: 'Tech Company',
      duration: '2023 - Present',
      description: 'Building scalable web applications with modern technologies.',
    },
  ],
  certifications: [
    {
      id: '1',
      title: 'Web Development Certification',
      issuer: 'Online Platform',
      year: '2023',
    },
  ],
  achievements: [
    {
      id: '1',
      title: 'Top Developer',
      description: 'Recognized as a top contributor in the tech community.',
      year: '2024',
    },
  ],
};

// Initialize storage with default data if empty
export const initializeStorage = () => {
  if (typeof window === 'undefined') return;

  Object.entries(DEFAULT_DATA).forEach(([key, value]) => {
    const storageKey = STORAGE_KEYS[key.toUpperCase()] || `cms_${key}`;
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  });
};

// Get data from storage
export const getFromStorage = (key, defaultValue = null) => {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from storage (${key}):`, error);
    return defaultValue;
  }
};

// Save data to storage
export const saveToStorage = (key, value) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
  }
};

// Remove data from storage
export const removeFromStorage = (key) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from storage (${key}):`, error);
  }
};

// Clear all storage
export const clearAllStorage = () => {
  if (typeof window === 'undefined') return;

  Object.values(STORAGE_KEYS).forEach((key) => {
    removeFromStorage(key);
  });
};

export { STORAGE_KEYS, DEFAULT_DATA };
