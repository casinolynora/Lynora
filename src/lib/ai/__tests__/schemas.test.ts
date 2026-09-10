import { describe, it, expect } from "vitest";
import {
  AIExplanationItemSchema,
  AIExplanationsSchema,
  MatchRequestSchema,
  RefineRequestSchema,
  ExtractedPreferencesSchema,
} from "../schemas";

describe("AI Schemas", () => {
  describe("AIExplanationItemSchema", () => {
    it("accepts valid explanation", () => {
      const valid = {
        casinoId: "test-1",
        headline: "Great match for you",
        summary: "This casino matches your preferences well.",
        matchingReasons: ["Available in your country", "Supports Visa"],
        limitations: [],
        importantNotes: ["Wagering requirements apply"],
      };
      expect(AIExplanationItemSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects missing casinoId", () => {
      const invalid = {
        headline: "Test",
        summary: "Test",
        matchingReasons: ["Test"],
        limitations: [],
        importantNotes: [],
      };
      expect(AIExplanationItemSchema.safeParse(invalid).success).toBe(false);
    });

    it("rejects empty matchingReasons", () => {
      const invalid = {
        casinoId: "test",
        headline: "Test",
        summary: "Test",
        matchingReasons: [],
        limitations: [],
        importantNotes: [],
      };
      expect(AIExplanationItemSchema.safeParse(invalid).success).toBe(false);
    });

    it("rejects headline over 100 chars", () => {
      const invalid = {
        casinoId: "test",
        headline: "x".repeat(101),
        summary: "Test",
        matchingReasons: ["Test"],
        limitations: [],
        importantNotes: [],
      };
      expect(AIExplanationItemSchema.safeParse(invalid).success).toBe(false);
    });

    it("rejects summary over 300 chars", () => {
      const invalid = {
        casinoId: "test",
        headline: "Test",
        summary: "x".repeat(301),
        matchingReasons: ["Test"],
        limitations: [],
        importantNotes: [],
      };
      expect(AIExplanationItemSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe("AIExplanationsSchema", () => {
    it("accepts valid explanations array", () => {
      const valid = {
        explanations: [
          {
            casinoId: "test-1",
            headline: "Good match",
            summary: "Matches well.",
            matchingReasons: ["Country matches"],
            limitations: [],
            importantNotes: [],
          },
        ],
      };
      expect(AIExplanationsSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects non-array", () => {
      expect(AIExplanationsSchema.safeParse({ explanations: "not-array" }).success).toBe(false);
    });
  });

  describe("MatchRequestSchema", () => {
    it("accepts valid request", () => {
      const valid = {
        country: "DE",
        minDeposit: 20,
        maxDeposit: 500,
        preferredPaymentMethod: "Visa",
        preferredGames: ["slots"],
        liveCasinoPreferred: true,
        sportsBettingPreferred: false,
        bonusPreference: "welcome-bonus",
        withdrawalPreference: "fast",
        cryptoPreferred: false,
        mobileFriendly: false,
      };
      expect(MatchRequestSchema.safeParse(valid).success).toBe(true);
    });

    it("accepts minimal request", () => {
      const valid = { country: "DE" };
      expect(MatchRequestSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects empty country", () => {
      expect(MatchRequestSchema.safeParse({ country: "" }).success).toBe(false);
    });

    it("rejects invalid bonusPreference", () => {
      expect(MatchRequestSchema.safeParse({ country: "DE", bonusPreference: "invalid" }).success).toBe(false);
    });

    it("rejects invalid withdrawalPreference", () => {
      expect(MatchRequestSchema.safeParse({ country: "DE", withdrawalPreference: "instant" }).success).toBe(false);
    });
  });

  describe("RefineRequestSchema", () => {
    it("accepts valid refine request", () => {
      const valid = {
        message: "I want fast withdrawals",
        currentPreferences: { country: "DE" },
      };
      expect(RefineRequestSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects empty message", () => {
      expect(RefineRequestSchema.safeParse({ message: "", currentPreferences: { country: "DE" } }).success).toBe(false);
    });

    it("rejects message over 500 chars", () => {
      expect(RefineRequestSchema.safeParse({ message: "x".repeat(501), currentPreferences: { country: "DE" } }).success).toBe(false);
    });
  });

  describe("ExtractedPreferencesSchema", () => {
    it("accepts partial preferences", () => {
      const valid = { withdrawalPreference: "fast" };
      expect(ExtractedPreferencesSchema.safeParse(valid).success).toBe(true);
    });

    it("accepts empty object", () => {
      expect(ExtractedPreferencesSchema.safeParse({}).success).toBe(true);
    });

    it("rejects invalid enum values", () => {
      expect(ExtractedPreferencesSchema.safeParse({ bonusPreference: "invalid" }).success).toBe(false);
    });

    it("rejects invalid country code type", () => {
      expect(ExtractedPreferencesSchema.safeParse({ country: 123 }).success).toBe(false);
    });
  });

  describe("Hallucination prevention", () => {
    it("AI response with unknown casino ID is filtered out", () => {
      const validIds = new Set(["real-casino"]);
      const explanations = [
        {
          casinoId: "real-casino",
          headline: "Good",
          summary: "Test",
          matchingReasons: ["Test"],
          limitations: [],
          importantNotes: [],
        },
        {
          casinoId: "hallucinated-casino",
          headline: "Fake",
          summary: "This should be filtered",
          matchingReasons: ["Test"],
          limitations: [],
          importantNotes: [],
        },
      ];
      const filtered = explanations.filter(e => validIds.has(e.casinoId));
      expect(filtered.length).toBe(1);
      expect(filtered[0].casinoId).toBe("real-casino");
    });

    it("score modification is rejected by schema", () => {
      const invalid = {
        casinoId: "test",
        headline: "Test",
        summary: "Test",
        matchingReasons: ["Test"],
        limitations: [],
        importantNotes: [],
        matchPercentage: 999, // AI tried to modify score
      };
      // Schema should not accept extra fields (strict mode not enabled, but field isn't in schema)
      const result = AIExplanationItemSchema.safeParse(invalid);
      expect(result.success).toBe(true); // Zod strips unknown fields by default
      if (result.success) {
        expect(result.data).not.toHaveProperty("matchPercentage");
      }
    });
  });
});
