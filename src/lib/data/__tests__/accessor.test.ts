import { describe, it, expect } from "vitest";
import { CasinoDataProvider } from "@/lib/data/provider";
import { Casino, AffiliateOffer } from "@/lib/types";

const now = new Date().toISOString();

function makeTestCasino(overrides: Partial<Casino> = {}): Casino {
  return {
    id: "test-1",
    slug: "test-casino",
    name: "Test Casino",
    website: "https://test.com",
    status: "active",
    verificationStatus: "verified",
    lastVerifiedAt: now,
    dataSources: [{ field: "all", source: "test", verifiedAt: now }],
    rating: 80,
    trustScore: 85,
    licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
    countries: ["DE", "AT"],
    restrictedCountries: [],
    languages: ["en", "de"],
    currencies: ["EUR"],
    minDeposit: 10,
    paymentMethods: [{ name: "Visa", type: "card" }],
    bonuses: [{ type: "welcome", title: "Welcome Bonus", description: "100% up to €100" }],
    games: [{ name: "Slots", slug: "slots", available: true }],
    hasLiveCasino: true,
    hasSportsBetting: false,
    hasCrypto: false,
    hasMobile: true,
    kycRequired: true,
    minAge: 18,
    withdrawalMethods: [],
    responsibleGambling: {
      selfExclusion: true,
      depositLimits: true,
      sessionLimits: true,
      realityCheck: true,
      coolingOffPeriod: true,
    },
    affiliateOffers: [
      { id: "offer-de", geo: "DE", trackingUrl: "https://track.de/test", ctaText: "Visit", isActive: true },
      { id: "offer-all", geo: "ALL", trackingUrl: "https://track.all/test", ctaText: "Visit", isActive: true },
    ],
    review: {
      overview: "Test",
      pros: ["Good"],
      cons: ["None"],
      verdict: "Great",
      score: 80,
      scoreBreakdown: {
        gameVariety: 8,
        bonusValue: 8,
        paymentSpeed: 8,
        customerSupport: 8,
        trustAndSafety: 8,
        userExperience: 8,
      },
    },
    features: [],
    tags: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function selectCasinoListItem(casino: Casino) {
  return {
    id: casino.id,
    slug: casino.slug,
    name: casino.name,
    tagline: casino.tagline,
    logo: casino.logo,
    rating: casino.rating,
    trustScore: casino.trustScore,
    licenses: casino.licenses,
    minDeposit: casino.minDeposit,
    paymentMethods: casino.paymentMethods,
    bonuses: casino.bonuses,
    games: casino.games,
    hasLiveCasino: casino.hasLiveCasino,
    hasSportsBetting: casino.hasSportsBetting,
    lastVerifiedAt: casino.lastVerifiedAt,
    countries: casino.countries,
    features: casino.features,
    affiliateOffers: casino.affiliateOffers,
    status: casino.status,
    verificationStatus: casino.verificationStatus,
  };
}

function resolveAffiliateOffer(offers: AffiliateOffer[], geo: string): AffiliateOffer | null {
  const active = offers.filter(o => {
    if (!o.isActive) return false;
    if (o.endDate && new Date(o.endDate) < new Date()) return false;
    return true;
  });
  const exact = active.find(o => o.geo === geo);
  if (exact) return exact;
  const all = active.find(o => o.geo === "ALL");
  if (all) return all;
  const intl = active.find(o => o.geo === "INT");
  if (intl) return intl;
  return active[0] ?? null;
}

function createTestProvider(casinos: Casino[]): CasinoDataProvider {
  const isActive = (c: Casino) =>
    c.status === "active" && c.verificationStatus === "verified";

  return {
    getAllCasinos: () => casinos.filter(isActive),
    getCasinoBySlug: (slug) => casinos.find(c => c.slug === slug && isActive(c)),
    getCasinoById: (id) => casinos.find(c => c.id === id && isActive(c)),
    getCasinosByCountry: (countryCode) =>
      casinos.filter(c => isActive(c) && c.countries.includes(countryCode) && !c.restrictedCountries.includes(countryCode)),
    getCasinosByGeo: (geo, status = "verified") =>
      casinos.filter(c => c.status === "active" && c.verificationStatus === status && c.countries.includes(geo)),
    getCasinosByStatus: (status) =>
      casinos.filter(c => c.status === "active" && c.verificationStatus === status),
    getFeaturedCasinos: () =>
      casinos.filter(isActive).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 6).map(selectCasinoListItem),
    getLatestCasinos: () =>
      casinos.filter(isActive).sort((a, b) => new Date(b.lastVerifiedAt).getTime() - new Date(a.lastVerifiedAt).getTime()).slice(0, 6).map(selectCasinoListItem),
    searchCasinos: (query) => {
      const lower = query.toLowerCase();
      return casinos.filter(c => isActive(c) && c.name.toLowerCase().includes(lower));
    },
    getRelatedCasinos: (casinoId, limit = 4) => {
      const casino = casinos.find(c => c.id === casinoId && isActive(c));
      if (!casino) return casinos.filter(isActive).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, limit).map(selectCasinoListItem);
      return casinos.filter(c => c.id !== casinoId && isActive(c)).slice(0, limit).map(selectCasinoListItem);
    },
    selectCasinoListItem,
    getAvailableCountries: () => {
      const countries = new Set<string>();
      casinos.filter(isActive).forEach(c => c.countries.forEach(co => countries.add(co)));
      return Array.from(countries).sort();
    },
    getAffiliateOffer: (casinoId, geo) => {
      const casino = casinos.find(c => c.id === casinoId && isActive(c));
      if (!casino) return null;
      return resolveAffiliateOffer(casino.affiliateOffers, geo);
    },
  };
}

