import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function GET(request) {
  const session = verifyAdminSession(request);

  if (!session) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    role: session.role || 'admin',
    expiresAt: session.exp ? session.exp * 1000 : null,
  });
}
