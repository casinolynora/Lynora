import type { Casino } from "@/lib/types/casino";

export const ladbrokesCasinoBe: Casino = {
  id: "belgium-ladbrokes-casino-be",
  slug: "ladbrokes-casino-be",
  name: "Ladbrokes Casino",
  tagline: "Entain's Belgian casino linked to Casino de Dinant",
  logo: null,
  description:
    "Ladbrokes Casino is operated by SA Casino de Dinant with Derby SA as operational partner, part of the Entain plc group. It holds a KSC A+ licence and is linked to Casino de Dinant. The platform offers live casino, slots, and multiple payment options including Bancontact.",
  founded: null,
  owner: "SA Casino de Dinant / Derby SA (Entain plc)",
  website: "https://www.casinoladbrokes.be",

  status: "active",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-09-10T00:00:00Z",
  dataSources: [
    {
      field: "license",
      source: "https://www.gamingcommission.be/",
      verifiedAt: "2026-09-10T00:00:00Z",
      verifiedBy: "KSC Register",
      notes: "SA Casino de Dinant — KSC A+ 65721",
    },
    {
      field: "paymentMethods",
      source: "https://www.casinoladbrokes.be",
      verifiedAt: "2026-09-10T00:00:00Z",
      notes: "On-site verified: Bancontact, PayPal, Neteller, Paysafecard, Neosurf",
    },
    {
      field: "responsibleGambling",
      source: "https://www.casinoladbrokes.be",
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
      licenseNumber: "A+ 65721",
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
    { name: "PayPal", type: "e-wallet" },
    { name: "Neteller", type: "e-wallet" },
    { name: "Paysafecard", type: "prepaid" },
    { name: "Neosurf", type: "prepaid" },
  ],
  withdrawalMethods: [],
  withdrawalProcessingTime: null,

  bonuses: [],
  games: [
    {
      name: "Slots",
      slug: "slots",
      available: true,
      providers: ["Playtech", "NetEnt", "Pragmatic Play", "Play'n GO"],
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
      "Ladbrokes Casino is operated by SA Casino de Dinant under a KSC A+ licence. Part of the Entain plc group, it is linked to Casino de Dinant. The platform offers live casino, slots, and multiple payment options including Bancontact, PayPal, Neteller, Paysafecard, and Neosurf. Responsible gambling tools with EPIS integration are available.",
    pros: [],
    cons: [],
    verdict: "KSC A+ licensed Entain casino linked to Casino de Dinant.",
    score: null,
    scoreBreakdown: null,
  },

  createdAt: "2026-09-10T00:00:00Z",
  updatedAt: "2026-09-10T00:00:00Z",

  features: ["KSC Licensed", "Bancontact", "Live Casino", "Mobile App"],
  tags: ["belgium", "slots", "live-casino", "ksc-verified"],
};
