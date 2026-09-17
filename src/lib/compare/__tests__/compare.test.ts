/**
 * Comparison Engine Tests
 *
 * Tests for: data model, sorting, difference detection,
 * payment overlap, slug validation, URL building.
 */

import { describe, it, expect } from "vitest";
import {
  toComparisonCasino,
  sortCasinos,
  detectDifferences,
  calculatePaymentOverlap,
  validateComparisonSlugs,
  buildComparisonUrl,
  COMPARISON_CATEGORIES,
  MAX_COMPARECasinos,
} from "../index";
import type { Casino } from "@/lib/types";

// ─── Test Fixtures ────────────────────────────────────────────────────────

const makeCasino = (overrides: Partial<Casino> = {}): Casino =>
  ({
    id: overrides.id ?? "test-1",
    slug: overrides.slug ?? "test-casino-1",
    name: overrides.name ?? "Test Casino 1",
    website: "https://test1.com",
    status: "active",
    verificationStatus: "verified",
    lastVerifiedAt: "2026-01-15T10:00:00Z",
    rating: overrides.rating ?? 85,
    tagline: "A great casino",
    logo: null,
    heroImage: null,
    founded: 2020,
    owner: "Test Operator Ltd",
    licenses: [
      { issuer: "Malta Gaming Authority", jurisdiction: "MT", status: "active" },
    ],
    languages: ["en", "de"],
    currencies: ["EUR", "USD"],
    countries: ["DE", "NL", "AT"],
    minDeposit: overrides.minDeposit ?? 20,
    maxDeposit: overrides.maxDeposit ?? 5000,
    minWithdrawal: overrides.minWithdrawal ?? 20,
    maxWithdrawal: 10000,
    withdrawalProcessingTime: "24-48 hours",
    payoutPercentage: 96.5,
    hasLiveCasino: true,
    hasSportsBetting: false,
    hasCrypto: true,
    hasMobile: true,
    kycRequired: true,
    minAge: 18,
    paymentMethods: [
      { name: "Visa", type: "card" },
      { name: "Mastercard", type: "card" },
      { name: "PayPal", type: "e-wallet" },
      { name: "Skrill", type: "e-wallet" },
    ],
    withdrawalMethods: ["Visa", "PayPal", "Skrill"],
    games: [
      { name: "Slots", available: true, count: 500 },
      { name: "Table Games", available: true, count: 50 },
      { name: "Live Casino", available: true, count: 30 },
      { name: "Sports Betting", available: false, count: 0 },
    ],
    bonuses: [
      {
        type: "Welcome Bonus",
        title: "100% up to €500",
        amount: "100% up to €500",
        wageringRequirement: "35x",
        minDeposit: 20,
      },
    ],
    responsibleGambling: {
      selfExclusion: true,
      depositLimits: true,
      sessionLimits: true,
      realityCheck: true,
      coolingOffPeriod: true,
    },
    affiliateOffers: [],
    seoMetadata: null,
    faqs: [],
    relatedCasinos: [],
    relatedGuides: [],
    ...overrides,
  } as Casino);

const makeCasino2 = (overrides: Partial<Casino> = {}): Casino =>
  makeCasino({
    id: "test-2",
    slug: "test-casino-2",
    name: "Test Casino 2",
    rating: 72,
    minDeposit: 10,
    maxDeposit: 3000,
    minWithdrawal: 10,
    owner: "Other Operator AG",
    licenses: [
      { issuer: "Curaçao eGaming", jurisdiction: "CW", status: "active" },
    ],
    paymentMethods: [
      { name: "Visa", type: "card" },
      { name: "Mastercard", type: "card" },
      { name: "Neteller", type: "e-wallet" },
    ],
    withdrawalMethods: ["Visa", "Neteller"],
    countries: ["DE", "NL", "BE"],
    hasLiveCasino: false,
    hasCrypto: false,
    ...overrides,
  });

