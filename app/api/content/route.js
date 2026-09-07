import { NextResponse } from 'next/server';
import { getPortfolioContent } from '@/lib/serverContent';
import { isMongoConfigured } from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const data = await getPortfolioContent();
    const source = isMongoConfigured() ? 'mongodb' : 'defaults';

    return NextResponse.json(
      {
        success: true,
        source,
        data,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Content fetch failed:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to load portfolio content' },
      { status: 500 }
    );
  }
}

