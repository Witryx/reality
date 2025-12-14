import { NextResponse } from 'next/server';
import { createProperty, fetchProperties, markPropertySold } from '../../../lib/properties';

export const runtime = 'nodejs';

const requiredFields = ['name', 'location', 'price'];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('lang') || 'cz';

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

  const missing = requiredFields.filter((f) => !payload?.[f]);
  if (missing.length) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
  }

  try {
    const property = await createProperty(payload);
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

  const { id, sold } = payload || {};

  if (!id) {
    return NextResponse.json({ error: 'Missing property ID.' }, { status: 400 });
  }

  try {
    const property = await markPropertySold(id, Boolean(sold));
    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }
    return NextResponse.json({ property });
  } catch (error) {
    console.error('PATCH /api/properties', error);
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
