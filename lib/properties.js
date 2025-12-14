import { sql } from '@vercel/postgres';

const hasDbCredentials =
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_PRISMA_URL;

async function ensureTable() {
  if (!hasDbCredentials) {
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
  if (!ready) return [];

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
  if (!ready) {
    throw new Error('Missing Postgres connection string (POSTGRES_URL).');
  }

  const imagesArray = Array.isArray(input.images)
    ? input.images.filter(Boolean).map((img) => String(img).slice(0, 500))
    : [];

  const coverImage = input.image
    ? String(input.image).slice(0, 500)
    : imagesArray.length
      ? imagesArray[0]
      : null;

  const payload = {
    name: String(input.name).slice(0, 200),
    location: String(input.location).slice(0, 200),
    price: String(input.price).slice(0, 200),
    sqm: input.sqm ? String(input.sqm).slice(0, 50) : null,
    rooms: input.rooms ? String(input.rooms).slice(0, 50) : null,
    image: coverImage,
    images: imagesArray.length ? imagesArray : null,
    tag: input.tag ? String(input.tag).slice(0, 50) : null,
    language: (input.language || 'cz').slice(0, 5),
  };

  const { rows } = await sql`
    INSERT INTO properties (name, location, price, sqm, rooms, image, images, tag, language)
    VALUES (${payload.name}, ${payload.location}, ${payload.price}, ${payload.sqm}, ${payload.rooms}, ${payload.image}, ${payload.images}, ${payload.tag}, ${payload.language})
    RETURNING id, name, location, price, sqm, rooms, image, images, tag, sold, language, created_at;
  `;

  return rows[0];
}

export async function markPropertySold(id, sold = true) {
  const ready = await ensureTable();
  if (!ready) {
    throw new Error('Missing Postgres connection string (POSTGRES_URL).');
  }

  const propertyId = Number(id);
  if (!Number.isInteger(propertyId) || propertyId <= 0) {
    throw new Error('Invalid property id.');
  }

  const { rows } = await sql`
    UPDATE properties
    SET sold = ${sold}
    WHERE id = ${propertyId}
    RETURNING id, name, location, price, sqm, rooms, image, tag, sold, language, created_at;
  `;

  return rows[0];
}
