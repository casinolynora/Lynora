/**
 * Casino Data Import Engine
 *
 * Handles both dry-run and live imports with:
 * - Batch tracking
 * - Idempotent upserts
 * - Provenance recording
 * - Conflict detection
 * - Safe update rules
 * - Deactivation support
 */

import { eq } from "drizzle-orm";
import {
  casinos,
  sources,
  factProvenance,
  importBatches,
  importRecords,
  conflicts,
  casinoLicenses,
  geoAvailability,
  casinoPaymentMethods,
  paymentMethods,
} from "@/lib/db/schema";
import type {
  CasinoInsert,
  ImportBatchInsert,
  ImportRecordInsert,
} from "@/lib/db/schema";
import {
  type ImportCasino,
  type ConflictDetail,
  generateBatchId,
  generateRecordId,
  generateSourceId,
  generateProvenanceId,
  generateConflictId,
  normalizeSlug,
  getSourcePriority,
  detectConflict,
  validateBatch,
} from "./import-infrastructure";

// ─── Types ────────────────────────────────────────────────────────────────

export type DrizzleDB = ReturnType<typeof import("drizzle-orm/better-sqlite3").drizzle>;

export interface ImportEngineOptions {
  db: DrizzleDB;
  dryRun?: boolean;
  source: string;
  sourceType: string;
  metadata?: Record<string, unknown>;
}

export interface ImportEngineResult {
  batchId: string;
  dryRun: boolean;
  status: "completed" | "completed_with_warnings" | "failed";
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsUnchanged: number;
  recordsSkipped: number;
  recordsRejected: number;
  conflictsDetected: number;
  validationErrors: number;
  warnings: string[];
  errors: string[];
  importRecords: Array<{
    casinoSlug: string;
    action: string;
    status: string;
    errors: string[];
    warnings: string[];
  }>;
}

let _idCounter = 0;

// ─── Import Engine ────────────────────────────────────────────────────────

export async function runImport(
  rawCasinos: unknown[],
  options: ImportEngineOptions,
): Promise<ImportEngineResult> {
  const { db, dryRun = false, source, sourceType, metadata = {} } = options;

  const now = new Date().toISOString();
  const batchId = generateBatchId();

  // Initialize result
  const result: ImportEngineResult = {
    batchId,
    dryRun,
    status: "completed",
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsUnchanged: 0,
    recordsSkipped: 0,
    recordsRejected: 0,
    conflictsDetected: 0,
    validationErrors: 0,
    warnings: [],
    errors: [],
    importRecords: [],
  };

  // Create batch record
  const batchData: ImportBatchInsert = {
    id: batchId,
    source,
    sourceType: sourceType as never,
    status: "running",
    isDryRun: dryRun,
    startedAt: now,
    createdAt: now,
    metadata,
  };

  if (!dryRun) {
    db.insert(importBatches).values(batchData).run();
  }

  try {
    // Get existing casinos for duplicate detection
    const existingCasinoRows = db.select().from(casinos).all();
    const existingCasinos = existingCasinoRows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      website: r.website,
      owner: r.owner,
    }));

    // Validate batch
    const validation = validateBatch(rawCasinos, existingCasinos);

    result.validationErrors = validation.invalid.length;
    result.warnings = validation.warnings;

    // Record validation errors
    for (const inv of validation.invalid) {
      result.recordsRejected++;
      const recordSlug = (inv.casino as Record<string, unknown>)?.slug as string ?? `unknown_${inv.index}`;

      const recordData: ImportRecordInsert = {
        id: generateRecordId(),
        batchId,
        sourceIdentifier: source,
        casinoSlug: recordSlug,
        action: "rejected",
        status: "error",
        validationErrors: inv.errors.map((e) => `${e.field}: ${e.message}`),
        createdAt: now,
      };

      if (!dryRun) {
        db.insert(importRecords).values(recordData).run();
      }

      result.importRecords.push({
        casinoSlug: recordSlug,
        action: "rejected",
        status: "error",
        errors: inv.errors.map((e) => `${e.field}: ${e.message}`),
        warnings: [],
      });
    }

    // Process duplicates as potential updates
    for (const dup of validation.duplicates) {
      result.recordsProcessed++;

      const recordResult = await processCasinoImport(
        db,
        dup.casino,
        batchId,
        source,
        sourceType,
        dryRun,
        now,
      );

      // Update counters based on result
      switch (recordResult.action) {
        case "created":
          result.recordsCreated++;
          break;
        case "updated":
          result.recordsUpdated++;
          break;
        case "unchanged":
          result.recordsUnchanged++;
          break;
        case "conflict":
          result.conflictsDetected++;
          break;
      }

      result.importRecords.push(recordResult);
    }

    // Process valid records
    for (const casino of validation.valid) {
      result.recordsProcessed++;

      const recordResult = await processCasinoImport(
        db,
        casino,
        batchId,
        source,
        sourceType,
        dryRun,
        now,
      );

      // Update counters
      switch (recordResult.action) {
        case "created":
          result.recordsCreated++;
          break;
        case "updated":
          result.recordsUpdated++;
          break;
        case "unchanged":
          result.recordsUnchanged++;
          break;
        case "conflict":
          result.conflictsDetected++;
          break;
      }

      result.importRecords.push(recordResult);
    }

    // Determine final status
    if (result.validationErrors > 0 || result.conflictsDetected > 0) {
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
          recordsCreated: result.recordsCreated,
          recordsUpdated: result.recordsUpdated,
          recordsUnchanged: result.recordsUnchanged,
          recordsSkipped: result.recordsSkipped,
          recordsRejected: result.recordsRejected,
          conflictsDetected: result.conflictsDetected,
          validationErrors: result.validationErrors,
          completedAt: new Date().toISOString(),
        })
        .where(eq(importBatches.id, batchId))
        .run();
    }
  } catch (error) {
    result.status = "failed";
    result.errors.push(error instanceof Error ? error.message : String(error));

    // Update batch status
    if (!dryRun) {
      db.update(importBatches)
        .set({
          status: "failed",
          completedAt: new Date().toISOString(),
        })
        .where(eq(importBatches.id, batchId))
        .run();
    }
  }

  return result;
}

