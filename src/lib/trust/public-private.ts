/**
 * Public vs. private data separation for trust systems.
 *
 * Defines what data is exposed publicly and what remains internal.
 * Ensures private moderation data never leaks to client bundles.
 */

import type {
  PlayerReviewRecord,
  ComplaintRecord,
  ModerationActionRecord,
} from "@/lib/db/schema";

// ─── Public Review ────────────────────────────────────────────────────────

/**
 * Shape of a review exposed on public casino profile pages.
 * Excludes: moderation metadata, IP address, user agent, rejection reasons.
 */
export interface PublicReview {
  id: string;
  casinoId: string;
  title: string;
  body: string;
  rating: number;
  status: "approved";
  verificationStatus: "unverified" | "verified";
  publishedAt: string | null;
  createdAt: string;
  locale: string | null;
}

/**
 * Convert a database review record to a public review.
 * Only approved reviews should be exposed publicly.
 */
export function toPublicReview(
  record: PlayerReviewRecord,
): PublicReview | null {
  if (record.status !== "approved") return null;

  return {
    id: record.id,
    casinoId: record.casinoId,
    title: record.title,
    body: record.body,
    rating: record.rating,
    status: "approved",
    verificationStatus: record.verificationStatus as "unverified" | "verified",
    publishedAt: record.publishedAt,
    createdAt: record.createdAt,
    locale: record.locale,
  };
}

/**
 * Filter an array of review records to public reviews only.
 */
export function toPublicReviews(
  records: PlayerReviewRecord[],
): PublicReview[] {
  return records
    .map(toPublicReview)
    .filter((r): r is PublicReview => r !== null);
}

// ─── Public Complaint ─────────────────────────────────────────────────────

/**
 * Shape of a complaint exposed publicly.
 * Excludes: moderation metadata, IP address, user agent, internal notes.
 */
export interface PublicComplaint {
  id: string;
  casinoId: string;
  subject: string;
  category: string;
  severity: string;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
}

/**
 * Convert a database complaint record to a public complaint.
 * Only resolved/closed complaints should be exposed publicly (when appropriate).
 */
export function toPublicComplaint(
  record: ComplaintRecord,
): PublicComplaint | null {
  // Only expose resolved or closed complaints
  if (record.status !== "resolved" && record.status !== "closed") {
    return null;
  }

  return {
    id: record.id,
    casinoId: record.casinoId,
    subject: record.subject,
    category: record.category,
    severity: record.severity,
    status: record.status,
    createdAt: record.createdAt,
    resolvedAt: record.resolvedAt,
  };
}

/**
 * Filter an array of complaint records to public complaints only.
 */
export function toPublicComplaints(
  records: ComplaintRecord[],
): PublicComplaint[] {
  return records
    .map(toPublicComplaint)
    .filter((c): c is PublicComplaint => c !== null);
}

// ─── Public Aggregation ───────────────────────────────────────────────────

/**
 * Public aggregation of player reviews for a casino.
 * This is a SEPARATE signal from the editorial score.
 *
 * Editorial Score ≠ Player Rating ≠ Player Sentiment
 */
export interface PlayerRatingSummary {
  casinoId: string;
  averageRating: number | null;
  reviewCount: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

/**
 * Calculate public player rating summary from approved reviews.
 */
export function calculatePlayerRatingSummary(
  reviews: PlayerReviewRecord[],
): PlayerRatingSummary {
  const approved = reviews.filter((r) => r.status === "approved");

  if (approved.length === 0) {
    return {
      casinoId: approved[0]?.casinoId ?? "",
      averageRating: null,
      reviewCount: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const sum = approved.reduce((acc, r) => acc + r.rating, 0);
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const r of approved) {
    distribution[r.rating as keyof typeof distribution]++;
  }

  return {
    casinoId: approved[0].casinoId,
    averageRating: Math.round((sum / approved.length) * 10) / 10,
    reviewCount: approved.length,
    distribution,
  };
}

// ─── Private Moderation Data ──────────────────────────────────────────────

/**
 * Private moderation data — NEVER exposed to client bundles.
 * Used only in admin/moderation contexts.
 */
export interface ModerationSummary {
  targetType: "review" | "complaint";
  targetId: string;
  status: string;
  moderationActions: Array<{
    action: string;
    moderatorId: string;
    reason: string | null;
    createdAt: string;
  }>;
  lastModeratedAt: string | null;
  lastModeratedBy: string | null;
}

/**
 * Build a moderation summary from action records.
 */
export function buildModerationSummary(
  targetType: "review" | "complaint",
  targetId: string,
  currentStatus: string,
  actions: ModerationActionRecord[],
): ModerationSummary {
  const targetActions = actions
    .filter((a) => a.targetType === targetType && a.targetId === targetId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return {
    targetType,
    targetId,
    status: currentStatus,
    moderationActions: targetActions.map((a) => ({
      action: a.action,
      moderatorId: a.moderatorId,
      reason: a.reason,
      createdAt: a.createdAt,
    })),
    lastModeratedAt: targetActions[0]?.createdAt ?? null,
    lastModeratedBy: targetActions[0]?.moderatorId ?? null,
  };
}
