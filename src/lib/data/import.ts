import { CasinoSchema, Casino, VerificationStatus } from "@/lib/types";

const VALID_GEOS = ["DE", "FR", "NL", "BE", "AT", "IT", "CH", "IE", "INT"] as const;

// ─── Import Validation ─────────────────────────────────────────────────────

export interface ImportResult {
  success: boolean;
  casinos: Casino[];
  errors: ImportError[];
  warnings: string[];
}

export interface ImportError {
  index: number;
  casinoId?: string;
  field: string;
  message: string;
}

// ─── Validation Rules ──────────────────────────────────────────────────────

function validateProvenance(casino: Casino, index: number): ImportError[] {
  const errors: ImportError[] = [];

  // Verified casinos must have dataSources
  if (casino.verificationStatus === "verified") {
    if (casino.dataSources.length === 0) {
      errors.push({
        index,
        casinoId: casino.id,
        field: "dataSources",
        message: "Verified casinos must have at least one data source",
      });
    }

    // Each data source must have required fields
    casino.dataSources.forEach((ds, dsIndex) => {
      if (!ds.field || !ds.source || !ds.verifiedAt) {
        errors.push({
          index,
          casinoId: casino.id,
          field: `dataSources[${dsIndex}]`,
          message: "Data source must have field, source, and verifiedAt",
        });
      }
    });

    // Must have lastVerifiedAt
    if (!casino.lastVerifiedAt) {
      errors.push({
        index,
        casinoId: casino.id,
        field: "lastVerifiedAt",
        message: "Verified casinos must have lastVerifiedAt",
      });
    }

    // Must have at least 1 license
    if (casino.licenses.length === 0) {
      errors.push({
        index,
        casinoId: casino.id,
        field: "licenses",
        message: "Verified casinos must have at least 1 license",
      });
    }

    // Must have valid website URL
    if (!casino.website || !casino.website.startsWith("http")) {
      errors.push({
        index,
        casinoId: casino.id,
        field: "website",
        message: "Verified casinos must have a valid website URL",
      });
    }
  }

  return errors;
}

function validateBasicStructure(raw: unknown, index: number): { data?: Casino; errors: ImportError[] } {
  const errors: ImportError[] = [];

  const result = CasinoSchema.safeParse(raw);
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.push({
        index,
        casinoId: (raw as Record<string, unknown>)?.id as string | undefined,
        field: issue.path.join("."),
        message: issue.message,
      });
    });
    return { errors };
  }

  return { data: result.data, errors };
}

function normalizeCasino(casino: Casino): Casino {
  // Normalize slug: lowercase, replace spaces with hyphens, remove special chars
  const slug = casino.slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Ensure required defaults
  return {
    ...casino,
    slug,
    verificationStatus: casino.verificationStatus ?? "draft",
    dataSources: casino.dataSources ?? [],
    restrictedCountries: casino.restrictedCountries ?? [],
    features: casino.features ?? [],
    tags: casino.tags ?? [],
  };
}

// ─── Public API ────────────────────────────────────────────────────────────

export interface ImportOptions {
  /** If true, skip validation for non-verified casinos */
  skipValidationForDraft?: boolean;
  /** If true, normalize slugs and defaults */
  normalize?: boolean;
  /** Required verification status — reject casinos not matching this */
  requiredStatus?: VerificationStatus;
}

/**
 * Validate and normalize an array of raw casino data.
 * Returns ImportResult with validated casinos, errors, and warnings.
 *
 * This function does NOT modify the data source — it returns a new array.
 */
export function validateAndImport(
  rawCasinos: unknown[],
  options: ImportOptions = {},
): ImportResult {
  const { normalize = true, requiredStatus } = options;
  const errors: ImportError[] = [];
  const warnings: string[] = [];
  const validatedCasinos: Casino[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  rawCasinos.forEach((raw, index) => {
    // Step 1: Schema validation
    const { data, errors: schemaErrors } = validateBasicStructure(raw, index);
    errors.push(...schemaErrors);

    if (!data) return; // Skip if schema validation failed

    // Step 2: Duplicate ID check
    if (seenIds.has(data.id)) {
      errors.push({
        index,
        casinoId: data.id,
        field: "id",
        message: `Duplicate casino ID: "${data.id}"`,
      });
      return;
    }
    seenIds.add(data.id);

    // Step 3: Required status check
    if (requiredStatus && data.verificationStatus !== requiredStatus) {
      warnings.push(
        `Casino ${data.id} has status "${data.verificationStatus}" — expected "${requiredStatus}"`
      );
      return; // Skip this casino
    }

    // Step 4: Provenance validation
    const provenanceErrors = validateProvenance(data, index);
    errors.push(...provenanceErrors);

    if (provenanceErrors.length > 0 && data.verificationStatus === "verified") {
      // Don't add verified casinos with validation errors
      return;
    }

    // Step 5: Normalize
    const normalized = normalize ? normalizeCasino(data) : data;

    // Step 6: Duplicate slug check (after normalization)
    if (seenSlugs.has(normalized.slug)) {
      errors.push({
        index,
        casinoId: normalized.id,
        field: "slug",
        message: `Duplicate casino slug: "${normalized.slug}"`,
      });
      return;
    }
    seenSlugs.add(normalized.slug);

    // Step 7: GEO validation
    const invalidGeos = normalized.countries.filter(
      (geo) => !(VALID_GEOS as readonly string[]).includes(geo)
    );
    if (invalidGeos.length > 0) {
      errors.push({
        index,
        casinoId: normalized.id,
        field: "countries",
        message: `Invalid GEO values: ${invalidGeos.join(", ")}. Valid GEOs: ${VALID_GEOS.join(", ")}`,
      });
      return;
    }

    // Step 8: License validation
    const invalidLicenses = normalized.licenses.filter(
      (l) => !l.issuer || !l.jurisdiction
    );
    if (invalidLicenses.length > 0) {
      errors.push({
        index,
        casinoId: normalized.id,
        field: "licenses",
        message: "License records must have issuer and jurisdiction",
      });
      return;
    }

    validatedCasinos.push(normalized);
  });

  return {
    success: errors.length === 0,
    casinos: validatedCasinos,
    errors,
    warnings,
  };
}

/**
 * Check if a casino is production-ready (verified + active).
 */
export function isProductionReady(casino: Casino): boolean {
  return (
    casino.status === "active" &&
    casino.verificationStatus === "verified" &&
    casino.dataSources.length > 0 &&
    casino.licenses.length > 0
  );
}

/**
 * Get a summary of import results for logging.
 */
export function getImportSummary(result: ImportResult): string {
  const lines: string[] = [];
  lines.push(`Import: ${result.casinos.length} casinos processed`);
  lines.push(`  Success: ${result.success}`);
  lines.push(`  Errors: ${result.errors.length}`);
  lines.push(`  Warnings: ${result.warnings.length}`);

  const byStatus = result.casinos.reduce((acc, c) => {
    acc[c.verificationStatus] = (acc[c.verificationStatus] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(byStatus).forEach(([status, count]) => {
    lines.push(`  ${status}: ${count}`);
  });

  return lines.join("\n");
}
