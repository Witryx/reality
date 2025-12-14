import { NextResponse } from "next/server";
import { createReview, fetchReviews } from "../../../lib/reviews";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get("lang") || "cz";
  const allParam = searchParams.get("all");
  const language = allParam === "1" || langParam === "all" ? "all" : langParam;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.max(1, Math.min(Number(searchParams.get("pageSize")) || 4, 50));
  const offset = (page - 1) * pageSize;

  try {
    const { rows, total, average, dbAvailable } = await fetchReviews({ language, limit: pageSize, offset });

    if (dbAvailable === false) {
      return NextResponse.json(
        {
          reviews: [],
          total: 0,
          average: 0,
          page,
          pageSize,
          language,
          dbAvailable,
          error: "Missing database connection (POSTGRES_URL).",
        },
        { status: 503 }
      );
    }

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
    console.error("GET /api/reviews", error);
    return NextResponse.json(
      {
        reviews: [],
        total: 0,
        average: 0,
        page,
        pageSize,
        language,
        dbAvailable: false,
        error: "Failed to load reviews from database.",
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
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, location, rating, text, language } = payload || {};
  const parsedRating = Number(rating);

  if (!name || !text || Number.isNaN(parsedRating)) {
    return NextResponse.json({ error: "Name, text and rating are required." }, { status: 400 });
  }

  if (parsedRating < 1 || parsedRating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }

  const safeReview = {
    name: String(name).slice(0, 80),
    location: location ? String(location).slice(0, 80) : null,
    rating: parsedRating,
    text: String(text).slice(0, 1000),
    language: (language || "cz").slice(0, 5),
  };

  try {
    const review = await createReview(safeReview);
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews", error);
    if (error.message?.includes("Missing Postgres connection string")) {
      return NextResponse.json(
        { error: "Missing database connection (POSTGRES_URL)." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Failed to save review.", detail: error.message },
      { status: 500 }
    );
  }
}
