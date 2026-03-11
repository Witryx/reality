import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { requireAdminSession } from '../../../lib/adminAuth';

export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 40 * 1024 * 1024; // 40 MB per file
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg',
]);

const sanitizeFileName = (name = 'upload') =>
  String(name)
    .replace(/[^a-zA-Z0-9_.-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);

async function writeLocalFile(file) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = sanitizeFileName(file.name || 'upload');
  const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${safeName}`;
  const fullPath = path.join(UPLOAD_DIR, filename);

  await fs.writeFile(fullPath, buffer);
  return `/uploads/${filename}`;
}

async function uploadToBlob(file) {
  const safeName = sanitizeFileName(file.name || 'upload');
  const blobPath = `uploads/${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await put(blobPath, buffer, {
    access: 'public',
    contentType: file.type || 'application/octet-stream',
    addRandomSuffix: true,
  });

  return result.url;
}

export async function POST(request) {
  if (!requireAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('files')?.length ? formData.getAll('files') : formData.getAll('file');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided.' }, { status: 400 });
    }

    const typedFiles = files.filter((item) => typeof item !== 'string');
    if (!typedFiles.length) {
      return NextResponse.json({ error: 'No valid files provided.' }, { status: 400 });
    }

    for (const file of typedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} is too large (max ${Math.floor(MAX_FILE_SIZE / 1024 / 1024)} MB).` },
          { status: 400 }
        );
      }
      if (file.type && !ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type}.` },
          { status: 400 }
        );
      }
    }

    const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    const runningOnVercel = Boolean(process.env.VERCEL);

    if (!useBlob && runningOnVercel) {
      return NextResponse.json(
        {
          error: 'Upload storage is not configured. Set BLOB_READ_WRITE_TOKEN on Vercel to enable uploads.',
        },
        { status: 503 }
      );
    }

    const urls = [];
    for (const file of typedFiles) {
      const url = useBlob ? await uploadToBlob(file) : await writeLocalFile(file);
      urls.push(url);
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch (error) {
    console.error('POST /api/upload', error);
    return NextResponse.json(
      { error: 'Upload failed.', detail: error.message },
      { status: 500 }
    );
  }
}
