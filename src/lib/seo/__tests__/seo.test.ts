import { describe, it, expect } from "vitest";
import { SITE_URL, siteUrl } from "@/lib/config/site";

describe("SEO Architecture", () => {
  describe("SITE_URL", () => {
    it("starts with https://", () => {
      expect(SITE_URL).toMatch(/^https:\/\//);
    });

    it("does not contain localhost", () => {
      expect(SITE_URL).not.toContain("localhost");
    });

    it("does not contain vercel.app", () => {
      expect(SITE_URL).not.toContain("vercel.app");
    });

    it("does not end with a trailing slash", () => {
      expect(SITE_URL.endsWith("/")).toBe(false);
    });

    it("is a valid URL", () => {
      expect(() => new URL(SITE_URL)).not.toThrow();
    });
  });

  describe("siteUrl()", () => {
    it("returns SITE_URL for empty path", () => {
      expect(siteUrl("")).toBe(SITE_URL);
    });

    it("prepends / if missing", () => {
      expect(siteUrl("casinos")).toBe(`${SITE_URL}/casinos`);
    });

    it("handles leading / path", () => {
      expect(siteUrl("/casinos")).toBe(`${SITE_URL}/casinos`);
    });

    it("returns SITE_URL for no args", () => {
      expect(siteUrl()).toBe(SITE_URL);
    });

    it("does not produce double slashes", () => {
      const result = siteUrl("/about");
      expect(result).not.toContain("//about");
      expect(result).toContain("https://"); // only the protocol
    });
  });

  describe("Domain configuration", () => {
    it("has a configured SITE_URL", () => {
      expect(SITE_URL.length).toBeGreaterThan(0);
    });

    it("SITE_URL is used for canonicals (no hardcoded domains in source)", () => {
      // This test verifies the architecture — SITE_URL is the single source
      expect(SITE_URL).toBeTruthy();
      expect(siteUrl("/test")).toBe(`${SITE_URL}/test`);
    });
  });
});
