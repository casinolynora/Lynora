export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export interface RateLimiter {
  check(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult>;
}

// In-memory rate limiter (development only)
const store = new Map<string, { count: number; resetAt: number }>();

export const memoryRateLimiter: RateLimiter = {
  async check(key, limit, windowSeconds) {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
    }

    if (entry.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count++;
    return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
  },
};

// Placeholder for Redis/Upstash rate limiter
// To use: set RATE_LIMITER=redis and provide REDIS_URL
async function createRedisRateLimiter(): Promise<RateLimiter | null> { // eslint-disable-line @typescript-eslint/no-unused-vars
  // Redis/Upstash integration point
  // Example with @upstash/ratelimit:
  //
  // import { Ratelimit } from "@upstash/ratelimit";
  // import { Redis } from "@upstash/redis";
  //
  // const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! });
  // const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(limit, `${windowSeconds}s`) });
  //
  // return {
  //   async check(key, limit, windowSeconds) {
  //     const result = await ratelimit.limit(key);
  //     return { allowed: result.success, remaining: result.remaining, resetAt: result.reset };
  //   },
  // };
  return null;
}

let activeLimiter: RateLimiter = memoryRateLimiter;

export function setRateLimiter(limiter: RateLimiter) {
  activeLimiter = limiter;
}

export function getRateLimiter(): RateLimiter {
  return activeLimiter;
}

// Convenience function for API routes
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  return activeLimiter.check(key, limit, windowSeconds);
}
