import type { Casino } from "@/lib/types/casino";

export const starcasinoBe: Casino = {
  id: "belgium-starcasino-be",
  slug: "starcasino-be",
  name: "StarCasino",
  tagline: "Belgium's biggest game library with 1000+ titles",
  logo: null,
  description:
    "StarCasino is operated by Chaudfontaine Loisirs SA, part of the Ardent Group (Gaming1). It holds a KSC A+ licence and is linked to Casino de Chaudfontaine. The platform offers 1000+ games from 140+ providers, live casino, and welcome boosts up to 1000%.",
  founded: null,
  owner: "Chaudfontaine Loisirs SA (Ardent Group / Gaming1)",
  website: "https://www.starcasino.be",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gamingcommission.be/",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSC Register",
      notes: "Chaudfontaine Loisirs SA — KSC A+ 8112 — active since 2013",
    },
    {
      field: "paymentMethods",
      source: "https://www.starcasino.be",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: Bancontact, Visa, PayPal, Paysafecard",
    },
    {
      field: "responsibleGambling",
      source: "https://www.starcasino.be",
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
      licenseNumber: "A+ 8112",
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
    { name: "PayPal", type: "e-wallet" },
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
      providers: ["NetEnt", "Play'n GO", "Pragmatic Play", "Microgaming", "Red Tiger"],
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
      "StarCasino is operated by Chaudfontaine Loisirs SA under a KSC A+ licence. Linked to Casino de Chaudfontaine, it offers 1000+ games from 140+ providers, live casino, and welcome boosts up to 1000%. Payment methods include Bancontact, Visa, PayPal, and Paysafecard. Responsible gambling tools with EPIS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSC A+ licensed casino with 1000+ games, linked to Casino de Chaudfontaine.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSC Licensed", "Bancontact", "Live Casino", "1000+ Games", "Welcome Boost"],
  tags: ["belgium", "slots", "live-casino", "ksc-verified"],
};
