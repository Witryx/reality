import { sql } from '@vercel/postgres';
import { promises as fs } from 'fs';
import path from 'path';
import {
  hasPostgresCredentials,
  isVercelRuntime,
  normalizePostgresEnv,
} from './postgresEnv.js';
import { mergePropertySources } from './propertyIdentity.js';

normalizePostgresEnv();

const LOCAL_PATH = path.join(process.cwd(), 'content', 'properties-local.json');
const STATIC_PATH = path.join(process.cwd(), 'public', 'data', 'properties.json');
let creationQueue = Promise.resolve();

const toSortOrder = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const normalized = Number(value);
  if (!Number.isInteger(normalized)) return null;
  return normalized;
};

const toPropertyId = (value) => {
  const normalized = Number(value);
  if (!Number.isInteger(normalized) || normalized <= 0) return null;
  return normalized;
};

const compareByDisplayOrder = (a = {}, b = {}) => {
  const aOrder = toSortOrder(a.sortOrder);
  const bOrder = toSortOrder(b.sortOrder);

  if (aOrder !== null && bOrder !== null && aOrder !== bOrder) return aOrder - bOrder;
  if (aOrder !== null) return -1;
  if (bOrder !== null) return 1;

  const timeDelta = new Date(b.created_at || 0) - new Date(a.created_at || 0);
  if (timeDelta !== 0) return timeDelta;

  return String(a.name || '').localeCompare(String(b.name || ''));
};