const makeCasino3 = (overrides: Partial<Casino> = {}): Casino =>
  makeCasino({
    id: "test-3",
    slug: "test-casino-3",
    name: "Test Casino 3",
    rating: 92,
    minDeposit: 50,
    maxDeposit: 10000,
    paymentMethods: [
      { name: "Visa", type: "card" },
      { name: "PayPal", type: "e-wallet" },
    ],
    countries: ["DE"],
    hasLiveCasino: true,
    hasSportsBetting: true,
    ...overrides,
  });

// ─── toComparisonCasino ───────────────────────────────────────────────────

describe("toComparisonCasino", () => {
  it("transforms a Casino to ComparisonCasino", () => {
    const casino = makeCasino();
    const comparison = toComparisonCasino(casino);

    expect(comparison.id).toBe("test-1");
    expect(comparison.slug).toBe("test-casino-1");
    expect(comparison.name).toBe("Test Casino 1");
    expect(comparison.editorialScore).toBe(85);
    expect(comparison.minDeposit).toBe(20);
    expect(comparison.maxDeposit).toBe(5000);
    expect(comparison.hasLiveCasino).toBe(true);
    expect(comparison.hasCrypto).toBe(true);
  });

  it("includes player rating when provided", () => {
    const casino = makeCasino();
    const comparison = toComparisonCasino(casino, { average: 4.2, count: 150 });

    expect(comparison.playerRating).toBe(4.2);
    expect(comparison.playerReviewCount).toBe(150);
  });

  it("defaults player rating to null when not provided", () => {
    const casino = makeCasino();
    const comparison = toComparisonCasino(casino);

    expect(comparison.playerRating).toBeNull();
    expect(comparison.playerReviewCount).toBe(0);
  });

  it("extracts primary license", () => {
    const casino = makeCasino();
    const comparison = toComparisonCasino(casino);

    expect(comparison.primaryLicense).toEqual({
      issuer: "Malta Gaming Authority",
      jurisdiction: "MT",
      status: "active",
    });
  });

  it("extracts first bonus as primary", () => {
    const casino = makeCasino();
    const comparison = toComparisonCasino(casino);

    expect(comparison.primaryBonus).toEqual({
      type: "Welcome Bonus",
      title: "100% up to €500",
      amount: "100% up to €500",
      wageringRequirement: "35x",
      minDeposit: 20,
    });
  });

  it("returns null for bonus when none exist", () => {
    const casino = makeCasino({ bonuses: [] });
    const comparison = toComparisonCasino(casino);

    expect(comparison.primaryBonus).toBeNull();
  });

  it("maps payment method names", () => {
    const casino = makeCasino();
    const comparison = toComparisonCasino(casino);

    expect(comparison.paymentMethodNames).toEqual([
      "Visa",
      "Mastercard",
      "PayPal",
      "Skrill",
    ]);
  });

  it("maps game categories", () => {
    const casino = makeCasino();
    const comparison = toComparisonCasino(casino);

    expect(comparison.gameCategories).toEqual([
      "Slots",
      "Table Games",
      "Live Casino",
    ]);
  });

  it("copies responsible gambling flags", () => {
    const casino = makeCasino();
    const comparison = toComparisonCasino(casino);

    expect(comparison.responsibleGambling.selfExclusion).toBe(true);
    expect(comparison.responsibleGambling.depositLimits).toBe(true);
    expect(comparison.responsibleGambling.realityCheck).toBe(true);
  });
});

// ─── sortCasinos ──────────────────────────────────────────────────────────

