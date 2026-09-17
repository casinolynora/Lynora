/**
 * Trust and player systems tests.
 *
 * Tests for:
 * - Schema validation (reviews, complaints, moderation)
 * - Status transitions (reviews, complaints)
 * - Anti-spam rules (content validation, duplicate detection)
 * - Public/private data separation
 * - Pagination
 * - Content sanitization
 */

import { describe, it, expect } from "vitest";
import {
  CreateReviewSchema,
  CreateComplaintSchema,
  CreateModerationActionSchema,
  PlayerRatingSchema,
  ComplaintCategorySchema,
  ComplaintSeveritySchema,
} from "@/lib/trust/validation";
import {
  isValidReviewTransition,
  getValidReviewTransitions,
  isValidComplaintTransition,
  canChangeSeverity,
} from "@/lib/trust/transitions";
import {
  validateReviewContent,
  validateComplaintContent,
  textSimilarity,
  isDuplicateContent,
  checkSubmissionFrequency,
  sanitizeText,
  hasSuspiciousPatterns,
} from "@/lib/trust/anti-spam";
import {
  toPublicReview,
  toPublicReviews,
  toPublicComplaint,
  toPublicComplaints,
  calculatePlayerRatingSummary,
  buildModerationSummary,
} from "@/lib/trust/public-private";
import {
  parsePaginationParams,
  paginate,
} from "@/lib/trust/pagination";
import type { PlayerReviewRecord, ComplaintRecord, ModerationActionRecord } from "@/lib/db/schema";

// ─── Review Validation Tests ──────────────────────────────────────────────

