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
