export type MatchReasonCategory =
  | "country"
  | "payment-method"
  | "minimum-deposit"
  | "maximum-deposit"
  | "games"
  | "live-casino"
  | "sports-betting"
  | "bonus"
  | "withdrawal"
  | "trust";

export interface MatchReason {
  category: MatchReasonCategory;
  label: string;
  met: boolean;
  weight: number;
  detail?: string;
}

export interface MatchScoreBreakdown {
  country: number;
  paymentMethod: number;
  minimumDeposit: number;
  maximumDeposit: number;
  games: number;
  liveCasino: number;
  sportsBetting: number;
  bonus: number;
  withdrawal: number;
}

export interface MatchResult {
  casinoId: string;
  casinoSlug: string;
  casinoName: string;
  overallScore: number;
  matchPercentage: number;
  reasons: MatchReason[];
  scoreBreakdown: MatchScoreBreakdown;
  aiExplanation?: string;
  warnings: string[];
}

export interface MatchWeights {
  country: number;
  paymentMethod: number;
  minimumDeposit: number;
  maximumDeposit: number;
  games: number;
  liveCasino: number;
  sportsBetting: number;
  bonus: number;
  withdrawal: number;
}

export const DEFAULT_MATCH_WEIGHTS: MatchWeights = {
  country: 25,
  paymentMethod: 20,
  minimumDeposit: 10,
  maximumDeposit: 5,
  games: 15,
  liveCasino: 5,
  sportsBetting: 5,
  bonus: 10,
  withdrawal: 5,
};
