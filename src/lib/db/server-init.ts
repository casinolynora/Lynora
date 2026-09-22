/**
 * Server-only data provider initialization.
 *
 * This module is imported ONLY on the server (in server components, route handlers,
 * or middleware). It initializes the data provider based on the DATABASE_PROVIDER
 * env var and sets it on the accessor.
 *
 * IMPORTANT: This file imports better-sqlite3 indirectly via createDbProvider.
 * It must NEVER be imported by client components or any module that reaches
 * client bundles.
 *
 * Usage in a server component or layout:
 *   import "@/lib/db/server-init";
 */

import { setCasinoDataProvider } from "@/lib/data/accessor";
import { createCompositeProvider } from "@/lib/data/composite-provider";

let initialized = false;

export async function initializeServerDataProvider(): Promise<void> {
  if (initialized) return;
  initialized = true;

  const providerType = process.env.DATABASE_PROVIDER ?? "sqlite";

  if (providerType === "sqlite") {
    try {
      // Dynamic import — only resolved on the server
      const { createDbProvider } = await import("./db-provider");
      setCasinoDataProvider(createDbProvider());
      console.log("✅ SQLite data provider initialized");
    } catch (err) {
      console.warn(
        "⚠️  SQLite provider requested but unavailable. Using in-memory provider.",
        err
      );
      setCasinoDataProvider(createCompositeProvider());
    }
  } else {
    setCasinoDataProvider(createCompositeProvider());
  }
}
