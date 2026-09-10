import type { Casino } from "@/lib/types/casino";

export const bet365Nl: Casino = {
  id: "netherlands-bet365-nl",
  slug: "bet365-nl",
  name: "bet365",
  tagline: "bet365's online casino and sportsbook for the Netherlands",
  logo: null,
  description:
    "bet365 is operated by Hillside (New Media Malta) PLC. It holds a KSA licence for online casino games, sports betting, and horse racing in the Netherlands. The platform offers a comprehensive range of casino games and sports betting options.",
  founded: null,
  owner: "Hillside (New Media Malta) PLC",
  website: "https://www.bet365.nl",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ksa.nl/toezicht/register-vergunninghouders",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSA Register",
      notes: "Hillside (New Media Malta) PLC — Online kansspelen — pending renewal (KSA binding order Nov 2025)",
    },
    {
      field: "paymentMethods",
      source: "https://www.bet365.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: iDEAL, Creditcard",
    },
    {
      field: "minDeposit",
      source: "https://www.bet365.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "€5 minimum deposit",
    },
    {
      field: "responsibleGambling",
      source: "https://www.bet365.nl",
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
    { name: "Creditcard", type: "card" },
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
      "bet365 is operated by Hillside (New Media Malta) PLC under a KSA licence for online casino games, sports betting, and horse racing in the Netherlands. Payment methods include iDEAL and Creditcard, with a €5 minimum deposit. Responsible gambling tools including CRUKS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSA-licensed online casino and sportsbook operator in the Netherlands.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSA Licensed", "iDEAL", "Sports Betting", "Horse Racing"],
  tags: ["netherlands", "virtual-slots", "sports-betting", "ksa-verified"],
};
