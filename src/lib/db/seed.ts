/**
 * Casino database import script — idempotent, repeatable.
 *
 * Usage:
 *   npx tsx src/lib/db/seed.ts
 *
 * Behavior:
 *   - Creates tables if not present (safe to re-run)
 *   - Upserts casinos by ID (no duplicates on re-run)
 *   - Populates normalized tables: operators, licenses, geo, payments
 *   - Reports: inserted, updated, skipped, invalid, duplicates
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { germanyVerifiedCasinos } from "../data/germany/index";
import { netherlandsVerifiedCasinos } from "../data/netherlands/index";
import { belgiumVerifiedCasinos } from "../data/belgium/index";
import { validateAndImport } from "../data/import";
import type { Casino } from "@/lib/types";

// ─── Configuration ────────────────────────────────────────────────────────

const DB_PATH = process.env.CASINO_DB_PATH || path.join(process.cwd(), "casino.db");

// ─── Schema DDL ───────────────────────────────────────────────────────────

const SCHEMA_SQL = `
-- Operators
CREATE TABLE IF NOT EXISTS operators (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  legalName TEXT NOT NULL,
  displayName TEXT,
  website TEXT,
  ownershipInfo TEXT,
  verificationStatus TEXT NOT NULL DEFAULT 'unverified' CHECK(verificationStatus IN ('unverified', 'verified', 'needs_review', 'archived')),
  source TEXT,
  lastVerifiedAt TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Casinos
CREATE TABLE IF NOT EXISTS casinos (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  logo TEXT,
  description TEXT,
  website TEXT NOT NULL,
  operatorId TEXT REFERENCES operators(id) ON DELETE SET NULL,
  founded INTEGER,
  owner TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'pending')),
  verificationStatus TEXT NOT NULL DEFAULT 'draft' CHECK(verificationStatus IN ('demo', 'draft', 'verified', 'needs_review', 'archived')),
  lastVerifiedAt TEXT NOT NULL,
  rating REAL,
  trustScore REAL,
  minDeposit REAL NOT NULL,
  maxDeposit REAL,
  minWithdrawal REAL,
  hasLiveCasino INTEGER NOT NULL,
  hasSportsBetting INTEGER NOT NULL,
  hasCrypto INTEGER NOT NULL DEFAULT 0,
  hasMobile INTEGER NOT NULL DEFAULT 1,
  kycRequired INTEGER NOT NULL,
  minAge INTEGER NOT NULL DEFAULT 18,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  nextVerificationDue TEXT,
  dataSources TEXT NOT NULL DEFAULT '[]',
  languages TEXT NOT NULL DEFAULT '[]',
  currencies TEXT NOT NULL DEFAULT '[]',
  withdrawalMethods TEXT NOT NULL DEFAULT '[]',
  withdrawalProcessingTime TEXT,
  bonuses TEXT NOT NULL DEFAULT '[]',
  games TEXT NOT NULL DEFAULT '[]',
  kycDocuments TEXT,
  kycProcessingTime TEXT,
  responsibleGambling TEXT NOT NULL DEFAULT '{}',
  affiliateOffers TEXT NOT NULL DEFAULT '[]',
  review TEXT NOT NULL DEFAULT '{}',
  features TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  verificationCadence TEXT NOT NULL DEFAULT '{}'
);

-- Casino Licenses (normalized)
CREATE TABLE IF NOT EXISTS casino_licenses (
  id TEXT PRIMARY KEY,
  casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE,
  issuer TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  licenseNumber TEXT,
  url TEXT,
  status TEXT CHECK(status IN ('active', 'suspended', 'revoked')),
  verifiedAt TEXT,
  source TEXT,
  createdAt TEXT NOT NULL
);

-- GEO Availability (normalized)
CREATE TABLE IF NOT EXISTS geo_availability (
  id TEXT PRIMARY KEY,
  casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE,
  geo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'restricted', 'pending')),
  source TEXT,
  verifiedAt TEXT,
  createdAt TEXT NOT NULL
);

-- Payment Methods (canonical)
CREATE TABLE IF NOT EXISTS payment_methods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK(type IN ('e-wallet', 'card', 'bank-transfer', 'crypto', 'prepaid', 'mobile')),
  createdAt TEXT NOT NULL
);

-- Casino Payment Methods (junction)
CREATE TABLE IF NOT EXISTS casino_payment_methods (
  id TEXT PRIMARY KEY,
  casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE,
  paymentMethodId TEXT NOT NULL REFERENCES payment_methods(id) ON DELETE CASCADE,
  minDeposit REAL,
  maxDeposit REAL,
  minWithdrawal REAL,
  maxWithdrawal REAL,
  withdrawalTime TEXT,
  fees TEXT,
  createdAt TEXT NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_casinos_operator ON casinos(operatorId);
CREATE INDEX IF NOT EXISTS idx_casinos_status ON casinos(status);
CREATE INDEX IF NOT EXISTS idx_casinos_verification ON casinos(verificationStatus);
CREATE INDEX IF NOT EXISTS idx_casinos_lastVerified ON casinos(lastVerifiedAt);
CREATE INDEX IF NOT EXISTS idx_license_casino ON casino_licenses(casinoId);
CREATE INDEX IF NOT EXISTS idx_license_jurisdiction ON casino_licenses(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_geo_casino ON geo_availability(casinoId);
CREATE INDEX IF NOT EXISTS idx_geo_code ON geo_availability(geo);
CREATE INDEX IF NOT EXISTS idx_cpm_casino ON casino_payment_methods(casinoId);
CREATE INDEX IF NOT EXISTS idx_cpm_payment ON casino_payment_methods(paymentMethodId);

-- Phase 30A: Import infrastructure tables
CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  sourceType TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT,
  domain TEXT,
  isActive INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sources_type ON sources(sourceType);
CREATE INDEX IF NOT EXISTS idx_sources_domain ON sources(domain);
CREATE INDEX IF NOT EXISTS idx_sources_active ON sources(isActive);

CREATE TABLE IF NOT EXISTS fact_provenance (
  id TEXT PRIMARY KEY,
  casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE,
  fieldName TEXT NOT NULL,
  sourceId TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  value TEXT,
  verificationStatus TEXT NOT NULL DEFAULT 'unverified',
  confidence TEXT NOT NULL DEFAULT 'medium',
  retrievedAt TEXT,
  checkedAt TEXT,
  expiresAt TEXT,
  reviewerId TEXT,
  notes TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_fp_casino ON fact_provenance(casinoId);
CREATE INDEX IF NOT EXISTS idx_fp_field ON fact_provenance(fieldName);
CREATE INDEX IF NOT EXISTS idx_fp_source ON fact_provenance(sourceId);
CREATE INDEX IF NOT EXISTS idx_fp_status ON fact_provenance(verificationStatus);
CREATE INDEX IF NOT EXISTS idx_fp_casino_field ON fact_provenance(casinoId, fieldName);

CREATE TABLE IF NOT EXISTS import_batches (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  sourceType TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  isDryRun INTEGER NOT NULL DEFAULT 0,
  recordsProcessed INTEGER NOT NULL DEFAULT 0,
  recordsCreated INTEGER NOT NULL DEFAULT 0,
  recordsUpdated INTEGER NOT NULL DEFAULT 0,
  recordsUnchanged INTEGER NOT NULL DEFAULT 0,
  recordsSkipped INTEGER NOT NULL DEFAULT 0,
  recordsRejected INTEGER NOT NULL DEFAULT 0,
  conflictsDetected INTEGER NOT NULL DEFAULT 0,
  validationErrors INTEGER NOT NULL DEFAULT 0,
  startedAt TEXT,
  completedAt TEXT,
  createdAt TEXT NOT NULL,
  metadata TEXT
);

CREATE TABLE IF NOT EXISTS import_records (
  id TEXT PRIMARY KEY,
  batchId TEXT NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  sourceIdentifier TEXT,
  casinoId TEXT REFERENCES casinos(id) ON DELETE SET NULL,
  casinoSlug TEXT,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'success',
  validationErrors TEXT,
  warnings TEXT,
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS conflicts (
  id TEXT PRIMARY KEY,
  casinoId TEXT NOT NULL REFERENCES casinos(id) ON DELETE CASCADE,
  batchId TEXT REFERENCES import_batches(id) ON DELETE SET NULL,
  fieldName TEXT NOT NULL,
  existingValue TEXT,
  existingSourceId TEXT REFERENCES sources(id) ON DELETE SET NULL,
  incomingValue TEXT,
  incomingSourceId TEXT REFERENCES sources(id) ON DELETE SET NULL,
  resolution TEXT NOT NULL DEFAULT 'unresolved',
  resolvedBy TEXT,
  resolvedAt TEXT,
  resolutionNotes TEXT,
  createdAt TEXT NOT NULL
);
`;

// ─── Helpers ──────────────────────────────────────────────────────────────

function serializeJson(value: unknown): string {
  return JSON.stringify(value);
}

function generateId(prefix: string, value: string): string {
  return `${prefix}_${value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/_+$/, "")}`;
}

function calculateVerificationCadence(casino: Casino): Record<string, { lastVerified: string; intervalDays: number }> {
  const cadence: Record<string, { lastVerified: string; intervalDays: number }> = {};

  const fieldCategories = [
    { fields: ["license", "verificationStatus"], intervalDays: 90 },
    { fields: ["paymentMethods", "minDeposit", "withdrawalProcessingTime"], intervalDays: 30 },
    { fields: ["bonuses", "wageringRequirement"], intervalDays: 14 },
    { fields: ["games", "providers"], intervalDays: 60 },
    { fields: ["responsibleGambling", "kycRequired"], intervalDays: 90 },
    { fields: ["owner", "founded", "website"], intervalDays: 365 },
  ];

  for (const category of fieldCategories) {
    for (const field of category.fields) {
      const dataSource = casino.dataSources.find(
        (ds) => ds.field === field || ds.field === "all"
      );
      cadence[field] = {
        lastVerified: dataSource?.verifiedAt ?? casino.lastVerifiedAt,
        intervalDays: category.intervalDays,
      };
    }
  }

  return cadence;
}

function calculateNextVerificationDue(casino: Casino): string {
  const lastVerified = new Date(casino.lastVerifiedAt);
  lastVerified.setDate(lastVerified.getDate() + 90);
  return lastVerified.toISOString();
}

// ─── Import Report ────────────────────────────────────────────────────────

interface ImportReport {
  inserted: number;
  updated: number;
  skipped: number;
  invalid: number;
  duplicateSlugs: number;
  operatorsCreated: number;
  licensesInserted: number;
  geoInserted: number;
  paymentsInserted: number;
  casinoPaymentsInserted: number;
  errors: Array<{ casinoId: string; field: string; message: string }>;
}

function printReport(report: ImportReport): void {
  console.log("─".repeat(50));
  console.log("IMPORT REPORT");
  console.log("─".repeat(50));
  console.log(`  Casinos inserted:    ${report.inserted}`);
  console.log(`  Casinos updated:     ${report.updated}`);
  console.log(`  Casinos skipped:     ${report.skipped}`);
  console.log(`  Invalid:             ${report.invalid}`);
  console.log(`  Duplicate slugs:     ${report.duplicateSlugs}`);
  console.log("");
  console.log(`  Operators created:   ${report.operatorsCreated}`);
  console.log(`  Licenses inserted:   ${report.licensesInserted}`);
  console.log(`  GEO entries:         ${report.geoInserted}`);
  console.log(`  Payment methods:     ${report.paymentsInserted}`);
  console.log(`  Casino-payment:      ${report.casinoPaymentsInserted}`);
  console.log("");

  if (report.errors.length > 0) {
    console.log("  ERRORS:");
    for (const err of report.errors) {
      console.log(`    [${err.casinoId}] ${err.field}: ${err.message}`);
    }
  }
}

// ─── Main Import ──────────────────────────────────────────────────────────

function main(): void {
  console.log("BeInCasinos Database Import (v2 — idempotent)");
  console.log("=".repeat(50));
  console.log(`Database path: ${DB_PATH}`);
  console.log("");

  // Step 1: Collect all casinos
  const allCasinos: Casino[] = [
    ...germanyVerifiedCasinos,
    ...netherlandsVerifiedCasinos,
    ...belgiumVerifiedCasinos,
  ];

  console.log(`Source data: ${allCasinos.length} casinos`);
  console.log(`  Germany: ${germanyVerifiedCasinos.length}`);
  console.log(`  Netherlands: ${netherlandsVerifiedCasinos.length}`);
  console.log(`  Belgium: ${belgiumVerifiedCasinos.length}`);
  console.log("");

  // Step 2: Validate
  const importResult = validateAndImport(allCasinos);

  if (importResult.errors.length > 0) {
    console.log(`Validation: ${importResult.errors.length} errors`);
    for (const err of importResult.errors) {
      console.log(`  [${err.index}] ${err.casinoId ?? "unknown"}.${err.field}: ${err.message}`);
    }
    console.log("");
  }

  // Step 3: Create database
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const sqlite = new Database(DB_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  // Create tables (IF NOT EXISTS — safe to re-run)
  sqlite.exec(SCHEMA_SQL);
  console.log("Schema: created/verified.");
  console.log("");

  // Step 4: Import with upsert
  const report: ImportReport = {
    inserted: 0,
    updated: 0,
    skipped: 0,
    invalid: 0,
    duplicateSlugs: 0,
    operatorsCreated: 0,
    licensesInserted: 0,
    geoInserted: 0,
    paymentsInserted: 0,
    casinoPaymentsInserted: 0,
    errors: [],
  };

  // Track unique payment methods across all casinos
  const canonicalPayments = new Map<string, { name: string; slug: string; type: string }>();

  // Prepared statements
  const upsertCasino = sqlite.prepare(`
    INSERT INTO casinos (
      id, slug, name, tagline, logo, description, website, operatorId,
      founded, owner, status, verificationStatus, lastVerifiedAt,
      rating, trustScore, minDeposit, maxDeposit, minWithdrawal,
      hasLiveCasino, hasSportsBetting, hasCrypto, hasMobile,
      kycRequired, minAge, createdAt, updatedAt,
      dataSources, languages, currencies, withdrawalMethods,
      withdrawalProcessingTime, bonuses, games, kycDocuments,
      kycProcessingTime, responsibleGambling, affiliateOffers,
      review, features, tags, nextVerificationDue, verificationCadence
    ) VALUES (
      @id, @slug, @name, @tagline, @logo, @description, @website, @operatorId,
      @founded, @owner, @status, @verificationStatus, @lastVerifiedAt,
      @rating, @trustScore, @minDeposit, @maxDeposit, @minWithdrawal,
      @hasLiveCasino, @hasSportsBetting, @hasCrypto, @hasMobile,
      @kycRequired, @minAge, @createdAt, @updatedAt,
      @dataSources, @languages, @currencies, @withdrawalMethods,
      @withdrawalProcessingTime, @bonuses, @games, @kycDocuments,
      @kycProcessingTime, @responsibleGambling, @affiliateOffers,
      @review, @features, @tags, @nextVerificationDue, @verificationCadence
    )
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      slug = excluded.slug,
      tagline = excluded.tagline,
      logo = excluded.logo,
      description = excluded.description,
      website = excluded.website,
      founded = excluded.founded,
      owner = excluded.owner,
      status = excluded.status,
      verificationStatus = excluded.verificationStatus,
      lastVerifiedAt = excluded.lastVerifiedAt,
      rating = excluded.rating,
      trustScore = excluded.trustScore,
      minDeposit = excluded.minDeposit,
      maxDeposit = excluded.maxDeposit,
      minWithdrawal = excluded.minWithdrawal,
      hasLiveCasino = excluded.hasLiveCasino,
      hasSportsBetting = excluded.hasSportsBetting,
      hasCrypto = excluded.hasCrypto,
      hasMobile = excluded.hasMobile,
      kycRequired = excluded.kycRequired,
      minAge = excluded.minAge,
      updatedAt = excluded.updatedAt,
      dataSources = excluded.dataSources,
      languages = excluded.languages,
      currencies = excluded.currencies,
      withdrawalMethods = excluded.withdrawalMethods,
      withdrawalProcessingTime = excluded.withdrawalProcessingTime,
      bonuses = excluded.bonuses,
      games = excluded.games,
      kycDocuments = excluded.kycDocuments,
      kycProcessingTime = excluded.kycProcessingTime,
      responsibleGambling = excluded.responsibleGambling,
      affiliateOffers = excluded.affiliateOffers,
      review = excluded.review,
      features = excluded.features,
      tags = excluded.tags,
      nextVerificationDue = excluded.nextVerificationDue,
      verificationCadence = excluded.verificationCadence
  `);

  const insertLicense = sqlite.prepare(`
    INSERT OR IGNORE INTO casino_licenses (id, casinoId, issuer, jurisdiction, licenseNumber, url, status, verifiedAt, source, createdAt)
    VALUES (@id, @casinoId, @issuer, @jurisdiction, @licenseNumber, @url, @status, @verifiedAt, @source, @createdAt)
  `);

  const insertGeo = sqlite.prepare(`
    INSERT OR IGNORE INTO geo_availability (id, casinoId, geo, status, source, verifiedAt, createdAt)
    VALUES (@id, @casinoId, @geo, @status, @source, @verifiedAt, @createdAt)
  `);

  const upsertPaymentMethod = sqlite.prepare(`
    INSERT OR IGNORE INTO payment_methods (id, name, slug, type, createdAt)
    VALUES (@id, @name, @slug, @type, @createdAt)
  `);

  const insertCasinoPayment = sqlite.prepare(`
    INSERT OR IGNORE INTO casino_payment_methods (id, casinoId, paymentMethodId, minDeposit, maxDeposit, minWithdrawal, maxWithdrawal, withdrawalTime, fees, createdAt)
    VALUES (@id, @casinoId, @paymentMethodId, @minDeposit, @maxDeposit, @minWithdrawal, @maxWithdrawal, @withdrawalTime, @fees, @createdAt)
  `);

  const checkExistingCasino = sqlite.prepare("SELECT id FROM casinos WHERE id = @id");
  const deleteLicenses = sqlite.prepare("DELETE FROM casino_licenses WHERE casinoId = @casinoId");
  const deleteGeo = sqlite.prepare("DELETE FROM geo_availability WHERE casinoId = @casinoId");
  const deleteCasinoPayments = sqlite.prepare("DELETE FROM casino_payment_methods WHERE casinoId = @casinoId");

  const importAll = sqlite.transaction((casinosToImport: Casino[]) => {
    const now = new Date().toISOString();

    for (const casino of casinosToImport) {
      const existing = checkExistingCasino.get({ id: casino.id }) as { id: string } | undefined;

      try {
        // Upsert casino
        upsertCasino.run({
          id: casino.id,
          slug: casino.slug,
          name: casino.name,
          tagline: casino.tagline ?? null,
          logo: casino.logo ?? null,
          description: casino.description ?? null,
          website: casino.website,
          operatorId: null,
          founded: casino.founded ?? null,
          owner: casino.owner ?? null,
          status: casino.status,
          verificationStatus: casino.verificationStatus,
          lastVerifiedAt: casino.lastVerifiedAt,
          rating: casino.rating ?? null,
          trustScore: casino.trustScore ?? null,
          minDeposit: casino.minDeposit,
          maxDeposit: casino.maxDeposit ?? null,
          minWithdrawal: casino.minWithdrawal ?? null,
          hasLiveCasino: casino.hasLiveCasino ? 1 : 0,
          hasSportsBetting: casino.hasSportsBetting ? 1 : 0,
          hasCrypto: casino.hasCrypto ? 1 : 0,
          hasMobile: casino.hasMobile ? 1 : 0,
          kycRequired: casino.kycRequired ? 1 : 0,
          minAge: casino.minAge,
          createdAt: casino.createdAt,
          updatedAt: now,
          dataSources: serializeJson(casino.dataSources),
          languages: serializeJson(casino.languages),
          currencies: serializeJson(casino.currencies),
          withdrawalMethods: serializeJson(casino.withdrawalMethods ?? []),
          withdrawalProcessingTime: casino.withdrawalProcessingTime ?? null,
          bonuses: serializeJson(casino.bonuses),
          games: serializeJson(casino.games),
          kycDocuments: casino.kycDocuments ? serializeJson(casino.kycDocuments) : null,
          kycProcessingTime: casino.kycProcessingTime ?? null,
          responsibleGambling: serializeJson(casino.responsibleGambling),
          affiliateOffers: serializeJson(casino.affiliateOffers),
          review: serializeJson(casino.review),
          features: serializeJson(casino.features ?? []),
          tags: serializeJson(casino.tags ?? []),
          nextVerificationDue: calculateNextVerificationDue(casino),
          verificationCadence: serializeJson(calculateVerificationCadence(casino)),
        });

        if (existing) {
          report.updated++;
          // Clear old normalized data for re-insertion
          deleteLicenses.run({ casinoId: casino.id });
          deleteGeo.run({ casinoId: casino.id });
          deleteCasinoPayments.run({ casinoId: casino.id });
        } else {
          report.inserted++;
        }

        // Insert licenses
        for (const license of casino.licenses) {
          const licenseId = generateId("lic", `${casino.id}_${license.issuer}_${license.jurisdiction}`);
          insertLicense.run({
            id: licenseId,
            casinoId: casino.id,
            issuer: license.issuer,
            jurisdiction: license.jurisdiction,
            licenseNumber: license.licenseNumber ?? null,
            url: license.url ?? null,
            status: license.status ?? null,
            verifiedAt: license.verifiedAt ?? null,
            source: null,
            createdAt: now,
          });
          report.licensesInserted++;
        }

        // Insert GEO availability
        for (const geo of casino.countries) {
          const geoId = generateId("geo", `${casino.id}_${geo}`);
          insertGeo.run({
            id: geoId,
            casinoId: casino.id,
            geo,
            status: "available",
            source: null,
            verifiedAt: casino.lastVerifiedAt,
            createdAt: now,
          });
          report.geoInserted++;
        }

        for (const geo of casino.restrictedCountries ?? []) {
          const geoId = generateId("geo", `${casino.id}_${geo}_restricted`);
          insertGeo.run({
            id: geoId,
            casinoId: casino.id,
            geo,
            status: "restricted",
            source: null,
            verifiedAt: casino.lastVerifiedAt,
            createdAt: now,
          });
          report.geoInserted++;
        }

        // Process payment methods
        for (const pm of casino.paymentMethods) {
          // Track canonical payment methods
          const pmSlug = pm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          if (!canonicalPayments.has(pm.name)) {
            canonicalPayments.set(pm.name, { name: pm.name, slug: pmSlug, type: pm.type });
          }

          // We'll insert canonical payment methods after the main loop
          // For now, just track them
        }

      } catch (err) {
        report.invalid++;
        report.errors.push({
          casinoId: casino.id,
          field: "general",
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }
  });

  importAll(importResult.casinos);

  // Step 5: Insert canonical payment methods
  const now = new Date().toISOString();
  for (const [, pm] of canonicalPayments) {
    const pmId = generateId("pm", pm.slug);
    upsertPaymentMethod.run({
      id: pmId,
      name: pm.name,
      slug: pm.slug,
      type: pm.type,
      createdAt: now,
    });
    report.paymentsInserted++;
  }

  // Step 6: Link casinos to payment methods
  const getPaymentMethodId = sqlite.prepare("SELECT id FROM payment_methods WHERE name = @name");

  for (const casino of importResult.casinos) {
    for (const pm of casino.paymentMethods) {
      const pmRow = getPaymentMethodId.get({ name: pm.name }) as { id: string } | undefined;
      if (pmRow) {
        const cpmId = generateId("cpm", `${casino.id}_${pmRow.id}`);
        insertCasinoPayment.run({
          id: cpmId,
          casinoId: casino.id,
          paymentMethodId: pmRow.id,
          minDeposit: pm.minDeposit ?? null,
          maxDeposit: pm.maxDeposit ?? null,
          minWithdrawal: pm.minWithdrawal ?? null,
          maxWithdrawal: pm.maxWithdrawal ?? null,
          withdrawalTime: pm.withdrawalTime ?? null,
          fees: pm.fees ?? null,
          createdAt: now,
        });
        report.casinoPaymentsInserted++;
      }
    }
  }

  // Step 7: Report
  printReport(report);

  // Verify counts
  const counts = {
    casinos: (sqlite.prepare("SELECT COUNT(*) as c FROM casinos").get() as { c: number }).c,
    operators: (sqlite.prepare("SELECT COUNT(*) as c FROM operators").get() as { c: number }).c,
    licenses: (sqlite.prepare("SELECT COUNT(*) as c FROM casino_licenses").get() as { c: number }).c,
    geo: (sqlite.prepare("SELECT COUNT(*) as c FROM geo_availability").get() as { c: number }).c,
    payments: (sqlite.prepare("SELECT COUNT(*) as c FROM payment_methods").get() as { c: number }).c,
    casinoPayments: (sqlite.prepare("SELECT COUNT(*) as c FROM casino_payment_methods").get() as { c: number }).c,
  };

  console.log("Database totals:");
  console.log(`  Casinos:              ${counts.casinos}`);
  console.log(`  Operators:            ${counts.operators}`);
  console.log(`  Casino licenses:      ${counts.licenses}`);
  console.log(`  GEO availability:     ${counts.geo}`);
  console.log(`  Payment methods:      ${counts.payments}`);
  console.log(`  Casino-payment links: ${counts.casinoPayments}`);
  console.log("");

  // GEO breakdown
  const geoCounts = sqlite.prepare(`
    SELECT geo, COUNT(*) as c FROM geo_availability
    WHERE status = 'available'
    GROUP BY geo ORDER BY c DESC
  `).all() as Array<{ geo: string; c: number }>;

  console.log("GEO availability:");
  for (const g of geoCounts) {
    console.log(`  ${g.geo}: ${g.c} casinos`);
  }

  sqlite.close();
  console.log("");
  console.log(`Database: ${DB_PATH}`);
  console.log("To use: DATABASE_PROVIDER=sqlite npm run dev");
}

main();
