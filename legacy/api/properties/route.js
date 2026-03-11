import { NextResponse } from 'next/server';
import { createProperty, deleteProperty, fetchProperties, updateProperty } from '../../../lib/properties';

export const runtime = 'nodejs';

const requiredFields = ['name', 'location', 'price'];

const validatePayload = (payload = {}) => {
  const errors = [];
  const normalized = { ...payload };

  requiredFields.forEach((field) => {
    const value = typeof payload?.[field] === 'string' ? payload[field].trim() : '';
    if (!value) {
      errors.push(field);
    } else {
      normalized[field] = value;
    }
  });

  ['sqm', 'rooms'].forEach((field) => {
    const value = payload?.[field];
    if (value === undefined || value === null || value === '') {
      normalized[field] = null;
      return;
    }
    const asNumber = Number(value);
    if (Number.isNaN(asNumber)) {
      errors.push(field);
    } else {
      normalized[field] = String(asNumber);
    }
  });

  normalized.tag = typeof payload?.tag === 'string' ? payload.tag.trim().slice(0, 50) : null;
  normalized.language =
    typeof payload?.language === 'string' && payload.language.trim()
      ? payload.language.trim().slice(0, 5)
      : 'cz';
  normalized.description =
    typeof payload?.description === 'string' && payload.description.trim()
      ? payload.description.trim().slice(0, 2000)
      : null;
  normalized.images = Array.isArray(payload?.images) ? payload.images.filter(Boolean) : payload?.images || null;
  normalized.image = payload?.image || null;
  normalized.sold = Boolean(payload?.sold);

  return { errors, normalized };
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get('lang');
  const language = langParam && langParam !== 'all' ? langParam : null;

  try {
    const properties = await fetchProperties(language);
    return NextResponse.json({ properties });
  } catch (error) {
    console.error('GET /api/properties', error);
    return NextResponse.json(
      { error: 'Failed to load properties.', detail: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { errors, normalized } = validatePayload(payload);
  if (errors.length) {
    return NextResponse.json(
      { error: `Missing or invalid fields: ${errors.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    const property = await createProperty(normalized);
    if (!property) {
      return NextResponse.json({ error: 'Failed to save property.' }, { status: 500 });
    }
    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    console.error('POST /api/properties', error);
    if (error.message?.includes('Missing Postgres connection string')) {
      return NextResponse.json(
        { error: 'Missing database connection (POSTGRES_URL).' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to save property.', detail: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  let payload;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { id, sold, ...updates } = payload || {};

  if (!id) {
    return NextResponse.json({ error: 'Missing property ID.' }, { status: 400 });
  }

  try {
    const property = await updateProperty({ id, sold, ...updates });
    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }
    return NextResponse.json({ property });
  } catch (error) {
    console.error('PATCH /api/properties', error);
    if (error.message && ['No fields to update.', 'Invalid property id.'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error.message?.includes('Missing Postgres connection string')) {
      return NextResponse.json(
        { error: 'Missing database connection (POSTGRES_URL).' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update property.', detail: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const propertyId = payload?.id;
  if (!propertyId) {
    return NextResponse.json({ error: 'Missing property ID.' }, { status: 400 });
  }

  try {
    const removed = await deleteProperty(propertyId);
    if (!removed) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/properties', error);
    if (error.message?.includes('Missing Postgres connection string')) {
      return NextResponse.json(
        { error: 'Missing database connection (POSTGRES_URL).' },
        { status: 503 }
      );
    }
    if (error.message === 'Invalid property id.') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to delete property.', detail: error.message },
      { status: 500 }
    );
  }
}
