import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/config/site";

describe("robots.txt", () => {
  const robotsConfig = robots();
  const rulesArray = Array.isArray(robotsConfig.rules)
    ? robotsConfig.rules
    : [robotsConfig.rules];

  it("allows all public pages", () => {
    const mainRule = rulesArray.find(
      (r) => r.userAgent === "*"
    );
    expect(mainRule).toBeDefined();
    expect(mainRule?.allow).toBe("/");
  });

  it("blocks API routes", () => {
    const mainRule = rulesArray.find(
      (r) => r.userAgent === "*"
    );
    expect(mainRule?.disallow).toContain("/api/");
  });

  it("does not block GEO pages", () => {
    const mainRule = rulesArray.find(
      (r) => r.userAgent === "*"
    );
    expect(mainRule?.disallow).not.toContain("/de");
    expect(mainRule?.disallow).not.toContain("/ie");
    expect(mainRule?.disallow).not.toContain("/nl");
    expect(mainRule?.disallow).not.toContain("/be");
  });

  it("does not block casino pages", () => {
    const mainRule = rulesArray.find(
      (r) => r.userAgent === "*"
    );
    expect(mainRule?.disallow).not.toContain("/casinos");
    expect(mainRule?.disallow).not.toContain("/casino-reviews");
  });

  it("does not block B2B pages", () => {
    const mainRule = rulesArray.find(
      (r) => r.userAgent === "*"
    );
    expect(mainRule?.disallow).not.toContain("/for-casinos");
  });

  it("includes correct sitemap URL", () => {
    expect(robotsConfig.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it("sitemap URL uses centralized SITE_URL", () => {
    expect(robotsConfig.sitemap).toMatch(/^https:\/\/.*\/sitemap\.xml$/);
    expect(robotsConfig.sitemap).not.toContain("localhost");
    expect(robotsConfig.sitemap).not.toContain("vercel.app");
  });

  it("blocks AI training bots", () => {
    const aiRules = rulesArray.filter(r =>
      r.userAgent === "GPTBot" ||
      r.userAgent === "CCBot" ||
      r.userAgent === "ClaudeBot" ||
      r.userAgent === "anthropic-ai" ||
      r.userAgent === "Google-Extended" ||
      r.userAgent === "ChatGPT-User"
    );
    expect(aiRules.length).toBeGreaterThanOrEqual(6);
    for (const rule of aiRules) {
      expect(rule.disallow).toBe("/");
    }
  });
});

describe("sitemap", () => {
  const sitemapEntries = sitemap();

  it("returns an array", () => {
    expect(Array.isArray(sitemapEntries)).toBe(true);
  });

  it("includes homepage", () => {
    const home = sitemapEntries.find((e) => e.url === SITE_URL);
    expect(home).toBeDefined();
  });

  it("includes casino pages", () => {
    const casinos = sitemapEntries.find((e) => e.url === `${SITE_URL}/casinos`);
    expect(casinos).toBeDefined();
  });

  it("excludes AI matchmaker from sitemap (noindex page)", () => {
    const match = sitemapEntries.find((e) => e.url === `${SITE_URL}/ai-casino-match`);
    expect(match).toBeUndefined();
  });

  it("includes GEO hub pages", () => {
    const de = sitemapEntries.find((e) => e.url === `${SITE_URL}/de`);
    const ie = sitemapEntries.find((e) => e.url === `${SITE_URL}/ie`);
    const nl = sitemapEntries.find((e) => e.url === `${SITE_URL}/nl`);
    const be = sitemapEntries.find((e) => e.url === `${SITE_URL}/be`);
    expect(de).toBeDefined();
    expect(ie).toBeDefined();
    expect(nl).toBeDefined();
    expect(be).toBeDefined();
  });

  it("includes B2B pages", () => {
    const forCasinos = sitemapEntries.find((e) => e.url === `${SITE_URL}/for-casinos`);
    const pricing = sitemapEntries.find((e) => e.url === `${SITE_URL}/for-casinos/pricing`);
    const submit = sitemapEntries.find((e) => e.url === `${SITE_URL}/for-casinos/list-your-casino`);
    expect(forCasinos).toBeDefined();
    expect(pricing).toBeDefined();
    expect(submit).toBeDefined();
  });

  it("does not include API endpoints", () => {
    const apiEntry = sitemapEntries.find((e) => e.url.includes("/api/"));
    expect(apiEntry).toBeUndefined();
  });

  it("all URLs use centralized SITE_URL", () => {
    const parsedSiteUrl = new URL(SITE_URL);
    for (const entry of sitemapEntries) {
      const parsed = new URL(entry.url);
      expect(parsed.origin).toBe(parsedSiteUrl.origin);
      expect(entry.url).not.toContain("localhost");
      expect(entry.url).not.toContain("vercel.app");
    }
  });

  it("no duplicate URLs", () => {
    const urls = sitemapEntries.map((e) => e.url);
    const unique = new Set(urls);
    expect(unique.size).toBe(urls.length);
  });

  it("all entries have required fields", () => {
    for (const entry of sitemapEntries) {
      expect(entry.url).toBeTruthy();
      expect(entry.lastModified).toBeTruthy();
      expect(entry.changeFrequency).toBeTruthy();
      expect(typeof entry.priority).toBe("number");
    }
  });

  it("homepage has highest priority", () => {
    const home = sitemapEntries.find((e) => e.url === SITE_URL);
    expect(home?.priority).toBe(1.0);
  });

  it("ai-casino-match is excluded from sitemap (noindex page should not be in sitemap)", () => {
    const match = sitemapEntries.find((e) => e.url === `${SITE_URL}/ai-casino-match`);
    expect(match).toBeUndefined();
  });

  it("sitemap has no duplicate URLs", () => {
    const urls = sitemapEntries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("GEO Page — Enhanced Structure", () => {
  const SUPPORTED_GEOS = ["de", "fr", "nl", "be", "at", "it", "ch", "ie"] as const;

  it("all GEO pages have required metadata fields", async () => {
    for (const geo of SUPPORTED_GEOS) {
      const page = await import(`@/app/[geo]/page`);
      const metadata = await page.generateMetadata({
        params: Promise.resolve({ geo }),
      });
      expect(metadata.title, `${geo} missing title`).toBeTruthy();
      expect(metadata.description, `${geo} missing description`).toBeTruthy();
      expect(metadata.openGraph?.title, `${geo} missing OG title`).toBeTruthy();
      expect(metadata.twitter?.title, `${geo} missing twitter title`).toBeTruthy();
    }
  });

  it("all GEO pages have correct canonical URLs", async () => {
    for (const geo of SUPPORTED_GEOS) {
      const page = await import(`@/app/[geo]/page`);
      const metadata = await page.generateMetadata({
        params: Promise.resolve({ geo }),
      });
      expect(metadata.alternates?.canonical, `${geo} missing canonical`).toBe(`/${geo}`);
    }
  });

  it("all GEO pages generate static params", async () => {
    const page = await import(`@/app/[geo]/page`);
    const params = page.generateStaticParams();
    expect(params.length).toBe(SUPPORTED_GEOS.length);
    const geoCodes = params.map(p => p.geo);
    for (const geo of SUPPORTED_GEOS) {
      expect(geoCodes).toContain(geo);
    }
  });
});
