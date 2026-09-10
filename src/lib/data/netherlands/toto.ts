import type { Casino } from "@/lib/types/casino";

export const toto: Casino = {
  id: "netherlands-toto",
  slug: "toto",
  name: "TOTO",
  tagline: "The Netherlands' official sports betting and casino platform",
  logo: null,
  description:
    "TOTO is operated by TOTO Online B.V., part of the Nederlandse Loterij group. It holds a KSA licence for online casino games, sports betting, and horse racing in the Netherlands. The platform offers a comprehensive range of betting options and casino games.",
  founded: null,
  owner: "TOTO Online B.V. (Nederlandse Loterij)",
  website: "https://www.toto.nl",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ksa.nl/toezicht/register-vergunninghouders",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSA Register",
      notes: "TOTO Online B.V. — Online kansspelen — renewed Oct 2026, valid through 2031",
    },
    {
      field: "paymentMethods",
      source: "https://www.toto.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: iDEAL",
    },
    {
      field: "minDeposit",
      source: "https://www.toto.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "€5 minimum deposit",
    },
    {
      field: "responsibleGambling",
      source: "https://www.toto.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "CRUKS integration, deposit limits, self-exclusion, age verification",
    },
  ],

  rating: null,
  trustScore: null,

  licenses: [
    {
      issuer: "KSA",
      jurisdiction: "NL",
      status: "active",
      verifiedAt: "2026-09-10T00:00:00Z",
    },
  ],
  countries: ["NL"],
  restrictedCountries: [],
  languages: ["nl", "en"],
  currencies: ["EUR"],

  minDeposit: 5,
  maxDeposit: null,
  minWithdrawal: null,

  paymentMethods: [
    { name: "iDEAL", type: "bank-transfer" },
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
    {
      name: "Table Games",
      slug: "table-games",
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
      "TOTO is operated by TOTO Online B.V. under a KSA licence for online casino games, sports betting, and horse racing in the Netherlands. Payment methods include iDEAL, with a €5 minimum deposit. Responsible gambling tools including CRUKS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSA-licensed official Dutch sports betting and casino platform.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSA Licensed", "iDEAL", "Sports Betting", "Horse Racing"],
  tags: ["netherlands", "virtual-slots", "sports-betting", "ksa-verified"],
};
