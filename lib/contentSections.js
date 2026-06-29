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
];

export function isContentSection(section) {
  return CONTENT_SECTIONS.includes(section);
}
