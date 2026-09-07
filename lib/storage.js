// Local Storage utility functions
const STORAGE_KEYS = {
  PROJECTS: 'cms_projects',
  SKILLS: 'cms_skills',
  EDUCATION: 'cms_education',
  CONTACT_INFO: 'cms_contact_info',
  SOCIAL_LINKS: 'cms_social_links',
  PERSONAL_INFO: 'cms_personal_info',
  PASSIONS: 'cms_passions',
  RESUME: 'cms_resume',
  PROFILE_PICTURE: 'cms_profilePicture',
  SECTIONS_CONFIG: 'cms_sections_config',
  SECTION_HEADINGS: 'cms_section_headings',
  EXPERIENCES: 'cms_experiences',
  SERVICES: 'cms_services',
  TESTIMONIALS: 'cms_testimonials',
  CUSTOM_SECTIONS: 'cms_custom_sections',
  NAVBAR_CONFIG: 'cms_navbar_config',
  FOOTER_CONFIG: 'cms_footer_config',
  BANNERS: 'cms_banners',
  SEO_CONFIG: 'cms_seo_config',
};

const DEFAULT_DATA = {
  sectionsConfig: [
    { id: 'about', name: 'Hero / About', enabled: true, order: 1 },
    { id: 'passion', name: 'Focus / Passion', enabled: true, order: 2 },
    { id: 'projects', name: 'Projects', enabled: true, order: 3 },
    { id: 'education', name: 'Education', enabled: true, order: 4 },
    { id: 'skills', name: 'Skills', enabled: true, order: 5 },
    { id: 'experiences', name: 'Work Experience', enabled: false, order: 6 },
    { id: 'services', name: 'Services', enabled: false, order: 7 },
    { id: 'testimonials', name: 'Testimonials', enabled: false, order: 8 },
    { id: 'contact', name: 'Contact & Socials', enabled: true, order: 9 },
  ],
  sectionHeadings: {
    about: {
      eyebrow: 'Portfolio',
    },
    passion: {
      eyebrow: 'Focus',
      title: 'Building Useful Digital Products',
      subtitle: 'My work sits at the intersection of clean UI, reliable data, and practical problem solving.',
    },
    projects: {
      eyebrow: 'Selected Work',
      title: 'Projects With Real Product Shape',
      subtitle: 'A focused set of apps showing frontend craft, API integration, and database-backed workflows.',
    },
    education: {
      eyebrow: 'Background',
      title: 'Education',
      subtitle: 'A learning path shaped by science, computer science, and practical development.',
    },
    skills: {
      eyebrow: 'Toolkit',
      title: 'Skills',
      subtitle: 'Technologies I use to design, build, connect, and ship modern web applications.',
    },
    experiences: {
      eyebrow: 'Career',
      title: 'Work Experience',
      subtitle: 'A timeline of roles, engineering contributions, and key technical achievements.',
    },
    services: {
      eyebrow: 'Services',
      title: 'What I Can Deliver',
      subtitle: 'Modern web development, high-performance APIs, and end-to-end full-stack solutions.',
    },
    testimonials: {
      eyebrow: 'Testimonials',
      title: 'What People Say',
      subtitle: 'Feedback from collaborators, clients, and team members.',
    },
    contact: {
      eyebrow: 'Contact',
      title: "Let's Build Something Clean",
      subtitle: 'Reach out for portfolio work, web applications, dashboards, or collaboration.',
      socialTitle: 'Social Profiles',
      socialSubtitle: 'Professional links and direct channels.',
    },
  },
  personalInfo: {
    name: 'Dawood Rehman',
    title: 'Full-Stack Developer & Computer Science Student',
    bio: 'I build clean, responsive web experiences with modern JavaScript, thoughtful UI, and practical backend systems.',
    image: '',
    eyebrow: 'Portfolio',
    ctaPrimary: { label: 'View Projects', href: '#projects', enabled: true },
    ctaSecondary: { label: 'Resume', href: '', enabled: true },
    availabilityTitle: 'Available for focused web work',
    availabilitySubtitle: 'Next.js, React, MongoDB, APIs',
    deliveryTitle: 'Delivery',
    deliveryValue: 'Clean & responsive',
    stackTitle: 'Stack',
    stackValue: 'React + MongoDB',
    highlights: [
      { value: '10+', label: 'Projects' },
      { value: '1.5', label: 'Years Learning' },
      { value: 'Full-stack', label: 'Focus' },
    ],
    proofPoints: ['Next.js', 'MongoDB', 'API Design', 'Responsive UI'],
  },
  projects: [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with payment integration, user authentication, and admin dashboard.',
      tech: ['Next.js', 'MongoDB', 'Redux'],
      github: 'https://github.com/dawood-rehman/stoehub',
      live: 'https://stoehub.vercel.app/',
      gradient: 'from-blue-500 to-cyan-500',
      icon: 'FaCode',
      order: 1,
      enabled: true,
    },
    {
      id: '2',
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates and team collaboration features.',
      tech: ['TypeScript', 'Next.js', 'REST API'],
      github: 'https://github.com/dawood-rehman/project2',
      live: 'https://task-app-one-ivory.vercel.app',
      gradient: 'from-purple-500 to-pink-500',
      icon: 'FaServer',
      order: 2,
      enabled: true,
    },
    {
      id: '3',
      title: 'Post Data Dashboard',
      description: 'Analytics dashboard for social media management with data visualization and reporting tools.',
      tech: ['React', 'REST API', 'MongoDB'],
      github: 'https://github.com/dawood-rehman/post-data',
      live: 'https://post-data-bice.vercel.app/',
      gradient: 'from-orange-500 to-red-500',
      icon: 'FaCode',
      order: 3,
      enabled: true,
    },
    {
      id: '4',
      title: 'Weather Forecast App',
      description: 'Real-time weather forecasting application with location-based services and beautiful UI.',
      tech: ['JavaScript', 'API Integration', 'CSS3', 'HTML5'],
      github: 'https://github.com/dawood-rehman/earning',
      live: 'https://www.exploreweather.site/',
      gradient: 'from-green-500 to-emerald-500',
      icon: 'FaCode',
      order: 4,
      enabled: true,
    },
  ],
  passions: [
    {
      id: '1',
      icon: 'FaCode',
      title: 'Full-Stack Development',
      description: 'Building practical interfaces, APIs, and database-backed products that are easy to use and maintain.',
      order: 1,
      enabled: true,
    },
    {
      id: '2',
      icon: 'FaRocket',
      title: 'Product Thinking',
      description: 'Turning ideas into focused workflows with clear hierarchy, fast feedback, and responsive experiences.',
      order: 2,
      enabled: true,
    },
    {
      id: '3',
      icon: 'FaLightbulb',
      title: 'Problem Solving',
      description: 'Breaking complex requirements into simple, shippable pieces without losing sight of quality.',
      order: 3,
      enabled: true,
    },
    {
      id: '4',
      icon: 'FaBrain',
      title: 'Continuous Learning',
      description: 'Improving through modern tooling, real projects, and a habit of studying how good software feels.',
      order: 4,
      enabled: true,
    },
  ],
  education: [
    {
      id: '1',
      icon: 'FaSchool',
      title: 'High School',
      institution: 'Government MC High School',
      stream: 'Science Stream',
      color: 'from-blue-500 to-cyan-500',
      order: 1,
      enabled: true,
    },
    {
      id: '2',
      icon: 'FaGraduationCap',
      title: 'Higher Secondary',
      institution: 'Government MC Higher Secondary School',
      stream: 'Pre-Medical',
      color: 'from-purple-500 to-pink-500',
      order: 2,
      enabled: true,
    },
    {
      id: '3',
      icon: 'FaUniversity',
      title: "Bachelor's Degree",
      institution: 'Government College University Faisalabad',
      stream: 'Computer Science',
      color: 'from-orange-500 to-red-500',
      order: 3,
      enabled: true,
    },
  ],
  skills: [
    { id: '1', name: 'HTML', category: 'Frontend', color: 'from-orange-500 to-red-500', order: 1, enabled: true },
    { id: '2', name: 'CSS', category: 'Frontend', color: 'from-blue-500 to-cyan-500', order: 2, enabled: true },
    { id: '3', name: 'JavaScript', category: 'Frontend', color: 'from-yellow-500 to-orange-500', order: 3, enabled: true },
    { id: '4', name: 'TypeScript', category: 'Frontend', color: 'from-blue-600 to-indigo-600', order: 4, enabled: true },
    { id: '5', name: 'MongoDB', category: 'Backend', color: 'from-green-500 to-emerald-500', order: 5, enabled: true },
    { id: '6', name: 'API Integration', category: 'Backend', color: 'from-purple-500 to-pink-500', order: 6, enabled: true },
    { id: '7', name: 'GitHub', category: 'DevOps', color: 'from-gray-700 to-gray-900', order: 7, enabled: true },
    { id: '8', name: 'C++', category: 'Language', color: 'from-blue-700 to-blue-900', order: 8, enabled: true },
  ],
  experiences: [],
  services: [],
  testimonials: [],
  customSections: [],
  contactInfo: [
    {
      id: '1',
      icon: 'FaEnvelope',
      label: 'Email',
      value: 'rd535328@gmail.com',
      link: 'mailto:rd535328@gmail.com',
      order: 1,
      enabled: true,
    },
    {
      id: '2',
      icon: 'FaPhone',
      label: 'Phone',
      value: '+92 314 4885177',
      link: 'tel:+923144885177',
      order: 2,
      enabled: true,
    },
    {
      id: '3',
      icon: 'FaMapMarkerAlt',
      label: 'Location',
      value: 'Faisalabad, Pakistan',
      link: 'https://maps.google.com/?q=Faisalabad,Pakistan',
      order: 3,
      enabled: true,
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
      order: 1,
      enabled: true,
    },
    {
      id: '2',
      icon: 'FaInstagram',
      name: 'Instagram',
      url: 'https://www.instagram.com/_vibe_with_dawood?igsh=MW5lenhobzZxcHM4Zg==',
      color: 'from-pink-500 via-purple-500 to-rose-500',
      description: 'Follow my journey',
      order: 2,
      enabled: true,
    },
    {
      id: '3',
      icon: 'FaLinkedin',
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/dawood-rehman-b25230383?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      color: 'from-blue-700 to-blue-800',
      description: 'Professional network',
      order: 3,
      enabled: true,
    },
    {
      id: '4',
      icon: 'FaGithub',
      name: 'GitHub',
      url: 'https://github.com/dawood-rehman',
      color: 'from-gray-700 via-gray-800 to-gray-900',
      description: 'View my code',
      order: 4,
      enabled: true,
    },
    {
      id: '5',
      icon: 'FaWhatsapp',
      name: 'WhatsApp',
      url: 'https://wa.me/923144885177',
      color: 'from-green-500 to-green-600',
      description: 'Chat with me',
      order: 5,
      enabled: true,
    },
  ],
  navbarConfig: {
    logoInitials: 'DR',
    logoText: 'Dawood Rehman',
    logoHref: '#about',
    navItems: [
      { id: '1', name: 'About', href: '#about', isExternal: false, order: 1, enabled: true },
      { id: '2', name: 'Passion', href: '#passion', isExternal: false, order: 2, enabled: true },
      { id: '3', name: 'Projects', href: '#projects', isExternal: false, order: 3, enabled: true },
      { id: '4', name: 'Education', href: '#education', isExternal: false, order: 4, enabled: true },
      { id: '5', name: 'Skills', href: '#skills', isExternal: false, order: 5, enabled: true },
      { id: '6', name: 'Contact', href: '#contact', isExternal: false, order: 6, enabled: true },
    ],
    ctaButton: { label: '', href: '', enabled: false },
    enabled: true,
  },
  footerConfig: {
    copyrightText: '© {year} Dawood Rehman. All rights reserved.',
    description: '',
    legalLinks: [],
    showSocialLinks: false,
    showAdminButton: true,
  },
  banners: [],
  seoConfig: {
    siteTitle: 'Dawood Rehman | Full-Stack Developer & Software Engineer',
    metaDescription:
      'Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer specializing in high-performance web applications, modern APIs, and cloud services.',
    keywords:
      'Dawood Rehman, Dawood Rana, Full-Stack Developer, Software Engineer, Next.js Developer, React Developer, Node.js, Portfolio',
    canonicalUrl: 'https://dawoodrana.com',
    author: 'Dawood Rehman',
    ogTitle: 'Dawood Rehman | Full-Stack Developer & Software Engineer',
    ogDescription:
      'Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer specializing in modern web development.',
    ogImage: '',
    ogType: 'website',
    twitterTitle: 'Dawood Rehman | Full-Stack Developer & Software Engineer',
    twitterDescription:
      'Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer.',
    twitterCard: 'summary_large_image',
    twitterImage: '',
    robotsIndex: true,
    robotsFollow: true,
  },
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
  resume: STORAGE_KEYS.RESUME,
  profilePicture: STORAGE_KEYS.PROFILE_PICTURE,
  sectionsConfig: STORAGE_KEYS.SECTIONS_CONFIG,
  sectionHeadings: STORAGE_KEYS.SECTION_HEADINGS,
  experiences: STORAGE_KEYS.EXPERIENCES,
  services: STORAGE_KEYS.SERVICES,
  testimonials: STORAGE_KEYS.TESTIMONIALS,
  customSections: STORAGE_KEYS.CUSTOM_SECTIONS,
  navbarConfig: STORAGE_KEYS.NAVBAR_CONFIG,
  footerConfig: STORAGE_KEYS.FOOTER_CONFIG,
  banners: STORAGE_KEYS.BANNERS,
  seoConfig: STORAGE_KEYS.SEO_CONFIG,
};

