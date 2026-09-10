import { describe, it, expect } from "vitest";
import { createGermanyProvider, hasGermanyProductionData, getGermanyFixtures } from "@/lib/data/germany-provider";

describe("Germany Provider", () => {
  const provider = createGermanyProvider();

  describe("production visibility", () => {
    it("returns verified casinos from getAllCasinos", () => {
      const all = provider.getAllCasinos();
      expect(all.length).toBeGreaterThan(0);
      expect(all.every(c => c.verificationStatus === "verified")).toBe(true);
    });

    it("returns featured casinos", () => {
      const featured = provider.getFeaturedCasinos();
      expect(featured.length).toBeGreaterThan(0);
    });

    it("returns latest casinos", () => {
      const latest = provider.getLatestCasinos();
      expect(latest.length).toBeGreaterThan(0);
    });

    it("finds casino by slug", () => {
      const found = provider.getCasinoBySlug("stargames");
      expect(found).toBeDefined();
      expect(found?.name).toBe("StarGames");
    });

    it("returns undefined for non-existent slug", () => {
      const found = provider.getCasinoBySlug("non-existent-casino");
      expect(found).toBeUndefined();
    });
  });

  describe("verified data", () => {
    it("getGermanyFixtures returns all verified casinos", () => {
      const fixtures = getGermanyFixtures();
      expect(fixtures.length).toBe(9);
      expect(fixtures.every(c => c.verificationStatus === "verified")).toBe(true);
    });

    it("hasGermanyProductionData returns true", () => {
      expect(hasGermanyProductionData()).toBe(true);
    });

    it("all verified casinos have GGL license", () => {
      const fixtures = getGermanyFixtures();
      fixtures.forEach(casino => {
        expect(casino.licenses.some(l => l.issuer === "GGL")).toBe(true);
      });
    });

    it("all verified casinos have empty affiliateOffers", () => {
      const fixtures = getGermanyFixtures();
      fixtures.forEach(casino => {
        expect(casino.affiliateOffers).toHaveLength(0);
      });
    });

    it("all verified casinos have null rating", () => {
      const fixtures = getGermanyFixtures();
      fixtures.forEach(casino => {
        expect(casino.rating).toBeNull();
      });
    });
  });

  describe("getCasinosByGeo", () => {
    it("returns verified casinos for DE geo", () => {
      const de = provider.getCasinosByGeo("DE", "verified");
      expect(de.length).toBeGreaterThan(0);
      expect(de.every(c => c.countries.includes("DE"))).toBe(true);
    });

    it("returns empty for draft status (no draft data)", () => {
      const de = provider.getCasinosByGeo("DE", "draft");
      expect(de).toHaveLength(0);
    });
  });

  describe("getCasinosByStatus", () => {
    it("returns verified casinos", () => {
      const verified = provider.getCasinosByStatus("verified");
      expect(verified.length).toBeGreaterThan(0);
    });

    it("returns empty for draft", () => {
      const draft = provider.getCasinosByStatus("draft");
      expect(draft).toHaveLength(0);
    });
  });

  describe("selectCasinoListItem", () => {
    it("returns valid CasinoListItem from verified casino", () => {
      const fixtures = getGermanyFixtures();
      const item = provider.selectCasinoListItem(fixtures[0]);
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("verificationStatus");
      expect(item.verificationStatus).toBe("verified");
    });
  });

  describe("getAffiliateOffer", () => {
    it("returns null for casinos with no affiliate offers", () => {
      const offer = provider.getAffiliateOffer("germany-stargames", "DE");
      expect(offer).toBeNull();
    });
  });
});
