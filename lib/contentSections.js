export const CONTENT_SECTIONS = [
  'projects',
  'skills',
  'education',
  'contactInfo',
  'socialLinks',
  'personalInfo',
  'passions',
  'workExperience',
  'certifications',
  'achievements',
  'resume',
  'profilePicture',
];

export function isContentSection(section) {
  return CONTENT_SECTIONS.includes(section);
}
