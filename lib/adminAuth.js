import crypto from 'crypto';
import AdminAuth from '@/models/AdminAuth';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';

const PASSWORD_DIGEST = 'sha512';
const PASSWORD_KEY_LENGTH = 64;
const DEFAULT_ITERATIONS = 120000;
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-now';

function getInitialAdminPassword() {
  if (!process.env.ADMIN_PASSWORD && process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_PASSWORD must be configured in production.');
  }

  return DEFAULT_ADMIN_PASSWORD;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex'), iterations = DEFAULT_ITERATIONS) {
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, iterations, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
    .toString('hex');

  return { passwordHash, salt, iterations };
}

function timingSafeEqual(a, b) {
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
  if (!isMongoConfigured()) {
    return {
      success: false,
      message: 'MongoDB is not configured, so password changes cannot be persisted.',
    };
  }

  const isValid = await verifyAdminPassword(currentPassword);
  if (!isValid) {
    return { success: false, message: 'Current password is incorrect' };
  }

  const auth = await getOrCreateAdminAuth();
  const nextPassword = hashPassword(newPassword);

  auth.passwordHash = nextPassword.passwordHash;
  auth.salt = nextPassword.salt;
  auth.iterations = nextPassword.iterations;
  await auth.save();

  return { success: true, message: 'Password updated successfully' };
}
