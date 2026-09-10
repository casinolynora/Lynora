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
      expect(fixtures.length).toBe(27);
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

  describe("data quality validation", () => {
    const fixtures = getGermanyFixtures();

    it("no duplicate IDs", () => {
      const ids = fixtures.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("no duplicate slugs", () => {
      const slugs = fixtures.map(c => c.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it("no duplicate website domains", () => {
      const domains = fixtures.map(c => new URL(c.website).hostname);
      const uniqueDomains = new Set(domains);
      expect(uniqueDomains.size).toBe(domains.length);
    });

    it("no demo or draft casinos in production", () => {
      fixtures.forEach(casino => {
        expect(casino.verificationStatus).not.toBe("demo");
        expect(casino.verificationStatus).not.toBe("draft");
      });
    });

    it("no Rizk record exists", () => {
      const rizk = fixtures.find(c =>
        c.slug.includes("rizk") || c.name.toLowerCase().includes("rizk")
      );
      expect(rizk).toBeUndefined();
    });

    it("all affiliateOffers arrays are empty", () => {
      fixtures.forEach(casino => {
        expect(casino.affiliateOffers).toHaveLength(0);
      });
    });

    it("all ratings are null", () => {
      fixtures.forEach(casino => {
        expect(casino.rating).toBeNull();
      });
    });

    it("all casinos have GGL license with DE jurisdiction", () => {
      fixtures.forEach(casino => {
        const gglLicense = casino.licenses.find(l => l.issuer === "GGL");
        expect(gglLicense).toBeDefined();
        expect(gglLicense?.jurisdiction).toBe("DE");
        expect(gglLicense?.status).toBe("active");
      });
    });

    it("all casinos have valid website URLs", () => {
      fixtures.forEach(casino => {
        expect(() => new URL(casino.website)).not.toThrow();
        expect(casino.website).toMatch(/^https:\/\/www\..+\.de/);
      });
    });

    it("all casinos have Germany as only country", () => {
      fixtures.forEach(casino => {
        expect(casino.countries).toContain("DE");
      });
    });

    it("all casinos have EUR currency", () => {
      fixtures.forEach(casino => {
        expect(casino.currencies).toContain("EUR");
      });
    });

    it("all casinos have German language", () => {
      fixtures.forEach(casino => {
        expect(casino.languages).toContain("de");
      });
    });

    it("all casinos have minAge 18", () => {
      fixtures.forEach(casino => {
        expect(casino.minAge).toBe(18);
      });
    });

    it("all casinos have kycRequired true", () => {
      fixtures.forEach(casino => {
        expect(casino.kycRequired).toBe(true);
      });
    });

    it("all casinos have valid dataSources", () => {
      fixtures.forEach(casino => {
        expect(casino.dataSources.length).toBeGreaterThan(0);
        casino.dataSources.forEach(ds => {
          expect(ds.field).toBeTruthy();
          expect(ds.source).toBeTruthy();
          expect(ds.verifiedAt).toBeTruthy();
        });
      });
    });

    it("all casinos have at least one game category", () => {
      fixtures.forEach(casino => {
        expect(casino.games.length).toBeGreaterThan(0);
      });
    });

    it("all casinos have review with overview and verdict", () => {
      fixtures.forEach(casino => {
        expect(casino.review.overview).toBeTruthy();
        expect(casino.review.verdict).toBeTruthy();
        expect(casino.review.score).toBeNull();
        expect(casino.review.scoreBreakdown).toBeNull();
      });
    });

    it("no casino has live casino (not permitted under GGL virtual slots licence)", () => {
      fixtures.forEach(casino => {
        expect(casino.hasLiveCasino).toBe(false);
      });
    });

    it("no casino has crypto enabled", () => {
      fixtures.forEach(casino => {
        expect(casino.hasCrypto).toBe(false);
      });
    });

    it("all casinos have status active", () => {
      fixtures.forEach(casino => {
        expect(casino.status).toBe("active");
      });
    });

    it("all IDs start with 'germany-'", () => {
      fixtures.forEach(casino => {
        expect(casino.id).toMatch(/^germany-/);
      });
    });

    it("all tags include 'germany' and 'ggl-verified'", () => {
      fixtures.forEach(casino => {
        expect(casino.tags).toContain("germany");
        expect(casino.tags).toContain("ggl-verified");
      });
    });
  });
});
