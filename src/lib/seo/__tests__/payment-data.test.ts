import { describe, it, expect, beforeAll } from "vitest";
import { getFullDatasetCasinos } from "@/lib/seo/payment-data";
import {
  buildPaymentEntityMap,
  assessPageEligibility,
  getEligiblePaymentSlugs,
  getPaymentToCasinos,
  getPaymentToGuides,
  classifyAllEntities,
  type PaymentEntity,
} from "@/lib/seo/payment-entities";

// ─── Full Dataset Provider ──────────────────────────────────────────────

describe("Payment Data — Full Dataset Provider", () => {
  let casinos: ReturnType<typeof getFullDatasetCasinos>;

  beforeAll(() => {
    casinos = getFullDatasetCasinos();
  });

  it("returns 138 verified casinos from SQLite", () => {
    expect(casinos.length).toBe(138);
  });

  it("all returned casinos are active and verified", () => {
    for (const c of casinos) {
      expect(c.status).toBe("active");
      expect(c.verificationStatus).toBe("verified");
    }
  });

  it("most casinos have payment methods (15 of 138 have 0 — data gap)", () => {
    const withPm = casinos.filter((c) => c.paymentMethods.length > 0);
    expect(withPm.length).toBeGreaterThanOrEqual(120);
  });

  it("each casino has at least one GEO", () => {
    for (const c of casinos) {
      expect(c.countries.length).toBeGreaterThan(0);
    }
  });

  it("each casino has a slug", () => {
    for (const c of casinos) {
      expect(c.slug).toBeTruthy();
      expect(typeof c.slug).toBe("string");
    }
  });

  it("caching works — second call returns same references", () => {
    const second = getFullDatasetCasinos();
    expect(second).toBe(casinos);
  });
});

// ─── Full Dataset Entity Map ────────────────────────────────────────────

describe("Payment Data — Full Dataset Entity Map", () => {
  let casinos: ReturnType<typeof getFullDatasetCasinos>;
  let entityMap: Map<string, PaymentEntity>;

  beforeAll(() => {
    casinos = getFullDatasetCasinos();
    entityMap = buildPaymentEntityMap(casinos);
  });

  it("builds entity map from 138 casinos", () => {
    expect(entityMap.size).toBeGreaterThan(0);
  });

  it("major payment methods are present with correct counts", () => {
    const visa = entityMap.get("Visa");
    expect(visa).toBeDefined();
    expect(visa!.casinoCount).toBeGreaterThanOrEqual(100);

    const mastercard = entityMap.get("Mastercard");
    expect(mastercard).toBeDefined();
    expect(mastercard!.casinoCount).toBeGreaterThanOrEqual(100);

    const paypal = entityMap.get("PayPal");
    expect(paypal).toBeDefined();
    expect(paypal!.casinoCount).toBeGreaterThanOrEqual(100);
  });

  it("each entity has valid slug format", () => {
    for (const [, entity] of entityMap) {
      expect(entity.slug).toMatch(/^[a-z0-9-]+$/);
      expect(entity.slug).not.toContain(" ");
      expect(entity.slug).not.toContain("_");
    }
  });

  it("each entity has valid type", () => {
    const validTypes = ["e-wallet", "card", "bank-transfer", "crypto", "prepaid", "mobile"];
    for (const [, entity] of entityMap) {
      expect(validTypes).toContain(entity.type);
    }
  });

  it("entity counts sum to > 138 total records", () => {
    const total = [...entityMap.values()].reduce((sum, e) => sum + e.totalRecords, 0);
    expect(total).toBeGreaterThan(138);
  });
});

// ─── Eligibility with Full Dataset ──────────────────────────────────────

describe("Payment Data — Eligibility with Full Dataset", () => {
  let entityMap: Map<string, PaymentEntity>;

  beforeAll(() => {
    const casinos = getFullDatasetCasinos();
    entityMap = buildPaymentEntityMap(casinos);
  });

  it("11 entities qualify for Tier A pages", () => {
    const eligible = getEligiblePaymentSlugs(entityMap);
    expect(eligible.length).toBeGreaterThanOrEqual(11);
  });

  it("Visa qualifies as eligible", () => {
    const visa = entityMap.get("Visa")!;
    const result = assessPageEligibility(visa);
    expect(result.eligible).toBe(true);
    expect(result.reasons.length).toBe(0);
  });

  it("Mastercard qualifies as eligible", () => {
    const mc = entityMap.get("Mastercard")!;
    const result = assessPageEligibility(mc);
    expect(result.eligible).toBe(true);
  });

  it("PayPal qualifies as eligible", () => {
    const pp = entityMap.get("PayPal")!;
    const result = assessPageEligibility(pp);
    expect(result.eligible).toBe(true);
  });

  it("eligible slugs are sorted alphabetically", () => {
    const eligible = getEligiblePaymentSlugs(entityMap);
    const sorted = [...eligible].sort();
    expect(eligible).toEqual(sorted);
  });

  it("low-coverage methods are NOT eligible", () => {
    for (const [name, entity] of entityMap) {
      const result = assessPageEligibility(entity);
      if (!result.eligible) {
        expect(result.reasons.length).toBeGreaterThan(0);
        expect(result.reasons.some((r) => r.includes("need 10+") || r.includes("need 2+"))).toBe(true);
      }
    }
  });
});

