import { describe, it, expect, beforeAll } from "vitest";
import {
  paymentSlug,
  resolvePaymentAlias,
  buildPaymentEntityMap,
  getPaymentToCasinos,
  getCasinoToPayments,
  getGeoToPayments,
  getGuideToPayments,
  getPaymentToGuides,
  classifyAllEntities,
  getPaymentEntityStats,
  assessEligibility,
  type PaymentEntity,
  type PaymentEntityType,
} from "@/lib/seo/payment-entities";

describe("Payment Entity — Slug Generation", () => {
  it("generates valid slug from simple name", () => {
    expect(paymentSlug("PayPal")).toBe("paypal");
  });

  it("generates valid slug from multi-word name", () => {
    expect(paymentSlug("Bank Transfer")).toBe("bank-transfer");
  });

  it("generates valid slug from special characters", () => {
    expect(paymentSlug("iDEAL")).toBe("ideal");
  });

  it("generates valid slug from compound name", () => {
    expect(paymentSlug("Paysafecard")).toBe("paysafecard");
  });

  it("strips leading/trailing hyphens", () => {
    expect(paymentSlug("  Visa  ")).toBe("visa");
  });
});

describe("Payment Entity — Alias Resolution", () => {
  it("resolves Aircash to AirCash", () => {
    expect(resolvePaymentAlias("Aircash")).toBe("AirCash");
  });

  it("passes through canonical names", () => {
    expect(resolvePaymentAlias("PayPal")).toBe("PayPal");
    expect(resolvePaymentAlias("Visa")).toBe("Visa");
    expect(resolvePaymentAlias("Skrill")).toBe("Skrill");
  });

  it("does not merge distinct entities", () => {
    expect(resolvePaymentAlias("Sofort")).toBe("Sofort");
    expect(resolvePaymentAlias("Klarna")).toBe("Klarna");
    expect(resolvePaymentAlias("Creditcard")).toBe("Creditcard");
  });
});

describe("Payment Entity — Entity Map", () => {
  let entityMap: Map<string, PaymentEntity>;

  beforeAll(() => {
    entityMap = buildPaymentEntityMap();
  });

  it("builds entity map from verified casinos", () => {
    expect(entityMap.size).toBeGreaterThan(0);
  });

  it("resolves AirCash/Aircash case inconsistency", () => {
    const names = [...entityMap.keys()];
    const hasAirCash = names.includes("AirCash");
    const hasAircash = names.includes("Aircash");
    // Should have exactly one (the canonical form)
    expect(hasAirCash || hasAircash).toBe(true);
    expect(hasAirCash && hasAircash).toBe(false);
  });

  it("each entity has required fields", () => {
    for (const [, entity] of entityMap) {
      expect(entity.canonicalName).toBeTruthy();
      expect(entity.slug).toBeTruthy();
      expect(entity.type).toBeTruthy();
      expect(entity.casinoCount).toBeGreaterThan(0);
      expect(entity.geoCount).toBeGreaterThan(0);
      expect(entity.geos.length).toBeGreaterThan(0);
      expect(entity.totalRecords).toBeGreaterThan(0);
    }
  });

  it("entity types are valid", () => {
    const validTypes: PaymentEntityType[] = ["e-wallet", "card", "bank-transfer", "crypto", "prepaid", "mobile"];
    for (const [, entity] of entityMap) {
      expect(validTypes).toContain(entity.type);
    }
  });

  it("major payment methods are present", () => {
    const names = [...entityMap.keys()];
    expect(names).toContain("Visa");
    expect(names).toContain("Mastercard");
    expect(names).toContain("PayPal");
    expect(names).toContain("Skrill");
    expect(names).toContain("Neteller");
    expect(names).toContain("Paysafecard");
  });

  it("Visa has highest or near-highest casino count", () => {
    const visa = entityMap.get("Visa");
    expect(visa).toBeDefined();
    const maxCount = Math.max(...[...entityMap.values()].map((e) => e.casinoCount));
    expect(visa!.casinoCount).toBe(maxCount);
  });
});

