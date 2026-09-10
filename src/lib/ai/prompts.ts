import { AICasinoInput } from "./schemas";

// Token budget: ~4 chars per token, limit to ~8000 tokens for context
const MAX_CASINOS_IN_PROMPT = 8;
const MAX_CHARS_PER_REVIEW = 200;

export function buildExplainPrompt(
  preferencesSummary: string,
  casinos: AICasinoInput[],
  matchPercentages: Record<string, number>,
): { system: string; user: string } {
  // Limit casinos to prevent token overflow
  const limitedCasinos = casinos.slice(0, MAX_CASINOS_IN_PROMPT);
  const system = `You are CasinoLynora's AI assistant. Your role is to explain why specific online casinos match a player's preferences.

RULES:
- You MUST only use the structured casino data provided below.
- You MUST NEVER invent, fabricate, or guess any casino information.
- You MUST NEVER invent licenses, bonuses, payment methods, withdrawal times, ratings, or any other data.
- If information is not available in the provided data, say "Information not available."
- Keep explanations concise (2-4 sentences per casino summary).
- Focus on why the casino matches the player's stated preferences.
- Mention limitations honestly when a preference is not fully met.
- Mention important conditions like wagering requirements when relevant.
- Do NOT use promotional language or make guarantees.
- Do NOT mention affiliate relationships.
- Always respond with valid JSON matching the required schema.

OUTPUT FORMAT (JSON):
{
  "explanations": [
    {
      "casinoId": "<id>",
      "headline": "<short headline about why it matches>",
      "summary": "<2-4 sentence explanation>",
      "matchingReasons": ["<reason 1>", "<reason 2>", ...],
      "limitations": ["<limitation if any>"],
      "importantNotes": ["<important note if any>"]
    }
  ]
}`;

  const casinoData = limitedCasinos.map(c => {
    const pct = matchPercentages[c.id] ?? 0;
    // Truncate long reviews to prevent token overflow
    const truncate = (s: string, max: number) => s.length > max ? s.slice(0, max) + "..." : s;
    return `CASINO: ${c.name} (ID: ${c.id})
Rating: ${c.rating}/100${c.trustScore ? ` | Trust Score: ${c.trustScore}/100` : ""}
Match Score: ${pct}%
Min Deposit: €${c.minDeposit}${c.maxDeposit ? ` | Max: €${c.maxDeposit}` : ""}
Countries: ${c.countries.join(", ")}
Licenses: ${c.licenses.map(l => `${l.issuer} (${l.jurisdiction})`).join(", ")}
Payment Methods: ${c.paymentMethods.map(p => `${p.name} (${p.type})`).join(", ")}
Withdrawal: ${c.withdrawalProcessingTime ?? "Not specified"}
Live Casino: ${c.hasLiveCasino ? "Yes" : "No"} | Sports: ${c.hasSportsBetting ? "Yes" : "No"}
Games: ${c.games.filter(g => g.available).map(g => g.name).join(", ")}
Bonuses: ${c.bonuses.map(b => `${b.title}: ${truncate(b.description, MAX_CHARS_PER_REVIEW)}${b.wageringRequirement ? ` (WR: ${b.wageringRequirement})` : ""}`).join("; ")}
Pros: ${c.review.pros.map(p => truncate(p, MAX_CHARS_PER_REVIEW)).join("; ")}
Cons: ${c.review.cons.map(c => truncate(c, MAX_CHARS_PER_REVIEW)).join("; ")}
Verdict: ${truncate(c.review.verdict, MAX_CHARS_PER_REVIEW)}`;
  }).join("\n\n");

  const user = `PLAYER PREFERENCES:
${preferencesSummary}

CASINOS TO EXPLAIN (ranked by match score):
${casinoData}

Generate a concise explanation for each casino explaining why it matches (or doesn't fully match) the player's preferences. Return valid JSON with the "explanations" array.`;

  return { system, user };
}

export function buildPreferenceExtractionPrompt(
  userMessage: string,
  currentPreferences: Record<string, unknown>,
): { system: string; user: string } {
  const system = `You are CasinoLynora's preference extraction assistant. Your role is to parse a user's natural-language message and extract casino preferences into structured JSON.

RULES:
- Only extract preferences that are clearly stated or strongly implied by the user.
- Do NOT assume preferences the user hasn't mentioned.
- For fields not mentioned, use null (do not include them in the output).
- Only use values from the allowed enums.
- Keep extraction conservative — when in doubt, don't extract.

ALLOWED VALUES:
- country: ISO codes (DE, AT, CH, NL, BE, FR, IT, ES, PT, SE, NO, FI, DK, IE, PL, CZ, GR, RO, BG, HR, HU, SK, SI, EE, LV, LT, LU, MT, CY, INT)
- preferredPaymentMethod: Visa, Mastercard, PayPal, Skrill, Neteller, Paysafecard, Bank Transfer, Apple Pay, Google Pay, Bitcoin, Ethereum, Trustly, iDEAL, Sofort, ecoPayz, Interac
- preferredGames: slots, blackjack, roulette, poker, baccarat, live-casino, craps, video-poker, jackpots, table-games
- bonusPreference: welcome-bonus, free-spins, cashback, no-deposit, none, any
- withdrawalPreference: fast, standard, no-preference

OUTPUT FORMAT (JSON — only include fields that changed):
{
  "country": "DE",
  "preferredPaymentMethod": "Visa",
  "preferredGames": ["slots"],
  "bonusPreference": "none",
  "withdrawalPreference": "fast",
  "liveCasinoPreferred": true,
  "sportsBettingPreferred": false,
  "cryptoPreferred": false,
  "mobileFriendly": false,
  "minDeposit": 20,
  "maxDeposit": 500
}`;

  const user = `Current preferences: ${JSON.stringify(currentPreferences, null, 0)}

User message: "${userMessage}"

Extract the updated preferences as JSON. Only include fields that the user explicitly changed or mentioned.`;

  return { system, user };
}
