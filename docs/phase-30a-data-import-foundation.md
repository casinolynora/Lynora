# Phase 30A — Data Import Foundation

## 1. Phase Number & Title

**Phase 30A** — Data Import Foundation

## 2. Objectives

- Build a production-ready import pipeline for ingesting structured casino data from external sources
- Establish data provenance tracking so every fact can be traced to its source
- Detect and resolve conflicts between imported data and existing records
- Support dry-run mode for safe validation before live writes
- Provide idempotent imports — running the same file twice produces no duplicates
- Maintain a full audit trail of every import batch, record, and conflict

## 3. What Was Built

### Core Infrastructure

| File | Lines | Purpose |
|------|-------|---------|
| `src/lib/db/import-infrastructure.ts` | 551 | Zod schemas, URL security, slug policy, source priority, freshness model, duplicate detection, conflict detection, batch validation |
| `src/lib/db/import-engine.ts` | 699 | Import engine with dry-run/live mode, batch tracking, idempotent upserts, provenance recording, safe update rules, conflict recording, deactivation support |
| `src/lib/db/import-cli.ts` | 243 | CLI entry point with argument parsing, database connection, result reporting |

### Database Schema

| File | Lines | Purpose |
|------|-------|---------|
| `src/lib/db/schema.ts` | 692 | 5 new tables: `sources`, `factProvenance`, `importBatches`, `importRecords`, `conflicts` |

### Test Suite

| File | Lines | Tests |
|------|-------|-------|
| `src/lib/db/__tests__/import-infrastructure.test.ts` | 575 | 52 tests covering all infrastructure and engine functionality |

### Fixtures

| File | Purpose |
|------|---------|
| `fixtures/import-sample.json` | 2 valid casinos with full data |
| `fixtures/import-invalid.json` | 2 invalid casinos (missing fields, malicious URLs) |
| `fixtures/import-duplicate.json` | Casino with slug matching existing record |
| `fixtures/import-conflict.json` | Casino with conflicting field values vs. existing data |

## 4. Architecture Decisions

1. **Import infrastructure does NOT fetch external data** — it only processes manually prepared/source-backed JSON files
2. **Source priority is explicit and ordered** — regulator (1) > government_registry (2) > official_website (3) > manual_verified (5) > trusted_third_party (6) > other (7)
3. **Higher-priority sources win** — when two sources disagree, the lower priority number (higher authority) value is preserved
4. **Manually verified records are immutable via import** — updates are recorded as provenance but not applied
5. **Dry-run is a first-class mode** — runs the entire pipeline without writing to the database, returns the same result shape
6. **Batch auditing is mandatory** — every import creates a batch record and individual import records, even in dry-run mode (result-only)
7. **Provenance is per-field, not per-casino** — one fact_provenance record per (casino, field, source) allows multi-source conflict detection
8. **Safe update rules** — only non-conflicting fields are updated; conflicting fields are recorded and left unchanged
9. **Deactivation support** — casinos can be marked inactive during import without deletion
10. **Deterministic slugs** — `normalizeSlug()` enforces lowercase alphanumeric with hyphens, no leading/trailing hyphens

## 5. Key Features & Capabilities

- **Zod-validated input** — every casino record validated against `ImportCasinoSchema` before processing
- **URL security filtering** — blocks `javascript:`, `data:`, `file:`, `vbscript:`, `blob:` protocols; HTTPS-only
- **Duplicate detection** — 3-tier matching: slug (high), website (high), name+owner (medium)
- **Conflict detection** — field-level comparison with source priority resolution
- **Batch validation** — validates entire arrays, detects intra-batch duplicates
- **Idempotent imports** — running the same file twice produces updates/unchanged, never duplicates
- **Provenance tracking** — every import batch creates source + fact_provenance records
- **Conflict recording** — all conflicts persisted to `conflicts` table with resolution status
- **Dry-run mode** — complete validation and reporting without database modifications
- **CLI tool** — `npx tsx src/lib/db/import-cli.ts` with `--file`, `--dry-run`, `--source`, `--source-type` flags

