import { describe, it, expect } from "vitest";
import { getRelevantGuides } from "@/lib/seo/guide-relevance";

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
