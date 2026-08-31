const SUPPORTED_LANGUAGES = new Set(['cz', 'en', 'de']);

export const normalizePropertyLanguage = (language = 'cz') =>
  SUPPORTED_LANGUAGES.has(String(language).toLowerCase())
    ? String(language).toLowerCase()
    : 'cz';

export const slugifyPropertyName = (value = '') => {
  const slug = String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return slug || 'nabidka';
};

export const getPropertyPath = (property = {}, language = property?.language || 'cz') => {
  const id = Number(property?.id);
  if (!Number.isInteger(id) || id <= 0) return '/#properties';

  const slug = slugifyPropertyName(property?.name);
  const lang = normalizePropertyLanguage(language);
  return `/nemovitost/${id}-${slug}?lang=${lang}`;
};

export const getPropertyIdFromSlug = (slug = '') => {
  const match = String(slug).match(/^(\d+)(?:-|$)/);
  const id = match ? Number(match[1]) : null;
  return Number.isInteger(id) && id > 0 ? id : null;
};

export const getPropertySlugFromPathname = (pathname = '') => {
  const match = String(pathname).match(/^\/nemovitost\/([^/?#]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
};
