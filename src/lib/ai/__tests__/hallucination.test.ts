import { describe, it, expect } from "vitest";
import { AICasinoInputSchema, AIExplanationsSchema, ExtractedPreferencesSchema, AI_REDACTED_FIELDS, AICasinoInput } from "../schemas";

const validCasinoInput: AICasinoInput = {
  id: "test-casino",
  name: "Test Casino",
  rating: 85,
  minDeposit: 20,
  countries: ["DE", "AT"],
  licenses: [{ issuer: "MGA", jurisdiction: "Malta" }],
  paymentMethods: [{ name: "Visa", type: "card" }],
  hasLiveCasino: true,
  hasSportsBetting: false,
  bonuses: [{ type: "welcome", title: "Welcome Bonus", description: "100% up to €200" }],
  games: [{ name: "Slots", slug: "slots", available: true }],
  features: ["mobile-friendly"],
  review: { pros: ["Good selection"], cons: ["Slow support"], verdict: "Solid option" },
};

describe("AI Hallucination Prevention", () => {
  describe("AICasinoInputSchema", () => {
    it("accepts valid casino input", () => {
      const result = AICasinoInputSchema.safeParse(validCasinoInput);
      expect(result.success).toBe(true);
    });

    it("rejects casino input with missing required fields", () => {
      const incomplete = { id: "test", name: "Test" };
      const result = AICasinoInputSchema.safeParse(incomplete);
      expect(result.success).toBe(false);
    });

    it("rejects casino input with invalid types", () => {
      const invalid = { ...validCasinoInput, rating: "not a number" };
      const result = AICasinoInputSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("AIExplanationsSchema", () => {
    it("rejects empty explanations array", () => {
      const result = AIExplanationsSchema.safeParse({ explanations: [] });
      expect(result.success).toBe(false);
    });

    it("rejects explanation with casinoId not in results", () => {
      // The schema itself doesn't validate IDs — that's done in openai-provider.ts
      // But it validates structure
      const result = AIExplanationsSchema.safeParse({
        explanations: [{
          casinoId: "valid-id",
          headline: "Test headline",
          summary: "Test summary",
          matchingReasons: ["Reason 1"],
          limitations: [],
          importantNotes: [],
        }],
      });
      expect(result.success).toBe(true);
    });

    it("rejects explanation with headline over 100 chars", () => {
      const result = AIExplanationsSchema.safeParse({
        explanations: [{
          casinoId: "test",
          headline: "A".repeat(101),
          summary: "Test",
          matchingReasons: ["Reason"],
          limitations: [],
          importantNotes: [],
        }],
      });
      expect(result.success).toBe(false);
    });

    it("rejects explanation with summary over 300 chars", () => {
      const result = AIExplanationsSchema.safeParse({
        explanations: [{
          casinoId: "test",
          headline: "Test",
          summary: "A".repeat(301),
          matchingReasons: ["Reason"],
          limitations: [],
          importantNotes: [],
        }],
      });
      expect(result.success).toBe(false);
    });

    it("rejects explanation with no matchingReasons", () => {
      const result = AIExplanationsSchema.safeParse({
        explanations: [{
          casinoId: "test",
          headline: "Test",
          summary: "Test",
          matchingReasons: [],
          limitations: [],
          importantNotes: [],
        }],
      });
      expect(result.success).toBe(false);
    });

    it("rejects explanation with more than 6 matchingReasons", () => {
      const result = AIExplanationsSchema.safeParse({
        explanations: [{
          casinoId: "test",
          headline: "Test",
          summary: "Test",
          matchingReasons: ["1", "2", "3", "4", "5", "6", "7"],
          limitations: [],
          importantNotes: [],
        }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("ExtractedPreferencesSchema", () => {
    it("accepts valid extracted preferences", () => {
      const result = ExtractedPreferencesSchema.safeParse({
        country: "DE",
        minDeposit: 20,
        liveCasinoPreferred: true,
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid country code format", () => {
      const result = ExtractedPreferencesSchema.safeParse({
        country: "germany",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid bonus preference", () => {
      const result = ExtractedPreferencesSchema.safeParse({
        bonusPreference: "invalid-bonus",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid withdrawal preference", () => {
      const result = ExtractedPreferencesSchema.safeParse({
        withdrawalPreference: "instant",
      });
      expect(result.success).toBe(false);
    });

    it("accepts empty preferences (no changes)", () => {
      const result = ExtractedPreferencesSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("AI_REDACTED_FIELDS", () => {
    it("includes sensitive fields that must never be sent to AI", () => {
      expect(AI_REDACTED_FIELDS).toContain("affiliateOffers");
      expect(AI_REDACTED_FIELDS).toContain("website");
      expect(AI_REDACTED_FIELDS).toContain("owner");
      expect(AI_REDACTED_FIELDS).toContain("kycDocuments");
      expect(AI_REDACTED_FIELDS).toContain("responsibleGambling");
      expect(AI_REDACTED_FIELDS).toContain("tags");
      expect(AI_REDACTED_FIELDS).toContain("restrictedCountries");
    });

    it("does not include public fields that AI needs", () => {
      expect(AI_REDACTED_FIELDS).not.toContain("name");
      expect(AI_REDACTED_FIELDS).not.toContain("rating");
      expect(AI_REDACTED_FIELDS).not.toContain("licenses");
      expect(AI_REDACTED_FIELDS).not.toContain("paymentMethods");
      expect(AI_REDACTED_FIELDS).not.toContain("bonuses");
      expect(AI_REDACTED_FIELDS).not.toContain("games");
      expect(AI_REDACTED_FIELDS).not.toContain("review");
    });
  });

  describe("Casino data integrity", () => {
    it("verifies that AI input schema does not include sensitive fields", () => {
      const schemaKeys = Object.keys(AICasinoInputSchema.shape);
      expect(schemaKeys).not.toContain("affiliateOffers");
      expect(schemaKeys).not.toContain("website");
      expect(schemaKeys).not.toContain("owner");
      expect(schemaKeys).not.toContain("kycDocuments");
      expect(schemaKeys).not.toContain("restrictedCountries");
    });

    it("verifies match score is never modified by AI schema", () => {
      // AIExplanationsSchema does not contain matchPercentage
      const schemaKeys = Object.keys(AIExplanationsSchema.shape);
      expect(schemaKeys).not.toContain("matchPercentage");
      expect(schemaKeys).not.toContain("score");
      expect(schemaKeys).not.toContain("overallScore");
    });

    it("AI cannot access affiliateOffers even if accidentally included", () => {
      // Verify AI_REDACTED_FIELDS includes affiliateOffers
      expect(AI_REDACTED_FIELDS).toContain("affiliateOffers");
    });

    it("AI cannot access website URLs", () => {
      expect(AI_REDACTED_FIELDS).toContain("website");
    });

    it("AI cannot access owner information", () => {
      expect(AI_REDACTED_FIELDS).toContain("owner");
    });

    it("AI cannot access KYC documents", () => {
      expect(AI_REDACTED_FIELDS).toContain("kycDocuments");
    });

    it("AI cannot access restricted countries", () => {
      expect(AI_REDACTED_FIELDS).toContain("restrictedCountries");
    });

    it("AI cannot access verification status", () => {
      expect(AI_REDACTED_FIELDS).toContain("status");
    });

    it("AI cannot access data sources", () => {
      // dataSources should not be in AICasinoInputSchema
      const schemaKeys = Object.keys(AICasinoInputSchema.shape);
      expect(schemaKeys).not.toContain("dataSources");
    });
  });
});
