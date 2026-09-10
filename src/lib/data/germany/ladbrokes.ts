import type { Casino } from "@/lib/types/casino";

export const ladbrokes: Casino = {
  id: "germany-ladbrokes",
  slug: "ladbrokes",
  name: "Ladbrokes",
  tagline: "Entain's online casino and sportsbook with GGL licence",
  logo: null,
  description:
    "Ladbrokes is operated by Ladbrokes (Deutschland) Limited and holds a GGL licence for virtual slot machines, sports betting, and online poker in Germany.",
  founded: null,
  owner: "Ladbrokes (Deutschland) Limited (Entain plc)",
  website: "https://www.bpremium.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Ladbrokes (Deutschland) Limited — Virtuelle Automatenspiele — 10.11.2022; Sportwetten; Online-Poker",
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
      "Ladbrokes is operated by Ladbrokes (Deutschland) Limited under a GGL licence for virtual slot machines, sports betting, and online poker in Germany (granted 10.11.2022). On-site payment methods and responsible gambling tools have not yet been fully verified.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine, sports betting, and poker operator.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "Sports Betting", "Poker"],
  tags: ["germany", "virtual-slots", "ggl-verified", "sports-betting"],
};
