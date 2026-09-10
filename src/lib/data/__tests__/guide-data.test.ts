import { describe, it, expect } from "vitest";
import { getAllGuides, getGuideBySlug, getGuideSlugs } from "@/lib/data/guides";

describe("Guide Data", () => {
  const guides = getAllGuides();

  it("should have guides", () => {
    expect(guides.length).toBeGreaterThan(0);
  });

  it("should have unique slugs", () => {
    const slugs = guides.map(g => g.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("should have required fields", () => {
    for (const guide of guides) {
      expect(guide.slug).toBeTruthy();
      expect(guide.title).toBeTruthy();
      expect(guide.description).toBeTruthy();
      expect(guide.category).toBeTruthy();
      expect(guide.lastUpdated).toBeTruthy();
      expect(guide.content.intro).toBeTruthy();
      expect(guide.content.sections.length).toBeGreaterThan(0);
      expect(guide.content.conclusion).toBeTruthy();
      expect(guide.faq.length).toBeGreaterThan(0);
    }
  });

  it("should return guide by slug", () => {
    const guide = getGuideBySlug("online-casino-basics");
    expect(guide).toBeDefined();
    expect(guide!.slug).toBe("online-casino-basics");
  });

  it("should return undefined for non-existent slug", () => {
    const guide = getGuideBySlug("non-existent-guide");
    expect(guide).toBeUndefined();
  });

  it("should have matching slugs and getGuideSlugs", () => {
    const slugs = getGuideSlugs();
    expect(slugs.length).toBe(guides.length);
    for (const slug of slugs) {
      expect(guides.some(g => g.slug === slug)).toBe(true);
    }
  });

  it("should have sections with headings and body", () => {
    for (const guide of guides) {
      for (const section of guide.content.sections) {
        expect(section.heading).toBeTruthy();
        expect(section.body).toBeTruthy();
        expect(section.body.length).toBeGreaterThan(50);
      }
    }
  });
});
