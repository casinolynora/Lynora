import { sqliteTable, text, integer, real, uniqueIndex, index } from "drizzle-orm/sqlite-core";

// ─── Operators ────────────────────────────────────────────────────────────
//
// An operator is the legal entity that runs one or more casino brands.
// One operator → many casinos. A casino belongs to at most one operator.
// Operators are optional — if unknown, casino.operatorId is null.

export const operators = sqliteTable("operators", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  legalName: text("legalName").notNull(),
  displayName: text("displayName"),
  website: text("website"),
  ownershipInfo: text("ownershipInfo"),
  verificationStatus: text("verificationStatus", {
    enum: ["unverified", "verified", "needs_review", "archived"],
  })
    .notNull()
    .default("unverified"),
  source: text("source"),
  lastVerifiedAt: text("lastVerifiedAt"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export type OperatorRecord = typeof operators.$inferSelect;
export type OperatorInsert = typeof operators.$inferInsert;

// ─── Casino Licenses ──────────────────────────────────────────────────────
//
// Normalized from the embedded JSON array. One casino can have multiple
// licenses from different regulators/jurisdictions.

export const casinoLicenses = sqliteTable("casino_licenses", {
  id: text("id").primaryKey(),
  casinoId: text("casinoId").notNull().references(() => casinos.id, { onDelete: "cascade" }),
  issuer: text("issuer").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  licenseNumber: text("licenseNumber"),
  url: text("url"),
  status: text("status", { enum: ["active", "suspended", "revoked"] }),
  verifiedAt: text("verifiedAt"),
  source: text("source"),
  createdAt: text("createdAt").notNull(),
}, (table) => [
  index("idx_license_casino").on(table.casinoId),
  index("idx_license_jurisdiction").on(table.jurisdiction),
]);

export type CasinoLicenseRecord = typeof casinoLicenses.$inferSelect;

// ─── GEO Availability ─────────────────────────────────────────────────────
//
// Normalized from countries/restrictedCountries JSON arrays.
// Each row represents a casino's availability in one GEO.
// A casino may be: available, restricted, or pending in a GEO.

export const geoAvailability = sqliteTable("geo_availability", {
  id: text("id").primaryKey(),
  casinoId: text("casinoId").notNull().references(() => casinos.id, { onDelete: "cascade" }),
  geo: text("geo", { length: 2 }).notNull(),
  status: text("status", { enum: ["available", "restricted", "pending"] })
    .notNull()
    .default("available"),
  source: text("source"),
  verifiedAt: text("verifiedAt"),
  createdAt: text("createdAt").notNull(),
}, (table) => [
  index("idx_geo_casino").on(table.casinoId),
  index("idx_geo_code").on(table.geo),
  uniqueIndex("idx_geo_casino_unique").on(table.casinoId, table.geo),
]);

export type GeoAvailabilityRecord = typeof geoAvailability.$inferSelect;

// ─── Payment Methods (Canonical) ──────────────────────────────────────────
//
// A canonical list of payment method names and their types.
// Used to prevent duplicate string representations and enable
// future "payment method hub" pages.

export const paymentMethods = sqliteTable("payment_methods", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  type: text("type", {
    enum: ["e-wallet", "card", "bank-transfer", "crypto", "prepaid", "mobile"],
  }).notNull(),
  createdAt: text("createdAt").notNull(),
});

export type PaymentMethodRecord = typeof paymentMethods.$inferSelect;

// ─── Casino Payment Methods (Junction) ────────────────────────────────────
//
// Links a casino to a payment method with per-casino details
// (min/max deposit, withdrawal time, fees).

export const casinoPaymentMethods = sqliteTable("casino_payment_methods", {
  id: text("id").primaryKey(),
  casinoId: text("casinoId").notNull().references(() => casinos.id, { onDelete: "cascade" }),
  paymentMethodId: text("paymentMethodId").notNull().references(() => paymentMethods.id, { onDelete: "cascade" }),
  minDeposit: real("minDeposit"),
  maxDeposit: real("maxDeposit"),
  minWithdrawal: real("minWithdrawal"),
  maxWithdrawal: real("maxWithdrawal"),
  withdrawalTime: text("withdrawalTime"),
  fees: text("fees"),
  createdAt: text("createdAt").notNull(),
}, (table) => [
  index("idx_cpm_casino").on(table.casinoId),
  index("idx_cpm_payment").on(table.paymentMethodId),
  uniqueIndex("idx_cpm_casino_payment").on(table.casinoId, table.paymentMethodId),
]);

export type CasinoPaymentMethodRecord = typeof casinoPaymentMethods.$inferSelect;

// ─── Casinos (Core) ───────────────────────────────────────────────────────
//
// The primary casino brand entity. Complex nested data (bonuses, games,
// review, affiliate offers) remains as JSON columns — these don't benefit
// from normalization at the current scale (1,000–3,000 casinos).
//
// Relationship tables handle: licenses, GEO availability, payment methods.

export const casinos = sqliteTable("casinos", {
  // ─── Primary identifiers ──────────────────────────────────────────────────
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  logo: text("logo"),
  description: text("description"),
  website: text("website").notNull(),

  // ─── Operator relationship ────────────────────────────────────────────────
  // Nullable — operator data may be unknown on import.
  operatorId: text("operatorId").references(() => operators.id, { onDelete: "set null" }),

  // ─── Core metadata ────────────────────────────────────────────────────────
  founded: integer("founded", { mode: "number" }),
  owner: text("owner"), // Deprecated in favor of operatorId, kept for backward compat
  status: text("status", { enum: ["active", "inactive", "pending"] })
    .notNull()
    .default("active"),
  verificationStatus: text("verificationStatus", {
    enum: ["demo", "draft", "verified", "needs_review", "archived"],
  })
    .notNull()
    .default("draft"),
  lastVerifiedAt: text("lastVerifiedAt").notNull(),

  // ─── Ratings ──────────────────────────────────────────────────────────────
  rating: real("rating"),
  trustScore: real("trustScore"),

  // ─── Financial ────────────────────────────────────────────────────────────
  minDeposit: real("minDeposit").notNull(),
  maxDeposit: real("maxDeposit"),
  minWithdrawal: real("minWithdrawal"),

  // ─── Feature flags ────────────────────────────────────────────────────────
  hasLiveCasino: integer("hasLiveCasino", { mode: "boolean" }).notNull(),
  hasSportsBetting: integer("hasSportsBetting", { mode: "boolean" }).notNull(),
  hasCrypto: integer("hasCrypto", { mode: "boolean" }).notNull().default(false),
  hasMobile: integer("hasMobile", { mode: "boolean" }).notNull().default(true),
  kycRequired: integer("kycRequired", { mode: "boolean" }).notNull(),
  minAge: integer("minAge").notNull().default(18),

  // ─── Timestamps ───────────────────────────────────────────────────────────
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),

  // ─── JSON columns (complex nested data) ───────────────────────────────────
  // These store Zod-validated objects as JSON. They are NOT queried via SQL
  // in normal operations — the app reads the full casino object.

  dataSources: text("dataSources", { mode: "json" })
    .notNull()
    .$type<Array<{ field: string; source: string; verifiedAt: string; verifiedBy?: string; notes?: string }>>()
    .default([]),

  languages: text("languages", { mode: "json" })
    .notNull()
    .$type<string[]>()
    .default([]),

  currencies: text("currencies", { mode: "json" })
    .notNull()
    .$type<string[]>()
    .default([]),

  withdrawalMethods: text("withdrawalMethods", { mode: "json" })
    .$type<string[]>()
    .default([]),

  withdrawalProcessingTime: text("withdrawalProcessingTime"),

  bonuses: text("bonuses", { mode: "json" })
    .notNull()
    .$type<Array<{ type: string; title: string; description: string; amount?: string; wageringRequirement?: string; maxBet?: string; expiresIn?: string; minDeposit?: number; promoCode?: string; termsUrl?: string }>>(),

  games: text("games", { mode: "json" })
    .notNull()
    .$type<Array<{ name: string; slug: string; available: boolean; count?: number; providers?: string[] }>>(),

  kycDocuments: text("kycDocuments", { mode: "json" }).$type<string[]>(),
  kycProcessingTime: text("kycProcessingTime"),

  responsibleGambling: text("responsibleGambling", { mode: "json" })
    .notNull()
    .$type<{ selfExclusion: boolean; depositLimits: boolean; sessionLimits: boolean; realityCheck: boolean; coolingOffPeriod: boolean; links?: Array<{ name: string; url: string }> }>(),

  affiliateOffers: text("affiliateOffers", { mode: "json" })
    .notNull()
    .$type<Array<{ id: string; geo: string; network?: string; campaignId?: string; trackingUrl: string; ctaText?: string; isActive?: boolean; payoutInfo?: string; startDate?: string; endDate?: string; lastVerifiedAt?: string }>>(),

  review: text("review", { mode: "json" })
    .notNull()
    .$type<{
      overview: string;
      pros: string[];
      cons: string[];
      verdict: string;
      score: number | null;
      scoreBreakdown: {
        gameVariety: number;
        bonusValue: number;
        paymentSpeed: number;
        customerSupport: number;
        trustAndSafety: number;
        userExperience: number;
      } | null;
      faq?: Array<{ question: string; answer: string }>;
    }>(),

  features: text("features", { mode: "json" })
    .$type<string[]>()
    .default([]),

  tags: text("tags", { mode: "json" })
    .$type<string[]>()
    .default([]),

  // ─── Re-verification cadence ──────────────────────────────────────────────
  nextVerificationDue: text("nextVerificationDue"),
  verificationCadence: text("verificationCadence", { mode: "json" })
    .$type<Record<string, { lastVerified: string; intervalDays: number }>>()
    .default({}),
}, (table) => [
  index("idx_casinos_operator").on(table.operatorId),
  index("idx_casinos_status").on(table.status),
  index("idx_casinos_verification").on(table.verificationStatus),
  index("idx_casinos_lastVerified").on(table.lastVerifiedAt),
]);

