import type { Casino } from "@/lib/types/casino";

export const novoline: Casino = {
  id: "germany-novoline",
  slug: "novoline",
  name: "NOVOLINE",
  tagline: "NOVOMATIC's direct online casino with GGL licence",
  logo: null,
  description:
    "NOVOLINE is operated by NOVOLINE.DE GmbH, a subsidiary of LOEWEN ENTERTAINMENT within the NOVOMATIC Group. It holds a GGL licence for virtual slot machines in Germany. The platform offers 950-1,050+ slots from 16 providers including Novomatic/Greentube, Merkur, and Play'n GO.",
  founded: null,
  owner: "NOVOLINE.DE GmbH (NOVOMATIC Group)",
  website: "https://www.novoline.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "NOVOLINE.DE GmbH (vormals BluBet Operations Limited) — Virtuelle Automatenspiele — 09.08.2022; Online-Casinospiele (SH) — 18.09.2024",
    },
    {
      field: "paymentMethods",
      source: "https://www.novoline.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "On-site verified: PayPal, Visa, Mastercard, Sofort/Klarna, PaysafeCard, Apple Pay, NOVO PAY",
    },
    {
      field: "minDeposit",
      source: "https://www.novoline.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "€1 minimum for welcome bonus; per-method minimums range from €5-€10",
    },
    {
      field: "mobile",
      source: "https://www.novoline.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Responsive mobile web app; no native gaming app required",
    },
    {
      field: "responsibleGambling",
      source: "https://www.novoline.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "OASIS integration, LUGAS monitoring, individual deposit limits, loss limits, time limits, 12-month minimum gaming block, age verification",
    },
    {
      field: "games",
      source: "https://www.novoline.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "950-1,050+ slots from 16 providers including Greentube, Gamomat, Merkur, Play'n GO, Pragmatic Play",
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

  minDeposit: 5,
  maxDeposit: null,
  minWithdrawal: null,

  paymentMethods: [
    { name: "PayPal", type: "e-wallet" },
    { name: "Visa", type: "card" },
    { name: "Mastercard", type: "card" },
    { name: "Sofort", type: "bank-transfer" },
    { name: "Paysafecard", type: "prepaid" },
    { name: "Apple Pay", type: "mobile" },
  ],
  withdrawalMethods: [],
  withdrawalProcessingTime: null,

  bonuses: [],
  games: [
    {
      name: "Virtual Slots",
      slug: "virtual-slots",
      available: true,
      count: 1050,
      providers: ["Greentube", "Gamomat", "Merkur", "Play'n GO", "Pragmatic Play", "Holle Games", "Yggdrasil", "Hacksaw Gaming"],
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
      "NOVOLINE is operated by NOVOLINE.DE GmbH under a GGL licence for virtual slot machines in Germany (granted 09.08.2022). The platform offers 950-1,050+ slots from 16 providers including Greentube, Gamomat, Merkur, Play'n GO, and Pragmatic Play. Payment methods include PayPal, Visa, Mastercard, Sofort, Paysafecard, and Apple Pay. Responsible gambling tools including OASIS integration, LUGAS monitoring, and deposit limits are available.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine platform operated by NOVOMATIC Group.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "NOVOMATIC Slots", "1050+ Games", "Mobile Web"],
  tags: ["germany", "virtual-slots", "ggl-verified", "novomatic"],
};
