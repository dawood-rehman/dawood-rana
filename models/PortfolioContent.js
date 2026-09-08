import mongoose from 'mongoose';

const { Schema } = mongoose;

const requiredString = { type: String, trim: true, required: true };
const optionalString = { type: String, trim: true, default: '' };

const statHighlightSchema = new Schema(
  {
    value: requiredString,
    label: requiredString,
  },
  { _id: false }
);

const ctaButtonSchema = new Schema(
  {
    label: optionalString,
    href: optionalString,
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const projectSchema = new Schema(
  {
    id: requiredString,
    title: requiredString,
    description: requiredString,
    tech: { type: [String], default: [] },
    github: optionalString,
    live: optionalString,
    gradient: { type: String, default: 'from-blue-500 to-cyan-500' },
    icon: { type: String, default: 'FaCode' },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const skillSchema = new Schema(
  {
    id: requiredString,
    name: requiredString,
    category: { type: String, default: 'General' },
    color: { type: String, default: 'from-blue-500 to-cyan-500' },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const educationSchema = new Schema(
  {
    id: requiredString,
    icon: { type: String, default: 'FaGraduationCap' },
    title: requiredString,
    institution: requiredString,
    stream: optionalString,
    color: { type: String, default: 'from-blue-500 to-cyan-500' },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const experienceSchema = new Schema(
  {
    id: requiredString,
    company: requiredString,
    role: requiredString,
    employmentType: { type: String, default: 'Full-time' },
    startDate: requiredString,
    endDate: { type: String, default: 'Present' },
    current: { type: Boolean, default: false },
    location: optionalString,
    description: requiredString,
    technologies: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const serviceSchema = new Schema(
  {
    id: requiredString,
    title: requiredString,
    description: requiredString,
    icon: { type: String, default: 'FaCode' },
    features: { type: [String], default: [] },
    ctaLabel: optionalString,
    ctaUrl: optionalString,
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const testimonialSchema = new Schema(
  {
    id: requiredString,
    clientName: requiredString,
    position: optionalString,
    company: optionalString,
    avatar: optionalString,
    content: requiredString,
    rating: { type: Number, default: 5 },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const customSectionItemSchema = new Schema(
  {
    id: requiredString,
    title: requiredString,
    subtitle: optionalString,
    date: optionalString,
    description: optionalString,
    link: optionalString,
    icon: { type: String, default: 'FaCode' },
  },
  { _id: false }
);

const customSectionSchema = new Schema(
  {
    id: requiredString,
    slug: requiredString,
    eyebrow: optionalString,
    title: requiredString,
    subtitle: optionalString,
    layout: { type: String, default: 'grid' },
    items: { type: [customSectionItemSchema], default: [] },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const contactSchema = new Schema(
  {
    id: requiredString,
    icon: { type: String, default: 'FaEnvelope' },
    label: requiredString,
    value: requiredString,
    link: optionalString,
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const socialSchema = new Schema(
  {
    id: requiredString,
    icon: { type: String, default: 'FaGithub' },
    name: requiredString,
    url: requiredString,
    color: { type: String, default: 'from-slate-700 to-slate-900' },
    description: optionalString,
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const personalInfoSchema = new Schema(
  {
    name: { type: String, trim: true, default: 'Dawood Rehman' },
    title: { type: String, trim: true, default: 'Full-Stack Developer & Computer Science Student' },
    bio: optionalString,
    image: optionalString,
    eyebrow: { type: String, default: 'Portfolio' },
    ctaPrimary: {
      type: ctaButtonSchema,
      default: () => ({ label: 'View Projects', href: '#projects', enabled: true }),
    },
    ctaSecondary: {
      type: ctaButtonSchema,
      default: () => ({ label: 'Resume', href: '', enabled: true }),
    },
    availabilityTitle: { type: String, default: 'Available for focused web work' },
    availabilitySubtitle: { type: String, default: 'Next.js, React, MongoDB, APIs' },
    deliveryTitle: { type: String, default: 'Delivery' },
    deliveryValue: { type: String, default: 'Clean & responsive' },
    stackTitle: { type: String, default: 'Stack' },
    stackValue: { type: String, default: 'React + MongoDB' },
    highlights: { type: [statHighlightSchema], default: [] },
    proofPoints: { type: [String], default: [] },
  },
  { _id: false }
);

const passionSchema = new Schema(
  {
    id: requiredString,
    icon: { type: String, default: 'FaCode' },
    title: requiredString,
    description: requiredString,
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const resumeSchema = new Schema(
  {
    url: optionalString,
    name: optionalString,
    contentType: optionalString,
    data: optionalString,
    size: { type: Number, default: 0 },
    uploadedAt: { type: Date },
  },
  { _id: false }
);

const sectionConfigSchema = new Schema(
  {
    id: requiredString,
    name: requiredString,
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const navItemSchema = new Schema(
  {
    id: requiredString,
    name: requiredString,
    href: requiredString,
    isExternal: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const navbarConfigSchema = new Schema(
  {
    logoInitials: { type: String, default: 'DR' },
    logoText: { type: String, default: 'Dawood Rehman' },
    logoHref: { type: String, default: '#about' },
    navItems: { type: [navItemSchema], default: [] },
    ctaButton: {
      type: ctaButtonSchema,
      default: () => ({ label: '', href: '', enabled: false }),
    },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const footerLinkSchema = new Schema(
  {
    name: requiredString,
    href: requiredString,
    isExternal: { type: Boolean, default: false },
  },
  { _id: false }
);

const footerConfigSchema = new Schema(
  {
    copyrightText: { type: String, default: '© {year} Dawood Rehman. All rights reserved.' },
    description: optionalString,
    legalLinks: { type: [footerLinkSchema], default: [] },
    showSocialLinks: { type: Boolean, default: true },
    showAdminButton: { type: Boolean, default: true },
  },
  { _id: false }
);

const bannerSchema = new Schema(
  {
    id: requiredString,
    title: optionalString,
    text: requiredString,
    ctaText: optionalString,
    ctaUrl: optionalString,
    enabled: { type: Boolean, default: false },
    style: { type: String, default: 'info' },
  },
  { _id: false }
);

const seoConfigSchema = new Schema(
  {
    siteTitle: { type: String, default: 'Dawood Rehman | Full-Stack Developer & Software Engineer' },
    metaDescription: {
      type: String,
      default:
        'Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer specializing in high-performance web applications, modern APIs, and cloud services.',
    },
    keywords: {
      type: String,
      default:
        'Dawood Rehman, Dawood Rana, Full-Stack Developer, Software Engineer, Next.js Developer, React Developer, Node.js, Portfolio',
    },
    canonicalUrl: { type: String, default: 'https://dawoodrana.com' },
    author: { type: String, default: 'Dawood Rehman' },
    ogTitle: { type: String, default: 'Dawood Rehman | Full-Stack Developer & Software Engineer' },
    ogDescription: {
      type: String,
      default:
        'Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer specializing in modern web development.',
    },
    ogImage: optionalString,
    ogType: { type: String, default: 'website' },
    twitterTitle: { type: String, default: 'Dawood Rehman | Full-Stack Developer & Software Engineer' },
    twitterDescription: {
      type: String,
      default: 'Portfolio of Dawood Rehman - Computer Science student and Full-Stack Developer.',
    },
    twitterCard: { type: String, default: 'summary_large_image' },
    twitterImage: optionalString,
    robotsIndex: { type: Boolean, default: true },
    robotsFollow: { type: Boolean, default: true },
  },
  { _id: false }
);

const particleConfigSchema = new Schema(
  {
    enabled: { type: Boolean, default: true },
    particleCount: { type: Number, default: 45 },
    speed: { type: Number, default: 0.8 },
    connectLines: { type: Boolean, default: true },
    interactive: { type: Boolean, default: true },
    colorTheme: { type: String, default: 'auto' },
  },
  { _id: false }
);

const soundConfigSchema = new Schema(
  {
    enabled: { type: Boolean, default: true },
    volume: { type: Number, default: 0.2 },
    enableThemeToggle: { type: Boolean, default: true },
    enableButtonClicks: { type: Boolean, default: true },
    enableModals: { type: Boolean, default: true },
    soundTheme: { type: String, default: 'modern' },
  },
  { _id: false }
);

const portfolioContentSchema = new Schema(
  {
    singleton: {
      type: String,
      default: 'main',
      unique: true,
      immutable: true,
    },
    sectionsConfig: { type: [sectionConfigSchema], default: [] },
    sectionHeadings: { type: Schema.Types.Mixed, default: {} },
    personalInfo: { type: personalInfoSchema, default: () => ({}) },
    projects: { type: [projectSchema], default: [] },
    experiences: { type: [experienceSchema], default: [] },
    skills: { type: [skillSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    passions: { type: [passionSchema], default: [] },
    services: { type: [serviceSchema], default: [] },
    testimonials: { type: [testimonialSchema], default: [] },
    customSections: { type: [customSectionSchema], default: [] },
    contactInfo: { type: [contactSchema], default: [] },
    socialLinks: { type: [socialSchema], default: [] },
    navbarConfig: { type: navbarConfigSchema, default: () => ({}) },
    footerConfig: { type: footerConfigSchema, default: () => ({}) },
    banners: { type: [bannerSchema], default: [] },
    seoConfig: { type: seoConfigSchema, default: () => ({}) },
    particleConfig: { type: particleConfigSchema, default: () => ({}) },
    soundConfig: { type: soundConfigSchema, default: () => ({}) },
    resume: { type: resumeSchema, default: null },
    profilePicture: optionalString,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.PortfolioContent ||
  mongoose.model('PortfolioContent', portfolioContentSchema);
