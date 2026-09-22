/**
 * Server-only payment entity data access.
 *
 * Uses the casino data provider for the full production dataset.
 * Must NEVER be imported by client components.
 *
 * IMPORTANT: This module previously opened its own SQLite connection,
 * bypassing the provider abstraction. It now delegates to casinoDb.getAllCasinos(),
 * which uses the configured provider (SQLite in production, memory in dev/test).
 */
import { casinoDb } from "@/lib/data/accessor";

/**
 * Get all verified casinos from the active data provider.
 *
 * Previously this opened a separate SQLite connection with its own N+1 queries
 * and a module-level cache that didn't work in serverless environments.
 * Now it delegates to the provider, which handles caching and batch loading.
 */
export function getFullDatasetCasinos() {
  return casinoDb.getAllCasinos();
}