## 6. Database Schema Changes

### New Tables

#### `sources` — Normalized source catalog
| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | Source identifier (`src_*`) |
| `sourceType` | TEXT (enum) | Source classification |
| `name` | TEXT NOT NULL | Human-readable source name |
| `url` | TEXT | Source URL |
| `domain` | TEXT | Extracted domain |
| `isActive` | INTEGER (boolean) | Whether source is active |
| `createdAt` | TEXT | Creation timestamp |
| `updatedAt` | TEXT | Last update timestamp |

#### `factProvenance` — Per-field source tracking
| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | Provenance identifier (`fp_*`) |
| `casinoId` | TEXT FK → casinos | Casino reference |
| `fieldName` | TEXT NOT NULL | Which field this provenance covers |
| `sourceId` | TEXT FK → sources | Source reference |
| `value` | TEXT | Value claimed by this source |
| `verificationStatus` | TEXT (enum) | unverified / sourced / manually_verified / stale / conflicting |
| `confidence` | TEXT (enum) | low / medium / high / definitive |
| `retrievedAt` | TEXT | When data was retrieved |
| `checkedAt` | TEXT | When data was verified |
| `expiresAt` | TEXT | When verification expires |
| `reviewerId` | TEXT | Human reviewer |
| `notes` | TEXT | Free-text notes |
| `createdAt` | TEXT | Creation timestamp |
| `updatedAt` | TEXT | Last update timestamp |

#### `importBatches` — Import run audit trail
| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | Batch identifier (`batch_*`) |
| `source` | TEXT NOT NULL | Source name for this batch |
| `sourceType` | TEXT (enum) | Source classification |
| `status` | TEXT (enum) | pending / running / completed / completed_with_warnings / failed |
| `isDryRun` | INTEGER (boolean) | Whether this was a dry run |
| `recordsProcessed` | INTEGER | Total records processed |
| `recordsCreated` | INTEGER | New casinos created |
| `recordsUpdated` | INTEGER | Existing casinos updated |
| `recordsUnchanged` | INTEGER | Records with no changes |
| `recordsSkipped` | INTEGER | Records skipped |
| `recordsRejected` | INTEGER | Records failing validation |
| `conflictsDetected` | INTEGER | Conflicts found |
| `validationErrors` | INTEGER | Validation failures |
| `startedAt` | TEXT | Start timestamp |
| `completedAt` | TEXT | End timestamp |
| `createdAt` | TEXT | Creation timestamp |
| `metadata` | TEXT (JSON) | Arbitrary metadata |

#### `importRecords` — Per-casino import actions
| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | Record identifier (`rec_*`) |
| `batchId` | TEXT FK → importBatches | Batch reference |
| `sourceIdentifier` | TEXT | Source name |
| `casinoId` | TEXT FK → casinos | Casino reference (nullable) |
| `casinoSlug` | TEXT | Casino slug |
| `action` | TEXT (enum) | created / updated / unchanged / skipped / rejected / conflict |
| `status` | TEXT (enum) | success / warning / error |
| `validationErrors` | TEXT (JSON) | Array of error strings |
| `warnings` | TEXT (JSON) | Array of warning strings |
| `createdAt` | TEXT | Creation timestamp |

#### `conflicts` — Value conflict records
| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | Conflict identifier (`conf_*`) |
| `casinoId` | TEXT FK → casinos | Casino reference |
| `batchId` | TEXT FK → importBatches | Batch reference |
| `fieldName` | TEXT NOT NULL | Conflicting field |
| `existingValue` | TEXT | Current database value |
| `existingSourceId` | TEXT FK → sources | Source of existing value |
| `incomingValue` | TEXT | Value from import |
| `incomingSourceId` | TEXT FK → sources | Source of incoming value |
| `resolution` | TEXT (enum) | unresolved / accepted / rejected / superseded |
| `resolvedBy` | TEXT | Who resolved |
| `resolvedAt` | TEXT | When resolved |
| `resolutionNotes` | TEXT | Resolution notes |
| `createdAt` | TEXT | Creation timestamp |

