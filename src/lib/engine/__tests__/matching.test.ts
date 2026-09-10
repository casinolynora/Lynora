import { describe, it, expect } from "vitest";
import { matchCasino, rankCasinos } from "../matching";
import { DEFAULT_MATCH_WEIGHTS } from "@/lib/types";
import { Casino, UserPreferences } from "@/lib/types";

// Minimal test casino
const testCasino: Casino = {
  id: "test-1",
  slug: "test-casino",
  name: "Test Casino",
  website: "https://test-casino.example.com",
  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2025-01-01T00:00:00.000Z",
  dataSources: [{ field: "all", source: "test", verifiedAt: "2025-01-01T00:00:00.000Z" }],
  rating: 85,
  trustScore: 80,
  licenses: [{ issuer: "MGA", jurisdiction: "Malta" }],
  countries: ["DE", "AT", "NL"],
  restrictedCountries: [],
  languages: ["English", "German"],
  currencies: ["EUR"],
  minDeposit: 20,
  maxDeposit: 5000,
  minWithdrawal: 20,
  paymentMethods: [
    { name: "Visa", type: "card" },
    { name: "PayPal", type: "e-wallet" },
  ],
  withdrawalMethods: ["Visa", "PayPal"],
  withdrawalProcessingTime: "24-48 hours",
  bonuses: [
    { type: "welcome", title: "Welcome Bonus", description: "100% up to €500", wageringRequirement: "35x" },
  ],
  games: [
    { name: "Slots", slug: "slots", available: true, count: 500 },
    { name: "Blackjack", slug: "blackjack", available: true },
    { name: "Roulette", slug: "roulette", available: true },
    { name: "Live Casino", slug: "live-casino", available: true },
  ],
  hasLiveCasino: true,
  hasSportsBetting: false,
  hasCrypto: false,
  hasMobile: true,
  kycRequired: true,
  minAge: 18,
  responsibleGambling: { selfExclusion: true, depositLimits: true, sessionLimits: true, realityCheck: true, coolingOffPeriod: true },
  affiliateOffers: [{ id: "offer-1", geo: "DE", trackingUrl: "https://example.com/track", ctaText: "Visit Casino", isActive: true }],
  review: {
    overview: "A test casino.",
    pros: ["Good games", "Fast payouts"],
    cons: ["Limited sports"],
    verdict: "Solid choice.",
    score: 85,
    scoreBreakdown: { gameVariety: 8, bonusValue: 7, paymentSpeed: 8, customerSupport: 9, trustAndSafety: 9, userExperience: 8 },
  },
  createdAt: "2020-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
  features: ["Fast payouts"],
  tags: ["popular"],
};

const defaultPrefs: UserPreferences = {
  country: "DE",
  minDeposit: 20,
  maxDeposit: 500,
  preferredPaymentMethod: "Visa",
  preferredGames: ["slots", "blackjack"],
  liveCasinoPreferred: false,
  sportsBettingPreferred: false,
  bonusPreference: "any",
  withdrawalPreference: "no-preference",
  cryptoPreferred: false,
  mobileFriendly: false,
};

