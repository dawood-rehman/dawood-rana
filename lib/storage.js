// Local Storage utility functions
const STORAGE_KEYS = {
  PROJECTS: 'cms_projects',
  SKILLS: 'cms_skills',
  EDUCATION: 'cms_education',
  CONTACT_INFO: 'cms_contact_info',
  SOCIAL_LINKS: 'cms_social_links',
  PERSONAL_INFO: 'cms_personal_info',
  PASSIONS: 'cms_passions',
  WORK_EXPERIENCE: 'cms_work_experience',
  CERTIFICATIONS: 'cms_certifications',
  ACHIEVEMENTS: 'cms_achievements',
  RESUME: 'cms_resume',
  PROFILE_PICTURE: 'cms_profilePicture',
};

const DEFAULT_DATA = {
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
  passions: [
    {
      id: '1',
      icon: 'FaCode',
      title: 'Full-Stack Development',
      description: 'Building practical interfaces, APIs, and database-backed products that are easy to use and maintain.',
    },
    {
      id: '2',
      icon: 'FaRocket',
      title: 'Product Thinking',
      description: 'Turning ideas into focused workflows with clear hierarchy, fast feedback, and responsive experiences.',
    },
    {
      id: '3',
      icon: 'FaLightbulb',
      title: 'Problem Solving',
      description: 'Breaking complex requirements into simple, shippable pieces without losing sight of quality.',
    },
    {
      id: '4',
      icon: 'FaBrain',
      title: 'Continuous Learning',
      description: 'Improving through modern tooling, real projects, and a habit of studying how good software feels.',
    },
  ],
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
  resume: null,
  profilePicture: '',
};

const DATA_KEY_TO_STORAGE_KEY = {
  projects: STORAGE_KEYS.PROJECTS,
  skills: STORAGE_KEYS.SKILLS,
  education: STORAGE_KEYS.EDUCATION,
  contactInfo: STORAGE_KEYS.CONTACT_INFO,
  socialLinks: STORAGE_KEYS.SOCIAL_LINKS,
  personalInfo: STORAGE_KEYS.PERSONAL_INFO,
  passions: STORAGE_KEYS.PASSIONS,
  workExperience: STORAGE_KEYS.WORK_EXPERIENCE,
  certifications: STORAGE_KEYS.CERTIFICATIONS,
  achievements: STORAGE_KEYS.ACHIEVEMENTS,
  resume: STORAGE_KEYS.RESUME,
  profilePicture: STORAGE_KEYS.PROFILE_PICTURE,
};

const DB_FIELD_BY_STORAGE_KEY = {
  [STORAGE_KEYS.PROJECTS]: 'projects',
  [STORAGE_KEYS.SKILLS]: 'skills',
  [STORAGE_KEYS.EDUCATION]: 'education',
  [STORAGE_KEYS.CONTACT_INFO]: 'contactInfo',
  [STORAGE_KEYS.SOCIAL_LINKS]: 'socialLinks',
  [STORAGE_KEYS.PERSONAL_INFO]: 'personalInfo',
  [STORAGE_KEYS.PASSIONS]: 'passions',
  [STORAGE_KEYS.WORK_EXPERIENCE]: 'workExperience',
  [STORAGE_KEYS.CERTIFICATIONS]: 'certifications',
  [STORAGE_KEYS.ACHIEVEMENTS]: 'achievements',
  [STORAGE_KEYS.RESUME]: 'resume',
  [STORAGE_KEYS.PROFILE_PICTURE]: 'profilePicture',
};

const STORAGE_EVENT_BY_KEY = {
  [STORAGE_KEYS.PROJECTS]: 'projectsUpdated',
  [STORAGE_KEYS.SKILLS]: 'skillsUpdated',
  [STORAGE_KEYS.EDUCATION]: 'educationUpdated',
  [STORAGE_KEYS.CONTACT_INFO]: 'contactUpdated',
  [STORAGE_KEYS.SOCIAL_LINKS]: 'socialsUpdated',
  [STORAGE_KEYS.PERSONAL_INFO]: 'personalInfoUpdated',
  [STORAGE_KEYS.PASSIONS]: 'passionsUpdated',
  [STORAGE_KEYS.WORK_EXPERIENCE]: 'experienceUpdated',
  [STORAGE_KEYS.CERTIFICATIONS]: 'certificationsUpdated',
  [STORAGE_KEYS.ACHIEVEMENTS]: 'achievementsUpdated',
  [STORAGE_KEYS.RESUME]: 'resumeUpdated',
  [STORAGE_KEYS.PROFILE_PICTURE]: 'profilePictureUpdated',
};

const emitStorageEvents = (keys = []) => {
  if (typeof window === 'undefined') return;

  keys.forEach((key) => {
    const eventName = STORAGE_EVENT_BY_KEY[key];
    if (eventName) window.dispatchEvent(new Event(eventName));
  });

  window.dispatchEvent(new Event('portfolioContentUpdated'));
};

const hydrateFromDatabase = async () => {
  if (typeof window === 'undefined') return;

  try {
    const response = await fetch('/api/content', { cache: 'no-store' });
    if (!response.ok) return;

    const payload = await response.json();
    const content = payload?.data;
    if (!content) return;

    const hydratedKeys = [];
    Object.entries(DB_FIELD_BY_STORAGE_KEY).forEach(([storageKey, field]) => {
      if (Object.prototype.hasOwnProperty.call(content, field) && content[field] !== undefined) {
        localStorage.setItem(storageKey, JSON.stringify(content[field]));
        hydratedKeys.push(storageKey);
      }
    });

    emitStorageEvents(hydratedKeys);
  } catch (error) {
    console.warn('MongoDB content hydrate skipped:', error);
  }
};

const syncToDatabase = (key, value) => {
  if (typeof window === 'undefined') return;

  const section = DB_FIELD_BY_STORAGE_KEY[key];
  if (!section) return;

  fetch(`/api/content/${section}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  }).catch((error) => {
    console.warn(`MongoDB sync failed for ${section}:`, error);
  });
};

// Initialize storage with default data if empty
export const initializeStorage = async () => {
  if (typeof window === 'undefined') return;

  Object.entries(DEFAULT_DATA).forEach(([key, value]) => {
    const storageKey = DATA_KEY_TO_STORAGE_KEY[key] || `cms_${key}`;
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  });

  await hydrateFromDatabase();
};

// Get data from storage
export const getFromStorage = (key, defaultValue = null) => {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    const item = localStorage.getItem(key);
    return item ?? defaultValue;
  }
};

// Save data to storage
export const saveToStorage = (key, value, options = {}) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
    emitStorageEvents([key]);
    if (options.sync !== false) {
      syncToDatabase(key, value);
    }
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
  }
};

// Remove data from storage
export const removeFromStorage = (key) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(key);
    emitStorageEvents([key]);
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
