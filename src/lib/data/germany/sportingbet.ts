import type { Casino } from "@/lib/types/casino";

export const sportingbet: Casino = {
  id: "germany-sportingbet",
  slug: "sportingbet",
  name: "Sportingbet",
  tagline: "Entain's online casino and sportsbook with GGL licence",
  logo: null,
  description:
    "Sportingbet is operated by Sportingbet (Deutschland) Limited and holds a GGL licence for virtual slot machines and sports betting in Germany.",
  founded: null,
  owner: "Sportingbet (Deutschland) Limited (Entain plc)",
  website: "https://www.sportingbet.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Sportingbet (Deutschland) Limited — Virtuelle Automatenspiele — 15.11.2022; Sportwetten",
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
      "Sportingbet is operated by Sportingbet (Deutschland) Limited under a GGL licence for virtual slot machines and sports betting in Germany (granted 15.11.2022). On-site payment methods and responsible gambling tools have not yet been fully verified.",
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
