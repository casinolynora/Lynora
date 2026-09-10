import type { Casino } from "@/lib/types/casino";

export const vbetNl: Casino = {
  id: "netherlands-vbet-nl",
  slug: "vbet-nl",
  name: "VBET",
  tagline: "VBET's online casino and sportsbook for the Netherlands",
  logo: null,
  description:
    "VBET is operated by SCGO Limited. It holds a KSA licence for online casino games and sports betting in the Netherlands. The platform offers a wide range of casino games and sports betting options.",
  founded: null,
  owner: "SCGO Limited",
  website: "https://www.vbet.nl",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ksa.nl/toezicht/register-vergunninghouders",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSA Register",
      notes: "SCGO Limited — Online kansspelen — active Jun 2028 (KSA warning Jul 2026)",
    },
    {
      field: "paymentMethods",
      source: "https://www.vbet.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: iDEAL",
    },
    {
      field: "minDeposit",
      source: "https://www.vbet.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "€10 minimum deposit",
    },
    {
      field: "responsibleGambling",
      source: "https://www.vbet.nl",
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
      "VBET is operated by SCGO Limited under a KSA licence for online casino games and sports betting in the Netherlands. Payment methods include iDEAL, with a €10 minimum deposit. Note: KSA issued a warning in Jul 2026. Responsible gambling tools including CRUKS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSA-licensed online casino and sportsbook operator in the Netherlands (KSA warning Jul 2026).",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSA Licensed", "iDEAL", "Live Casino", "Sports Betting"],
  tags: ["netherlands", "virtual-slots", "live-casino", "sports-betting", "ksa-verified"],
};
