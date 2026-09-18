# Phase 30B — First 100 Real Casino Dataset

## Objective

Build and onboard the first 100 real casino brands into CasinoLynora using the Phase 30A import pipeline. Quality is the gating criterion — every record must be source-backed, structured, and auditable. Quantity is secondary to data integrity. This phase validates that the normalized schema, provenance tracking, publication gates, and integration points work correctly with real-world data before scaling to 300+ brands.

## Dataset Scope

The target dataset is exactly **100 distinct casino brands** operating in regulated European markets. Each brand is represented by one canonical record in the `casinos` table, linked to normalized `operators`, `casino_licenses`, `geo_availability`, `payment_methods`, `casino_payment_methods`, `sources`, `fact_provenance`, `import_batches`, `import_records`, and `conflicts` tables.

All 100 records must satisfy `ImportCasinoSchema` validation before entry. Records that fail validation are rejected at import time — there is no partial or degraded entry into the dataset.

The dataset must not duplicate any of the 49 existing seed casinos (27 DE, 14 NL, 8 BE) which are already `verificationStatus: "verified"`. New records must disambiguate by slug uniqueness — no two records may share the same slug value.

## GEO Scope

Casinos are onboarded for the four target markets:

| GEO | Country | Regulatory Context | Expectation |
|-----|---------|-------------------|-------------|
| DE | Germany | Glücksspielstaatsvertrag (GlüStV) 2021, cross-state treaty | Largest pool; expect 50–60 of the 100 |
| IE | Ireland | Regulated under Gambling Regulation Act 2022 | Emerging regulated market; expect 10–15 |
| NL | Netherlands | Kansspelautoriteit (KSA) licensing | Established regulated market; expect 15–20 |
| BE | Belgium | Belgian Gaming Commission | Smaller market; expect 8–12 |

Each casino record must have a corresponding entry in `geo_availability` with explicit availability status per GEO: `available`, `restricted`, `unavailable`, or `unknown`. A casino may serve multiple GEOs simultaneously.

The dataset manifest tracks GEO distribution to ensure balanced representation across all four target markets. No single GEO should exceed 70% of the total dataset.

## Source Hierarchy

The Phase 30A source priority hierarchy governs data resolution and conflict handling:

| Priority | sourceType | Description | Weight |
|----------|------------|-------------|--------|
| 1 | `regulator` | Official regulatory body publication | Highest |
| 2 | `government_registry` | Government business registry entries | |
| 3 | `official_operator_website` | The casino's own published website | |
| 4 | `official_terms` | Terms and conditions published by operator | |
| 4 | `official_payment_page` | Payment information from operator | |
| 4 | `official_rg_page` | Responsible gambling page from operator | |
| 5 | `manual_verified` | Human-verified from direct observation | |
| 6 | `trusted_third_party` | Third-party sources with editorial standards | |
| 7 | `other` | Unclassified sources | Lowest |

Sources at the same priority level are resolved by recency (freshness) and then by the number of corroborating sources. When two sources conflict, the higher-priority source wins. When equal priority, the newer source wins. When equal recency, the record enters a `conflicts` entry for manual resolution.

Each source record in the `sources` table carries a `sourceType`, `name`, `url`, `retrievedAt` timestamp, and `trustScore` (0–1). Sources with `trustScore` below 0.5 are flagged but not excluded — manual verification is required before promotion.

## Data Contract

Every imported casino must satisfy `ImportCasinoSchema` with the following required fields:

| Field | Type | Requirements | Example |
|-------|------|-------------|---------|
| `name` | `string` | Non-empty, human-readable brand name | `"Jackpot City"` |
| `slug` | `string` | Alphanumeric + hyphens only, unique, non-empty | `"jackpot-city"` |
| `website` | `string` | Valid HTTPS URL, unique | `"https://www.jackpotcity.com"` |
| `minDeposit` | `number` | Greater than or equal to 0 | `10` |
| `licenses` | `array` | Minimum 1 entry, each with `jurisdiction` and `licenseNumber` | `[{ jurisdiction: "DE", licenseNumber: "12345" }]` |
| `source` | `object` | `sourceType` (required), `name` (required), `url` (optional) | `{ sourceType: "regulator", name: "GGL", url: "..." }` |