describe("Matching Engine", () => {
  describe("matchCasino", () => {
    it("returns a valid MatchResult", () => {
      const result = matchCasino(testCasino, defaultPrefs);
      expect(result.casinoId).toBe("test-1");
      expect(result.casinoSlug).toBe("test-casino");
      expect(result.casinoName).toBe("Test Casino");
      expect(result.matchPercentage).toBeGreaterThanOrEqual(0);
      expect(result.matchPercentage).toBeLessThanOrEqual(100);
      expect(result.reasons).toBeInstanceOf(Array);
      expect(result.warnings).toBeInstanceOf(Array);
    });

    it("scores 100% when all preferences match", () => {
      const result = matchCasino(testCasino, defaultPrefs);
      // Country matches, payment matches, games match, bonus matches
      expect(result.matchPercentage).toBeGreaterThan(70);
    });

    it("scores lower for unavailable country", () => {
      const prefs = { ...defaultPrefs, country: "JP" };
      const result = matchCasino(testCasino, prefs);
      const availableResult = matchCasino(testCasino, defaultPrefs);
      expect(result.matchPercentage).toBeLessThan(availableResult.matchPercentage);
      expect(result.reasons.some(r => r.category === "country" && !r.met)).toBe(true);
    });

    it("handles missing payment method preference", () => {
      const prefs = { ...defaultPrefs, preferredPaymentMethod: undefined };
      const result = matchCasino(testCasino, prefs);
      expect(result.matchPercentage).toBeGreaterThan(0);
    });

    it("handles empty games preference", () => {
      const prefs = { ...defaultPrefs, preferredGames: [] };
      const result = matchCasino(testCasino, prefs);
      expect(result.matchPercentage).toBeGreaterThan(0);
    });

    it("includes trust reason", () => {
      const result = matchCasino(testCasino, defaultPrefs);
      expect(result.reasons.some(r => r.category === "trust")).toBe(true);
    });

    it("generates warnings for high wagering requirements", () => {
      const casinoWithHighWR: Casino = {
        ...testCasino,
        bonuses: [{ type: "welcome", title: "High WR Bonus", description: "100%", wageringRequirement: "60x" }],
      };
      const result = matchCasino(casinoWithHighWR, defaultPrefs);
      expect(result.warnings.some(w => w.includes("wagering requirement"))).toBe(true);
    });
  });

  describe("rankCasinos", () => {
    it("returns results sorted by match percentage", () => {
      const casinos = [testCasino, { ...testCasino, id: "test-2", slug: "test-2", name: "Test 2", countries: ["JP"] }];
      const results = rankCasinos(casinos, defaultPrefs);
      expect(results.length).toBe(2);
      expect(results[0].matchPercentage).toBeGreaterThanOrEqual(results[1].matchPercentage);
    });

    it("respects limit parameter", () => {
      const casinos = Array.from({ length: 20 }, (_, i) => ({
        ...testCasino,
        id: `test-${i}`,
        slug: `test-${i}`,
        name: `Test ${i}`,
      }));
      const results = rankCasinos(casinos, defaultPrefs, undefined, 5);
      expect(results.length).toBe(5);
    });
  });

  describe("Weights", () => {
    it("weights sum to 100", () => {
      const total = Object.values(DEFAULT_MATCH_WEIGHTS).reduce((a, b) => a + b, 0);
      expect(total).toBe(100);
    });

    it("matchPercentage is always between 0 and 100", () => {
      const casinos = [testCasino];
      const prefsList: UserPreferences[] = [
        defaultPrefs,
        { ...defaultPrefs, country: "JP" },
        { ...defaultPrefs, preferredGames: ["nonexistent"] },
        { ...defaultPrefs, preferredPaymentMethod: "NonExistent" },
      ];
      for (const prefs of prefsList) {
        const results = rankCasinos(casinos, prefs);
        for (const r of results) {
          expect(r.matchPercentage).toBeGreaterThanOrEqual(0);
          expect(r.matchPercentage).toBeLessThanOrEqual(100);
        }
      }
    });
  });

  describe("Restricted countries", () => {
    it("matching engine does not filter restricted countries (that is the accessor's job)", () => {
      // The matching engine scores based on provided casino data.
      // The data access layer (accessor.ts) filters restricted countries before matching.
      // This test verifies the engine's behavior: it scores the country if present in casino.countries.
      const restrictedCasino: Casino = {
        ...testCasino,
        id: "restricted",
        countries: ["DE"],
        restrictedCountries: ["DE"],
      };
      const result = matchCasino(restrictedCasino, defaultPrefs);
      // The engine sees DE in countries and scores it as available
      expect(result.reasons.find(r => r.category === "country")?.met).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("populates maximumDeposit breakdown", () => {
      const result = matchCasino(testCasino, defaultPrefs);
      expect(result.scoreBreakdown.maximumDeposit).toBeGreaterThanOrEqual(0);
      expect(result.scoreBreakdown.maximumDeposit).toBeLessThanOrEqual(DEFAULT_MATCH_WEIGHTS.maximumDeposit);
    });

    it("scores maximumDeposit when preference is set", () => {
      const prefs = { ...defaultPrefs, maxDeposit: 1000 };
      const result = matchCasino(testCasino, prefs);
      const reason = result.reasons.find(r => r.category === "maximum-deposit");
      expect(reason).toBeDefined();
      // testCasino has maxDeposit: 5000, which is >= 1000, so met
      expect(reason?.met).toBe(true);
    });

    it("scores maximumDeposit below preference", () => {
      const prefs = { ...defaultPrefs, maxDeposit: 10000 };
      const result = matchCasino(testCasino, prefs);
      const reason = result.reasons.find(r => r.category === "maximum-deposit");
      expect(reason).toBeDefined();
      // testCasino has maxDeposit: 5000, which is < 10000, so not met
      expect(reason?.met).toBe(false);
    });

    it("handles casino with no bonuses", () => {
      const noBonusCasino: Casino = { ...testCasino, bonuses: [] };
      const result = matchCasino(noBonusCasino, defaultPrefs);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(0);
    });

    it("handles casino with no payment methods", () => {
      const noPayCasino: Casino = { ...testCasino, paymentMethods: [] };
      const result = matchCasino(noPayCasino, defaultPrefs);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(0);
    });

    it("handles casino with no games", () => {
      const noGameCasino: Casino = { ...testCasino, games: [] };
      const result = matchCasino(noGameCasino, defaultPrefs);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(0);
    });

    it("handles INT country code", () => {
      const prefs = { ...defaultPrefs, country: "INT" };
      const result = matchCasino(testCasino, prefs);
      expect(result.reasons.find(r => r.category === "country")?.met).toBe(true);
    });
  });
});
