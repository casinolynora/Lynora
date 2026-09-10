import type { Casino } from "@/lib/types/casino";

export const kansino: Casino = {
  id: "netherlands-kansino",
  slug: "kansino",
  name: "Kansino",
  tagline: "Play North's online casino for the Netherlands",
  logo: null,
  description:
    "Kansino is operated by Play North Limited. It holds a KSA licence for online casino games in the Netherlands. The platform offers a wide range of virtual slots and table games.",
  founded: null,
  owner: "Play North Limited",
  website: "https://www.kansino.nl",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ksa.nl/toezicht/register-vergunninghouders",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSA Register",
      notes: "Play North Limited — Online kansspelen — renewed Aug 2026, valid through 2031",
    },
    {
      field: "paymentMethods",
      source: "https://www.kansino.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: iDEAL",
    },
    {
      field: "minDeposit",
      source: "https://www.kansino.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "€5 minimum deposit",
    },
    {
      field: "responsibleGambling",
      source: "https://www.kansino.nl",
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
    sessionLimits: true,
    realityCheck: true,
    coolingOffPeriod: true,
    links: [],
  },

  affiliateOffers: [],
  review: {
    overview:
      "Kansino is operated by Play North Limited under a KSA licence for online casino games in the Netherlands. Payment methods include iDEAL, with a €5 minimum deposit. Responsible gambling tools including CRUKS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSA-licensed online casino operator in the Netherlands.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSA Licensed", "iDEAL"],
  tags: ["netherlands", "virtual-slots", "ksa-verified"],
};
