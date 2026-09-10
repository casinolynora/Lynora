import type { Casino } from "@/lib/types/casino";

export const hardRockCasinoNl: Casino = {
  id: "netherlands-hardrockcasino-nl",
  slug: "hardrockcasino-nl",
  name: "Hard Rock Casino",
  tagline: "Hard Rock's online casino for the Netherlands",
  logo: null,
  description:
    "Hard Rock Casino is operated by iCasino B.V. It holds a KSA licence for online casino games in the Netherlands. The platform offers over 10,000 games via Bragg Gaming integration.",
  founded: null,
  owner: "iCasino B.V.",
  website: "https://www.hardrockcasino.nl",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ksa.nl/toezicht/register-vergunninghouders",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSA Register",
      notes: "iCasino B.V. — Online kansspelen — active May 2029",
    },
    {
      field: "paymentMethods",
      source: "https://www.hardrockcasino.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: iDEAL",
    },
    {
      field: "minDeposit",
      source: "https://www.hardrockcasino.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "€10 minimum deposit",
    },
    {
      field: "responsibleGambling",
      source: "https://www.hardrockcasino.nl",
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

  minDeposit: 10,
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
      count: 10000,
    },
    {
      name: "Table Games",
      slug: "table-games",
      available: true,
    },
    {
      name: "Live Casino",
      slug: "live-casino",
      available: true,
    },
  ],
  hasLiveCasino: true,
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
      "Hard Rock Casino is operated by iCasino B.V. under a KSA licence for online casino games in the Netherlands. The platform offers over 10,000 games via Bragg Gaming integration. Payment methods include iDEAL, with a €10 minimum deposit. Responsible gambling tools including CRUKS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSA-licensed online casino operator with 10,000+ games in the Netherlands.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSA Licensed", "iDEAL", "Live Casino", "10000+ Games"],
  tags: ["netherlands", "virtual-slots", "live-casino", "ksa-verified"],
};
