import { z } from "zod";

// ─── Review Validation ────────────────────────────────────────────────────

export const ReviewStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "hidden",
  "flagged",
]);
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;

export const ReviewVerificationStatusSchema = z.enum([
  "unverified",
  "verified",
]);
export type ReviewVerificationStatus = z.infer<typeof ReviewVerificationStatusSchema>;

/**
 * Raw player rating. 1-5 stars, integer only.
 * NEVER merged into editorial score automatically.
 */
export const PlayerRatingSchema = z.number().int().min(1).max(5);
export type PlayerRating = z.infer<typeof PlayerRatingSchema>;

/**
 * Schema for creating a new player review.
 * Validates all required fields and enforces content limits.
 */
export const CreateReviewSchema = z.object({
  casinoId: z.string().min(1, "Casino ID is required"),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters"),
  body: z
    .string()
    .min(20, "Review body must be at least 20 characters")
    .max(5000, "Review body must be at most 5000 characters"),
  rating: PlayerRatingSchema,
  locale: z.string().max(10).optional(),
});
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;

/**
 * Public review shape — excludes internal moderation fields.
 * This is what gets exposed on casino profile pages.
 */
export const PublicReviewSchema = z.object({
  id: z.string(),
  casinoId: z.string(),
  title: z.string(),
  body: z.string(),
  rating: z.number(),
  status: z.literal("approved"),
  verificationStatus: ReviewVerificationStatusSchema,
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  locale: z.string().nullable(),
});
export type PublicReview = z.infer<typeof PublicReviewSchema>;

// ─── Complaint Validation ─────────────────────────────────────────────────

export const ComplaintCategorySchema = z.enum([
  "withdrawal",
  "deposit",
  "account",
  "verification",
  "bonus",
  "customer_support",
  "technical",
  "responsible_gambling",
  "other",
]);
export type ComplaintCategory = z.infer<typeof ComplaintCategorySchema>;

export const ComplaintSeveritySchema = z.enum(["low", "medium", "high"]);
export type ComplaintSeverity = z.infer<typeof ComplaintSeveritySchema>;

export const ComplaintStatusSchema = z.enum([
  "submitted",
  "under_review",
  "awaiting_information",
  "operator_response",
  "resolved",
  "closed",
  "rejected",
]);
export type ComplaintStatus = z.infer<typeof ComplaintStatusSchema>;

/**
 * Schema for creating a new complaint.
 */
export const CreateComplaintSchema = z.object({
  casinoId: z.string().min(1, "Casino ID is required"),
  reviewId: z.string().optional(),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be at most 200 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be at most 5000 characters"),
  category: ComplaintCategorySchema,
  severity: ComplaintSeveritySchema.default("medium"),
});
export type CreateComplaintInput = z.infer<typeof CreateComplaintSchema>;

// ─── Moderation Validation ────────────────────────────────────────────────

export const ModerationActionSchema = z.enum([
  "approve",
  "reject",
  "hide",
  "restore",
  "flag",
  "resolve",
  "request_information",
  "set_severity",
]);
export type ModerationAction = z.infer<typeof ModerationActionSchema>;

export const ModerationTargetSchema = z.enum(["review", "complaint"]);
export type ModerationTarget = z.infer<typeof ModerationTargetSchema>;

/**
 * Schema for recording a moderation action.
 */
export const CreateModerationActionSchema = z.object({
  targetType: ModerationTargetSchema,
  targetId: z.string().min(1, "Target ID is required"),
  action: ModerationActionSchema,
  moderatorId: z.string().min(1, "Moderator ID is required"),
  reason: z.string().max(1000).optional(),
  previousStatus: z.string().optional(),
});
export type CreateModerationActionInput = z.infer<typeof CreateModerationActionSchema>;
