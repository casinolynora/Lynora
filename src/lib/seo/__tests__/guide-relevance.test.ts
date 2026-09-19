import { describe, it, expect } from "vitest";
import { getRelevantGuides, getCasinosForGuide } from "@/lib/seo/guide-relevance";

describe("Guide Relevance", () => {
  const baseCasino = {
    paymentMethods: [
      { name: "Visa", type: "card" as const },
      { name: "PayPal", type: "e-wallet" as const },
    ],
    bonuses: [
      { type: "welcome" as const, title: "Welcome Bonus", description: "100% up to €100" },
    ],
  };

  it("returns relevant guides for a casino with payments and bonuses", () => {
    const guides = getRelevantGuides(baseCasino);
    expect(guides.length).toBeGreaterThan(0);
    expect(guides.length).toBeLessThanOrEqual(2);

    const slugs = guides.map(g => g.slug);
    // Should include payment guide (has payments) and bonus guide (has bonuses)
    expect(slugs).toContain("payment-methods-guide");
    expect(slugs).toContain("casino-bonuses-explained");
  });

  it("returns payment guide when casino has payment methods", () => {
    const guides = getRelevantGuides(baseCasino);
    const slugs = guides.map(g => g.slug);
    expect(slugs).toContain("payment-methods-guide");
  });

  it("returns bonus guide when casino has bonuses", () => {
    const guides = getRelevantGuides(baseCasino);
    const slugs = guides.map(g => g.slug);
    expect(slugs).toContain("casino-bonuses-explained");
  });

  it("returns fewer guides when casino has no payments", () => {
    const guides = getRelevantGuides({
      paymentMethods: [],
      bonuses: baseCasino.bonuses,
    });
    const slugs = guides.map(g => g.slug);
    expect(slugs).not.toContain("payment-methods-guide");
  });

  it("returns fewer guides when casino has no bonuses", () => {
    const guides = getRelevantGuides({
      paymentMethods: baseCasino.paymentMethods,
      bonuses: [],
    });
    const slugs = guides.map(g => g.slug);
    expect(slugs).not.toContain("casino-bonuses-explained");
  });

  it("returns at most 2 guides", () => {
    const guides = getRelevantGuides(baseCasino);
    expect(guides.length).toBeLessThanOrEqual(2);
  });

  it("returns guides with required fields", () => {
    const guides = getRelevantGuides(baseCasino);
    for (const guide of guides) {
      expect(guide.title).toBeTruthy();
      expect(guide.slug).toBeTruthy();
      expect(guide.description).toBeTruthy();
    }
  });

  it("returns deterministic results", () => {
    const guides1 = getRelevantGuides(baseCasino);
    const guides2 = getRelevantGuides(baseCasino);
    expect(guides1.map(g => g.slug)).toEqual(guides2.map(g => g.slug));
  });
});

describe("getCasinosForGuide", () => {
  const mockCasinos = [
    {
      slug: "casino-a",
      name: "Casino A",
      tagline: "Best casino",
      rating: 9.5,
      paymentMethods: [
        { name: "Visa", type: "card" as const },
        { name: "PayPal", type: "e-wallet" as const },
        { name: "Skrill", type: "e-wallet" as const },
      ],
      bonuses: [
        { type: "welcome" as const, title: "Welcome", description: "100%" },
        { type: "reload" as const, title: "Reload", description: "50%" },
      ],
      licenses: [
        { issuer: "MGA", jurisdiction: "Malta" },
        { issuer: "UKGC", jurisdiction: "UK" },
      ],
      trustScore: 9,
    },
    {
      slug: "casino-b",
      name: "Casino B",
      tagline: "Good casino",
      rating: 8.0,
      paymentMethods: [
        { name: "Visa", type: "card" as const },
      ],
      bonuses: [
        { type: "welcome" as const, title: "Welcome", description: "50%" },
      ],
      licenses: [
        { issuer: "MGA", jurisdiction: "Malta" },
      ],
      trustScore: 7,
    },
    {
      slug: "casino-c",
      name: "Casino C",
      tagline: "Decent casino",
      rating: 7.0,
      paymentMethods: [],
      bonuses: [],
      licenses: [],
      trustScore: 5,
    },
  ];

  it("returns max 3 casinos", () => {
    const result = getCasinosForGuide("online-casino-basics", mockCasinos);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("returns empty array for empty casinos", () => {
    const result = getCasinosForGuide("online-casino-basics", []);
    expect(result).toEqual([]);
  });

  it("sorts by rating for online-casino-basics", () => {
    const result = getCasinosForGuide("online-casino-basics", mockCasinos);
    expect(result[0].slug).toBe("casino-a");
    expect(result[1].slug).toBe("casino-b");
  });

  it("sorts by payment method count for payment-methods-guide", () => {
    const result = getCasinosForGuide("payment-methods-guide", mockCasinos);
    expect(result[0].slug).toBe("casino-a");
  });

  it("sorts by bonus count for casino-bonuses-explained", () => {
    const result = getCasinosForGuide("casino-bonuses-explained", mockCasinos);
    expect(result[0].slug).toBe("casino-a");
  });

  it("sorts by license count for casino-licensing-guide", () => {
    const result = getCasinosForGuide("casino-licensing-guide", mockCasinos);
    expect(result[0].slug).toBe("casino-a");
  });

  it("sorts by trust score for responsible-gambling-tips", () => {
    const result = getCasinosForGuide("responsible-gambling-tips", mockCasinos);
    expect(result[0].slug).toBe("casino-a");
  });

  it("filters by bonuses for understanding-wagering-requirements", () => {
    const result = getCasinosForGuide("understanding-wagering-requirements", mockCasinos);
    expect(result.every(c => c.slug !== "casino-c")).toBe(true);
  });

  it("returns casinos with required fields", () => {
    const result = getCasinosForGuide("online-casino-basics", mockCasinos);
    for (const casino of result) {
      expect(casino.slug).toBeTruthy();
      expect(casino.name).toBeTruthy();
    }
  });

  it("does not mutate input array", () => {
    const original = [...mockCasinos];
    getCasinosForGuide("online-casino-basics", mockCasinos);
    expect(mockCasinos.map(c => c.slug)).toEqual(original.map(c => c.slug));
  });
});
