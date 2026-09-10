import type { Casino } from "@/lib/types/casino";

export const lapalingo: Casino = {
  id: "germany-lapalingo",
  slug: "lapalingo",
  name: "Lapalingo",
  tagline: "Online casino with wide payment range",
  logo: null,
  description:
    "Lapalingo is operated by Rabbit Entertain IT Limited and holds a GGL licence for virtual slot machines in Germany. The platform supports PayPal, Klarna, Trustly, and multiple other payment methods.",
  founded: null,
  owner: "Rabbit Entertain IT Limited",
  website: "https://www.lapalingo.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ggl.de/de/fuer-anbieter/gewerbliche-erlaubnisregistrierung/?register",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Rabbit Entertain IT Limited — Virtuelle Automatenspiele",
    },
    {
      field: "paymentMethods",
      source: "https://www.lapalingo.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "On-site verified: PayPal, Paysafecard, Tink, Trustly, Klarna/Sofort, Google Pay, Apple Pay, Neteller, Skrill, Visa, Mastercard",
    },
    {
      field: "minDeposit",
      source: "https://www.lapalingo.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "€10 minimum deposit, up to €1,000",
    },
    {
      field: "crypto",
      source: "https://www.lapalingo.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "No cryptocurrency accepted",
    },
    {
      field: "demo",
      source: "https://www.lapalingo.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Demo mode available for games",
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
  maxDeposit: 1000,
  minWithdrawal: null,

  paymentMethods: [
    { name: "PayPal", type: "e-wallet" },
    { name: "Paysafecard", type: "prepaid" },
    { name: "Tink", type: "bank-transfer" },
    { name: "Trustly", type: "bank-transfer" },
    { name: "Klarna", type: "bank-transfer" },
    { name: "Sofort", type: "bank-transfer" },
    { name: "Google Pay", type: "mobile" },
    { name: "Apple Pay", type: "mobile" },
    { name: "Neteller", type: "e-wallet" },
    { name: "Skrill", type: "e-wallet" },
    { name: "Visa", type: "card" },
    { name: "Mastercard", type: "card" },
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
      "Lapalingo is operated by Rabbit Entertain IT Limited under a GGL licence for virtual slot machines in Germany. The platform accepts PayPal, Paysafecard, Tink, Trustly, Klarna/Sofort, Google Pay, Apple Pay, Neteller, Skrill, Visa, and Mastercard. Deposits range from €10 to €1,000. No cryptocurrency is accepted. Demo mode is available.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine platform with broad payment support.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "PayPal", "Demo Mode"],
  tags: ["germany", "virtual-slots", "ggl-verified"],
};
