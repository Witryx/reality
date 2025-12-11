import { NextResponse } from 'next/server';
import { createReview, fetchReviews } from '../../../lib/reviews';

export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get('lang') || 'cz';
  const allParam = searchParams.get('all');
  const language = allParam === '1' || langParam === 'all' ? 'all' : langParam;
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = Math.max(1, Math.min(Number(searchParams.get('pageSize')) || 4, 50));
  const offset = (page - 1) * pageSize;

  try {
    const { rows, total, average } = await fetchReviews({ language, limit: pageSize, offset });
    return NextResponse.json({
      reviews: rows,
      total,
      average,
      page,
      pageSize,
      language,
    });
  } catch (error) {
    console.error('GET /api/reviews', error);
    return NextResponse.json(
      { error: 'Nepodařilo se načíst recenze.', detail: error.message },
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

  const { name, location, rating, text, language } = payload || {};
  const parsedRating = Number(rating);

  if (!name || !text || Number.isNaN(parsedRating)) {
    return NextResponse.json({ error: 'Jméno, text a hodnocení jsou povinné.' }, { status: 400 });
  }

  if (parsedRating < 1 || parsedRating > 5) {
    return NextResponse.json({ error: 'Hodnocení musí být mezi 1 a 5.' }, { status: 400 });
  }

  const safeReview = {
    name: String(name).slice(0, 80),
    location: location ? String(location).slice(0, 80) : null,
    rating: parsedRating,
    text: String(text).slice(0, 1000),
    language: (language || 'cz').slice(0, 5),
  };

  try {
    const review = await createReview(safeReview);
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('POST /api/reviews', error);
    return NextResponse.json(
      { error: 'Nepodařilo se uložit recenzi.', detail: error.message },
      { status: 500 }
    );
  }
}