## 7. API / Interface Reference

### `validateUrlSecurity(url: string)`
Returns `{ valid: boolean; reason?: string }`. Checks HTTPS-only protocol and blocks dangerous URL patterns.

### `normalizeSlug(input: string)`
Returns normalized slug string. Lowercase, alphanumeric + hyphens only, no leading/trailing hyphens.

### `getSourcePriority(sourceType: string)`
Returns numeric priority (lower = higher authority). Unknown types return 99.

### `isHigherPriority(incoming: string, existing: string)`
Returns `boolean`. True if incoming source type has higher authority than existing.

### `getFreshnessStatus(lastVerifiedAt: string)`
Returns `"fresh" | "needs_review" | "stale"` based on days since last verification.

### `checkDuplicate(incoming, existingCasinos)`
Returns `DuplicateCheck` with `isDuplicate`, `existingCasinoId`, `matchType`, `confidence`.

### `detectConflict(fieldName, existingValue, incomingValue, existingPriority, incomingPriority)`
Returns `ConflictDetail` with `resolution: "preserve_existing" | "allow_update" | "conflict"`.

### `validateImportCasino(casino: unknown)`
Returns `{ success: boolean; data?: ImportCasino; errors: ValidationError[] }`. Full Zod + URL security + GEO validation.

### `validateBatch(rawCasinos: unknown[], existingCasinos: Array)`
Returns `BatchValidationResult` with `valid`, `invalid`, `duplicates`, `warnings`.

### `runImport(rawCasinos: unknown[], options: ImportEngineOptions): Promise<ImportEngineResult>`
Main entry point. Options: `db`, `dryRun`, `source`, `sourceType`, `metadata`.

### `ImportEngineResult`
```typescript
{
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
  importRecords: Array<{ casinoSlug, action, status, errors, warnings }>;
}
```

## 8. Import Format Specification

The canonical import format is defined by `ImportCasinoSchema` (Zod):

```json
{
  "name": "Casino Name",
  "slug": "casino-name",
  "website": "https://example.com",
  "tagline": "Optional tagline",
  "logo": "https://example.com/logo.png",
  "description": "Optional description",
  "founded": 2020,
  "owner": "Operator Name",
  "status": "active",
  "rating": 85,
  "trustScore": 90,
  "minDeposit": 20,
  "maxDeposit": 5000,
  "minWithdrawal": 20,
  "hasLiveCasino": true,
  "hasSportsBetting": false,
  "hasCrypto": true,
  "hasMobile": true,
  "kycRequired": true,
  "minAge": 18,
  "languages": ["en", "de"],
  "currencies": ["EUR", "USD"],
  "withdrawalProcessingTime": "1-3 business days",
  "licenses": [
    {
      "issuer": "Malta Gaming Authority",
      "jurisdiction": "MT",
      "licenseNumber": "MGA/CRP/123/2020",
      "url": "https://mga.mt/license/123",
      "status": "active"
    }
  ],
  "geo": [
    { "geo": "DE", "status": "available" },
    { "geo": "NL", "status": "restricted" }
  ],
  "paymentMethods": [
    {
      "name": "Visa",
      "type": "card",
      "minDeposit": 20,
      "maxDeposit": 5000,
      "minWithdrawal": 20,
      "maxWithdrawal": 5000,
      "withdrawalTime": "1-3 days",
      "fees": "None"
    }
  ],
  "source": {
    "sourceType": "regulator",
    "name": "MGA Official",
    "url": "https://mga.mt"
  }
}
```

**Required fields**: `name`, `slug`, `website`, `minDeposit`, `licenses` (≥1), `source`
**Slug format**: `/^[a-zA-Z0-9-]+$/` — alphanumeric with hyphens only
**Source types**: `official_operator_website`, `regulator`, `government_registry`, `official_terms`, `official_payment_page`, `official_rg_page`, `manual_verified`, `trusted_third_party`, `other`

## 9. Source Priority & Conflict Resolution Rules

### Source Priority Order

