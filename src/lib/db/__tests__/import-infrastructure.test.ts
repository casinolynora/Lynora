/**
 * Phase 30A — Data Import Foundation Tests
 */
import { describe, it, expect, beforeEach } from "vitest";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {
  casinos, casinoLicenses, geoAvailability, casinoPaymentMethods,
  paymentMethods, sources, factProvenance, importBatches, importRecords,
  conflicts,
} from "@/lib/db/schema";
import {
  validateUrlSecurity, normalizeSlug, getSourcePriority, isHigherPriority,
  getFreshnessStatus, checkDuplicate, detectConflict,
  validateImportCasino, validateBatch, FRESHNESS_THRESHOLDS,
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

// URL Security
describe("URL Security", () => {
  it("allows valid HTTPS URLs", () => {
    expect(validateUrlSecurity("https://example.com").valid).toBe(true);
    expect(validateUrlSecurity("https://casino.com/path?q=1").valid).toBe(true);
  });
  it("rejects HTTP URLs", () => {
    expect(validateUrlSecurity("http://example.com").valid).toBe(false);
  });
  it("rejects javascript: URLs", () => {
    expect(validateUrlSecurity("javascript:alert(1)").valid).toBe(false);
  });
  it("rejects data: URLs", () => {
    expect(validateUrlSecurity("data:text/html,<script>alert(1)</script>").valid).toBe(false);
  });
  it("rejects file: URLs", () => {
    expect(validateUrlSecurity("file:///etc/passwd").valid).toBe(false);
  });
  it("rejects vbscript: URLs", () => {
    expect(validateUrlSecurity("vbscript:MsgBox(1)").valid).toBe(false);
  });
  it("rejects blob: URLs", () => {
    expect(validateUrlSecurity("blob:https://example.com/uuid").valid).toBe(false);
  });
  it("rejects invalid URL formats", () => {
    expect(validateUrlSecurity("not-a-url").valid).toBe(false);
    expect(validateUrlSecurity("").valid).toBe(false);
  });
});

// Slug Policy
describe("Slug Policy", () => {
  it("normalizes to lowercase", () => {
    expect(normalizeSlug("Casino-X")).toBe("casino-x");
    expect(normalizeSlug("CASINO")).toBe("casino");
  });
  it("replaces non-alphanumeric with hyphens", () => {
    expect(normalizeSlug("Casino X Online")).toBe("casino-x-online");
  });
  it("collapses multiple hyphens", () => {
    expect(normalizeSlug("Casino---X")).toBe("casino-x");
  });
  it("removes leading/trailing hyphens", () => {
    expect(normalizeSlug("-casino-")).toBe("casino");
  });
  it("trims whitespace", () => {
    expect(normalizeSlug("  casino  ")).toBe("casino");
  });
  it("handles already normalized slugs", () => {
    expect(normalizeSlug("casino-x")).toBe("casino-x");
  });
});

// Source Priority
describe("Source Priority", () => {
  it("regulator has highest priority", () => {
    expect(getSourcePriority("regulator")).toBe(1);
  });
  it("government_registry is second", () => {
    expect(getSourcePriority("government_registry")).toBe(2);
  });
  it("official_operator_website is third", () => {
    expect(getSourcePriority("official_operator_website")).toBe(3);
  });
  it("manual_verified is lower", () => {
    expect(getSourcePriority("manual_verified")).toBe(5);
  });
  it("trusted_third_party is lower", () => {
    expect(getSourcePriority("trusted_third_party")).toBe(6);
  });
  it("other has lowest", () => {
    expect(getSourcePriority("other")).toBe(7);
  });
  it("unknown gets 99", () => {
    expect(getSourcePriority("unknown")).toBe(99);
  });
  it("isHigherPriority works", () => {
    expect(isHigherPriority("regulator", "trusted_third_party")).toBe(true);
    expect(isHigherPriority("trusted_third_party", "regulator")).toBe(false);
  });
});

// Freshness Model
describe("Freshness Model", () => {
  it("returns fresh for recent dates", () => {
    const recent = new Date();
    recent.setDate(recent.getDate() - 30);
    expect(getFreshnessStatus(recent.toISOString())).toBe("fresh");
  });
  it("returns needs_review for older dates", () => {
    const older = new Date();
    older.setDate(older.getDate() - 120);
    expect(getFreshnessStatus(older.toISOString())).toBe("needs_review");
  });
  it("returns stale for very old dates", () => {
    const old = new Date();
    old.setDate(old.getDate() - 400);
    expect(getFreshnessStatus(old.toISOString())).toBe("stale");
  });
  it("freshness thresholds are defined", () => {
    expect(FRESHNESS_THRESHOLDS.fresh).toBe(90);
    expect(FRESHNESS_THRESHOLDS.needsReview).toBe(180);
    expect(FRESHNESS_THRESHOLDS.stale).toBe(365);
  });
});

// Duplicate Detection
describe("Duplicate Detection", () => {
  const existing = [
    { id: "c1", slug: "casino-alpha", name: "Casino Alpha", website: "https://alpha.com", owner: "Alpha Ltd" },
    { id: "c2", slug: "casino-beta", name: "Casino Beta", website: "https://beta.com", owner: null },
  ];
  it("detects slug match", () => {
    const result = checkDuplicate({ slug: "casino-alpha", website: "https://new.com", name: "New", source: { sourceType: "other", name: "test" }, minDeposit: 10, licenses: [{ issuer: "MGA", jurisdiction: "MT" }] } as never, existing);
    expect(result.isDuplicate).toBe(true);
    expect(result.matchType).toBe("slug");
    expect(result.confidence).toBe("high");
  });
  it("detects website match", () => {
    const result = checkDuplicate({ slug: "new-casino", website: "https://alpha.com", name: "New", source: { sourceType: "other", name: "test" }, minDeposit: 10, licenses: [{ issuer: "MGA", jurisdiction: "MT" }] } as never, existing);
    expect(result.isDuplicate).toBe(true);
    expect(result.matchType).toBe("website");
    expect(result.confidence).toBe("high");
  });
  it("detects name+owner match", () => {
    const result = checkDuplicate({ slug: "new-casino", website: "https://new.com", name: "Casino Alpha", owner: "Alpha Ltd", source: { sourceType: "other", name: "test" }, minDeposit: 10, licenses: [{ issuer: "MGA", jurisdiction: "MT" }] } as never, existing);
    expect(result.isDuplicate).toBe(true);
    expect(result.matchType).toBe("name_operator");
    expect(result.confidence).toBe("medium");
  });
  it("returns no duplicate for new casino", () => {
    const result = checkDuplicate({ slug: "brand-new", website: "https://brand-new.com", name: "Brand New", source: { sourceType: "other", name: "test" }, minDeposit: 10, licenses: [{ issuer: "MGA", jurisdiction: "MT" }] } as never, existing);
    expect(result.isDuplicate).toBe(false);
  });
});

// Conflict Detection
describe("Conflict Detection", () => {
  it("no conflict when values are same", () => {
    const result = detectConflict("minDeposit", "20", "20", 3, 5);
    expect(result.resolution).toBe("allow_update");
  });
  it("no conflict when existing is null", () => {
    const result = detectConflict("minDeposit", null, "20", 3, 5);
    expect(result.resolution).toBe("allow_update");
  });
  it("preserves existing when source is higher priority", () => {
    const result = detectConflict("minDeposit", "20", "10", 1, 5);
    expect(result.resolution).toBe("preserve_existing");
  });
  it("allows update when incoming source is higher priority", () => {
    const result = detectConflict("minDeposit", "20", "10", 5, 1);
    expect(result.resolution).toBe("allow_update");
  });
  it("allows update when equal priority", () => {
    const result = detectConflict("minDeposit", "20", "10", 3, 3);
    expect(result.resolution).toBe("allow_update");
  });
});

// Import Validation
describe("Import Validation", () => {
  it("validates a correct import casino", () => {
    const result = validateImportCasino({
      name: "Test Casino",
      slug: "test-casino",
      website: "https://test.com",
      minDeposit: 20,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Test Source" },
    });
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.errors.length).toBe(0);
  });
  it("rejects missing required fields", () => {
    const result = validateImportCasino({
      name: "",
      slug: "",
      website: "not-a-url",
      minDeposit: -10,
      licenses: [],
      source: { sourceType: "other", name: "" },
    });
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
  it("rejects invalid slug format", () => {
    const result = validateImportCasino({
      name: "Test",
      slug: "INVALID SLUG!",
      website: "https://test.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Test" },
    });
    expect(result.success).toBe(false);
  });
  it("rejects malicious URLs", () => {
    const result = validateImportCasino({
      name: "Test",
      slug: "test",
      website: "javascript:alert(1)",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Test" },
    });
    expect(result.success).toBe(false);
  });
  it("warns on non-normalized slug", () => {
    const result = validateImportCasino({
      name: "Test",
      slug: "Test-Casino",
      website: "https://test.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Test" },
    });
    const slugWarning = result.errors.find((e) => e.field === "slug");
    expect(slugWarning).toBeDefined();
    expect(slugWarning?.severity).toBe("warning");
  });
});

