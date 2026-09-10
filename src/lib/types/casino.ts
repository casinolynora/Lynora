import { z } from "zod";

// ─── Verification & Data Provenance ────────────────────────────────────────

export const VerificationStatusSchema = z.enum([
  "demo",
  "draft",
  "verified",
  "needs_review",
  "archived",
]);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

export const DataSourceSchema = z.object({
  field: z.string(),
  source: z.string(),
  verifiedAt: z.string().datetime(),
  verifiedBy: z.string().optional(),
  notes: z.string().optional(),
});
export type DataSource = z.infer<typeof DataSourceSchema>;

// ─── Casino Schemas ────────────────────────────────────────────────────────

export const LicenseSchema = z.object({
  issuer: z.string(),
  jurisdiction: z.string(),
  licenseNumber: z.string().optional(),
  url: z.string().url().optional(),
  status: z.enum(["active", "suspended", "revoked"]).optional(),
  verifiedAt: z.string().datetime().optional(),
});
export type License = z.infer<typeof LicenseSchema>;

export const PaymentMethodSchema = z.object({
  name: z.string(),
  type: z.enum(["e-wallet", "card", "bank-transfer", "crypto", "prepaid", "mobile"]),
  minDeposit: z.number().optional(),
  maxDeposit: z.number().optional(),
  minWithdrawal: z.number().optional(),
  maxWithdrawal: z.number().optional(),
  withdrawalTime: z.string().optional(),
  fees: z.string().optional(),
});
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const BonusSchema = z.object({
  type: z.enum(["welcome", "reload", "free-spins", "cashback", "no-deposit", "other"]),
  title: z.string(),
  description: z.string(),
  amount: z.string().optional(),
  wageringRequirement: z.string().optional(),
  maxBet: z.string().optional(),
  expiresIn: z.string().optional(),
  minDeposit: z.number().optional(),
  promoCode: z.string().optional(),
  termsUrl: z.string().optional(),
});
export type CasinoBonus = z.infer<typeof BonusSchema>;

export const GameCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  available: z.boolean(),
  count: z.number().optional(),
  providers: z.array(z.string()).optional(),
});
export type GameCategory = z.infer<typeof GameCategorySchema>;

export const ResponsibleGamblingSchema = z.object({
  selfExclusion: z.boolean(),
  depositLimits: z.boolean(),
  sessionLimits: z.boolean(),
  realityCheck: z.boolean(),
  coolingOffPeriod: z.boolean(),
  links: z.array(z.object({ name: z.string(), url: z.string().url() })).optional(),
});
export type ResponsibleGambling = z.infer<typeof ResponsibleGamblingSchema>;

export const AffiliateOfferSchema = z.object({
  id: z.string(),
  geo: z.union([z.string().regex(/^[A-Z]{2}$/), z.literal("ALL")]),
  network: z.string().optional(),
  campaignId: z.string().optional(),
  trackingUrl: z.string().url(),
  ctaText: z.string().default("Visit Casino"),
  isActive: z.boolean().default(true),
  payoutInfo: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  lastVerifiedAt: z.string().optional(),
});
export type AffiliateOffer = z.infer<typeof AffiliateOfferSchema>;

export const CasinoReviewSchema = z.object({
  overview: z.string(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  verdict: z.string(),
  score: z.number().min(0).max(100).nullable(),
  scoreBreakdown: z.object({
    gameVariety: z.number().min(0).max(10),
    bonusValue: z.number().min(0).max(10),
    paymentSpeed: z.number().min(0).max(10),
    customerSupport: z.number().min(0).max(10),
    trustAndSafety: z.number().min(0).max(10),
    userExperience: z.number().min(0).max(10),
  }).nullable(),
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
});
export type CasinoReview = z.infer<typeof CasinoReviewSchema>;

export const CasinoSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  tagline: z.string().optional(),
  logo: z.string().url().optional().nullable(),
  description: z.string().optional(),
  founded: z.number().optional().nullable(),
  owner: z.string().optional(),
  website: z.string().url(),

  // Verification — controls production visibility
  status: z.enum(["active", "inactive", "pending"]).default("active"),
  verificationStatus: VerificationStatusSchema.default("draft"),
  lastVerifiedAt: z.string().datetime(),
  dataSources: z.array(DataSourceSchema).default([]),

  rating: z.number().min(0).max(100).nullable(),
  trustScore: z.number().min(0).max(100).optional().nullable(),

  licenses: z.array(LicenseSchema).min(1),
  countries: z.array(z.string()),
  restrictedCountries: z.array(z.string()).default([]),
  languages: z.array(z.string()),
  currencies: z.array(z.string()),

  minDeposit: z.number(),
  maxDeposit: z.number().optional().nullable(),
  minWithdrawal: z.number().optional().nullable(),

  paymentMethods: z.array(PaymentMethodSchema),
  withdrawalMethods: z.array(z.string()).optional().default([]),
  withdrawalProcessingTime: z.string().optional().nullable(),

  bonuses: z.array(BonusSchema),
  games: z.array(GameCategorySchema),
  hasLiveCasino: z.boolean(),
  hasSportsBetting: z.boolean(),
  hasCrypto: z.boolean().default(false),
  hasMobile: z.boolean().default(true),

  kycRequired: z.boolean(),
  kycDocuments: z.array(z.string()).optional(),
  kycProcessingTime: z.string().optional().nullable(),

  minAge: z.number().default(18),

  responsibleGambling: ResponsibleGamblingSchema,

  affiliateOffers: z.array(AffiliateOfferSchema),
  review: CasinoReviewSchema,

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  features: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});
export type Casino = z.infer<typeof CasinoSchema>;

export type CasinoListItem = Pick<Casino,
  | "id" | "slug" | "name" | "tagline" | "logo" | "rating" | "trustScore"
  | "licenses" | "minDeposit" | "paymentMethods" | "bonuses"
  | "games" | "hasLiveCasino" | "hasSportsBetting" | "lastVerifiedAt"
  | "countries" | "features" | "affiliateOffers" | "status"
  | "verificationStatus"
>;
