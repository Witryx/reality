import { sql } from '@vercel/postgres';
import { promises as fs } from 'fs';
import path from 'path';
import {
  hasPostgresCredentials,
  isVercelRuntime,
  normalizePostgresEnv,
} from './postgresEnv';

normalizePostgresEnv();

const LOCAL_PATH = path.join(process.cwd(), 'content', 'properties-local.json');
const sortByCreatedAt = (list = []) =>
  [...list].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

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

const toImagesArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((img) => String(img).slice(0, 500));
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).map((img) => String(img).slice(0, 500));
      }
    } catch {
      /* ignore */
    }
    return value ? [String(value).slice(0, 500)] : [];
  }
  return [];
};

const toVideosArray = (value) => {
  const isVideo = (src = '') => /\.(mp4|webm|ogg|mov)$/i.test(String(src));
  if (Array.isArray(value)) {
    return value
      .filter((video) => video && isVideo(video))
      .map((video) => String(video).slice(0, 500));
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((video) => video && isVideo(video))
          .map((video) => String(video).slice(0, 500));
      }
    } catch {
      /* ignore */
    }
    return isVideo(value) ? [String(value).slice(0, 500)] : [];
  }
  return [];
};

const sanitizePayload = (input = {}) => {
  const imagesArray = toImagesArray(input.images);
  const videosArray = toVideosArray(input.videos);

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
    videos: videosArray.length ? videosArray : null,
    tag: input.tag ? String(input.tag).slice(0, 50) : null,
    description: input.description ? String(input.description).slice(0, 2000) : null,
    language: String(input.language || 'cz').slice(0, 5),
    sold: Boolean(input.sold),
  };
};

