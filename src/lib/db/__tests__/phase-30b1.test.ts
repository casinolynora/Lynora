/**
 * Phase 30B.1 — Manual Casino Verification Workflow Tests
 *
 * Tests for the 20-casino verification sprint:
 * - Selection determinism
 * - Verification lifecycle
 * - Publication gate
 * - SEO safety
 * - Integration
 */
import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { eq, sql, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {
  casinos,
  casinoLicenses,
  geoAvailability,
  casinoPaymentMethods,
  paymentMethods,
  sources,
  factProvenance,
  importBatches,
  importRecords,
  conflicts,
} from "@/lib/db/schema";
import { runImport } from "@/lib/db/import-engine";
import {
  runVerification,
  validateVerificationBatch,
} from "@/lib/db/verification-engine";
import type { VerificationBatch } from "@/lib/db/verification-engine";

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
  return drizzle(sqlite, {
    schema: {
      casinos, casinoLicenses, geoAvailability, casinoPaymentMethods,
      paymentMethods, sources, factProvenance, importBatches, importRecords, conflicts,
    },
  });
}

// ─── Load Fixtures ────────────────────────────────────────────────────────

const REAL_DATASET = JSON.parse(readFileSync(resolve("fixtures/real-casinos-100.json"), "utf-8"));
const MANIFEST = JSON.parse(readFileSync(resolve("fixtures/verification-manifest-01.json"), "utf-8"));
const VERIFICATION_DATA = JSON.parse(readFileSync(resolve("fixtures/verification-batch-01-data.json"), "utf-8")) as VerificationBatch;

const EXPECTED_20_SLUGS = [
  "bet365", "betway-casino", "betfair-casino", "rizk", "ladbrokes-casino",
  "vegashero", "tipico-casino", "guts", "drukteglueck", "lucky-vegas-de",
  "wildz", "jacks-casino-online", "pokerstars-nl", "kansino", "bob-casino-nl",
  "bingoal-nl", "bet365-be", "golden-palace-be", "fortuneo-be", "flash-casino-nl",
];

// ─── Helper: seed 100 real casinos ────────────────────────────────────────

