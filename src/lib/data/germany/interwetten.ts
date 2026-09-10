import type { Casino } from "@/lib/types/casino";

export const interwetten: Casino = {
  id: "germany-interwetten",
  slug: "interwetten",
  name: "Interwetten",
  tagline: "Interwetten's online casino and sportsbook with GGL licence",
  logo: null,
  description:
    "Interwetten is operated by Interwetten Gaming Limited and holds a GGL licence for virtual slot machines and sports betting in Germany.",
  founded: null,
  owner: "Interwetten Gaming Limited",
  website: "https://www.interwetten.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Interwetten Gaming Limited — Virtuelle Automatenspiele — 13.10.2022; Sportwetten",
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
      "Interwetten is operated by Interwetten Gaming Limited under a GGL licence for virtual slot machines and sports betting in Germany (granted 13.10.2022). On-site payment methods and responsible gambling tools have not yet been fully verified.",
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
