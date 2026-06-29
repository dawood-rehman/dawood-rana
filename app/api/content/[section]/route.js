import { NextResponse } from 'next/server';
import PortfolioContent from '@/models/PortfolioContent';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { isContentSection } from '@/lib/contentSections';
import { DEFAULT_DATA } from '@/lib/storage';

export const runtime = 'nodejs';

function contentDefaults() {
  return { ...DEFAULT_DATA };
}

function serializeValue(value) {
  if (value?.toObject) return value.toObject();
  return value;
}

export async function GET(_request, context) {
  const { section } = await context.params;

  if (!isContentSection(section)) {
    return NextResponse.json(
      { success: false, message: 'Unknown content section' },
      { status: 404 }
    );
  }

  try {
    if (!isMongoConfigured()) {
      return NextResponse.json({
        success: true,
        source: 'defaults',
        value: contentDefaults()[section],
      });
    }

    await connectToDatabase();
    const content = await PortfolioContent.findOne({ singleton: 'main' }).lean();

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      value: content?.[section] ?? contentDefaults()[section],
    });
  } catch (error) {
    console.error(`Content section fetch failed (${section}):`, error);
    return NextResponse.json(
      { success: false, message: 'Unable to load content section' },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  const { section } = await context.params;

  if (!isContentSection(section)) {
    return NextResponse.json(
      { success: false, message: 'Unknown content section' },
      { status: 404 }
    );
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { success: false, message: 'MongoDB is not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const value = body?.value;
    const insertDefaults = contentDefaults();
    delete insertDefaults[section];

    await connectToDatabase();
    const content = await PortfolioContent.findOneAndUpdate(
      { singleton: 'main' },
      {
        $setOnInsert: { singleton: 'main', ...insertDefaults },
        $set: { [section]: value },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      value: serializeValue(content[section]),
    });
  } catch (error) {
    console.error(`Content section update failed (${section}):`, error);
    return NextResponse.json(
      { success: false, message: 'Unable to update content section' },
      { status: 500 }
    );
  }
}
