import { describe, it, expect } from "vitest";
import { createGermanyProvider, getGermanyFixtures } from "@/lib/data/germany-provider";
import { validateAndImport, isProductionReady } from "@/lib/data/import";

describe("Germany Data Gating", () => {
  const provider = createGermanyProvider();

  it("all production /de/ casinos are verified", () => {
    const productionCasinos = provider.getAllCasinos();
    expect(productionCasinos.length).toBeGreaterThan(0);
    productionCasinos.forEach(casino => {
      expect(casino.verificationStatus).toBe("verified");
    });
  });

  it("all verified casinos pass isProductionReady", () => {
    const fixtures = getGermanyFixtures();
    fixtures.forEach(casino => {
      expect(isProductionReady(casino)).toBe(true);
    });
  });

  it("all verified casinos have proper dataSources", () => {
    const fixtures = getGermanyFixtures();
    fixtures.forEach(casino => {
      expect(casino.dataSources.length).toBeGreaterThan(0);
      expect(casino.dataSources.some(ds => ds.field === "license")).toBe(true);
    });
  });

  it("import validation correctly rejects invalid provenance", () => {
    const invalidCasino = {
      id: "fake-verified",
      slug: "fake-verified",
      name: "Fake Verified Casino",
      website: "https://fake.com",
      status: "active",
      verificationStatus: "verified", // claiming to be verified
      lastVerifiedAt: new Date().toISOString(),
      dataSources: [], // but no provenance
      rating: 95,
      licenses: [{ issuer: "Fake License", jurisdiction: "XX" }],
      countries: ["DE"],
      restrictedCountries: [],
      languages: ["en"],
      currencies: ["EUR"],
      minDeposit: 10,
      paymentMethods: [{ name: "Visa", type: "card" }],
      bonuses: [],
      games: [],
      hasLiveCasino: true,
      hasSportsBetting: false,
      kycRequired: true,
      responsibleGambling: {
        selfExclusion: true,
        depositLimits: true,
        sessionLimits: true,
        realityCheck: true,
        coolingOffPeriod: true,
      },
      affiliateOffers: [],
      review: {
        overview: "Fake",
        pros: [],
        cons: [],
        verdict: "Fake",
        score: 95,
        scoreBreakdown: {
          gameVariety: 10,
          bonusValue: 10,
          paymentSpeed: 10,
          customerSupport: 10,
          trustAndSafety: 10,
          userExperience: 10,
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = validateAndImport([invalidCasino]);
    // Should fail validation — verified casino without dataSources
    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.field === "dataSources")).toBe(true);
    // Should NOT appear in validated casinos
    expect(result.casinos).toHaveLength(0);
  });

  it("GEO filtering works for DE", () => {
    const deCasinos = provider.getCasinosByGeo("DE");
    deCasinos.forEach(casino => {
      expect(casino.countries).toContain("DE");
    });
  });

  it("all returned casinos have required fields", () => {
    const fixtures = getGermanyFixtures();
    fixtures.forEach(casino => {
      expect(casino.id).toBeTruthy();
      expect(casino.slug).toBeTruthy();
      expect(casino.name).toBeTruthy();
      expect(casino.website).toBeTruthy();
      expect(casino.licenses.length).toBeGreaterThan(0);
      expect(casino.countries.length).toBeGreaterThan(0);
    });
  });

  it("hasGermanyProductionData returns true", () => {
    const productionCasinos = provider.getAllCasinos();
    expect(productionCasinos.length).toBeGreaterThan(0);
  });

  it("all verified casinos have GGL license", () => {
    const fixtures = getGermanyFixtures();
    fixtures.forEach(casino => {
      expect(casino.licenses.some(l => l.issuer === "GGL")).toBe(true);
    });
  });

  it("no verified casino has affiliateOffers", () => {
    const fixtures = getGermanyFixtures();
    fixtures.forEach(casino => {
      expect(casino.affiliateOffers).toHaveLength(0);
    });
  });

  it("no verified casino has a numeric rating", () => {
    const fixtures = getGermanyFixtures();
    fixtures.forEach(casino => {
      expect(casino.rating).toBeNull();
    });
  });
});