// ─── Process Individual Casino ────────────────────────────────────────────

async function processCasinoImport(
  db: DrizzleDB,
  casino: ImportCasino,
  batchId: string,
  source: string,
  sourceType: string,
  dryRun: boolean,
  now: string,
): Promise<{
  casinoSlug: string;
  action: string;
  status: string;
  errors: string[];
  warnings: string[];
}> {
  const normalizedSlug = normalizeSlug(casino.slug);
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if casino exists
  const existing = db.select().from(casinos).where(eq(casinos.slug, normalizedSlug)).get();

  if (existing) {
    // CASINO EXISTS — safe update logic
    const updateResult = await processCasinoUpdate(
      db,
      existing,
      casino,
      batchId,
      source,
      sourceType,
      dryRun,
      now,
    );
    return {
      casinoSlug: normalizedSlug,
      ...updateResult,
      errors,
      warnings,
    };
  }

  // NEW CASINO — create
  const casinoId = `casino_${normalizedSlug}_${Date.now().toString(36)}`;

  if (!dryRun) {
    // Insert casino record
    const casinoInsert: CasinoInsert = {
      id: casinoId,
      slug: normalizedSlug,
      name: casino.name,
      tagline: casino.tagline ?? null,
      logo: casino.logo ?? null,
      description: casino.description ?? null,
      website: casino.website,
      status: casino.status ?? "active",
      verificationStatus: "draft",
      lastVerifiedAt: now,
      rating: casino.rating ?? null,
      trustScore: casino.trustScore ?? null,
      minDeposit: casino.minDeposit,
      maxDeposit: casino.maxDeposit ?? null,
      minWithdrawal: casino.minWithdrawal ?? null,
      hasLiveCasino: casino.hasLiveCasino ?? false,
      hasSportsBetting: casino.hasSportsBetting ?? false,
      hasCrypto: casino.hasCrypto ?? false,
      hasMobile: casino.hasMobile ?? true,
      kycRequired: casino.kycRequired ?? true,
      minAge: casino.minAge ?? 18,
      languages: casino.languages ?? [],
      currencies: casino.currencies ?? [],
      bonuses: [],
      games: [],
      responsibleGambling: {
        selfExclusion: false,
        depositLimits: false,
        sessionLimits: false,
        realityCheck: false,
        coolingOffPeriod: false,
      },
      affiliateOffers: [],
      review: {
        overview: "",
        pros: [],
        cons: [],
        verdict: "",
        score: null,
        scoreBreakdown: null,
      },
      dataSources: [{
        field: "import",
        source,
        verifiedAt: now,
        notes: `Imported via batch ${batchId}`,
      }],
      createdAt: now,
      updatedAt: now,
    };

    db.insert(casinos).values(casinoInsert).run();

    // Insert licenses
    for (const license of casino.licenses) {
      db.insert(casinoLicenses).values({
        id: `lic_${casinoId}_${_idCounter++}_${Date.now().toString(36)}`,
        casinoId,
        issuer: license.issuer,
        jurisdiction: license.jurisdiction,
        licenseNumber: license.licenseNumber ?? null,
        url: license.url ?? null,
        status: license.status ?? "active",
        source,
        createdAt: now,
      }).run();
    }

    // Insert GEO availability
    for (const geo of casino.geo) {
      db.insert(geoAvailability).values({
        id: `geo_${casinoId}_${geo.geo}_${_idCounter++}_${Date.now().toString(36)}`,
        casinoId,
        geo: geo.geo,
        status: geo.status ?? "available",
        source,
        createdAt: now,
      }).run();
    }

    // Insert payment methods
    for (const pm of casino.paymentMethods) {
      // Ensure payment method exists in canonical table
      let pmRecord = db.select().from(paymentMethods).where(eq(paymentMethods.name, pm.name)).get();
      if (!pmRecord) {
        const pmId = `pm_${normalizeSlug(pm.name)}_${_idCounter++}_${Date.now().toString(36)}`;
        db.insert(paymentMethods).values({
          id: pmId,
          name: pm.name,
          slug: normalizeSlug(pm.name),
          type: pm.type,
          createdAt: now,
        }).run();
        pmRecord = { id: pmId, name: pm.name, slug: normalizeSlug(pm.name), type: pm.type, createdAt: now };
      }

      db.insert(casinoPaymentMethods).values({
        id: `cpm_${casinoId}_${pmRecord!.id}_${_idCounter++}_${Date.now().toString(36)}`,
        casinoId,
        paymentMethodId: pmRecord!.id,
        minDeposit: pm.minDeposit ?? null,
        maxDeposit: pm.maxDeposit ?? null,
        minWithdrawal: pm.minWithdrawal ?? null,
        maxWithdrawal: pm.maxWithdrawal ?? null,
        withdrawalTime: pm.withdrawalTime ?? null,
        fees: pm.fees ?? null,
        createdAt: now,
      }).run();
    }

    // Record provenance
    const sourceRecord = findOrCreateSource(db, casino.source, now);
    db.insert(factProvenance).values({
      id: generateProvenanceId(),
      casinoId,
      fieldName: "import_batch",
      sourceId: sourceRecord.id,
      value: batchId,
      verificationStatus: "sourced",
      confidence: "medium",
      retrievedAt: now,
      createdAt: now,
      updatedAt: now,
    }).run();

    // Record import
    db.insert(importRecords).values({
      id: generateRecordId(),
      batchId,
      sourceIdentifier: source,
      casinoId,
      casinoSlug: normalizedSlug,
      action: "created",
      status: "success",
      createdAt: now,
    }).run();
  }

  return {
    casinoSlug: normalizedSlug,
    action: "created",
    status: "success",
    errors,
    warnings,
  };
}