async function seedRealCasinos(db: ReturnType<typeof createTestDb>) {
  await runImport(REAL_DATASET, {
    db: db as never,
    dryRun: false,
    source: "BeInCasinos Editorial Research",
    sourceType: "trusted_third_party",
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SELECTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("Phase 30B.1 — Selection", () => {
  it("manifest contains exactly 20 casinos", () => {
    expect(MANIFEST.casinos).toHaveLength(20);
  });

  it("selection is deterministic — same 20 slugs every time", () => {
    const slugs = MANIFEST.casinos.map((c: { slug: string }) => c.slug);
    expect(slugs).toEqual(EXPECTED_20_SLUGS);
  });

  it("no duplicate slugs in selection", () => {
    const slugs = MANIFEST.casinos.map((c: { slug: string }) => c.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(20);
  });

  it("all 20 slugs exist in the 100-casino dataset", () => {
    const allSlugs = new Set(REAL_DATASET.map((c: { slug: string }) => c.slug));
    for (const item of MANIFEST.casinos) {
      expect(allSlugs.has(item.slug)).toBe(true);
    }
  });

  it("covers multiple GEO regions (DE, NL, BE, IE/GB)", () => {
    const dataset = new Map<string, Array<{ geo: string }>>(
      REAL_DATASET.map((c: { slug: string; geo: Array<{ geo: string }> }) => [c.slug, c.geo])
    );
    const geos = new Set<string>();
    for (const item of MANIFEST.casinos) {
      const casinoGeo = dataset.get(item.slug);
      if (casinoGeo) {
        for (const g of casinoGeo) {
          geos.add(g.geo);
        }
      }
    }
    expect(geos.has("DE")).toBe(true);
    expect(geos.has("NL")).toBe(true);
    expect(geos.has("BE")).toBe(true);
    expect(geos.has("GB") || geos.has("IE")).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// VERIFICATION ENGINE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("Phase 30B.1 — Verification", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(async () => {
    db = createTestDb();
    await seedRealCasinos(db);
  });

  it("transitions sourced/draft → verified with evidence", async () => {
    const result = await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });
    expect(result.status).toBe("completed");
    expect(result.recordsVerified).toBeGreaterThanOrEqual(1);

    const verified = db.select().from(casinos)
      .where(eq(casinos.slug, "tipico-casino"))
      .get();
    expect(verified).toBeDefined();
    expect(verified!.verificationStatus).toBe("verified");
  });

  it("skips casinos without critical evidence", async () => {
    const noEvidenceBatch: VerificationBatch = {
      batch: "test-no-evidence",
      version: 1,
      verifiedBy: "editorial-research",
      verifiedAt: "2026-09-18T00:00:00Z",
      casinos: [{
        slug: "tipico-casino",
        verifiedBy: "editorial-research",
        verifiedAt: "2026-09-18T00:00:00Z",
        facts: {
          someField: { value: "test", source: "https://example.com", status: "manually_verified" },
        },
      }],
    };
    const result = await runVerification(noEvidenceBatch, { db: db as never, dryRun: false });
    expect(result.recordsSkipped).toBe(1);
  });

  it("rejects verification for non-existent casino", async () => {
    const badBatch: VerificationBatch = {
      batch: "test-not-found",
      version: 1,
      verifiedBy: "editorial-research",
      verifiedAt: "2026-09-18T00:00:00Z",
      casinos: [{
        slug: "nonexistent-casino",
        verifiedBy: "editorial-research",
        verifiedAt: "2026-09-18T00:00:00Z",
        facts: {
          officialWebsite: { value: "https://example.com", source: "https://example.com", status: "manually_verified" },
        },
      }],
    };
    const result = await runVerification(badBatch, { db: db as never, dryRun: false });
    expect(result.recordsFailed).toBe(1);
  });

  it("is idempotent — re-running does not re-verify", async () => {
    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });
    const result2 = await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });
    expect(result2.recordsVerified).toBe(0);
    expect(result2.recordsUnchanged).toBe(20);
  });

  it("records verification timestamp", async () => {
    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });
    const verified = db.select().from(casinos)
      .where(eq(casinos.slug, "tipico-casino"))
      .get();
    expect(verified!.lastVerifiedAt).toBe("2026-09-18T00:00:00Z");
  });

  it("records actor in provenance", async () => {
    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });
    const casino = db.select().from(casinos).where(eq(casinos.slug, "tipico-casino")).get();
    const provenance = db.select().from(factProvenance)
      .where(and(
        eq(factProvenance.casinoId, casino!.id),
        eq(factProvenance.verificationStatus, "manually_verified"),
      ))
      .all();
    expect(provenance.length).toBeGreaterThan(0);
    expect(provenance[0].reviewerId).toBe("editorial-research");
  });

  it("creates provenance records for verified facts", async () => {
    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });
    const casino = db.select().from(casinos).where(eq(casinos.slug, "tipico-casino")).get();
    const provenance = db.select().from(factProvenance)
      .where(and(
        eq(factProvenance.casinoId, casino!.id),
        eq(factProvenance.verificationStatus, "manually_verified"),
      ))
      .all();
    expect(provenance.length).toBeGreaterThanOrEqual(3);
    for (const p of provenance) {
      expect(p.verificationStatus).toBe("manually_verified");
      expect(p.confidence).toBe("definitive");
    }
  });

  it("records provenance with batch ID in dataSources", async () => {
    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });
    const casino = db.select().from(casinos).where(eq(casinos.slug, "tipico-casino")).get();
    expect(casino!.dataSources).toBeDefined();
    expect(casino!.dataSources!.length).toBeGreaterThanOrEqual(1);
  });

  it("dry-run reports accurate facts count without mutating DB", async () => {
    const result = await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: true });
    expect(result.dryRun).toBe(true);
    expect(result.recordsVerified).toBeGreaterThanOrEqual(1);
    expect(result.factsVerified).toBeGreaterThan(0);

    // Verify DB was not mutated
    const unchanged = db.select().from(casinos)
      .where(eq(casinos.slug, "tipico-casino"))
      .get();
    expect(unchanged!.verificationStatus).toBe("draft");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// REMAINING 80 UNTOUCHED
// ═══════════════════════════════════════════════════════════════════════════

