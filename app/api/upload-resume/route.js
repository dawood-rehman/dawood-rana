import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import PortfolioContent from '@/models/PortfolioContent';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';

export const runtime = 'nodejs';

const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);

function getExtension(filename = '', contentType = '') {
  const extension = path.extname(filename).toLowerCase();
  if (extension) return extension;
  if (contentType === 'application/pdf') return '.pdf';
  if (contentType === 'application/msword') return '.doc';
  if (contentType.includes('wordprocessingml')) return '.docx';
  return '.pdf';
}

function getContentType(contentType = '', extension = '') {
  if (ALLOWED_TYPES.has(contentType)) return contentType;
  if (extension === '.pdf') return 'application/pdf';
  if (extension === '.doc') return 'application/msword';
  if (extension === '.docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  return 'application/octet-stream';
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume');

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    const filename = file.name || 'resume.pdf';
    const contentType = file.type || 'application/octet-stream';
    const extension = getExtension(filename, contentType);
    const storedContentType = getContentType(contentType, extension);

    if (!ALLOWED_TYPES.has(contentType) && !ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        { success: false, message: 'Only PDF, DOC, and DOCX resumes are allowed' },
        { status: 400 }
      );
    }

    if (file.size > MAX_RESUME_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Resume file must be 5MB or smaller' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (isMongoConfigured()) {
      await connectToDatabase();
      const resume = {
        url: '/api/resume',
        name: filename,
        contentType: storedContentType,
        data: buffer.toString('base64'),
        size: buffer.length,
        uploadedAt: new Date(),
      };

      await PortfolioContent.findOneAndUpdate(
        { singleton: 'main' },
        {
          $setOnInsert: { singleton: 'main' },
          $set: { resume },
        },
        { new: true, upsert: true, runValidators: true }
      );

      return NextResponse.json({
        success: true,
        url: resume.url,
        name: resume.name,
        contentType: resume.contentType,
        size: resume.size,
        uploadedAt: resume.uploadedAt,
      });
    }

    const publicPath = path.join(process.cwd(), 'public');
    await fs.promises.mkdir(publicPath, { recursive: true });

    const savePath = path.join(publicPath, `resume${extension}`);
    await fs.promises.writeFile(savePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/resume${extension}`,
      name: filename,
      contentType: storedContentType,
      size: buffer.length,
      uploadedAt: new Date(),
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to upload resume' },
      { status: 500 }
    );
  }
}
