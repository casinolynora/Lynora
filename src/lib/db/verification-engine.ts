/**
 * Casino Verification Engine
 *
 * Manages the manual verification → publication lifecycle.
 * Accepts structured verification evidence and safely transitions
 * casino records from sourced/draft → verified.
 *
 * This module does NOT fetch external data.
 * It only processes manually supplied evidence with explicit sources.
 */

import { z } from "zod";
import { eq, and } from "drizzle-orm";
import {
  casinos,
  casinoLicenses,
  geoAvailability,
  sources,
  factProvenance,
  importBatches,
  importRecords,
} from "@/lib/db/schema";
import {
  generateBatchId,
  generateRecordId,
  generateSourceId,
  generateProvenanceId,
} from "./import-infrastructure";

// ─── Constants ────────────────────────────────────────────────────────────

export const VERIFICATION_VERSION = "1.0.0";
export const VERIFICATION_ACTOR = "editorial-research";

// ─── Zod Schemas ──────────────────────────────────────────────────────────

export const VerificationFactStatusSchema = z.enum([
  "manually_verified",
  "sourced",
  "unverified",
  "conflicting",
  "unknown",
]);

export const VerificationFactSchema = z.object({
  value: z.string().min(1),
  source: z.string().url(),
  status: VerificationFactStatusSchema,
  notes: z.string().optional(),
});

export const VerificationCasinoSchema = z.object({
  slug: z.string().min(1),
  verifiedBy: z.string().min(1),
  verifiedAt: z.string().datetime(),
  facts: z.record(z.string(), VerificationFactSchema),
});

export const VerificationBatchSchema = z.object({
  batch: z.string().min(1),
  version: z.number(),
  verifiedBy: z.string().min(1),
  verifiedAt: z.string().datetime(),
  casinos: z.array(VerificationCasinoSchema),
});

export type VerificationFact = z.infer<typeof VerificationFactSchema>;
export type VerificationCasino = z.infer<typeof VerificationCasinoSchema>;
export type VerificationBatch = z.infer<typeof VerificationBatchSchema>;

// ─── Types ────────────────────────────────────────────────────────────────

export type DrizzleDB = ReturnType<typeof import("drizzle-orm/better-sqlite3").drizzle>;

export interface VerificationEngineOptions {
  db: DrizzleDB;
  dryRun?: boolean;
}

export interface VerificationResult {
  batchId: string;
  dryRun: boolean;
  status: "completed" | "completed_with_warnings" | "failed";
  recordsProcessed: number;
  recordsVerified: number;
  recordsUnchanged: number;
  recordsSkipped: number;
  recordsFailed: number;
  factsVerified: number;
  factsSkipped: number;
  conflictsDetected: number;
  warnings: string[];
  errors: string[];
  records: Array<{
    casinoSlug: string;
    action: string;
    status: string;
    factsVerified: number;
    errors: string[];
    warnings: string[];
  }>;
}

// ─── Critical Fields (block publication if unverified) ─────────────────────

const CRITICAL_FIELDS = [
  "officialWebsite",
  "operator",
  "license_ukgc",
  "license_mga",
  "license_ggl",
  "license_ksa",
  "license_bgc",
];

// ─── Verification Engine ──────────────────────────────────────────────────

