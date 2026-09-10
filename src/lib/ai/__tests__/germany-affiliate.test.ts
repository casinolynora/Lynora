import { describe, it, expect } from "vitest";
import { resolveOffer } from "@/lib/ai/affiliate-utils";
import { createGermanyProvider } from "@/lib/data/germany-provider";
import { AffiliateOffer } from "@/lib/types";

describe("Germany Affiliate Resolution", () => {
  const provider = createGermanyProvider();

  it("DE affiliate offers resolved correctly", () => {
    const offers: AffiliateOffer[] = [
      { id: "de-offer", geo: "DE", trackingUrl: "https://de.example.com", ctaText: "Visit DE", isActive: true },
      { id: "all-offer", geo: "ALL", trackingUrl: "https://all.example.com", ctaText: "Visit All", isActive: true },
    ];
    const resolved = resolveOffer(offers, "DE");
    expect(resolved?.id).toBe("de-offer");
  });

  it("expired DE offers excluded", () => {
    const offers: AffiliateOffer[] = [
      { id: "expired", geo: "DE", trackingUrl: "https://expired.example.com", ctaText: "Visit", isActive: true, endDate: "2020-01-01" },
    ];
    const resolved = resolveOffer(offers, "DE");
    expect(resolved).toBeNull();
  });

  it("ALL offers serve as fallback", () => {
    const offers: AffiliateOffer[] = [
      { id: "all-offer", geo: "ALL", trackingUrl: "https://all.example.com", ctaText: "Visit", isActive: true },
    ];
    const resolved = resolveOffer(offers, "DE");
    expect(resolved?.id).toBe("all-offer");
  });

  it("INT offers serve as final fallback", () => {
    const offers: AffiliateOffer[] = [
      { id: "int-offer", geo: "INT", trackingUrl: "https://int.example.com", ctaText: "Visit", isActive: true },
    ];
    const resolved = resolveOffer(offers, "DE");
    expect(resolved?.id).toBe("int-offer");
  });

  it("no offer returns null", () => {
    const resolved = resolveOffer([], "DE");
    expect(resolved).toBeNull();
  });

  it("inactive offers excluded", () => {
    const offers: AffiliateOffer[] = [
      { id: "inactive", geo: "DE", trackingUrl: "https://inactive.example.com", ctaText: "Visit", isActive: false },
    ];
    const resolved = resolveOffer(offers, "DE");
    expect(resolved).toBeNull();
  });

  it("provider returns null for unverified casinos", () => {
    const offer = provider.getAffiliateOffer("de-fixture-1", "DE");
    expect(offer).toBeNull();
  });
});
