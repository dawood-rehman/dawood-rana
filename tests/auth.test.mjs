import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSessionToken,
  verifySessionToken,
  checkLoginRateLimit,
  recordFailedLogin,
  clearLoginRateLimit,
  updateAdminPassword,
  verifyAdminPassword,
} from '../lib/adminAuth.js';

test('Auth System: Session token generation and verification', () => {
  const token = createSessionToken('admin');
  assert.ok(typeof token === 'string' && token.includes('.'), 'Token should be formatted as payload.signature');

  const verified = verifySessionToken(token);
  assert.ok(verified, 'Valid token must be verified successfully');
  assert.equal(verified.sub, 'admin', 'Subject should match original subject');
  assert.ok(verified.exp > Math.floor(Date.now() / 1000), 'Token expiration should be in the future');
});

test('Auth System: Tampered token rejection', () => {
  const token = createSessionToken('admin');
  const [payloadBase64, signature] = token.split('.');

  // Alter payload
  const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8'));
  decodedPayload.sub = 'attacker';
  const tamperedPayloadBase64 = Buffer.from(JSON.stringify(decodedPayload)).toString('base64url');
  const tamperedToken = `${tamperedPayloadBase64}.${signature}`;

  assert.equal(verifySessionToken(tamperedToken), null, 'Tampered token must fail signature check');
});

test('Auth System: Malformed token handling', () => {
  assert.equal(verifySessionToken(''), null, 'Empty string should fail safely');
  assert.equal(verifySessionToken(null), null, 'Null should fail safely');
  assert.equal(verifySessionToken('invalid-token-without-dot'), null, 'Format without dot should fail safely');
  assert.equal(verifySessionToken('invalid.payload.extra'), null, 'Extra dot token should fail safely');
});

test('Auth System: Expired token rejection', () => {
  // Generate token with negative duration
  const expiredToken = createSessionToken('admin', -10);
  assert.equal(verifySessionToken(expiredToken), null, 'Expired token must return null');
});

test('Rate Limiter: Lockout after 5 failed attempts', () => {
  const testIp = '192.0.2.100';
  clearLoginRateLimit(testIp);

  // First 4 failed attempts should still allow login attempts
  for (let i = 0; i < 4; i++) {
    const status = checkLoginRateLimit(testIp);
    assert.equal(status.allowed, true, `Attempt ${i + 1} should be allowed`);
    recordFailedLogin(testIp);
  }

  // 5th failed attempt
  recordFailedLogin(testIp);

  // 6th attempt should be blocked
  const blockedStatus = checkLoginRateLimit(testIp);
  assert.equal(blockedStatus.allowed, false, 'Should be blocked after max failed attempts');
  assert.ok(blockedStatus.retryAfterSeconds > 0, 'Retry after seconds should be greater than 0');

  // Clear rate limit should unblock
  clearLoginRateLimit(testIp);
  const unblockedStatus = checkLoginRateLimit(testIp);
  assert.equal(unblockedStatus.allowed, true, 'IP should be unblocked after reset');
});

test('Password Management: Rejection of incorrect current password', async () => {
  const result = await updateAdminPassword('totally-wrong-password', 'brandNewSecurePass123!');
  assert.equal(result.success, false);
  assert.match(result.message, /Current password does not match/);
});

test('Password Management: Rejection of passwords shorter than 6 characters', async () => {
  const currentInitialPassword = process.env.ADMIN_PASSWORD || 'change-me-now';
  const result = await updateAdminPassword(currentInitialPassword, '123');
  assert.equal(result.success, false);
  assert.match(result.message, /at least 6 characters/);
});

test('Password Management: Successful password update and re-verification', async () => {
  const currentInitialPassword = process.env.ADMIN_PASSWORD || 'change-me-now';
  const newPassword = 'updatedSuperSecret2026!';

  const updateResult = await updateAdminPassword(currentInitialPassword, newPassword);
  assert.equal(updateResult.success, true);

  // Verify that old password now fails
  const oldValid = await verifyAdminPassword(currentInitialPassword);
  assert.equal(oldValid, false, 'Old password should no longer be valid');

  // Verify that new password succeeds
  const newValid = await verifyAdminPassword(newPassword);
  assert.equal(newValid, true, 'New password must verify successfully');
});

