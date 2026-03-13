import { sql } from '@vercel/postgres';
import { promises as fs } from 'fs';
import path from 'path';
import {
  hasPostgresCredentials,
  isVercelRuntime,
  normalizePostgresEnv,
} from './postgresEnv';

normalizePostgresEnv();

const LOCAL_PATH = path.join(process.cwd(), 'content', 'reviews-local.json');
const sortByCreatedAt = (list = []) =>
  [...list].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

async function ensureTable() {
  normalizePostgresEnv();

  if (!hasPostgresCredentials()) {
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

const sanitize = ({ name, location, rating, text, language = 'all' } = {}) => ({
  name: String(name || '').slice(0, 80),
  location: location ? String(location).slice(0, 80) : null,
  rating: Number(rating),
  text: String(text || '').slice(0, 1000),
  language: (language || 'all').slice(0, 5),
});

export async function fetchReviews({ language = 'all', limit = 9, offset = 0 } = {}) {
  try {
    const ready = await ensureTable();
    const filterByLanguage = language && language !== 'all';
    const safeLimit = Math.max(1, Math.min(Number(limit) || 9, 50));
    const safeOffset = Math.max(0, Number(offset) || 0);

    if (!ready) {
      const list = await readLocal();
      const filtered = filterByLanguage
        ? list.filter((r) => r.language === language || r.language === 'all' || !r.language)
        : list;
      const sorted = sortByCreatedAt(filtered);
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

    const whereClause = filterByLanguage
      ? sql`WHERE language = ${language} OR language = 'all' OR language IS NULL`
      : sql``;

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
    if (isVercelRuntime()) {
      throw new Error('Missing Postgres connection string');
    }
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

export async function updateReview(input = {}) {
  const ready = await ensureTable();
  const reviewId = Number(input.id);
  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    throw new Error('Invalid review id.');
  }

  if (!ready) {
    if (isVercelRuntime()) {
      throw new Error('Missing Postgres connection string');
    }
    const list = await readLocal();
    const idx = list.findIndex((item) => Number(item.id) === reviewId);
    if (idx === -1) return null;

    const current = list[idx];
    const next = { ...current };

    if (input.name !== undefined) next.name = String(input.name || '').slice(0, 80);
    if (input.location !== undefined) {
      next.location = input.location ? String(input.location).slice(0, 80) : null;
    }
    if (input.text !== undefined) next.text = String(input.text || '').slice(0, 1000);
    if (input.language !== undefined) next.language = String(input.language || 'all').slice(0, 5);
    if (input.rating !== undefined) {
      const parsed = Number(input.rating);
      if (!Number.isFinite(parsed) || parsed < 1 || parsed > 5) {
        throw new Error('Rating must be between 1 and 5.');
      }
      next.rating = parsed;
    }

    const updated = [...list];
    updated[idx] = next;
    await writeLocal(sortByCreatedAt(updated));
    return next;
  }

  const updates = [];

  if (input.name !== undefined) {
    updates.push(sql`name = ${String(input.name || '').slice(0, 80)}`);
  }
  if (input.location !== undefined) {
    updates.push(sql`location = ${input.location ? String(input.location).slice(0, 80) : null}`);
  }
  if (input.text !== undefined) {
    updates.push(sql`content = ${String(input.text || '').slice(0, 1000)}`);
  }
  if (input.language !== undefined) {
    updates.push(sql`language = ${String(input.language || 'all').slice(0, 5)}`);
  }
  if (input.rating !== undefined) {
    const parsed = Number(input.rating);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 5) {
      throw new Error('Rating must be between 1 and 5.');
    }
    updates.push(sql`rating = ${parsed}`);
  }

  if (!updates.length) {
    throw new Error('No fields to update.');
  }

  const { rows } = await sql`
    UPDATE reviews
    SET ${sql.join(updates, sql`, `)}
    WHERE id = ${reviewId}
    RETURNING id, name, location, rating, content AS text, language, created_at;
  `;

  return rows[0] || null;
}

export async function deleteReview(id) {
  const ready = await ensureTable();
  const reviewId = Number(id);
  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    throw new Error('Invalid review id.');
  }

  if (!ready) {
    if (isVercelRuntime()) {
      throw new Error('Missing Postgres connection string');
    }
    const list = await readLocal();
    const filtered = list.filter((item) => Number(item.id) !== reviewId);
    if (filtered.length === list.length) return false;
    await writeLocal(filtered);
    return true;
  }

  const result = await sql`DELETE FROM reviews WHERE id = ${reviewId};`;
  return result.rowCount > 0;
}
