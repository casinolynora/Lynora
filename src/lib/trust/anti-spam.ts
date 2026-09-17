/**
 * Anti-spam and abuse protection foundation.
 *
 * Deterministic, explainable rules — no ML, no fake fraud scores.
 * Designed to prevent obvious abuse while keeping the system transparent.
 */

// ─── Content Validation Rules ─────────────────────────────────────────────

export interface ContentValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate review content for obvious spam/abuse patterns.
 */
export function validateReviewContent(
  title: string,
  body: string,
  rating: number,
): ContentValidationResult {
  const errors: string[] = [];

  // Title checks
  if (title.trim().length < 5) {
    errors.push("Title is too short (minimum 5 characters)");
  }
  if (title.length > 200) {
    errors.push("Title is too long (maximum 200 characters)");
  }
  if (/^(.)\1{10,}/.test(title)) {
    errors.push("Title appears to be spam (repeated characters)");
  }

  // Body checks
  if (body.trim().length < 20) {
    errors.push("Review body is too short (minimum 20 characters)");
  }
  if (body.length > 5000) {
    errors.push("Review body is too long (maximum 5000 characters)");
  }

  // URL density check — too many links suggests spam
  const urlCount = (body.match(/https?:\/\//g) || []).length;
  if (urlCount > 3) {
    errors.push("Review contains too many URLs (maximum 3)");
  }

  // Repeated content check
  if (/^(.{10,})\1{5,}/.test(body)) {
    errors.push("Review appears to contain repeated content");
  }

  // ALL CAPS check (heuristic — titles in all caps are suspicious)
  if (title === title.toUpperCase() && title.length > 20) {
    errors.push("Title should not be entirely in uppercase");
  }

  // Rating validation
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.push("Rating must be an integer between 1 and 5");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate complaint content for obvious spam/abuse patterns.
 */
export function validateComplaintContent(
  subject: string,
  description: string,
): ContentValidationResult {
  const errors: string[] = [];

  // Subject checks
  if (subject.trim().length < 5) {
    errors.push("Subject is too short (minimum 5 characters)");
  }
  if (subject.length > 200) {
    errors.push("Subject is too long (maximum 200 characters)");
  }

  // Description checks
  if (description.trim().length < 20) {
    errors.push("Description is too short (minimum 20 characters)");
  }
  if (description.length > 5000) {
    errors.push("Description is too long (maximum 5000 characters)");
  }

  // URL density check
  const urlCount = (description.match(/https?:\/\//g) || []).length;
  if (urlCount > 5) {
    errors.push("Description contains too many URLs (maximum 5)");
  }

  // Repeated content check
  if (/^(.{10,})\1{5,}/.test(description)) {
    errors.push("Description appears to contain repeated content");
  }

  return { valid: errors.length === 0, errors };
}

// ─── Duplicate Detection ──────────────────────────────────────────────────

/**
 * Simple content similarity check for duplicate detection.
 * Uses Jaccard similarity on character trigrams.
 *
 * This is a lightweight heuristic — not a sophisticated ML model.
 * Good enough to catch obvious copy-paste spam.
 */
function getTrigrams(text: string): Set<string> {
  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  const trigrams = new Set<string>();
  for (let i = 0; i <= normalized.length - 3; i++) {
    trigrams.add(normalized.slice(i, i + 3));
  }
  return trigrams;
}

/**
 * Calculate similarity between two texts using trigram Jaccard index.
 * Returns a value between 0 (completely different) and 1 (identical).
 */
export function textSimilarity(a: string, b: string): number {
  const trigramsA = getTrigrams(a);
  const trigramsB = getTrigrams(b);

  if (trigramsA.size === 0 || trigramsB.size === 0) return 0;

  let intersection = 0;
  for (const t of trigramsA) {
    if (trigramsB.has(t)) intersection++;
  }

  const union = trigramsA.size + trigramsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Check if a new review is likely a duplicate of an existing one.
 * Returns true if similarity exceeds threshold.
 */
export function isDuplicateContent(
  newBody: string,
  existingBodies: string[],
  threshold = 0.7,
): boolean {
  return existingBodies.some(
    (existing) => textSimilarity(newBody, existing) > threshold,
  );
}

// ─── Submission Frequency ─────────────────────────────────────────────────

/**
 * Check if a reviewer is submitting too frequently.
 * Simple rate-based check: no more than N reviews per time window.
 */
export interface FrequencyCheck {
  allowed: boolean;
  reason?: string;
}

/**
 * Check submission frequency for a reviewer.
 * @param submissions - Timestamps of recent submissions (ISO strings)
 * @param maxPerWindow - Maximum submissions allowed in the window
 * @param windowHours - Time window in hours
 */
export function checkSubmissionFrequency(
  submissions: string[],
  maxPerWindow = 3,
  windowHours = 24,
): FrequencyCheck {
  const windowMs = windowHours * 60 * 60 * 1000;
  const cutoff = Date.now() - windowMs;

  const recentCount = submissions.filter(
    (ts) => new Date(ts).getTime() > cutoff,
  ).length;

  if (recentCount >= maxPerWindow) {
    return {
      allowed: false,
      reason: `Too many submissions (${recentCount} in ${windowHours}h). Maximum: ${maxPerWindow}.`,
    };
  }

  return { allowed: true };
}

// ─── Text Sanitization ────────────────────────────────────────────────────

/**
 * Basic HTML/script sanitization for user-generated content.
 * Strips HTML tags and script injection attempts.
 *
 * This is a basic defense layer. If rendering untrusted content,
 * always use a proper HTML sanitizer on the output side as well.
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

/**
 * Check for obviously suspicious patterns in text.
 */
export function hasSuspiciousPatterns(text: string): boolean {
  // Excessive special characters
  if (/[!@#$%^&*()]{10,}/.test(text)) return true;

  // Common spam patterns
  if (/win\s*money|free\s*credits|click\s*here|act\s*now/i.test(text)) return true;

  // Contact info harvesting patterns
  if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) return true;
  if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) return true;

  return false;
}
