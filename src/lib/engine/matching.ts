import { Casino, UserPreferences, MatchResult, MatchReason, MatchScoreBreakdown, MatchWeights, DEFAULT_MATCH_WEIGHTS } from "@/lib/types";

function normalizeScore(raw: number, max: number): number {
  if (max === 0) return 0;
  return Math.min(100, Math.max(0, (raw / max) * 100));
}

function scoreCountry(casino: Casino, preferences: UserPreferences, weight: number): { score: number; reason: MatchReason } {
  const available = preferences.country === "INT" || casino.countries.includes(preferences.country);
  return {
    score: available ? weight : 0,
    reason: {
      category: "country",
      label: available ? `Available in ${preferences.country}` : `Not available in ${preferences.country}`,
      met: available,
      weight,
      detail: available ? "Licensed to operate in your region" : "Not available in your region",
    },
  };
}

function scorePaymentMethod(casino: Casino, preferences: UserPreferences, weight: number): { score: number; reason: MatchReason } {
  if (!preferences.preferredPaymentMethod) return { score: weight * 0.5, reason: { category: "payment-method", label: "Payment method not specified", met: true, weight } };
  const found = casino.paymentMethods.some(
    pm => pm.name.toLowerCase() === preferences.preferredPaymentMethod!.toLowerCase()
  );
  return {
    score: found ? weight : 0,
    reason: {
      category: "payment-method",
      label: found ? `Supports ${preferences.preferredPaymentMethod}` : `Does not support ${preferences.preferredPaymentMethod}`,
      met: found,
      weight,
    },
  };
}

function scoreMinimumDeposit(casino: Casino, preferences: UserPreferences, weight: number): { score: number; reason: MatchReason } {
  const pref = preferences.minDeposit ?? 20;
  if (casino.minDeposit <= pref) {
    return {
      score: weight,
      reason: { category: "minimum-deposit", label: `€${casino.minDeposit} minimum deposit`, met: true, weight, detail: `Your budget: €${pref}` },
    };
  }
  return {
    score: 0,
    reason: { category: "minimum-deposit", label: `€${casino.minDeposit} minimum (exceeds your €${pref})`, met: false, weight, detail: `You wanted ≤€${pref}` },
  };
}

function scoreMaximumDeposit(casino: Casino, preferences: UserPreferences, weight: number): { score: number; reason: MatchReason } {
  if (!preferences.maxDeposit) return { score: weight, reason: { category: "maximum-deposit", label: "No maximum deposit preference", met: true, weight } };
  if (!casino.maxDeposit) return { score: weight * 0.5, reason: { category: "maximum-deposit", label: "Maximum deposit not specified", met: true, weight } };
  if (casino.maxDeposit >= preferences.maxDeposit) {
    return {
      score: weight,
      reason: { category: "maximum-deposit", label: `€${casino.maxDeposit} max deposit`, met: true, weight, detail: `Your max: €${preferences.maxDeposit}` },
    };
  }
  return {
    score: 0,
    reason: { category: "maximum-deposit", label: `€${casino.maxDeposit} max (below your €${preferences.maxDeposit})`, met: false, weight, detail: `You wanted ≥€${preferences.maxDeposit}` },
  };
}

function scoreGames(casino: Casino, preferences: UserPreferences, weight: number): { score: number; reason: MatchReason } {
  if (preferences.preferredGames.length === 0) return { score: weight * 0.5, reason: { category: "games", label: "Game preference not specified", met: true, weight } };
  const availableSlugs = new Set(casino.games.filter(g => g.available).map(g => g.slug));
  const matched = preferences.preferredGames.filter(g => availableSlugs.has(g));
  const ratio = matched.length / preferences.preferredGames.length;
  return {
    score: weight * ratio,
    reason: {
      category: "games",
      label: ratio > 0.5 ? "Supports your preferred games" : ratio > 0 ? "Partial game match" : "Limited game preference match",
      met: ratio > 0,
      weight,
      detail: `Matches ${matched.length}/${preferences.preferredGames.length} game preferences`,
    },
  };
}

function scoreLiveCasino(casino: Casino, preferences: UserPreferences, weight: number): { score: number; reason: MatchReason } {
  if (!preferences.liveCasinoPreferred) return { score: weight, reason: { category: "live-casino", label: "Live casino not required", met: true, weight } };
  const met = casino.hasLiveCasino;
  return {
    score: met ? weight : 0,
    reason: { category: "live-casino", label: met ? "Live casino available" : "No live casino", met, weight },
  };
}

function scoreSportsBetting(casino: Casino, preferences: UserPreferences, weight: number): { score: number; reason: MatchReason } {
  if (!preferences.sportsBettingPreferred) return { score: weight, reason: { category: "sports-betting", label: "Sports betting not required", met: true, weight } };
  const met = casino.hasSportsBetting;
  return {
    score: met ? weight : 0,
    reason: { category: "sports-betting", label: met ? "Sports betting available" : "No sports betting", met, weight },
  };
}

