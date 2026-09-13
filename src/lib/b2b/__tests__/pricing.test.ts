import { describe, it, expect } from "vitest";
import { PRICING_TIERS, formatPrice, getPricingTier, PLACEMENT_TRANSPARENCY_STATEMENT } from "../pricing";
import { ListingPlanSchema } from "../types";

describe("B2B Pricing Configuration", () => {
  describe("PRICING_TIERS", () => {
    it("has exactly 5 tiers", () => {
      expect(PRICING_TIERS).toHaveLength(5);
    });

    it("includes all listing plans", () => {
      const ids = PRICING_TIERS.map((t) => t.id);
      expect(ids).toContain("free");
      expect(ids).toContain("verified");
      expect(ids).toContain("featured");
      expect(ids).toContain("premium");
      expect(ids).toContain("custom");
    });

    it("free tier has price 0", () => {
      const free = PRICING_TIERS.find((t) => t.id === "free");
      expect(free?.monthlyPrice).toBe(0);
    });

    it("custom tier has null price", () => {
      const custom = PRICING_TIERS.find((t) => t.id === "custom");
      expect(custom?.monthlyPrice).toBeNull();
    });

    it("each tier has at least 3 features", () => {
      for (const tier of PRICING_TIERS) {
        expect(tier.features.length).toBeGreaterThanOrEqual(3);
      }
    });

    it("each tier has a non-empty description", () => {
      for (const tier of PRICING_TIERS) {
        expect(tier.description.length).toBeGreaterThan(0);
      }
    });

    it("each tier has a non-empty ctaText", () => {
      for (const tier of PRICING_TIERS) {
        expect(tier.ctaText.length).toBeGreaterThan(0);
      }
    });

    it("tiers are ordered by price ascending (free < verified < featured < premium)", () => {
      const prices = PRICING_TIERS.filter((t) => t.monthlyPrice !== null).map((t) => t.monthlyPrice!);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThan(prices[i - 1]);
      }
    });
  });

  describe("formatPrice", () => {
    it("formats zero as €0", () => {
      expect(formatPrice(0)).toBe("€0");
    });

    it("formats monthly price", () => {
      expect(formatPrice(99)).toBe("€99/month");
    });

    it("formats null as Custom", () => {
      expect(formatPrice(null)).toBe("Custom");
    });
  });

  describe("getPricingTier", () => {
    it("returns the correct tier for each plan", () => {
      for (const tier of PRICING_TIERS) {
        const found = getPricingTier(tier.id);
        expect(found).toBeDefined();
        expect(found?.id).toBe(tier.id);
      }
    });

    it("returns undefined for invalid plan", () => {
      expect(getPricingTier("invalid" as any)).toBeUndefined();
    });
  });

  describe("PLACEMENT_TRANSPARENCY_STATEMENT", () => {
    it("is a non-empty string", () => {
      expect(PLACEMENT_TRANSPARENCY_STATEMENT.length).toBeGreaterThan(0);
    });

    it("mentions that paid placement does not determine editorial scores", () => {
      expect(PLACEMENT_TRANSPARENCY_STATEMENT.toLowerCase()).toContain("does not determine editorial scores");
    });
  });
});

describe("ListingPlan Schema", () => {
  it("accepts all valid plan values", () => {
    expect(ListingPlanSchema.safeParse("free").success).toBe(true);
    expect(ListingPlanSchema.safeParse("verified").success).toBe(true);
    expect(ListingPlanSchema.safeParse("featured").success).toBe(true);
    expect(ListingPlanSchema.safeParse("premium").success).toBe(true);
    expect(ListingPlanSchema.safeParse("custom").success).toBe(true);
  });

  it("rejects invalid plan values", () => {
    expect(ListingPlanSchema.safeParse("basic").success).toBe(false);
    expect(ListingPlanSchema.safeParse("enterprise").success).toBe(false);
    expect(ListingPlanSchema.safeParse("").success).toBe(false);
  });
});
