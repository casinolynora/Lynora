import { describe, it, expect } from "vitest";
import { validateAndImport, isProductionReady, getImportSummary } from "@/lib/data/import";
import { Casino } from "@/lib/types";

const now = new Date().toISOString();

function makeCasino(overrides: Partial<Casino> = {}): Casino {
  return {
    id: "test-1",
    slug: "test-casino",
    name: "Test Casino",
    website: "https://test.com",
    status: "active",
    verificationStatus: "draft",
    lastVerifiedAt: now,
    dataSources: [],
    rating: 80,
    licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
    countries: ["DE"],
    restrictedCountries: [],
    languages: ["en"],
    currencies: ["EUR"],
    minDeposit: 10,
    paymentMethods: [{ name: "Visa", type: "card" }],
    bonuses: [],
    games: [],
    hasLiveCasino: false,
    hasSportsBetting: false,
    hasCrypto: false,
    hasMobile: true,
    kycRequired: true,
    minAge: 18,
    withdrawalMethods: [],
    responsibleGambling: {
      selfExclusion: true,
      depositLimits: true,
      sessionLimits: true,
      realityCheck: true,
      coolingOffPeriod: true,
    },
    affiliateOffers: [],
    review: {
      overview: "Test",
      pros: [],
      cons: [],
      verdict: "Test",
      score: 80,
      scoreBreakdown: {
        gameVariety: 8,
        bonusValue: 8,
        paymentSpeed: 8,
        customerSupport: 8,
        trustAndSafety: 8,
        userExperience: 8,
      },
    },
    features: [],
    tags: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("validateAndImport", () => {
  it("accepts valid draft casino", () => {
    const result = validateAndImport([makeCasino()]);
    expect(result.success).toBe(true);
    expect(result.casinos).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects casino with missing required fields", () => {
    const result = validateAndImport([{ id: "bad" }]);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects verified casino without dataSources", () => {
    const casino = makeCasino({
      verificationStatus: "verified",
      dataSources: [],
    });
    const result = validateAndImport([casino]);
    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.field === "dataSources")).toBe(true);
  });

  it("rejects verified casino without licenses", () => {
    const casino = makeCasino({
      verificationStatus: "verified",
      licenses: [],
      dataSources: [{ field: "all", source: "test", verifiedAt: now }],
    });
    const result = validateAndImport([casino]);
    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.field === "licenses")).toBe(true);
  });

  it("rejects verified casino without lastVerifiedAt", () => {
    const casino = makeCasino({
      verificationStatus: "verified",
      lastVerifiedAt: "" as unknown as string,
      dataSources: [{ field: "all", source: "test", verifiedAt: now }],
    });
    const result = validateAndImport([casino]);
    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.field === "lastVerifiedAt")).toBe(true);
  });

  it("accepts verified casino with valid provenance", () => {
    const casino = makeCasino({
      verificationStatus: "verified",
      dataSources: [{ field: "all", source: "test-source", verifiedAt: now }],
      lastVerifiedAt: now,
      licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
      website: "https://verified.com",
    });
    const result = validateAndImport([casino]);
    expect(result.success).toBe(true);
    expect(result.casinos).toHaveLength(1);
  });

  it("filters out casinos not matching requiredStatus", () => {
    const draft = makeCasino({ id: "draft-1", verificationStatus: "draft" });
    const verified = makeCasino({
      id: "verified-1",
      verificationStatus: "verified",
      dataSources: [{ field: "all", source: "test", verifiedAt: now }],
    });
    const result = validateAndImport([draft, verified], { requiredStatus: "verified" });
    expect(result.casinos).toHaveLength(1);
    expect(result.casinos[0].id).toBe("verified-1");
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("normalizes slugs", () => {
    const casino = makeCasino({ slug: "My Casino Name!" });
    const result = validateAndImport([casino]);
    expect(result.casinos[0].slug).toBe("my-casino-name");
  });

  it("handles multiple casinos with mixed validity", () => {
    const good = makeCasino({ id: "good", slug: "good-casino" });
    const bad = { id: "bad" }; // missing required fields
    const result = validateAndImport([good, bad]);
    expect(result.casinos).toHaveLength(1);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe("isProductionReady", () => {
  it("returns true for active + verified casino with dataSources", () => {
    const casino = makeCasino({
      status: "active",
      verificationStatus: "verified",
      dataSources: [{ field: "all", source: "test", verifiedAt: now }],
    });
    expect(isProductionReady(casino)).toBe(true);
  });

  it("returns false for draft casino", () => {
    const casino = makeCasino({ verificationStatus: "draft" });
    expect(isProductionReady(casino)).toBe(false);
  });

  it("returns false for inactive casino", () => {
    const casino = makeCasino({
      status: "inactive",
      verificationStatus: "verified",
      dataSources: [{ field: "all", source: "test", verifiedAt: now }],
    });
    expect(isProductionReady(casino)).toBe(false);
  });

  it("returns false for verified casino without dataSources", () => {
    const casino = makeCasino({
      verificationStatus: "verified",
      dataSources: [],
    });
    expect(isProductionReady(casino)).toBe(false);
  });

  it("returns false for verified casino without licenses", () => {
    const casino = makeCasino({
      verificationStatus: "verified",
      licenses: [],
      dataSources: [{ field: "all", source: "test", verifiedAt: now }],
    });
    expect(isProductionReady(casino)).toBe(false);
  });
});

describe("getImportSummary", () => {
  it("generates summary string", () => {
    const result = validateAndImport([
      makeCasino({ id: "1", slug: "casino-a", verificationStatus: "draft" }),
      makeCasino({ id: "2", slug: "casino-b", verificationStatus: "verified", dataSources: [{ field: "all", source: "test", verifiedAt: now }] }),
    ]);
    const summary = getImportSummary(result);
    expect(summary).toContain("2 casinos processed");
    expect(summary).toContain("draft: 1");
    expect(summary).toContain("verified: 1");
  });
});

describe("Duplicate detection", () => {
  it("rejects duplicate IDs", () => {
    const casino1 = makeCasino({ id: "same-id", slug: "casino-a" });
    const casino2 = makeCasino({ id: "same-id", slug: "casino-b" });
    const result = validateAndImport([casino1, casino2]);
    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.field === "id")).toBe(true);
  });

  it("rejects duplicate slugs", () => {
    const casino1 = makeCasino({ id: "a", slug: "same-slug" });
    const casino2 = makeCasino({ id: "b", slug: "same-slug" });
    const result = validateAndImport([casino1, casino2]);
    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.field === "slug")).toBe(true);
  });

  it("rejects invalid GEO values", () => {
    const casino = makeCasino({ countries: ["INVALID_GEO"] });
    const result = validateAndImport([casino]);
    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.field === "countries")).toBe(true);
  });

  it("rejects invalid license records", () => {
    const casino = makeCasino({ licenses: [{ issuer: "", jurisdiction: "" }] });
    const result = validateAndImport([casino]);
    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.field === "licenses")).toBe(true);
  });
});
