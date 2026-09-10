import type { Casino } from "@/lib/types/casino";

export const wunderino: Casino = {
  id: "germany-wunderino",
  slug: "wunderino",
  name: "Wunderino",
  tagline: "KYC-verified virtual slot machine casino",
  logo: null,
  description:
    "Wunderino is operated by Megapixel Entertainment Limited and holds a GGL licence for virtual slot machines in Germany. The platform features KYC procedures and withdrawals via the website.",
  founded: null,
  owner: "Megapixel Entertainment Limited",
  website: "https://www.wunderino.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ggl.de/de/fuer-anbieter/gewerbliche-erlaubnisregistrierung/?register",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Megapixel Entertainment Limited — Virtuelle Automatenspiele — 24.11.2022",
    },
    {
      field: "kyc",
      source: "https://www.wunderino.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "KYC procedures in place",
    },
    {
      field: "withdrawals",
      source: "https://www.wunderino.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Withdrawals requested through website",
    },
    {
      field: "paymentMethods",
      source: "https://www.wunderino.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "On-site verified: PayPal, Klarna/Sofort, Brite, Skrill, Visa/Mastercard, Paysafecard",
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

  paymentMethods: [
    { name: "PayPal", type: "e-wallet" },
    { name: "Klarna", type: "bank-transfer" },
    { name: "Sofort", type: "bank-transfer" },
    { name: "Brite", type: "bank-transfer" },
    { name: "Skrill", type: "e-wallet" },
    { name: "Visa", type: "card" },
    { name: "Mastercard", type: "card" },
    { name: "Paysafecard", type: "prepaid" },
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
      "Wunderino is operated by Megapixel Entertainment Limited under a GGL licence for virtual slot machines in Germany (granted 24.11.2022). The platform features KYC procedures and withdrawals are requested through the website. Payment methods include PayPal, Klarna/Sofort, Brite, Skrill, Visa/Mastercard, and Paysafecard.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine operator with KYC verification.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "KYC Verified"],
  tags: ["germany", "virtual-slots", "ggl-verified"],
};