export type CasinoRecord = typeof casinos.$inferSelect;
export type CasinoInsert = typeof casinos.$inferInsert;

// ─── Player Reviews ──────────────────────────────────────────────────────
//
// Player-generated reviews. These are INDEPENDENT from the editorial review
// stored in the casinos.review JSON column.
//
// Editorial Score ≠ Player Rating ≠ Player Sentiment
//
// Player reviews are moderated before publication. The rating field stores
// the raw player rating (1-5) and is NEVER automatically merged into the
// editorial score. Future aggregation may calculate an average player
// rating, but this remains a separate signal.

export const playerReviews = sqliteTable("player_reviews", {
  id: text("id").primaryKey(),
  casinoId: text("casinoId").notNull().references(() => casinos.id, { onDelete: "cascade" }),

  // ─── Reviewer identity ─────────────────────────────────────────────────────
  // No authentication in Phase 27. reviewerId is a stable anonymous identifier
  // (e.g., derived from IP + user agent hash). Nullable for anonymous submissions.
  // Future: may link to authenticated user ID.
  reviewerId: text("reviewerId"),

  // ─── Content ───────────────────────────────────────────────────────────────
  title: text("title").notNull(),
  body: text("body").notNull(),

  // ─── Rating ────────────────────────────────────────────────────────────────
  // Raw player rating. 1-5 stars. Integer only.
  // NEVER merged into editorial score automatically.
  rating: integer("rating", { mode: "number" }).notNull(),

  // ─── Moderation status ─────────────────────────────────────────────────────
  // Controls public visibility. Only "approved" reviews appear publicly.
  status: text("status", {
    enum: ["pending", "approved", "rejected", "hidden", "flagged"],
  }).notNull().default("pending"),

  // ─── Verification ──────────────────────────────────────────────────────────
  // "verified" means CasinoLynora completed a defined verification process.
  // It does NOT mean "this review is guaranteed true."
  verificationStatus: text("verificationStatus", {
    enum: ["unverified", "verified"],
  }).notNull().default("unverified"),

  // ─── Metadata ──────────────────────────────────────────────────────────────
  // Minimal data for abuse prevention. No passwords, no payment info, no IDs.
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  locale: text("locale"),

  // ─── Timestamps ────────────────────────────────────────────────────────────
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
  publishedAt: text("publishedAt"),

  // ─── Moderation metadata ───────────────────────────────────────────────────
  moderatedBy: text("moderatedBy"),
  moderatedAt: text("moderatedAt"),
  rejectionReason: text("rejectionReason"),
}, (table) => [
  index("idx_review_casino").on(table.casinoId),
  index("idx_review_status").on(table.status),
  index("idx_review_created").on(table.createdAt),
  index("idx_review_rating").on(table.rating),
  index("idx_review_reviewer").on(table.reviewerId),
]);

