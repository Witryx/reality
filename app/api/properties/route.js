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
      { error: 'Nepodařilo se načíst nemovitosti.', detail: error.message },
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
    return NextResponse.json(
      { error: `Chybí povinné údaje: ${missing.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    const property = await createProperty(payload);
    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    console.error('POST /api/properties', error);
    return NextResponse.json(
      { error: 'Nepodařilo se uložit nemovitost.', detail: error.message },
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
    return NextResponse.json({ error: 'Chybí ID nemovitosti.' }, { status: 400 });
  }

  try {
    const property = await markPropertySold(id, Boolean(sold));
    if (!property) {
      return NextResponse.json({ error: 'Nemovitost nenalezena.' }, { status: 404 });
    }
    return NextResponse.json({ property });
  } catch (error) {
    console.error('PATCH /api/properties', error);
    return NextResponse.json(
      { error: 'Nepodařilo se aktualizovat nemovitost.', detail: error.message },
      { status: 500 }
    );
  }
}
