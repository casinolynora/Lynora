import type { Casino } from "@/lib/types/casino";

export const circusNl: Casino = {
  id: "netherlands-circus-nl",
  slug: "circus-nl",
  name: "Circus Casino",
  tagline: "Circus Casino's online platform for the Netherlands",
  logo: null,
  description:
    "Circus Casino is operated by Betca B.V. It holds a KSA licence for online casino games, sports betting, and horse racing in the Netherlands. The platform offers a wide range of casino games and sports betting options.",
  founded: null,
  owner: "Betca B.V.",
  website: "https://www.circus.nl",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ksa.nl/toezicht/register-vergunninghouders",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSA Register",
      notes: "Betca B.V. — Online kansspelen — active Mar 2027",
    },
    {
      field: "paymentMethods",
      source: "https://www.circus.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: iDEAL, PayPal, Visa, Mastercard, Maestro",
    },
    {
      field: "minDeposit",
      source: "https://www.circus.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "€10 minimum deposit",
    },
    {
      field: "responsibleGambling",
      source: "https://www.circus.nl",
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
    { name: "PayPal", type: "e-wallet" },
    { name: "Visa", type: "card" },
    { name: "Mastercard", type: "card" },
    { name: "Maestro", type: "card" },
  ],
  withdrawalMethods: [],
  withdrawalProcessingTime: null,

  bonuses: [
    {
      type: "welcome",
      title: "100% tot €250 in free bets",
      description: "100% welcome bonus up to €250 in free bets",
      amount: "€250",
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
      "Circus Casino is operated by Betca B.V. under a KSA licence for online casino games, sports betting, and horse racing in the Netherlands. Payment methods include iDEAL, PayPal, Visa, Mastercard, and Maestro, with a €10 minimum deposit. Welcome bonus offers 100% up to €250 in free bets.",
    pros: [],
    cons: [],
    verdict: "KSA-licensed online casino and sportsbook operator in the Netherlands.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSA Licensed", "iDEAL", "Live Casino", "Sports Betting", "Horse Racing", "PayPal"],
  tags: ["netherlands", "virtual-slots", "live-casino", "sports-betting", "ksa-verified"],
};
