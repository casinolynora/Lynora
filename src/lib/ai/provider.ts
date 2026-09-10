import { MatchResult, Casino, UserPreferences } from "@/lib/types";
import { openaiProvider, isOpenAIAvailable } from "./openai-provider";

export interface AIExplanationRequest {
  preferences: UserPreferences;
  results: MatchResult[];
  casinos: Casino[];
}

export interface AIExplanationResponse {
  casinoId: string;
  headline: string;
  summary: string;
  matchingReasons: string[];
  limitations: string[];
  importantNotes: string[];
}

export type AIProvider = {
  generateExplanations(request: AIExplanationRequest): Promise<AIExplanationResponse[]>;
};

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

// Auto-select provider: use OpenAI if API key is available, otherwise stub
function createProvider(): AIProvider {
  if (isOpenAIAvailable()) {
    return openaiProvider;
  }
  return {
    generateExplanations: (request) => Promise.resolve(generateStubExplanations(request)),
  };
}

let activeProvider: AIProvider = createProvider();

export function setAIProvider(provider: AIProvider) {
  activeProvider = provider;
}

export function getAIProvider(): AIProvider {
  return activeProvider;
}

export async function generateAIExplanations(request: AIExplanationRequest): Promise<AIExplanationResponse[]> {
  return activeProvider.generateExplanations(request);
}