describe("Review Validation", () => {
  it("accepts a valid review", () => {
    const result = CreateReviewSchema.safeParse({
      casinoId: "germany-bwin",
      title: "Great casino experience",
      body: "I had a wonderful time playing at this casino. The games are fair and payouts are quick.",
      rating: 4,
    });
    expect(result.success).toBe(true);
  });

  it("rejects review with short title", () => {
    const result = CreateReviewSchema.safeParse({
      casinoId: "germany-bwin",
      title: "Hi",
      body: "I had a wonderful time playing at this casino. The games are fair and payouts are quick.",
      rating: 4,
    });
    expect(result.success).toBe(false);
  });

  it("rejects review with short body", () => {
    const result = CreateReviewSchema.safeParse({
      casinoId: "germany-bwin",
      title: "Great casino experience",
      body: "Too short",
      rating: 4,
    });
    expect(result.success).toBe(false);
  });

  it("rejects review with invalid rating (0)", () => {
    const result = CreateReviewSchema.safeParse({
      casinoId: "germany-bwin",
      title: "Great casino experience",
      body: "I had a wonderful time playing at this casino. The games are fair and payouts are quick.",
      rating: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects review with invalid rating (6)", () => {
    const result = CreateReviewSchema.safeParse({
      casinoId: "germany-bwin",
      title: "Great casino experience",
      body: "I had a wonderful time playing at this casino. The games are fair and payouts are quick.",
      rating: 6,
    });
    expect(result.success).toBe(false);
  });

  it("rejects review with non-integer rating", () => {
    const result = CreateReviewSchema.safeParse({
      casinoId: "germany-bwin",
      title: "Great casino experience",
      body: "I had a wonderful time playing at this casino. The games are fair and payouts are quick.",
      rating: 3.5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects review without casinoId", () => {
    const result = CreateReviewSchema.safeParse({
      title: "Great casino experience",
      body: "I had a wonderful time playing at this casino. The games are fair and payouts are quick.",
      rating: 4,
    });
    expect(result.success).toBe(false);
  });

  it("PlayerRatingSchema accepts 1-5 integers", () => {
    expect(PlayerRatingSchema.safeParse(1).success).toBe(true);
    expect(PlayerRatingSchema.safeParse(3).success).toBe(true);
    expect(PlayerRatingSchema.safeParse(5).success).toBe(true);
    expect(PlayerRatingSchema.safeParse(0).success).toBe(false);
    expect(PlayerRatingSchema.safeParse(6).success).toBe(false);
    expect(PlayerRatingSchema.safeParse(2.5).success).toBe(false);
  });
});

// ─── Complaint Validation Tests ───────────────────────────────────────────

describe("Complaint Validation", () => {
  it("accepts a valid complaint", () => {
    const result = CreateComplaintSchema.safeParse({
      casinoId: "germany-bwin",
      subject: "Withdrawal not processed",
      description: "I requested a withdrawal 5 days ago and it has not been processed yet. This is unacceptable.",
      category: "withdrawal",
      severity: "high",
    });
    expect(result.success).toBe(true);
  });

  it("accepts complaint without severity (uses default)", () => {
    const result = CreateComplaintSchema.safeParse({
      casinoId: "germany-bwin",
      subject: "Withdrawal not processed",
      description: "I requested a withdrawal 5 days ago and it has not been processed yet. This is unacceptable.",
      category: "withdrawal",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.severity).toBe("medium");
    }
  });

  it("rejects complaint with invalid category", () => {
    const result = CreateComplaintSchema.safeParse({
      casinoId: "germany-bwin",
      subject: "Withdrawal not processed",
      description: "I requested a withdrawal 5 days ago and it has not been processed yet.",
      category: "invalid_category",
    });
    expect(result.success).toBe(false);
  });

  it("rejects complaint with short subject", () => {
    const result = CreateComplaintSchema.safeParse({
      casinoId: "germany-bwin",
      subject: "Hi",
      description: "I requested a withdrawal 5 days ago and it has not been processed yet.",
      category: "withdrawal",
    });
    expect(result.success).toBe(false);
  });

  it("ComplaintCategorySchema accepts all valid categories", () => {
    const validCategories = [
      "withdrawal", "deposit", "account", "verification",
      "bonus", "customer_support", "technical", "responsible_gambling", "other",
    ];
    for (const cat of validCategories) {
      expect(ComplaintCategorySchema.safeParse(cat).success).toBe(true);
    }
  });

  it("ComplaintSeveritySchema accepts low/medium/high", () => {
    expect(ComplaintSeveritySchema.safeParse("low").success).toBe(true);
    expect(ComplaintSeveritySchema.safeParse("medium").success).toBe(true);
    expect(ComplaintSeveritySchema.safeParse("high").success).toBe(true);
    expect(ComplaintSeveritySchema.safeParse("critical").success).toBe(false);
  });
});

// ─── Moderation Validation Tests ──────────────────────────────────────────

describe("Moderation Validation", () => {
  it("accepts a valid moderation action", () => {
    const result = CreateModerationActionSchema.safeParse({
      targetType: "review",
      targetId: "review-123",
      action: "approve",
      moderatorId: "admin",
    });
    expect(result.success).toBe(true);
  });

  it("accepts moderation action with reason", () => {
    const result = CreateModerationActionSchema.safeParse({
      targetType: "complaint",
      targetId: "complaint-456",
      action: "reject",
      moderatorId: "admin",
      reason: "Spam content detected",
      previousStatus: "pending",
    });
    expect(result.success).toBe(true);
  });

  it("rejects moderation action without moderatorId", () => {
    const result = CreateModerationActionSchema.safeParse({
      targetType: "review",
      targetId: "review-123",
      action: "approve",
    });
    expect(result.success).toBe(false);
  });
});

// ─── Review Status Transition Tests ───────────────────────────────────────

describe("Review Status Transitions", () => {
  it("allows pending → approved", () => {
    expect(isValidReviewTransition("pending", "approved")).toBe(true);
  });

  it("allows pending → rejected", () => {
    expect(isValidReviewTransition("pending", "rejected")).toBe(true);
  });

  it("does not allow pending → hidden", () => {
    expect(isValidReviewTransition("pending", "hidden")).toBe(false);
  });

  it("allows approved → flagged", () => {
    expect(isValidReviewTransition("approved", "flagged")).toBe(true);
  });

  it("allows approved → hidden", () => {
    expect(isValidReviewTransition("approved", "hidden")).toBe(true);
  });

  it("does not allow approved → pending", () => {
    expect(isValidReviewTransition("approved", "pending")).toBe(false);
  });

  it("allows flagged → approved (restore)", () => {
    expect(isValidReviewTransition("flagged", "approved")).toBe(true);
  });

  it("allows flagged → hidden", () => {
    expect(isValidReviewTransition("flagged", "hidden")).toBe(true);
  });

  it("allows flagged → rejected", () => {
    expect(isValidReviewTransition("flagged", "rejected")).toBe(true);
  });

  it("allows hidden → approved (restore)", () => {
    expect(isValidReviewTransition("hidden", "approved")).toBe(true);
  });

  it("allows hidden → flagged", () => {
    expect(isValidReviewTransition("hidden", "flagged")).toBe(true);
  });

  it("does not allow hidden → pending", () => {
    expect(isValidReviewTransition("hidden", "pending")).toBe(false);
  });

  it("does not allow rejected → any (terminal)", () => {
    expect(isValidReviewTransition("rejected", "approved")).toBe(false);
    expect(isValidReviewTransition("rejected", "pending")).toBe(false);
    expect(isValidReviewTransition("rejected", "hidden")).toBe(false);
    expect(isValidReviewTransition("rejected", "flagged")).toBe(false);
  });

  it("getValidReviewTransitions returns correct transitions", () => {
    expect(getValidReviewTransitions("pending")).toEqual(["approved", "rejected"]);
    expect(getValidReviewTransitions("approved")).toEqual(["flagged", "hidden"]);
    expect(getValidReviewTransitions("rejected")).toEqual([]);
  });
});

// ─── Complaint Status Transition Tests ────────────────────────────────────

describe("Complaint Status Transitions", () => {
  it("allows submitted → under_review", () => {
    expect(isValidComplaintTransition("submitted", "under_review")).toBe(true);
  });

  it("allows submitted → rejected", () => {
    expect(isValidComplaintTransition("submitted", "rejected")).toBe(true);
  });

  it("does not allow submitted → resolved", () => {
    expect(isValidComplaintTransition("submitted", "resolved")).toBe(false);
  });

  it("allows under_review → awaiting_information", () => {
    expect(isValidComplaintTransition("under_review", "awaiting_information")).toBe(true);
  });

  it("allows under_review → operator_response", () => {
    expect(isValidComplaintTransition("under_review", "operator_response")).toBe(true);
  });

  it("allows under_review → resolved", () => {
    expect(isValidComplaintTransition("under_review", "resolved")).toBe(true);
  });

  it("allows awaiting_information → under_review", () => {
    expect(isValidComplaintTransition("awaiting_information", "under_review")).toBe(true);
  });

  it("allows operator_response → resolved", () => {
    expect(isValidComplaintTransition("operator_response", "resolved")).toBe(true);
  });

  it("allows operator_response → closed", () => {
    expect(isValidComplaintTransition("operator_response", "closed")).toBe(true);
  });

  it("allows resolved → closed", () => {
    expect(isValidComplaintTransition("resolved", "closed")).toBe(true);
  });

  it("does not allow closed → any (terminal)", () => {
    expect(isValidComplaintTransition("closed", "resolved")).toBe(false);
    expect(isValidComplaintTransition("closed", "under_review")).toBe(false);
  });

  it("does not allow rejected → any (terminal)", () => {
    expect(isValidComplaintTransition("rejected", "submitted")).toBe(false);
    expect(isValidComplaintTransition("rejected", "under_review")).toBe(false);
  });

  it("canChangeSeverity returns true for non-terminal states", () => {
    expect(canChangeSeverity("submitted")).toBe(true);
    expect(canChangeSeverity("under_review")).toBe(true);
    expect(canChangeSeverity("resolved")).toBe(true);
  });

  it("canChangeSeverity returns false for terminal states", () => {
    expect(canChangeSeverity("closed")).toBe(false);
    expect(canChangeSeverity("rejected")).toBe(false);
  });
});

// ─── Anti-Spam Tests ──────────────────────────────────────────────────────

describe("Anti-Spam", () => {
  describe("validateReviewContent", () => {
    it("accepts valid content", () => {
      const result = validateReviewContent(
        "Great casino experience",
        "I had a wonderful time playing at this casino. The games are fair and payouts are quick.",
        4,
      );
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects short title", () => {
      const result = validateReviewContent(
        "Hi",
        "I had a wonderful time playing at this casino. The games are fair and payouts are quick.",
        4,
      );
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Title is too short"))).toBe(true);
    });

    it("rejects short body", () => {
      const result = validateReviewContent(
        "Great casino experience",
        "Too short",
        4,
      );
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Review body is too short"))).toBe(true);
    });

    it("rejects body with too many URLs", () => {
      const result = validateReviewContent(
        "Great casino experience",
        "Check https://a.com and https://b.com and https://c.com and https://d.com for more info.",
        4,
      );
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("too many URLs"))).toBe(true);
    });

    it("rejects spam-like repeated characters in title", () => {
      const result = validateReviewContent(
        "AAAAAAAAAAAAAAAAA",
        "I had a wonderful time playing at this casino. The games are fair and payouts are quick.",
        4,
      );
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("spam"))).toBe(true);
    });

    it("rejects invalid rating", () => {
      const result = validateReviewContent(
        "Great casino experience",
        "I had a wonderful time playing at this casino. The games are fair and payouts are quick.",
        6,
      );
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Rating"))).toBe(true);
    });
  });

  describe("validateComplaintContent", () => {
    it("accepts valid content", () => {
      const result = validateComplaintContent(
        "Withdrawal not processed",
        "I requested a withdrawal 5 days ago and it has not been processed yet. This is unacceptable.",
      );
      expect(result.valid).toBe(true);
    });

    it("rejects short description", () => {
      const result = validateComplaintContent(
        "Withdrawal not processed",
        "Too short",
      );
      expect(result.valid).toBe(false);
    });
  });

  describe("textSimilarity", () => {
    it("returns 1 for identical texts", () => {
      expect(textSimilarity("hello world", "hello world")).toBe(1);
    });

    it("returns 0 for completely different texts", () => {
      expect(textSimilarity("abcdef", "xyz123")).toBe(0);
    });

    it("returns > 0.7 for similar texts", () => {
      const a = "I had a great time at this casino. The games are fair.";
      const b = "I had a great time at this casino. The games are very fair.";
      expect(textSimilarity(a, b)).toBeGreaterThan(0.7);
    });
  });

  describe("isDuplicateContent", () => {
    it("detects duplicate content", () => {
      const body = "I had a wonderful time playing at this casino. The games are fair and payouts are quick.";
      const existing = [
        "I had a wonderful time playing at this casino. The games are fair and payouts are quick.",
      ];
      expect(isDuplicateContent(body, existing)).toBe(true);
    });

    it("does not flag unique content", () => {
      const body = "This casino is terrible. I lost all my money and customer support was unhelpful.";
      const existing = [
        "I had a wonderful time playing at this casino. The games are fair and payouts are quick.",
      ];
      expect(isDuplicateContent(body, existing)).toBe(false);
    });
  });

  describe("checkSubmissionFrequency", () => {
    it("allows submission within frequency limit", () => {
      const result = checkSubmissionFrequency([], 3, 24);
      expect(result.allowed).toBe(true);
    });

    it("blocks submission when frequency exceeded", () => {
      const now = new Date().toISOString();
      const result = checkSubmissionFrequency([now, now, now], 3, 24);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("Too many submissions");
    });
  });

  describe("sanitizeText", () => {
    it("strips HTML tags", () => {
      expect(sanitizeText("<p>Hello</p>")).toBe("Hello");
    });

    it("strips script tags", () => {
      expect(sanitizeText("Hello<script>alert('xss')</script>")).toBe("Hello");
    });

    it("strips javascript: protocol", () => {
      expect(sanitizeText("javascript:alert('xss')")).toBe("alert('xss')");
    });

    it("strips event handlers", () => {
      expect(sanitizeText('img onerror="alert(1)"')).toBe('img "alert(1)"');
    });
  });

  describe("hasSuspiciousPatterns", () => {
    it("detects excessive special characters", () => {
      expect(hasSuspiciousPatterns("!!!!!!!!!!!!!!!!")).toBe(true);
    });

    it("detects spam patterns", () => {
      expect(hasSuspiciousPatterns("win money now")).toBe(true);
      expect(hasSuspiciousPatterns("free credits click here")).toBe(true);
    });

    it("detects phone numbers", () => {
      expect(hasSuspiciousPatterns("Call 555-123-4567")).toBe(true);
    });

    it("detects email addresses", () => {
      expect(hasSuspiciousPatterns("Email me at spam@test.com")).toBe(true);
    });

    it("does not flag normal text", () => {
      expect(hasSuspiciousPatterns("I had a great time at this casino")).toBe(false);
    });
  });
});

