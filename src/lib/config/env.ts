import { z } from "zod";

const envSchema = z.object({
  // Server-only
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  OPENAI_TIMEOUT_MS: z.coerce.number().default(15000),

  // Database (optional — for production data provider)
  DATABASE_URL: z.string().optional(),

  // Public
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://casinolynora.com"),
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Rate limiting
  RATE_LIMIT_MATCH_MAX: z.coerce.number().default(20),
  RATE_LIMIT_REFINE_MAX: z.coerce.number().default(30),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().default(60),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    // Return defaults for missing vars — app should still work
    cachedEnv = envSchema.parse({});
    return cachedEnv;
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

// Server-only helpers — never import from client components
export function getServerEnv() {
  const env = getEnv();
  return {
    openaiApiKey: env.OPENAI_API_KEY ?? null,
    openaiModel: env.OPENAI_MODEL,
    openaiTimeoutMs: env.OPENAI_TIMEOUT_MS,
    siteUrl: env.NEXT_PUBLIC_SITE_URL,
    rateLimitMatchMax: env.RATE_LIMIT_MATCH_MAX,
    rateLimitRefineMax: env.RATE_LIMIT_REFINE_MAX,
    rateLimitWindowSeconds: env.RATE_LIMIT_WINDOW_SECONDS,
  };
}

// Client-only helpers — safe to import in "use client" components
export function getClientEnv() {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://casinolynora.com",
    gaId: process.env.NEXT_PUBLIC_GA_ID ?? null,
  };
}
