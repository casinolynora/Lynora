/**
 * Casino Data Import Foundation
 *
 * Production-ready import infrastructure supporting:
 * - Data provenance and source tracking
 * - Conflict detection and resolution
 * - Dry-run mode
 * - Idempotent imports
 * - Batch auditing
 * - Safe update rules
 * - Deactivation support
 *
 * This module does NOT fetch external data.
 * It only processes manually prepared/source-backed data.
 */

import { z } from "zod";

// ─── Constants ────────────────────────────────────────────────────────────

export const IMPORT_VERSION = "1.0.0";

export const SOURCE_PRIORITY: Record<string, number> = {
  regulator: 1,
  government_registry: 2,
  official_operator_website: 3,
  official_terms: 4,
  official_payment_page: 4,
  official_rg_page: 4,
  manual_verified: 5,
  trusted_third_party: 6,
  other: 7,
};

export const VALID_GEOS = [
  "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT",
  "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI",
  "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY",
  "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN",
  "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM",
  "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK",
  "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL",
  "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM",
  "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR",
  "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN",
  "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS",
  "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK",
  "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW",
  "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP",
  "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM",
  "PN", "PR", "PS", "PT", "PW", "QA", "RE", "RO", "RS", "RU", "RW", "SA",
  "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN",
  "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG",
  "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ",
  "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN",
  "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW",
] as const;

// ─── Zod Schemas ──────────────────────────────────────────────────────────

export const SourceTypeSchema = z.enum([
  "official_operator_website",
  "regulator",
  "government_registry",
  "official_terms",
  "official_payment_page",
  "official_rg_page",
  "manual_verified",
  "trusted_third_party",
  "other",
]);

export const ImportSourceSchema = z.object({
  sourceType: SourceTypeSchema,
  name: z.string().min(1),
  url: z.string().url().optional(),
});

export const ImportLicenseSchema = z.object({
  issuer: z.string().min(1),
  jurisdiction: z.string().min(1).max(2),
  licenseNumber: z.string().optional(),
  url: z.string().url().optional(),
  status: z.enum(["active", "suspended", "revoked"]).optional(),
});

export const ImportGeoSchema = z.object({
  geo: z.string().min(2).max(2).toUpperCase(),
  status: z.enum(["available", "restricted", "pending"]).default("available"),
});

export const ImportPaymentMethodSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["e-wallet", "card", "bank-transfer", "crypto", "prepaid", "mobile"]),
  minDeposit: z.number().optional(),
  maxDeposit: z.number().optional(),
  minWithdrawal: z.number().optional(),
  maxWithdrawal: z.number().optional(),
  withdrawalTime: z.string().optional(),
  fees: z.string().optional(),
});

export const ImportCasinoSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-zA-Z0-9-]+$/, "Slug must be alphanumeric with hyphens"),
  website: z.string().url(),
  tagline: z.string().optional(),
  logo: z.string().url().optional(),
  description: z.string().optional(),
  founded: z.number().int().min(1900).max(2030).optional(),
  owner: z.string().optional(),

  status: z.enum(["active", "inactive", "pending"]).default("active"),

  rating: z.number().min(0).max(100).optional(),
  trustScore: z.number().min(0).max(100).optional(),

  minDeposit: z.number().min(0),
  maxDeposit: z.number().optional(),
  minWithdrawal: z.number().optional(),

  hasLiveCasino: z.boolean().default(false),
  hasSportsBetting: z.boolean().default(false),
  hasCrypto: z.boolean().default(false),
  hasMobile: z.boolean().default(true),
  kycRequired: z.boolean().default(true),
  minAge: z.number().int().min(18).default(18),

  languages: z.array(z.string()).default([]),
  currencies: z.array(z.string()).default([]),
  withdrawalProcessingTime: z.string().optional(),

  licenses: z.array(ImportLicenseSchema).min(1, "At least one license required"),
  geo: z.array(ImportGeoSchema).default([]),
  paymentMethods: z.array(ImportPaymentMethodSchema).default([]),

  source: ImportSourceSchema,
});

export type ImportCasino = z.infer<typeof ImportCasinoSchema>;

// ─── URL Security ─────────────────────────────────────────────────────────

const ALLOWED_URL_PROTOCOLS = ["https:"];
const BLOCKED_URL_PATTERNS = [
  /^javascript:/i,
  /^data:/i,
  /^file:/i,
  /^vbscript:/i,
  /^blob:/i,
];

export function validateUrlSecurity(url: string): { valid: boolean; reason?: string } {
  try {
    const parsed = new URL(url);

    // Check protocol
    if (!ALLOWED_URL_PROTOCOLS.includes(parsed.protocol)) {
      return { valid: false, reason: `Protocol ${parsed.protocol} not allowed. Only HTTPS permitted.` };
    }

    // Check for blocked patterns
    for (const pattern of BLOCKED_URL_PATTERNS) {
      if (pattern.test(url)) {
        return { valid: false, reason: `URL matches blocked pattern: ${pattern.source}` };
      }
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: "Invalid URL format" };
  }
}

