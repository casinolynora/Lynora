import { describe, it, expect } from "vitest";
import { getGuideBySlug, getAllGuides, getGermanGuideBySlug } from "@/lib/data/guides";

describe("German Guide Localization", () => {
  const allGuides = getAllGuides();

  it("all guides have German localization", () => {
    for (const guide of allGuides) {
      expect(guide.de, `Guide "${guide.slug}" missing de localization`).toBeDefined();
    }
  });

  it("German titles differ from English titles", () => {
    for (const guide of allGuides) {
      if (guide.de) {
        expect(guide.de.title).not.toBe(guide.title);
      }
    }
  });

  it("German categories differ from English categories", () => {
    for (const guide of allGuides) {
      if (guide.de) {
        expect(guide.de.category).not.toBe(guide.category);
      }
    }
  });

  it("German guides have sections", () => {
    for (const guide of allGuides) {
      if (guide.de) {
        expect(guide.de.sections.length).toBeGreaterThan(0);
      }
    }
  });

  it("German guides have FAQ", () => {
    for (const guide of allGuides) {
      if (guide.de) {
        expect(guide.de.faq.length).toBeGreaterThan(0);
      }
    }
  });

  it("getGermanGuideBySlug returns German content when available", () => {
    const result = getGermanGuideBySlug("online-casino-basics");
    expect(result).toBeDefined();
    expect(result?.de.title).toBe("Grundlagen der Online-Casinos");
  });

  it("getGermanGuideBySlug returns undefined for unknown slug", () => {
    const result = getGermanGuideBySlug("nonexistent-guide");
    expect(result).toBeUndefined();
  });
});

describe("German DE Pages — Search Intent Differentiation", () => {
  it("/de/casinos targets casino directory intent", async () => {
    const { metadata } = await import("@/app/de/casinos/page");
    expect(metadata.title).toContain("Deutsche Online Casinos");
    expect(metadata.description).toBeTruthy();
  });

  it("/de/best-casinos targets methodology/comparison intent", async () => {
    const { metadata } = await import("@/app/de/best-casinos/page");
    expect(metadata.title).toContain("So finden Sie");
    expect(metadata.description).toBeTruthy();
  });

  it("/de/casinos and /de/best-casinos have different titles", async () => {
    const casinos = await import("@/app/de/casinos/page");
    const best = await import("@/app/de/best-casinos/page");
    expect(casinos.metadata.title).not.toBe(best.metadata.title);
  });

  it("/de/casinos and /de/best-casinos have different descriptions", async () => {
    const casinos = await import("@/app/de/casinos/page");
    const best = await import("@/app/de/best-casinos/page");
    expect(casinos.metadata.description).not.toBe(best.metadata.description);
  });
});

describe("German Pages — Canonical URLs", () => {
  it("/de/casinos has correct canonical", async () => {
    const { metadata } = await import("@/app/de/casinos/page");
    expect(metadata.alternates?.canonical).toBe("/de/casinos");
  });

  it("/de/best-casinos has correct canonical", async () => {
    const { metadata } = await import("@/app/de/best-casinos/page");
    expect(metadata.alternates?.canonical).toBe("/de/best-casinos");
  });

  it("/de/compare has correct canonical", async () => {
    const { metadata } = await import("@/app/de/compare/page");
    expect(metadata.alternates?.canonical).toBe("/de/compare");
  });

  it("/de/guides has correct canonical", async () => {
    const { metadata } = await import("@/app/de/guides/page");
    expect(metadata.alternates?.canonical).toBe("/de/guides");
  });
});

describe("German Pages — Required Metadata", () => {
  it("/de/casinos has title, description, OG, and twitter", async () => {
    const { metadata } = await import("@/app/de/casinos/page");
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
    expect(metadata.openGraph?.title).toBeTruthy();
    expect(metadata.twitter?.title).toBeTruthy();
  });

  it("/de/best-casinos has title, description, OG, and twitter", async () => {
    const { metadata } = await import("@/app/de/best-casinos/page");
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
    expect(metadata.openGraph?.title).toBeTruthy();
    expect(metadata.twitter?.title).toBeTruthy();
  });

  it("/de/compare has title, description, OG, and twitter", async () => {
    const { metadata } = await import("@/app/de/compare/page");
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
    expect(metadata.openGraph?.title).toBeTruthy();
    expect(metadata.twitter?.title).toBeTruthy();
  });

  it("/de/guides has title, description, OG, and twitter", async () => {
    const { metadata } = await import("@/app/de/guides/page");
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
    expect(metadata.openGraph?.title).toBeTruthy();
    expect(metadata.twitter?.title).toBeTruthy();
  });
});

describe("Existing Functionality Preserved", () => {
  it("all guide slugs still resolve", () => {
    const slugs = [
      "online-casino-basics",
      "payment-methods-guide",
      "casino-bonuses-explained",
      "responsible-gambling-tips",
      "understanding-wagering-requirements",
      "casino-licensing-guide",
    ];
    for (const slug of slugs) {
      const guide = getGuideBySlug(slug);
      expect(guide, `Guide "${slug}" not found`).toBeDefined();
    }
  });

  it("English guide content is preserved", () => {
    const guide = getGuideBySlug("online-casino-basics");
    expect(guide?.content.intro).toContain("Online casinos");
    expect(guide?.content.sections.length).toBeGreaterThan(0);
  });

  it("affiliate system is not broken", async () => {
    const affiliate = await import("@/lib/config/affiliates");
    expect(affiliate.AFFILIATE_CONFIG).toBeDefined();
  });

  it("matching engine is not broken", async () => {
    const matching = await import("@/lib/engine/matching");
    expect(matching).toBeDefined();
  });
});
