import { NextResponse } from 'next/server';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { verifyAdminSession } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function DELETE(request) {
  const session = verifyAdminSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({
      success: true,
      message: 'Analytics cleared (database offline)',
    });
  }

  try {
    await connectToDatabase();
    await AnalyticsEvent.deleteMany({});

    return NextResponse.json({
      success: true,
      message: 'All analytics tracking events have been purged successfully',
    });
  } catch (error) {
    console.error('Failed to clear analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to purge analytics events' },
      { status: 500 }
    );
  }
}