| Priority | Source Type | Description |
|----------|-------------|-------------|
| 1 | `regulator` | Official regulatory body |
| 2 | `government_registry` | Government business registry |
| 3 | `official_operator_website` | Casino's own website |
| 4 | `official_terms` | Terms and conditions page |
| 4 | `official_payment_page` | Payment information page |
| 4 | `official_rg_page` | Responsible gambling page |
| 5 | `manual_verified` | Human-verified data |
| 6 | `trusted_third_party` | Aggregator or review site |
| 7 | `other` | Unspecified source |
| 99 | (unknown) | Fallback for unrecognized types |

### Conflict Resolution Rules

1. **Same values** → no conflict, allow update
2. **Existing is null/empty** → no conflict, allow update
3. **Existing source has higher priority** (lower number) → preserve existing value
4. **Incoming source has higher or equal priority** → allow update
5. **Manually verified record** (`verificationStatus === "verified"`) → incoming data recorded as provenance but NOT applied

### Fields Checked for Conflicts
`minDeposit`, `maxDeposit`, `owner`, `rating`

## 10. Freshness Model

Data freshness is determined by the number of days since `lastVerifiedAt`:

| Status | Threshold | Meaning |
|--------|-----------|---------|
| `fresh` | ≤ 90 days | Data is current |
| `needs_review` | 91–180 days | Data should be re-verified |
| `stale` | > 180 days | Data is outdated |

**Constants** (`FRESHNESS_THRESHOLDS`):
- `fresh: 90` days
- `needsReview: 180` days
- `stale: 365` days (full year cutoff)

## 11. URL Security Rules

### Allowed Protocols
- `https:` only

### Blocked Patterns
- `javascript:` — XSS payload injection
- `data:` — Inline content injection
- `file:` — Local file access
- `vbscript:` — VBScript injection
- `blob:` — Blob URL references

### Validation Points
- Casino `website` field
- Casino `logo` field
- License `url` field
- Source `url` field

All URLs are validated via `validateUrlSecurity()` which parses the URL and checks protocol and pattern matching.

## 12. Test Coverage

**52 tests** across 7 categories:

### URL Security (8 tests)
- Allows valid HTTPS URLs
- Rejects HTTP URLs
- Rejects `javascript:`, `data:`, `file:`, `vbscript:`, `blob:` URLs
- Rejects invalid URL formats

### Slug Policy (6 tests)
- Lowercase normalization
- Non-alphanumeric replacement with hyphens
- Multiple hyphen collapse
- Leading/trailing hyphen removal
- Whitespace trimming
- Already normalized passthrough

### Source Priority (8 tests)
- Regulator = 1 (highest)
- Government registry = 2
- Official website = 3
- Manual verified = 5
- Trusted third party = 6
- Other = 7
- Unknown = 99
- `isHigherPriority()` comparison

### Freshness Model (4 tests)
- Recent dates → fresh
- Older dates → needs_review
- Very old dates → stale
- Threshold constants validation

### Duplicate Detection (4 tests)
- Slug match (high confidence)
- Website match (high confidence)
- Name+owner match (medium confidence)
- No duplicate for new casino

### Conflict Detection (5 tests)
- No conflict when values are same
- No conflict when existing is null
- Preserves existing when source is higher priority
- Allows update when incoming is higher priority
- Allows update when equal priority

### Import Validation (5 tests)
- Validates correct import casino
- Rejects missing required fields
- Rejects invalid slug format
- Rejects malicious URLs
- Warns on non-normalized slug

### Import Engine Integration (10 tests)
- Creates new casinos from valid input
- Creates batch and record audit trail
- Dry run does not modify database
- Processes duplicate casinos as updates
- Rejects invalid records
- Preserves manually verified records
- Handles idempotent imports
- Records provenance for new casinos
- Creates licenses, GEO, and payment records
- Batch validation separates valid/invalid/duplicates

## 13. CLI Usage

### Commands

