/**
 * Trust and player systems module.
 *
 * Provides validation, transitions, anti-spam, public/private separation,
 * and pagination for player reviews and complaints.
 *
 * IMPORTANT: This module should only be imported on the server.
 * Some sub-modules reference database types that are server-only.
 */

export {
  // Validation
  ReviewStatusSchema,
  ReviewVerificationStatusSchema,
  PlayerRatingSchema,
  CreateReviewSchema,
  PublicReviewSchema,
  ComplaintCategorySchema,
  ComplaintSeveritySchema,
  ComplaintStatusSchema,
  CreateComplaintSchema,
  ModerationActionSchema,
  ModerationTargetSchema,
  CreateModerationActionSchema,
  type ReviewStatus,
  type ReviewVerificationStatus,
  type PlayerRating,
  type CreateReviewInput,
  type ComplaintCategory,
  type ComplaintSeverity,
  type ComplaintStatus,
  type CreateComplaintInput,
  type ModerationAction,
  type ModerationTarget,
  type CreateModerationActionInput,
} from "./validation";

export {
  // Transitions
  isValidReviewTransition,
  getValidReviewTransitions,
  isValidComplaintTransition,
  getValidComplaintTransitions,
  canChangeSeverity,
} from "./transitions";

export {
  // Anti-spam
  validateReviewContent,
  validateComplaintContent,
  textSimilarity,
  isDuplicateContent,
  checkSubmissionFrequency,
  sanitizeText,
  hasSuspiciousPatterns,
  type ContentValidationResult,
  type FrequencyCheck,
} from "./anti-spam";

export {
  // Public/private separation
  toPublicReview,
  toPublicReviews,
  toPublicComplaint,
  toPublicComplaints,
  calculatePlayerRatingSummary,
  buildModerationSummary,
  type PublicReview,
  type PublicComplaint,
  type PlayerRatingSummary,
  type ModerationSummary,
} from "./public-private";

export {
  // Pagination
  parsePaginationParams,
  getOffset,
  paginate,
  applyPagination,
  type PaginationParams,
  type PaginationResult,
} from "./pagination";
