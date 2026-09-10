/**
 * ============================================================
 * GERMANY DEVELOPMENT FIXTURES — DEMO DATA ONLY
 * ============================================================
 * These are fictional casinos for development and testing.
 * None are real. None are verified. None appear on production
 * Germany pages. verificationStatus: "draft" for all.
 *
 * Real casino data will be added in a separate data population
 * step after the code architecture is complete.
 * ============================================================
 */

import type { Casino } from "@/lib/types";

const now = new Date().toISOString();

export const GERMANY_FIXTURE_CASINOS: Casino[] = [
  {
    id: "de-fixture-1",
    slug: "demo-casino-one",
    name: "Demo Casino One",
    tagline: "Development fixture — not a real casino",
    founded: 2020,
    website: "https://example.com",
    status: "active",
    verificationStatus: "draft",
    lastVerifiedAt: now,
    dataSources: [],
    rating: 75,
    trustScore: 70,
    licenses: [{ issuer: "Demo License", jurisdiction: "DE" }],
    countries: ["DE", "AT"],
    restrictedCountries: [],
    languages: ["de", "en"],
    currencies: ["EUR"],
    minDeposit: 10,
    paymentMethods: [{ name: "Visa", type: "card" }],
    withdrawalMethods: [],
    bonuses: [{ type: "welcome", title: "Demo Bonus", description: "For testing only" }],
    games: [{ name: "Slots", slug: "slots", available: true }],
    hasLiveCasino: true,
    hasSportsBetting: false,
    hasCrypto: false,
    hasMobile: true,
    kycRequired: true,
    minAge: 18,
    responsibleGambling: {
      selfExclusion: true,
      depositLimits: true,
      sessionLimits: true,
      realityCheck: true,
      coolingOffPeriod: true,
    },
    affiliateOffers: [],
    review: {
      overview: "Development fixture — not a real casino",
      pros: ["For testing only"],
      cons: ["Not real"],
      verdict: "Development fixture",
      score: 75,
      scoreBreakdown: {
        gameVariety: 7,
        bonusValue: 7,
        paymentSpeed: 7,
        customerSupport: 7,
        trustAndSafety: 7,
        userExperience: 7,
      },
    },
    features: [],
    tags: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "de-fixture-2",
    slug: "demo-casino-two",
    name: "Demo Casino Two",
    tagline: "Development fixture — not a real casino",
    founded: 2021,
    website: "https://example.com",
    status: "active",
    verificationStatus: "draft",
    lastVerifiedAt: now,
    dataSources: [],
    rating: 80,
    trustScore: 75,
    licenses: [{ issuer: "Demo License", jurisdiction: "DE" }],
    countries: ["DE"],
    restrictedCountries: [],
    languages: ["de"],
    currencies: ["EUR"],
    minDeposit: 20,
    paymentMethods: [{ name: "PayPal", type: "e-wallet" }],
    withdrawalMethods: [],
    bonuses: [{ type: "free-spins", title: "Demo Spins", description: "For testing only" }],
    games: [
      { name: "Slots", slug: "slots", available: true },
      { name: "Blackjack", slug: "blackjack", available: true },
    ],
    hasLiveCasino: false,
    hasSportsBetting: true,
    hasCrypto: false,
    hasMobile: true,
    kycRequired: true,
    minAge: 18,
    responsibleGambling: {
      selfExclusion: true,
      depositLimits: true,
      sessionLimits: false,
      realityCheck: false,
      coolingOffPeriod: true,
    },
    affiliateOffers: [],
    review: {
      overview: "Development fixture — not a real casino",
      pros: ["For testing only"],
      cons: ["Not real"],
      verdict: "Development fixture",
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
  },
];
