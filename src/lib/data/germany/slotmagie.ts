import type { Casino } from "@/lib/types/casino";

export const slotMagie: Casino = {
  id: "germany-slotmagie",
  slug: "slotmagie",
  name: "SlotMagie",
  tagline: "Low minimum deposit slot machine casino",
  logo: null,
  description:
    "SlotMagie is operated by Solis Ortus Service Limited and holds a GGL licence for virtual slot machines in Germany. The platform features a €1 minimum deposit and accepts PayPal and bank transfer.",
  founded: null,
  owner: "Solis Ortus Service Limited",
  website: "https://www.slotmagie.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ggl.de/de/fuer-anbieter/gewerbliche-erlaubnisregistrierung/?register",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Solis Ortus Service Limited — Virtuelle Automatenspiele — 24.04.2025",
    },
    {
      field: "paymentMethods",
      source: "https://www.slotmagie.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "On-site verified: PayPal, bank transfer, cards",
    },
    {
      field: "minDeposit",
      source: "https://www.slotmagie.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "€1 minimum deposit for stated promotion",
    },
    {
      field: "responsibleGambling",
      source: "https://www.slotmagie.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Responsible gambling tools available, 18+",
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
    { name: "Bank Transfer", type: "bank-transfer" },
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
      "SlotMagie is operated by Solis Ortus Service Limited under a GGL licence for virtual slot machines in Germany (granted 24.04.2025). The platform offers a €1 minimum deposit and accepts PayPal, bank transfer, Visa, and Mastercard. Responsible gambling tools are available. Players must be 18+.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine platform with a €1 minimum deposit.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "Low Minimum Deposit"],
  tags: ["germany", "virtual-slots", "ggl-verified"],
};
