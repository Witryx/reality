import { promises as fs } from 'fs';
import path from 'path';
import EgyptRealEstate from '../../../egypt-real-estate-modern';
import { fetchProperties } from '../../../lib/properties';
import {
  getPropertyIdFromSlug,
  getPropertyPath,
  normalizePropertyLanguage,
} from '../../../lib/propertyUrl';

export const dynamic = 'force-dynamic';

const toImages = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== 'string') return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : value ? [value] : [];
  } catch {
    return value ? [value] : [];
  }
};

const findProperty = async (id, language) => {
  if (!id) return null;

  try {
    const stored = await fetchProperties(language);
    const match = stored.find((property) => Number(property?.id) === id && !property?.draft);
    if (match) return match;
  } catch (error) {
    console.error('Property metadata database lookup failed', error);
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'properties.json');
    const parsed = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const list = Array.isArray(parsed) ? parsed : parsed?.properties || [];
    return list.find(
      (property) =>
        Number(property?.id) === id &&
        !property?.draft &&
        (!property?.language || property.language === language)
    ) || null;
  } catch (error) {
    console.error('Property metadata fallback lookup failed', error);
    return null;
  }
};

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const language = normalizePropertyLanguage(query?.lang);
  const property = await findProperty(getPropertyIdFromSlug(slug), language);

  if (!property) {
    return {
      title: 'Nabídka nemovitosti | Egyptsko Česká Reality',
      description: 'Nemovitosti v Hurghadě a okolí.',
    };
  }

  const description = String(property.description || property.longDescription || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
  const images = toImages(property.images);
  const cover = property.image || images[0];
  const canonical = getPropertyPath(property, language);

  return {
    title: `${property.name} | Egyptsko Česká Reality`,
    description: description || `${property.location} · ${property.price}`,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: property.name,
      description: description || `${property.location} · ${property.price}`,
      url: canonical,
      images: cover ? [{ url: cover, alt: property.name }] : [],
    },
  };
}

export default async function PropertyPage({ searchParams }) {
  const query = await searchParams;

  return (
    <EgyptRealEstate
      initialLanguage={normalizePropertyLanguage(query?.lang)}
    />
  );
}
