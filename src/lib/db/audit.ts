/**
 * Data quality audit script for the 49 seeded casinos.
 *
 * Usage:
 *   npx tsx src/lib/db/audit.ts
 *
 * Checks:
 * - Duplicate IDs, slugs, names
 * - Missing required fields
 * - Malformed URLs
 * - Invalid GEO codes
 * - Inconsistent casing
 * - Impossible numeric values
 * - License data quality
 * - Payment method consistency
 */

import { germanyVerifiedCasinos } from "../data/germany/index";
import { netherlandsVerifiedCasinos } from "../data/netherlands/index";
import { belgiumVerifiedCasinos } from "../data/belgium/index";
import type { Casino } from "@/lib/types";

interface AuditIssue {
  casinoId: string;
  field: string;
  severity: "error" | "warning";
  message: string;
}

const VALID_GEOS = ["DE", "FR", "NL", "BE", "AT", "IT", "CH", "IE", "INT"];
const VALID_URL_PREFIXES = ["https://", "http://"];

function audit(): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const allCasinos: Casino[] = [
    ...germanyVerifiedCasinos,
    ...netherlandsVerifiedCasinos,
    ...belgiumVerifiedCasinos,
  ];

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenNames = new Map<string, string>(); // name -> first casinoId

  for (const casino of allCasinos) {
    // Duplicate checks
    if (seenIds.has(casino.id)) {
      issues.push({ casinoId: casino.id, field: "id", severity: "error", message: `Duplicate ID: ${casino.id}` });
    }
    seenIds.add(casino.id);

    if (seenSlugs.has(casino.slug)) {
      issues.push({ casinoId: casino.id, field: "slug", severity: "error", message: `Duplicate slug: ${casino.slug}` });
    }
    seenSlugs.add(casino.slug);

    const normalizedName = casino.name.toLowerCase().trim();
    if (seenNames.has(normalizedName)) {
      issues.push({
        casinoId: casino.id,
        field: "name",
        severity: "warning",
        message: `Similar name to ${seenNames.get(normalizedName)}: "${casino.name}"`,
      });
    }
    seenNames.set(normalizedName, casino.id);

    // Required fields
    if (!casino.id) issues.push({ casinoId: "unknown", field: "id", severity: "error", message: "Missing ID" });
    if (!casino.slug) issues.push({ casinoId: casino.id, field: "slug", severity: "error", message: "Missing slug" });
    if (!casino.name) issues.push({ casinoId: casino.id, field: "name", severity: "error", message: "Missing name" });
    if (!casino.website) issues.push({ casinoId: casino.id, field: "website", severity: "error", message: "Missing website" });

    // URL validation
    if (casino.website && !VALID_URL_PREFIXES.some((p) => casino.website.startsWith(p))) {
      issues.push({ casinoId: casino.id, field: "website", severity: "error", message: `Invalid URL: ${casino.website}` });
    }
    if (casino.logo && !casino.logo.startsWith("http")) {
      issues.push({ casinoId: casino.id, field: "logo", severity: "warning", message: `Invalid logo URL: ${casino.logo}` });
    }

    // GEO validation
    for (const geo of casino.countries) {
      if (!VALID_GEOS.includes(geo)) {
        issues.push({ casinoId: casino.id, field: "countries", severity: "error", message: `Invalid GEO: ${geo}` });
      }
    }

    // Numeric validation
    if (casino.minDeposit < 0) {
      issues.push({ casinoId: casino.id, field: "minDeposit", severity: "error", message: `Negative minDeposit: ${casino.minDeposit}` });
    }
    if (casino.maxDeposit !== null && casino.maxDeposit !== undefined && casino.maxDeposit < casino.minDeposit) {
      issues.push({ casinoId: casino.id, field: "maxDeposit", severity: "warning", message: `maxDeposit (${casino.maxDeposit}) < minDeposit (${casino.minDeposit})` });
    }

    // License validation
    if (casino.verificationStatus === "verified" && casino.licenses.length === 0) {
      issues.push({ casinoId: casino.id, field: "licenses", severity: "error", message: "Verified casino has no licenses" });
    }
    for (const license of casino.licenses) {
      if (!license.issuer) issues.push({ casinoId: casino.id, field: "licenses.issuer", severity: "error", message: "License missing issuer" });
      if (!license.jurisdiction) issues.push({ casinoId: casino.id, field: "licenses.jurisdiction", severity: "error", message: "License missing jurisdiction" });
    }

    // Payment method validation
    if (casino.paymentMethods.length === 0) {
      issues.push({ casinoId: casino.id, field: "paymentMethods", severity: "warning", message: "No payment methods listed" });
    }

    // Data source validation for verified casinos
    if (casino.verificationStatus === "verified" && casino.dataSources.length === 0) {
      issues.push({ casinoId: casino.id, field: "dataSources", severity: "warning", message: "Verified casino has no data sources" });
    }

    // Timestamp validation
    if (isNaN(new Date(casino.lastVerifiedAt).getTime())) {
      issues.push({ casinoId: casino.id, field: "lastVerifiedAt", severity: "error", message: `Invalid lastVerifiedAt: ${casino.lastVerifiedAt}` });
    }
    if (isNaN(new Date(casino.createdAt).getTime())) {
      issues.push({ casinoId: casino.id, field: "createdAt", severity: "error", message: `Invalid createdAt: ${casino.createdAt}` });
    }
    if (isNaN(new Date(casino.updatedAt).getTime())) {
      issues.push({ casinoId: casino.id, field: "updatedAt", severity: "error", message: `Invalid updatedAt: ${casino.updatedAt}` });
    }

    // ID format validation
    if (casino.id.includes(" ")) {
      issues.push({ casinoId: casino.id, field: "id", severity: "warning", message: "ID contains spaces" });
    }
    if (casino.slug.includes(" ")) {
      issues.push({ casinoId: casino.id, field: "slug", severity: "warning", message: "Slug contains spaces" });
    }
  }

  return issues;
}