const DB_FIELD_BY_STORAGE_KEY = {
  [STORAGE_KEYS.PROJECTS]: 'projects',
  [STORAGE_KEYS.SKILLS]: 'skills',
  [STORAGE_KEYS.EDUCATION]: 'education',
  [STORAGE_KEYS.CONTACT_INFO]: 'contactInfo',
  [STORAGE_KEYS.SOCIAL_LINKS]: 'socialLinks',
  [STORAGE_KEYS.PERSONAL_INFO]: 'personalInfo',
  [STORAGE_KEYS.PASSIONS]: 'passions',
  [STORAGE_KEYS.RESUME]: 'resume',
  [STORAGE_KEYS.PROFILE_PICTURE]: 'profilePicture',
  [STORAGE_KEYS.SECTIONS_CONFIG]: 'sectionsConfig',
  [STORAGE_KEYS.SECTION_HEADINGS]: 'sectionHeadings',
  [STORAGE_KEYS.EXPERIENCES]: 'experiences',
  [STORAGE_KEYS.SERVICES]: 'services',
  [STORAGE_KEYS.TESTIMONIALS]: 'testimonials',
  [STORAGE_KEYS.CUSTOM_SECTIONS]: 'customSections',
  [STORAGE_KEYS.NAVBAR_CONFIG]: 'navbarConfig',
  [STORAGE_KEYS.FOOTER_CONFIG]: 'footerConfig',
  [STORAGE_KEYS.BANNERS]: 'banners',
  [STORAGE_KEYS.SEO_CONFIG]: 'seoConfig',
};

