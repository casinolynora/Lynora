import type { Casino } from "@/lib/types/casino";

export const unibetNl: Casino = {
  id: "netherlands-unibet-nl",
  slug: "unibet-nl",
  name: "Unibet",
  tagline: "Kindred Group's online casino and sportsbook for the Netherlands",
  logo: null,
  description:
    "Unibet is operated by Trannel International Limited, part of the Kindred Group. It holds a KSA licence for online casino games, sports betting, and horse racing in the Netherlands. The platform offers over 1,500 slots, live casino, and comprehensive sports betting.",
  founded: null,
  owner: "Trannel International Limited (Kindred Group)",
  website: "https://www.unibet.nl",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ksa.nl/toezicht/register-vergunninghouders",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSA Register",
      notes: "Trannel International Limited — Online kansspelen — active Jun 2027",
    },
    {
      field: "paymentMethods",
      source: "https://www.unibet.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: iDEAL, Visa, Mastercard, Trustly",
    },
    {
      field: "minDeposit",
      source: "https://www.unibet.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "€10 minimum deposit",
    },
    {
      field: "responsibleGambling",
      source: "https://www.unibet.nl",
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
    { name: "Visa", type: "card" },
    { name: "Mastercard", type: "card" },
    { name: "Trustly", type: "bank-transfer" },
  ],
  withdrawalMethods: [],
  withdrawalProcessingTime: null,

  bonuses: [
    {
      type: "welcome",
      title: "125 Cash Free Spins",
      description: "125 cash free spins worth €50 on first deposit",
      amount: "€50 value",
      minDeposit: 10,
    },
  ],
  games: [
    {
      name: "Virtual Slots",
      slug: "virtual-slots",
      available: true,
      count: 1500,
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
      "Unibet is operated by Trannel International Limited (Kindred Group) under a KSA licence for online casino games, sports betting, and horse racing in the Netherlands. The platform offers over 1,500 slots, live casino, and comprehensive sports betting. Payment methods include iDEAL, Visa, Mastercard, and Trustly, with a €10 minimum deposit. Welcome bonus offers 125 cash free spins (€50 value).",
    pros: [],
    cons: [],
    verdict: "KSA-licensed online casino and sportsbook operator from the Kindred Group.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSA Licensed", "iDEAL", "Live Casino", "Sports Betting", "Horse Racing", "1500+ Slots"],
  tags: ["netherlands", "virtual-slots", "live-casino", "sports-betting", "ksa-verified"],
};
