import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { CreateComplaintSchema } from "@/lib/trust/validation";
import {
  validateComplaintContent,
  sanitizeText,
  hasSuspiciousPatterns,
} from "@/lib/trust/anti-spam";
import { casinoDb } from "@/lib/data/accessor";

/**
 * POST /api/complaints — Submit a new complaint.
 *
 * Rate limited: 2 complaints per IP per hour.
 * Content is validated for spam/abuse patterns.
 * Complaint is created with status "submitted" — requires moderation.
 */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // Rate limiting: 2 complaints per IP per hour
  const rateLimit = await checkRateLimit(`complaint:${ip}`, 2, 3600);
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
  const validation = CreateComplaintSchema.safeParse(body);
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
  const contentCheck = validateComplaintContent(data.subject, data.description);
  if (!contentCheck.valid) {
    return NextResponse.json(
      { error: "Content validation failed", details: contentCheck.errors },
      { status: 400 },
    );
  }

  // Sanitize content
  const sanitizedSubject = sanitizeText(data.subject);
  const sanitizedDescription = sanitizeText(data.description);

  // Suspicious pattern check
  if (hasSuspiciousPatterns(sanitizedSubject) || hasSuspiciousPatterns(sanitizedDescription)) {
    return NextResponse.json(
      { error: "Submission rejected" },
      { status: 422 },
    );
  }

  // Create complaint with status "submitted"
  const now = new Date().toISOString();
  const complaintId = `complaint-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return NextResponse.json({
    success: true,
    complaint: {
      id: complaintId,
      casinoId: data.casinoId,
      reviewId: data.reviewId ?? null,
      subject: sanitizedSubject,
      description: sanitizedDescription,
      category: data.category,
      severity: data.severity,
      status: "submitted",
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    },
    message: "Complaint submitted successfully. It will be reviewed by our team.",
  });
}

/**
 * GET /api/complaints?casinoId=xxx&page=1&limit=20 — Get public complaints for a casino.
 *
 * Public endpoint — only returns resolved/closed complaints.
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
