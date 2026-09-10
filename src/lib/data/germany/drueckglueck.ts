import type { Casino } from "@/lib/types/casino";

export const drueckGlueck: Casino = {
  id: "germany-drueckglueck",
  slug: "drueckglueck",
  name: "DrückGlück",
  tagline: "Skill On Net's leading German online casino with GGL licence",
  logo: null,
  description:
    "DrückGlück is operated by Skill On Net Ltd and holds a GGL licence for virtual slot machines in Germany. The platform offers 1,300+ slots from multiple providers and supports several payment methods.",
  founded: 2015,
  owner: "Skill On Net Ltd",
  website: "https://www.drueckglueck.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Skill On Net Limited — Virtuelle Automatenspiele — 29.12.2022",
    },
    {
      field: "paymentMethods",
      source: "https://www.drueckglueck.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "On-site verified: PayPal, Paysafecard, Visa, Mastercard, Trustly, Apple Pay, Klarna",
    },
    {
      field: "minDeposit",
      source: "https://www.drueckglueck.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "€10 standard minimum deposit; €9.50 for Paysafecard",
    },
    {
      field: "mobile",
      source: "https://www.drueckglueck.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "iOS native app and responsive web app available",
    },
    {
      field: "responsibleGambling",
      source: "https://www.drueckglueck.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Deposit limits, reality check every 60 minutes, panic button, cool-off, self-exclusion, OASIS integration, LUGAS monitoring",
    },
    {
      field: "games",
      source: "https://www.drueckglueck.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "1,316 slot games listed on site",
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

  minDeposit: 10,
  maxDeposit: null,
  minWithdrawal: null,

  paymentMethods: [
    { name: "PayPal", type: "e-wallet" },
    { name: "Paysafecard", type: "prepaid" },
    { name: "Visa", type: "card" },
    { name: "Mastercard", type: "card" },
    { name: "Trustly", type: "bank-transfer" },
    { name: "Apple Pay", type: "mobile" },
    { name: "Klarna", type: "bank-transfer" },
  ],
  withdrawalMethods: [],
  withdrawalProcessingTime: null,

  bonuses: [],
  games: [
    {
      name: "Virtual Slots",
      slug: "virtual-slots",
      available: true,
      count: 1316,
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
    sessionLimits: true,
    realityCheck: true,
    coolingOffPeriod: true,
    links: [],
  },

  affiliateOffers: [],
  review: {
    overview:
      "DrückGlück is operated by Skill On Net Ltd under a GGL licence for virtual slot machines in Germany (granted 29.12.2022). The platform offers 1,316 slots. Payment methods include PayPal, Paysafecard, Visa, Mastercard, Trustly, Apple Pay, and Klarna, with a €10 minimum deposit. Over 95% of withdrawals are processed in under 1 minute. Responsible gambling tools including deposit limits, reality checks, panic button, and OASIS integration are available.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine platform operated by Skill On Net Ltd.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "1300+ Slots", "Fast Withdrawals", "Mobile App"],
  tags: ["germany", "virtual-slots", "ggl-verified"],
};
