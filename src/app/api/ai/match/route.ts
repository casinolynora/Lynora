import { NextRequest, NextResponse } from "next/server";
import { MatchRequestSchema } from "@/lib/ai/schemas";
import { casinoDb } from "@/lib/data/accessor";
import { rankCasinos } from "@/lib/engine/matching";
import { generateAIExplanations } from "@/lib/ai/provider";
import { UserPreferences } from "@/lib/types";
import { checkRateLimit } from "@/lib/rate-limit";
import { getServerEnv } from "@/lib/config/env";

export async function POST(request: NextRequest) {
  const env = getServerEnv();
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";

  const rateLimit = await checkRateLimit(`match:${ip}`, env.rateLimitMatchMax, env.rateLimitWindowSeconds);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = MatchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const prefs: UserPreferences = parsed.data;

  try {
    // Step 1: Deterministic matching (server-side, authoritative)
    const allCasinos = casinoDb.getAllCasinos();
    const matched = rankCasinos(allCasinos, prefs, undefined, 10);

    // Step 2: AI explanations (graceful fallback on failure)
    let explanations: Awaited<ReturnType<typeof generateAIExplanations>> = [];
    try {
      const casinoData = matched
        .map(r => casinoDb.getCasinoById(r.casinoId))
        .filter(Boolean) as NonNullable<ReturnType<typeof casinoDb.getCasinoById>>[];

      explanations = await generateAIExplanations({
        preferences: prefs,
        results: matched,
        casinos: casinoData,
      });
    } catch {
      console.error("AI explanation failed, using stub");
    }

    // Step 3: Build casino data map for client display (strip sensitive fields)
    const casinoData: Record<string, Record<string, unknown>> = {};
    for (const result of matched) {
      const casino = casinoDb.getCasinoById(result.casinoId);
      if (casino) {
        const safeData = { ...casino };
        delete (safeData as Record<string, unknown>).kycDocuments;
        delete (safeData as Record<string, unknown>).owner;
        casinoData[result.casinoId] = safeData as Record<string, unknown>;
      }
    }

    // Step 4: Merge explanations into results
    const results = matched.map(result => {
      const explanation = explanations.find(e => e.casinoId === result.casinoId);
      return {
        ...result,
        aiExplanation: explanation,
        warnings: [...result.warnings, ...(explanation?.importantNotes ?? [])],
      };
    });

    return NextResponse.json({ results, preferences: prefs, casinoData });
  } catch {
    console.error("Match API error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