export type PlayerReviewRecord = typeof playerReviews.$inferSelect;
export type PlayerReviewInsert = typeof playerReviews.$inferInsert;

// ─── Complaints ──────────────────────────────────────────────────────────
//
// Player-submitted complaints about casinos. Independent from editorial
// content and from player reviews. Complaints follow a workflow:
//
// submitted → under_review → operator_response → resolved → closed
//
// Complaints do NOT automatically modify the editorial casino score.
// Severity represents workflow priority, not a judgment about the casino.

export const complaints = sqliteTable("complaints", {
  id: text("id").primaryKey(),
  casinoId: text("casinoId").notNull().references(() => casinos.id, { onDelete: "cascade" }),

  // ─── Optional review reference ─────────────────────────────────────────────
  // A complaint may optionally reference a player review.
  reviewId: text("reviewId").references(() => playerReviews.id, { onDelete: "set null" }),

  // ─── Content ───────────────────────────────────────────────────────────────
  subject: text("subject").notNull(),
  description: text("description").notNull(),

  // ─── Category (controlled values) ──────────────────────────────────────────
  category: text("category", {
    enum: [
      "withdrawal",
      "deposit",
      "account",
      "verification",
      "bonus",
      "customer_support",
      "technical",
      "responsible_gambling",
      "other",
    ],
  }).notNull(),

  // ─── Severity (workflow priority) ──────────────────────────────────────────
  // Represents how urgent the complaint is for resolution workflow.
  // NOT a judgment about the casino's legitimacy.
  severity: text("severity", {
    enum: ["low", "medium", "high"],
  }).notNull().default("medium"),

  // ─── Status ────────────────────────────────────────────────────────────────
  status: text("status", {
    enum: [
      "submitted",
      "under_review",
      "awaiting_information",
      "operator_response",
      "resolved",
      "closed",
      "rejected",
    ],
  }).notNull().default("submitted"),

  // ─── Resolution metadata ───────────────────────────────────────────────────
  resolutionNote: text("resolutionNote"),
  resolvedAt: text("resolvedAt"),

  // ─── Reviewer identity (same model as reviews) ─────────────────────────────
  reviewerId: text("reviewerId"),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),

  // ─── Timestamps ────────────────────────────────────────────────────────────
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),

  // ─── Moderation metadata ───────────────────────────────────────────────────
  moderatedBy: text("moderatedBy"),
  moderatedAt: text("moderatedAt"),
}, (table) => [
  index("idx_complaint_casino").on(table.casinoId),
  index("idx_complaint_status").on(table.status),
  index("idx_complaint_created").on(table.createdAt),
  index("idx_complaint_category").on(table.category),
  index("idx_complaint_severity").on(table.severity),
]);