All URLs in the schema must use HTTPS. HTTP URLs are rejected at validation time. The `slug` field is the primary deduplication key — re-imports match on slug, not name.

The `source` object on each import record establishes the primary provenance for the batch. Individual facts within the batch may reference additional sources via `fact_provenance`.

## Provenance Rules

Every piece of data in the dataset must be traceable to at least one source. The provenance chain is:

1. **Source registration** — A `sources` record is created (or referenced) with `sourceType`, `name`, `url`, and `retrievedAt`.
2. **Fact attachment** — Each normalized fact (e.g., `minDeposit`, `license`, `paymentMethod`) is linked to its source(s) via `fact_provenance` entries.
3. **Verification state** — Each fact carries a `verificationState`: `unverified`, `sourced`, `manually_verified`, `stale`, or `conflicting`.
4. **Freshness tracking** — Each `fact_provenance` entry records `createdAt` and `lastVerifiedAt` timestamps, enabling freshness threshold evaluation.

Facts without provenance are considered `unverified` and cannot contribute to a `Level A` (publishable) classification. A casino may have mixed-provenance data — some facts `sourced`, others `unverified` — which affects its quality level classification.

## Verification States

Each fact and casino record carries a verification state:

| State | Meaning | Promotable? |
|-------|---------|-------------|
| `unverified` | No source backing; raw import only | No |
| `sourced` | Linked to at least one source record | Yes (if all critical fields sourced) |
| `manually_verified` | Confirmed by human reviewer | Yes |
| `stale` | Data older than freshness threshold | No (requires re-verification) |
| `conflicting` | Multiple sources disagree on value | No (requires resolution) |

Casino-level `verificationStatus` is derived from the aggregation of its fact-level verification states. A casino reaches `verificationStatus: "verified"` only when all critical fields (`name`, `slug`, `website`, `minDeposit`, `licenses`) are at `sourced` or `manually_verified` state with no `conflicting` facts on critical fields.

## Publication Gate

A casino becomes publicly visible (`isProductionVisible = true`) only when ALL of the following conditions are met:

1. `status === "active"` — Casino is not deactivated or draft.
2. `verificationStatus === "verified"` — All critical fields sourced or manually verified.
3. Sufficient data — At minimum: name, slug, website, minDeposit (≥ 0), licenses (≥ 1), and at least one `geo_availability` entry.
4. No unresolved critical conflicts — The `conflicts` table must not contain any open entries for critical fields.
5. HTTPS website — The `website` field is a valid HTTPS URL.

Casinos that fail any gate condition remain as `"draft"` status and are invisible to public queries, sitemap generation, and profile pages. Draft records exist in the database for internal review and workflow purposes only.

The gate is enforced at import time (automatic rejection of non-qualifying records) and at promotion time (manual promotion from draft to active only after review).

## Dataset Manifest

The manifest is a structured JSON record tracking the state of the entire 100-casino dataset. It is updated after every import batch and on-demand during review.

### Manifest Schema

```json
{
  "version": "30b",
  "lastUpdated": "ISO-8601 timestamp",
  "totalRecords": 100,
  "qualityLevels": {
    "levelA_publishable": 0,
    "levelB_needsReview": 0,
    "levelC_internalOnly": 0
  },
  "geoDistribution": {
    "DE": 0,
    "IE": 0,
    "NL": 0,
    "BE": 0
  },
  "sourceCoverage": {
    "withSource": 0,
    "withoutSource": 0,
    "multipleSources": 0
  },
  "conflicts": {
    "total": 0,
    "critical": 0,
    "nonCritical": 0
  },
  "warnings": 0,
  "missingCriticalFields": 0,
  "importBatches": 0,
  "lastImportBatchId": null,
  "freshness": {
    "fresh": 0,
    "needsReview": 0,
    "stale": 0
  }
}
```

The manifest is regenerated from the live database, not maintained as a static file. It serves as the authoritative dashboard for dataset quality.

## Import Workflow

The import workflow follows a six-stage pipeline. No stage is skipped.

### Stage 1: Validate
Raw input data is validated against `ImportCasinoSchema`. Invalid records are rejected with specific error messages. Validation is deterministic — the same input always produces the same result.

### Stage 2: Dry-Run
Validated data is processed without writing to the database. The dry-run produces:
- Records that would be created (new slugs)
- Records that would be updated (existing slugs)
- Records that would conflict (source priority resolution)
- Records that would fail freshness checks

