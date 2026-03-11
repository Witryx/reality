import { NextResponse } from 'next/server';
import {
  createReview,
  deleteReview,
  fetchReviews,
  updateReview,
} from '../../../lib/reviews';

export const runtime = 'nodejs';

const parseRating = (rating) => {
  const parsed = Number(rating);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < 1 || parsed > 5) return null;
  return parsed;
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('lang') || 'all';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = Math.max(1, Math.min(Number(searchParams.get('pageSize')) || 12, 100));
  const offset = (page - 1) * pageSize;

  try {
    const { rows, total, average, dbAvailable } = await fetchReviews({
      language,
      limit: pageSize,
      offset,
    });

    return NextResponse.json({
      reviews: rows || [],
      total,
      average,
      page,
      pageSize,
      language,
      dbAvailable,
    });
  } catch (error) {
    console.error('GET /api/reviews', error);
    return NextResponse.json(
      {
        reviews: [],
        total: 0,
        average: 0,
        page,
        pageSize,
        language,
        dbAvailable: false,
        error: 'Failed to load reviews.',
        detail: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { name, location, rating, text, language } = payload || {};
  const parsedRating = parseRating(rating);

  if (!name || !text || parsedRating === null) {
    return NextResponse.json(
      { error: 'Name, text and rating (1-5) are required.' },
      { status: 400 }
    );
  }

  const safeReview = {
    name: String(name).slice(0, 80),
    location: location ? String(location).slice(0, 80) : null,
    rating: parsedRating,
    text: String(text).slice(0, 1000),
    language: (language || 'all').slice(0, 5),
  };

  try {
    const review = await createReview(safeReview);
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('POST /api/reviews', error);
    return NextResponse.json(
      { error: 'Failed to save review.', detail: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { id, ...updates } = payload || {};
  if (!id) {
    return NextResponse.json({ error: 'Missing review ID.' }, { status: 400 });
  }

  if (updates.rating !== undefined) {
    const parsed = parseRating(updates.rating);
    if (parsed === null) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }
    updates.rating = parsed;
  }

  try {
    const review = await updateReview({ id, ...updates });
    if (!review) {
      return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error('PATCH /api/reviews', error);
    if (
      ['Invalid review id.', 'No fields to update.', 'Rating must be between 1 and 5.'].includes(error.message)
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to update review.', detail: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const reviewId = payload?.id;
  if (!reviewId) {
    return NextResponse.json({ error: 'Missing review ID.' }, { status: 400 });
  }

  try {
    const removed = await deleteReview(reviewId);
    if (!removed) {
      return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/reviews', error);
    if (error.message === 'Invalid review id.') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to delete review.', detail: error.message },
      { status: 500 }
    );
  }
}