// ─── Process Casino Update ────────────────────────────────────────────────

async function processCasinoUpdate(
  db: DrizzleDB,
  existing: typeof casinos.$inferSelect,
  incoming: ImportCasino,
  batchId: string,
  source: string,
  sourceType: string,
  dryRun: boolean,
  now: string,
): Promise<{
  action: string;
  status: string;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if manually verified — preserve it
  if (existing.verificationStatus === "verified") {
    // Record the incoming value as a potential update but don't apply
    warnings.push(`Casino ${existing.slug} is manually verified — incoming data recorded but not applied`);

    if (!dryRun) {
      const sourceRecord = findOrCreateSource(db, { sourceType: sourceType as never, name: source }, now);
      db.insert(factProvenance).values({
        id: generateProvenanceId(),
        casinoId: existing.id,
        fieldName: "import_attempt",
        sourceId: sourceRecord.id,
        value: JSON.stringify(incoming),
        verificationStatus: "sourced",
        confidence: "low",
        retrievedAt: now,
        notes: "Attempted update of manually verified record",
        createdAt: now,
        updatedAt: now,
      }).run();

      db.insert(importRecords).values({
        id: generateRecordId(),
        batchId,
        sourceIdentifier: source,
        casinoId: existing.id,
        casinoSlug: existing.slug,
        action: "unchanged",
        status: "warning",
        warnings: ["Manually verified — incoming data recorded but not applied"],
        createdAt: now,
      }).run();
    }

    return { action: "unchanged", status: "warning", errors, warnings };
  }

  // Detect conflicts for key fields
  const incomingPriority = getSourcePriority(sourceType);
  const existingSourcePriority = existing.dataSources?.[0]
    ? getSourcePriority(existing.dataSources[0].source)
    : 99;

  const fieldsToCheck = ["minDeposit", "maxDeposit", "owner", "rating"];
  const conflictsList: ConflictDetail[] = [];

  for (const field of fieldsToCheck) {
    const existingVal = existing[field as keyof typeof existing];
    const incomingVal = incoming[field as keyof typeof incoming];

    if (existingVal !== undefined && incomingVal !== undefined) {
      const conflict = detectConflict(
        field,
        String(existingVal),
        String(incomingVal),
        existingSourcePriority,
        incomingPriority,
      );
      if (conflict.resolution === "preserve_existing" || conflict.resolution === "conflict") {
        conflictsList.push(conflict);
      }
    }
  }

  // Record conflicts
  if (conflictsList.length > 0 && !dryRun) {
    const sourceRecord = findOrCreateSource(db, { sourceType: sourceType as never, name: source }, now);

    for (const conflict of conflictsList) {
      db.insert(conflicts).values({
        id: generateConflictId(),
        casinoId: existing.id,
        batchId,
        fieldName: conflict.fieldName,
        existingValue: conflict.existingValue,
        incomingValue: conflict.incomingValue,
        incomingSourceId: sourceRecord.id,
        resolution: "unresolved",
        createdAt: now,
      }).run();

      warnings.push(`Conflict on ${conflict.fieldName}: existing="${conflict.existingValue}" vs incoming="${conflict.incomingValue}"`);
    }
  }

  // Apply safe updates (only non-conflicting fields)
  if (!dryRun) {
    const updates: Record<string, unknown> = {
      updatedAt: now,
      lastVerifiedAt: now,
    };

    // Only update fields that don't conflict
    const conflictFields = new Set(conflictsList.map((c) => c.fieldName));

    if (!conflictFields.has("owner") && incoming.owner) {
      updates.owner = incoming.owner;
    }
    if (!conflictFields.has("minDeposit")) {
      updates.minDeposit = incoming.minDeposit;
    }
    if (!conflictFields.has("maxDeposit") && incoming.maxDeposit !== undefined) {
      updates.maxDeposit = incoming.maxDeposit;
    }
    if (!conflictFields.has("rating") && incoming.rating !== undefined) {
      updates.rating = incoming.rating;
    }
    if (incoming.tagline) updates.tagline = incoming.tagline;
    if (incoming.description) updates.description = incoming.description;
    if (incoming.founded) updates.founded = incoming.founded;
    if (incoming.logo) updates.logo = incoming.logo;
    if (incoming.hasLiveCasino !== undefined) updates.hasLiveCasino = incoming.hasLiveCasino;
    if (incoming.hasSportsBetting !== undefined) updates.hasSportsBetting = incoming.hasSportsBetting;
    if (incoming.hasCrypto !== undefined) updates.hasCrypto = incoming.hasCrypto;
    if (incoming.hasMobile !== undefined) updates.hasMobile = incoming.hasMobile;
    if (incoming.kycRequired !== undefined) updates.kycRequired = incoming.kycRequired;
    if (incoming.minAge) updates.minAge = incoming.minAge;
    if (incoming.withdrawalProcessingTime) updates.withdrawalProcessingTime = incoming.withdrawalProcessingTime;
    if (incoming.languages.length > 0) updates.languages = incoming.languages;
    if (incoming.currencies.length > 0) updates.currencies = incoming.currencies;

    // Update dataSources
    const existingSources = existing.dataSources ?? [];
    updates.dataSources = [
      ...existingSources,
      {
        field: "import_update",
        source,
        verifiedAt: now,
        notes: `Updated via batch ${batchId}`,
      },
    ];

    db.update(casinos).set(updates).where(eq(casinos.id, existing.id)).run();

    // Record provenance
    const sourceRecord = findOrCreateSource(db, { sourceType: sourceType as never, name: source }, now);
    db.insert(factProvenance).values({
      id: generateProvenanceId(),
      casinoId: existing.id,
      fieldName: "import_batch",
      sourceId: sourceRecord.id,
      value: batchId,
      verificationStatus: "sourced",
      confidence: "medium",
      retrievedAt: now,
      createdAt: now,
      updatedAt: now,
    }).run();

    // Record import
    db.insert(importRecords).values({
      id: generateRecordId(),
      batchId,
      sourceIdentifier: source,
      casinoId: existing.id,
      casinoSlug: existing.slug,
      action: conflictsList.length > 0 ? "conflict" : "updated",
      status: conflictsList.length > 0 ? "warning" : "success",
      warnings: conflictsList.length > 0
        ? [`${conflictsList.length} conflicts detected`]
        : [],
      createdAt: now,
    }).run();
  }

  return {
    action: conflictsList.length > 0 ? "conflict" : "updated",
    status: conflictsList.length > 0 ? "warning" : "success",
    errors,
    warnings,
  };
}

// ─── Source Helpers ────────────────────────────────────────────────────────

function findOrCreateSource(
  db: DrizzleDB,
  sourceInput: { sourceType: string; name: string; url?: string },
  now: string,
): { id: string } {
  // Try to find existing source by name
  const existing = db.select().from(sources).where(eq(sources.name, sourceInput.name)).get();
  if (existing) return { id: existing.id };

  // Create new source
  const sourceId = generateSourceId();
  const domain = sourceInput.url ? new URL(sourceInput.url).hostname : null;

  db.insert(sources).values({
    id: sourceId,
    sourceType: sourceInput.sourceType as never,
    name: sourceInput.name,
    url: sourceInput.url ?? null,
    domain,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }).run();

  return { id: sourceId };
}