// ─── Slug Policy ──────────────────────────────────────────────────────────

export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Source Priority ──────────────────────────────────────────────────────

export function getSourcePriority(sourceType: string): number {
  return SOURCE_PRIORITY[sourceType] ?? 99;
}

export function isHigherPriority(incoming: string, existing: string): boolean {
  return getSourcePriority(incoming) < getSourcePriority(existing);
}

// ─── Freshness Model ──────────────────────────────────────────────────────

export const FRESHNESS_THRESHOLDS = {
  fresh: 90,        // days since last verification
  needsReview: 180, // days since last verification
  stale: 365,       // days since last verification
} as const;

export type FreshnessStatus = "fresh" | "needs_review" | "stale";

export function getFreshnessStatus(lastVerifiedAt: string): FreshnessStatus {
  const now = new Date();
  const lastVerified = new Date(lastVerifiedAt);
  const daysSince = Math.floor((now.getTime() - lastVerified.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSince <= FRESHNESS_THRESHOLDS.fresh) return "fresh";
  if (daysSince <= FRESHNESS_THRESHOLDS.needsReview) return "needs_review";
  return "stale";
}

// ─── Duplicate Detection ──────────────────────────────────────────────────

export interface DuplicateCheck {
  isDuplicate: boolean;
  existingCasinoId?: string;
  matchType?: "slug" | "website" | "name_operator";
  confidence: "high" | "medium" | "low";
}

export function checkDuplicate(
  incoming: ImportCasino,
  existingCasinos: Array<{ id: string; slug: string; name: string; website: string; owner?: string | null }>,
): DuplicateCheck {
  // 1. Exact slug match (high confidence)
  const slugMatch = existingCasinos.find(
    (c) => c.slug === normalizeSlug(incoming.slug)
  );
  if (slugMatch) {
    return {
      isDuplicate: true,
      existingCasinoId: slugMatch.id,
      matchType: "slug",
      confidence: "high",
    };
  }

  // 2. Exact website match (high confidence)
  const websiteMatch = existingCasinos.find(
    (c) => c.website.toLowerCase() === incoming.website.toLowerCase()
  );
  if (websiteMatch) {
    return {
      isDuplicate: true,
      existingCasinoId: websiteMatch.id,
      matchType: "website",
      confidence: "high",
    };
  }

  // 3. Name + operator match (medium confidence)
  if (incoming.owner && existingCasinos.some((c) => c.owner)) {
    const nameOperatorMatch = existingCasinos.find(
      (c) =>
        c.name.toLowerCase() === incoming.name.toLowerCase() &&
        c.owner?.toLowerCase() === incoming.owner!.toLowerCase()
    );
    if (nameOperatorMatch) {
      return {
        isDuplicate: true,
        existingCasinoId: nameOperatorMatch.id,
        matchType: "name_operator",
        confidence: "medium",
      };
    }
  }

  return { isDuplicate: false, confidence: "low" };
}

// ─── Conflict Detection ───────────────────────────────────────────────────

export interface ConflictDetail {
  fieldName: string;
  existingValue: string | null;
  incomingValue: string | null;
  existingSourcePriority: number;
  incomingSourcePriority: number;
  resolution: "preserve_existing" | "allow_update" | "conflict";
}

export function detectConflict(
  fieldName: string,
  existingValue: string | null,
  incomingValue: string | null,
  existingSourcePriority: number,
  incomingSourcePriority: number,
): ConflictDetail {
  // No conflict if values are the same
  if (existingValue === incomingValue) {
    return {
      fieldName,
      existingValue,
      incomingValue,
      existingSourcePriority,
      incomingSourcePriority,
      resolution: "allow_update",
    };
  }

  // No conflict if existing is null/empty
  if (!existingValue) {
    return {
      fieldName,
      existingValue,
      incomingValue,
      existingSourcePriority,
      incomingSourcePriority,
      resolution: "allow_update",
    };
  }

  // Conflict: both have values
  // Preserve if existing source is higher priority
  if (existingSourcePriority < incomingSourcePriority) {
    return {
      fieldName,
      existingValue,
      incomingValue,
      existingSourcePriority,
      incomingSourcePriority,
      resolution: "preserve_existing",
    };
  }

  // Allow update if incoming source is higher or equal priority
  if (incomingSourcePriority <= existingSourcePriority) {
    return {
      fieldName,
      existingValue,
      incomingValue,
      existingSourcePriority,
      incomingSourcePriority,
      resolution: "allow_update",
    };
  }

  return {
    fieldName,
    existingValue,
    incomingValue,
    existingSourcePriority,
    incomingSourcePriority,
    resolution: "conflict",
  };
}

// ─── Batch Helpers ────────────────────────────────────────────────────────

export function generateBatchId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `batch_${timestamp}_${random}`;
}

export function generateRecordId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `rec_${timestamp}_${random}`;
}

export function generateSourceId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `src_${timestamp}_${random}`;
}

export function generateProvenanceId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `fp_${timestamp}_${random}`;
}

export function generateConflictId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `conf_${timestamp}_${random}`;
}

// ─── Validation ───────────────────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
}

