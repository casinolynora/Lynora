import { NextRequest, NextResponse } from "next/server";
import { RefineRequestSchema } from "@/lib/ai/schemas";
import { extractPreferences, isOpenAIAvailable } from "@/lib/ai/openai-provider";
import { checkRateLimit } from "@/lib/rate-limit";
import { getServerEnv } from "@/lib/config/env";

export async function POST(request: NextRequest) {
  const env = getServerEnv();
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";

  const rateLimit = await checkRateLimit(`refine:${ip}`, env.rateLimitRefineMax, env.rateLimitWindowSeconds);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  if (!isOpenAIAvailable()) {
    return NextResponse.json(
      { error: "Conversational refinement requires OpenAI. Please add OPENAI_API_KEY." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = RefineRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { message, currentPreferences } = parsed.data;

  try {
    const extracted = await extractPreferences(message, currentPreferences);

    // Merge extracted preferences with current, only updating non-null values
    const updatedPreferences = { ...currentPreferences };
    for (const [key, value] of Object.entries(extracted)) {
      if (value !== null && value !== undefined) {
        (updatedPreferences as Record<string, unknown>)[key] = value;
      }
    }

    // Build change description
    const changes: string[] = [];
    for (const [key, value] of Object.entries(extracted)) {
      if (value !== null && value !== undefined) {
        const label = key.replace(/([A-Z])/g, " $1").toLowerCase();
        changes.push(`${label}: ${JSON.stringify(value)}`);
      }
    }

    return NextResponse.json({
      updatedPreferences,
      changeDescription: changes.length > 0
        ? `Updated: ${changes.join(", ")}`
        : "No preferences were changed based on your message.",
    });
  } catch {
    console.error("Refine API error");
    return NextResponse.json({ error: "Failed to process your message." }, { status: 500 });
  }
}
