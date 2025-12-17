import { sql } from '@vercel/postgres';
import { promises as fs } from 'fs';
import fsSync from 'fs';
import path from 'path';

// Normalize DB envs: prefer POSTGRES_URL, but fall back to DATABASE_URL if needed.
const loadEnvFallback = () => {
  const candidates = ['.env.local', '.env'];
  for (const file of candidates) {
    const full = path.join(process.cwd(), file);
    if (fsSync.existsSync(full)) {
      const content = fsSync.readFileSync(full, 'utf-8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const [key, ...rest] = trimmed.split('=');
        const value = rest.join('=').trim();
        if (key && value && !process.env[key]) {
          process.env[key] = value.replace(/^['"]|['"]$/g, '');
        }
      });
    }
  }
};

loadEnvFallback();

if (!process.env.POSTGRES_URL && process.env.DATABASE_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}
if (!process.env.POSTGRES_URL_NON_POOLING && process.env.DATABASE_URL_UNPOOLED) {
  process.env.POSTGRES_URL_NON_POOLING = process.env.DATABASE_URL_UNPOOLED;
}

const hasDbCredentials = () =>
  Boolean(
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_PRISMA_URL
  );

const LOCAL_PATH = path.join(process.cwd(), 'content', 'properties-local.json');

async function readLocal() {
  try {
    const raw = await fs.readFile(LOCAL_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('readLocal properties failed', error);
    }
  }
  return [];
}

async function writeLocal(list = []) {
  try {
    await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
    await fs.writeFile(LOCAL_PATH, JSON.stringify(list, null, 2), 'utf-8');
  } catch (error) {
    console.error('writeLocal properties failed', error);
    throw new Error('Failed to write local properties store.');
  }
}

const sanitizePayload = (input = {}) => {
  const imagesArray = Array.isArray(input.images)
    ? input.images.filter(Boolean).map((img) => String(img).slice(0, 500))
    : [];

  const coverImage = input.image
    ? String(input.image).slice(0, 500)
    : imagesArray.length
      ? imagesArray[0]
      : null;

  return {
    name: String(input.name || '').slice(0, 200),
    location: String(input.location || '').slice(0, 200),
    price: String(input.price || '').slice(0, 200),
    sqm: input.sqm ? String(input.sqm).slice(0, 50) : null,
    rooms: input.rooms ? String(input.rooms).slice(0, 50) : null,
    image: coverImage,
    images: imagesArray.length ? imagesArray : null,
    tag: input.tag ? String(input.tag).slice(0, 50) : null,
    language: (input.language || 'cz').slice(0, 5),
    sold: Boolean(input.sold),
  };
};

async function ensureTable() {
  if (!hasDbCredentials()) {
    loadEnvFallback();
  }

  if (!hasDbCredentials()) {
    // No DB configured; allow callers to fall back gracefully.
    return false;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      price TEXT NOT NULL,
      sqm TEXT,
      rooms TEXT,
      image TEXT,
      images JSONB,
      tag TEXT,
      sold BOOLEAN DEFAULT FALSE,
      language VARCHAR(5) DEFAULT 'cz',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Backfill new columns if they don't exist.
  await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS images JSONB;`;

  return true;
}

export async function fetchProperties(language = 'cz') {
  const ready = await ensureTable();
  if (!ready) {
    const list = await readLocal();
    return list
      .filter((item) => item.language === language || !item.language)
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }

  const { rows } = await sql`
    SELECT id, name, location, price, sqm, rooms, image, images, tag, sold, language, created_at
    FROM properties
    WHERE language = ${language} OR language IS NULL
    ORDER BY created_at DESC;
  `;

  return rows;
}

export async function createProperty(input) {
  const ready = await ensureTable();
  const payload = sanitizePayload(input);

  if (!ready) {
    const list = await readLocal();
    const nextId = (list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) || 0) + 1;
    const item = {
      ...payload,
      id: nextId,
      created_at: new Date().toISOString(),
    };
    const updated = [item, ...list];
    await writeLocal(updated);
    return item;
  }

  const { rows } = await sql`
    INSERT INTO properties (name, location, price, sqm, rooms, image, images, tag, language)
    VALUES (${payload.name}, ${payload.location}, ${payload.price}, ${payload.sqm}, ${payload.rooms}, ${payload.image}, ${payload.images}, ${payload.tag}, ${payload.language})
    RETURNING id, name, location, price, sqm, rooms, image, images, tag, sold, language, created_at;
  `;

  return rows[0];
}

export async function updateProperty(input = {}) {
  const ready = await ensureTable();
  const propertyId = Number(input.id);
  if (!Number.isInteger(propertyId) || propertyId <= 0) {
    throw new Error('Invalid property id.');
  }

  if (!ready) {
    const list = await readLocal();
    const idx = list.findIndex((item) => Number(item.id) === propertyId);
    if (idx === -1) return null;

    const existing = list[idx];
    const merged = {
      ...existing,
      ...sanitizePayload({ ...existing, ...input }),
      id: existing.id,
      created_at: existing.created_at || new Date().toISOString(),
      sold: input.sold !== undefined ? Boolean(input.sold) : Boolean(existing.sold),
    };
    const updatedList = [...list];
    updatedList[idx] = merged;
    await writeLocal(updatedList);
    return merged;
  }

  const updates = [];

  if (input.name !== undefined) {
    updates.push(sql`name = ${String(input.name).slice(0, 200)}`);
  }
  if (input.location !== undefined) {
    updates.push(sql`location = ${String(input.location).slice(0, 200)}`);
  }
  if (input.price !== undefined) {
    updates.push(sql`price = ${String(input.price).slice(0, 200)}`);
  }
  if (input.sqm !== undefined) {
    updates.push(sql`sqm = ${input.sqm ? String(input.sqm).slice(0, 50) : null}`);
  }
  if (input.rooms !== undefined) {
    updates.push(sql`rooms = ${input.rooms ? String(input.rooms).slice(0, 50) : null}`);
  }
  if (input.tag !== undefined) {
    updates.push(sql`tag = ${input.tag ? String(input.tag).slice(0, 50) : null}`);
  }
  if (input.language !== undefined) {
    updates.push(sql`language = ${(input.language || 'cz').slice(0, 5)}`);
  }

  if (input.images !== undefined || input.image !== undefined) {
    const imagesArray = Array.isArray(input.images)
      ? input.images.filter(Boolean).map((img) => String(img).slice(0, 500))
      : input.images === null
        ? null
        : undefined;

    const coverImage =
      input.image !== undefined
        ? input.image
          ? String(input.image).slice(0, 500)
          : null
        : Array.isArray(imagesArray) && imagesArray.length
          ? imagesArray[0]
          : undefined;

    if (imagesArray !== undefined) {
      updates.push(sql`images = ${imagesArray && imagesArray.length ? imagesArray : null}`);
    }
    if (coverImage !== undefined) {
      updates.push(sql`image = ${coverImage}`);
    }
  }

  if (input.sold !== undefined) {
    updates.push(sql`sold = ${Boolean(input.sold)}`);
  }

  if (!updates.length) {
    throw new Error('No fields to update.');
  }

  const { rows } = await sql`
    UPDATE properties
    SET ${sql.join(updates, sql`, `)}
    WHERE id = ${propertyId}
    RETURNING id, name, location, price, sqm, rooms, image, images, tag, sold, language, created_at;
  `;

  return rows[0];
}

export async function markPropertySold(id, sold = true) {
  return updateProperty({ id, sold });
}
