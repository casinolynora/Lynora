import { AIProvider, AIExplanationRequest, AIExplanationResponse } from "./provider";
import { AICasinoInput, AICasinoInputSchema, AIExplanationsSchema, ExtractedPreferencesSchema, AI_REDACTED_FIELDS } from "./schemas";
import { buildExplainPrompt, buildPreferenceExtractionPrompt } from "./prompts";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

function getConfig() {
  return {
    apiKey: process.env.OPENAI_API_KEY ?? null,
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    maxTokens: 2000,
    timeoutMs: Number(process.env.OPENAI_TIMEOUT_MS) || 15000,
  };
}

export function isOpenAIAvailable(): boolean {
  return !!getConfig().apiKey;
}

async function callOpenAI(system: string, user: string): Promise<string> {
  const config = getConfig();
  if (!config.apiKey) throw new Error("OPENAI_API_KEY not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: config.maxTokens,
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      await response.text().catch(() => "unknown");
      throw new Error(`OpenAI API error ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content ?? "";
  } finally {
    clearTimeout(timeout);
  }
}

function generateStubExplanations(request: AIExplanationRequest): AIExplanationResponse[] {
  return request.results.map(result => {
    const casino = request.casinos.find(c => c.id === result.casinoId);
    const metReasons = result.reasons.filter(r => r.met);
    const parts: string[] = [];

    const countryReason = metReasons.find(r => r.category === "country");
    if (countryReason) parts.push(`Available in ${request.preferences.country}`);

    const paymentReason = metReasons.find(r => r.category === "payment-method");
    if (paymentReason?.met && request.preferences.preferredPaymentMethod) {
      parts.push(`supports ${request.preferences.preferredPaymentMethod}`);
    }

    const gameReason = metReasons.find(r => r.category === "games");
    if (gameReason?.met && gameReason.detail) parts.push(gameReason.detail);

    const liveReason = metReasons.find(r => r.category === "live-casino");
    if (liveReason?.met && request.preferences.liveCasinoPreferred) parts.push("has live casino");

    return {
      casinoId: result.casinoId,
      headline: parts.length > 0 ? parts[0] : `Matches ${result.matchPercentage}% of your preferences`,
      summary: parts.length > 0
        ? `${casino?.name ?? "This casino"} matches ${result.matchPercentage}% of your preferences. ${parts.join(". ")}.`
        : `${casino?.name ?? "This casino"} scores ${result.matchPercentage}% based on your preferences.`,
      matchingReasons: metReasons.slice(0, 5).map(r => r.label),
      limitations: result.reasons.filter(r => !r.met).slice(0, 3).map(r => r.label),
      importantNotes: result.warnings.slice(0, 2),
    };
  });
}

function stripSensitiveFields(casino: Record<string, unknown>): AICasinoInput {
  const stripped: Record<string, unknown> = {};
  for (const key of Object.keys(casino)) {
    if (!AI_REDACTED_FIELDS.includes(key as typeof AI_REDACTED_FIELDS[number])) {
      stripped[key] = casino[key];
    }
  }
  return AICasinoInputSchema.parse(stripped);
}

async function generateOpenAIExplanations(request: AIExplanationRequest): Promise<AIExplanationResponse[]> {
  const casinos: AICasinoInput[] = request.casinos.map(c => stripSensitiveFields(c as unknown as Record<string, unknown>));

  const matchPercentages: Record<string, number> = {};
  for (const r of request.results) {
    matchPercentages[r.casinoId] = r.matchPercentage;
  }

  const { system, user } = buildExplainPrompt(
    summarizePreferences(request.preferences),
    casinos,
    matchPercentages,
  );

  const raw = await callOpenAI(system, user);
  const parsed = JSON.parse(raw);
  const validated = AIExplanationsSchema.safeParse(parsed);

  if (!validated.success) {
    console.error("AI explanation validation failed:", validated.error.flatten().fieldErrors);
    return generateStubExplanations(request);
  }

  // Validate casino IDs match expected results — reject hallucinated IDs
  const validIds = new Set(request.results.map(r => r.casinoId));
  return validated.data.explanations.filter(e => validIds.has(e.casinoId));
}

function summarizePreferences(preferences: AIExplanationRequest["preferences"]): string {
  const parts: string[] = [];
  parts.push(`Country: ${preferences.country}`);
  if (preferences.minDeposit) parts.push(`Min deposit: €${preferences.minDeposit}`);
  if (preferences.maxDeposit) parts.push(`Max deposit: €${preferences.maxDeposit}`);
  if (preferences.preferredPaymentMethod) parts.push(`Payment method: ${preferences.preferredPaymentMethod}`);
  if (preferences.preferredGames.length > 0) parts.push(`Games: ${preferences.preferredGames.join(", ")}`);
  if (preferences.liveCasinoPreferred) parts.push("Wants live casino");
  if (preferences.sportsBettingPreferred) parts.push("Wants sports betting");
  if (preferences.bonusPreference !== "any") parts.push(`Bonus: ${preferences.bonusPreference}`);
  if (preferences.withdrawalPreference !== "no-preference") parts.push(`Withdrawal: ${preferences.withdrawalPreference}`);
  if (preferences.cryptoPreferred) parts.push("Wants crypto");
  if (preferences.mobileFriendly) parts.push("Wants mobile-friendly");
  return parts.join("\n");
}

export async function extractPreferences(
  userMessage: string,
  currentPreferences: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  if (!isOpenAIAvailable()) throw new Error("OPENAI_API_KEY not configured");

  const { system, user } = buildPreferenceExtractionPrompt(userMessage, currentPreferences);
  const raw = await callOpenAI(system, user);
  const parsed = JSON.parse(raw);
  const validated = ExtractedPreferencesSchema.safeParse(parsed);

  if (!validated.success) {
    console.error("Preference extraction validation failed:", validated.error.flatten().fieldErrors);
    return {};
  }

  return validated.data;
}

export const openaiProvider: AIProvider = {
  generateExplanations: async (request) => {
    if (!isOpenAIAvailable()) return generateStubExplanations(request);
    try {
      return await generateOpenAIExplanations(request);
    } catch {
      console.error("OpenAI provider error, falling back to stub");
      return generateStubExplanations(request);
    }
  },
};
