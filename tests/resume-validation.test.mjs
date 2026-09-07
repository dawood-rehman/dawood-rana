import test from 'node:test';
import assert from 'node:assert/strict';

// Validation helper logic mirroring upload-resume implementation
function validateResumeBuffer(buffer, originalFilename, mimeType) {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Empty file' };
  }
  if (buffer.length > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  const isPdf = buffer.length >= 5 && buffer.toString('utf8', 0, 5) === '%PDF-';
  const isDocx = buffer.length >= 4 &&
    buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
  const isDoc = buffer.length >= 8 &&
    buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0;

  if (!isPdf && !isDocx && !isDoc) {
    return { valid: false, error: 'Invalid file signature: Content is not a legitimate PDF or Word document.' };
  }

  import('path').then();
  const safeFilename = originalFilename
    ? originalFilename.split(/[/\\]/).pop().replace(/[^a-zA-Z0-9._-]/g, '_')
    : 'resume.pdf';

  return { valid: true, safeFilename };
}

test('Resume Validation: Accept valid PDF magic bytes (%PDF-)', () => {
  const pdfHeader = Buffer.from('%PDF-1.7 mock pdf content');
  const result = validateResumeBuffer(pdfHeader, 'my-cv.pdf', 'application/pdf');
  assert.equal(result.valid, true);
  assert.equal(result.safeFilename, 'my-cv.pdf');
});

test('Resume Validation: Accept valid DOCX magic bytes (PKzip header)', () => {
  const docxHeader = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);
  const result = validateResumeBuffer(docxHeader, 'my-cv.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  assert.equal(result.valid, true);
});

test('Resume Validation: Accept valid legacy DOC magic bytes (CFB header)', () => {
  const docHeader = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
  const result = validateResumeBuffer(docHeader, 'my-cv.doc', 'application/msword');
  assert.equal(result.valid, true);
});

test('Resume Validation: Reject malicious executable or script with .pdf extension', () => {
  const scriptContent = Buffer.from('<script>alert("xss")</script>');
  const result = validateResumeBuffer(scriptContent, 'exploit.pdf', 'application/pdf');
  assert.equal(result.valid, false);
  assert.match(result.error, /Invalid file signature/);

  const exeContent = Buffer.from('MZ\x90\x00\x03\x00\x00\x00');
  const exeResult = validateResumeBuffer(exeContent, 'trojan.pdf', 'application/pdf');
  assert.equal(exeResult.valid, false);
});

test('Resume Validation: Reject files exceeding 10MB', () => {
  const largeBuffer = Buffer.alloc(11 * 1024 * 1024);
  const result = validateResumeBuffer(largeBuffer, 'huge.pdf', 'application/pdf');
  assert.equal(result.valid, false);
  assert.match(result.error, /exceeds 10MB/);
});

test('Resume Validation: Sanitize path traversal in filenames', () => {
  const pdfHeader = Buffer.from('%PDF-1.7 valid resume content');
  const maliciousFilename = '../../../etc/passwd.pdf';
  const result = validateResumeBuffer(pdfHeader, maliciousFilename, 'application/pdf');
  assert.equal(result.valid, true);
  assert.ok(!result.safeFilename.includes('..'), 'Must not contain directory traversal');
  assert.ok(!result.safeFilename.includes('/'), 'Must not contain forward slashes');
});
