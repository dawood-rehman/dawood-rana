import { NextResponse } from 'next/server';
import { verifyAdminSession, updateAdminPassword } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function PUT(req) {
  const session = verifyAdminSession(req);
  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Admin session required.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Both current and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'New password and confirmation do not match.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const result = await updateAdminPassword(currentPassword, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message || 'Password updated successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update admin password.' },
      { status: 500 }
    );
  }
}
