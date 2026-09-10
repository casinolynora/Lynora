import type { Casino } from "@/lib/types/casino";

export const circusCasinoBe: Casino = {
  id: "belgium-circus-casino-be",
  slug: "circus-casino-be",
  name: "Circus Casino",
  tagline: "1000+ games and a 1000% welcome boost at Circus Casino Resort",
  logo: null,
  description:
    "Circus Casino is operated by Gambling Management SA, part of the Ardent Group (Gaming1). It holds a KSC A+ licence and is linked to Circus Casino Resort Namur. The platform offers 1000+ games, live casino, and a 1000% welcome boost on 3 flagship games.",
  founded: null,
  owner: "Gambling Management SA (Ardent Group / Gaming1)",
  website: "https://www.circus-casino.be",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gamingcommission.be/",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSC Register",
      notes: "Gambling Management SA — KSC A+ 20635 — active since 2019",
    },
    {
      field: "paymentMethods",
      source: "https://www.circus-casino.be",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: Bancontact, Visa, Mastercard, PayPal, Paysafecard",
    },
    {
      field: "responsibleGambling",
      source: "https://www.circus-casino.be",
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
      licenseNumber: "A+ 20635",
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
      providers: ["Pragmatic Play", "Play'n GO", "NetEnt", "Red Tiger"],
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
      "Circus Casino is operated by Gambling Management SA under a KSC A+ licence. Linked to Circus Casino Resort Namur, it offers 1000+ games, live casino, and a 1000% welcome boost on 3 flagship games. Payment methods include Bancontact, Visa, Mastercard, PayPal, and Paysafecard. Responsible gambling tools with EPIS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSC A+ licensed casino linked to Circus Casino Resort Namur, operated by Ardent Group / Gaming1.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSC Licensed", "Bancontact", "Live Casino", "1000+ Games", "Welcome Boost"],
  tags: ["belgium", "slots", "live-casino", "ksc-verified"],
};