describe("sortCasinos", () => {
  const casinos = [
    toComparisonCasino(makeCasino({ rating: 85, minDeposit: 20, slug: "a", name: "Alpha" })),
    toComparisonCasino(makeCasino({ rating: 72, minDeposit: 10, slug: "b", name: "Beta" })),
    toComparisonCasino(makeCasino({ rating: 92, minDeposit: 50, slug: "c", name: "Gamma" })),
  ];

  it("sorts by editorial score descending", () => {
    const sorted = sortCasinos(casinos, "editorialScore", "desc");
    expect(sorted.map((c) => c.editorialScore)).toEqual([92, 85, 72]);
  });

  it("sorts by editorial score ascending", () => {
    const sorted = sortCasinos(casinos, "editorialScore", "asc");
    expect(sorted.map((c) => c.editorialScore)).toEqual([72, 85, 92]);
  });

  it("sorts by min deposit descending", () => {
    const sorted = sortCasinos(casinos, "minDeposit", "desc");
    expect(sorted.map((c) => c.minDeposit)).toEqual([50, 20, 10]);
  });

  it("sorts by min deposit ascending", () => {
    const sorted = sortCasinos(casinos, "minDeposit", "asc");
    expect(sorted.map((c) => c.minDeposit)).toEqual([10, 20, 50]);
  });

  it("sorts by name alphabetically", () => {
    const sorted = sortCasinos(casinos, "name", "asc");
    expect(sorted.map((c) => c.name)).toEqual(["Alpha", "Beta", "Gamma"]);
  });

  it("sorts by name reverse alphabetically", () => {
    const sorted = sortCasinos(casinos, "name", "desc");
    expect(sorted.map((c) => c.name)).toEqual(["Gamma", "Beta", "Alpha"]);
  });

  it("handles null editorial scores gracefully", () => {
    const withNull = [
      toComparisonCasino(makeCasino({ rating: 85, slug: "a" })),
      { ...toComparisonCasino(makeCasino({ slug: "b" })), editorialScore: null },
      toComparisonCasino(makeCasino({ rating: 72, slug: "c" })),
    ];
    const sorted = sortCasinos(withNull, "editorialScore", "desc");
    expect(sorted[0].editorialScore).toBe(85);
    expect(sorted[2].editorialScore).toBeNull();
  });

  it("handles null min deposit gracefully", () => {
    const withNull = [
      toComparisonCasino(makeCasino({ minDeposit: 20, slug: "a" })),
      { ...toComparisonCasino(makeCasino({ slug: "b" })), minDeposit: null },
    ];
    const sorted = sortCasinos(withNull, "minDeposit", "asc");
    expect(sorted[0].minDeposit).toBe(20);
    expect(sorted[1].minDeposit).toBeNull();
  });

  it("does not mutate original array", () => {
    const original = [...casinos];
    sortCasinos(casinos, "editorialScore", "desc");
    expect(casinos).toEqual(original);
  });
});

// ─── detectDifferences ────────────────────────────────────────────────────

describe("detectDifferences", () => {
  it("returns empty array for single casino", () => {
    const casinos = [toComparisonCasino(makeCasino())];
    expect(detectDifferences(casinos)).toEqual([]);
  });

  it("detects min deposit difference", () => {
    const casinos = [
      toComparisonCasino(makeCasino({ minDeposit: 20 })),
      toComparisonCasino(makeCasino2({ minDeposit: 10 })),
    ];
    const diffs = detectDifferences(casinos);
    const depositDiff = diffs.find((d) => d.field === "minDeposit");
    expect(depositDiff).toBeDefined();
    expect(depositDiff!.values).toHaveLength(2);
  });

  it("detects payment method count difference", () => {
    const casinos = [
      toComparisonCasino(makeCasino()),  // 4 payment methods
      toComparisonCasino(makeCasino2({
        paymentMethods: [
          { name: "Visa", type: "card" },
        ],
      })),  // 1 payment method
    ];
    const diffs = detectDifferences(casinos);
    const paymentDiff = diffs.find((d) => d.field === "paymentMethods");
    expect(paymentDiff).toBeDefined();
  });

  it("detects license difference", () => {
    const casinos = [
      toComparisonCasino(makeCasino()),  // Malta
      toComparisonCasino(makeCasino2()), // Curaçao
    ];
    const diffs = detectDifferences(casinos);
    const licenseDiff = diffs.find((d) => d.field === "license");
    expect(licenseDiff).toBeDefined();
    expect(licenseDiff!.values).toHaveLength(2);
  });

  it("detects GEO availability difference", () => {
    const casinos = [
      toComparisonCasino(makeCasino()),  // DE, NL, AT (3 countries)
      toComparisonCasino(makeCasino3()), // DE (1 country)
    ];
    const diffs = detectDifferences(casinos);
    const geoDiff = diffs.find((d) => d.field === "supportedGeos");
    expect(geoDiff).toBeDefined();
  });

  it("detects responsible gambling differences", () => {
    const casinos = [
      toComparisonCasino(makeCasino()),  // all true
      toComparisonCasino(makeCasino2({
        responsibleGambling: {
          selfExclusion: true,
          depositLimits: false,
          sessionLimits: false,
          realityCheck: false,
          coolingOffPeriod: false,
        },
      })),
    ];
    const diffs = detectDifferences(casinos);
    const rgDiffs = diffs.filter((d) =>
      ["depositLimits", "realityCheck", "coolingOffPeriod"].includes(d.field)
    );
    expect(rgDiffs.length).toBeGreaterThanOrEqual(1);
  });

  it("returns empty for identical casinos", () => {
    const casino = makeCasino();
    const casinos = [
      toComparisonCasino(casino),
      toComparisonCasino(casino),
    ];
    const diffs = detectDifferences(casinos);
    expect(diffs).toEqual([]);
  });
});