### Stage 3: Review
A human reviewer examines the dry-run output. Review checks:
- Data accuracy against source URLs
- License validity against regulator databases
- GEO availability claims
- Deposit amount reasonableness

### Stage 4: Live Import
Reviewed data is written to the database. All normalized tables are populated. All `fact_provenance` entries are created. The import batch is recorded in `import_batches` and individual records in `import_records`.

### Stage 5: Verify
Post-import verification checks:
- All required fields are populated
- All critical facts have provenance
- No critical conflicts exist
- Publication gate conditions are evaluated

### Stage 6: Promote
Casinos meeting all publication gate conditions are promoted from `status: "draft"` to `status: "active"` and `verificationStatus: "verified"`. This is a manual step — the system does not auto-promote.

## Idempotency

Re-importing the same dataset produces no duplicates. The idempotency contract:

- **Matching key**: `slug` is the unique identifier. Two records with the same slug are the same casino.
- **Re-import behavior**: If a record with the same slug already exists, the import updates the existing record's fields and provenance. New `fact_provenance` entries are appended (not replaced).
- **No deletion**: Re-import never deletes existing data. It only adds or updates.
- **Batch tracking**: Each import batch has a unique `importBatchId`. Re-importing the same batch ID is a no-op — the system detects the duplicate batch and skips it.
- **Conflict detection**: If a re-import introduces data that conflicts with existing data and the new source has lower priority, the conflict is logged but the existing value is retained.

Idempotency is verified by running the same import twice and comparing the database state — the result must be identical.

## Conflict Handling

Conflicts arise when two or more sources provide different values for the same fact.

### Resolution Rules

1. **Source priority wins**: Higher-priority source resolves the conflict automatically. The losing source is logged in `conflicts` for reference.
2. **Equal priority, newer wins**: If both sources are at the same priority level, the more recently retrieved source resolves.
3. **Equal priority, equal recency**: The conflict is unresolved. The fact enters `conflicting` verification state. The casino's `verificationStatus` is downgraded if the conflict is on a critical field.
4. **Manual resolution**: Unresolved conflicts require human intervention. They appear in the `conflicts` table with both source values and resolution status.

### Conflict Record Structure

```typescript
interface Conflict {
  id: string;
  casinoId: string;
  factType: string;          // e.g., "minDeposit", "license"
  existingValue: unknown;
  existingSourceId: string;
  incomingValue: unknown;
  incomingSourceId: string;
  resolution: "auto" | "manual" | "pending";
  resolvedBy?: string;
  resolvedAt?: string;
}
```

Conflicts on critical fields (`name`, `slug`, `website`, `minDeposit`, `licenses`) block publication. Conflicts on non-critical fields (e.g., `paymentMethods`, `bonusDetails`) are logged but do not block publication.

## Freshness

Data freshness is measured from `lastVerifiedAt` on `fact_provenance` records:

| Threshold | Age | Status | Action |
|-----------|-----|--------|--------|
| ≤ 90 days | Fresh | `fresh` | No action required |
| ≤ 180 days | Aging | `needs_review` | Flagged for re-verification |
| > 365 days | Stale | `stale` | Cannot be promoted; blocks publication |

Freshness applies per-fact, not per-casino. A casino may have some facts fresh and others stale. The casino's overall freshness is the freshness of its oldest critical fact.

### Freshness Enforcement

- **At import**: New data is stamped with current `lastVerifiedAt`.
- **At review**: Stale facts are flagged. The reviewer decides whether to re-verify or accept the current value.
- **At publication**: A casino with any stale critical fact cannot be promoted to `verified`.
- **Periodic sweep**: A scheduled job (not in Phase 30B scope, but architecture supports it) flags facts approaching staleness for proactive re-verification.

## Deactivation

Casinos that are no longer operating, lose their license, or are removed from the dataset are **deactivated, not deleted**.

### Deactivation Process

1. `status` is changed from `"active"` to `"inactive"`.
2. `verificationStatus` is set to `"unverified"`.
3. All normalized records (licenses, payment methods, GEO availability) are retained.
4. The `isProductionVisible` flag becomes `false` — the casino disappears from public queries.
5. A `deactivatedAt` timestamp is recorded.
6. A `deactivationReason` is recorded (e.g., "license revoked", "operator ceased operations", "data quality insufficient").