async function ensureTable() {
  normalizePostgresEnv();

  if (!hasPostgresCredentials()) {
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
      videos JSONB,
      tag TEXT,
      description TEXT,
      sold BOOLEAN DEFAULT FALSE,
      language VARCHAR(5) DEFAULT 'cz',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Backfill new columns if they don't exist.
  await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS images JSONB;`;
  await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS videos JSONB;`;
  await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS description TEXT;`;

  return true;
}

export async function fetchProperties(language) {
  const ready = await ensureTable();
  if (!ready) {
    const list = await readLocal();
    const filtered = language
      ? list.filter((item) => item.language === language || !item.language)
      : list;
    return sortByCreatedAt(filtered);
  }

  if (language) {
    const { rows } = await sql`
      SELECT id, name, location, price, sqm, rooms, image, images, videos, tag, description, sold, language, created_at
      FROM properties
      WHERE language = ${language} OR language IS NULL
      ORDER BY created_at DESC;
    `;

    return rows;
  }

  const { rows } = await sql`
    SELECT id, name, location, price, sqm, rooms, image, images, videos, tag, description, sold, language, created_at
    FROM properties
    ORDER BY created_at DESC;
  `;

  return rows;
}

export async function createProperty(input) {
  const ready = await ensureTable();
  const payload = sanitizePayload(input);

  if (!ready) {
    if (isVercelRuntime()) {
      throw new Error('Missing Postgres connection string');
    }
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

  try {
    const imagesJson = payload.images ? JSON.stringify(payload.images) : null;
    const videosJson = payload.videos ? JSON.stringify(payload.videos) : null;
    const { rows } = await sql`
      INSERT INTO properties (name, location, price, sqm, rooms, image, images, videos, tag, description, language)
      VALUES (${payload.name}, ${payload.location}, ${payload.price}, ${payload.sqm}, ${payload.rooms}, ${payload.image}, ${imagesJson}::jsonb, ${videosJson}::jsonb, ${payload.tag}, ${payload.description}, ${payload.language})
      RETURNING id, name, location, price, sqm, rooms, image, images, videos, tag, description, sold, language, created_at;
    `;

    return rows[0];
  } catch (error) {
    console.error('createProperty insert failed', error);
    throw error;
  }
}

export async function updateProperty(input = {}) {
  const ready = await ensureTable();
  const propertyId = Number(input.id);
  if (!Number.isInteger(propertyId) || propertyId <= 0) {
    throw new Error('Invalid property id.');
  }

  if (!ready) {
    if (isVercelRuntime()) {
      throw new Error('Missing Postgres connection string');
    }
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

  const updatableKeys = [
    'name',
    'location',
    'price',
    'sqm',
    'rooms',
    'tag',
    'description',
    'language',
    'images',
    'videos',
    'image',
    'sold',
  ];

  const hasUpdates = updatableKeys.some((key) => Object.prototype.hasOwnProperty.call(input, key));
  if (!hasUpdates) {
    throw new Error('No fields to update.');
  }

  const { rows: existingRows } = await sql`
    SELECT id, name, location, price, sqm, rooms, image, images, videos, tag, description, sold, language
    FROM properties
    WHERE id = ${propertyId}
    LIMIT 1;
  `;

  const existing = existingRows[0];
  if (!existing) return null;

  const nextName =
    input.name !== undefined ? String(input.name).slice(0, 200) : String(existing.name || '').slice(0, 200);
  const nextLocation =
    input.location !== undefined ? String(input.location).slice(0, 200) : String(existing.location || '').slice(0, 200);
  const nextPrice =
    input.price !== undefined ? String(input.price).slice(0, 200) : String(existing.price || '').slice(0, 200);
  const nextSqm =
    input.sqm !== undefined
      ? input.sqm
        ? String(input.sqm).slice(0, 50)
        : null
      : existing.sqm
        ? String(existing.sqm).slice(0, 50)
        : null;
  const nextRooms =
    input.rooms !== undefined
      ? input.rooms
        ? String(input.rooms).slice(0, 50)
        : null
      : existing.rooms
        ? String(existing.rooms).slice(0, 50)
        : null;
  const nextTag =
    input.tag !== undefined ? (input.tag ? String(input.tag).slice(0, 50) : null) : existing.tag ? String(existing.tag).slice(0, 50) : null;
  const nextDescription =
    input.description !== undefined
      ? input.description
        ? String(input.description).slice(0, 2000)
        : null
      : existing.description
        ? String(existing.description).slice(0, 2000)
        : null;
  const nextLanguage =
    input.language !== undefined
      ? String(input.language || 'cz').slice(0, 5)
      : String(existing.language || 'cz').slice(0, 5);

  const existingImages = toImagesArray(existing.images);
  const existingVideos = toVideosArray(existing.videos);

  const nextImages =
    input.images === undefined
      ? existingImages
      : input.images === null
        ? []
        : toImagesArray(input.images);
  const nextVideos =
    input.videos === undefined
      ? existingVideos
      : input.videos === null
        ? []
        : toVideosArray(input.videos);

  const nextImage =
    input.image !== undefined
      ? input.image
        ? String(input.image).slice(0, 500)
        : null
      : input.images !== undefined
        ? nextImages[0] || null
        : existing.image
          ? String(existing.image).slice(0, 500)
          : nextImages[0] || null;

  const nextSold = input.sold !== undefined ? Boolean(input.sold) : Boolean(existing.sold);
  const imagesJson = nextImages.length ? JSON.stringify(nextImages) : null;
  const videosJson = nextVideos.length ? JSON.stringify(nextVideos) : null;

  const { rows } = await sql`
    UPDATE properties
    SET
      name = ${nextName},
      location = ${nextLocation},
      price = ${nextPrice},
      sqm = ${nextSqm},
      rooms = ${nextRooms},
      image = ${nextImage},
      images = ${imagesJson}::jsonb,
      videos = ${videosJson}::jsonb,
      tag = ${nextTag},
      description = ${nextDescription},
      language = ${nextLanguage},
      sold = ${nextSold}
    WHERE id = ${propertyId}
    RETURNING id, name, location, price, sqm, rooms, image, images, videos, tag, description, sold, language, created_at;
  `;

  return rows[0];
}

export async function markPropertySold(id, sold = true) {
  return updateProperty({ id, sold });
}

export async function deleteProperty(id) {
  const ready = await ensureTable();
  const propertyId = Number(id);
  if (!Number.isInteger(propertyId) || propertyId <= 0) {
    throw new Error('Invalid property id.');
  }

  if (!ready) {
    if (isVercelRuntime()) {
      throw new Error('Missing Postgres connection string');
    }
    const list = await readLocal();
    const filtered = list.filter((item) => Number(item.id) !== propertyId);
    if (filtered.length === list.length) return false;
    await writeLocal(filtered);
    return true;
  }

  const result = await sql`DELETE FROM properties WHERE id = ${propertyId};`;
  return result.rowCount > 0;
}
