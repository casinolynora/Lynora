import type { Casino } from "@/lib/types/casino";

export const jackpotPiraten: Casino = {
  id: "germany-jackpotpiraten",
  slug: "jackpotpiraten",
  name: "JackpotPiraten",
  tagline: "Pirate-themed virtual slot machine casino",
  logo: null,
  description:
    "JackpotPiraten is operated by DGGS Deutsche Gesellschaft für Glücksspiel mbH and holds a GGL licence for virtual slot machines in Germany. The platform features a €1 minimum deposit and mobile-optimised interface.",
  founded: null,
  owner: "DGGS Deutsche Gesellschaft für Glücksspiel mbH",
  website: "https://www.jackpotpiraten.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ggl.de/de/fuer-anbieter/gewerbliche-erlaubnisregistrierung/?register",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "DGGS Deutsche Gesellschaft für Glücksspiel mbH — Virtuelle Automatenspiele — 27.04.2022",
    },
    {
      field: "paymentMethods",
      source: "https://www.jackpotpiraten.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "On-site verified: PayPal, Klarna, Trustly, Apple Pay, Mastercard, Visa, bank transfer",
    },
    {
      field: "minDeposit",
      source: "https://www.jackpotpiraten.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "€1 minimum deposit",
    },
    {
      field: "responsibleGambling",
      source: "https://www.jackpotpiraten.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Responsible gambling tools available",
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
  languages: ["de"],
  currencies: ["EUR"],

  minDeposit: 1,
  maxDeposit: null,
  minWithdrawal: null,

  paymentMethods: [
    { name: "PayPal", type: "e-wallet" },
    { name: "Klarna", type: "bank-transfer" },
    { name: "Trustly", type: "bank-transfer" },
    { name: "Apple Pay", type: "mobile" },
    { name: "Mastercard", type: "card" },
    { name: "Visa", type: "card" },
    { name: "Bank Transfer", type: "bank-transfer" },
  ],
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
    selfExclusion: true,
    depositLimits: true,
    sessionLimits: false,
    realityCheck: false,
    coolingOffPeriod: false,
    links: [],
  },

  affiliateOffers: [],
  review: {
    overview:
      "JackpotPiraten is operated by DGGS Deutsche Gesellschaft für Glücksspiel mbH under a GGL licence for virtual slot machines in Germany (granted 27.04.2022). The platform offers a €1 minimum deposit and accepts PayPal, Klarna, Trustly, Apple Pay, Mastercard, Visa, and bank transfer. Responsible gambling tools are available.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine platform with a low €1 minimum deposit.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "Low Minimum Deposit"],
  tags: ["germany", "virtual-slots", "ggl-verified"],
};