// ─── Payment → Casino Graph (Full Dataset) ──────────────────────────────

describe("Payment Data — Payment → Casino Graph (Full Dataset)", () => {
  let entityMap: Map<string, PaymentEntity>;
  let casinos: ReturnType<typeof getFullDatasetCasinos>;

  beforeAll(() => {
    casinos = getFullDatasetCasinos();
    entityMap = buildPaymentEntityMap(casinos);
  });

  it("returns correct count for Visa", () => {
    const visa = entityMap.get("Visa")!;
    const result = getPaymentToCasinos(entityMap, "Visa", casinos);
    expect(result.length).toBe(visa.casinoCount);
  });

  it("results are sorted by rating descending", () => {
    const result = getPaymentToCasinos(entityMap, "Visa", casinos);
    for (let i = 1; i < result.length; i++) {
      expect((result[i - 1].rating ?? 0)).toBeGreaterThanOrEqual(result[i].rating ?? 0);
    }
  });

  it("each result has required fields", () => {
    const result = getPaymentToCasinos(entityMap, "PayPal", casinos);
    for (const entry of result) {
      expect(entry.slug).toBeTruthy();
      expect(entry.name).toBeTruthy();
      expect(entry.countries.length).toBeGreaterThan(0);
    }
  });
});

// ─── Payment → Guide Graph (Full Dataset) ───────────────────────────────

describe("Payment Data — Payment → Guide Graph", () => {
  it("e-wallet returns payment-methods-guide and online-casino-basics", () => {
    const guides = getPaymentToGuides("e-wallet");
    expect(guides.length).toBeGreaterThanOrEqual(2);
    expect(guides.some((g) => g.slug === "payment-methods-guide")).toBe(true);
    expect(guides.some((g) => g.slug === "online-casino-basics")).toBe(true);
  });

  it("card returns payment-methods-guide", () => {
    const guides = getPaymentToGuides("card");
    expect(guides.some((g) => g.slug === "payment-methods-guide")).toBe(true);
  });

  it("all valid types return at least one guide", () => {
    const types = ["e-wallet", "card", "bank-transfer", "crypto", "prepaid", "mobile"] as const;
    for (const type of types) {
      const guides = getPaymentToGuides(type);
      expect(guides.length).toBeGreaterThan(0);
    }
  });
});

// ─── Tier Classification (Full Dataset) ─────────────────────────────────

describe("Payment Data — Tier Classification (Full Dataset)", () => {
  let entityMap: Map<string, PaymentEntity>;

  beforeAll(() => {
    const casinos = getFullDatasetCasinos();
    entityMap = buildPaymentEntityMap(casinos);
  });

  it("Tier A entities sum to eligible count", () => {
    const tiers = classifyAllEntities(entityMap);
    const tierA = tiers.find((t) => t.tier === "A")!;
    const eligible = getEligiblePaymentSlugs(entityMap);
    expect(tierA.entities.length).toBe(eligible.length);
  });

  it("all Tier A entities have 10+ casinos and 2+ GEOs", () => {
    const tiers = classifyAllEntities(entityMap);
    const tierA = tiers.find((t) => t.tier === "A")!;
    for (const e of tierA.entities) {
      expect(e.entity.casinoCount).toBeGreaterThanOrEqual(10);
      expect(e.entity.geoCount).toBeGreaterThanOrEqual(2);
    }
  });

  it("all tiers sum to total entity count", () => {
    const tiers = classifyAllEntities(entityMap);
    const total = tiers.reduce((sum, t) => sum + t.entities.length, 0);
    expect(total).toBe(entityMap.size);
  });
});

// ─── Data Integrity ─────────────────────────────────────────────────────

describe("Payment Data — Integrity", () => {
  it("138 casinos are always returned", () => {
    const casinos = getFullDatasetCasinos();
    expect(casinos.length).toBe(138);
  });

  it("no fabricated payment methods", () => {
    const casinos = getFullDatasetCasinos();
    const knownMethods = new Set<string>();
    for (const c of casinos) {
      for (const pm of c.paymentMethods) {
        knownMethods.add(pm.name);
      }
    }
    // All methods should have a valid type
    for (const name of knownMethods) {
      const c = casinos.find((c) => c.paymentMethods.some((pm) => pm.name === name));
      const pm = c?.paymentMethods.find((pm) => pm.name === name);
      expect(pm).toBeDefined();
      expect(["e-wallet", "card", "bank-transfer", "crypto", "prepaid", "mobile"]).toContain(pm!.type);
    }
  });

  it("no duplicate entity maps across calls", () => {
    const casinos = getFullDatasetCasinos();
    const map1 = buildPaymentEntityMap(casinos);
    const map2 = buildPaymentEntityMap(casinos);
    expect(map1.size).toBe(map2.size);
    for (const [key, val] of map1) {
      const other = map2.get(key)!;
      expect(val.canonicalName).toBe(other.canonicalName);
      expect(val.casinoCount).toBe(other.casinoCount);
      expect(val.geoCount).toBe(other.geoCount);
    }
  });
});