// Import Engine Integration
describe("Import Engine", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(() => {
    db = createTestDb();
  });

  it("creates new casinos from valid input", async () => {
    const result = await runImport([{
      name: "New Casino",
      slug: "new-casino",
      website: "https://newcasino.com",
      minDeposit: 20,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      geo: [{ geo: "DE", status: "available" }],
      paymentMethods: [{ name: "Visa", type: "card" }],
      source: { sourceType: "official_operator_website", name: "New Casino Official", url: "https://newcasino.com" },
    }], {
      db: db as never,
      dryRun: false,
      source: "New Casino Official",
      sourceType: "official_operator_website",
    });

    expect(result.status).toBe("completed");
    expect(result.recordsCreated).toBe(1);
    expect(result.recordsProcessed).toBe(1);

    // Verify casino was created
    const casinoRow = db.select().from(casinos).where(eq(casinos.slug, "new-casino")).get();
    expect(casinoRow).toBeDefined();
    expect(casinoRow?.name).toBe("New Casino");
    expect(casinoRow?.verificationStatus).toBe("draft");
  });

  it("creates batch and record audit trail", async () => {
    await runImport([{
      name: "Audit Trail Casino",
      slug: "audit-trail",
      website: "https://audit.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Audit Test" },
    }], {
      db: db as never,
      dryRun: false,
      source: "Audit Test",
      sourceType: "other",
    });

    // Check batch was created
    const batch = db.select().from(importBatches).get();
    expect(batch).toBeDefined();
    expect(batch?.status).toBe("completed");
    expect(batch?.recordsCreated).toBe(1);

    // Check import record was created
    const record = db.select().from(importRecords).get();
    expect(record).toBeDefined();
    expect(record?.action).toBe("created");
  });

  it("dry run does not modify database", async () => {
    const result = await runImport([{
      name: "Dry Run Casino",
      slug: "dry-run",
      website: "https://dryrun.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Dry Run Test" },
    }], {
      db: db as never,
      dryRun: true,
      source: "Dry Run Test",
      sourceType: "other",
    });

    expect(result.dryRun).toBe(true);
    expect(result.recordsCreated).toBe(1);

    // Verify nothing was actually created
    const casinoRow = db.select().from(casinos).where(eq(casinos.slug, "dry-run")).get();
    expect(casinoRow).toBeUndefined();

    // Verify no batch was created
    const batch = db.select().from(importBatches).get();
    expect(batch).toBeUndefined();
  });

  it("processes duplicate casinos as updates", async () => {
    // First import
    await runImport([{
      name: "Dup Casino",
      slug: "dup-casino",
      website: "https://dup.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Test" },
    }], {
      db: db as never,
      dryRun: false,
      source: "Test",
      sourceType: "other",
    });

    // Second import (duplicate — should update, not skip)
    const result = await runImport([{
      name: "Dup Casino Updated",
      slug: "dup-casino",
      website: "https://dup.com",
      minDeposit: 25,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Test" },
    }], {
      db: db as never,
      dryRun: false,
      source: "Test",
      sourceType: "other",
    });

    expect(result.recordsProcessed).toBe(1);
    expect(result.recordsCreated).toBe(0);
    // The duplicate is processed as an update or unchanged
    expect(result.recordsUpdated + result.recordsUnchanged).toBe(1);
  });

  it("rejects invalid records", async () => {
    const result = await runImport([{
      name: "",
      slug: "",
      website: "not-a-url",
      minDeposit: -10,
      licenses: [],
      source: { sourceType: "other", name: "" },
    }], {
      db: db as never,
      dryRun: false,
      source: "Test",
      sourceType: "other",
    });

    expect(result.recordsRejected).toBe(1);
    expect(result.validationErrors).toBe(1);
  });

  it("preserves manually verified records from updates", async () => {
    // Create a verified casino
    const now = new Date().toISOString();
    db.insert(casinos).values({
      id: "verified-casino",
      slug: "verified-casino",
      name: "Verified Casino",
      website: "https://verified.com",
      status: "active",
      verificationStatus: "verified",
      lastVerifiedAt: now,
      minDeposit: 20,
      hasLiveCasino: false,
      hasSportsBetting: false,
      hasCrypto: false,
      hasMobile: true,
      kycRequired: true,
      minAge: 18,
      languages: [],
      currencies: [],
      bonuses: [],
      games: [],
      responsibleGambling: { selfExclusion: false, depositLimits: false, sessionLimits: false, realityCheck: false, coolingOffPeriod: false },
      affiliateOffers: [],
      review: { overview: "", pros: [], cons: [], verdict: "", score: null, scoreBreakdown: null },
      dataSources: [],
      createdAt: now,
      updatedAt: now,
    }).run();

    // Try to update with different values
    const result = await runImport([{
      name: "Verified Casino",
      slug: "verified-casino",
      website: "https://verified.com",
      minDeposit: 5,
      owner: "Different Owner",
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "trusted_third_party", name: "Third Party" },
    }], {
      db: db as never,
      dryRun: false,
      source: "Third Party",
      sourceType: "trusted_third_party",
    });

    // Should be unchanged because it's verified
    expect(result.recordsUnchanged).toBe(1);

    // Verify original values preserved
    const casinoRow = db.select().from(casinos).where(eq(casinos.slug, "verified-casino")).get();
    expect(casinoRow?.minDeposit).toBe(20);
    expect(casinoRow?.owner).toBeNull();
  });

  it("handles idempotent imports", async () => {
    const data = [{
      name: "Idempotent Casino",
      slug: "idempotent",
      website: "https://idempotent.com",
      minDeposit: 20,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "other", name: "Test" },
    }];

    const result1 = await runImport(data, { db: db as never, dryRun: false, source: "Test", sourceType: "other" });
    expect(result1.recordsCreated).toBe(1);

    const result2 = await runImport(data, { db: db as never, dryRun: false, source: "Test", sourceType: "other" });
    // Duplicate is processed as update/unchanged, not skipped
    expect(result2.recordsProcessed).toBe(1);
    expect(result2.recordsCreated).toBe(0);
    expect(result2.recordsUpdated + result2.recordsUnchanged).toBe(1);
  });

  it("records provenance for new casinos", async () => {
    await runImport([{
      name: "Provenance Casino",
      slug: "provenance",
      website: "https://provenance.com",
      minDeposit: 10,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      source: { sourceType: "regulator", name: "MGA Official", url: "https://mga.mt" },
    }], {
      db: db as never,
      dryRun: false,
      source: "MGA Official",
      sourceType: "regulator",
    });

    // Check source was created
    const source = db.select().from(sources).where(eq(sources.name, "MGA Official")).get();
    expect(source).toBeDefined();
    expect(source?.sourceType).toBe("regulator");

    // Check provenance was created
    const prov = db.select().from(factProvenance).get();
    expect(prov).toBeDefined();
    expect(prov?.verificationStatus).toBe("sourced");
  });

  it("creates licenses, GEO, and payment records", async () => {
    await runImport([{
      name: "Full Casino",
      slug: "full-casino",
      website: "https://full.com",
      minDeposit: 20,
      licenses: [{ issuer: "MGA", jurisdiction: "MT", licenseNumber: "123", status: "active" }],
      geo: [{ geo: "DE", status: "available" }, { geo: "NL", status: "restricted" }],
      paymentMethods: [{ name: "Visa", type: "card" }, { name: "PayPal", type: "e-wallet" }],
      source: { sourceType: "other", name: "Test" },
    }], {
      db: db as never,
      dryRun: false,
      source: "Test",
      sourceType: "other",
    });

    const casino = db.select().from(casinos).where(eq(casinos.slug, "full-casino")).get();
    expect(casino).toBeDefined();

    const licenses = db.select().from(casinoLicenses).where(eq(casinoLicenses.casinoId, casino!.id)).all();
    expect(licenses.length).toBe(1);
    expect(licenses[0].licenseNumber).toBe("123");

    const geo = db.select().from(geoAvailability).where(eq(geoAvailability.casinoId, casino!.id)).all();
    expect(geo.length).toBe(2);

    const pm = db.select().from(casinoPaymentMethods).where(eq(casinoPaymentMethods.casinoId, casino!.id)).all();
    expect(pm.length).toBe(2);
  });
});

