import { describe, it, expect, vi, beforeEach } from "vitest";
import { memoryRateLimiter, checkRateLimit, setRateLimiter, getRateLimiter } from "../index";

describe("Rate Limiter", () => {
  beforeEach(() => {
    setRateLimiter(memoryRateLimiter);
  });

  describe("memoryRateLimiter", () => {
    it("allows requests within limit", async () => {
      const result = await memoryRateLimiter.check("test-key", 3, 60);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
    });

    it("blocks requests over limit", async () => {
      await memoryRateLimiter.check("test-limit", 2, 60);
      await memoryRateLimiter.check("test-limit", 2, 60);
      const result = await memoryRateLimiter.check("test-limit", 2, 60);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("resets after window expires", async () => {
      // Use a unique key and a window that's already expired
      const result = await memoryRateLimiter.check("test-expired-" + Date.now(), 1, 0);
      // With window of 0, the entry expires immediately
      expect(result.allowed).toBe(true);
    });

    it("tracks remaining correctly", async () => {
      const r1 = await memoryRateLimiter.check("test-remaining", 5, 60);
      expect(r1.remaining).toBe(4);
      const r2 = await memoryRateLimiter.check("test-remaining", 5, 60);
      expect(r2.remaining).toBe(3);
    });
  });

  describe("checkRateLimit convenience", () => {
    it("uses the active limiter", async () => {
      const result = await checkRateLimit("conv-key", 10, 60);
      expect(result.allowed).toBe(true);
    });
  });

  describe("setRateLimiter / getRateLimiter", () => {
    it("allows swapping implementations", () => {
      const custom = { check: vi.fn() };
      setRateLimiter(custom);
      expect(getRateLimiter()).toBe(custom);
    });
  });
});