function main() {
  console.log("BeInCasinos Data Quality Audit");
  console.log("=".repeat(50));

  const allCasinos = [
    ...germanyVerifiedCasinos,
    ...netherlandsVerifiedCasinos,
    ...belgiumVerifiedCasinos,
  ];

  console.log(`Auditing ${allCasinos.length} casinos...`);
  console.log("");

  const issues = audit();

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  console.log(`Errors:   ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log("");

  if (errors.length > 0) {
    console.log("ERRORS:");
    for (const issue of errors) {
      console.log(`  [${issue.casinoId}] ${issue.field}: ${issue.message}`);
    }
    console.log("");
  }

  if (warnings.length > 0) {
    console.log("WARNINGS:");
    for (const issue of warnings) {
      console.log(`  [${issue.casinoId}] ${issue.field}: ${issue.message}`);
    }
    console.log("");
  }

  // Summary statistics
  console.log("STATISTICS:");
  const geos = new Map<string, number>();
  const statuses = new Map<string, number>();
  let totalLicenses = 0;
  let totalPayments = 0;

  for (const casino of allCasinos) {
    for (const geo of casino.countries) {
      geos.set(geo, (geos.get(geo) ?? 0) + 1);
    }
    statuses.set(casino.verificationStatus, (statuses.get(casino.verificationStatus) ?? 0) + 1);
    totalLicenses += casino.licenses.length;
    totalPayments += casino.paymentMethods.length;
  }

  console.log(`  GEOs represented: ${geos.size}`);
  for (const [geo, count] of geos) {
    console.log(`    ${geo}: ${count} casinos`);
  }
  console.log(`  Total licenses: ${totalLicenses}`);
  console.log(`  Total payment methods: ${totalPayments}`);
  console.log(`  Avg payments/casino: ${(totalPayments / allCasinos.length).toFixed(1)}`);
  console.log("");

  if (errors.length === 0) {
    console.log("✅ No errors found. Data quality is acceptable.");
  } else {
    console.log(`❌ ${errors.length} errors need attention.`);
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