export async function runVerification(
  batchData: VerificationBatch,
  options: VerificationEngineOptions,
): Promise<VerificationResult> {
  const { db, dryRun = false } = options;
  const now = new Date().toISOString();
  const batchId = generateBatchId();

  const result: VerificationResult = {
    batchId,
    dryRun,
    status: "completed",
    recordsProcessed: 0,
    recordsVerified: 0,
    recordsUnchanged: 0,
    recordsSkipped: 0,
    recordsFailed: 0,
    factsVerified: 0,
    factsSkipped: 0,
    conflictsDetected: 0,
    warnings: [],
    errors: [],
    records: [],
  };

  // Create batch record
  if (!dryRun) {
    db.insert(importBatches).values({
      id: batchId,
      source: "manual_verification",
      sourceType: "manual_verified",
      status: "running",
      isDryRun: false,
      startedAt: now,
      createdAt: now,
      metadata: {
        type: "verification",
        batch: batchData.batch,
        version: batchData.version,
        verifiedBy: batchData.verifiedBy,
        verifiedAt: batchData.verifiedAt,
      },
    }).run();
  }

  try {
    for (const casinoData of batchData.casinos) {
      result.recordsProcessed++;

      const recordResult = await processCasinoVerification(
        db,
        casinoData,
        batchData.verifiedBy,
        batchData.verifiedAt,
        dryRun,
        now,
        batchId,
      );

      switch (recordResult.action) {
        case "verified":
          result.recordsVerified++;
          break;
        case "unchanged":
          result.recordsUnchanged++;
          break;
        case "skipped":
          result.recordsSkipped++;
          break;
        case "failed":
          result.recordsFailed++;
          break;
      }

      result.factsVerified += recordResult.factsVerified;
      result.factsSkipped += recordResult.factsSkipped;
      result.conflictsDetected += recordResult.conflictsDetected;
      result.warnings.push(...recordResult.warnings);
      result.errors.push(...recordResult.errors);
      result.records.push(recordResult);
    }

    // Determine final status
    if (result.recordsFailed > 0 || result.conflictsDetected > 0) {
      result.status = "completed_with_warnings";
    } else {
      result.status = "completed";
    }

    // Update batch record
    if (!dryRun) {
      db.update(importBatches)
        .set({
          status: result.status,
          recordsProcessed: result.recordsProcessed,
          recordsCreated: result.recordsVerified,
          recordsUnchanged: result.recordsUnchanged,
          recordsSkipped: result.recordsSkipped,
          recordsRejected: result.recordsFailed,
          conflictsDetected: result.conflictsDetected,
          completedAt: new Date().toISOString(),
        })
        .where(eq(importBatches.id, batchId))
        .run();
    }
  } catch (error) {
    result.status = "failed";
    result.errors.push(error instanceof Error ? error.message : String(error));

    if (!dryRun) {
      db.update(importBatches)
        .set({ status: "failed", completedAt: new Date().toISOString() })
        .where(eq(importBatches.id, batchId))
        .run();
    }
  }

  return result;
}

// ─── Process Individual Casino ────────────────────────────────────────────

