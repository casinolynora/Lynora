import type { Casino } from "@/lib/types/casino";

export const betMgmNl: Casino = {
  id: "netherlands-betmgm-nl",
  slug: "betmgm-nl",
  name: "BetMGM",
  tagline: "MGM Resorts' online casino and sportsbook for the Netherlands",
  logo: null,
  description:
    "BetMGM is operated by 21 Heads Up Limited, part of MGM Resorts. It holds a KSA licence for online casino games and sports betting in the Netherlands. The platform offers a wide range of casino games and sports betting options.",
  founded: null,
  owner: "21 Heads Up Limited (MGM Resorts)",
  website: "https://www.betmgm.nl",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ksa.nl/toezicht/register-vergunninghouders",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSA Register",
      notes: "21 Heads Up Limited — Online kansspelen — active Jul 2028",
    },
    {
      field: "paymentMethods",
      source: "https://www.betmgm.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: iDEAL, Wero",
    },
    {
      field: "minDeposit",
      source: "https://www.betmgm.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "€10 minimum deposit",
    },
    {
      field: "responsibleGambling",
      source: "https://www.betmgm.nl",
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
    { name: "Wero", type: "e-wallet" },
  ],
  withdrawalMethods: [],
  withdrawalProcessingTime: null,

  bonuses: [
    {
      type: "welcome",
      title: "€50 Bonus",
      description: "€50 welcome bonus on first deposit",
      amount: "€50",
      minDeposit: 10,
    },
  ],
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
      "BetMGM is operated by 21 Heads Up Limited (MGM Resorts) under a KSA licence for online casino games and sports betting in the Netherlands. Payment methods include iDEAL and Wero, with a €10 minimum deposit. Welcome bonus offers €50 bonus.",
    pros: [],
    cons: [],
    verdict: "KSA-licensed online casino and sportsbook operator from MGM Resorts.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSA Licensed", "iDEAL", "Wero", "Live Casino", "Sports Betting"],
  tags: ["netherlands", "virtual-slots", "live-casino", "sports-betting", "ksa-verified"],
};