export type ComplaintRecord = typeof complaints.$inferSelect;
export type ComplaintInsert = typeof complaints.$inferInsert;

// ─── Moderation Actions ──────────────────────────────────────────────────
//
// Audit-friendly log of all moderation actions. Records who did what,
// when, and why. Supports both review and complaint moderation.
//
// This table is append-only — actions are never deleted or updated.
// Provides a complete audit trail for compliance and trust.

export const moderationActions = sqliteTable("moderation_actions", {
  id: text("id").primaryKey(),

  // ─── Target ────────────────────────────────────────────────────────────────
  // What type of entity was moderated
  targetType: text("targetType", {
    enum: ["review", "complaint"],
  }).notNull(),

  // The ID of the target entity (review.id or complaint.id)
  targetId: text("targetId").notNull(),

  // ─── Action ────────────────────────────────────────────────────────────────
  action: text("action", {
    enum: [
      "approve",
      "reject",
      "hide",
      "restore",
      "flag",
      "resolve",
      "request_information",
      "set_severity",
    ],
  }).notNull(),

  // ─── Moderator ─────────────────────────────────────────────────────────────
  // Reference to the moderator. In Phase 27, this is a string identifier
  // (e.g., "admin" or "system"). Future: authenticated user ID.
  moderatorId: text("moderatorId").notNull(),

  // ─── Reason ────────────────────────────────────────────────────────────────
  // Optional explanation for the action. Required for rejections.
  reason: text("reason"),

  // ─── Previous state ────────────────────────────────────────────────────────
  // Snapshot of the target's status before this action
  previousStatus: text("previousStatus"),

  // ─── Timestamp ─────────────────────────────────────────────────────────────
  createdAt: text("createdAt").notNull(),
}, (table) => [
  index("idx_moderation_target").on(table.targetType, table.targetId),
  index("idx_moderation_action").on(table.action),
  index("idx_moderation_created").on(table.createdAt),
]);

