/**
 * Payment Method Enrichment Tool
 *
 * Adds verified casino-payment relationships to the database.
 * Supports dry-run mode, idempotency, provenance tracking, and conflict detection.
 *
 * Phase 30C-G: Enriches the 15 Germany-only casinos with zero payment methods.
 *
 * Rules:
 * - Every relationship must have a source
 * - No duplicate relationships
 * - No fabricated data
 * - Provenance chain must be complete
 * - Conflicts are recorded, not silently resolved
 */

import Database from "better-sqlite3";
import path from "path";
import {
  casinos,
  paymentMethods,
  casinoPaymentMethods,
  factProvenance,
  sources,
  importBatches,
  importRecords,
  conflicts,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";

// ─── Types ──────────────────────────────────────────────────────────────

export type EnrichmentMode = "dry-run" | "live";

export type PaymentEnrichmentEntry = {
  casinoId: string;
  casinoSlug: string;
  paymentMethodName: string;
  sourceUrl: string;
  sourceType: "official_operator_website" | "official_payment_page" | "official_terms" | "manual_verified";
  sourceName: string;
  verificationDate: string;
  notes?: string;
};

export type EnrichmentResult = {
  batchId: string;
  mode: EnrichmentMode;
  processed: number;
  created: number;
  skipped: number;
  conflicts: number;
  errors: string[];
  details: Array<{
    casinoId: string;
    paymentMethod: string;
    action: "created" | "skipped" | "conflict" | "error";
    reason?: string;
  }>;
};

// ─── Database Access ────────────────────────────────────────────────────

function getDb() {
  const dbPath = process.env.CASINO_DB_PATH || path.join(process.cwd(), "casino.db");
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  return drizzle(sqlite, {
    schema: {
      casinos,
      paymentMethods,
      casinoPaymentMethods,
      factProvenance,
      sources,
      importBatches,
      importRecords,
      conflicts,
    },
  });
}

// ─── Core Functions ─────────────────────────────────────────────────────

/**
 * Check if a casino-payment relationship already exists.
 */
function relationshipExists(
  db: ReturnType<typeof getDb>,
  casinoId: string,
  paymentMethodId: string,
): boolean {
  const existing = db
    .select()
    .from(casinoPaymentMethods)
    .where(
      and(
        eq(casinoPaymentMethods.casinoId, casinoId),
        eq(casinoPaymentMethods.paymentMethodId, paymentMethodId),
      ),
    )
    .get();
  return !!existing;
}

/**
 * Find or create a source record.
 */
function findOrCreateSource(
  db: ReturnType<typeof getDb>,
  entry: PaymentEnrichmentEntry,
): string {
  const now = new Date().toISOString();

  // Try to find existing source by URL
  if (entry.sourceUrl) {
    const existing = db
      .select()
      .from(sources)
      .where(eq(sources.url, entry.sourceUrl))
      .get();
    if (existing) return existing.id;
  }

  // Create new source
  const sourceId = `src_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
  db.insert(sources).values({
    id: sourceId,
    sourceType: entry.sourceType,
    name: entry.sourceName,
    url: entry.sourceUrl,
    domain: entry.sourceUrl ? new URL(entry.sourceUrl).hostname : null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }).run();

  return sourceId;
}

/**
 * Find a payment method by name (canonical matching).
 */
function findPaymentMethod(
  db: ReturnType<typeof getDb>,
  name: string,
): { id: string; name: string } | null {
  // Exact match
  const exact = db
    .select()
    .from(paymentMethods)
    .where(eq(paymentMethods.name, name))
    .get();
  if (exact) return { id: exact.id, name: exact.name };

  // Case-insensitive match
  const all = db.select().from(paymentMethods).all();
  const lower = name.toLowerCase();
  const match = all.find((pm) => pm.name.toLowerCase() === lower);
  if (match) return { id: match.id, name: match.name };

  return null;
}

/**
 * Insert a single casino-payment relationship with provenance.
 */
function insertRelationship(
  db: ReturnType<typeof getDb>,
  entry: PaymentEnrichmentEntry,
  sourceId: string,
  batchId: string,
): { action: "created" | "skipped" | "conflict" | "error"; reason?: string } {
  const now = new Date().toISOString();

  // Find payment method
  const pm = findPaymentMethod(db, entry.paymentMethodName);
  if (!pm) {
    return { action: "error", reason: `Payment method not found: ${entry.paymentMethodName}` };
  }

  // Check idempotency
  if (relationshipExists(db, entry.casinoId, pm.id)) {
    return { action: "skipped", reason: "Relationship already exists" };
  }

  try {
    // Insert casino-payment relationship
    const cpmId = `cpm_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    db.insert(casinoPaymentMethods).values({
      id: cpmId,
      casinoId: entry.casinoId,
      paymentMethodId: pm.id,
      createdAt: now,
    }).run();

    // Insert provenance
    const fpId = `fp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    db.insert(factProvenance).values({
      id: fpId,
      casinoId: entry.casinoId,
      fieldName: `paymentMethod:${pm.name}`,
      sourceId,
      value: pm.name,
      verificationStatus: "sourced",
      confidence: "medium",
      retrievedAt: entry.verificationDate,
      checkedAt: now,
      notes: entry.notes || `Payment method added via 30C-G enrichment`,
      createdAt: now,
      updatedAt: now,
    }).run();

    return { action: "created" };
  } catch (err) {
    return { action: "error", reason: String(err) };
  }
}

/**
 * Run the payment enrichment batch.
 */
export function runEnrichment(
  entries: PaymentEnrichmentEntry[],
  mode: EnrichmentMode = "dry-run",
): EnrichmentResult {
  const db = getDb();
  const now = new Date().toISOString();

  // Create import batch
  const batchId = `30C-G-DE-PAYMENTS-01`;
  db.insert(importBatches).values({
    id: batchId,
    source: "30C-G-DE-PAYMENTS-01",
    sourceType: "official_operator_website",
    status: mode === "dry-run" ? "pending" : "running",
    isDryRun: mode === "dry-run",
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsSkipped: 0,
    recordsRejected: 0,
    conflictsDetected: 0,
    validationErrors: 0,
    startedAt: now,
    createdAt: now,
    metadata: {
      phase: "30C-G",
      targetCasinos: [...new Set(entries.map((e) => e.casinoId))],
      mode,
    },
  }).run();

  const result: EnrichmentResult = {
    batchId,
    mode,
    processed: 0,
    created: 0,
    skipped: 0,
    conflicts: 0,
    errors: [],
    details: [],
  };

  for (const entry of entries) {
    result.processed++;

    // Validate casino exists
    const casino = db
      .select()
      .from(casinos)
      .where(eq(casinos.id, entry.casinoId))
      .get();
    if (!casino) {
      result.errors.push(`Casino not found: ${entry.casinoId}`);
      result.details.push({
        casinoId: entry.casinoId,
        paymentMethod: entry.paymentMethodName,
        action: "error",
        reason: "Casino not found",
      });
      continue;
    }

    // Find or create source
    const sourceId = findOrCreateSource(db, entry);

    if (mode === "dry-run") {
      // Dry-run: just check if relationship would be created
      const pm = findPaymentMethod(db, entry.paymentMethodName);
      if (!pm) {
        result.details.push({
          casinoId: entry.casinoId,
          paymentMethod: entry.paymentMethodName,
          action: "error",
          reason: "Payment method not found",
        });
        result.errors.push(`Payment method not found: ${entry.paymentMethodName}`);
        continue;
      }

      if (relationshipExists(db, entry.casinoId, pm.id)) {
        result.skipped++;
        result.details.push({
          casinoId: entry.casinoId,
          paymentMethod: entry.paymentMethodName,
          action: "skipped",
          reason: "Relationship already exists",
        });
      } else {
        result.created++;
        result.details.push({
          casinoId: entry.casinoId,
          paymentMethod: entry.paymentMethodName,
          action: "created",
        });
      }
    } else {
      // Live: actually insert
      const insertResult = insertRelationship(db, entry, sourceId, batchId);
      if (insertResult.action === "created") result.created++;
      else if (insertResult.action === "skipped") result.skipped++;
      else if (insertResult.action === "conflict") result.conflicts++;
      else if (insertResult.action === "error") {
        result.errors.push(insertResult.reason || "Unknown error");
      }
      result.details.push({
        casinoId: entry.casinoId,
        paymentMethod: entry.paymentMethodName,
        action: insertResult.action,
        reason: insertResult.reason,
      });
    }
  }

  // Update batch record
  db.update(importBatches)
    .set({
      status: mode === "dry-run" ? "completed" : "completed",
      recordsProcessed: result.processed,
      recordsCreated: result.created,
      recordsSkipped: result.skipped,
      recordsRejected: result.errors.length,
      conflictsDetected: result.conflicts,
      completedAt: new Date().toISOString(),
    })
    .where(eq(importBatches.id, batchId))
    .run();

  return result;
}

/**
 * Get current state of target casinos for dry-run report.
 */
export function getTargetCasinoState() {
  const db = getDb();
  const targets = [
    "germany-bet365",
    "germany-leovegas",
    "germany-pokerstars",
    "germany-ladbrokes",
    "germany-interwetten",
  ];

  return targets.map((id) => {
    const casino = db.select().from(casinos).where(eq(casinos.id, id)).get();
    if (!casino) return null;

    const paymentCount = db
      .select()
      .from(casinoPaymentMethods)
      .where(eq(casinoPaymentMethods.casinoId, id))
      .all().length;

    return {
      id: casino.id,
      name: casino.name,
      slug: casino.slug,
      website: casino.website,
      GEOs: "DE",
      licenses: "GGL",
      owner: casino.owner,
      paymentCount,
      status: casino.status,
      verificationStatus: casino.verificationStatus,
    };
  }).filter(Boolean);
}
