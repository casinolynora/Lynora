import { z } from "zod";

export const CountryOptionSchema = z.object({
  code: z.string(),
  name: z.string(),
});
export type CountryOption = z.infer<typeof CountryOptionSchema>;

export const PaymentMethodOptionSchema = z.object({
  name: z.string(),
  type: z.enum(["e-wallet", "card", "bank-transfer", "crypto", "prepaid", "mobile"]),
});
export type PaymentMethodOption = z.infer<typeof PaymentMethodOptionSchema>;

export const GameOptionSchema = z.object({
  name: z.string(),
  slug: z.string(),
});
export type GameOption = z.infer<typeof GameOptionSchema>;

export const UserPreferencesSchema = z.object({
  country: z.string().min(1, "Please select your country"),
  minDeposit: z.number().min(0).optional(),
  maxDeposit: z.number().min(0).optional(),
  preferredPaymentMethod: z.string().optional(),
  preferredGames: z.array(z.string()).default([]),
  liveCasinoPreferred: z.boolean().default(false),
  sportsBettingPreferred: z.boolean().default(false),
  bonusPreference: z.enum(["welcome-bonus", "free-spins", "cashback", "no-deposit", "none", "any"]).default("any"),
  withdrawalPreference: z.enum(["fast", "standard", "no-preference"]).default("no-preference"),
  cryptoPreferred: z.boolean().default(false),
  mobileFriendly: z.boolean().default(false),
});
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const MATCH_COUNTRIES: CountryOption[] = [
  { code: "DE", name: "Germany" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Switzerland" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "PT", name: "Portugal" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "FI", name: "Finland" },
  { code: "DK", name: "Denmark" },
  { code: "IE", name: "Ireland" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "GR", name: "Greece" },
  { code: "RO", name: "Romania" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "HU", name: "Hungary" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "EE", name: "Estonia" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "CY", name: "Cyprus" },
  { code: "INT", name: "International" },
];

export const MATCH_PAYMENT_METHODS: PaymentMethodOption[] = [
  { name: "Visa", type: "card" },
  { name: "Mastercard", type: "card" },
  { name: "PayPal", type: "e-wallet" },
  { name: "Skrill", type: "e-wallet" },
  { name: "Neteller", type: "e-wallet" },
  { name: "Paysafecard", type: "prepaid" },
  { name: "Bank Transfer", type: "bank-transfer" },
  { name: "Apple Pay", type: "mobile" },
  { name: "Google Pay", type: "mobile" },
  { name: "Bitcoin", type: "crypto" },
  { name: "Ethereum", type: "crypto" },
  { name: "Trustly", type: "bank-transfer" },
  { name: "iDEAL", type: "bank-transfer" },
  { name: "Sofort", type: "bank-transfer" },
  { name: "ecoPayz", type: "e-wallet" },
  { name: "Interac", type: "bank-transfer" },
];

export const MATCH_GAME_OPTIONS: GameOption[] = [
  { name: "Slots", slug: "slots" },
  { name: "Blackjack", slug: "blackjack" },
  { name: "Roulette", slug: "roulette" },
  { name: "Poker", slug: "poker" },
  { name: "Baccarat", slug: "baccarat" },
  { name: "Live Casino", slug: "live-casino" },
  { name: "Craps", slug: "craps" },
  { name: "Video Poker", slug: "video-poker" },
  { name: "Jackpot Games", slug: "jackpots" },
  { name: "Table Games", slug: "table-games" },
];