export type ModerationActionRecord = typeof moderationActions.$inferSelect;
export type ModerationActionInsert = typeof moderationActions.$inferInsert;

// ─── Sources ──────────────────────────────────────────────────────────────
//
// Normalized source catalog. Every piece of factual casino data should
// eventually trace back to a source. Sources are independent entities —
// one source can be referenced by many fact_provenance records.

export const sources = sqliteTable("sources", {
  id: text("id").primaryKey(),
  sourceType: text("sourceType", {
    enum: [
      "official_operator_website",
      "regulator",
      "government_registry",
      "official_terms",
      "official_payment_page",
      "official_help_page",
      "official_homepage",
      "official_rg_page",
      "manual_verified",
      "trusted_third_party",
      "other",
    ],
  }).notNull(),
  name: text("name").notNull(),
  url: text("url"),
  domain: text("domain"),
  isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
}, (table) => [
  index("idx_sources_type").on(table.sourceType),
  index("idx_sources_domain").on(table.domain),
  index("idx_sources_active").on(table.isActive),
]);

export type SourceRecord = typeof sources.$inferSelect;
export type SourceInsert = typeof sources.$inferInsert;

// ─── Fact Provenance ──────────────────────────────────────────────────────
//
// Tracks the source and verification state of individual factual fields.
// Uses entity-level approach: one record per (casino, field, source).
// This allows multiple sources to claim different values for the same field,
// which the conflict detection logic can then resolve.

export const factProvenance = sqliteTable("fact_provenance", {
  id: text("id").primaryKey(),
  casinoId: text("casinoId").notNull().references(() => casinos.id, { onDelete: "cascade" }),
  fieldName: text("fieldName").notNull(),
  sourceId: text("sourceId").notNull().references(() => sources.id, { onDelete: "cascade" }),

  // The value claimed by this source for this field
  value: text("value"),

  // Verification lifecycle
  verificationStatus: text("verificationStatus", {
    enum: ["unverified", "sourced", "manually_verified", "stale", "conflicting"],
  }).notNull().default("unverified"),

  confidence: text("confidence", {
    enum: ["low", "medium", "high", "definitive"],
  }).notNull().default("medium"),

  // Timestamps
  retrievedAt: text("retrievedAt"),
  checkedAt: text("checkedAt"),
  expiresAt: text("expiresAt"),

  // Human review
  reviewerId: text("reviewerId"),
  notes: text("notes"),

  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
}, (table) => [
  index("idx_fp_casino").on(table.casinoId),
  index("idx_fp_field").on(table.fieldName),
  index("idx_fp_source").on(table.sourceId),
  index("idx_fp_status").on(table.verificationStatus),
  index("idx_fp_casino_field").on(table.casinoId, table.fieldName),
]);

export type FactProvenanceRecord = typeof factProvenance.$inferSelect;
export type FactProvenanceInsert = typeof factProvenance.$inferInsert;

// ─── Import Batches ───────────────────────────────────────────────────────
//
// Every import run creates a batch record. This makes imports auditable
// and supports dry-run reporting.