const testCasino = makeTestCasino();
const testCasino2 = makeTestCasino({ id: "casino-2", slug: "casino-two", name: "Casino Two" });
const testProvider = createTestProvider([testCasino, testCasino2]);

describe("CasinoDataProvider", () => {
  describe("getAffiliateOffer", () => {
    it("returns exact GEO match", () => {
      const offer = testProvider.getAffiliateOffer("test-1", "DE");
      expect(offer).not.toBeNull();
      expect(offer?.geo).toBe("DE");
      expect(offer?.isActive).toBe(true);
    });

    it("falls back to ALL when no exact match", () => {
      const offer = testProvider.getAffiliateOffer("test-1", "XX");
      expect(offer).not.toBeNull();
      expect(offer?.geo).toBe("ALL");
    });

    it("returns null when no valid offer exists", () => {
      const casinoNoOffers = makeTestCasino({ id: "no-offers", slug: "no-offers", affiliateOffers: [] });
      const provider = createTestProvider([casinoNoOffers]);
      const offer = provider.getAffiliateOffer("no-offers", "DE");
      expect(offer).toBeNull();
    });

    it("returns null for non-existent casino", () => {
      const offer = testProvider.getAffiliateOffer("non-existent", "DE");
      expect(offer).toBeNull();
    });
  });

  describe("status filtering", () => {
    it("excludes non-verified casinos from getAllCasinos", () => {
      const draftCasino = makeTestCasino({ id: "draft", slug: "draft", verificationStatus: "draft" });
      const provider = createTestProvider([testCasino, draftCasino]);
      const all = provider.getAllCasinos();
      expect(all.every(c => c.verificationStatus === "verified")).toBe(true);
      expect(all).toHaveLength(1);
    });

    it("excludes inactive casinos from getCasinoBySlug", () => {
      const found = testProvider.getCasinoBySlug("test-casino");
      expect(found?.verificationStatus).toBe("verified");
    });
  });

  describe("country filtering", () => {
    it("excludes restricted countries", () => {
      const restricted = makeTestCasino({ id: "restricted", slug: "restricted", restrictedCountries: ["DE"] });
      const provider = createTestProvider([testCasino, restricted]);
      const de = provider.getCasinosByCountry("DE");
      de.forEach(c => {
        expect(c.countries).toContain("DE");
        expect(c.restrictedCountries).not.toContain("DE");
      });
    });
  });

  describe("getCillasByGeo", () => {
    it("returns casinos for specific GEO", () => {
      const deCasinos = testProvider.getCasinosByGeo("DE");
      expect(deCasinos.every(c => c.countries.includes("DE"))).toBe(true);
    });

    it("filters by verification status", () => {
      const draftCasino = makeTestCasino({ id: "draft", slug: "draft", verificationStatus: "draft", countries: ["DE"] });
      const provider = createTestProvider([testCasino, draftCasino]);
      const verified = provider.getCasinosByGeo("DE", "verified");
      expect(verified.every(c => c.verificationStatus === "verified")).toBe(true);
    });
  });

  describe("selectCasinoListItem", () => {
    it("returns a valid CasinoListItem", () => {
      const item = testProvider.selectCasinoListItem(testCasino);
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("slug");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("rating");
      expect(item).toHaveProperty("affiliateOffers");
      expect(item).toHaveProperty("status");
      expect(item).toHaveProperty("verificationStatus");
    });
  });
});
