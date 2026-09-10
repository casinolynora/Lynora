import type { Casino } from "@/lib/types/casino";

export const unibetCasinoBe: Casino = {
  id: "belgium-unibet-casino-be",
  slug: "unibet-casino-be",
  name: "Unibet Casino",
  tagline: "Kindred Group's Belgian casino with live dealer tables",
  logo: null,
  description:
    "Unibet Casino is operated by SA/NV Blankenberge Casino-Kursaal (Blancas NV), part of the Kindred Group (acquired by FDJ in October 2024). It holds a KSC A+ licence and is linked to Casino Blankenberge. The platform offers live casino, slots, and a full range of casino games.",
  founded: null,
  owner: "SA/NV Blankenberge Casino-Kursaal (Kindred Group / FDJ)",
  website: "https://www.unibetcasino.be",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gamingcommission.be/",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSC Register",
      notes: "SA/NV Blankenberge Casino-Kursaal (Blancas NV) — KSC A+ 505296 — active since 2021",
    },
    {
      field: "paymentMethods",
      source: "https://www.unibetcasino.be",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: Bancontact, bank transfer, e-wallets",
    },
    {
      field: "responsibleGambling",
      source: "https://www.unibetcasino.be",
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
      licenseNumber: "A+ 505296",
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
    { name: "Bank Transfer", type: "bank-transfer" },
    { name: "Visa", type: "card" },
    { name: "Mastercard", type: "card" },
    { name: "PayPal", type: "e-wallet" },
    { name: "Skrill", type: "e-wallet" },
    { name: "Neteller", type: "e-wallet" },
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
      "Unibet Casino is operated by SA/NV Blankenberge Casino-Kursaal under a KSC A+ licence. Part of the Kindred Group (acquired by FDJ in October 2024), it is linked to Casino Blankenberge. The platform offers live casino, slots, and a full range of casino games. Payment methods include Bancontact, bank transfer, and e-wallets. Responsible gambling tools with EPIS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSC A+ licensed Kindred Group casino linked to Casino Blankenberge.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSC Licensed", "Bancontact", "Live Casino", "Mobile App"],
  tags: ["belgium", "slots", "live-casino", "ksc-verified"],
};
