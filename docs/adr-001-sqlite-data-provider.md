# ADR-001: SQLite Data Provider for Casino Database

**Status:** Accepted  
**Date:** 2026-09-17  
**Phase:** 25 — Data Foundation

## Context

CasinoLynora currently stores all casino data in TypeScript files (in-memory arrays). This works for 49 brands but will not scale to 1,000+ brands. The `CasinoDataProvider` interface is already designed for swappable backends via `setCasinoDataProvider()`.

We need a database-backed provider that:
- Supports the full `Casino` schema (nested objects, arrays)
- Enables efficient querying by GEO, status, slug, ID
- Can be developed locally without external services
- Is swappable to PostgreSQL/other databases later

## Decision

**Use SQLite via `better-sqlite3` with Drizzle ORM.**

### Why SQLite?

| Criterion | SQLite | PostgreSQL | MongoDB |
|-----------|--------|------------|---------|
| Zero-config local dev | ✅ File-based | ❌ Requires server | ❌ Requires server |
| Production-ready | ✅ With proper setup | ✅ | ✅ |
| Migration path | → PostgreSQL | — | → PostgreSQL |
| Type safety with Drizzle | ✅ | ✅ | ✅ |
| Nested JSON support | ✅ JSON columns | ✅ JSONB | ✅ Native |
| Full-text search | ✅ FTS5 | ✅ | ✅ |

SQLite is the simplest viable option that:
1. Requires no external services for local development
2. Supports all query patterns we need (filter by GEO, status, slug)
3. Can store complex nested casino data as JSON columns
4. Has a clear migration path to PostgreSQL when needed

### Why Drizzle ORM?

- Type-safe queries matching our Zod schemas
- Excellent SQLite support
- Clean migration system
- Lightweight, no code generation step

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  casinoDb       │────▶│  DB Provider     │────▶│  SQLite File    │
│  (accessor.ts)  │     │  (db-provider.ts)│     │  (casino.db)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │
        │                        │
        ▼                        ▼
┌─────────────────┐     ┌──────────────────┐
│  Composite      │     │  Import Script   │
│  Provider       │     │  (seed DB)       │
│  (fallback)     │     │                  │
└─────────────────┘     └──────────────────┘
```

### Feature Flag

```bash
# Use in-memory TypeScript data (default)
DATABASE_PROVIDER=memory

# Use SQLite database
DATABASE_PROVIDER=sqlite
```

### Data Model

Casino data will be stored with:
- Core fields as columns (id, slug, name, status, etc.)
- Complex nested objects (licenses, paymentMethods, etc.) as JSON columns
- Proper indexes on frequently queried fields (slug, status, countries)

## Consequences

### Positive
- Zero-config local development
- Type-safe database access
- Clear path to production PostgreSQL
- Preserves all existing data fidelity

### Negative
- SQLite has limitations for concurrent writes (not an issue for our read-heavy use case)
- JSON columns are less queryable than normalized tables (acceptable for 1,000 brands)
- Need to maintain two data paths during transition (memory + sqlite)

### Risks
- **Data fidelity during import:** Mitigated by using the existing `validateAndImport` function
- **SQLite file in version control:** Mitigated by adding `*.db` to `.gitignore`
- **Performance at scale:** SQLite handles 100,000+ rows efficiently; 1,000 brands is well within capability

## Migration Path

1. Phase 25: SQLite with in-memory fallback (this ADR)
2. Phase 30+: Evaluate if PostgreSQL needed at 1,000+ brands
3. Future: If needed, swap `db-provider.ts` implementation to PostgreSQL via Drizzle

## References

- [Drizzle ORM SQLite Docs](https://orm.drizzle.team/docs/get-started/sqlite-new)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- CasinoLynora Phase 24 Competitor Intelligence Blueprint
