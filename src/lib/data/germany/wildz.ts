import type { Casino } from "@/lib/types/casino";

export const wildz: Casino = {
  id: "germany-wildz",
  slug: "wildz",
  name: "Wildz",
  tagline: "Rootz-operated online casino",
  logo: null,
  description:
    "Wildz is operated by Rootz Limited and holds a GGL licence for virtual slot machines in Germany. Withdrawals are requested through the website and paid to the registered account holder.",
  founded: null,
  owner: "Rootz Limited",
  website: "https://www.wildz.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ggl.de/de/fuer-anbieter/gewerbliche-erlaubnisregistrierung/?register",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Rootz Limited — Virtuelle Automatenspiele — 15.09.2022",
    },
    {
      field: "withdrawals",
      source: "https://www.wildz.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Withdrawals requested through website, paid to registered account holder",
    },
  ],

  rating: null,
  trustScore: null,

  licenses: [
    {
      issuer: "GGL",
      jurisdiction: "DE",
      status: "active",
      verifiedAt: "2026-09-07T00:00:00Z",
    },
  ],
  countries: ["DE"],
  restrictedCountries: [],
  languages: ["de", "en"],
  currencies: ["EUR"],

  minDeposit: 10,
  maxDeposit: null,
  minWithdrawal: null,

  paymentMethods: [],
  withdrawalMethods: [],
  withdrawalProcessingTime: null,

  bonuses: [],
  games: [
    {
      name: "Virtual Slots",
      slug: "virtual-slots",
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
    selfExclusion: false,
    depositLimits: false,
    sessionLimits: false,
    realityCheck: false,
    coolingOffPeriod: false,
    links: [],
  },

  affiliateOffers: [],
  review: {
    overview:
      "Wildz is operated by Rootz Limited under a GGL licence for virtual slot machines in Germany (granted 15.09.2022). Withdrawals are requested through the website and paid to the registered account holder. On-site payment methods and responsible gambling tools have not yet been verified.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine operator.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed"],
  tags: ["germany", "virtual-slots", "ggl-verified"],
};
