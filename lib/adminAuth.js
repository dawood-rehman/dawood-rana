import crypto from 'crypto';
import AdminAuth from '../models/AdminAuth.js';
import { connectToDatabase, isMongoConfigured } from './mongodb.js';

const PASSWORD_DIGEST = 'sha512';
const PASSWORD_KEY_LENGTH = 64;
const DEFAULT_ITERATIONS = 120000;
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-now';

export const SESSION_COOKIE_NAME = 'admin_session';
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

let inMemoryPassword = null;

function getInitialAdminPassword() {
  if (inMemoryPassword) return inMemoryPassword;
  if (!process.env.ADMIN_PASSWORD && process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_PASSWORD must be configured in production.');
  }

  return DEFAULT_ADMIN_PASSWORD;
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'portfolio-admin-session-secret-salt-84729';
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex'), iterations = DEFAULT_ITERATIONS) {
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, iterations, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
    .toString('hex');

  return { passwordHash, salt, iterations };
}

export function timingSafeEqual(a, b) {
  const aBuffer = Buffer.from(a, 'hex');
  const bBuffer = Buffer.from(b, 'hex');

  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export async function getOrCreateAdminAuth() {
  if (!isMongoConfigured()) return null;

  await connectToDatabase();
  let auth = await AdminAuth.findOne({ singleton: 'main' });

  if (!auth) {
    auth = await AdminAuth.create({
      singleton: 'main',
      ...hashPassword(getInitialAdminPassword()),
    });
  }

  return auth;
}

export async function verifyAdminPassword(password) {
  if (!isMongoConfigured()) {
    return password === getInitialAdminPassword();
  }

  const auth = await getOrCreateAdminAuth();
  const candidate = hashPassword(password, auth.salt, auth.iterations);
  return timingSafeEqual(candidate.passwordHash, auth.passwordHash);
}

export async function updateAdminPassword(currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    return { success: false, message: 'Both current password and new password are required.' };
  }

  if (newPassword.length < 6) {
    return { success: false, message: 'New password must be at least 6 characters long.' };
  }

  const isCurrentValid = await verifyAdminPassword(currentPassword);
  if (!isCurrentValid) {
    return { success: false, message: 'Current password does not match.' };
  }

  if (isMongoConfigured()) {
    await connectToDatabase();
    const { passwordHash, salt, iterations } = hashPassword(newPassword);
    await AdminAuth.findOneAndUpdate(
      { singleton: 'main' },
      { $set: { passwordHash, salt, iterations } },
      { upsert: true, new: true }
    );
  } else {
    inMemoryPassword = newPassword;
  }

  return { success: true, message: 'Admin password updated successfully.' };
}

export function createSessionToken(payload = {}, maxAge = SESSION_MAX_AGE) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + maxAge;
  const payloadObj = typeof payload === 'string' ? { sub: payload } : payload;
  const data = JSON.stringify({ role: 'admin', ...payloadObj, iat, exp });
  const encodedData = Buffer.from(data).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(encodedData)
    .digest('base64url');
  return `${encodedData}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encodedData, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(encodedData)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expectedSigBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedData, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

export function parseCookies(header = '') {
  const result = {};
  if (!header) return result;
  header.split(';').forEach((part) => {
    const [name, ...rest] = part.trim().split('=');
    if (name) {
      result[name] = decodeURIComponent(rest.join('='));
    }
  });
  return result;
}

export function verifyAdminSession(request) {
  const cookieHeader = request?.headers?.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const token = cookies[SESSION_COOKIE_NAME];
  return verifySessionToken(token);
}

// In-memory sliding-window rate limiting for admin login
const loginAttempts = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export function checkLoginRateLimit(ip = 'unknown') {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true, remaining: MAX_ATTEMPTS };

  if (now - record.firstAttemptTime > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const resetSeconds = Math.ceil((record.firstAttemptTime + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, remaining: 0, resetSeconds, retryAfterSeconds: resetSeconds };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}

export function recordFailedLogin(ip = 'unknown') {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now - record.firstAttemptTime > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttemptTime: now });
  } else {
    record.count += 1;
  }
}

export function clearLoginRateLimit(ip = 'unknown') {
  loginAttempts.delete(ip);
}

