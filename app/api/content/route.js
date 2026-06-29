import { NextResponse } from 'next/server';
import PortfolioContent from '@/models/PortfolioContent';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { DEFAULT_DATA } from '@/lib/storage';

export const runtime = 'nodejs';

function contentDefaults() {
  return { ...DEFAULT_DATA };
}

function serializeContent(content) {
  if (!content) return contentDefaults();

  const serialized = content.toObject ? content.toObject() : content;
  const { _id, singleton, createdAt, updatedAt, ...data } = serialized;
  return data;
}

export async function GET() {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json({
        success: true,
        source: 'defaults',
        data: contentDefaults(),
      });
    }

    await connectToDatabase();
    const defaults = contentDefaults();
    const content = await PortfolioContent.findOneAndUpdate(
      { singleton: 'main' },
      { $setOnInsert: { singleton: 'main', ...defaults } },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      data: serializeContent(content),
    });
  } catch (error) {
    console.error('Content fetch failed:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to load portfolio content' },
      { status: 500 }
    );
  }
}
