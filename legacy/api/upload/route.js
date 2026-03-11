import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files')?.length ? formData.getAll('files') : formData.getAll('file');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided.' }, { status: 400 });
    }

    await ensureUploadDir();

    const saved = [];

    for (const file of files) {
      if (typeof file === 'string') continue;
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = file.name?.replace(/[^a-zA-Z0-9_.-]/g, '-') || 'upload';
      const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${safeName}`;
      const filePath = path.join(UPLOAD_DIR, filename);
      await fs.writeFile(filePath, buffer);
      saved.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls: saved }, { status: 201 });
  } catch (error) {
    console.error('POST /api/upload', error);
    return NextResponse.json({ error: 'Upload failed.', detail: error.message }, { status: 500 });
  }
}
