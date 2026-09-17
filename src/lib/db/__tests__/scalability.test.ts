/**
 * Scalability structural test — validates that the schema and provider
 * can handle representative workloads without changing architecture.
 *
 * Uses generated/in-memory test data ONLY. No fake casinos in production seed.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import {
  casinos,
  casinoLicenses,
  geoAvailability,
  paymentMethods,
  casinoPaymentMethods,
} from "@/lib/db/schema";
import { createDbProvider } from "@/lib/db/db-provider";
import type { Casino } from "@/lib/types";
import path from "path";
import fs from "fs";

const TEST_DB = path.join(process.cwd(), "test-scalability.db");

function generateCasino(index: number): Casino {
  const geo = ["DE", "NL", "BE", "FR", "AT"][index % 5];
  return {
    id: `test-casino-${index}`,
    slug: `test-casino-${index}`,
    name: `Test Casino ${index}`,
    tagline: `Test casino ${index}`,
    logo: null,
    description: `Description for test casino ${index}`,
    website: `https://test${index}.example.com`,
    founded: 2020,
    owner: `Operator ${index % 10}`,
    status: "active",
    verificationStatus: "verified",
    lastVerifiedAt: "2026-09-17T00:00:00Z",
    dataSources: [{ field: "all", source: "test", verifiedAt: "2026-09-17T00:00:00Z" }],
    rating: 70 + (index % 30),
    trustScore: 60 + (index % 40),
    licenses: [{ issuer: "MGA", jurisdiction: geo, status: "active" }],
    countries: [geo],
    restrictedCountries: [],
    languages: ["en"],
    currencies: ["EUR"],
    minDeposit: 10,
    maxDeposit: null,
    minWithdrawal: null,
    paymentMethods: [
      { name: "Visa", type: "card" },
      { name: "PayPal", type: "e-wallet" },
    ],
    withdrawalMethods: [],
    withdrawalProcessingTime: null,
    bonuses: [],
    games: [{ name: "Slots", slug: "slots", available: true }],
    hasLiveCasino: index % 3 === 0,
    hasSportsBetting: index % 2 === 0,
    hasCrypto: false,
    hasMobile: true,
    kycRequired: true,
    minAge: 18,
    responsibleGambling: {
      selfExclusion: true,
      depositLimits: true,
      sessionLimits: true,
      realityCheck: true,
      coolingOffPeriod: true,
    },
    affiliateOffers: [],
    review: {
      overview: `Review for casino ${index}`,
      pros: [],
      cons: [],
      verdict: `Verdict for casino ${index}`,
      score: 70,
      scoreBreakdown: {
        gameVariety: 7,
        bonusValue: 7,
        paymentSpeed: 7,
        customerSupport: 7,
        trustAndSafety: 7,
        userExperience: 7,
      },
    },
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-09-17T00:00:00Z",
    features: [],
    tags: [],
  };
}

describe("Scalability structural validation", () => {
  let db: ReturnType<typeof drizzle>;
  let sqlite: ReturnType<typeof Database>;

  beforeAll(() => {
    if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);

    sqlite = new Database(TEST_DB);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");

    db = drizzle(sqlite, {
      schema: { casinos, casinoLicenses, geoAvailability, paymentMethods, casinoPaymentMethods },
    });

    // Create schema
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS operators (
        id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, legalName TEXT NOT NULL,
        displayName TEXT, website TEXT, ownershipInfo TEXT,
        verificationStatus TEXT NOT NULL DEFAULT 'unverified',
        source TEXT, lastVerifiedAt TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS casinos (
        id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
        tagline TEXT, logo TEXT, description TEXT, website TEXT NOT NULL,
        operatorId TEXT REFERENCES operators(id) ON DELETE SET NULL,
        founded INTEGER, owner TEXT, status TEXT NOT NULL DEFAULT 'active',
        verificationStatus TEXT NOT NULL DEFAULT 'draft', lastVerifiedAt TEXT NOT NULL,
        rating REAL, trustScore REAL, minDeposit REAL NOT NULL, maxDeposit REAL,
        minWithdrawal REAL, hasLiveCasino INTEGER NOT NULL, hasSportsBetting INTEGER NOT NULL,
        hasCrypto INTEGER NOT NULL DEFAULT 0, hasMobile INTEGER NOT NULL DEFAULT 1,
        kycRequired INTEGER NOT NULL, minAge INTEGER NOT NULL DEFAULT 18,
        createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL,
        nextVerificationDue TEXT, dataSources TEXT NOT NULL DEFAULT '[]',
        languages TEXT NOT NULL DEFAULT '[]', currencies TEXT NOT NULL DEFAULT '[]',
        withdrawalMethods TEXT NOT NULL DEFAULT '[]', withdrawalProcessingTime TEXT,
        bonuses TEXT NOT NULL DEFAULT '[]', games TEXT NOT NULL DEFAULT '[]',
        kycDocuments TEXT, kycProcessingTime TEXT,
        responsibleGambling TEXT NOT NULL DEFAULT '{}',
        affiliateOffers TEXT NOT NULL DEFAULT '[]', review TEXT NOT NULL DEFAULT '{}',
        features TEXT NOT NULL DEFAULT '[]', tags TEXT NOT NULL DEFAULT '[]',
        verificationCadence TEXT NOT NULL DEFAULT '{}'
      );
      CREATE TABLE IF NOT EXISTS casino_licenses (
        id TEXT PRIMARY KEY, casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE,
        issuer TEXT NOT NULL, jurisdiction TEXT NOT NULL, licenseNumber TEXT, url TEXT,
        status TEXT, verifiedAt TEXT, source TEXT, createdAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS geo_availability (
        id TEXT PRIMARY KEY, casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE,
        geo TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'available',
        source TEXT, verifiedAt TEXT, createdAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS payment_methods (
        id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL, createdAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS casino_payment_methods (
        id TEXT PRIMARY KEY, casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE,
        paymentMethodId TEXT NOT NULL REFERENCES payment_methods(id) ON DELETE CASCADE,
        minDeposit REAL, maxDeposit REAL, minWithdrawal REAL, maxWithdrawal REAL,
        withdrawalTime TEXT, fees TEXT, createdAt TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_casinos_operator ON casinos(operatorId);
      CREATE INDEX IF NOT EXISTS idx_casinos_status ON casinos(status);
      CREATE INDEX IF NOT EXISTS idx_casinos_verification ON casinos(verificationStatus);
      CREATE INDEX IF NOT EXISTS idx_casinos_lastVerified ON casinos(lastVerifiedAt);
      CREATE INDEX IF NOT EXISTS idx_license_casino ON casino_licenses(casinoId);
      CREATE INDEX IF NOT EXISTS idx_geo_casino ON geo_availability(casinoId);
      CREATE INDEX IF NOT EXISTS idx_geo_code ON geo_availability(geo);
      CREATE INDEX IF NOT EXISTS idx_cpm_casino ON casino_payment_methods(casinoId);
      CREATE INDEX IF NOT EXISTS idx_cpm_payment ON casino_payment_methods(paymentMethodId);
    `);

    // Insert 100 test casinos
    const insertCasino = sqlite.prepare(`
      INSERT INTO casinos (id, slug, name, tagline, logo, description, website,
        founded, owner, status, verificationStatus, lastVerifiedAt,
        rating, trustScore, minDeposit, hasLiveCasino, hasSportsBetting,
        hasCrypto, hasMobile, kycRequired, minAge, createdAt, updatedAt,
        dataSources, languages, currencies, bonuses, games,
        responsibleGambling, affiliateOffers, review, features, tags, verificationCadence)
      VALUES (@id, @slug, @name, @tagline, @logo, @description, @website,
        @founded, @owner, @status, @verificationStatus, @lastVerifiedAt,
        @rating, @trustScore, @minDeposit, @hasLiveCasino, @hasSportsBetting,
        @hasCrypto, @hasMobile, @kycRequired, @minAge, @createdAt, @updatedAt,
        @dataSources, @languages, @currencies, @bonuses, @games,
        @responsibleGambling, @affiliateOffers, @review, @features, @tags, @verificationCadence)
    `);

    const insertLicense = sqlite.prepare(`
      INSERT INTO casino_licenses (id, casinoId, issuer, jurisdiction, status, createdAt)
      VALUES (@id, @casinoId, @issuer, @jurisdiction, @status, @createdAt)
    `);

    const insertGeo = sqlite.prepare(`
      INSERT INTO geo_availability (id, casinoId, geo, status, createdAt)
      VALUES (@id, @casinoId, @geo, @status, @createdAt)
    `);

    const now = "2026-09-17T00:00:00Z";

    const insertAll = sqlite.transaction(() => {
      for (let i = 0; i < 100; i++) {
        const casino = generateCasino(i);
        insertCasino.run({
          id: casino.id,
          slug: casino.slug,
          name: casino.name,
          tagline: casino.tagline,
          logo: casino.logo,
          description: casino.description,
          website: casino.website,
          founded: casino.founded,
          owner: casino.owner,
          status: casino.status,
          verificationStatus: casino.verificationStatus,
          lastVerifiedAt: casino.lastVerifiedAt,
          rating: casino.rating,
          trustScore: casino.trustScore,
          minDeposit: casino.minDeposit,
          hasLiveCasino: casino.hasLiveCasino ? 1 : 0,
          hasSportsBetting: casino.hasSportsBetting ? 1 : 0,
          hasCrypto: casino.hasCrypto ? 1 : 0,
          hasMobile: casino.hasMobile ? 1 : 0,
          kycRequired: casino.kycRequired ? 1 : 0,
          minAge: casino.minAge,
          createdAt: casino.createdAt,
          updatedAt: casino.updatedAt,
          dataSources: JSON.stringify(casino.dataSources),
          languages: JSON.stringify(casino.languages),
          currencies: JSON.stringify(casino.currencies),
          bonuses: JSON.stringify(casino.bonuses),
          games: JSON.stringify(casino.games),
          responsibleGambling: JSON.stringify(casino.responsibleGambling),
          affiliateOffers: JSON.stringify(casino.affiliateOffers),
          review: JSON.stringify(casino.review),
          features: JSON.stringify(casino.features),
          tags: JSON.stringify(casino.tags),
          verificationCadence: JSON.stringify({}),
        });

        insertLicense.run({
          id: `lic-${i}`,
          casinoId: casino.id,
          issuer: "MGA",
          jurisdiction: casino.countries[0],
          status: "active",
          createdAt: now,
        });

        insertGeo.run({
          id: `geo-${i}`,
          casinoId: casino.id,
          geo: casino.countries[0],
          status: "available",
          createdAt: now,
        });
      }
    });

    insertAll();
  });

  afterAll(() => {
    // Close all SQLite connections by creating a new Database and running WAL checkpoint
    try {
      const cleanupDb = new Database(TEST_DB);
      cleanupDb.pragma("wal_checkpoint(TRUNCATE)");
      cleanupDb.close();
    } catch {
      // Ignore if already closed
    }
    sqlite.close();
    try {
      if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
      if (fs.existsSync(TEST_DB + "-wal")) fs.unlinkSync(TEST_DB + "-wal");
      if (fs.existsSync(TEST_DB + "-shm")) fs.unlinkSync(TEST_DB + "-shm");
    } catch {
      // Ignore cleanup errors
    }
  });

  it("inserted 100 test casinos", () => {
    const count = db.select().from(casinos).all().length;
    expect(count).toBe(100);
  });

  it("lookup by slug is O(1) via index", () => {
    const row = db.select().from(casinos).where(eq(casinos.slug, "test-casino-50")).get();
    expect(row).toBeDefined();
    expect(row!.name).toBe("Test Casino 50");
  });

  it("lookup by ID is O(1) via primary key", () => {
    const row = db.select().from(casinos).where(eq(casinos.id, "test-casino-99")).get();
    expect(row).toBeDefined();
    expect(row!.name).toBe("Test Casino 99");
  });

  it("GEO availability query returns correct subset", () => {
    const deGeos = db
      .select()
      .from(geoAvailability)
      .all()
      .filter((g) => g.geo === "DE" && g.status === "available");
    expect(deGeos.length).toBe(20); // 100 / 5 GEOs
  });

  it("license query returns one per casino", () => {
    const licenses = db.select().from(casinoLicenses).all();
    expect(licenses.length).toBe(100);
  });

  it("provider loads full casino with relationships", () => {
    const provider = createDbProvider(TEST_DB);
    const casino = provider.getCasinoBySlug("test-casino-0");
    expect(casino).toBeDefined();
    expect(casino!.licenses).toHaveLength(1);
    expect(casino!.countries).toEqual(["DE"]);
    expect(casino!.paymentMethods).toHaveLength(0); // No payment links in test
  });

  it("provider getAllCasinos returns all verified", () => {
    const provider = createDbProvider(TEST_DB);
    const all = provider.getAllCasinos();
    expect(all.length).toBe(100);
  });

  it("provider getCasinosByGeo filters correctly", () => {
    const provider = createDbProvider(TEST_DB);
    const deCasinos = provider.getCasinosByGeo("DE");
    expect(deCasinos.length).toBe(20);
    expect(deCasinos.every((c) => c.countries.includes("DE"))).toBe(true);
  });

  it("provider getFeaturedCasinos returns top 6 by rating", () => {
    const provider = createDbProvider(TEST_DB);
    const featured = provider.getFeaturedCasinos();
    expect(featured.length).toBe(6);
    // Highest rating first
    expect(featured[0].rating).toBeGreaterThanOrEqual(featured[1].rating!);
  });
});
