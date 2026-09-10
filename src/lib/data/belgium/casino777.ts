import type { Casino } from "@/lib/types/casino";

export const casino777: Casino = {
  id: "belgium-casino777",
  slug: "casino777",
  name: "Casino777",
  tagline: "Belgium's original online casino powered by Gaming1",
  logo: null,
  description:
    "Casino777 is operated by SA/NV Casino de Spa, part of the Ardent Group (Gaming1). It holds a KSC A+ licence and is linked to the historic Casino de Spa land-based venue. The platform offers 200+ games powered by iSoftBet and other providers, with live casino and a dedicated mobile app.",
  founded: null,
  owner: "SA/NV Casino de Spa (Ardent Group / Gaming1)",
  website: "https://www.casino777.be",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gamingcommission.be/",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSC Register",
      notes: "SA/NV Casino de Spa — KSC A+ 8104 — active since 2017",
    },
    {
      field: "paymentMethods",
      source: "https://www.casino777.be",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: Bancontact, Visa, Mastercard, Paysafecard",
    },
    {
      field: "responsibleGambling",
      source: "https://www.casino777.be",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "EPIS integration, deposit limits (€200/week default), self-exclusion, age verification (21+)",
    },
  ],

  rating: null,
  trustScore: null,

  licenses: [
    {
      issuer: "KSC",
      jurisdiction: "BE",
      licenseNumber: "A+ 8104",
      status: "active",
      verifiedAt: "2026-09-10T00:00:00Z",
    },
  ],
  countries: ["BE"],
  restrictedCountries: [],
  languages: ["nl", "fr", "en"],
  currencies: ["EUR"],

  minDeposit: 10,
  maxDeposit: null,
  minWithdrawal: null,

  paymentMethods: [
    { name: "Bancontact", type: "bank-transfer" },
    { name: "Visa", type: "card" },
    { name: "Mastercard", type: "card" },
    { name: "Paysafecard", type: "prepaid" },
  ],
  withdrawalMethods: [],
  withdrawalProcessingTime: null,

  bonuses: [],
  games: [
    {
      name: "Slots",
      slug: "slots",
      available: true,
      providers: ["iSoftBet", "Pragmatic Play", "Play'n GO", "Red Tiger"],
    },
    {
      name: "Live Casino",
      slug: "live-casino",
      available: true,
      providers: ["Evolution Gaming"],
    },
  ],
  hasLiveCasino: true,
  hasSportsBetting: false,
  hasCrypto: false,
  hasMobile: true,

  kycRequired: true,
  kycDocuments: [],
  kycProcessingTime: null,

  minAge: 21,

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
      "Casino777 is operated by SA/NV Casino de Spa under a KSC A+ licence. Linked to the historic Casino de Spa land-based venue, it offers 200+ games powered by iSoftBet, live casino, and a dedicated mobile app. Payment methods include Bancontact, Visa, Mastercard, and Paysafecard. Responsible gambling tools with EPIS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSC A+ licensed online casino linked to Casino de Spa, operated by Ardent Group / Gaming1.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSC Licensed", "Bancontact", "Live Casino", "Mobile App", "iSoftBet Games"],
  tags: ["belgium", "slots", "live-casino", "ksc-verified"],
};
