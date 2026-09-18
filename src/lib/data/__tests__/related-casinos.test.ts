import { describe, it, expect } from "vitest";
import { casinoDb } from "@/lib/data/accessor";

describe("Related Casinos — Payment Overlap", () => {
  const allCasinos = casinoDb.getAllCasinos();

  it("getRelatedCasinos returns results for any valid casino", () => {
    for (const casino of allCasinos.slice(0, 5)) {
      const related = casinoDb.getRelatedCasinos(casino.id, 4);
      expect(related.length).toBeGreaterThan(0);
      expect(related.length).toBeLessThanOrEqual(4);
    }
  });

  it("related casinos do not include the source casino", () => {
    for (const casino of allCasinos.slice(0, 5)) {
      const related = casinoDb.getRelatedCasinos(casino.id, 4);
      const ids = related.map(r => r.id);
      expect(ids).not.toContain(casino.id);
    }
  });

  it("related casinos are all verified and active", () => {
    for (const casino of allCasinos.slice(0, 5)) {
      const related = casinoDb.getRelatedCasinos(casino.id, 4);
      for (const r of related) {
        expect(r.status).toBe("active");
        expect(r.verificationStatus).toBe("verified");
      }
    }
  });

  it("returns deterministic results for same input", () => {
    const casino = allCasinos[0];
    const related1 = casinoDb.getRelatedCasinos(casino.id, 4);
    const related2 = casinoDb.getRelatedCasinos(casino.id, 4);
    expect(related1.map(r => r.id)).toEqual(related2.map(r => r.id));
  });

  it("returns top-rated casinos when casino ID not found", () => {
    const related = casinoDb.getRelatedCasinos("nonexistent-id", 4);
    expect(related.length).toBeGreaterThan(0);
    // Should be sorted by rating
    for (let i = 1; i < related.length; i++) {
      expect((related[i - 1].rating ?? 0)).toBeGreaterThanOrEqual((related[i].rating ?? 0));
    }
  });

  it("related casinos have payment methods", () => {
    for (const casino of allCasinos.slice(0, 3)) {
      const related = casinoDb.getRelatedCasinos(casino.id, 4);
      for (const r of related) {
        expect(Array.isArray(r.paymentMethods)).toBe(true);
      }
    }
  });
});
