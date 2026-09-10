import type { Casino } from "@/lib/types/casino";

export const napoleonCasinoBe: Casino = {
  id: "belgium-napoleon-casino-be",
  slug: "napoleon-casino-be",
  name: "Napoleon Casino",
  tagline: "10,000+ games and an own live studio in Erembodegem",
  logo: null,
  description:
    "Napoleon Casino is operated by SA/NV E.C.K. (Europa, Knokke en Casino), part of the Superbet Group (backed by Blackstone). It holds a KSC A+ licence and is linked to Casino Knokke. The platform offers 10,000+ games, live casino with its own studio in Erembodegem, and a wide range of payment options.",
  founded: null,
  owner: "SA/NV E.C.K. (Superbet Group / Blackstone)",
  website: "https://www.napoleoncasino.be",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gamingcommission.be/",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSC Register",
      notes: "SA/NV E.C.K. — KSC A+ 8110",
    },
    {
      field: "paymentMethods",
      source: "https://www.napoleoncasino.be",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: Bank transfer, credit cards, e-wallets",
    },
    {
      field: "responsibleGambling",
      source: "https://www.napoleoncasino.be",
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
      licenseNumber: "A+ 8110",
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
      providers: ["NetEnt", "Play'n GO", "Pragmatic Play", "Microgaming", "Red Tiger", "iSoftBet"],
    },
    {
      name: "Live Casino",
      slug: "live-casino",
      available: true,
      providers: ["Evolution Gaming", "Napoleon Live Studio"],
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
      "Napoleon Casino is operated by SA/NV E.C.K. under a KSC A+ licence. Part of the Superbet Group (backed by Blackstone), it is linked to Casino Knokke. The platform offers 10,000+ games, live casino with its own studio in Erembodegem, and a wide range of payment options. Responsible gambling tools with EPIS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSC A+ licensed casino with 10,000+ games and own live studio, linked to Casino Knokke.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSC Licensed", "Bancontact", "Live Casino", "10000+ Games", "Own Live Studio", "Mobile App"],
  tags: ["belgium", "slots", "live-casino", "ksc-verified"],
};