export function validateImportCasino(casino: unknown): {
  success: boolean;
  data?: ImportCasino;
  errors: ValidationError[];
} {
  const result = ImportCasinoSchema.safeParse(casino);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        severity: "error" as const,
      })),
    };
  }

  const errors: ValidationError[] = [];
  const data = result.data;

  // Validate URL security
  const websiteCheck = validateUrlSecurity(data.website);
  if (!websiteCheck.valid) {
    errors.push({ field: "website", message: websiteCheck.reason!, severity: "error" });
  }

  if (data.logo) {
    const logoCheck = validateUrlSecurity(data.logo);
    if (!logoCheck.valid) {
      errors.push({ field: "logo", message: logoCheck.reason!, severity: "error" });
    }
  }

  // Validate GEO codes
  for (const geo of data.geo) {
    if (!VALID_GEOS.includes(geo.geo as typeof VALID_GEOS[number])) {
      errors.push({ field: `geo[${geo.geo}]`, message: `Invalid GEO code: ${geo.geo}`, severity: "error" });
    }
  }

  // Validate license URLs
  for (const [i, license] of data.licenses.entries()) {
    if (license.url) {
      const urlCheck = validateUrlSecurity(license.url);
      if (!urlCheck.valid) {
        errors.push({ field: `licenses[${i}].url`, message: urlCheck.reason!, severity: "error" });
      }
    }
  }

  // Validate source URL
  if (data.source.url) {
    const sourceUrlCheck = validateUrlSecurity(data.source.url);
    if (!sourceUrlCheck.valid) {
      errors.push({ field: "source.url", message: sourceUrlCheck.reason!, severity: "error" });
    }
  }

  // Validate slug format
  const normalizedSlug = normalizeSlug(data.slug);
  if (normalizedSlug !== data.slug && normalizedSlug.length > 0) {
    errors.push({ field: "slug", message: `Slug will be normalized to: ${normalizedSlug}`, severity: "warning" });
  }

  // Validate numeric ranges
  if (data.maxDeposit !== undefined && data.maxDeposit < data.minDeposit) {
    errors.push({ field: "maxDeposit", message: "maxDeposit must be >= minDeposit", severity: "error" });
  }

  if (data.minWithdrawal !== undefined && data.minWithdrawal < data.minDeposit) {
    errors.push({ field: "minWithdrawal", message: "minWithdrawal should be >= minDeposit", severity: "warning" });
  }

  return {
    success: errors.filter((e) => e.severity === "error").length === 0,
    data,
    errors,
  };
}

// ─── Batch Validation ─────────────────────────────────────────────────────

export interface BatchValidationResult {
  valid: ImportCasino[];
  invalid: Array<{ index: number; casino: unknown; errors: ValidationError[] }>;
  duplicates: Array<{ index: number; casino: ImportCasino; existingId: string; matchType: string }>;
  warnings: string[];
}

export function validateBatch(
  rawCasinos: unknown[],
  existingCasinos: Array<{ id: string; slug: string; name: string; website: string; owner?: string | null }>,
): BatchValidationResult {
  const valid: ImportCasino[] = [];
  const invalid: Array<{ index: number; casino: unknown; errors: ValidationError[] }> = [];
  const duplicates: Array<{ index: number; casino: ImportCasino; existingId: string; matchType: string }> = [];
  const warnings: string[] = [];

  const seenSlugs = new Set<string>();
  const seenWebsites = new Set<string>();

  for (let i = 0; i < rawCasinos.length; i++) {
    const raw = rawCasinos[i];

    // Validate schema
    const validation = validateImportCasino(raw);
    if (!validation.success || !validation.data) {
      invalid.push({ index: i, casino: raw, errors: validation.errors });
      continue;
    }

    const casino = validation.data;

    // Check for duplicates in batch
    const normalizedSlug = normalizeSlug(casino.slug);
    if (seenSlugs.has(normalizedSlug)) {
      invalid.push({
        index: i,
        casino: raw,
        errors: [{ field: "slug", message: `Duplicate slug in batch: ${normalizedSlug}`, severity: "error" }],
      });
      continue;
    }

    if (seenWebsites.has(casino.website.toLowerCase())) {
      invalid.push({
        index: i,
        casino: raw,
        errors: [{ field: "website", message: `Duplicate website in batch: ${casino.website}`, severity: "error" }],
      });
      continue;
    }

    // Check for duplicates against existing data
    const dupCheck = checkDuplicate(casino, existingCasinos);
    if (dupCheck.isDuplicate) {
      duplicates.push({
        index: i,
        casino,
        existingId: dupCheck.existingCasinoId!,
        matchType: dupCheck.matchType!,
      });
      continue;
    }

    // Collect warnings
    for (const error of validation.errors) {
      if (error.severity === "warning") {
        warnings.push(`Record ${i} (${casino.name}): ${error.message}`);
      }
    }

    seenSlugs.add(normalizedSlug);
    seenWebsites.add(casino.website.toLowerCase());
    valid.push(casino);
  }

  return { valid, invalid, duplicates, warnings };
}