// ─── calculatePaymentOverlap ──────────────────────────────────────────────

describe("calculatePaymentOverlap", () => {
  it("finds common payment methods", () => {
    const casinos = [
      toComparisonCasino(makeCasino()),
      toComparisonCasino(makeCasino2()),
    ];
    const result = calculatePaymentOverlap(casinos);

    expect(result.common).toContain("Visa");
    expect(result.common).toContain("Mastercard");
  });

  it("identifies unique methods per casino", () => {
    const casinos = [
      toComparisonCasino(makeCasino()),
      toComparisonCasino(makeCasino2()),
    ];
    const result = calculatePaymentOverlap(casinos);

    const casino1Unique = result.unique.find((u) => u.casinoId === "test-1");
    expect(casino1Unique?.methods).toContain("PayPal");
    expect(casino1Unique?.methods).toContain("Skrill");

    const casino2Unique = result.unique.find((u) => u.casinoId === "test-2");
    expect(casino2Unique?.methods).toContain("Neteller");
  });

  it("returns empty for no common methods", () => {
    const casinos = [
      toComparisonCasino(makeCasino({
        paymentMethods: [
          { name: "PayPal", type: "e-wallet" },
        ],
      })),
      toComparisonCasino(makeCasino2({
        paymentMethods: [
          { name: "Skrill", type: "e-wallet" },
        ],
      })),
    ];
    const result = calculatePaymentOverlap(casinos);
    expect(result.common).toEqual([]);
  });

  it("returns empty for empty input", () => {
    const result = calculatePaymentOverlap([]);
    expect(result.common).toEqual([]);
    expect(result.unique).toEqual([]);
  });

  it("all methods are common when only one casino", () => {
    const casinos = [toComparisonCasino(makeCasino())];
    const result = calculatePaymentOverlap(casinos);
    expect(result.common).toEqual(["Visa", "Mastercard", "PayPal", "Skrill"]);
  });
});

// ─── validateComparisonSlugs ──────────────────────────────────────────────

describe("validateComparisonSlugs", () => {
  const allSlugs = ["casino-a", "casino-b", "casino-c", "casino-d", "casino-e", "casino-f"];

  it("returns empty array for undefined input", () => {
    expect(validateComparisonSlugs(undefined, allSlugs)).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(validateComparisonSlugs("", allSlugs)).toEqual([]);
  });

  it("validates valid slugs", () => {
    expect(validateComparisonSlugs("casino-a,casino-b", allSlugs)).toEqual([
      "casino-a",
      "casino-b",
    ]);
  });

  it("filters invalid slugs", () => {
    expect(validateComparisonSlugs("casino-a,invalid,casino-b", allSlugs)).toEqual([
      "casino-a",
      "casino-b",
    ]);
  });

  it("deduplicates slugs", () => {
    expect(validateComparisonSlugs("casino-a,casino-a,casino-b", allSlugs)).toEqual([
      "casino-a",
      "casino-b",
    ]);
  });

  it("respects MAX_COMPARECasinos limit", () => {
    const manySlugs = "casino-a,casino-b,casino-c,casino-d,casino-e,casino-f";
    const result = validateComparisonSlugs(manySlugs, allSlugs);
    expect(result.length).toBeLessThanOrEqual(MAX_COMPARECasinos);
  });

  it("trims whitespace from slugs", () => {
    expect(validateComparisonSlugs(" casino-a , casino-b ", allSlugs)).toEqual([
      "casino-a",
      "casino-b",
    ]);
  });

  it("lowercases slugs", () => {
    expect(validateComparisonSlugs("Casino-A,CASINO-B", allSlugs)).toEqual([
      "casino-a",
      "casino-b",
    ]);
  });
});

