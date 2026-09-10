import type { Casino } from "@/lib/types/casino";

export const daznBet: Casino = {
  id: "germany-daznbet",
  slug: "dazn-bet",
  name: "DAZN Bet",
  tagline: "DAZN's sports betting and casino platform with GGL licence",
  logo: null,
  description:
    "DAZN Bet is operated by DZBT Operations Limited and holds a GGL licence for virtual slot machines and sports betting in Germany.",
  founded: null,
  owner: "DZBT Operations Limited",
  website: "https://www.daznbet.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "DZBT Operations Limited — Virtuelle Automatenspiele — 24.06.2025; Sportwetten",
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
  hasSportsBetting: true,
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
      "DAZN Bet is operated by DZBT Operations Limited under a GGL licence for virtual slot machines and sports betting in Germany (granted 24.06.2025). On-site payment methods and responsible gambling tools have not yet been fully verified.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine and sports betting operator.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "Sports Betting"],
  tags: ["germany", "virtual-slots", "ggl-verified", "sports-betting"],
};
