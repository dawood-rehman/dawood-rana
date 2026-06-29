import { NextResponse } from 'next/server';
import { updateAdminPassword } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function PUT(request) {
  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current and new passwords are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const result = await updateAdminPassword(currentPassword, newPassword);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('Admin password update failed:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to update password' },
      { status: 500 }
    );
  }
}
