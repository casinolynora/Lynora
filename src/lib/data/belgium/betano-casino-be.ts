import type { Casino } from "@/lib/types/casino";

export const betanoCasinoBe: Casino = {
  id: "belgium-betano-casino-be",
  slug: "betano-casino-be",
  name: "Betano Casino",
  tagline: "Kaizen Gaming's Belgian casino linked to VIAGE Brussels",
  logo: null,
  description:
    "Betano Casino is operated by SA/NV Casinos Austria International Belgium, part of Kaizen Gaming. It holds a KSC A+ licence and is linked to VIAGE (Brussels). The platform offers live casino, slots, and standard Belgian payment methods.",
  founded: null,
  owner: "SA/NV Casinos Austria International Belgium (Kaizen Gaming)",
  website: "https://www.betanocasino.be",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gamingcommission.be/",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSC Register",
      notes: "SA/NV Casinos Austria International Belgium — KSC A+ 20000 — active since Nov 2024",
    },
    {
      field: "paymentMethods",
      source: "https://www.betanocasino.be",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: Bancontact, Visa, Mastercard, PayPal, Paysafecard",
    },
    {
      field: "responsibleGambling",
      source: "https://www.betanocasino.be",
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
      licenseNumber: "A+ 20000",
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
      "Betano Casino is operated by SA/NV Casinos Austria International Belgium under a KSC A+ licence. Part of Kaizen Gaming, it is linked to VIAGE (Brussels). The platform offers live casino, slots, and standard Belgian payment methods including Bancontact, Visa, Mastercard, PayPal, and Paysafecard. Responsible gambling tools with EPIS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSC A+ licensed Kaizen Gaming casino linked to VIAGE Brussels.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSC Licensed", "Bancontact", "Live Casino", "Mobile App"],
  tags: ["belgium", "slots", "live-casino", "ksc-verified"],
};