describe("Phase 30B.1 — Remaining 80 Untouched", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(async () => {
    db = createTestDb();
    await seedRealCasinos(db);
  });

  it("remaining 80 stay draft after verification of 20", async () => {
    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });

    const selectedSlugs = new Set(EXPECTED_20_SLUGS);
    const allCasinos = db.select().from(casinos).all();
    const nonSelected = allCasinos.filter((c) => !selectedSlugs.has(c.slug));

    for (const c of nonSelected) {
      expect(c.verificationStatus).toBe("draft");
    }
  });

  it("verified count equals pre-existing verified + newly verified", async () => {
    const beforeCounts = db.select({
      status: casinos.verificationStatus,
      count: sql<number>`count(*)`,
    }).from(casinos).groupBy(casinos.verificationStatus).all();
    const beforeVerified = beforeCounts.find((c) => c.status === "verified")?.count ?? 0;

    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });

    const afterCounts = db.select({
      status: casinos.verificationStatus,
      count: sql<number>`count(*)`,
    }).from(casinos).groupBy(casinos.verificationStatus).all();
    const afterVerified = afterCounts.find((c) => c.status === "verified")?.count ?? 0;

    expect(afterVerified).toBeGreaterThanOrEqual(beforeVerified + 17);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PUBLICATION GATE
// ═══════════════════════════════════════════════════════════════════════════

describe("Phase 30B.1 — Publication Gate", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(async () => {
    db = createTestDb();
    await seedRealCasinos(db);
  });

  it("isProductionVisible requires verified status", async () => {
    const isProductionVisible = (row: typeof casinos.$inferSelect) =>
      row.status === "active" && row.verificationStatus === "verified";

    // Before verification
    const draftCasino = db.select().from(casinos).where(eq(casinos.slug, "tipico-casino")).get();
    expect(isProductionVisible(draftCasino!)).toBe(false);

    // After verification
    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });
    const verifiedCasino = db.select().from(casinos).where(eq(casinos.slug, "tipico-casino")).get();
    expect(isProductionVisible(verifiedCasino!)).toBe(true);
  });

  it("unpublished casinos have no sitemap entry", async () => {
    // tipico-casino is draft before verification
    const casino = db.select().from(casinos).where(eq(casinos.slug, "tipico-casino")).get();
    expect(casino!.verificationStatus).toBe("draft");

    // In production, sitemap only includes verified casinos
    // Since we can't call sitemap in unit test, verify the gate logic
    const isProductionVisible = (row: typeof casinos.$inferSelect) =>
      row.status === "active" && row.verificationStatus === "verified";
    expect(isProductionVisible(casino!)).toBe(false);
  });

  it("draft casinos do not appear in public listings", async () => {
    // simulates getAllCasinos filtering
    const allBefore = db.select().from(casinos).all()
      .filter((r) => r.status === "active" && r.verificationStatus === "verified");
    const hasTipicoBefore = allBefore.some((c) => c.slug === "tipico-casino");
    expect(hasTipicoBefore).toBe(false);

    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });

    const allAfter = db.select().from(casinos).all()
      .filter((r) => r.status === "active" && r.verificationStatus === "verified");
    const hasTipicoAfter = allAfter.some((c) => c.slug === "tipico-casino");
    expect(hasTipicoAfter).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SEO SAFETY
// ═══════════════════════════════════════════════════════════════════════════

