import { describe, it, expect } from "vitest";
import { buildExplainPrompt, buildPreferenceExtractionPrompt } from "../prompts";
import { AICasinoInput } from "../schemas";

function makeCasinoInput(overrides: Partial<AICasinoInput> = {}): AICasinoInput {
  return {
    id: "test-1",
    name: "Test Casino",
    rating: 80,
    minDeposit: 10,
    countries: ["DE"],
    licenses: [{ issuer: "MGA", jurisdiction: "MT" }],
    paymentMethods: [{ name: "Visa", type: "card" }],
    hasLiveCasino: true,
    hasSportsBetting: false,
    bonuses: [{ type: "welcome", title: "Welcome", description: "100% up to €100" }],
    games: [{ name: "Slots", slug: "slots", available: true }],
    features: [],
    review: { pros: ["Good"], cons: ["None"], verdict: "Great" },
    ...overrides,
  };
}

describe("AI Prompts", () => {
  describe("buildExplainPrompt", () => {
    it("limits casinos to MAX_CASINOS_IN_PROMPT (8)", () => {
      const casinos = Array.from({ length: 20 }, (_, i) =>
        makeCasinoInput({ id: `casino-${i}`, name: `Casino ${i}` })
      );
      const matchPercentages = Object.fromEntries(casinos.map(c => [c.id, 80]));
      const prompt = buildExplainPrompt("DE preferences", casinos, matchPercentages);
      // Should only contain 8 casinos in the user message
      const casinoCount = (prompt.user.match(/CASINO:/g) ?? []).length;
      expect(casinoCount).toBe(8);
    });

    it("includes all casinos when under limit", () => {
      const casinos = Array.from({ length: 5 }, (_, i) =>
        makeCasinoInput({ id: `casino-${i}`, name: `Casino ${i}` })
      );
      const matchPercentages = Object.fromEntries(casinos.map(c => [c.id, 80]));
      const prompt = buildExplainPrompt("DE preferences", casinos, matchPercentages);
      const casinoCount = (prompt.user.match(/CASINO:/g) ?? []).length;
      expect(casinoCount).toBe(5);
    });

    it("truncates long review text", () => {
      const longPros = Array.from({ length: 20 }, () => "A".repeat(100));
      const casino = makeCasinoInput({
        review: { pros: longPros, cons: [], verdict: "B".repeat(500) },
      });
      const prompt = buildExplainPrompt("DE preferences", [casino], { "test-1": 80 });
      // Should contain truncated text (...)
      expect(prompt.user).toContain("...");
    });

    it("system prompt contains anti-hallucination rules", () => {
      const prompt = buildExplainPrompt("DE preferences", [], {});
      expect(prompt.system).toContain("NEVER invent");
      expect(prompt.system).toContain("fabricate");
    });
  });

  describe("buildPreferenceExtractionPrompt", () => {
    it("returns system and user prompts", () => {
      const prompt = buildPreferenceExtractionPrompt("I want slots", {});
      expect(prompt.system).toBeTruthy();
      expect(prompt.user).toBeTruthy();
    });

    it("includes user message in prompt", () => {
      const prompt = buildPreferenceExtractionPrompt("I want slots", {});
      expect(prompt.user).toContain("I want slots");
    });

    it("includes current preferences", () => {
      const prefs = { country: "DE", minDeposit: 20 };
      const prompt = buildPreferenceExtractionPrompt("I want slots", prefs);
      expect(prompt.user).toContain("DE");
    });

    it("system prompt contains allowed values", () => {
      const prompt = buildPreferenceExtractionPrompt("test", {});
      expect(prompt.system).toContain("country:");
      expect(prompt.system).toContain("preferredPaymentMethod:");
    });
  });
});
