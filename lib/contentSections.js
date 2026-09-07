export const CONTENT_SECTIONS = [
  'projects',
  'skills',
  'education',
  'contactInfo',
  'socialLinks',
  'personalInfo',
  'passions',
  'resume',
  'profilePicture',
  'sectionsConfig',
  'sectionHeadings',
  'experiences',
  'services',
  'testimonials',
  'customSections',
  'navbarConfig',
  'footerConfig',
  'banners',
  'seoConfig',
];

export function isContentSection(section) {
  return CONTENT_SECTIONS.includes(section);
}