### Reactivation

Deactivated casinos can be reactivated by restoring `status: "active"` and re-running verification. The provenance chain is preserved across deactivation/reactivation cycles.

No casino record is ever hard-deleted from the database. The schema does not include a delete operation — only status transitions.

## SEO Safety

Public-facing SEO artifacts are generated only from `isProductionVisible` casinos:

- **Sitemap**: Only `active + verified` casinos appear in the XML sitemap.
- **Profile pages**: Only `isProductionVisible` casinos have accessible URL routes.
- **Search indexes**: Only `isProductionVisible` casinos are submitted to search engines.
- **Structured data**: Only `isProductionVisible` casinos emit JSON-LD Review schema.
- **Public API responses**: Only `isProductionVisible` casinos appear in public query results.

Draft, inactive, or unverified casino records exist in the database but generate zero indexable URLs. Crawling any draft casino's profile URL returns a 404 — not a redirect, not a noindex page, but a clean 404.

The sitemap generator queries only `isProductionVisible` records. It does not iterate all records and filter — it queries the subset directly.

## Profile V2 Integration

Casino profile pages (Profile V2) use the normalized data model. Missing data sections use **empty states** — not placeholder text, not fake data, and not "coming soon" banners.

### Empty State Behavior

| Section | Missing Data Behavior |
|---------|----------------------|
| License info | Section hidden entirely |
| Payment methods | "No payment information available" |
| GEO availability | "Availability information not yet verified" |
| Bonus details | Section hidden |
| Responsible gambling | "RG information not yet available" |
| Operator info | Section hidden |

Empty states are explicit, honest, and do not mislead users. A section that has no data either displays a clear empty-state message or is not rendered at all.

Profile V2 queries the normalized tables directly. It does not fall back to denormalized `casinos` table fields when normalized data is absent.

## Comparison Integration

The comparison engine operates exclusively on normalized, source-backed data. Commercial placement (`listingPlan`, `featured`, `premium`, `sponsored`) has no effect on comparison scores, rankings, or trust indicators.

### Comparison Rules

- **Scoring**: Only sourced facts contribute to scores. Unverified facts are excluded.
- **Rankings**: Determined by editorial scoring engine with configurable weights. Commercial fields are not inputs.
- **Trust**: Trust indicators reflect provenance quality, not commercial relationships.
- **Filtering**: Users can filter by GEO, minDeposit, licenses, payment methods — all sourced from normalized data.
- **Conflict handling**: If a compared casino has conflicting data on a comparison dimension, the conflict is flagged in the comparison view.

The comparison engine queries `casinos` joined with normalized tables, filtered by `isProductionVisible`. Draft or inactive casinos are excluded from comparison results.

## B2B Separation

Commercial data and editorial data are structurally separated in the schema.

### Separation Model

| Layer | Tables | Purpose | Visibility |
|-------|--------|---------|------------|
| Editorial | `casinos`, `casino_licenses`, `geo_availability`, `payment_methods`, `casino_payment_methods`, `fact_provenance` | Casino facts, scores, trust | Public |
| Commercial | `listingPlan`, `featured`, `premium`, `sponsored` fields on `casinos` | Business relationships | Internal |
| Audit | `sources`, `import_batches`, `import_records`, `conflicts` | Data provenance, import tracking | Internal |

### Enforcement Rules

1. Commercial fields are never read by the comparison engine, scoring engine, or profile renderer.
2. Editorial fields are never written by commercial logic.
3. Public queries filter on `isProductionVisible` — commercial fields are not part of the visibility predicate.
4. A casino's listing plan has zero influence on its editorial score, ranking position, or trust rating.
5. The separation is enforced at the data access layer — components import from `@/lib/types` and query through `casinoDb`, which applies access controls.

## Security

### URL Security

- All `website` fields must use HTTPS. HTTP URLs are rejected at `ImportCasinoSchema` validation.
- Malicious URL patterns (javascript:, data:, file:, internal IPs, localhost) are rejected.
- URL validation uses a strict allowlist of URL schemes: `https:` only.
- URLs are sanitized on import — trailing slashes normalized, query parameters stripped, fragment identifiers removed.

