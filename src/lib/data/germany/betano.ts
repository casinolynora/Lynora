import type { Casino } from "@/lib/types/casino";

export const betano: Casino = {
  id: "germany-betano",
  slug: "betano",
  name: "Betano",
  tagline: "Kaizen Gaming's online casino and sportsbook with GGL licence",
  logo: null,
  description:
    "Betano is operated by Betkick Sportsbetting Limited, part of the Kaizen Gaming group. It holds a GGL licence for virtual slot machines and sports betting in Germany. The platform offers 600-700+ slots and full sports betting.",
  founded: null,
  owner: "Betkick Sportsbetting Limited (Kaizen Gaming)",
  website: "https://www.betano.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Betkick Sportsbetting Limited — Virtuelle Automatenspiele — 31.05.2023; Sportwetten — 19.02.2021",
    },
    {
      field: "paymentMethods",
      source: "https://www.betano.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "On-site verified: Visa, Mastercard, PayPal, Apple Pay, Google Pay, Skrill, Trustly, Sofort/Klarna, Paysafecard, Aircash, Okto Wallet, Betano Cash",
    },
    {
      field: "minDeposit",
      source: "https://www.betano.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "€5 minimum deposit for most methods; €15 for PayPal; general minimum stated as €10 in AGB",
    },
    {
      field: "mobile",
      source: "https://www.betano.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "iOS and Android apps available for sports betting; slots available via mobile web",
    },
    {
      field: "responsibleGambling",
      source: "https://www.betano.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Deposit limits, loss limits, session limits, reality checks, self-exclusion via OASIS, LUGAS monitoring",
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
    { name: "Visa", type: "card" },
    { name: "Mastercard", type: "card" },
    { name: "PayPal", type: "e-wallet" },
    { name: "Apple Pay", type: "mobile" },
    { name: "Google Pay", type: "mobile" },
    { name: "Skrill", type: "e-wallet" },
    { name: "Trustly", type: "bank-transfer" },
    { name: "Sofort", type: "bank-transfer" },
    { name: "Paysafecard", type: "prepaid" },
    { name: "Aircash", type: "e-wallet" },
  ],
  withdrawalMethods: [],
  withdrawalProcessingTime: null,

  bonuses: [],
  games: [
    {
      name: "Virtual Slots",
      slug: "virtual-slots",
      available: true,
      providers: ["Pragmatic Play", "Play'n GO", "Novomatic", "NetEnt", "Gamomat"],
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
      "Betano is operated by Betkick Sportsbetting Limited under a GGL licence for virtual slot machines and sports betting in Germany. The platform offers 600-700+ slots from providers including Pragmatic Play, Play'n GO, Novomatic, and NetEnt. Payment methods include Visa, Mastercard, PayPal, Apple Pay, Skrill, Trustly, Sofort, and Paysafecard. Responsible gambling tools are available.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine and sports betting platform operated by Kaizen Gaming.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "Sports Betting", "Mobile App"],
  tags: ["germany", "virtual-slots", "ggl-verified", "sports-betting"],
};
