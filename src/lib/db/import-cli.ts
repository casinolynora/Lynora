/**
 * Casino Data Import CLI
 *
 * Commands:
 *   npm run data:import -- --file <path>           Live import
 *   npm run data:import -- --file <path> --dry-run Dry run
 *   npm run data:import -- --file <path> --source "Official website" --source-type official_operator_website
 *
 * Usage:
 *   npx tsx src/lib/db/import-cli.ts --file ./fixtures/import-sample.json
 *   npx tsx src/lib/db/import-cli.ts --file ./fixtures/import-sample.json --dry-run
 */

import { readFileSync } from "fs";
import path from "path";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { runImport } from "./import-engine";
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
  source: string;
  sourceType: string;
  help: boolean;
} {
  const args = process.argv.slice(2);
  const result: {
    filePath: string;
    dryRun: boolean;
    source: string;
    sourceType: string;
    help: boolean;
  } = {
    filePath: "",
    dryRun: false,
    source: "manual_import",
    sourceType: "other",
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--file":
      case "-f":
        result.filePath = args[++i];
        break;
      case "--dry-run":
        result.dryRun = true;
        break;
      case "--source":
        result.source = args[++i];
        break;
      case "--source-type":
        result.sourceType = args[++i];
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
Casino Data Import CLI

Usage:
  npx tsx src/lib/db/import-cli.ts --file <path> [options]

Options:
  --file, -f <path>        Path to JSON import file (required)
  --dry-run                Run without modifying database
  --source <name>          Source name (default: "manual_import")
  --source-type <type>     Source type (default: "other")
  --help, -h               Show this help

Source Types:
  official_operator_website
  regulator
  government_registry
  official_terms
  official_payment_page
  official_rg_page
  manual_verified
  trusted_third_party
  other

Examples:
  npx tsx src/lib/db/import-cli.ts --file ./fixtures/sample.json --dry-run
  npx tsx src/lib/db/import-cli.ts --file ./fixtures/sample.json --source "MGA" --source-type regulator
`);
}

// ─── Print Results ────────────────────────────────────────────────────────

function printResults(result: Awaited<ReturnType<typeof runImport>>): void {
  console.log("\n" + "=".repeat(60));
  console.log(`Import ${result.dryRun ? "(DRY RUN) " : ""}Results`);
  console.log("=".repeat(60));

  console.log(`\nBatch ID: ${result.batchId}`);
  console.log(`Status: ${result.status}`);
  console.log(`Dry Run: ${result.dryRun}`);

  console.log("\n--- Counts ---");
  console.log(`Processed:    ${result.recordsProcessed}`);
  console.log(`Created:      ${result.recordsCreated}`);
  console.log(`Updated:      ${result.recordsUpdated}`);
  console.log(`Unchanged:    ${result.recordsUnchanged}`);
  console.log(`Skipped:      ${result.recordsSkipped}`);
  console.log(`Rejected:     ${result.recordsRejected}`);
  console.log(`Conflicts:    ${result.conflictsDetected}`);
  console.log(`Val Errors:   ${result.validationErrors}`);

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

  console.log("\n--- Import Records ---");
  for (const rec of result.importRecords) {
    const icon = rec.action === "created" ? "✓" :
                 rec.action === "updated" ? "~" :
                 rec.action === "unchanged" ? "=" :
                 rec.action === "conflict" ? "!" :
                 rec.action === "skipped" ? "○" : "✗";
    console.log(`  ${icon} ${rec.casinoSlug}: ${rec.action} (${rec.status})`);
    for (const err of rec.errors) {
      console.log(`    ✗ ${err}`);
    }
    for (const warn of rec.warnings) {
      console.log(`    ⚠ ${warn}`);
    }
  }

  console.log("\n" + "=".repeat(60));
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = parseArgs();

  if (args.help || !args.filePath) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  // Read import file
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

  // Ensure array
  const inputCasinos = Array.isArray(rawData) ? rawData : [rawData];

  console.log(`\nLoaded ${inputCasinos.length} casino(s) from ${filePath}`);
  console.log(`Mode: ${args.dryRun ? "DRY RUN" : "LIVE IMPORT"}`);
  console.log(`Source: ${args.source} (${args.sourceType})`);

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

  // Run import
  const result = await runImport(inputCasinos, {
    db,
    dryRun: args.dryRun,
    source: args.source,
    sourceType: args.sourceType,
    metadata: {
      cliVersion: IMPORT_VERSION,
      inputFile: filePath,
    },
  });

  // Print results
  printResults(result);

  // Exit code
  process.exit(result.status === "failed" ? 1 : 0);
}

const IMPORT_VERSION = "1.0.0";

// Run
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
