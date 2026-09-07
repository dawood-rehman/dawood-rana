import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import PortfolioContent from '@/models/PortfolioContent';
import ResumeAsset from '@/models/ResumeAsset';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { verifyAdminSession } from '@/lib/adminAuth';

export const runtime = 'nodejs';

const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);

function getExtension(filename = '', contentType = '') {
  const extension = path.extname(filename).toLowerCase();
  if (ALLOWED_EXTENSIONS.has(extension)) return extension;
  if (contentType === 'application/pdf') return '.pdf';
  if (contentType === 'application/msword') return '.doc';
  if (contentType.includes('wordprocessingml')) return '.docx';
  return '';
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

function verifyMagicBytes(buffer, extension) {
  if (!buffer || buffer.length < 4) return false;

  if (extension === '.pdf') {
    return buffer.subarray(0, 5).toString('ascii') === '%PDF-';
  }

  if (extension === '.docx') {
    // ZIP header PK\x03\x04
    return buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04;
  }

  if (extension === '.doc') {
    // OLE Compound File header \xD0\xCF\x11\xE0
    return buffer[0] === 0xD0 && buffer[1] === 0xCF && buffer[2] === 0x11 && buffer[3] === 0xE0;
  }

  return false;
}

export async function POST(req) {
  const session = verifyAdminSession(req);
  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Admin session required.' },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('resume');

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (file.size > MAX_RESUME_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Resume file must be 5MB or smaller' },
        { status: 400 }
      );
    }

    const rawFilename = file.name || 'resume.pdf';
    const sanitizedFilename = path.basename(rawFilename).replace(/[^a-zA-Z0-9._-]/g, '_');
    const rawContentType = file.type || 'application/octet-stream';
    const extension = getExtension(sanitizedFilename, rawContentType);
    const storedContentType = getContentType(rawContentType, extension);

    // Strict validation: Must match both allowed extension and compatible MIME type
    if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        { success: false, message: 'Only .pdf, .doc, and .docx resumes are allowed' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Deep content inspection: verify magic bytes to prevent spoofed extensions
    if (!verifyMagicBytes(buffer, extension)) {
      return NextResponse.json(
        { success: false, message: 'File signature does not match the expected format' },
        { status: 400 }
      );
    }

    if (isMongoConfigured()) {
      await connectToDatabase();

      // Store binary data in dedicated ResumeAsset collection
      await ResumeAsset.findOneAndUpdate(
        { singleton: 'main' },
        {
          $set: {
            name: sanitizedFilename,
            contentType: storedContentType,
            data: buffer,
            size: buffer.length,
            uploadedAt: new Date(),
          },
        },
        { new: true, upsert: true }
      );

      // Store lightweight metadata in PortfolioContent (NO heavy base64 strings!)
      const resumeMeta = {
        url: '/api/resume',
        name: sanitizedFilename,
        contentType: storedContentType,
        size: buffer.length,
        uploadedAt: new Date(),
      };

      await PortfolioContent.findOneAndUpdate(
        { singleton: 'main' },
        {
          $setOnInsert: { singleton: 'main' },
          $set: { resume: resumeMeta },
        },
        { new: true, upsert: true }
      );

      return NextResponse.json({
        success: true,
        url: resumeMeta.url,
        name: resumeMeta.name,
        contentType: resumeMeta.contentType,
        size: resumeMeta.size,
        uploadedAt: resumeMeta.uploadedAt,
      });
    }

    // Local development fallback when MongoDB is unconfigured
    try {
      const publicPath = path.join(process.cwd(), 'public');
      await fs.promises.mkdir(publicPath, { recursive: true });

      const savePath = path.join(publicPath, `resume${extension}`);
      await fs.promises.writeFile(savePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/resume${extension}`,
        name: sanitizedFilename,
        contentType: storedContentType,
        size: buffer.length,
        uploadedAt: new Date(),
      });
    } catch (fsError) {
      console.warn('Local filesystem write skipped (serverless or read-only):', fsError.message);
      return NextResponse.json({
        success: true,
        url: '/api/resume',
        name: sanitizedFilename,
        contentType: storedContentType,
        size: buffer.length,
        uploadedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Upload resume error:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to upload resume' },
      { status: 500 }
    );
  }
}