function scoreBonus(casino: Casino, preferences: UserPreferences, weight: number): { score: number; reason: MatchReason } {
  if (preferences.bonusPreference === "none") return { score: weight, reason: { category: "bonus", label: "No bonus preference", met: true, weight } };
  if (preferences.bonusPreference === "any") {
    const hasBonus = casino.bonuses.length > 0;
    return {
      score: hasBonus ? weight : weight * 0.5,
      reason: { category: "bonus", label: hasBonus ? "Bonuses available" : "Limited bonuses", met: hasBonus, weight },
    };
  }
  const typeMap: Record<string, string> = { "welcome-bonus": "welcome", "free-spins": "free-spins", "cashback": "cashback", "no-deposit": "no-deposit" };
  const matchingBonus = casino.bonuses.find(b => b.type === typeMap[preferences.bonusPreference]);
  return {
    score: matchingBonus ? weight : 0,
    reason: { category: "bonus", label: matchingBonus ? matchingBonus.title : `No matching ${preferences.bonusPreference} available`, met: !!matchingBonus, weight },
  };
}

function scoreWithdrawal(casino: Casino, preferences: UserPreferences, weight: number): { score: number; reason: MatchReason } {
  if (preferences.withdrawalPreference === "no-preference") return { score: weight, reason: { category: "withdrawal", label: "No withdrawal preference", met: true, weight } };
  const time = casino.withdrawalProcessingTime?.toLowerCase() ?? "";
  const isFast = time.includes("instant") || time.includes("1 hour") || time.includes("2 hour");
  const isStandard = time.includes("24") || time.includes("48") || time.includes("3 day");

  if (preferences.withdrawalPreference === "fast") {
    return {
      score: isFast ? weight : isStandard ? weight * 0.4 : 0,
      reason: { category: "withdrawal", label: `Processing: ${casino.withdrawalProcessingTime}`, met: isFast, weight, detail: isFast ? "Fast withdrawal processing" : "Standard processing times" },
    };
  }
  return { score: weight, reason: { category: "withdrawal", label: `Processing: ${casino.withdrawalProcessingTime}`, met: true, weight } };
}

function scoreTrust(casino: Casino): { score: number; reason: MatchReason } {
  const licenseCount = casino.licenses.length;
  const trustVal = casino.trustScore ?? casino.rating ?? 50;
  const score = normalizeScore(licenseCount * 30 + trustVal, 100);
  return {
    score,
    reason: { category: "trust", label: `${licenseCount} license(s), trust score ${trustVal}/100`, met: licenseCount > 0, weight: 0 },
  };
}

export function matchCasino(
  casino: Casino,
  preferences: UserPreferences,
  weights: MatchWeights = DEFAULT_MATCH_WEIGHTS,
): MatchResult {
  const reasons: MatchReason[] = [];
  const warnings: string[] = [];
  const breakdown: MatchScoreBreakdown = {
    country: 0, paymentMethod: 0, minimumDeposit: 0, maximumDeposit: 0,
    games: 0, liveCasino: 0, sportsBetting: 0, bonus: 0, withdrawal: 0,
  };

  const countryResult = scoreCountry(casino, preferences, weights.country);
  breakdown.country = countryResult.score;
  reasons.push(countryResult.reason);
  if (!countryResult.reason.met) warnings.push("This casino may not be available in your country.");

  const paymentResult = scorePaymentMethod(casino, preferences, weights.paymentMethod);
  breakdown.paymentMethod = paymentResult.score;
  reasons.push(paymentResult.reason);

  const depositResult = scoreMinimumDeposit(casino, preferences, weights.minimumDeposit);
  breakdown.minimumDeposit = depositResult.score;
  reasons.push(depositResult.reason);

  const maxDepositResult = scoreMaximumDeposit(casino, preferences, weights.maximumDeposit);
  breakdown.maximumDeposit = maxDepositResult.score;
  reasons.push(maxDepositResult.reason);

  const gamesResult = scoreGames(casino, preferences, weights.games);
  breakdown.games = gamesResult.score;
  reasons.push(gamesResult.reason);

  const liveResult = scoreLiveCasino(casino, preferences, weights.liveCasino);
  breakdown.liveCasino = liveResult.score;
  reasons.push(liveResult.reason);

  const sportsResult = scoreSportsBetting(casino, preferences, weights.sportsBetting);
  breakdown.sportsBetting = sportsResult.score;
  reasons.push(sportsResult.reason);

  const bonusResult = scoreBonus(casino, preferences, weights.bonus);
  breakdown.bonus = bonusResult.score;
  reasons.push(bonusResult.reason);

  const withdrawalResult = scoreWithdrawal(casino, preferences, weights.withdrawal);
  breakdown.withdrawal = withdrawalResult.score;
  reasons.push(withdrawalResult.reason);

  const trustResult = scoreTrust(casino);
  reasons.push(trustResult.reason);

  const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const maxPossible = Object.values(weights).reduce((a, b) => a + b, 0);
  const matchPercentage = Math.round(normalizeScore(totalScore, maxPossible));

  casino.bonuses.forEach(b => {
    if (b.wageringRequirement) {
      const numStr = b.wageringRequirement.replace(/[^0-9]/g, "");
      if (numStr) {
        const wr = parseInt(numStr, 10);
        if (!isNaN(wr) && wr > 40) warnings.push(`${b.title} has a high wagering requirement (${b.wageringRequirement}).`);
      }
    }
  });

  return {
    casinoId: casino.id,
    casinoSlug: casino.slug,
    casinoName: casino.name,
    overallScore: totalScore,
    matchPercentage,
    reasons,
    scoreBreakdown: breakdown,
    warnings,
  };
}

export function rankCasinos(
  casinos: Casino[],
  preferences: UserPreferences,
  weights: MatchWeights = DEFAULT_MATCH_WEIGHTS,
  limit = 10,
): MatchResult[] {
  return casinos
    .map(casino => matchCasino(casino, preferences, weights))
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, limit);
}
