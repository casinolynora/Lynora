import type { Casino } from "@/lib/types/casino";

export const jokerstar: Casino = {
  id: "germany-jokerstar",
  slug: "jokerstar",
  name: "Jokerstar",
  tagline: "Verified identity virtual slot machine casino",
  logo: null,
  description:
    "Jokerstar is operated by Jokerstar GmbH and holds a GGL licence for virtual slot machines in Germany. The platform uses a verification system including 1-cent transfer, Giropay ID, and Video-Ident.",
  founded: null,
  owner: "Jokerstar GmbH",
  website: "https://www.jokerstar.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ggl.de/de/fuer-anbieter/gewerbliche-erlaubnisregistrierung/?register",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Jokerstar GmbH — Virtuelle Automatenspiele — 09.08.2022",
    },
    {
      field: "kyc",
      source: "https://www.jokerstar.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Verification via 1-cent transfer, Giropay ID, or Video-Ident. 72-hour restricted access for unverified accounts.",
    },
    {
      field: "mobile",
      source: "https://www.jokerstar.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Browser and mobile access available",
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
  kycDocuments: ["1-cent transfer", "Giropay ID", "Video-Ident"],
  kycProcessingTime: "72 hours restricted access for unverified accounts",

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
      "Jokerstar is operated by Jokerstar GmbH under a GGL licence for virtual slot machines in Germany (granted 09.08.2022). The platform uses a verification system including 1-cent transfer, Giropay ID, and Video-Ident, with a 72-hour restricted access period for unverified accounts. Browser and mobile access are available.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine operator with identity verification system.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "Video-Ident Verification"],
  tags: ["germany", "virtual-slots", "ggl-verified"],
};