const sortByDisplayOrder = (list = []) => [...list].sort(compareByDisplayOrder);

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
  const name = String(input.name || '').slice(0, 200);
  const location = String(input.location || '').slice(0, 200);
  const price = String(input.price || '').slice(0, 200);

  const coverImage = input.image
    ? String(input.image).slice(0, 500)
    : imagesArray.length
      ? imagesArray[0]
      : null;

  const explicitDraft = input.draft !== undefined ? Boolean(input.draft) : null;
  const inferredDraft = !name.trim() || !location.trim() || !price.trim();

  return {
    name,
    location,
    price,
    sqm: input.sqm ? String(input.sqm).slice(0, 50) : null,
    rooms: input.rooms ? String(input.rooms).slice(0, 50) : null,
    sortOrder: toSortOrder(input.sortOrder),
    image: coverImage,
    images: imagesArray.length ? imagesArray : null,
    videos: videosArray.length ? videosArray : null,
    tag: input.tag ? String(input.tag).slice(0, 50) : null,
    description: input.description ? String(input.description).slice(0, 2000) : null,
    language: String(input.language || 'cz').slice(0, 5),
    sold: Boolean(input.sold),
    draft: explicitDraft ?? inferredDraft,
    sourcePropertyId: toPropertyId(input.sourcePropertyId),
    fallbackPropertyId: toPropertyId(input.fallbackPropertyId),
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
      sort_order INTEGER,
      sold BOOLEAN DEFAULT FALSE,
      language VARCHAR(5) DEFAULT 'cz',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Backfill new columns if they don't exist.
  await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS images JSONB;`;
  await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS videos JSONB;`;
  await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS description TEXT;`;
  await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS sort_order INTEGER;`;
  await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS draft BOOLEAN DEFAULT FALSE;`;
  await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS source_property_id INTEGER;`;
  await sql`ALTER TABLE properties ADD COLUMN IF NOT EXISTS fallback_property_id INTEGER;`;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS properties_fallback_language_idx
    ON properties (fallback_property_id, language);
  `;

  return true;
}

async function fetchPropertyById(id) {
  const ready = await ensureTable();
  const propertyId = toPropertyId(id);
  if (!propertyId) {
    throw new Error('Invalid property id.');
  }

  if (!ready) {
    const list = await readLocal();
    return list.find((item) => Number(item.id) === propertyId) || null;
  }

  const { rows } = await sql`
    SELECT
      id,
      name,
      location,
      price,
      sqm,
      rooms,
      sort_order AS "sortOrder",
      image,
      images,
      videos,
      tag,
      description,
      sold,
      draft,
      source_property_id AS "sourcePropertyId",
      fallback_property_id AS "fallbackPropertyId",
      language,
      created_at
    FROM properties
    WHERE id = ${propertyId}
    LIMIT 1;
  `;

  return rows[0] || null;
}

async function fetchPropertyBySourceAndLanguage(sourcePropertyId, language) {
  const ready = await ensureTable();
  const normalizedSourceId = toPropertyId(sourcePropertyId);
  const normalizedLanguage = String(language || '').trim().slice(0, 5);

  if (!normalizedSourceId || !normalizedLanguage) return null;

  if (!ready) {
    const list = await readLocal();
    return (
      list.find(
        (item) =>
          Number(item.sourcePropertyId) === normalizedSourceId &&
          String(item.language || 'cz') === normalizedLanguage
      ) || null
    );
  }

  const { rows } = await sql`
    SELECT
      id,
      name,
      location,
      price,
      sqm,
      rooms,
      sort_order AS "sortOrder",
      image,
      images,
      videos,
      tag,
      description,
      sold,
      draft,
      source_property_id AS "sourcePropertyId",
      fallback_property_id AS "fallbackPropertyId",
      language,
      created_at
    FROM properties
    WHERE source_property_id = ${normalizedSourceId}
      AND language = ${normalizedLanguage}
    ORDER BY created_at DESC
    LIMIT 1;
  `;

  return rows[0] || null;
}

export async function fetchProperties(language, options = {}) {
  const ready = await ensureTable();
  const includeDrafts = Boolean(options?.includeDrafts);
  if (!ready) {
    const list = await readLocal();
    const filtered = list.filter((item) => {
      if (!includeDrafts && item?.draft) return false;
      if (!language) return true;
      return item.language === language || !item.language;
    });
    return sortByDisplayOrder(filtered);
  }

  if (language) {
    const { rows } = includeDrafts
      ? await sql`
          SELECT
            id,
            name,
            location,
            price,
            sqm,
            rooms,
            sort_order AS "sortOrder",
            image,
            images,
            videos,
            tag,
            description,
            sold,
            draft,
            source_property_id AS "sourcePropertyId",
            fallback_property_id AS "fallbackPropertyId",
            language,
            created_at
          FROM properties
          WHERE language = ${language} OR language IS NULL
          ORDER BY
            CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END,
            sort_order ASC,
            created_at DESC;
        `
      : await sql`
          SELECT
            id,
            name,
            location,
            price,
            sqm,
            rooms,
            sort_order AS "sortOrder",
            image,
            images,
            videos,
            tag,
            description,
            sold,
            draft,
            source_property_id AS "sourcePropertyId",
            fallback_property_id AS "fallbackPropertyId",
            language,
            created_at
          FROM properties
          WHERE (language = ${language} OR language IS NULL)
            AND NOT COALESCE(draft, FALSE)
          ORDER BY
            CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END,
            sort_order ASC,
            created_at DESC;
        `;

    return rows;
  }

  const { rows } = includeDrafts
    ? await sql`
        SELECT
          id,
          name,
          location,
          price,
          sqm,
          rooms,
          sort_order AS "sortOrder",
          image,
          images,
          videos,
          tag,
          description,
          sold,
          draft,
          source_property_id AS "sourcePropertyId",
          fallback_property_id AS "fallbackPropertyId",
          language,
          created_at
        FROM properties
        ORDER BY
          CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END,
          sort_order ASC,
          created_at DESC;
      `
    : await sql`
        SELECT
          id,
          name,
          location,
          price,
          sqm,
          rooms,
          sort_order AS "sortOrder",
          image,
          images,
          videos,
          tag,
          description,
          sold,
          draft,
          source_property_id AS "sourcePropertyId",
          fallback_property_id AS "fallbackPropertyId",
          language,
          created_at
        FROM properties
        WHERE NOT COALESCE(draft, FALSE)
        ORDER BY
          CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END,
          sort_order ASC,
          created_at DESC;
      `;

  return rows;
}

export async function createProperty(input) {
  // Serialize imports within this process as well as relying on the database's
  // unique constraint. This also makes repeated imports safe in local storage.
  const creation = creationQueue.then(() => insertProperty(input));
  creationQueue = creation.catch(() => {});
  return creation;
}

async function insertProperty(input) {
  const ready = await ensureTable();
  const payload = sanitizePayload(input);

  if (payload.fallbackPropertyId) {
    const stored = await fetchProperties(payload.language, { includeDrafts: true });
    const existing = stored.find((item) => Number(item.fallbackPropertyId) === payload.fallbackPropertyId);
    if (existing) return existing;

    // Reuse imports made by older versions before they recorded the static ID.
    const parsed = JSON.parse(await fs.readFile(STATIC_PATH, 'utf8'));
    const fallback = Array.isArray(parsed) ? parsed : parsed.properties || [];
    const legacy = mergePropertySources(stored, fallback).find(
      (item) => item.persisted && item.fallbackPropertyId === payload.fallbackPropertyId
    );
    if (legacy) {
      return updateProperty({ id: legacy.id, fallbackPropertyId: payload.fallbackPropertyId });
    }
  }

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
    const updated = sortByDisplayOrder([item, ...list]);
    await writeLocal(updated);
    return item;
  }

  try {
    const imagesJson = payload.images ? JSON.stringify(payload.images) : null;
    const videosJson = payload.videos ? JSON.stringify(payload.videos) : null;
    const { rows } = await sql`
      INSERT INTO properties (
        name,
        location,
        price,
        sqm,
        rooms,
        sort_order,
        image,
        images,
        videos,
        tag,
        description,
        language,
        draft,
        source_property_id,
        fallback_property_id
      )
      VALUES (
        ${payload.name},
        ${payload.location},
        ${payload.price},
        ${payload.sqm},
        ${payload.rooms},
        ${payload.sortOrder},
        ${payload.image},
        ${imagesJson}::jsonb,
        ${videosJson}::jsonb,
        ${payload.tag},
        ${payload.description},
        ${payload.language},
        ${payload.draft},
        ${payload.sourcePropertyId},
        ${payload.fallbackPropertyId}
      )
      ON CONFLICT (fallback_property_id, language)
      DO UPDATE SET fallback_property_id = EXCLUDED.fallback_property_id
      RETURNING
        id,
        name,
        location,
        price,
        sqm,
        rooms,
        sort_order AS "sortOrder",
        image,
        images,
        videos,
        tag,
        description,
        sold,
        draft,
        source_property_id AS "sourcePropertyId",
        fallback_property_id AS "fallbackPropertyId",
        language,
        created_at;
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
    await writeLocal(sortByDisplayOrder(updatedList));
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
    'sortOrder',
    'images',
    'videos',
    'image',
    'sold',
    'draft',
    'sourcePropertyId',
    'fallbackPropertyId',
  ];

  const hasUpdates = updatableKeys.some((key) => Object.prototype.hasOwnProperty.call(input, key));
  if (!hasUpdates) {
    throw new Error('No fields to update.');
  }

  const { rows: existingRows } = await sql`
    SELECT
      id,
      name,
      location,
      price,
      sqm,
      rooms,
      sort_order AS "sortOrder",
      image,
      images,
      videos,
      tag,
      description,
      sold,
      draft,
      source_property_id AS "sourcePropertyId",
      fallback_property_id AS "fallbackPropertyId",
      language
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
  const nextSortOrder =
    input.sortOrder !== undefined ? toSortOrder(input.sortOrder) : toSortOrder(existing.sortOrder);
  const nextSourcePropertyId =
    input.sourcePropertyId !== undefined
      ? toPropertyId(input.sourcePropertyId)
      : toPropertyId(existing.sourcePropertyId);
  const nextFallbackPropertyId =
    input.fallbackPropertyId !== undefined
      ? toPropertyId(input.fallbackPropertyId)
      : toPropertyId(existing.fallbackPropertyId);

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
  const nextDraft =
    input.draft !== undefined
      ? Boolean(input.draft)
      : !nextName.trim() || !nextLocation.trim() || !nextPrice.trim();
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
      sort_order = ${nextSortOrder},
      image = ${nextImage},
      images = ${imagesJson}::jsonb,
      videos = ${videosJson}::jsonb,
      tag = ${nextTag},
      description = ${nextDescription},
      language = ${nextLanguage},
      sold = ${nextSold},
      draft = ${nextDraft},
      source_property_id = ${nextSourcePropertyId},
      fallback_property_id = ${nextFallbackPropertyId}
    WHERE id = ${propertyId}
    RETURNING
      id,
      name,
      location,
      price,
      sqm,
      rooms,
      sort_order AS "sortOrder",
      image,
      images,
      videos,
      tag,
      description,
      sold,
      draft,
      source_property_id AS "sourcePropertyId",
      fallback_property_id AS "fallbackPropertyId",
      language,
      created_at;
  `;

  return rows[0];
}

