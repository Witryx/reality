import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { mergePropertySources, replaceProperty } from '../lib/propertyIdentity.js';

// This test process uses an isolated local store and never loads project secrets
// or connects to the configured application database.
const workspace = process.cwd();
const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'reality-properties-test-'));
const connectionKeys = Object.keys(process.env).filter((key) =>
  /^(POSTGRES_|DATABASE_|PG|VERCEL)/.test(key)
);
const previousEnvironment = Object.fromEntries(connectionKeys.map((key) => [key, process.env[key]]));
connectionKeys.forEach((key) => delete process.env[key]);
process.chdir(temporaryDirectory);
after(async () => {
  process.chdir(workspace);
  Object.assign(process.env, previousEnvironment);
  await fs.rm(temporaryDirectory, { recursive: true, force: true });
});

const original = {
  id: 101,
  name: 'Apartment',
  location: 'Hurghada',
  price: '50 000 EUR',
  language: 'en',
  images: ['/original-1.jpg', '/original-2.jpg'],
};
await fs.mkdir(path.join(temporaryDirectory, 'public', 'data'), { recursive: true });
await fs.writeFile(path.join(temporaryDirectory, 'public', 'data', 'properties.json'), JSON.stringify([original]));
const { createProperty, updateProperty, fetchProperties } = await import('../lib/properties.js');

test('first edit, subsequent edits, stale retries and reload keep a single stored listing', async () => {
  const initial = mergePropertySources([], [original]);
  const imported = await createProperty({ ...original, fallbackPropertyId: original.id });
  assert.notEqual(imported.id, original.id);
  assert.equal(replaceProperty(initial, imported).length, 1);

  const updated = await updateProperty({
    id: imported.id,
    name: 'New title',
    location: 'New location',
    price: '60 000 EUR',
    images: ['/replacement.jpg'],
  });
  assert.equal(updated.fallbackPropertyId, original.id);
  assert.equal(updated.id, imported.id);

  const retries = await Promise.all(Array.from({ length: 3 }, () =>
    createProperty({ ...original, fallbackPropertyId: original.id })
  ));
  assert.ok(retries.every((property) => property.id === imported.id && property.name === 'New title'));
  const stored = await fetchProperties('en', { includeDrafts: true });
  const reloaded = mergePropertySources(stored, [original]);
  assert.equal(stored.length, 1);
  assert.equal(reloaded.length, 1);
  assert.equal(reloaded[0].name, 'New title');
  assert.deepEqual(reloaded[0].images, ['/replacement.jpg']);

  assert.equal(await updateProperty({ id: 999, name: 'Missing' }), null);
  assert.equal((await fetchProperties('en')).length, 1);
});

test('simultaneous first imports are idempotent', async () => {
  const results = await Promise.all(Array.from({ length: 3 }, () =>
    createProperty({ ...original, language: 'de', fallbackPropertyId: original.id })
  ));
  assert.ok(results.every((property) => property.id === results[0].id));
  assert.equal((await fetchProperties('de')).length, 1);
});

test('an existing import from the old admin is reused and linked before editing', async () => {
  const legacyOriginal = { ...original, id: 202, language: 'cz' };
  await fs.writeFile(path.join(temporaryDirectory, 'public', 'data', 'properties.json'), JSON.stringify([original, legacyOriginal]));
  const legacy = await createProperty({ ...legacyOriginal, name: 'Previously edited title' });
  const imported = await createProperty({ ...legacyOriginal, fallbackPropertyId: legacyOriginal.id });
  assert.equal(imported.id, legacy.id);
  assert.equal(imported.name, 'Previously edited title');
  assert.equal(imported.fallbackPropertyId, 202);
  assert.equal((await fetchProperties('cz')).length, 1);
});
