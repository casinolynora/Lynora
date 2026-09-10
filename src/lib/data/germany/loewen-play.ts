import type { Casino } from "@/lib/types/casino";

export const loewenPlay: Casino = {
  id: "germany-loewen-play",
  slug: "loewen-play",
  name: "Löwen Play",
  tagline: "German virtual slot machine operator",
  logo: null,
  description:
    "Löwen Play is operated by Löwen Play digital GmbH and holds a GGL licence for virtual slot machines in Germany.",
  founded: null,
  owner: "Löwen Play digital GmbH",
  website: "https://www.loewen-play.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ggl.de/de/fuer-anbieter/gewerbliche-erlaubnisregistrierung/?register",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Löwen Play digital GmbH — Virtuelle Automatenspiele — 15.12.2022",
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
      "Löwen Play is operated by Löwen Play digital GmbH under a GGL licence for virtual slot machines in Germany (granted 15.12.2022). On-site payment methods and responsible gambling tools have not yet been verified.",
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