// Batch Validation
describe("Batch Validation", () => {
  it("separates valid and invalid records", () => {
    const raw = [
      { name: "Good", slug: "good", website: "https://good.com", minDeposit: 10, licenses: [{ issuer: "MGA", jurisdiction: "MT" }], source: { sourceType: "other", name: "Test" } },
      { name: "", slug: "", website: "bad", minDeposit: -1, licenses: [], source: { sourceType: "other", name: "" } },
    ];
    const result = validateBatch(raw, []);
    expect(result.valid.length).toBe(1);
    expect(result.invalid.length).toBe(1);
  });
  it("detects duplicates within batch", () => {
    const raw = [
      { name: "A", slug: "same-slug", website: "https://a.com", minDeposit: 10, licenses: [{ issuer: "MGA", jurisdiction: "MT" }], source: { sourceType: "other", name: "Test" } },
      { name: "B", slug: "same-slug", website: "https://b.com", minDeposit: 10, licenses: [{ issuer: "MGA", jurisdiction: "MT" }], source: { sourceType: "other", name: "Test" } },
    ];
    const result = validateBatch(raw, []);
    expect(result.valid.length).toBe(1);
    expect(result.invalid.length).toBe(1);
  });
  it("detects duplicates against existing data", () => {
    const raw = [
      { name: "Existing", slug: "existing-casino", website: "https://existing.com", minDeposit: 10, licenses: [{ issuer: "MGA", jurisdiction: "MT" }], source: { sourceType: "other", name: "Test" } },
    ];
    const existing = [{ id: "c1", slug: "existing-casino", name: "Existing", website: "https://existing.com", owner: null }];
    const result = validateBatch(raw, existing);
    expect(result.duplicates.length).toBe(1);
  });
});
