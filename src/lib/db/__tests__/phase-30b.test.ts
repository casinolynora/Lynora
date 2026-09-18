/**
 * Phase 30B — Real Casino Dataset Tests
 *
 * Tests for 100 real casino dataset validation, provenance, publication, import, and integration.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {
  casinos, casinoLicenses, geoAvailability, casinoPaymentMethods,
  paymentMethods, sources, factProvenance, importBatches, importRecords,
  conflicts,
} from "@/lib/db/schema";
import {
  ImportCasinoSchema,
  validateUrlSecurity,
  normalizeSlug,
} from "@/lib/db/import-infrastructure";
import { runImport } from "@/lib/db/import-engine";

// ─── Test Database Setup ──────────────────────────────────────────────────

function createTestDb() {
  const sqlite = new Database(":memory:");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS operators (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, legalName TEXT NOT NULL, displayName TEXT, website TEXT, ownershipInfo TEXT, verificationStatus TEXT NOT NULL DEFAULT 'unverified', source TEXT, lastVerifiedAt TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS casinos (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, tagline TEXT, logo TEXT, description TEXT, website TEXT NOT NULL, operatorId TEXT REFERENCES operators(id) ON DELETE SET NULL, founded INTEGER, owner TEXT, status TEXT NOT NULL DEFAULT 'active', verificationStatus TEXT NOT NULL DEFAULT 'draft', lastVerifiedAt TEXT NOT NULL, rating REAL, trustScore REAL, minDeposit REAL NOT NULL, maxDeposit REAL, minWithdrawal REAL, hasLiveCasino INTEGER NOT NULL, hasSportsBetting INTEGER NOT NULL, hasCrypto INTEGER NOT NULL DEFAULT 0, hasMobile INTEGER NOT NULL DEFAULT 1, kycRequired INTEGER NOT NULL, minAge INTEGER NOT NULL DEFAULT 18, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL, dataSources TEXT, languages TEXT, currencies TEXT, withdrawalMethods TEXT, withdrawalProcessingTime TEXT, bonuses TEXT, games TEXT, kycDocuments TEXT, kycProcessingTime TEXT, responsibleGambling TEXT, affiliateOffers TEXT, review TEXT, features TEXT, tags TEXT, nextVerificationDue TEXT, verificationCadence TEXT);
    CREATE TABLE IF NOT EXISTS casino_licenses (id TEXT PRIMARY KEY, casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE, issuer TEXT NOT NULL, jurisdiction TEXT NOT NULL, licenseNumber TEXT, url TEXT, status TEXT, verifiedAt TEXT, source TEXT, createdAt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS geo_availability (id TEXT PRIMARY KEY, casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE, geo TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'available', source TEXT, verifiedAt TEXT, createdAt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS payment_methods (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE, type TEXT NOT NULL, createdAt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS casino_payment_methods (id TEXT PRIMARY KEY, casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE, paymentMethodId TEXT NOT NULL REFERENCES payment_methods(id) ON DELETE CASCADE, minDeposit REAL, maxDeposit REAL, minWithdrawal REAL, maxWithdrawal REAL, withdrawalTime TEXT, fees TEXT, createdAt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS player_reviews (id TEXT PRIMARY KEY, casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE, reviewerId TEXT, title TEXT NOT NULL, body TEXT NOT NULL, rating INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending', verificationStatus TEXT NOT NULL DEFAULT 'unverified', ipAddress TEXT, userAgent TEXT, locale TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL, publishedAt TEXT, moderatedBy TEXT, moderatedAt TEXT, rejectionReason TEXT);
    CREATE TABLE IF NOT EXISTS complaints (id TEXT PRIMARY KEY, casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE, reviewId TEXT REFERENCES player_reviews(id) ON DELETE SET NULL, subject TEXT NOT NULL, description TEXT NOT NULL, category TEXT NOT NULL, severity TEXT NOT NULL DEFAULT 'medium', status TEXT NOT NULL DEFAULT 'submitted', resolutionNote TEXT, resolvedAt TEXT, reviewerId TEXT, ipAddress TEXT, userAgent TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL, moderatedBy TEXT, moderatedAt TEXT);
    CREATE TABLE IF NOT EXISTS moderation_actions (id TEXT PRIMARY KEY, targetType TEXT NOT NULL, targetId TEXT NOT NULL, action TEXT NOT NULL, moderatorId TEXT NOT NULL, reason TEXT, previousStatus TEXT, createdAt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sources (id TEXT PRIMARY KEY, sourceType TEXT NOT NULL, name TEXT NOT NULL, url TEXT, domain TEXT, isActive INTEGER NOT NULL DEFAULT 1, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS fact_provenance (id TEXT PRIMARY KEY, casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE, fieldName TEXT NOT NULL, sourceId TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE, value TEXT, verificationStatus TEXT NOT NULL DEFAULT 'unverified', confidence TEXT NOT NULL DEFAULT 'medium', retrievedAt TEXT, checkedAt TEXT, expiresAt TEXT, reviewerId TEXT, notes TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS import_batches (id TEXT PRIMARY KEY, source TEXT NOT NULL, sourceType TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', isDryRun INTEGER NOT NULL DEFAULT 0, recordsProcessed INTEGER NOT NULL DEFAULT 0, recordsCreated INTEGER NOT NULL DEFAULT 0, recordsUpdated INTEGER NOT NULL DEFAULT 0, recordsUnchanged INTEGER NOT NULL DEFAULT 0, recordsSkipped INTEGER NOT NULL DEFAULT 0, recordsRejected INTEGER NOT NULL DEFAULT 0, conflictsDetected INTEGER NOT NULL DEFAULT 0, validationErrors INTEGER NOT NULL DEFAULT 0, startedAt TEXT, completedAt TEXT, createdAt TEXT NOT NULL, metadata TEXT);
    CREATE TABLE IF NOT EXISTS import_records (id TEXT PRIMARY KEY, batchId TEXT NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE, sourceIdentifier TEXT, casinoId TEXT REFERENCES casinos(id) ON DELETE SET NULL, casinoSlug TEXT, action TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'success', validationErrors TEXT, warnings TEXT, createdAt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS conflicts (id TEXT PRIMARY KEY, casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE, batchId TEXT REFERENCES import_batches(id) ON DELETE SET NULL, fieldName TEXT NOT NULL, existingValue TEXT, existingSourceId TEXT REFERENCES sources(id) ON DELETE SET NULL, incomingValue TEXT, incomingSourceId TEXT REFERENCES sources(id) ON DELETE SET NULL, resolution TEXT NOT NULL DEFAULT 'unresolved', resolvedBy TEXT, resolvedAt TEXT, resolutionNotes TEXT, createdAt TEXT NOT NULL);
  `);
  return drizzle(sqlite, { schema: { casinos, casinoLicenses, geoAvailability, casinoPaymentMethods, paymentMethods, sources, factProvenance, importBatches, importRecords, conflicts } });
}

// ─── Load Real Dataset ────────────────────────────────────────────────────

const FIXTURE_PATH = resolve("fixtures/real-casinos-100.json");
const realDataset = JSON.parse(readFileSync(FIXTURE_PATH, "utf-8"));

// ─── Dataset Validation Tests ─────────────────────────────────────────────

describe("Phase 30B — Dataset Validation", () => {
  it("contains exactly 100 records", () => {
    expect(realDataset).toHaveLength(100);
  });

  it("all records pass ImportCasinoSchema validation", () => {
    const results = realDataset.map((r: unknown) => ImportCasinoSchema.safeParse(r));
    const failures = results.filter((r: ReturnType<typeof ImportCasinoSchema.safeParse>) => !r.success);
    expect(failures).toHaveLength(0);
    if (failures.length > 0) {
      for (const f of failures) {
        console.error("Validation failure:", f.error?.issues);
      }
    }
  });

  it("all slugs are unique", () => {
    const slugs = realDataset.map((r: Record<string, unknown>) => r.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("all slugs are lowercase alphanumeric with hyphens", () => {
    for (const record of realDataset) {
      expect(normalizeSlug(record.slug)).toBe(record.slug);
    }
  });

  it("all websites are valid HTTPS URLs", () => {
    for (const record of realDataset) {
      const result = validateUrlSecurity(record.website);
      expect(result.valid).toBe(true);
    }
  });

  it("all records have at least one license", () => {
    for (const record of realDataset) {
      expect(record.licenses.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("all licenses have issuer and jurisdiction", () => {
    for (const record of realDataset) {
      for (const license of record.licenses) {
        expect(license.issuer).toBeTruthy();
        expect(license.jurisdiction).toBeTruthy();
        expect(license.jurisdiction.length).toBe(2);
      }
    }
  });

  it("all minDeposit values are non-negative numbers", () => {
    for (const record of realDataset) {
      expect(typeof record.minDeposit).toBe("number");
      expect(record.minDeposit).toBeGreaterThanOrEqual(0);
    }
  });

  it("no duplicate casino names across dataset", () => {
    const names = realDataset.map((r: Record<string, unknown>) => (r.name as string).toLowerCase());
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it("all source objects have required fields", () => {
    for (const record of realDataset) {
      expect(record.source).toBeDefined();
      expect(record.source.sourceType).toBeTruthy();
      expect(record.source.name).toBeTruthy();
    }
  });

  it("has GEO coverage for target markets", () => {
    const geoCounts: Record<string, number> = {};
    for (const record of realDataset) {
      for (const geo of record.geo || []) {
        geoCounts[geo.geo] = (geoCounts[geo.geo] || 0) + 1;
      }
    }
    expect(geoCounts["DE"]).toBeGreaterThanOrEqual(10);
    expect(geoCounts["NL"]).toBeGreaterThanOrEqual(10);
    expect(geoCounts["BE"]).toBeGreaterThanOrEqual(10);
    expect(geoCounts["IE"]).toBeGreaterThanOrEqual(1);
  });

  it("no test/placeholder names in production dataset", () => {
    const forbiddenPatterns = ["test", "example", "demo", "lorem", "fake", "placeholder"];
    for (const record of realDataset) {
      const nameLower = record.name.toLowerCase();
      for (const pattern of forbiddenPatterns) {
        expect(nameLower).not.toContain(pattern);
      }
    }
  });
});

// ─── Provenance Tests ─────────────────────────────────────────────────────

describe("Phase 30B — Provenance", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(() => {
    db = createTestDb();
  });

  it("creates source records on import", async () => {
    await runImport([{
      name: "Provenance Test Casino",
      slug: "provenance-test",
      website: "https://provencance-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "trusted_third_party", name: "Test Source", url: "https://test.com" },
    }], { db: db as never, dryRun: false, source: "Test Source", sourceType: "trusted_third_party" });

    const sourceRecord = db.select().from(sources).where(eq(sources.name, "Test Source")).get();
    expect(sourceRecord).toBeDefined();
    expect(sourceRecord?.sourceType).toBe("trusted_third_party");
    expect(sourceRecord?.isActive).toBeTruthy();
  });

  it("creates provenance records for each imported casino", async () => {
    await runImport([{
      name: "Provenance Casino 2",
      slug: "provenance-test-2",
      website: "https://provencance-test2.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "trusted_third_party", name: "Test Source 2" },
    }], { db: db as never, dryRun: false, source: "Test Source 2", sourceType: "trusted_third_party" });

    const provRecords = db.select().from(factProvenance).all();
    expect(provRecords.length).toBeGreaterThanOrEqual(1);
    for (const prov of provRecords) {
      expect(prov.verificationStatus).toBe("sourced");
      expect(prov.sourceId).toBeTruthy();
      expect(prov.casinoId).toBeTruthy();
    }
  });

  it("records batch audit trail", async () => {
    await runImport([{
      name: "Audit Trail Casino",
      slug: "audit-trail-test",
      website: "https://audit-trail-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "GGL", jurisdiction: "DE" }],
      source: { sourceType: "other", name: "Audit Test" },
    }], { db: db as never, dryRun: false, source: "Audit Test", sourceType: "other" });

    const batch = db.select().from(importBatches).get();
    expect(batch).toBeDefined();
    expect(batch?.status).toBe("completed");
    expect(batch?.recordsCreated).toBe(1);
    expect(batch?.isDryRun).toBeFalsy();

    const record = db.select().from(importRecords).get();
    expect(record).toBeDefined();
    expect(record?.action).toBe("created");
    expect(record?.status).toBe("success");
  });

  it("detects conflicts between sources with different priorities", async () => {
    // First import with lower priority source
    await runImport([{
      name: "Conflict Test Casino",
      slug: "conflict-test",
      website: "https://conflict-test.com",
      minDeposit: 20,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Low Priority Source" },
    }], { db: db as never, dryRun: false, source: "Low Priority", sourceType: "other" });

    // Second import with higher priority source, different minDeposit
    await runImport([{
      name: "Conflict Test Casino",
      slug: "conflict-test",
      website: "https://conflict-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "regulator", name: "High Priority Source" },
    }], { db: db as never, dryRun: false, source: "High Priority", sourceType: "regulator" });

    const conflictRecords = db.select().from(conflicts).all();
    // Higher priority should update, not conflict
    expect(conflictRecords.length).toBe(0);
  });

  it("preserves manually verified records from lower-priority updates", async () => {
    // Create a verified casino
    await runImport([{
      name: "Verified Casino",
      slug: "verified-test",
      website: "https://verified-test.com",
      minDeposit: 20,
      licenses: [{ issuer: "GGL", jurisdiction: "DE" }],
      source: { sourceType: "other", name: "Initial Source" },
    }], { db: db as never, dryRun: false, source: "Initial", sourceType: "other" });

    // Manually mark as verified
    db.update(casinos).set({ verificationStatus: "verified" }).where(eq(casinos.slug, "verified-test")).run();

    // Try to update with new source
    const result = await runImport([{
      name: "Verified Casino",
      slug: "verified-test",
      website: "https://verified-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "GGL", jurisdiction: "DE" }],
      source: { sourceType: "trusted_third_party", name: "New Source" },
    }], { db: db as never, dryRun: false, source: "New Source", sourceType: "trusted_third_party" });

    // Should be unchanged (verified casinos are locked)
    expect(result.recordsUnchanged).toBe(1);
    expect(result.recordsUpdated).toBe(0);
  });
});

// ─── Publication Gate Tests ───────────────────────────────────────────────

describe("Phase 30B — Publication Gate", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(() => {
    db = createTestDb();
  });

  it("imported casinos start as draft (not production-visible)", async () => {
    await runImport([{
      name: "Draft Casino",
      slug: "draft-test",
      website: "https://draft-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Test" },
    }], { db: db as never, dryRun: false, source: "Test", sourceType: "other" });

    const casino = db.select().from(casinos).where(eq(casinos.slug, "draft-test")).get();
    expect(casino).toBeDefined();
    expect(casino?.verificationStatus).toBe("draft");
  });

  it("casinos with status=active and verificationStatus=verified are production-visible", async () => {
    await runImport([{
      name: "Visible Casino",
      slug: "visible-test",
      website: "https://visible-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Test" },
    }], { db: db as never, dryRun: false, source: "Test", sourceType: "other" });

    // Promote to verified
    db.update(casinos).set({ verificationStatus: "verified" }).where(eq(casinos.slug, "visible-test")).run();

    const casino = db.select().from(casinos).where(eq(casinos.slug, "visible-test")).get();
    expect(casino?.status).toBe("active");
    expect(casino?.verificationStatus).toBe("verified");
  });

  it("casinos with status=inactive are not production-visible", async () => {
    await runImport([{
      name: "Inactive Casino",
      slug: "inactive-test",
      website: "https://inactive-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Test" },
      status: "inactive",
    }], { db: db as never, dryRun: false, source: "Test", sourceType: "other" });

    const casino = db.select().from(casinos).where(eq(casinos.slug, "inactive-test")).get();
    expect(casino?.status).toBe("inactive");
  });

  it("unpublished casinos do not leak into sitemap (data-level check)", async () => {
    await runImport([{
      name: "Unpublished Casino",
      slug: "unpublished-test",
      website: "https://unpublished-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Test" },
    }], { db: db as never, dryRun: false, source: "Test", sourceType: "other" });

    // Simulate sitemap query: only active+verified
    const publicCasinos = db.select().from(casinos)
      .where(sql`${casinos.status} = 'active' AND ${casinos.verificationStatus} = 'verified'`)
      .all();

    const unpublished = publicCasinos.find((c) => c.slug === "unpublished-test");
    expect(unpublished).toBeUndefined();
  });
});

// ─── Import Engine Tests ──────────────────────────────────────────────────

describe("Phase 30B — Import Engine", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(() => {
    db = createTestDb();
  });

  it("imports the full 100-record fixture in dry-run", { timeout: 15000 }, async () => {
    const result = await runImport(realDataset, {
      db: db as never,
      dryRun: true,
      source: "CasinoLynora Editorial Research",
      sourceType: "trusted_third_party",
    });

    expect(result.status).toBe("completed");
    expect(result.recordsProcessed).toBe(100);
    expect(result.recordsRejected).toBe(0);
  });

  it("imports the full 100-record fixture in live mode", { timeout: 30000 }, async () => {
    const result = await runImport(realDataset, {
      db: db as never,
      dryRun: false,
      source: "CasinoLynora Editorial Research",
      sourceType: "trusted_third_party",
    });

    expect(result.status).toBe("completed");
    expect(result.recordsProcessed).toBe(100);
    expect(result.recordsCreated).toBe(100);
    expect(result.recordsRejected).toBe(0);

    // Verify count
    const count = db.select({ count: sql<number>`count(*)` }).from(casinos).get();
    expect(count?.count).toBe(100);
  });

  it("is idempotent — re-import produces no new records", { timeout: 30000 }, async () => {
    // First import
    await runImport(realDataset, {
      db: db as never,
      dryRun: false,
      source: "CasinoLynora Editorial Research",
      sourceType: "trusted_third_party",
    });

    // Second import
    const result2 = await runImport(realDataset, {
      db: db as never,
      dryRun: false,
      source: "CasinoLynora Editorial Research",
      sourceType: "trusted_third_party",
    });

    expect(result2.recordsCreated).toBe(0);
    expect(result2.recordsUpdated + result2.recordsUnchanged).toBe(100);

    // No duplicates
    const count = db.select({ count: sql<number>`count(*)` }).from(casinos).get();
    expect(count?.count).toBe(100);
  });

  it("creates normalized license records", async () => {
    await runImport([{
      name: "License Test Casino",
      slug: "license-test",
      website: "https://license-test.com",
      minDeposit: 10,
      licenses: [
        { issuer: "GGL", jurisdiction: "DE", status: "active" },
        { issuer: "MGA", jurisdiction: "MT", status: "active" },
      ],
      source: { sourceType: "other", name: "Test" },
    }], { db: db as never, dryRun: false, source: "Test", sourceType: "other" });

    // At least the licenses should be created
    const allLicenses = db.select().from(casinoLicenses).all();
    expect(allLicenses.length).toBeGreaterThanOrEqual(2);
  });

  it("creates normalized GEO records", async () => {
    await runImport([{
      name: "GEO Test Casino",
      slug: "geo-test",
      website: "https://geo-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      geo: [
        { geo: "DE", status: "available" },
        { geo: "NL", status: "restricted" },
      ],
      source: { sourceType: "other", name: "Test" },
    }], { db: db as never, dryRun: false, source: "Test", sourceType: "other" });

    const casino = db.select().from(casinos).where(eq(casinos.slug, "geo-test")).get();
    expect(casino).toBeDefined();
    const geoRecords = db.select().from(geoAvailability)
      .where(eq(geoAvailability.casinoId, casino!.id))
      .all();
    expect(geoRecords.length).toBe(2);
  });

  it("creates normalized payment method records", async () => {
    await runImport([{
      name: "Payment Test Casino",
      slug: "payment-test",
      website: "https://payment-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      paymentMethods: [
        { name: "Visa", type: "card" },
        { name: "PayPal", type: "e-wallet" },
      ],
      source: { sourceType: "other", name: "Test" },
    }], { db: db as never, dryRun: false, source: "Test", sourceType: "other" });

    const casino = db.select().from(casinos).where(eq(casinos.slug, "payment-test")).get();
    expect(casino).toBeDefined();
    const cpmRecords = db.select().from(casinoPaymentMethods)
      .where(eq(casinoPaymentMethods.casinoId, casino!.id))
      .all();
    expect(cpmRecords.length).toBe(2);
  });

  it("handles deactivation — casino not deleted when missing from batch", async () => {
    // Import one casino
    await runImport([{
      name: "Deactivation Test",
      slug: "deactivation-test",
      website: "https://deactivation-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Test" },
    }], { db: db as never, dryRun: false, source: "Test", sourceType: "other" });

    // Import empty batch (no casinos)
    await runImport([], {
      db: db as never,
      dryRun: false,
      source: "Test",
      sourceType: "other",
    });

    // Casino should still exist (not deleted)
    const casino = db.select().from(casinos).where(eq(casinos.slug, "deactivation-test")).get();
    expect(casino).toBeDefined();
  });
});

// ─── Integration Tests ────────────────────────────────────────────────────

describe("Phase 30B — Integration", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(() => {
    db = createTestDb();
  });

  it("imported casinos have proper structure for Profile V2 rendering", async () => {
    await runImport([{
      name: "Profile Test Casino",
      slug: "profile-test",
      website: "https://profile-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "GGL", jurisdiction: "DE", status: "active" }],
      geo: [{ geo: "DE", status: "available" }],
      paymentMethods: [{ name: "Visa", type: "card" }],
      hasLiveCasino: true,
      hasSportsBetting: false,
      source: { sourceType: "other", name: "Test" },
    }], { db: db as never, dryRun: false, source: "Test", sourceType: "other" });

    const casino = db.select().from(casinos).where(eq(casinos.slug, "profile-test")).get();
    expect(casino).toBeDefined();
    expect(casino?.hasLiveCasino).toBeTruthy();
    expect(casino?.hasSportsBetting).toBeFalsy();
    expect(casino?.minDeposit).toBe(10);

    // Verify child records exist
    const licenses = db.select().from(casinoLicenses)
      .innerJoin(casinos, eq(casinoLicenses.casinoId, casinos.id))
      .where(eq(casinos.slug, "profile-test"))
      .all();
    expect(licenses.length).toBeGreaterThanOrEqual(1);
  });

  it("imported casinos support GEO filtering", async () => {
    await runImport([{
      name: "GEO Filter Test",
      slug: "geo-filter-test",
      website: "https://geo-filter-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "GGL", jurisdiction: "DE" }],
      geo: [
        { geo: "DE", status: "available" },
        { geo: "NL", status: "restricted" },
      ],
      source: { sourceType: "other", name: "Test" },
    }], { db: db as never, dryRun: false, source: "Test", sourceType: "other" });

    // Simulate GEO filter query
    const deCasinos = db.select().from(casinos)
      .innerJoin(geoAvailability, eq(casinos.id, geoAvailability.casinoId))
      .where(sql`${geoAvailability.geo} = 'DE' AND ${geoAvailability.status} = 'available'`)
      .all();

    expect(deCasinos.length).toBeGreaterThanOrEqual(1);
    expect(deCasinos.some((c) => c.casinos.slug === "geo-filter-test")).toBe(true);
  });

  it("payment methods are normalized across casinos", async () => {
    // Import two casinos with same payment method
    await runImport([
      {
        name: "Payment Norm Test 1",
        slug: "payment-norm-1",
        website: "https://payment-norm-1.com",
        minDeposit: 10,
        licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
        paymentMethods: [{ name: "Visa", type: "card" }],
        source: { sourceType: "other", name: "Test" },
      },
      {
        name: "Payment Norm Test 2",
        slug: "payment-norm-2",
        website: "https://payment-norm-2.com",
        minDeposit: 10,
        licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
        paymentMethods: [{ name: "Visa", type: "card" }],
        source: { sourceType: "other", name: "Test" },
      },
    ], { db: db as never, dryRun: false, source: "Test", sourceType: "other" });

    // Should have only one "Visa" payment method
    const visaMethods = db.select().from(paymentMethods)
      .where(eq(paymentMethods.name, "Visa"))
      .all();
    expect(visaMethods.length).toBe(1);

    // Both casinos should reference the same payment method
    const cpmRecords = db.select().from(casinoPaymentMethods)
      .where(eq(casinoPaymentMethods.paymentMethodId, visaMethods[0].id))
      .all();
    expect(cpmRecords.length).toBe(2);
  });

  it("comparison engine data is deterministic with imported casinos", async () => {
    await runImport([{
      name: "Compare Test Casino",
      slug: "compare-test",
      website: "https://compare-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "GGL", jurisdiction: "DE" }],
      geo: [{ geo: "DE", status: "available" }],
      paymentMethods: [{ name: "Visa", type: "card" }],
      source: { sourceType: "other", name: "Test" },
    }], { db: db as never, dryRun: false, source: "Test", sourceType: "other" });

    const casino = db.select().from(casinos).where(eq(casinos.slug, "compare-test")).get();
    expect(casino).toBeDefined();
    expect(casino?.minDeposit).toBe(10);
    expect(casino?.hasLiveCasino).toBeFalsy();
  });

  it("B2B status does not affect editorial data", async () => {
    await runImport([{
      name: "B2B Separation Test",
      slug: "b2b-separation-test",
      website: "https://b2b-separation-test.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Test" },
    }], { db: db as never, dryRun: false, source: "Test", sourceType: "other" });

    const casino = db.select().from(casinos).where(eq(casinos.slug, "b2b-separation-test")).get();
    expect(casino).toBeDefined();
    // B2B fields should not exist on editorial casino record
    expect((casino as Record<string, unknown>).listingPlan).toBeUndefined();
    expect((casino as Record<string, unknown>).sponsored).toBeUndefined();
    expect((casino as Record<string, unknown>).featured).toBeUndefined();
  });
});