export async function clonePropertyTranslationDraft(sourceId, targetLanguage) {
  const propertyId = toPropertyId(sourceId);
  if (!propertyId) {
    throw new Error('Invalid source property id.');
  }

  const normalizedLanguage = String(targetLanguage || '')
    .trim()
    .slice(0, 5)
    .toLowerCase();

  if (!normalizedLanguage) {
    throw new Error('Missing target language.');
  }

  if (!['en', 'de'].includes(normalizedLanguage)) {
    throw new Error('Invalid target language.');
  }

  const source = await fetchPropertyById(propertyId);
  if (!source) {
    throw new Error('Source property not found.');
  }

  const sourceLanguage = String(source.language || 'cz').toLowerCase();
  if (sourceLanguage !== 'cz') {
    throw new Error('Only CZ properties can be cloned.');
  }

  if (normalizedLanguage === sourceLanguage) {
    throw new Error('Target language must differ from source language.');
  }

  const existing = await fetchPropertyBySourceAndLanguage(propertyId, normalizedLanguage);
  if (existing) {
    return { property: existing, created: false };
  }

  const sourceImages = toImagesArray(source.images);
  const coverImage =
    source.image && String(source.image).trim()
      ? String(source.image).slice(0, 500)
      : sourceImages[0] || null;

  const property = await createProperty({
    name: '',
    location: '',
    price: '',
    sqm: null,
    rooms: null,
    sortOrder: toSortOrder(source.sortOrder),
    image: coverImage,
    images: sourceImages,
    videos: null,
    tag: null,
    description: source.description ? String(source.description).slice(0, 2000) : null,
    language: normalizedLanguage,
    sold: Boolean(source.sold),
    draft: true,
    sourcePropertyId: propertyId,
  });

  return { property, created: true };
}

