import type { Casino } from "@/lib/types/casino";

export const starGames: Casino = {
  id: "germany-stargames",
  slug: "stargames",
  name: "StarGames",
  tagline: "Greentube's online casino with Novomatic slots",
  logo: null,
  description:
    "StarGames is operated by Greentube Malta Limited and holds a GGL licence for virtual slot machines in Germany. The platform offers Novomatic/Greentube titles and supports multiple payment methods.",
  founded: null,
  owner: "Greentube Malta Limited",
  website: "https://www.stargames.de",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-07T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.ggl.de/de/fuer-anbieter/gewerbliche-erlaubnisregistrierung/?register",
      verifiedAt: "2026-09-07T00:00:00Z",
      verifiedBy: "GGL Whitelist",
      notes: "Greentube Malta Limited — Virtuelle Automatenspiele — 02.02.2023",
    },
    {
      field: "paymentMethods",
      source: "https://www.stargames.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "On-site verified: Klarna, Visa, Mastercard, PayPal, Sofort, AirCash, Apple Pay, Paysafecard, Neteller, Skrill, bank transfer",
    },
    {
      field: "minDeposit",
      source: "https://www.stargames.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "€5 minimum deposit confirmed on site",
    },
    {
      field: "mobile",
      source: "https://www.stargames.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Mobile and iOS app available",
    },
    {
      field: "responsibleGambling",
      source: "https://www.stargames.de",
      verifiedAt: "2026-09-07T00:00:00Z",
      notes: "Deposit limits, session limits, reality checks, cooling-off period, self-exclusion available",
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
    { name: "Klarna", type: "bank-transfer" },
    { name: "Visa", type: "card" },
    { name: "Mastercard", type: "card" },
    { name: "PayPal", type: "e-wallet" },
    { name: "Sofort", type: "bank-transfer" },
    { name: "AirCash", type: "e-wallet" },
    { name: "Apple Pay", type: "mobile" },
    { name: "Paysafecard", type: "prepaid" },
    { name: "Neteller", type: "e-wallet" },
    { name: "Skrill", type: "e-wallet" },
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
      providers: ["Novomatic", "Greentube"],
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
      "StarGames is operated by Greentube Malta Limited under a GGL licence for virtual slot machines in Germany. The platform features Novomatic and Greentube titles. Payment methods include Klarna, Visa, Mastercard, PayPal, Sofort, AirCash, Apple Pay, Paysafecard, Neteller, Skrill, and bank transfer, with a €5 minimum deposit. Responsible gambling tools including deposit limits, session limits, reality checks, cooling-off, and self-exclusion are available.",
    pros: [],
    cons: [],
    verdict: "GGL-licensed virtual slot machine platform operated by Greentube Malta Limited.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-07T00:00:00Z",
  updatedAt: "2026-09-07T00:00:00Z",

  features: ["GGL Licensed", "Novomatic Slots", "Mobile App"],
  tags: ["germany", "virtual-slots", "ggl-verified"],
};
