# ADR-002: Future PostgreSQL Migration

## Status

**Planned** (when scale demands it)

## Context

CasinoLynora currently uses SQLite via Drizzle ORM for its data layer. The application serves a static affiliate directory with 49 verified casinos across 3 GEOs (DE, NL, BE), growing to an expected 3,000+ brands across 15+ GEOs.

SQLite is the right choice today because:
- Zero-ops: no database server to manage during MVP
- Excellent read performance for static data (WAL mode, indexed queries)
- Drizzle ORM provides identical query API to PostgreSQL
- The normalized schema design already follows relational best practices

## Decision

**Keep SQLite for now. Migrate to PostgreSQL when any of these thresholds are met:**

1. **Concurrent write contention**: Multiple admin/editor sessions cause `SQLITE_BUSY` errors during imports
2. **Full-text search**: Need trigram indexes or tsvector-based search beyond simple LIKE queries
3. **Geographic distribution**: Need a managed database (Supabase, Neon, PlanetScale) for edge deployment
4. **Data volume**: Casino count exceeds 5,000 with complex aggregation queries
5. **Team growth**: Multiple developers need concurrent database access for testing

## Migration Path

### Step 1: Schema export (current)
```bash
npx drizzle-kit generate --name pg-migration
```

The current schema is already PostgreSQL-compatible:
- `TEXT` → `TEXT` / `VARCHAR`
- `INTEGER` (booleans) → `BOOLEAN`
- `REAL` → `DECIMAL` / `NUMERIC`
- `TEXT` (JSON) → `JSONB`
- Cascade deletes already defined

### Step 2: Provider swap
```typescript
// src/lib/db/db-provider.ts — already abstracted
if (DATABASE_PROVIDER === "postgres") {
  // Use drizzle-orm/node-postgres
}
```

### Step 3: Data migration
```bash
# Export from SQLite
sqlite3 data/casino.db .dump > backup.sql

# Import to PostgreSQL (with type casting adjustments)
psql casino_lynora < backup.sql
```

### Step 4: Environment variables
```env
DATABASE_URL=postgresql://user:pass@host:5432/casino_lynora
DATABASE_PROVIDER=postgres
```

## Consequences

### Positive
- Zero migration effort: schema is already normalized and PostgreSQL-compatible
- Provider abstraction means app code never changes
- Drizzle ORM handles dialect differences transparently
- Can run SQLite in development, PostgreSQL in production

### Negative
- JSONB columns (features, tags, verificationCadence) lose some query flexibility vs dedicated tables
- `better-sqlite3` native module must remain in dev dependencies

### Risks
- None at current scale. SQLite handles 3,000+ rows with indexed queries in <10ms.

## Testing Strategy

The scalability test (`scalability.test.ts`) validates that the schema and provider handle 100 generated casinos with full relationships. When migrating:
1. Run the same test suite against PostgreSQL
2. Compare query performance benchmarks
3. Verify all JSON field queries work identically

## References

- Drizzle ORM PostgreSQL docs: https://orm.drizzle.team/docs/get-started/postgresql-new
- SQLite vs PostgreSQL for read-heavy workloads: both handle this use case adequately
- ADR-001: SQLite Data Provider (initial decision)
