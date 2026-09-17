import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { CreateReviewSchema } from "@/lib/trust/validation";
import {
  validateReviewContent,
  sanitizeText,
  hasSuspiciousPatterns,
} from "@/lib/trust/anti-spam";
import { casinoDb } from "@/lib/data/accessor";

/**
 * POST /api/reviews — Submit a new player review.
 *
 * Rate limited: 3 reviews per IP per hour.
 * Content is validated for spam/abuse patterns.
 * Review is created with status "pending" — requires moderation.
 */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // Rate limiting: 3 reviews per IP per hour
  const rateLimit = await checkRateLimit(`review:${ip}`, 3, 3600);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 },
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Schema validation
  const validation = CreateReviewSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.flatten() },
      { status: 400 },
    );
  }

  const data = validation.data;

  // Verify casino exists
  const casino = casinoDb.getCasinoById(data.casinoId);
  if (!casino) {
    return NextResponse.json(
      { error: "Casino not found" },
      { status: 404 },
    );
  }

  // Content validation (spam/abuse)
  const contentCheck = validateReviewContent(data.title, data.body, data.rating);
  if (!contentCheck.valid) {
    return NextResponse.json(
      { error: "Content validation failed", details: contentCheck.errors },
      { status: 400 },
    );
  }

  // Sanitize content
  const sanitizedTitle = sanitizeText(data.title);
  const sanitizedBody = sanitizeText(data.body);

  // Suspicious pattern check
  if (hasSuspiciousPatterns(sanitizedTitle) || hasSuspiciousPatterns(sanitizedBody)) {
    return NextResponse.json(
      { error: "Submission rejected" },
      { status: 422 },
    );
  }

  // Duplicate content check (would need database access in production)
  // In Phase 27, we use a simple in-memory check placeholder

  // Frequency check (would need database access in production)
  // In Phase 27, rate limiting handles this via IP

  // Create review with status "pending"
  const now = new Date().toISOString();
  const reviewId = `review-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // In production, this would write to the database
  // For now, return the validated review structure
  return NextResponse.json({
    success: true,
    review: {
      id: reviewId,
      casinoId: data.casinoId,
      title: sanitizedTitle,
      body: sanitizedBody,
      rating: data.rating,
      status: "pending",
      verificationStatus: "unverified",
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    },
    message: "Review submitted successfully. It will be visible after moderation.",
  });
}

/**
 * GET /api/reviews?casinoId=xxx&page=1&limit=20 — Get approved reviews for a casino.
 *
 * Public endpoint — only returns approved reviews.
 * Supports pagination.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const casinoId = searchParams.get("casinoId");
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "20";

  if (!casinoId) {
    return NextResponse.json(
      { error: "casinoId is required" },
      { status: 400 },
    );
  }

  // Verify casino exists
  const casino = casinoDb.getCasinoById(casinoId);
  if (!casino) {
    return NextResponse.json(
      { error: "Casino not found" },
      { status: 404 },
    );
  }

  // In production, this would query the database for approved reviews
  // For now, return empty array with pagination structure
  return NextResponse.json({
    data: [],
    pagination: {
      page: Number(page),
      limit: Math.min(100, Math.max(1, Number(limit) || 20)),
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
  });
}
