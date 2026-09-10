import type { Casino } from "@/lib/types/casino";

export const merkurSpiel: Casino = {
  id: "germany-merkur-spiel",
  slug: "merkur-spiel",
  name: "Merkur Spiel",
  tagline: "Gauselmann Group's online casino with GGL licence",
  logo: null,
  description:
    "Merkur Spiel is operated by Merkur Bets Malta Limited, part of the Gauselmann Group. It holds a GGL licence for virtual slot machines, sports betting, and online casino games in Germany. The platform offers slots from 17 providers including Merkur Gaming, NetEnt, Novomatic, Play'n GO, and Pragmatic Play.",
  founded: null,
  owner: "Merkur Bets Malta Limited (Gauselmann Group)",
  website: "https://www.merkur-spiel.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Merkur Bets Malta Limited — Virtuelle Automatenspiele — 28.07.2022; Sportwetten; Online-Casinospiele (SH)",
    },
    {
      field: "paymentMethods",
      source: "https://www.merkur-spiel.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "On-site verified: Visa, Mastercard, PayPal, Skrill, Neteller, Klarna/SOFORT, Bank Transfer, Paysafecard, Apple Pay, Trustly",
    },
    {
      field: "minDeposit",
      source: "https://www.merkur-spiel.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "€10 minimum deposit",
    },
    {
      field: "mobile",
      source: "https://www.merkur-spiel.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "iOS and Android apps available (MERKUR BETS app)",
    },
    {
      field: "responsibleGambling",
      source: "https://www.merkur-spiel.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Deposit limits, self-exclusion, OASIS integration, LUGAS monitoring, 5-second spin delay, 60-minute session break, age verification",
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
    { name: "Klarna", type: "bank-transfer" },
    { name: "Bank Transfer", type: "bank-transfer" },
    { name: "Paysafecard", type: "prepaid" },
    { name: "Apple Pay", type: "mobile" },
    { name: "Trustly", type: "bank-transfer" },
  ],
  withdrawalMethods: [],
  withdrawalProcessingTime: null,

  bonuses: [],
  games: [
    {
      name: "Virtual Slots",
      slug: "virtual-slots",
      available: true,
      providers: ["Merkur Gaming", "NetEnt", "Novomatic", "Play'n GO", "Pragmatic Play", "Red Tiger", "Nolimit City", "Hacksaw Gaming", "Gamomat"],
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
      "Merkur Spiel is operated by Merkur Bets Malta Limited under a GGL licence for virtual slot machines in Germany (granted 28.07.2022). The platform offers slots from 17 providers including Merkur Gaming, NetEnt, Novomatic, Play'n GO, and Pragmatic Play. Payment methods include Visa, Mastercard, PayPal, Skrill, Neteller, Klarna, and Paysafecard, with a €10 minimum deposit. Responsible gambling tools including OASIS integration and LUGAS monitoring are available.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine and sports betting platform operated by Gauselmann Group.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "Merkur Slots", "Sports Betting", "Mobile App"],
  tags: ["germany", "virtual-slots", "ggl-verified", "gauselmann"],
};