export async function reorderProperties(orderUpdates = [], language = null) {
  const ready = await ensureTable();
  const normalizedUpdates = orderUpdates.map((entry) => ({
    id: Number(entry?.id),
    sortOrder: toSortOrder(entry?.sortOrder),
  }));

  if (!normalizedUpdates.length) {
    throw new Error('No order updates provided.');
  }

  if (
    normalizedUpdates.some(
      (entry) => !Number.isInteger(entry.id) || entry.id <= 0 || entry.sortOrder === null || entry.sortOrder <= 0
    )
  ) {
    throw new Error('Invalid property order payload.');
  }

  if (!ready) {
    if (isVercelRuntime()) {
      throw new Error('Missing Postgres connection string');
    }

    const updatesMap = new Map(normalizedUpdates.map((entry) => [entry.id, entry.sortOrder]));
    const list = await readLocal();
    const updated = list.map((item) =>
      updatesMap.has(Number(item.id))
        ? { ...item, sortOrder: updatesMap.get(Number(item.id)) }
        : item
    );

    await writeLocal(sortByDisplayOrder(updated));
    return fetchProperties(language);
  }

  for (const entry of normalizedUpdates) {
    const result = await sql`
      UPDATE properties
      SET sort_order = ${entry.sortOrder}
      WHERE id = ${entry.id};
    `;

    if (!result.rowCount) {
      throw new Error('Property not found.');
    }
  }

  return fetchProperties(language);
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
