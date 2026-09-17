/**
 * Status transition rules for reviews and complaints.
 *
 * These are deterministic state machines. Invalid transitions are rejected.
 * This prevents arbitrary status changes and ensures a clear audit trail.
 */

import type { ReviewStatus } from "./validation";
import type { ComplaintStatus } from "./validation";

// ─── Review Transitions ───────────────────────────────────────────────────

/**
 * Valid review status transitions.
 *
 * Key = current status, Value = set of allowed next statuses.
 *
 * Flow:
 *   pending → approved | rejected
 *   approved → flagged | hidden
 *   flagged → approved | hidden | rejected
 *   hidden → approved | flagged
 *   rejected → (terminal — no transitions)
 */
const REVIEW_TRANSITIONS: Record<ReviewStatus, ReadonlySet<ReviewStatus>> = {
  pending: new Set(["approved", "rejected"]),
  approved: new Set(["flagged", "hidden"]),
  flagged: new Set(["approved", "hidden", "rejected"]),
  hidden: new Set(["approved", "flagged"]),
  rejected: new Set(), // Terminal state
};

/**
 * Check if a review status transition is valid.
 */
export function isValidReviewTransition(
  from: ReviewStatus,
  to: ReviewStatus,
): boolean {
  return REVIEW_TRANSITIONS[from]?.has(to) ?? false;
}

/**
 * Get all valid next statuses for a review.
 */
export function getValidReviewTransitions(status: ReviewStatus): ReviewStatus[] {
  return Array.from(REVIEW_TRANSITIONS[status] ?? []);
}

// ─── Complaint Transitions ────────────────────────────────────────────────

/**
 * Valid complaint status transitions.
 *
 * Key = current status, Value = set of allowed next statuses.
 *
 * Flow:
 *   submitted → under_review | rejected
 *   under_review → awaiting_information | operator_response | resolved | rejected
 *   awaiting_information → under_review | operator_response | resolved | rejected
 *   operator_response → resolved | closed
 *   resolved → closed
 *   closed → (terminal)
 *   rejected → (terminal)
 */
const COMPLAINT_TRANSITIONS: Record<ComplaintStatus, ReadonlySet<ComplaintStatus>> = {
  submitted: new Set(["under_review", "rejected"]),
  under_review: new Set(["awaiting_information", "operator_response", "resolved", "rejected"]),
  awaiting_information: new Set(["under_review", "operator_response", "resolved", "rejected"]),
  operator_response: new Set(["resolved", "closed"]),
  resolved: new Set(["closed"]),
  closed: new Set(), // Terminal state
  rejected: new Set(), // Terminal state
};

/**
 * Check if a complaint status transition is valid.
 */
export function isValidComplaintTransition(
  from: ComplaintStatus,
  to: ComplaintStatus,
): boolean {
  return COMPLAINT_TRANSITIONS[from]?.has(to) ?? false;
}

/**
 * Get all valid next statuses for a complaint.
 */
export function getValidComplaintTransitions(status: ComplaintStatus): ComplaintStatus[] {
  return Array.from(COMPLAINT_TRANSITIONS[status] ?? []);
}

// ─── Severity Transitions ─────────────────────────────────────────────────

/**
 * Valid complaint severity transitions.
 * Severity can be changed at any point during the workflow
 * (except for terminal states).
 */
export function canChangeSeverity(complaintStatus: ComplaintStatus): boolean {
  return complaintStatus !== "closed" && complaintStatus !== "rejected";
}