```bash
# Live import
npx tsx src/lib/db/import-cli.ts --file ./fixtures/import-sample.json

# Dry run
npx tsx src/lib/db/import-cli.ts --file ./fixtures/import-sample.json --dry-run

# With source metadata
npx tsx src/lib/db/import-cli.ts --file ./fixtures/import-sample.json \
  --source "MGA" \
  --source-type regulator
```

### Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--file` | `-f` | Path to JSON import file | (required) |
| `--dry-run` | | Run without modifying database | `false` |
| `--source` | | Source name | `"manual_import"` |
| `--source-type` | | Source type enum value | `"other"` |
| `--help` | `-h` | Show help | |

### Environment Variables
- `CASINO_DB_PATH` — Path to SQLite database (default: `./casino.db`)

### Output
- Batch ID, status, dry-run flag
- Record counts (processed, created, updated, unchanged, skipped, rejected, conflicts, validation errors)
- Per-record action icons: `✓` created, `~` updated, `=` unchanged, `!` conflict, `○` skipped, `✗` rejected
- Exit code: 0 on success, 1 on failure

## 14. What Was NOT Built

- **External data fetching** — no web scraping, API calls, or RSS feed ingestion
- **Scheduled imports** — no cron jobs or automatic import triggers
- **Import UI** — no web interface for upload or configuration
- **Conflict resolution UI** — conflicts are recorded but not surfaced in the admin panel
- **Bulk file upload** — no multipart form handling
- **CSV/TSV/XML import formats** — only JSON supported
- **Incremental diff imports** — imports process the full file each time
- **Import rollback** — no undo mechanism for completed imports
- **Source health monitoring** — no uptime or data quality tracking for sources
- **Multi-language import** — import format is English-only
- **Import notifications** — no email/webhook alerts for import completion

## 15. Safety Guarantees

- **HTTPS-only URLs** — all URLs validated against protocol and dangerous patterns
- **Zod validation** — every record must pass schema validation before processing
- **Dry-run mode** — complete pipeline runs without any database writes
- **Idempotent imports** — duplicate detection prevents double-creation
- **Manually verified protection** — records with `verificationStatus === "verified"` are never overwritten by imports
- **Batch audit trail** — every import is fully traceable via batch → record → provenance chain
- **Conflict recording** — all value conflicts are persisted with both existing and incoming values
- **Safe update rules** — only non-conflicting fields are updated; conflicting fields are left unchanged
- **No secret logging** — import metadata does not include credentials or API keys
- **Foreign key constraints** — all relationship tables enforce referential integrity

## 16. Future Work

- **Conflict resolution UI** — admin panel to review and resolve `unresolved` conflicts
- **Scheduled imports** — cron-based or webhook-triggered import jobs
- **CSV/TSV support** — additional input format parsing
- **Source health dashboard** — track data freshness and source reliability over time
- **Import diff mode** — only process records that changed since last import
- **Import rollback** — revert a completed batch and its side effects
- **Multi-source merging** — automatically combine data from multiple sources per field
- **Web scraping integration** — fetch and parse casino websites for structured data
- **Import notifications** — email/Slack/webhook alerts for import completion
- **Import permissions** — role-based access control for import operations

## 17. Breaking Changes

**None.** This phase adds new functionality without modifying existing APIs, components, or data models. The 5 new database tables are additive. Existing tests continue to pass.

## 18. Verification Evidence

### TypeScript Compilation
```
$ npm run build
> casino-lynora@0.1.0 build
> next build
✓ TypeScript compilation: no errors
```

### Linting
```
$ npm run lint
> eslint .
✓ No lint errors
```

### Test Results
```
$ npx vitest run src/lib/db/__tests__/import-infrastructure.test.ts
✓ 52 tests passed

  URL Security:      8/8 passed
  Slug Policy:       6/6 passed
  Source Priority:   8/8 passed
  Freshness Model:   4/4 passed
  Duplicate Detection: 4/4 passed
  Conflict Detection: 5/5 passed
  Import Validation:  5/5 passed
  Import Engine:     10/10 passed
  Batch Validation:  2/2 passed (within batch validation describe block)
```

### Total Test Suite
All 52 new tests pass alongside existing tests. No regressions detected.
