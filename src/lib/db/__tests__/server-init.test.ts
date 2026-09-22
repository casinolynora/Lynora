import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { initializeServerDataProvider } from "@/lib/db/server-init";
import { casinoDb, getActiveProvider } from "@/lib/data/accessor";

// ─── Phase 30C-T.1 — Server Initialization Regression ─────────────────

describe("initializeServerDataProvider", () => {
  const originalEnv = process.env.DATABASE_PROVIDER;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.DATABASE_PROVIDER;
    } else {
      process.env.DATABASE_PROVIDER = originalEnv;
    }
  });

  it("selects SQLite provider by default (no DATABASE_PROVIDER env)", async () => {
    delete process.env.DATABASE_PROVIDER;
    await initializeServerDataProvider();
    const casinos = casinoDb.getAllCasinos();
    expect(casinos.length).toBe(138);
    for (const c of casinos) {
      expect(c.status).toBe("active");
      expect(c.verificationStatus).toBe("verified");
    }
  });

  it("is idempotent — calling twice does not create duplicate connections", async () => {
    delete process.env.DATABASE_PROVIDER;
    await initializeServerDataProvider();
    const firstCount = casinoDb.getAllCasinos().length;
    await initializeServerDataProvider();
    const secondCount = casinoDb.getAllCasinos().length;
    expect(firstCount).toBe(secondCount);
    expect(firstCount).toBe(138);
  });

  it("active accessor resolves through the initialized provider", async () => {
    delete process.env.DATABASE_PROVIDER;
    await initializeServerDataProvider();
    const active = getActiveProvider();
    const fromAccessor = casinoDb.getAllCasinos();
    const fromActive = active.getAllCasinos();
    expect(fromAccessor.length).toBe(fromActive.length);
    expect(fromAccessor.map((c) => c.id).sort()).toEqual(
      fromActive.map((c) => c.id).sort()
    );
  });

  it("does not silently fall back to 49-casino composite dataset", async () => {
    delete process.env.DATABASE_PROVIDER;
    await initializeServerDataProvider();
    const casinos = casinoDb.getAllCasinos();
    expect(casinos.length).toBeGreaterThan(49);
  });

  it("GEO-specific queries work after initialization", async () => {
    delete process.env.DATABASE_PROVIDER;
    await initializeServerDataProvider();
    const de = casinoDb.getCasinosByGeo("DE");
    expect(de.length).toBeGreaterThan(0);
    for (const c of de) {
      expect(c.countries).toContain("DE");
    }
  });
});
