# Phase 25 — Data Foundation

**Status:** Complete  
**Date:** 2026-09-17  
**Branch:** phase-25-trust-foundation

## Goal

Make `CasinoDataProvider` swappable to a real backing store, without changing current production data or behavior.

## What Was Built

### 1. SQLite Database Provider

**Architecture Decision Record:** `docs/adr-001-sqlite-data-provider.md`

Chose SQLite via `better-sqlite3` with Drizzle ORM for:
- Zero-config local development (file-based, no server required)
- Type-safe database access matching Zod schemas
- Clear migration path to PostgreSQL when needed

**Files created:**
- `src/lib/db/schema.ts` — Drizzle schema definition
- `src/lib/db/index.ts` — Database module barrel export (server-only)
- `src/lib/db/db-provider.ts` — `CasinoDataProvider` implementation backed by SQLite
- `src/lib/db/seed.ts` — One-time import script
- `src/lib/db/server-init.ts` — Server-side provider initialization
- `drizzle.config.ts` — Drizzle Kit configuration

### 2. Feature Flag for Provider Selection

**Environment variable:** `DATABASE_PROVIDER`

| Value | Behavior |
|-------|----------|
| `memory` (default) | In-memory TypeScript data (current behavior) |
| `sqlite` | SQLite database (requires seed.ts first) |

**Updated:** `src/lib/data/accessor.ts` — exports `setCasinoDataProvider()` for server-side initialization. The SQLite provider is loaded via dynamic import in `server-init.ts`, ensuring it never reaches client bundles.

### 3. Schema Enhancement: Re-Verification Cadence

**Added to:** `src/lib/types/casino.ts`

New optional field on `CasinoSchema`:
```typescript
verificationCadence?: Record<string, {
  lastVerified: string;  // ISO datetime
  intervalDays: number;  // Days until re-verification needed
}>
```

**Field categories and default intervals:**
| Category | Fields | Interval |
|----------|--------|----------|
| Licensing | license, verificationStatus | 90 days |
| Payments | paymentMethods, minDeposit, withdrawalProcessingTime | 30 days |
| Bonuses | bonuses, wageringRequirement | 14 days |
| Games | games, providers | 60 days |
| Compliance | responsibleGambling, kycRequired | 90 days |
| Static | owner, founded, website | 365 days |

### 4. Import Script

**Command:** `npm run db:seed`

What it does:
1. Reads all 49 verified casinos from existing TS data files
2. Validates using existing `validateAndImport` infrastructure
3. Creates SQLite database with proper schema and indexes
4. Inserts all casinos with serialized JSON columns
5. Calculates `verificationCadence` based on field volatility

**Database indexes created:**
- `idx_casinos_status` — on `status` column
- `idx_casinos_verification` — on `verificationStatus` column
- `idx_casinos_slug` — on `slug` column
- `idx_casinos_lastVerified` — on `lastVerifiedAt` column

## What Was NOT Changed

- **No UI changes** — all routes and components remain untouched
- **No affiliate logic changes** — tracking URLs, commission logic unchanged
- **No B2B pricing changes** — pricing module untouched
- **No SEO content changes** — metadata, sitemaps unchanged
- **In-memory provider remains default** — zero impact on existing development workflow

## How to Use

### Development (default — no changes needed)

```bash
npm run dev  # Uses in-memory provider (same as before)
```

### Switch to SQLite Provider

```bash
# 1. Seed the database
npm run db:seed

# 2. Start with SQLite provider
DATABASE_PROVIDER=sqlite npm run dev
```

### Verify Database

```bash
# Check database exists and has data
ls -la casino.db

# Use Drizzle Studio (if installed)
npm run db:studio
```

## Files Changed/Created

| File | Action | Description |
|------|--------|-------------|
| `docs/adr-001-sqlite-data-provider.md` | Created | Architecture Decision Record |
| `src/lib/db/schema.ts` | Created | Drizzle schema definition |
| `src/lib/db/index.ts` | Created | Database module barrel export |
| `src/lib/db/db-provider.ts` | Created | CasinoDataProvider implementation |
| `src/lib/db/seed.ts` | Created | Import script |
| `src/lib/db/server-init.ts` | Created | Server-side provider initialization |
| `drizzle.config.ts` | Created | Drizzle Kit configuration |
| `src/lib/data/accessor.ts` | Modified | Added setCasinoDataProvider export |
| `src/lib/types/casino.ts` | Modified | Added VerificationCadence types (optional) |
| `package.json` | Modified | Added db:seed and db:studio scripts |
| `.gitignore` | Modified | Added *.db files |

## Test Results

```bash
npm run lint          # ✅ Pass
npx tsc --noEmit      # ✅ Pass
npm test              # ✅ Pass (316 tests across 19 files)
npm run build         # ✅ Pass
```

## Migration Path to Phase 30+

When ready to scale to 1,000+ brands:
1. The `CasinoDataProvider` interface is already database-ready
2. Call `initializeServerDataProvider()` from server components to activate SQLite
3. Swap `createDbProvider()` implementation from SQLite to PostgreSQL
4. Use Drizzle migrations to evolve schema without data loss
5. The `verificationCadence` field enables automated re-verification workflows

## Next Phase

**Phase 26 — Trust / Player Systems**

Close the biggest competitive gap: add player review and complaint schemas, submission forms, and aggregate displays on casino pages.