// ─── buildComparisonUrl ───────────────────────────────────────────────────

describe("buildComparisonUrl", () => {
  it("builds URL with sorted slugs", () => {
    expect(buildComparisonUrl(["casino-b", "casino-a"])).toBe(
      "/compare?casinos=casino-a,casino-b"
    );
  });

  it("handles single slug", () => {
    expect(buildComparisonUrl(["casino-a"])).toBe("/compare?casinos=casino-a");
  });

  it("sorts slugs alphabetically", () => {
    expect(buildComparisonUrl(["z-casino", "a-casino", "m-casino"])).toBe(
      "/compare?casinos=a-casino,m-casino,z-casino"
    );
  });
});

// ─── Comparison Categories ────────────────────────────────────────────────

describe("COMPARISON_CATEGORIES", () => {
  it("has expected categories", () => {
    expect(COMPARISON_CATEGORIES.length).toBeGreaterThanOrEqual(6);

    const ids = COMPARISON_CATEGORIES.map((c) => c.id);
    expect(ids).toContain("overall");
    expect(ids).toContain("trust");
    expect(ids).toContain("bonuses");
    expect(ids).toContain("payments");
    expect(ids).toContain("games");
    expect(ids).toContain("features");
  });

  it("each category has fields", () => {
    for (const cat of COMPARISON_CATEGORIES) {
      expect(cat.fields.length).toBeGreaterThan(0);
    }
  });

  it("each field has getValue function", () => {
    const casino = toComparisonCasino(makeCasino());
    for (const cat of COMPARISON_CATEGORIES) {
      for (const field of cat.fields) {
        expect(typeof field.getValue).toBe("function");
        const value = field.getValue(casino);
        expect(value).toBeDefined();
      }
    }
  });

  it("getValue functions produce consistent results", () => {
    const casino = toComparisonCasino(makeCasino());
    for (const cat of COMPARISON_CATEGORIES) {
      for (const field of cat.fields) {
        const value1 = field.getValue(casino);
        const value2 = field.getValue(casino);
        expect(value1).toEqual(value2);
      }
    }
  });
});

// ─── Constants ────────────────────────────────────────────────────────────

describe("Comparison Constants", () => {
  it("MAX_COMPARECasinos is 5", () => {
    expect(MAX_COMPARECasinos).toBe(5);
  });
});

// ─── Integration Test ─────────────────────────────────────────────────────

describe("Comparison Engine Integration", () => {
  it("full comparison workflow produces valid output", () => {
    const casinos = [
      makeCasino(),
      makeCasino2(),
      makeCasino3(),
    ];

    // Transform to view models
    const comparisonCasinos = casinos.map((c) => toComparisonCasino(c));

    // Sort by editorial score
    const sorted = sortCasinos(comparisonCasinos, "editorialScore", "desc");
    expect(sorted[0].editorialScore).toBe(92);
    expect(sorted[sorted.length - 1].editorialScore).toBe(72);

    // Detect differences
    const diffs = detectDifferences(sorted);
    expect(diffs.length).toBeGreaterThan(0);

    // Calculate payment overlap
    const overlap = calculatePaymentOverlap(sorted);
    expect(overlap.common.length).toBeGreaterThan(0);

    // Validate all categories produce formatted output
    for (const casino of sorted) {
      for (const cat of COMPARISON_CATEGORIES) {
        for (const field of cat.fields) {
          const value = field.getValue(casino);
          if (field.format) {
            const formatted = field.format(value);
            expect(typeof formatted).toBe("string");
            expect(formatted.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});
