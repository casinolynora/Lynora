import type { Casino } from "@/lib/types/casino";

export const betfirstCasinoBe: Casino = {
  id: "belgium-betfirst-casino-be",
  slug: "betfirst-casino-be",
  name: "BetFirst Casino",
  tagline: "Betsson Group's Belgian casino linked to Casino Middelkerke",
  logo: null,
  description:
    "BetFirst Casino is operated by Exploitatie Casino Middelkerke, part of the Betsson Group (acquired June 2023). It holds a KSC A+ licence and is linked to Casino Middelkerke (Groupe Partouche). The platform offers live casino, slots, and standard Belgian payment methods.",
  founded: null,
  owner: "Exploitatie Casino Middelkerke (Betsson Group)",
  website: "https://www.betfirstcasino.be",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gamingcommission.be/",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSC Register",
      notes: "Exploitatie Casino Middelkerke — KSC A+ 595153 — active since Feb 2024",
    },
    {
      field: "paymentMethods",
      source: "https://www.betfirstcasino.be",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: Bancontact, Visa, Mastercard, Paysafecard",
    },
    {
      field: "responsibleGambling",
      source: "https://www.betfirstcasino.be",
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
      licenseNumber: "A+ 595153",
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
      providers: ["NetEnt", "Play'n GO", "Pragmatic Play", "Microgaming"],
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
      "BetFirst Casino is operated by Exploitatie Casino Middelkerke under a KSC A+ licence. Part of the Betsson Group (acquired June 2023), it is linked to Casino Middelkerke (Groupe Partouche). The platform offers live casino, slots, and standard Belgian payment methods including Bancontact, Visa, Mastercard, and Paysafecard. Responsible gambling tools with EPIS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSC A+ licensed Betsson Group casino linked to Casino Middelkerke.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSC Licensed", "Bancontact", "Live Casino", "Mobile App"],
  tags: ["belgium", "slots", "live-casino", "ksc-verified"],
};
