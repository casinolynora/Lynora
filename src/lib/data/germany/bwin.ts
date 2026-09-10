import type { Casino } from "@/lib/types/casino";

export const bwin: Casino = {
  id: "germany-bwin",
  slug: "bwin",
  name: "bwin",
  tagline: "Entain's online casino and sportsbook with GGL licence",
  logo: null,
  description:
    "bwin is operated by bwin (Deutschland) Limited, part of the Entain plc group. It holds a GGL licence for virtual slot machines, sports betting, and online poker in Germany. The platform offers over 1,000 slots from 20+ providers, full sports betting, and online poker.",
  founded: null,
  owner: "bwin (Deutschland) Limited (Entain plc)",
  website: "https://www.bwin.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "bwin (Deutschland) Limited — Virtuelle Automatenspiele — 10.11.2022; Sportwetten — 23.12.2022; Online-Poker",
    },
    {
      field: "paymentMethods",
      source: "https://www.bwin.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "On-site verified: Visa, Mastercard, Maestro, PayPal, Skrill, Neteller, MuchBetter, ecoPayz, Sofort, Giropay, Trustly, DIRECTpay24, Paysafecard, Cash to Code, Bank Transfer",
    },
    {
      field: "minDeposit",
      source: "https://www.bwin.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "€10 minimum deposit across most payment methods",
    },
    {
      field: "mobile",
      source: "https://www.bwin.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "iOS and Android apps available, plus responsive mobile web",
    },
    {
      field: "responsibleGambling",
      source: "https://www.bwin.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Deposit limits, loss limits, time-out, self-exclusion via OASIS, LUGAS monitoring, age verification",
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

  paymentMethods: [
    { name: "Visa", type: "card" },
    { name: "Mastercard", type: "card" },
    { name: "PayPal", type: "e-wallet" },
    { name: "Skrill", type: "e-wallet" },
    { name: "Neteller", type: "e-wallet" },
    { name: "MuchBetter", type: "e-wallet" },
    { name: "Sofort", type: "bank-transfer" },
    { name: "Giropay", type: "bank-transfer" },
    { name: "Trustly", type: "bank-transfer" },
    { name: "Paysafecard", type: "prepaid" },
    { name: "Bank Transfer", type: "bank-transfer" },
  ],
  withdrawalMethods: [],
  withdrawalProcessingTime: null,

  bonuses: [],
  games: [
    {
      name: "Virtual Slots",
      slug: "virtual-slots",
      available: true,
      providers: ["Merkur", "Novomatic", "Greentube", "Play'n GO", "Pragmatic Play"],
    },
  ],
  hasLiveCasino: false,
  hasSportsBetting: true,
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
      "bwin is operated by bwin (Deutschland) Limited under a GGL licence for virtual slot machines, sports betting, and online poker in Germany. The platform offers over 1,000 slots from 20+ providers. Payment methods include Visa, Mastercard, PayPal, Skrill, Neteller, Sofort, Trustly, and Paysafecard, with a €10 minimum deposit. Responsible gambling tools are available.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine, sports betting, and poker platform operated by Entain.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "Sports Betting", "Poker", "Mobile App"],
  tags: ["germany", "virtual-slots", "ggl-verified", "sports-betting"],
};
