import test from 'node:test';
import assert from 'node:assert/strict';
import { initialData } from '../lib/storage.js';
import { CONTENT_SECTIONS, isContentSection } from '../lib/contentSections.js';

test('Content Structure: Initial data integrity', () => {
  assert.ok(initialData, 'Initial data must exist');
  assert.ok(initialData.personalInfo, 'personalInfo must exist');
  assert.ok(initialData.personalInfo.name, 'name must exist');
  assert.ok(Array.isArray(initialData.projects), 'projects must be an array');
  assert.ok(Array.isArray(initialData.skills), 'skills must be an array');
  assert.ok(Array.isArray(initialData.education), 'education must be an array');
  assert.ok(Array.isArray(initialData.passions), 'passions must be an array');
  assert.ok(initialData.contactInfo, 'contactInfo must exist');
});

test('Content Structure: Project items contain required fields', () => {
  initialData.projects.forEach((proj, idx) => {
    assert.ok(proj.title, `Project at index ${idx} must have title`);
    assert.ok(proj.description, `Project at index ${idx} must have description`);
    assert.ok(Array.isArray(proj.tech), `Project at index ${idx} must have tech array`);
  });
});

test('Content Structure: CMS dynamic sections configuration', () => {
  assert.ok(Array.isArray(initialData.sectionsConfig), 'sectionsConfig must be an array');
  assert.ok(initialData.sectionsConfig.length > 0, 'sectionsConfig must have sections');
  const aboutSec = initialData.sectionsConfig.find((s) => s.id === 'about');
  assert.ok(aboutSec, 'about section must exist in sectionsConfig');
  assert.equal(aboutSec.enabled, true, 'about section should be enabled by default');

  assert.ok(initialData.sectionHeadings, 'sectionHeadings must exist');
  assert.ok(initialData.sectionHeadings.passion?.title, 'passion heading must have title');
  assert.ok(initialData.sectionHeadings.projects?.title, 'projects heading must have title');
});

test('Content Structure: Navbar and Footer configuration', () => {
  assert.ok(initialData.navbarConfig, 'navbarConfig must exist');
  assert.equal(initialData.navbarConfig.logoInitials, 'DR');
  assert.ok(Array.isArray(initialData.navbarConfig.navItems), 'navItems must be an array');
  assert.ok(initialData.navbarConfig.navItems.length >= 5, 'navItems should have primary navigation items');

  assert.ok(initialData.footerConfig, 'footerConfig must exist');
  assert.ok(initialData.footerConfig.copyrightText.includes('{year}'));
});

test('Content Structure: SEO configuration', () => {
  assert.ok(initialData.seoConfig, 'seoConfig must exist');
  assert.ok(initialData.seoConfig.siteTitle, 'SEO siteTitle must exist');
  assert.ok(initialData.seoConfig.metaDescription, 'SEO metaDescription must exist');
  assert.equal(initialData.seoConfig.robotsIndex, true);
});

test('Content Structure: Content sections whitelist validation', () => {
  const expectedSections = [
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
    'particleConfig',
    'soundConfig',
    'analyticsConfig',
    'projects',
    'skills',
    'education',
    'contactInfo',
    'socialLinks',
    'personalInfo',
    'passions',
  ];

  expectedSections.forEach((section) => {
    assert.ok(
      isContentSection(section),
      `Section ${section} must be in CONTENT_SECTIONS whitelist`
    );
  });
});

test('Content Structure: Particle and Sound Effects configuration', () => {
  assert.ok(initialData.particleConfig, 'particleConfig must exist in initialData');
  assert.equal(initialData.particleConfig.enabled, true);
  assert.equal(typeof initialData.particleConfig.particleCount, 'number');
  assert.equal(typeof initialData.particleConfig.speed, 'number');
  assert.equal(initialData.particleConfig.connectLines, true);
  assert.equal(initialData.particleConfig.interactive, true);

  assert.ok(initialData.soundConfig, 'soundConfig must exist in initialData');
  assert.equal(initialData.soundConfig.enabled, true);
  assert.equal(typeof initialData.soundConfig.volume, 'number');
  assert.equal(initialData.soundConfig.enableThemeToggle, true);
  assert.equal(initialData.soundConfig.enableButtonClicks, true);
  assert.equal(initialData.soundConfig.enableModals, true);
});
