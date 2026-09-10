import type { Casino } from "@/lib/types/casino";

export const starCasinoNl: Casino = {
  id: "netherlands-starcasino-nl",
  slug: "starcasino-nl",
  name: "StarCasino",
  tagline: "StarCasino's online platform for the Netherlands",
  logo: null,
  description:
    "StarCasino is operated by Green Island N.V. It holds a KSA licence for online casino games and sports betting in the Netherlands. Note: 24+ age requirement for promotions.",
  founded: null,
  owner: "Green Island N.V.",
  website: "https://www.starcasino.nl",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ksa.nl/toezicht/register-vergunninghouders",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSA Register",
      notes: "Green Island N.V. — Online kansspelen — active Oct 2029",
    },
    {
      field: "paymentMethods",
      source: "https://www.starcasino.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: iDEAL, Wero",
    },
    {
      field: "minDeposit",
      source: "https://www.starcasino.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "€10 minimum deposit",
    },
    {
      field: "responsibleGambling",
      source: "https://www.starcasino.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "CRUKS integration, deposit limits, self-exclusion, age verification. 24+ for promotions.",
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
    { name: "Wero", type: "e-wallet" },
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
    {
      name: "Live Casino",
      slug: "live-casino",
      available: true,
    },
  ],
  hasLiveCasino: true,
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
      "StarCasino is operated by Green Island N.V. under a KSA licence for online casino games and sports betting in the Netherlands. Payment methods include iDEAL and Wero, with a €10 minimum deposit. Note: 24+ age requirement for promotions. Responsible gambling tools including CRUKS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSA-licensed online casino and sportsbook operator in the Netherlands (24+ for promotions).",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSA Licensed", "iDEAL", "Wero", "Live Casino", "Sports Betting", "24+ Promotions"],
  tags: ["netherlands", "virtual-slots", "live-casino", "sports-betting", "ksa-verified"],
};