### Fetch Restrictions

- The system does not auto-fetch external URLs during import. All data is provided by the importer and verified manually.
- Profile pages do not proxy or fetch external content at render time.
- No user-controlled input is used to construct URLs for server-side fetching.

### Data Integrity

- Import batches are immutable once written. The `import_batches` table records the input data hash for audit.
- Provenance records cannot be edited after creation — they are append-only.
- Conflict resolution is logged with timestamps and actor identification.

## Testing

### Dataset Validation Tests

- Schema validation: All 100 records pass `ImportCasinoSchema` without errors.
- Slug uniqueness: No duplicate slugs in the dataset.
- HTTPS enforcement: All website fields are valid HTTPS URLs.
- License completeness: Every record has ≥ 1 license entry.
- GEO coverage: Every record has at least one `geo_availability` entry.
- Source completeness: Every record has a valid `source` object.

### Provenance Tests

- Every critical fact has at least one `fact_provenance` entry.
- Source priority resolution produces deterministic results.
- Conflict detection correctly identifies overlapping data from different sources.
- Freshness thresholds correctly categorize facts by age.

### Publication Gate Tests

- Draft casinos are invisible to public queries.
- Inactive casinos are invisible to public queries.
- Unverified casinos are invisible to public queries.
- Casinos with critical conflicts cannot be promoted.
- Promotion requires manual action — no auto-promotion.

### Import Pipeline Tests

- Idempotency: Re-importing same batch produces identical database state.
- Dry-run output matches live import output for the same input.
- Invalid records are rejected with specific error messages.
- Batch tracking records all import metadata.

### Integration Tests

- Profile V2 renders correctly with empty states for missing data.
- Comparison engine excludes draft/inactive casinos.
- Sitemap contains only `isProductionVisible` casinos.
- Structured data (JSON-LD) is emitted only for `isProductionVisible` casinos.
- B2B fields do not influence editorial scoring or ranking.

## Future 300/1,000 Expansion

The architecture supports scaling to 300 and 1,000 casinos without structural changes.

### Scaling Considerations

- **Import pipeline**: Stateless and parallelizable. Multiple import batches can run concurrently without conflict (slug-based deduplication handles concurrency).
- **Database**: Normalized tables with proper indexing scale to 10,000+ records without performance degradation.
- **Quality gates**: The publication gate, freshness thresholds, and provenance requirements remain the same at 100, 300, or 1,000 casinos. No shortcuts.
- **GEO expansion**: Adding new GEOs (e.g., FR, IT, ES, UK) requires only new `geo_availability` entries — no schema changes.
- **Source diversity**: The `sourceType` enum is extensible. New source types can be added without modifying existing records.
- **Manifest**: The manifest structure scales — it tracks counts, not fixed-size arrays.

### Quality Gates at Scale

- The 90/180/365 day freshness thresholds remain constant.
- The requirement for source-backed critical facts remains constant.
- The publication gate (`active + verified + sufficient data`) remains constant.
- Manual verification remains required — no automatic promotion at any scale.
- The conflict resolution process remains source-priority-based.

### What Changes at Scale

- More import batches, more granular batch tracking.
- Potentially more GEOs, requiring GEO distribution monitoring.
- Higher conflict volume, requiring efficient conflict resolution workflows.
- More stale facts, requiring proactive freshness management.
- Profile V2 rendering performance may need optimization for 1,000+ pages.

---

## What Phase 30B Deliberately Does NOT Do

| Exclusion | Rationale |
|-----------|-----------|
| No scraping or crawling | All data is manually sourced and provided; no automated web scraping |
| No paid APIs | No commercial data feeds or paid API integrations |
| No fake data, reviews, or editorial scores | Every fact is real and source-backed; no synthetic content |
| No automatic verification | Human review is required for all verification state transitions |
| No mass SEO publishing | Only manually verified, promoted casinos appear in public SEO artifacts |
| No admin dashboard | Workflow is CLI/script-based; no web UI for import management |
| No PostgreSQL migration | Phase 30B uses the existing data layer; no database engine changes |
| No automatic affiliate enrollment | Affiliate relationships are managed outside the import pipeline |

These exclusions are deliberate architectural decisions, not TODO items. They preserve data integrity, auditability, and the separation between editorial and commercial concerns.
