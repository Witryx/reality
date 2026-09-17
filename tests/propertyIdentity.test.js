import assert from 'node:assert/strict';
import test from 'node:test';
import { getPropertyKey, mergePropertySources, replaceProperty } from '../lib/propertyIdentity.js';

const original = {
  id: 101,
  name: 'Apartment',
  location: 'Hurghada',
  language: 'en',
  price: '50 000 EUR',
  images: ['/original-1.jpg', '/original-2.jpg'],
};

test('editing and reloading replaces the original even after every display field changes', () => {
  const initial = mergePropertySources([], [original]);
  const saved = {
    id: 7,
    fallbackPropertyId: original.id,
    persisted: true,
    language: 'en',
    name: 'Renamed apartment',
    location: 'New location',
    price: '60 000 EUR',
    images: ['/new.jpg'],
  };

  assert.deepEqual(replaceProperty(initial, saved), [saved]);
  assert.deepEqual(replaceProperty([saved], { ...saved, price: '55 000 EUR' }), [
    { ...saved, price: '55 000 EUR' },
  ]);
  assert.deepEqual(mergePropertySources([saved], [original]), [saved]);
});

test('recovers older imports with a changed name from their original gallery', () => {
  const saved = { ...original, id: 7, name: 'Renamed', images: JSON.stringify(original.images) };
  const merged = mergePropertySources([saved], [original]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, 7);
  assert.equal(merged[0].fallbackPropertyId, 101);
  assert.equal(merged[0].persisted, true);
});

test('database IDs cannot hide or overwrite unrelated static listings with the same ID', () => {
  const saved = { id: 101, name: 'Other flat', language: 'en' };
  const merged = mergePropertySources([saved], [original]);
  assert.equal(merged.length, 2);
  assert.notEqual(getPropertyKey(merged[0]), getPropertyKey(merged[1]));
  const updated = { ...merged[0], price: '70 000 EUR' };
  assert.deepEqual(replaceProperty(merged, updated), [updated, merged[1]]);
});

test('importing a static listing preserves an unrelated database row with the same numeric ID', () => {
  const unrelated = { id: 101, name: 'Other flat', language: 'en' };
  const initial = mergePropertySources([unrelated], [original]);
  const imported = { ...original, id: 9, fallbackPropertyId: 101, persisted: true };
  assert.deepEqual(replaceProperty(initial, imported), [initial[0], imported]);
});

test('similar names, one shared stock photo and other languages are kept separate', () => {
  const saved = { ...original, id: 7, images: ['/stock.jpg'] };
  const staticProperty = { ...original, images: ['/stock.jpg'], name: 'Different flat' };
  assert.equal(mergePropertySources([saved], [staticProperty]).length, 2);
  assert.equal(mergePropertySources([{ ...original, id: 7, language: 'de' }], [original]).length, 2);
});

test('ambiguous gallery matches do not assign the wrong original ID', () => {
  const saved = { ...original, id: 7 };
  const merged = mergePropertySources([saved], [original, { ...original, id: 102 }]);
  assert.equal(merged.length, 3);
  assert.equal(merged[0].fallbackPropertyId, null);
});

test('stored rows have distinct identities even when older imports share an original gallery', () => {
  const merged = mergePropertySources([{ ...original, id: 7 }, { ...original, id: 8 }], [original]);
  assert.equal(merged.length, 2);
  assert.notEqual(getPropertyKey(merged[0]), getPropertyKey(merged[1]));
  assert.equal(merged[0].fallbackPropertyId, null);
  assert.equal(merged[1].fallbackPropertyId, original.id);
  assert.equal(replaceProperty(merged, { ...merged[0], price: '1 EUR' }).length, 2);
});

test('an explicit original link takes precedence over a newer legacy copy', () => {
  const merged = mergePropertySources([
    { ...original, id: 7, fallbackPropertyId: original.id },
    { ...original, id: 8 },
  ], [original]);
  assert.equal(merged[0].fallbackPropertyId, original.id);
  assert.equal(merged[1].fallbackPropertyId, null);
});
