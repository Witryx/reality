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

export async function fetchReviews({ language = 'cz', limit = 9, offset = 0 } = {}) {
  await ensureTable();

  const safeLimit = Math.max(1, Math.min(Number(limit) || 9, 50));
  const safeOffset = Math.max(0, Number(offset) || 0);
  const filterByLanguage = language && language !== 'all';
  const whereClause = filterByLanguage ? sql`WHERE language = ${language} OR language IS NULL` : sql``;

  const [listResult, statsResult] = await Promise.all([
    sql`
      SELECT id, name, location, rating, content AS text, language, created_at
      FROM reviews
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${safeLimit}
      OFFSET ${safeOffset};
    `,
    sql`
      SELECT COUNT(*)::int AS total, COALESCE(AVG(rating), 0)::float AS average
      FROM reviews
      ${whereClause};
    `,
  ]);

  const statsRow = statsResult.rows[0] || { total: 0, average: 0 };

  return {
    rows: listResult.rows,
    total: statsRow.total,
    average: Number(statsRow.average || 0),
  };
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
