import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const appDir = path.resolve(process.cwd(), "src/app");

describe("Phase 30C-Q — GEO Shadowing Fix", () => {
  describe("Static page files removed", () => {
    it("src/app/de/page.tsx no longer exists (was shadowing [geo])", () => {
      const dePagePath = path.join(appDir, "de/page.tsx");
      expect(fs.existsSync(dePagePath)).toBe(false);
    });

    it("src/app/ie/page.tsx no longer exists (was shadowing [geo])", () => {
      const iePagePath = path.join(appDir, "ie/page.tsx");
      expect(fs.existsSync(iePagePath)).toBe(false);
    });

    it("src/app/de/layout.tsx still exists (navigation wrapper)", () => {
      const deLayoutPath = path.join(appDir, "de/layout.tsx");
      expect(fs.existsSync(deLayoutPath)).toBe(true);
    });
  });

  describe("Dynamic [geo] route handles /de and /ie", () => {
    it("[geo]/page.tsx exists as the authoritative GEO page", () => {
      const geoPagePath = path.join(appDir, "[geo]/page.tsx");
      expect(fs.existsSync(geoPagePath)).toBe(true);
    });

    it("generateStaticParams includes de and ie", { timeout: 15000 }, async () => {
      const { generateStaticParams } = await import("@/app/[geo]/page");
      const params = generateStaticParams();
      const geos = params.map((p) => p.geo);
      expect(geos).toContain("de");
      expect(geos).toContain("ie");
    });

    it("generateStaticParams returns all 12 GEOs", { timeout: 15000 }, async () => {
      const { generateStaticParams } = await import("@/app/[geo]/page");
      const params = generateStaticParams();
      expect(params).toHaveLength(12);
    });
  });

  describe("/de metadata is German", () => {
    it("generateMetadata returns German title for de", { timeout: 15000 }, async () => {
      const { generateMetadata } = await import("@/app/[geo]/page");
      const metadata = await generateMetadata({
        params: Promise.resolve({ geo: "de" }),
      });
      expect(metadata.title).toContain("Deutschland");
      expect(metadata.title).toContain("BeInCasinos");
    });

    it("generateMetadata returns German description for de", { timeout: 15000 }, async () => {
      const { generateMetadata } = await import("@/app/[geo]/page");
      const metadata = await generateMetadata({
        params: Promise.resolve({ geo: "de" }),
      });
      expect(metadata.description).toContain("GGL");
      expect(metadata.description).toContain("deutsche Spieler");
    });

    it("generateMetadata returns correct canonical for de", { timeout: 15000 }, async () => {
      const { generateMetadata } = await import("@/app/[geo]/page");
      const metadata = await generateMetadata({
        params: Promise.resolve({ geo: "de" }),
      });
      expect(metadata.alternates?.canonical).toBe("/de");
    });

    it("generateMetadata returns German OG title for de", { timeout: 15000 }, async () => {
      const { generateMetadata } = await import("@/app/[geo]/page");
      const metadata = await generateMetadata({
        params: Promise.resolve({ geo: "de" }),
      });
      expect(metadata.openGraph?.title).toContain("Deutschland");
    });
  });

  describe("/ie metadata is English", () => {
    it("generateMetadata returns English title for ie", { timeout: 15000 }, async () => {
      const { generateMetadata } = await import("@/app/[geo]/page");
      const metadata = await generateMetadata({
        params: Promise.resolve({ geo: "ie" }),
      });
      expect(metadata.title).toContain("Ireland");
      expect(metadata.title).toContain("BeInCasinos");
    });

    it("generateMetadata returns correct canonical for ie", { timeout: 15000 }, async () => {
      const { generateMetadata } = await import("@/app/[geo]/page");
      const metadata = await generateMetadata({
        params: Promise.resolve({ geo: "ie" }),
      });
      expect(metadata.alternates?.canonical).toBe("/ie");
    });
  });

  describe("Other GEO routes unaffected", () => {
    it("generateMetadata still works for nl", { timeout: 15000 }, async () => {
      const { generateMetadata } = await import("@/app/[geo]/page");
      const metadata = await generateMetadata({
        params: Promise.resolve({ geo: "nl" }),
      });
      expect(metadata.title).toContain("Netherlands");
      expect(metadata.alternates?.canonical).toBe("/nl");
    });

    it("generateMetadata still works for fr", { timeout: 15000 }, async () => {
      const { generateMetadata } = await import("@/app/[geo]/page");
      const metadata = await generateMetadata({
        params: Promise.resolve({ geo: "fr" }),
      });
      expect(metadata.title).toContain("France");
      expect(metadata.alternates?.canonical).toBe("/fr");
    });
  });

  describe("No duplicate route implementations", () => {
    it("only one page.tsx for /de route (the dynamic [geo])", () => {
      const deStaticPage = path.join(appDir, "de/page.tsx");
      const geoPage = path.join(appDir, "[geo]/page.tsx");
      expect(fs.existsSync(deStaticPage)).toBe(false);
      expect(fs.existsSync(geoPage)).toBe(true);
    });

    it("only one page.tsx for /ie route (the dynamic [geo])", () => {
      const ieStaticPage = path.join(appDir, "ie/page.tsx");
      const geoPage = path.join(appDir, "[geo]/page.tsx");
      expect(fs.existsSync(ieStaticPage)).toBe(false);
      expect(fs.existsSync(geoPage)).toBe(true);
    });
  });
});