const STORAGE_EVENT_BY_KEY = {
  [STORAGE_KEYS.PROJECTS]: 'projectsUpdated',
  [STORAGE_KEYS.SKILLS]: 'skillsUpdated',
  [STORAGE_KEYS.EDUCATION]: 'educationUpdated',
  [STORAGE_KEYS.CONTACT_INFO]: 'contactUpdated',
  [STORAGE_KEYS.SOCIAL_LINKS]: 'socialsUpdated',
  [STORAGE_KEYS.PERSONAL_INFO]: 'personalInfoUpdated',
  [STORAGE_KEYS.PASSIONS]: 'passionsUpdated',
  [STORAGE_KEYS.RESUME]: 'resumeUpdated',
  [STORAGE_KEYS.PROFILE_PICTURE]: 'profilePictureUpdated',
  [STORAGE_KEYS.SECTIONS_CONFIG]: 'sectionsConfigUpdated',
  [STORAGE_KEYS.SECTION_HEADINGS]: 'sectionHeadingsUpdated',
  [STORAGE_KEYS.EXPERIENCES]: 'experiencesUpdated',
  [STORAGE_KEYS.SERVICES]: 'servicesUpdated',
  [STORAGE_KEYS.TESTIMONIALS]: 'testimonialsUpdated',
  [STORAGE_KEYS.CUSTOM_SECTIONS]: 'customSectionsUpdated',
  [STORAGE_KEYS.NAVBAR_CONFIG]: 'navbarConfigUpdated',
  [STORAGE_KEYS.FOOTER_CONFIG]: 'footerConfigUpdated',
  [STORAGE_KEYS.BANNERS]: 'bannersUpdated',
  [STORAGE_KEYS.SEO_CONFIG]: 'seoConfigUpdated',
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

const scheduleHydrateFromDatabase = () => {
  if (typeof window === 'undefined') return Promise.resolve();

  if ('requestIdleCallback' in window) {
    return new Promise((resolve) => {
      window.requestIdleCallback(
        () => {
          hydrateFromDatabase().finally(resolve);
        },
        { timeout: 1800 }
      );
    });
  }

  return new Promise((resolve) => {
    window.setTimeout(() => {
      hydrateFromDatabase().finally(resolve);
    }, 250);
  });
};

const syncToDatabase = async (key, value) => {
  if (typeof window === 'undefined') return;

  const section = DB_FIELD_BY_STORAGE_KEY[key];
  if (!section) return;

  try {
    const response = await fetch(`/api/content/${section}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.warn(`Sync failed for ${section}:`, data.message || response.statusText);
    }
  } catch (error) {
    console.warn(`Sync network error for ${section}:`, error);
  }
};

// Update content section directly via authenticated API call and update local cache
export const saveContentSection = async (section, value) => {
  const storageKey = DATA_KEY_TO_STORAGE_KEY[section] || `cms_${section}`;

  const response = await fetch(`/api/content/${section}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.message || `Failed to update ${section} section`);
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (err) {
      console.warn('Failed to update localStorage cache (quota or disabled):', err);
    }
    emitStorageEvents([storageKey]);
  }

  return { success: true, value: data.value };
};

// Initialize storage with default data if empty
export const initializeStorage = async (options = {}) => {
  if (typeof window === 'undefined') return;

  Object.entries(DEFAULT_DATA).forEach(([key, value]) => {
    const storageKey = DATA_KEY_TO_STORAGE_KEY[key] || `cms_${key}`;
    if (!localStorage.getItem(storageKey)) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } catch (e) {
        console.warn('Storage init skipped:', e);
      }
    }
  });

  if (options.immediateHydrate) {
    await hydrateFromDatabase();
    return;
  }

  await scheduleHydrateFromDatabase();
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

export { STORAGE_KEYS, DEFAULT_DATA, DEFAULT_DATA as initialData };
