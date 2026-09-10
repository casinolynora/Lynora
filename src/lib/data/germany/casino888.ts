import type { Casino } from "@/lib/types/casino";

export const casino888: Casino = {
  id: "germany-888",
  slug: "888",
  name: "888",
  tagline: "888 Holdings' online casino with GGL licence",
  logo: null,
  description:
    "888 is operated by 888 Germany Limited and holds a GGL licence for virtual slot machines, sports betting, and online poker in Germany. The platform offers 500+ slots from providers including Pragmatic Play, Play'n GO, NetEnt, Merkur, and Gamomat.",
  founded: null,
  owner: "888 Germany Limited (888 Holdings plc)",
  website: "https://www.888.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "888 Germany Limited — Virtuelle Automatenspiele — 24.01.2023; Sportwetten; Online-Poker",
    },
    {
      field: "paymentMethods",
      source: "https://www.888.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "On-site verified: PayPal, Visa, Mastercard, Trustly, Sofort/Klarna, Paysafecard, Bank Transfer",
    },
    {
      field: "minDeposit",
      source: "https://www.888.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "€10 minimum deposit",
    },
    {
      field: "mobile",
      source: "https://www.888.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Responsive mobile web app available",
    },
    {
      field: "responsibleGambling",
      source: "https://www.888.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "OASIS integration, LUGAS monitoring, deposit limits, loss limits, session limits, reality checks, self-exclusion",
    },
    {
      field: "games",
      source: "https://www.888slots.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "500+ slots, 8 virtual table games, 8 jackpot games from 12 providers",
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
    { name: "Visa", type: "card" },
    { name: "Mastercard", type: "card" },
    { name: "Trustly", type: "bank-transfer" },
    { name: "Sofort", type: "bank-transfer" },
    { name: "Paysafecard", type: "prepaid" },
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
      count: 500,
      providers: ["Pragmatic Play", "Play'n GO", "NetEnt", "Merkur", "Gamomat", "Greentube", "Push Gaming"],
    },
  ],
  hasLiveCasino: false,
  hasSportsBetting: true,
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
      "888 is operated by 888 Germany Limited under a GGL licence for virtual slot machines, sports betting, and online poker in Germany (granted 24.01.2023). The platform offers 500+ slots from providers including Pragmatic Play, Play'n GO, NetEnt, Merkur, and Gamomat. Payment methods include PayPal, Visa, Mastercard, Trustly, Sofort, and Paysafecard, with a €10 minimum deposit. Responsible gambling tools are available.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine, sports betting, and poker platform operated by 888 Holdings.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "Sports Betting", "Poker", "Mobile Web"],
  tags: ["germany", "virtual-slots", "ggl-verified", "sports-betting"],
};
