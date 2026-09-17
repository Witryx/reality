const languageOf = (property) => property.language || 'cz';

const positiveId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const mediaOf = (property) => {
  let images = property.images || [];
  if (typeof images === 'string') {
    try {
      images = JSON.parse(images);
    } catch {
      images = [images];
    }
  }
  return new Set([property.image, ...(Array.isArray(images) ? images : [])].filter(Boolean));
};

const fallbackKey = (property) =>
  property.fallbackPropertyId ? `fallback:${property.fallbackPropertyId}:${languageOf(property)}` : null;

export const getPropertyKey = (property = {}) => {
  if (property.persisted === false && fallbackKey(property)) return fallbackKey(property);
  return property.id
    ? `id:${property.id}`
    : `name:${property.name}|${property.location}|${languageOf(property)}`;
};

// Older imports did not keep their static ID. Recover a link only when the
// original listing can be identified unambiguously within the same language.
const findLegacyFallback = (property, fallbacks) => {
  const media = mediaOf(property);
  const matches = fallbacks.filter((fallback) => {
    if (languageOf(property) !== languageOf(fallback)) return false;
    const sharedImages = [...mediaOf(fallback)].filter((src) => media.has(src)).length;
    const sameNameAndLocation =
      property.name && property.location &&
      property.name === fallback.name && property.location === fallback.location;
    return sharedImages >= 2 || (sameNameAndLocation && sharedImages >= 1);
  });
  return matches.length === 1 ? matches[0] : null;
};

export const mergePropertySources = (stored = [], fallback = []) => {
  const fallbacks = fallback.filter(Boolean).map((property) => ({
    ...property,
    persisted: false,
    fallbackPropertyId: positiveId(property.id),
  }));
  const storedProperties = stored.filter(Boolean);
  const candidates = storedProperties.map((property) => ({
    ...property,
    persisted: true,
    fallbackPropertyId:
      positiveId(property.fallbackPropertyId) ||
      positiveId(findLegacyFallback(property, fallbacks)?.id),
  }));
  const owners = new Map();
  candidates.forEach((candidate, index) => {
    const key = fallbackKey(candidate);
    if (!key) return;
    const explicit = Boolean(positiveId(storedProperties[index].fallbackPropertyId));
    const previous = owners.get(key);
    // Only one stored record can own an original. Prefer an existing link,
    // otherwise the latest import, without deleting older database records.
    if (!previous || (explicit && !previous.explicit) ||
      (explicit === previous.explicit && Number(candidate.id) > Number(previous.property.id))) {
      owners.set(key, { property: candidate, explicit });
    }
  });
  const persisted = candidates.map((property) => ({
    ...property,
    fallbackPropertyId: owners.get(fallbackKey(property))?.property === property ? property.fallbackPropertyId : null,
  }));
  const replaced = new Set(owners.keys());
  // Keep distinct stored records: similar flats must not be silently discarded.
  return [...persisted, ...fallbacks.filter((property) => !replaced.has(fallbackKey(property)))];
};

export const replaceProperty = (list, updated) => {
  const key = getPropertyKey(updated);
  const matches = (property) =>
    getPropertyKey(property) === key ||
    (property.persisted === false && fallbackKey(updated) && fallbackKey(property) === fallbackKey(updated));
  const index = list.findIndex(matches);
  if (index < 0) return [updated, ...list];
  return list.flatMap((property, current) => current === index ? [updated] : matches(property) ? [] : [property]);
};
