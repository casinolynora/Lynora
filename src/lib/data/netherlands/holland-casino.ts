import type { Casino } from "@/lib/types/casino";

export const hollandCasino: Casino = {
  id: "netherlands-holland-casino",
  slug: "holland-casino",
  name: "Holland Casino Online",
  tagline: "The Netherlands' state-owned casino operator, now online",
  logo: null,
  description:
    "Holland Casino Online is operated by Holland Casino N.V., a state-owned enterprise. It holds a KSA licence for online casino games including virtual slots, table games, and live casino. The platform offers a wide range of casino games and live dealer experiences.",
  founded: null,
  owner: "Holland Casino N.V.",
  website: "https://www.hollandcasino.nl",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ksa.nl/toezicht/register-vergunninghouders",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSA Register",
      notes: "Holland Casino N.V. — Online kansspelen — renewed Oct 2026, valid through 2031",
    },
    {
      field: "paymentMethods",
      source: "https://www.hollandcasino.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: iDEAL, Creditcard",
    },
    {
      field: "minDeposit",
      source: "https://www.hollandcasino.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "€5 minimum deposit",
    },
    {
      field: "mobile",
      source: "https://www.hollandcasino.nl",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "iOS and Android apps available, plus responsive mobile web",
    },
    {
      field: "responsibleGambling",
      source: "https://www.hollandcasino.nl",
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
      "Holland Casino Online is operated by Holland Casino N.V., a state-owned enterprise, under a KSA licence for online casino games in the Netherlands. The platform offers virtual slots, table games, and live casino. Payment methods include iDEAL and Creditcard, with a €5 minimum deposit. Responsible gambling tools including CRUKS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSA-licensed state-owned online casino operator in the Netherlands.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSA Licensed", "iDEAL", "Live Casino", "Mobile App", "State-Owned"],
  tags: ["netherlands", "virtual-slots", "live-casino", "ksa-verified"],
};
