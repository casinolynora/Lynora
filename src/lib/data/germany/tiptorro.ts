import type { Casino } from "@/lib/types/casino";

export const tiptorro: Casino = {
  id: "germany-tiptorro",
  slug: "tiptorro",
  name: "TipTorro",
  tagline: "TipTorro's online casino with GGL licence",
  logo: null,
  description:
    "TipTorro is operated by Torro Tec Gaming Limited and holds a GGL licence for virtual slot machines in Germany.",
  founded: null,
  owner: "Torro Tec Gaming Limited",
  website: "https://www.games.tiptorro.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Torro Tec Gaming Limited — Virtuelle Automatenspiele — 24.07.2023",
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
      "TipTorro is operated by Torro Tec Gaming Limited under a GGL licence for virtual slot machines in Germany (granted 24.07.2023). On-site payment methods and responsible gambling tools have not yet been fully verified.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine operator.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed"],
  tags: ["germany", "virtual-slots", "ggl-verified"],
};
