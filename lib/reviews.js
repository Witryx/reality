import { sql } from '@vercel/postgres';

const hasDbCredentials =
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_PRISMA_URL;

async function ensureTable() {
  if (!hasDbCredentials) {
    throw new Error('Missing Postgres connection string (POSTGRES_URL).');
  }

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      content TEXT NOT NULL,
      language VARCHAR(5) DEFAULT 'cz',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

export async function fetchReviews(language = 'cz') {
  await ensureTable();

  const { rows } = await sql`
    SELECT id, name, location, rating, content AS text, language, created_at
    FROM reviews
    WHERE language = ${language} OR language IS NULL
    ORDER BY created_at DESC
    LIMIT 50;
  `;

  return rows;
}

export async function createReview({ name, location, rating, text, language = 'cz' }) {
  await ensureTable();

  const { rows } = await sql`
    INSERT INTO reviews (name, location, rating, content, language)
    VALUES (${name}, ${location || null}, ${rating}, ${text}, ${language})
    RETURNING id, name, location, rating, content AS text, language, created_at;
  `;

  return rows[0];
}
