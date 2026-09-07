import { NextResponse } from 'next/server';
import {
  verifyAdminPassword,
  createSessionToken,
  checkLoginRateLimit,
  recordFailedLogin,
  clearLoginRateLimit,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from '@/lib/adminAuth';

export const runtime = 'nodejs';

function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(request) {
  const ip = getClientIp(request);
  const rateLimit = checkLoginRateLimit(ip);

  if (!rateLimit.allowed) {
    const minutes = Math.ceil((rateLimit.resetSeconds || 60) / 60);
    return NextResponse.json(
      {
        success: false,
        message: `Too many failed login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.resetSeconds || 60),
        },
      }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { password } = body || {};

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Password is required' },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      recordFailedLogin(ip);
      const remainingAttempts = rateLimit.remaining - 1;
      return NextResponse.json(
        {
          success: false,
          message: remainingAttempts > 0
            ? `Invalid password. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`
            : 'Invalid password. Account temporarily locked.',
        },
        { status: 401 }
      );
    }

    clearLoginRateLimit(ip);
    const token = createSessionToken();
    const isProduction = process.env.NODE_ENV === 'production';

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to process login request' },
      { status: 500 }
    );
  }
}