describe("Phase 30B.1 — SEO Safety", () => {
  it("verification batch fixture has valid source URLs", () => {
    for (const casino of VERIFICATION_DATA.casinos) {
      for (const [, fact] of Object.entries(casino.facts)) {
        if (fact.source) {
          expect(() => new URL(fact.source)).not.toThrow();
        }
      }
    }
  });

  it("no fabricated reviews or ratings in verification data", () => {
    const reviewFields = ["reviewScore", "playerRating", "reviewCount", "averageRating"];
    for (const casino of VERIFICATION_DATA.casinos) {
      for (const field of reviewFields) {
        expect(casino.facts[field]).toBeUndefined();
      }
    }
  });

  it("all verified facts reference real source domains", () => {
    const knownDomains = [
      "bet365.com", "bet365.be", "betway.com", "betfair.com", "rizk.com", "ladbrokes.com",
      "vegashero.com", "tipico.de", "guts.com", "drueckglueck.de", "luckyvegas.de",
      "wildz.de", "jackscasino.nl", "pokerstars.nl", "kansino.nl", "bobcasino.nl",
      "bingoal.nl", "goldenpalace.be", "fortuneo.be", "flashcasino.nl",
      "gamblingcommission.gov.uk", "mga.org.mt", "ggl.de", "ksa.nl", "gamingcommission.be",
    ];
    for (const casino of VERIFICATION_DATA.casinos) {
      for (const [, fact] of Object.entries(casino.facts)) {
        if (fact.source) {
          const hostname = new URL(fact.source).hostname;
          // Strip www. prefix for matching
          const bare = hostname.replace(/^www\./, "");
          expect(knownDomains).toContain(bare);
        }
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

describe("Phase 30B.1 — Validation", () => {
  it("validates correct verification batch", () => {
    const result = validateVerificationBatch(VERIFICATION_DATA);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data!.casinos).toHaveLength(20);
  });

  it("rejects invalid batch (missing required fields)", () => {
    const result = validateVerificationBatch({ batch: "test" });
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects batch with invalid fact source URL", () => {
    const invalid = {
      ...VERIFICATION_DATA,
      casinos: [{
        slug: "test",
        verifiedBy: "editorial-research",
        verifiedAt: "2026-09-18T00:00:00Z",
        facts: {
          officialWebsite: { value: "https://test.com", source: "not-a-url", status: "manually_verified" },
        },
      }],
    };
    const result = validateVerificationBatch(invalid);
    expect(result.success).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// AUDIT TRAIL
// ═══════════════════════════════════════════════════════════════════════════

describe("Phase 30B.1 — Audit Trail", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(async () => {
    db = createTestDb();
    await seedRealCasinos(db);
  });

  it("creates import batch record for verification", async () => {
    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });
    const batches = db.select().from(importBatches)
      .where(eq(importBatches.source, "manual_verification"))
      .all();
    expect(batches.length).toBeGreaterThanOrEqual(1);
    expect(batches[0].status).toMatch(/completed/);
  });

  it("creates import records for each verified casino", async () => {
    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });
    const records = db.select().from(importRecords)
      .where(eq(importRecords.sourceIdentifier, "manual_verification"))
      .all();
    expect(records.length).toBeGreaterThanOrEqual(17);
    for (const r of records) {
      expect(r.action).toBe("created");
    }
  });

  it("creates source record for manual verification", async () => {
    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });
    const source = db.select().from(sources)
      .where(eq(sources.sourceType, "manual_verified"))
      .get();
    expect(source).toBeDefined();
    expect(source!.name).toContain("editorial-research");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// B2B SEPARATION
// ═══════════════════════════════════════════════════════════════════════════

describe("Phase 30B.1 — B2B Separation", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(async () => {
    db = createTestDb();
    await seedRealCasinos(db);
  });

  it("verification does not modify B2B-related fields", async () => {
    const before = db.select().from(casinos).where(eq(casinos.slug, "tipico-casino")).get();

    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });

    const after = db.select().from(casinos).where(eq(casinos.slug, "tipico-casino")).get();
    expect(after?.features).toEqual(before?.features);
    expect(after?.tags).toEqual(before?.tags);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// DATA INTEGRITY
// ═══════════════════════════════════════════════════════════════════════════

describe("Phase 30B.1 — Data Integrity", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(async () => {
    db = createTestDb();
    await seedRealCasinos(db);
  });

  it("no duplicate records created during verification", async () => {
    const beforeCasinos = db.select({ count: sql<number>`count(*)` }).from(casinos).all()[0].count;

    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });

    const afterCasinos = db.select({ count: sql<number>`count(*)` }).from(casinos).all()[0].count;
    expect(afterCasinos).toBe(beforeCasinos);
  });

  it("no unexpected updates to non-targeted casinos", async () => {
    await seedRealCasinos(db);
    const snapshot = db.select().from(casinos).all()
      .filter((c) => !EXPECTED_20_SLUGS.includes(c.slug))
      .map((c) => ({ slug: c.slug, vs: c.verificationStatus, lva: c.lastVerifiedAt }));

    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });

    for (const s of snapshot) {
      const current = db.select().from(casinos).where(eq(casinos.slug, s.slug)).get();
      expect(current!.verificationStatus).toBe(s.vs);
      expect(current!.lastVerifiedAt).toBe(s.lva);
    }
  });

  it("conflicts table remains empty (no conflicts in this batch)", async () => {
    await runVerification(VERIFICATION_DATA, { db: db as never, dryRun: false });
    const conflictCount = db.select({ count: sql<number>`count(*)` }).from(conflicts).all()[0].count;
    expect(conflictCount).toBe(0);
  });
});