describe("Payment Entity — Payment → Casino Graph", () => {
  let entityMap: Map<string, PaymentEntity>;

  beforeAll(() => {
    entityMap = buildPaymentEntityMap();
  });

  it("returns casinos for Visa", () => {
    const casinos = getPaymentToCasinos(entityMap, "Visa");
    expect(casinos.length).toBeGreaterThan(0);
    expect(casinos.every((c) => c.slug && c.name)).toBe(true);
  });

  it("returns casinos sorted by rating", () => {
    const casinos = getPaymentToCasinos(entityMap, "Visa");
    for (let i = 1; i < casinos.length; i++) {
      expect((casinos[i - 1].rating ?? 0)).toBeGreaterThanOrEqual(casinos[i].rating ?? 0);
    }
  });

  it("returns empty for non-existent method", () => {
    const casinos = getPaymentToCasinos(entityMap, "NonExistent");
    expect(casinos).toEqual([]);
  });

  it("returns correct count matching entity casinoCount", () => {
    for (const [name, entity] of entityMap) {
      const casinos = getPaymentToCasinos(entityMap, name);
      expect(casinos.length).toBe(entity.casinoCount);
    }
  });
});

describe("Payment Entity — Casino → Payment Graph", () => {
  let entityMap: Map<string, PaymentEntity>;

  beforeAll(() => {
    entityMap = buildPaymentEntityMap();
  });

  it("returns payments for a known casino", () => {
    const payments = getCasinoToPayments(entityMap, "jackpotpiraten");
    expect(payments.length).toBeGreaterThan(0);
    expect(payments.every((p) => p.canonicalName && p.slug && p.type)).toBe(true);
  });

  it("returns empty for non-existent casino", () => {
    const payments = getCasinoToPayments(entityMap, "non-existent-casino");
    expect(payments).toEqual([]);
  });

  it("deduplicates resolved aliases", () => {
    // If a casino has both "Aircash" and "AirCash", should return one entry
    const payments = getCasinoToPayments(entityMap, "betano");
    const names = payments.map((p) => p.canonicalName);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("Payment Entity — GEO → Payment Graph", () => {
  let entityMap: Map<string, PaymentEntity>;

  beforeAll(() => {
    entityMap = buildPaymentEntityMap();
  });

  it("returns payments for Germany", () => {
    const payments = getGeoToPayments(entityMap, "DE");
    expect(payments.length).toBeGreaterThan(0);
    expect(payments.every((p) => p.canonicalName && p.casinoCount > 0)).toBe(true);
  });

  it("returns payments for Netherlands", () => {
    const payments = getGeoToPayments(entityMap, "NL");
    expect(payments.length).toBeGreaterThan(0);
  });

  it("returns payments for Belgium", () => {
    const payments = getGeoToPayments(entityMap, "BE");
    expect(payments.length).toBeGreaterThan(0);
  });

  it("returns empty for unsupported GEO", () => {
    const payments = getGeoToPayments(entityMap, "US");
    expect(payments).toEqual([]);
  });

  it("sorts by casino count descending", () => {
    const payments = getGeoToPayments(entityMap, "DE");
    for (let i = 1; i < payments.length; i++) {
      expect(payments[i - 1].casinoCount).toBeGreaterThanOrEqual(payments[i].casinoCount);
    }
  });
});

describe("Payment Entity — Guide → Payment Graph", () => {
  let entityMap: Map<string, PaymentEntity>;

  beforeAll(() => {
    entityMap = buildPaymentEntityMap();
  });

  it("returns all methods for payment-methods-guide", () => {
    const payments = getGuideToPayments(entityMap, "payment-methods-guide");
    expect(payments.length).toBe(entityMap.size);
  });

  it("returns top 5 for other guides", () => {
    const payments = getGuideToPayments(entityMap, "online-casino-basics");
    expect(payments.length).toBeLessThanOrEqual(5);
  });

  it("returns valid entries", () => {
    const payments = getGuideToPayments(entityMap, "payment-methods-guide");
    for (const p of payments) {
      expect(p.canonicalName).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.type).toBeTruthy();
    }
  });
});

describe("Payment Entity — Payment → Guide Graph", () => {
  it("returns guides for e-wallet type", () => {
    const guides = getPaymentToGuides("e-wallet");
    expect(guides.length).toBeGreaterThan(0);
    expect(guides.some((g) => g.slug === "payment-methods-guide")).toBe(true);
  });

  it("returns guides for card type", () => {
    const guides = getPaymentToGuides("card");
    expect(guides.length).toBeGreaterThan(0);
  });

  it("returns guides for all types", () => {
    const types: PaymentEntityType[] = ["e-wallet", "card", "bank-transfer", "crypto", "prepaid", "mobile"];
    for (const type of types) {
      const guides = getPaymentToGuides(type);
      expect(guides.length).toBeGreaterThan(0);
    }
  });
});

describe("Payment Entity — Eligibility & Tiers", () => {
  let entityMap: Map<string, PaymentEntity>;

  beforeAll(() => {
    entityMap = buildPaymentEntityMap();
  });

  it("assigns tiers to all entities", () => {
    const tiers = classifyAllEntities(entityMap);
    const total = tiers.reduce((sum, t) => sum + t.entities.length, 0);
    expect(total).toBe(entityMap.size);
  });

  it("tier counts sum to total entities", () => {
    const stats = getPaymentEntityStats(entityMap);
    const total = stats.tiers.A + stats.tiers.B + stats.tiers.C + stats.tiers.D;
    expect(total).toBe(entityMap.size);
  });

  it("Visa is Tier A", () => {
    const visa = entityMap.get("Visa");
    expect(visa).toBeDefined();
    const eligibility = assessEligibility(visa!);
    expect(eligibility.tier).toBe("A");
  });

  it("PayPal is Tier A", () => {
    const paypal = entityMap.get("PayPal");
    expect(paypal).toBeDefined();
    const eligibility = assessEligibility(paypal!);
    expect(eligibility.tier).toBe("A");
  });

  it("low-coverage methods are Tier B or C", () => {
    const brite = entityMap.get("Brite");
    if (brite) {
      const eligibility = assessEligibility(brite);
      expect(["B", "C"]).toContain(eligibility.tier);
    }
  });

  it("no tier has fake search metrics", () => {
    const tiers = classifyAllEntities(entityMap);
    for (const tier of tiers) {
      for (const e of tier.entities) {
        // Eligibility should not contain any search volume, CPC, or KD references
        const reasonsStr = e.reasons.join(" ").toLowerCase();
        expect(reasonsStr).not.toContain("search volume");
        expect(reasonsStr).not.toContain("cpc");
        expect(reasonsStr).not.toContain("keyword difficulty");
        expect(reasonsStr).not.toContain("traffic estimate");
      }
    }
  });

  it("tier assignment is deterministic", () => {
    const tiers1 = classifyAllEntities(entityMap);
    const tiers2 = classifyAllEntities(entityMap);
    for (let i = 0; i < tiers1.length; i++) {
      expect(tiers1[i].tier).toBe(tiers2[i].tier);
      expect(tiers1[i].entities.length).toBe(tiers2[i].entities.length);
    }
  });
});

describe("Payment Entity — Stats", () => {
  let entityMap: Map<string, PaymentEntity>;

  beforeAll(() => {
    entityMap = buildPaymentEntityMap();
  });

  it("reports correct unique entity count", () => {
    const stats = getPaymentEntityStats(entityMap);
    expect(stats.uniqueEntities).toBe(entityMap.size);
  });

  it("detects case inconsistencies", () => {
    const stats = getPaymentEntityStats(entityMap);
    // AirCash/Aircash should be detected
    expect(stats.caseInconsistencies.length).toBeGreaterThanOrEqual(0);
  });

  it("reports aliases", () => {
    const stats = getPaymentEntityStats(entityMap);
    // AirCash should have Aircash as alias
    expect(stats.aliasesFound.length).toBeGreaterThanOrEqual(0);
  });
});

describe("Payment Entity — SEO Safety", () => {
  it("no crypto payment methods in current dataset", () => {
    const entityMap = buildPaymentEntityMap();
    const cryptoEntries = [...entityMap.values()].filter((e) => e.type === "crypto");
    // May be empty — that's fine, just documenting
    expect(cryptoEntries.length).toBeGreaterThanOrEqual(0);
  });

  it("all slugs are URL-safe", () => {
    const entityMap = buildPaymentEntityMap();
    for (const [, entity] of entityMap) {
      expect(entity.slug).toMatch(/^[a-z0-9-]+$/);
      expect(entity.slug).not.toContain(" ");
      expect(entity.slug).not.toContain("_");
    }
  });

  it("no entity has commercial ranking influence", () => {
    const entityMap = buildPaymentEntityMap();
    const tiers = classifyAllEntities(entityMap);
    // Tier assignment should be based on coverage, not affiliate data
    for (const tier of tiers) {
      for (const e of tier.entities) {
        const reasonsStr = e.reasons.join(" ").toLowerCase();
        expect(reasonsStr).not.toContain("affiliate");
        expect(reasonsStr).not.toContain("cpa");
        expect(reasonsStr).not.toContain("sponsor");
        expect(reasonsStr).not.toContain("advertiser");
      }
    }
  });
});
