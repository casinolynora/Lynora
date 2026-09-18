/**
 * Casino Verification CLI
 *
 * Commands:
 *   npx tsx src/lib/db/verify-cli.ts --file <path>           Live verification
 *   npx tsx src/lib/db/verify-cli.ts --file <path> --dry-run Dry run
 *
 * Usage:
 *   npx tsx src/lib/db/verify-cli.ts --file ./fixtures/verification-batch-01-data.json
 *   npx tsx src/lib/db/verify-cli.ts --file ./fixtures/verification-batch-01-data.json --dry-run
 */

import { readFileSync } from "fs";
import path from "path";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { runVerification, validateVerificationBatch } from "./verification-engine";
import type { VerificationBatch } from "./verification-engine";
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
} from "./schema";

// ─── Parse Arguments ──────────────────────────────────────────────────────

function parseArgs(): {
  filePath: string;
  dryRun: boolean;
  help: boolean;
} {
  const args = process.argv.slice(2);
  const result = { filePath: "", dryRun: false, help: false };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--file":
      case "-f":
        result.filePath = args[++i];
        break;
      case "--dry-run":
        result.dryRun = true;
        break;
      case "--help":
      case "-h":
        result.help = true;
        break;
    }
  }

  return result;
}

// ─── Print Help ───────────────────────────────────────────────────────────

function printHelp(): void {
  console.log(`
Casino Verification CLI

Usage:
  npx tsx src/lib/db/verify-cli.ts --file <path> [options]

Options:
  --file, -f <path>    Path to verification data JSON file (required)
  --dry-run            Run without modifying database
  --help, -h           Show this help

Examples:
  npx tsx src/lib/db/verify-cli.ts --file ./fixtures/verification-batch-01-data.json --dry-run
  npx tsx src/lib/db/verify-cli.ts --file ./fixtures/verification-batch-01-data.json
`);
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = parseArgs();

  if (args.help || !args.filePath) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  // Read verification file
  const filePath = path.resolve(args.filePath);
  let rawData: unknown;

  try {
    const content = readFileSync(filePath, "utf-8");
    rawData = JSON.parse(content);
  } catch (error) {
    console.error(`Error reading file: ${filePath}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  // Validate
  const validation = validateVerificationBatch(rawData);
  if (!validation.success || !validation.data) {
    console.error("Invalid verification data:");
    for (const err of validation.errors) {
      console.error(`  ✗ ${err}`);
    }
    process.exit(1);
  }

  const batchData = validation.data as VerificationBatch;

  console.log(`\nLoaded verification batch: ${batchData.batch}`);
  console.log(`Casinos to verify: ${batchData.casinos.length}`);
  console.log(`Mode: ${args.dryRun ? "DRY RUN" : "LIVE VERIFICATION"}`);
  console.log(`Verified by: ${batchData.verifiedBy}`);
  console.log(`Verified at: ${batchData.verifiedAt}`);

  // Connect to database
  const dbPath = process.env.CASINO_DB_PATH || path.join(process.cwd(), "casino.db");
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, {
    schema: {
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
    },
  });

  // Run verification
  const result = await runVerification(batchData, {
    db,
    dryRun: args.dryRun,
  });

  // Print results
  printResults(result);

  // Exit code
  process.exit(result.status === "failed" ? 1 : 0);
}

function printResults(result: Awaited<ReturnType<typeof runVerification>>): void {
  console.log("\n" + "=".repeat(60));
  console.log(`Verification ${result.dryRun ? "(DRY RUN) " : ""}Results`);
  console.log("=".repeat(60));

  console.log(`\nBatch ID: ${result.batchId}`);
  console.log(`Status: ${result.status}`);
  console.log(`Dry Run: ${result.dryRun}`);

  console.log("\n--- Counts ---");
  console.log(`Processed:    ${result.recordsProcessed}`);
  console.log(`Verified:     ${result.recordsVerified}`);
  console.log(`Unchanged:    ${result.recordsUnchanged}`);
  console.log(`Skipped:      ${result.recordsSkipped}`);
  console.log(`Failed:       ${result.recordsFailed}`);
  console.log(`Facts OK:     ${result.factsVerified}`);
  console.log(`Facts Skip:   ${result.factsSkipped}`);
  console.log(`Conflicts:    ${result.conflictsDetected}`);

  if (result.warnings.length > 0) {
    console.log("\n--- Warnings ---");
    for (const w of result.warnings) {
      console.log(`  ⚠ ${w}`);
    }
  }

  if (result.errors.length > 0) {
    console.log("\n--- Errors ---");
    for (const e of result.errors) {
      console.log(`  ✗ ${e}`);
    }
  }

  console.log("\n--- Records ---");
  for (const rec of result.records) {
    const icon = rec.action === "verified" ? "✓" :
                 rec.action === "unchanged" ? "=" :
                 rec.action === "skipped" ? "○" : "✗";
    console.log(`  ${icon} ${rec.casinoSlug}: ${rec.action} (${rec.status}) — ${rec.factsVerified} facts`);
    for (const err of rec.errors) {
      console.log(`    ✗ ${err}`);
    }
  }

  console.log("\n" + "=".repeat(60));
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
