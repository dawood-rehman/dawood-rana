import test from 'node:test';
import assert from 'node:assert/strict';
import { initialData } from '../lib/storage.js';

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
