import type { Casino } from "@/lib/types/casino";

export const pokerStars: Casino = {
  id: "germany-pokerstars",
  slug: "pokerstars",
  name: "PokerStars",
  tagline: "Flutter's online poker and slots with GGL licence",
  logo: null,
  description:
    "PokerStars is operated by Reel Germany Limited and holds a GGL licence for virtual slot machines and online poker in Germany.",
  founded: null,
  owner: "Reel Germany Limited (Flutter Entertainment)",
  website: "https://www.pokerstars.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Reel Germany Limited — Virtuelle Automatenspiele — 22.03.2023; Online-Poker",
    },
  ],

  rating: null,
  trustScore: null,

  licenses: [
    {
      issuer: "GGL",
      jurisdiction: "DE",
      status: "active",
      verifiedAt: "2026-09-07T00:00:00Z",
    },
  ],
  countries: ["DE"],
  restrictedCountries: [],
  languages: ["de", "en"],
  currencies: ["EUR"],

  minDeposit: 10,
  maxDeposit: null,
  minWithdrawal: null,

  paymentMethods: [],
  withdrawalMethods: [],
  withdrawalProcessingTime: null,

  bonuses: [],
  games: [
    {
      name: "Virtual Slots",
      slug: "virtual-slots",
      available: true,
    },
  ],
  hasLiveCasino: false,
  hasSportsBetting: false,
  hasCrypto: false,
  hasMobile: true,

  kycRequired: true,
  kycDocuments: [],
  kycProcessingTime: null,

  minAge: 18,

  responsibleGambling: {
    selfExclusion: false,
    depositLimits: false,
    sessionLimits: false,
    realityCheck: false,
    coolingOffPeriod: false,
    links: [],
  },

  affiliateOffers: [],
  review: {
    overview:
      "PokerStars is operated by Reel Germany Limited under a GGL licence for virtual slot machines and online poker in Germany (granted 22.03.2023). On-site payment methods and responsible gambling tools have not yet been fully verified.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine and online poker operator.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "Poker"],
  tags: ["germany", "virtual-slots", "ggl-verified", "poker"],
};
