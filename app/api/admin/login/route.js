import { NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Password is required' },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin login failed:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to login' },
      { status: 500 }
    );
  }
}
