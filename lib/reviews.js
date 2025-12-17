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

const LOCAL_PATH = path.join(process.cwd(), 'content', 'reviews-local.json');

async function ensureTable() {
  if (!hasDbCredentials()) {
    loadEnvFallback();
  }

  if (!hasDbCredentials()) {
    return false;
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

  return true;
}

async function readLocal() {
  try {
    const raw = await fs.readFile(LOCAL_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('readLocal reviews failed', error);
    }
  }
  return [];
}

async function writeLocal(list = []) {
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, JSON.stringify(list, null, 2), 'utf-8');
}

const sanitize = ({ name, location, rating, text, language = 'cz' } = {}) => ({
  name: String(name || '').slice(0, 80),
  location: location ? String(location).slice(0, 80) : null,
  rating: Number(rating),
  text: String(text || '').slice(0, 1000),
  language: (language || 'cz').slice(0, 5),
});

export async function fetchReviews({ language = 'cz', limit = 9, offset = 0 } = {}) {
  try {
    const ready = await ensureTable();
    const filterByLanguage = language && language !== 'all';
    const safeLimit = Math.max(1, Math.min(Number(limit) || 9, 50));
    const safeOffset = Math.max(0, Number(offset) || 0);

    if (!ready) {
      const list = await readLocal();
      const filtered = filterByLanguage
        ? list.filter((r) => r.language === language || !r.language)
        : list;
      const sorted = filtered.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      const paged = sorted.slice(safeOffset, safeOffset + safeLimit);
      const total = filtered.length;
      const average = total
        ? filtered.reduce((sum, r) => sum + Number(r.rating || 0), 0) / total
        : 0;

      return {
        rows: paged,
        total,
        average: Number(average.toFixed(1)),
        dbAvailable: false,
      };
    }

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
      dbAvailable: true,
    };
  } catch (error) {
    console.error('fetchReviews', error);
    return { rows: [], total: 0, average: 0, dbAvailable: false };
  }
}

export async function createReview(input) {
  const ready = await ensureTable();
  const payload = sanitize(input);

  if (!ready) {
    const list = await readLocal();
    const nextId = (list.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) || 0) + 1;
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
    INSERT INTO reviews (name, location, rating, content, language)
    VALUES (${payload.name}, ${payload.location || null}, ${payload.rating}, ${payload.text}, ${payload.language})
    RETURNING id, name, location, rating, content AS text, language, created_at;
  `;

  return rows[0];
}
