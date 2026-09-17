# Phase 29 — Casino Comparison Engine

## Overview

Production-ready casino comparison engine allowing users to compare 2-5 real casinos side-by-side using structured, deterministic data. No AI ranking, no affiliate-based ranking, no hidden scoring.

## What Was Built

### 1. Comparison Data Model (`src/lib/compare/index.ts`)

- **ComparisonCasino**: Normalized view model for comparison, derived from Casino entity
- **ComparisonCategory**: Structured comparison categories (Overall, Trust, Bonuses, Payments, Games, Features, GEO, Responsible Gambling)
- **ComparisonField**: Typed field definitions with `getValue` and `format` functions
- Deterministic sorting by editorial score, player rating, min deposit, verification status, name
- Difference detection across key factual dimensions
- Payment overlap calculation (common methods + unique per casino)
- Slug validation, deduplication, and URL building

### 2. Comparison UI Components (`src/components/compare/`)

- **ComparisonTable**: Responsive comparison table with category sections and affiliate CTAs
- **DifferenceHighlights**: Visual cards showing key differences between casinos
- **SortControls**: Sort-by pills with active state indicator
- **CasinoSelector**: Badge-based selection with add/remove controls, max 5 limit
- **PaymentOverlap**: Common vs. unique payment methods display

### 3. Comparison Page (`src/app/compare/page.tsx`)

- Server component with URL-based casino selection (`?casinos=slug1,slug2`)
- Client component (`ComparisonPageClient.tsx`) handles interactivity
- Default selection: first 3 verified casinos when no URL params
- Maximum 5 casinos per comparison
- Noindex for dynamic ad-hoc comparisons
- BreadcrumbList structured data
- Responsive 3-column layout on desktop, 2-column on tablet, 1-column on mobile

### 4. Comparison Logic

**Sorting** (5 sort options):
- Editorial Score (default)
- Player Rating
- Minimum Deposit
- Verification Status
- Name (alphabetical)

**Difference Detection**:
- Min deposit differences (lowest vs. highest)
- Payment method count differences
- GEO availability differences
- License issuer differences
- Responsible gambling feature gaps

**Payment Overlap**:
- Common methods present in all compared casinos
- Unique methods per casino (additional payment options)

### 5. Tests (`src/lib/compare/__tests__/compare.test.ts`)

47 new tests covering:
- `toComparisonCasino` — transformation, null handling, defaults
- `sortCasinos` — all sort fields, directions, null handling, immutability
- `detectDifferences` — deposit, payment, license, GEO, RG differences, edge cases
- `calculatePaymentOverlap` — common methods, unique methods, empty inputs
- `validateComparisonSlugs` — validation, dedup, limit, whitespace, casing
- `buildComparisonUrl` — URL construction, sorting
- `COMPARISON_CATEGORIES` — structure validation, field consistency
- Integration test — full comparison workflow

### 6. Updated Existing Pages

- **DE Compare** (`src/app/de/compare/page.tsx`): Updated to use new comparison types
- **CasinoComparisonPage** (`src/components/casino/CasinoComparisonPage.tsx`): Updated to use new comparison types

## Architecture Decisions

1. **ComparisonCasino is a view model**, not a persistence model — derived from Casino entity at render time
2. **No affiliate-based ranking** — sorting options are transparent, user-controlled
3. **Deterministic output** — same input always produces same output, no randomness
4. **URL-based selection** — comparisons shareable via URL with `?casinos=` parameter
5. **Noindex for dynamic comparisons** — prevents SEO pollution from ad-hoc comparisons
6. **Max 5 casino limit** — prevents performance degradation, can be changed later
7. **Category-based display** — structured comparison organized by feature domain

## Files Changed/Created

### Created
- `src/lib/compare/index.ts` — comparison data model and logic
- `src/lib/compare/__tests__/compare.test.ts` — 47 tests
- `src/components/compare/ComparisonTable.tsx` — comparison table component
- `src/components/compare/DifferenceHighlights.tsx` — difference cards
- `src/components/compare/SortControls.tsx` — sort-by pills
- `src/components/compare/CasinoSelector.tsx` — selection controls
- `src/components/compare/PaymentOverlap.tsx` — payment overlap display
- `src/components/compare/index.ts` — barrel export
- `src/app/compare/ComparisonPageClient.tsx` — interactive comparison client
- `docs/phase-29-comparison-engine.md` — this document

### Modified
- `src/app/compare/page.tsx` — rewritten with new comparison engine
- `src/app/de/compare/page.tsx` — updated to use new types
- `src/components/casino/CasinoComparisonPage.tsx` — updated to use new types

## Constraints Maintained

- [x] No AI/LLM-based ranking
- [x] No affiliate-based ranking
- [x] No mass-generated comparison pages
- [x] No hidden commercial scoring
- [x] No "Best" labels without editorial methodology
- [x] Unknown values shown as "Not verified"
- [x] SEO-safe (noindex dynamic comparisons)
- [x] All 459 tests pass (47 new + 412 existing)
