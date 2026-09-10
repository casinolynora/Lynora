import { z } from "zod";

// ─── Casino data sent to AI (minimal, structured, type-safe allowlist) ───────

export const AICasinoInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.number(),
  trustScore: z.number().optional(),
  minDeposit: z.number(),
  maxDeposit: z.number().optional(),
  countries: z.array(z.string()),
  licenses: z.array(z.object({ issuer: z.string(), jurisdiction: z.string() })),
  paymentMethods: z.array(z.object({ name: z.string(), type: z.string() })),
  withdrawalProcessingTime: z.string().optional(),
  hasLiveCasino: z.boolean(),
  hasSportsBetting: z.boolean(),
  bonuses: z.array(z.object({
    type: z.string(),
    title: z.string(),
    description: z.string(),
    wageringRequirement: z.string().optional(),
  })),
  games: z.array(z.object({ name: z.string(), slug: z.string(), available: z.boolean() })),
  features: z.array(z.string()),
  review: z.object({
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    verdict: z.string(),
  }),
});
export type AICasinoInput = z.infer<typeof AICasinoInputSchema>;

// Fields that are NEVER sent to the AI provider
export const AI_REDACTED_FIELDS = [
  "affiliateOffers",
  "website",
  "owner",
  "slug",
  "kycDocuments",
  "kycProcessingTime",
  "responsibleGambling",
  "tags",
  "restrictedCountries",
  "createdAt",
  "updatedAt",
  "status",
  "minAge",
] as const;

// ─── AI Explanation Response (validated) ─────────────────────────────────────

export const AIExplanationItemSchema = z.object({
  casinoId: z.string(),
  headline: z.string().max(100),
  summary: z.string().max(300),
  matchingReasons: z.array(z.string()).min(1).max(6),
  limitations: z.array(z.string()).max(4),
  importantNotes: z.array(z.string()).max(3),
});
export type AIExplanationItem = z.infer<typeof AIExplanationItemSchema>;

export const AIExplanationsSchema = z.object({
  explanations: z.array(AIExplanationItemSchema).min(1),
});
export type AIExplanations = z.infer<typeof AIExplanationsSchema>;

// ─── Match Request (from client to server) ───────────────────────────────────

export const MatchRequestSchema = z.object({
  country: z.union([z.string().regex(/^[A-Z]{2}$/), z.literal("INT")]),
  minDeposit: z.number().min(0).optional(),
  maxDeposit: z.number().min(0).optional(),
  preferredPaymentMethod: z.string().optional(),
  preferredGames: z.array(z.string()).default([]),
  liveCasinoPreferred: z.boolean().default(false),
  sportsBettingPreferred: z.boolean().default(false),
  bonusPreference: z.enum(["welcome-bonus", "free-spins", "cashback", "no-deposit", "none", "any"]).default("any"),
  withdrawalPreference: z.enum(["fast", "standard", "no-preference"]).default("no-preference"),
  cryptoPreferred: z.boolean().default(false),
  mobileFriendly: z.boolean().default(false),
});
export type MatchRequest = z.infer<typeof MatchRequestSchema>;

// ─── Refinement Request (natural language) ───────────────────────────────────

export const RefineRequestSchema = z.object({
  message: z.string().min(1).max(500),
  currentPreferences: MatchRequestSchema,
});
export type RefineRequest = z.infer<typeof RefineRequestSchema>;

// ─── Preference Extraction (AI output, validated) ────────────────────────────

export const ExtractedPreferencesSchema = z.object({
  country: z.union([z.string().regex(/^[A-Z]{2}$/), z.literal("INT")]).optional(),
  minDeposit: z.number().optional(),
  maxDeposit: z.number().optional(),
  preferredPaymentMethod: z.string().optional(),
  preferredGames: z.array(z.string()).optional(),
  liveCasinoPreferred: z.boolean().optional(),
  sportsBettingPreferred: z.boolean().optional(),
  bonusPreference: z.enum(["welcome-bonus", "free-spins", "cashback", "no-deposit", "none", "any"]).optional(),
  withdrawalPreference: z.enum(["fast", "standard", "no-preference"]).optional(),
  cryptoPreferred: z.boolean().optional(),
  mobileFriendly: z.boolean().optional(),
});
export type ExtractedPreferences = z.infer<typeof ExtractedPreferencesSchema>;

// ─── Refinement Response ─────────────────────────────────────────────────────

export const RefineResponseSchema = z.object({
  updatedPreferences: MatchRequestSchema,
  changeDescription: z.string().max(200),
});
export type RefineResponse = z.infer<typeof RefineResponseSchema>;