// ─── Public/Private Separation Tests ──────────────────────────────────────

describe("Public/Private Separation", () => {
  const mockReview: PlayerReviewRecord = {
    id: "review-1",
    casinoId: "germany-bwin",
    reviewerId: "user-123",
    title: "Great casino",
    body: "Wonderful experience overall.",
    rating: 4,
    status: "approved",
    verificationStatus: "verified",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0",
    locale: "de",
    createdAt: "2026-09-17T00:00:00Z",
    updatedAt: "2026-09-17T00:00:00Z",
    publishedAt: "2026-09-17T00:00:00Z",
    moderatedBy: "admin",
    moderatedAt: "2026-09-17T00:00:00Z",
    rejectionReason: null,
  };

  const mockPendingReview: PlayerReviewRecord = {
    ...mockReview,
    id: "review-2",
    status: "pending",
  };

  const mockComplaint: ComplaintRecord = {
    id: "complaint-1",
    casinoId: "germany-bwin",
    reviewId: null,
    subject: "Withdrawal issue",
    description: "My withdrawal was not processed.",
    category: "withdrawal",
    severity: "high",
    status: "resolved",
    resolutionNote: "Issue resolved by operator.",
    resolvedAt: "2026-09-17T00:00:00Z",
    reviewerId: "user-456",
    ipAddress: "192.168.1.2",
    userAgent: "Mozilla/5.0",
    createdAt: "2026-09-15T00:00:00Z",
    updatedAt: "2026-09-17T00:00:00Z",
    moderatedBy: "admin",
    moderatedAt: "2026-09-17T00:00:00Z",
  };

  const mockOpenComplaint: ComplaintRecord = {
    ...mockComplaint,
    id: "complaint-2",
    status: "under_review",
  };

  describe("toPublicReview", () => {
    it("returns public review for approved review", () => {
      const publicReview = toPublicReview(mockReview);
      expect(publicReview).not.toBeNull();
      expect(publicReview?.id).toBe("review-1");
      expect(publicReview?.status).toBe("approved");
      // Private fields should not be present
      expect(publicReview).not.toHaveProperty("ipAddress");
      expect(publicReview).not.toHaveProperty("userAgent");
      expect(publicReview).not.toHaveProperty("moderatedBy");
      expect(publicReview).not.toHaveProperty("rejectionReason");
    });

    it("returns null for non-approved review", () => {
      expect(toPublicReview(mockPendingReview)).toBeNull();
    });
  });

  describe("toPublicReviews", () => {
    it("filters to only approved reviews", () => {
      const publicReviews = toPublicReviews([mockReview, mockPendingReview]);
      expect(publicReviews).toHaveLength(1);
      expect(publicReviews[0].id).toBe("review-1");
    });
  });

  describe("toPublicComplaint", () => {
    it("returns public complaint for resolved complaint", () => {
      const publicComplaint = toPublicComplaint(mockComplaint);
      expect(publicComplaint).not.toBeNull();
      expect(publicComplaint?.status).toBe("resolved");
      // Private fields should not be present
      expect(publicComplaint).not.toHaveProperty("resolutionNote");
      expect(publicComplaint).not.toHaveProperty("reviewerId");
      expect(publicComplaint).not.toHaveProperty("ipAddress");
    });

    it("returns null for non-resolved complaint", () => {
      expect(toPublicComplaint(mockOpenComplaint)).toBeNull();
    });
  });

  describe("toPublicComplaints", () => {
    it("filters to only resolved/closed complaints", () => {
      const publicComplaints = toPublicComplaints([mockComplaint, mockOpenComplaint]);
      expect(publicComplaints).toHaveLength(1);
      expect(publicComplaints[0].id).toBe("complaint-1");
    });
  });

  describe("calculatePlayerRatingSummary", () => {
    it("calculates average rating from approved reviews", () => {
      const reviews: PlayerReviewRecord[] = [
        { ...mockReview, id: "r1", rating: 4 },
        { ...mockReview, id: "r2", rating: 5 },
        { ...mockReview, id: "r3", rating: 3 },
      ];
      const summary = calculatePlayerRatingSummary(reviews);
      expect(summary.averageRating).toBe(4);
      expect(summary.reviewCount).toBe(3);
      expect(summary.distribution[4]).toBe(1);
      expect(summary.distribution[5]).toBe(1);
      expect(summary.distribution[3]).toBe(1);
    });

    it("returns null average for no reviews", () => {
      const summary = calculatePlayerRatingSummary([]);
      expect(summary.averageRating).toBeNull();
      expect(summary.reviewCount).toBe(0);
    });

    it("ignores non-approved reviews", () => {
      const reviews: PlayerReviewRecord[] = [
        { ...mockReview, id: "r1", rating: 5, status: "approved" },
        { ...mockReview, id: "r2", rating: 1, status: "pending" },
      ];
      const summary = calculatePlayerRatingSummary(reviews);
      expect(summary.averageRating).toBe(5);
      expect(summary.reviewCount).toBe(1);
    });
  });

  describe("buildModerationSummary", () => {
    it("builds summary from moderation actions", () => {
      const actions: ModerationActionRecord[] = [
        {
          id: "action-1",
          targetType: "review",
          targetId: "review-1",
          action: "approve",
          moderatorId: "admin",
          reason: "Looks good",
          previousStatus: "pending",
          createdAt: "2026-09-17T00:00:00Z",
        },
      ];
      const summary = buildModerationSummary("review", "review-1", "approved", actions);
      expect(summary.targetType).toBe("review");
      expect(summary.targetId).toBe("review-1");
      expect(summary.status).toBe("approved");
      expect(summary.moderationActions).toHaveLength(1);
      expect(summary.lastModeratedBy).toBe("admin");
    });
  });
});

