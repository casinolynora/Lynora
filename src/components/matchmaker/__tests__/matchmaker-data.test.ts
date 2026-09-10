import { describe, it, expect } from "vitest";
import { MatchRequestSchema, RefineRequestSchema, ExtractedPreferencesSchema } from "@/lib/ai/schemas";
import { UserPreferencesSchema } from "@/lib/types";
import { matchCasino, rankCasinos } from "@/lib/engine/matching";
import { Casino, UserPreferences, DEFAULT_MATCH_WEIGHTS } from "@/lib/types";

const testCasino: Casino = {
  id: "test-1",
  slug: "test-casino",
  name: "Test Casino",
  website: "https://test.example.com",
  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2025-06-01T00:00:00.000Z",
  dataSources: [{ field: "all", source: "test", verifiedAt: "2025-06-01T00:00:00.000Z" }],
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
    pros: ["Good games"],
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

describe("Matchmaker Data Layer", () => {
  describe("MatchRequestSchema validation", () => {
    it("accepts valid request", () => {
      const result = MatchRequestSchema.safeParse(defaultPrefs);
      expect(result.success).toBe(true);
    });

    it("rejects empty country", () => {
      const result = MatchRequestSchema.safeParse({ ...defaultPrefs, country: "" });
      expect(result.success).toBe(false);
    });

    it("accepts INT country code", () => {
      const result = MatchRequestSchema.safeParse({ ...defaultPrefs, country: "INT" });
      expect(result.success).toBe(true);
    });

    it("applies defaults for optional fields", () => {
      const result = MatchRequestSchema.safeParse({ country: "DE" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.preferredGames).toEqual([]);
        expect(result.data.liveCasinoPreferred).toBe(false);
        expect(result.data.bonusPreference).toBe("any");
      }
    });

    it("accepts all bonus preference values", () => {
      for (const bp of ["welcome-bonus", "free-spins", "cashback", "no-deposit", "none", "any"]) {
        const result = MatchRequestSchema.safeParse({ ...defaultPrefs, bonusPreference: bp });
        expect(result.success).toBe(true);
      }
    });
  });

  describe("UserPreferencesSchema validation", () => {
    it("validates complete preferences", () => {
      const result = UserPreferencesSchema.safeParse(defaultPrefs);
      expect(result.success).toBe(true);
    });

    it("applies defaults when missing optional fields", () => {
      const result = UserPreferencesSchema.safeParse({ country: "DE" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.preferredGames).toEqual([]);
        expect(result.data.mobileFriendly).toBe(false);
      }
    });
  });

  describe("MatchResult structure", () => {
    it("has all required fields for UI rendering", () => {
      const result = matchCasino(testCasino, defaultPrefs);
      expect(result).toHaveProperty("casinoId");
      expect(result).toHaveProperty("casinoSlug");
      expect(result).toHaveProperty("casinoName");
      expect(result).toHaveProperty("matchPercentage");
      expect(result).toHaveProperty("reasons");
      expect(result).toHaveProperty("scoreBreakdown");
      expect(result).toHaveProperty("warnings");
      expect(Array.isArray(result.reasons)).toBe(true);
      expect(result.reasons.length).toBeGreaterThan(0);
    });

    it("reasons have required fields for UI chips", () => {
      const result = matchCasino(testCasino, defaultPrefs);
      for (const reason of result.reasons) {
        expect(typeof reason.category).toBe("string");
        expect(typeof reason.label).toBe("string");
        expect(typeof reason.met).toBe("boolean");
        expect(typeof reason.weight).toBe("number");
      }
    });

    it("scoreBreakdown has all dimension keys", () => {
      const result = matchCasino(testCasino, defaultPrefs);
      const expectedKeys = ["country", "paymentMethod", "minimumDeposit", "maximumDeposit", "games", "liveCasino", "sportsBetting", "bonus", "withdrawal"];
      for (const key of expectedKeys) {
        expect(result.scoreBreakdown).toHaveProperty(key);
        expect(typeof result.scoreBreakdown[key as keyof typeof result.scoreBreakdown]).toBe("number");
      }
    });
  });

  describe("Null-safety for optional casino fields", () => {
    it("handles casino with null rating", () => {
      const casino = { ...testCasino, rating: null as unknown as number };
      const result = matchCasino(casino, defaultPrefs);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(0);
    });

    it("handles casino with null trustScore", () => {
      const casino = { ...testCasino, trustScore: null as unknown as number };
      const result = matchCasino(casino, defaultPrefs);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(0);
    });

    it("handles casino with undefined withdrawalProcessingTime", () => {
      const casino = { ...testCasino, withdrawalProcessingTime: undefined };
      const result = matchCasino(casino, { ...defaultPrefs, withdrawalPreference: "fast" });
      expect(result.matchPercentage).toBeGreaterThanOrEqual(0);
    });

    it("handles casino with undefined maxDeposit", () => {
      const casino = { ...testCasino, maxDeposit: undefined };
      const result = matchCasino(casino, defaultPrefs);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(0);
    });

    it("handles casino with empty licenses", () => {
      const casino = { ...testCasino, licenses: [] };
      const result = matchCasino(casino, defaultPrefs);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(0);
    });

    it("handles casino with empty payment methods", () => {
      const casino = { ...testCasino, paymentMethods: [] };
      const result = matchCasino(casino, defaultPrefs);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Empty results scenario", () => {
    it("rankCasinos returns empty array for no matching casinos", () => {
      const results = rankCasinos([], defaultPrefs);
      expect(results).toEqual([]);
    });

    it("rankCasinos with limit 0 returns empty", () => {
      const results = rankCasinos([testCasino], defaultPrefs, undefined, 0);
      expect(results).toEqual([]);
    });
  });

  describe("Match percentage boundaries", () => {
    it("percentage is always between 0 and 100", () => {
      const extremePrefs: UserPreferences[] = [
        { ...defaultPrefs, country: "ZZ" },
        { ...defaultPrefs, preferredGames: ["nonexistent-game"] },
        { ...defaultPrefs, preferredPaymentMethod: "NonExistent" },
        { ...defaultPrefs, minDeposit: 0, maxDeposit: 999999 },
        { ...defaultPrefs, liveCasinoPreferred: true, sportsBettingPreferred: true, cryptoPreferred: true },
      ];
      for (const prefs of extremePrefs) {
        const result = matchCasino(testCasino, prefs);
        expect(result.matchPercentage).toBeGreaterThanOrEqual(0);
        expect(result.matchPercentage).toBeLessThanOrEqual(100);
      }
    });
  });

  describe("RefineRequestSchema", () => {
    it("accepts valid refine request", () => {
      const result = RefineRequestSchema.safeParse({
        message: "I prefer PayPal",
        currentPreferences: { country: "DE", preferredGames: ["slots"] },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty message", () => {
      const result = RefineRequestSchema.safeParse({
        message: "",
        currentPreferences: { country: "DE" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects message exceeding 500 chars", () => {
      const result = RefineRequestSchema.safeParse({
        message: "x".repeat(501),
        currentPreferences: { country: "DE" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("ExtractedPreferencesSchema", () => {
    it("accepts partial preferences", () => {
      const result = ExtractedPreferencesSchema.safeParse({
        preferredPaymentMethod: "PayPal",
      });
      expect(result.success).toBe(true);
    });

    it("accepts empty object", () => {
      const result = ExtractedPreferencesSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("validates bonus preference enum", () => {
      const result = ExtractedPreferencesSchema.safeParse({
        bonusPreference: "invalid-value",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Match reason categories", () => {
    it("covers all expected categories", () => {
      const result = matchCasino(testCasino, defaultPrefs);
      const categories = new Set(result.reasons.map(r => r.category));
      expect(categories.has("country")).toBe(true);
      expect(categories.has("payment-method")).toBe(true);
      expect(categories.has("minimum-deposit")).toBe(true);
      expect(categories.has("games")).toBe(true);
      expect(categories.has("trust")).toBe(true);
    });

    it("met reasons have positive labels", () => {
      const result = matchCasino(testCasino, defaultPrefs);
      const metReasons = result.reasons.filter(r => r.met);
      for (const reason of metReasons) {
        expect(reason.label.length).toBeGreaterThan(0);
      }
    });
  });
});
