import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import PortfolioContent from '@/models/PortfolioContent';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';

export const runtime = 'nodejs';

const fallbackFiles = ['resume.pdf', 'resume.docx', 'resume.doc'];

function contentDisposition(filename = 'resume.pdf') {
  const safeName = filename.replace(/["\r\n]/g, '');
  return `attachment; filename="${safeName}"`;
}

export async function GET() {
  try {
    if (isMongoConfigured()) {
      await connectToDatabase();
      const content = await PortfolioContent.findOne({ singleton: 'main' })
        .select('resume')
        .lean();

      if (content?.resume?.data) {
        const buffer = Buffer.from(content.resume.data, 'base64');
        return new Response(buffer, {
          headers: {
            'Content-Type': content.resume.contentType || 'application/pdf',
            'Content-Disposition': contentDisposition(content.resume.name),
            'Content-Length': String(buffer.length),
            'Cache-Control': 'no-store',
          },
        });
      }
    }

    for (const filename of fallbackFiles) {
      const filePath = path.join(process.cwd(), 'public', filename);
      if (fs.existsSync(filePath)) {
        const buffer = await fs.promises.readFile(filePath);
        return new Response(buffer, {
          headers: {
            'Content-Type': filename.endsWith('.pdf')
              ? 'application/pdf'
              : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': contentDisposition(filename),
            'Content-Length': String(buffer.length),
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    }

    return NextResponse.json(
      { success: false, message: 'Resume not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Resume fetch failed:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to load resume' },
      { status: 500 }
    );
  }
}