async function processCasinoVerification(
  db: DrizzleDB,
  casinoData: VerificationCasino,
  verifiedBy: string,
  verifiedAt: string,
  dryRun: boolean,
  now: string,
  batchId: string,
): Promise<{
  casinoSlug: string;
  action: string;
  status: string;
  factsVerified: number;
  factsSkipped: number;
  conflictsDetected: number;
  warnings: string[];
  errors: string[];
}> {
  const { slug, facts } = casinoData;
  const warnings: string[] = [];
  const errors: string[] = [];
  let factsVerified = 0;
  let factsSkipped = 0;
  const conflictsDetected = 0;

  // Find existing casino
  const existing = db.select().from(casinos).where(eq(casinos.slug, slug)).get();
  if (!existing) {
    errors.push(`Casino not found: ${slug}`);
    return {
      casinoSlug: slug,
      action: "failed",
      status: "error",
      factsVerified: 0,
      factsSkipped: 0,
      conflictsDetected: 0,
      warnings,
      errors,
    };
  }

  // Already verified — skip
  if (existing.verificationStatus === "verified") {
    warnings.push(`Casino ${slug} already verified — skipping`);
    return {
      casinoSlug: slug,
      action: "unchanged",
      status: "warning",
      factsVerified: 0,
      factsSkipped: 0,
      conflictsDetected: 0,
      warnings,
      errors,
    };
  }

  // Check if we have critical evidence
  const criticalFields = Object.keys(facts).filter((f) =>
    CRITICAL_FIELDS.some((cf) => f.startsWith(cf)),
  );

  if (criticalFields.length === 0) {
    warnings.push(`Casino ${slug}: no critical evidence provided — skipping verification`);
    return {
      casinoSlug: slug,
      action: "skipped",
      status: "warning",
      factsVerified: 0,
      factsSkipped: 0,
      conflictsDetected: 0,
      warnings,
      errors,
    };
  }

  // Count facts regardless of dry-run
  for (const [, fact] of Object.entries(facts)) {
    if (fact.status === "manually_verified") {
      factsVerified++;
    } else {
      factsSkipped++;
    }
  }

  if (!dryRun) {
    // Find or create manual verification source
    const sourceRecord = findOrCreateSource(db, {
      sourceType: "manual_verified",
      name: `Manual Verification — ${verifiedBy}`,
    }, now);

    // Process each fact
    for (const [fieldName, fact] of Object.entries(facts)) {
      if (fact.status === "manually_verified") {
        // Check for existing provenance with higher or equal confidence
        const existingProvenance = db
          .select()
          .from(factProvenance)
          .where(
            and(
              eq(factProvenance.casinoId, existing.id),
              eq(factProvenance.fieldName, fieldName),
            ),
          )
          .get();

        // Protect manually_verified from lower-confidence updates
        if (
          existingProvenance &&
          existingProvenance.verificationStatus === "manually_verified"
        ) {
          continue;
        }

        // Record provenance
        db.insert(factProvenance).values({
          id: generateProvenanceId(),
          casinoId: existing.id,
          fieldName,
          sourceId: sourceRecord.id,
          value: fact.value,
          verificationStatus: "manually_verified",
          confidence: "definitive",
          retrievedAt: verifiedAt,
          checkedAt: now,
          reviewerId: verifiedBy,
          notes: fact.notes,
          createdAt: now,
          updatedAt: now,
        }).run();

        // Record source provenance on casino dataSources
        const existingDataSources = existing.dataSources ?? [];
        db.update(casinos)
          .set({
            dataSources: [
              ...existingDataSources,
              {
                field: fieldName,
                source: fact.source,
                verifiedAt,
                verifiedBy,
                notes: `Manually verified in batch ${batchId}`,
              },
            ],
            updatedAt: now,
          })
          .where(eq(casinos.id, existing.id))
          .run();
      }
    }

    // Update casino verification status
    db.update(casinos)
      .set({
        verificationStatus: "verified",
        lastVerifiedAt: verifiedAt,
        updatedAt: now,
      })
      .where(eq(casinos.id, existing.id))
      .run();

    // Update license verifiedAt where applicable
    const licenses = db
      .select()
      .from(casinoLicenses)
      .where(eq(casinoLicenses.casinoId, existing.id))
      .all();

    for (const license of licenses) {
      const licenseFact = facts[`license_${license.issuer.toLowerCase()}`];
      if (licenseFact && licenseFact.status === "manually_verified") {
        db.update(casinoLicenses)
          .set({ verifiedAt: verifiedAt, source: licenseFact.source })
          .where(eq(casinoLicenses.id, license.id))
          .run();
      }
    }

    // Update GEO verifiedAt where applicable
    const geoRecords = db
      .select()
      .from(geoAvailability)
      .where(eq(geoAvailability.casinoId, existing.id))
      .all();

    for (const geo of geoRecords) {
      const geoFact = facts[`geo_${geo.geo.toLowerCase()}`];
      if (geoFact && geoFact.status === "manually_verified") {
        db.update(geoAvailability)
          .set({ verifiedAt: verifiedAt, source: geoFact.source })
          .where(eq(geoAvailability.id, geo.id))
          .run();
      }
    }

    // Record import record for audit
    db.insert(importRecords).values({
      id: generateRecordId(),
      batchId,
      sourceIdentifier: "manual_verification",
      casinoId: existing.id,
      casinoSlug: slug,
      action: "created",
      status: "success",
      createdAt: now,
    }).run();
  }

  return {
    casinoSlug: slug,
    action: "verified",
    status: "success",
    factsVerified,
    factsSkipped,
    conflictsDetected,
    warnings,
    errors,
  };
}

// ─── Source Helper ────────────────────────────────────────────────────────

function findOrCreateSource(
  db: DrizzleDB,
  sourceInput: { sourceType: string; name: string },
  now: string,
): { id: string } {
  const existing = db
    .select()
    .from(sources)
    .where(eq(sources.name, sourceInput.name))
    .get();
  if (existing) return { id: existing.id };

  const sourceId = generateSourceId();
  db.insert(sources).values({
    id: sourceId,
    sourceType: sourceInput.sourceType as never,
    name: sourceInput.name,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }).run();

  return { id: sourceId };
}

// ─── Validation Helpers ───────────────────────────────────────────────────

export function validateVerificationBatch(data: unknown): {
  success: boolean;
  data?: VerificationBatch;
  errors: string[];
} {
  const result = VerificationBatchSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }
  return { success: true, data: result.data, errors: [] };
}
