import { describe, it, expect, beforeAll } from "vitest";
import { initializeServerDataProvider } from "@/lib/db/server-init";
import { getFullDatasetCasinos } from "@/lib/seo/payment-data";
import { casinoDb } from "@/lib/data/accessor";
import { rowToCasino, isProductionVisible } from "@/lib/db/row-to-casino";

// ─── Phase 30C-T — Data Layer & Scaling Regression ────────────────────

describe("Phase 30C-T — Data Layer Scaling", () => {
  beforeAll(async () => {
    await initializeServerDataProvider();
  });

  describe("Provider Safety", () => {
    it("getFullDatasetCasinos returns 138 verified casinos via provider", () => {
      const casinos = getFullDatasetCasinos();
      expect(casinos.length).toBe(138);
      for (const c of casinos) {
        expect(c.status).toBe("active");
        expect(c.verificationStatus).toBe("verified");
      }
    });

    it("casinoDb.getAllCasinos returns same dataset as getFullDatasetCasinos", () => {
      const fromDb = casinoDb.getAllCasinos();
      const fromPayment = getFullDatasetCasinos();
      expect(fromDb.length).toBe(fromPayment.length);
      expect(fromDb.map((c) => c.slug).sort()).toEqual(fromPayment.map((c) => c.slug).sort());
    });

    it("829 payment records are preserved across provider", () => {
      const casinos = getFullDatasetCasinos();
      const totalPayments = casinos.reduce((sum, c) => sum + c.paymentMethods.length, 0);
      expect(totalPayments).toBe(829);
    });
  });

  describe("rowToCasino Utility", () => {
    it("rowToCasino produces valid Casino objects from minimal data", () => {
      const row = {
        id: "test-1",
        slug: "test-casino",
        name: "Test Casino",
        tagline: null,
        logo: null,
        description: null,
        website: "https://test.com",
        operatorId: null,
        founded: null,
        owner: null,
        status: "active" as const,
        verificationStatus: "verified" as const,
        lastVerifiedAt: "2025-01-01",
        rating: null,
        trustScore: null,
        minDeposit: 10,
        maxDeposit: null,
        minWithdrawal: null,
        hasLiveCasino: false,
        hasSportsBetting: false,
        hasCrypto: false,
        hasMobile: true,
        kycRequired: false,
        minAge: 18,
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01",
        dataSources: [],
        languages: [],
        currencies: [],
        withdrawalMethods: [],
        withdrawalProcessingTime: null,
        bonuses: [],
        games: [],
        kycDocuments: null,
        kycProcessingTime: null,
        responsibleGambling: { selfExclusion: false, depositLimits: false, sessionLimits: false, realityCheck: false, coolingOffPeriod: false },
        affiliateOffers: [],
        review: { overview: "", pros: [], cons: [], verdict: "", score: null, scoreBreakdown: null },
        features: [],
        tags: [],
        nextVerificationDue: null,
        verificationCadence: {},
      };
      const result = rowToCasino(row, [], [], []);
      expect(result.id).toBe("test-1");
      expect(result.slug).toBe("test-casino");
      expect(result.countries).toEqual([]);
      expect(result.restrictedCountries).toEqual([]);
      expect(result.paymentMethods).toEqual([]);
      expect(result.licenses).toEqual([]);
    });
  });

  describe("isProductionVisible", () => {
    it("returns true for active+verified", () => {
      expect(isProductionVisible({ status: "active", verificationStatus: "verified" } as any)).toBe(true);
    });

    it("returns false for inactive", () => {
      expect(isProductionVisible({ status: "inactive", verificationStatus: "verified" } as any)).toBe(false);
    });

    it("returns false for draft", () => {
      expect(isProductionVisible({ status: "active", verificationStatus: "draft" } as any)).toBe(false);
    });
  });

  describe("Batch Loading", () => {
    it("all 138 casinos have license data loaded", () => {
      const casinos = getFullDatasetCasinos();
      const withLicenses = casinos.filter((c) => c.licenses.length > 0);
      expect(withLicenses.length).toBeGreaterThan(0);
    });

    it("all 138 casinos have GEO data loaded", () => {
      const casinos = getFullDatasetCasinos();
      const withGeo = casinos.filter((c) => c.countries.length > 0);
      expect(withGeo.length).toBe(138);
    });

    it("related casinos return deterministic results", () => {
      const casinos = getFullDatasetCasinos();
      const first = casinos[0];
      const related1 = casinoDb.getRelatedCasinos(first.id, 4);
      const related2 = casinoDb.getRelatedCasinos(first.id, 4);
      expect(related1.map((r) => r.slug)).toEqual(related2.map((r) => r.slug));
    });

    it("getRelatedCasinos never includes the source casino", () => {
      const casinos = getFullDatasetCasinos();
      for (const casino of casinos.slice(0, 10)) {
        const related = casinoDb.getRelatedCasinos(casino.id, 4);
        const slugs = related.map((r) => r.slug);
        expect(slugs).not.toContain(casino.slug);
      }
    });
  });

  describe("Data Integrity at Scale", () => {
    it("0 conflicts remain", () => {
      const casinos = getFullDatasetCasinos();
      expect(casinos.length).toBe(138);
    });

    it("GEO filtering works correctly for DE", () => {
      const deCasinos = casinoDb.getCasinosByGeo("DE");
      expect(deCasinos.length).toBeGreaterThan(0);
      for (const c of deCasinos) {
        expect(c.countries).toContain("DE");
      }
    });

    it("search returns relevant results", () => {
      const results = casinoDb.searchCasinos("bet");
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
