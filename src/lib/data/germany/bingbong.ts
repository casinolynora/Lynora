import type { Casino } from "@/lib/types/casino";

export const bingBong: Casino = {
  id: "germany-bingbong",
  slug: "bingbong",
  name: "BingBong",
  tagline: "DGGS-operated slot machine casino",
  logo: null,
  description:
    "BingBong is operated by DGGS Deutsche Gesellschaft für Glücksspiel mbH and holds a GGL licence for virtual slot machines in Germany. The platform features 826 slots and a €1 minimum deposit.",
  founded: null,
  owner: "DGGS Deutsche Gesellschaft für Glücksspiel mbH",
  website: "https://www.bingbong.de",

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
      field: "games",
      source: "https://www.bingbong.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "826 slots available, described as volatile game selection",
    },
    {
      field: "paymentMethods",
      source: "https://www.bingbong.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "On-site verified: PayPal, Apple Pay, Trustly, Klarna/Sofort, Sofort, Mastercard, Visa",
    },
    {
      field: "minDeposit",
      source: "https://www.bingbong.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "€1 minimum deposit",
    },
    {
      field: "mobile",
      source: "https://www.bingbong.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Mobile-optimised site",
    },
    {
      field: "kyc",
      source: "https://www.bingbong.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "KYC verification required",
    },
    {
      field: "responsibleGambling",
      source: "https://www.bingbong.de",
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
    { name: "Apple Pay", type: "mobile" },
    { name: "Trustly", type: "bank-transfer" },
    { name: "Klarna", type: "bank-transfer" },
    { name: "Sofort", type: "bank-transfer" },
    { name: "Mastercard", type: "card" },
    { name: "Visa", type: "card" },
  ],
  withdrawalMethods: [],
  withdrawalProcessingTime: null,

  bonuses: [],
  games: [
    {
      name: "Virtual Slots",
      slug: "virtual-slots",
      available: true,
      count: 826,
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
      "BingBong is operated by DGGS Deutsche Gesellschaft für Glücksspiel mbH under a GGL licence for virtual slot machines in Germany (granted 27.04.2022). The platform offers 826 slots with a €1 minimum deposit and accepts PayPal, Apple Pay, Trustly, Klarna/Sofort, Sofort, Mastercard, and Visa. KYC verification is required. Responsible gambling tools are available.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine platform with 826 slots and a €1 minimum deposit.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "826 Slots", "Low Minimum Deposit"],
  tags: ["germany", "virtual-slots", "ggl-verified"],
};