// ─── Pagination Tests ─────────────────────────────────────────────────────

describe("Pagination", () => {
  it("parsePaginationParams returns defaults for empty input", () => {
    const params = parsePaginationParams();
    expect(params.page).toBe(1);
    expect(params.limit).toBe(20);
  });

  it("parsePaginationParams parses valid input", () => {
    const params = parsePaginationParams("3", "50");
    expect(params.page).toBe(3);
    expect(params.limit).toBe(50);
  });

  it("parsePaginationParams enforces minimum page", () => {
    const params = parsePaginationParams("0", "20");
    expect(params.page).toBe(1);
  });

  it("parsePaginationParams enforces maximum limit", () => {
    const params = parsePaginationParams("1", "200");
    expect(params.limit).toBe(100);
  });

  it("paginate returns correct slice", () => {
    const data = Array.from({ length: 50 }, (_, i) => i);
    const result = paginate(data, { page: 2, limit: 10 });
    expect(result.data).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    expect(result.pagination.total).toBe(50);
    expect(result.pagination.totalPages).toBe(5);
    expect(result.pagination.hasNext).toBe(true);
    expect(result.pagination.hasPrev).toBe(true);
  });

  it("paginate handles first page", () => {
    const data = Array.from({ length: 25 }, (_, i) => i);
    const result = paginate(data, { page: 1, limit: 20 });
    expect(result.data).toHaveLength(20);
    expect(result.pagination.hasNext).toBe(true);
    expect(result.pagination.hasPrev).toBe(false);
  });

  it("paginate handles last page", () => {
    const data = Array.from({ length: 25 }, (_, i) => i);
    const result = paginate(data, { page: 2, limit: 20 });
    expect(result.data).toHaveLength(5);
    expect(result.pagination.hasNext).toBe(false);
    expect(result.pagination.hasPrev).toBe(true);
  });

  it("paginate handles empty data", () => {
    const result = paginate([], { page: 1, limit: 20 });
    expect(result.data).toHaveLength(0);
    expect(result.pagination.total).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
    expect(result.pagination.hasNext).toBe(false);
    expect(result.pagination.hasPrev).toBe(false);
  });
});