export const importBatches = sqliteTable("import_batches", {
  id: text("id").primaryKey(),
  source: text("source").notNull(),
  sourceType: text("sourceType", {
    enum: [
      "official_operator_website",
      "regulator",
      "government_registry",
      "official_terms",
      "official_payment_page",
      "official_help_page",
      "official_homepage",
      "official_rg_page",
      "manual_verified",
      "trusted_third_party",
      "other",
    ],
  }).notNull(),

  status: text("status", {
    enum: ["pending", "running", "completed", "completed_with_warnings", "failed"],
  }).notNull().default("pending"),

  isDryRun: integer("isDryRun", { mode: "boolean" }).notNull().default(false),

  // Counters
  recordsProcessed: integer("recordsProcessed").notNull().default(0),
  recordsCreated: integer("recordsCreated").notNull().default(0),
  recordsUpdated: integer("recordsUpdated").notNull().default(0),
  recordsUnchanged: integer("recordsUnchanged").notNull().default(0),
  recordsSkipped: integer("recordsSkipped").notNull().default(0),
  recordsRejected: integer("recordsRejected").notNull().default(0),
  conflictsDetected: integer("conflictsDetected").notNull().default(0),
  validationErrors: integer("validationErrors").notNull().default(0),

  // Timing
  startedAt: text("startedAt"),
  completedAt: text("completedAt"),
  createdAt: text("createdAt").notNull(),

  // Metadata
  metadata: text("metadata", { mode: "json" })
    .$type<Record<string, unknown>>()
    .default({}),
}, (table) => [
  index("idx_batch_status").on(table.status),
  index("idx_batch_source").on(table.source),
  index("idx_batch_created").on(table.createdAt),
]);

export type ImportBatchRecord = typeof importBatches.$inferSelect;
export type ImportBatchInsert = typeof importBatches.$inferInsert;

// ─── Import Records ───────────────────────────────────────────────────────
//
// Tracks each individual entity processed within a batch.

export const importRecords = sqliteTable("import_records", {
  id: text("id").primaryKey(),
  batchId: text("batchId").notNull().references(() => importBatches.id, { onDelete: "cascade" }),

  // Identity
  sourceIdentifier: text("sourceIdentifier"),
  casinoId: text("casinoId").references(() => casinos.id, { onDelete: "set null" }),
  casinoSlug: text("casinoSlug"),

  // Action taken
  action: text("action", {
    enum: ["created", "updated", "unchanged", "skipped", "rejected", "conflict"],
  }).notNull(),

  status: text("status", {
    enum: ["success", "warning", "error"],
  }).notNull().default("success"),

  // Details
  validationErrors: text("validationErrors", { mode: "json" })
    .$type<string[]>()
    .default([]),
  warnings: text("warnings", { mode: "json" })
    .$type<string[]>()
    .default([]),

  // Timestamps
  createdAt: text("createdAt").notNull(),
}, (table) => [
  index("idx_ir_batch").on(table.batchId),
  index("idx_ir_casino").on(table.casinoId),
  index("idx_ir_slug").on(table.casinoSlug),
  index("idx_ir_action").on(table.action),
]);

export type ImportRecordRecord = typeof importRecords.$inferSelect;
export type ImportRecordInsert = typeof importRecords.$inferInsert;

// ─── Conflicts ────────────────────────────────────────────────────────────
//
// Records value conflicts detected during import. This makes conflicts
// auditable and resolvable without data loss.

export const conflicts = sqliteTable("conflicts", {
  id: text("id").primaryKey(),
  casinoId: text("casinoId").notNull().references(() => casinos.id, { onDelete: "cascade" }),
  batchId: text("batchId").references(() => importBatches.id, { onDelete: "set null" }),

  fieldName: text("fieldName").notNull(),

  // Existing value in database
  existingValue: text("existingValue"),
  existingSourceId: text("existingSourceId").references(() => sources.id, { onDelete: "set null" }),

  // Incoming value from import
  incomingValue: text("incomingValue"),
  incomingSourceId: text("incomingSourceId").references(() => sources.id, { onDelete: "set null" }),

  // Resolution
  resolution: text("resolution", {
    enum: ["unresolved", "accepted", "rejected", "superseded"],
  }).notNull().default("unresolved"),

  resolvedBy: text("resolvedBy"),
  resolvedAt: text("resolvedAt"),
  resolutionNotes: text("resolutionNotes"),

  createdAt: text("createdAt").notNull(),
}, (table) => [
  index("idx_conflict_casino").on(table.casinoId),
  index("idx_conflict_batch").on(table.batchId),
  index("idx_conflict_field").on(table.fieldName),
  index("idx_conflict_resolution").on(table.resolution),
]);

export type ConflictRecord = typeof conflicts.$inferSelect;
export type ConflictInsert = typeof conflicts.$inferInsert;
