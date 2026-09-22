import { describe, it, expect } from "vitest";
import {
  buildBreadcrumbs,
  getRelevantPaymentLinks,
  getRelevantGeoLinks,
  getRelevantGuideLinks,
  limitLinks,
  paymentSlug,
  PUBLIC_ROUTES,
  PUBLIC_GEOS,
  MAX_LINKS_PER_SECTION,
} from "@/lib/seo/internal-links";

describe("Internal Linking Engine", () => {
  describe("buildBreadcrumbs", () => {
    it("returns Home for root path", () => {
      const crumbs = buildBreadcrumbs("/");
      expect(crumbs).toEqual([{ label: "Home", href: "/" }]);
    });

    it("builds breadcrumbs for /casinos", () => {
      const crumbs = buildBreadcrumbs("/casinos");
      expect(crumbs).toEqual([
        { label: "Home", href: "/" },
        { label: "Casinos" },
      ]);
    });

    it("builds breadcrumbs for /payments", () => {
      const crumbs = buildBreadcrumbs("/payments");
      expect(crumbs).toEqual([
        { label: "Home", href: "/" },
        { label: "Payments" },
      ]);
    });

    it("builds breadcrumbs for /de (GEO page)", () => {
      const crumbs = buildBreadcrumbs("/de");
      expect(crumbs).toEqual([
        { label: "Home", href: "/" },
        { label: "Germany" },
      ]);
    });

    it("builds breadcrumbs for /casino-reviews/some-casino", () => {
      const crumbs = buildBreadcrumbs("/casino-reviews/some-casino");
      expect(crumbs).toEqual([
        { label: "Home", href: "/" },
        { label: "Casinos", href: "/casinos" },
      ]);
    });

    it("builds breadcrumbs for /guides/some-guide", () => {
      const crumbs = buildBreadcrumbs("/guides/payment-methods-guide");
      expect(crumbs).toEqual([
        { label: "Home", href: "/" },
        { label: "Guides", href: "/guides" },
      ]);
    });

    it("builds breadcrumbs for nested /for-casinos/pricing", () => {
      const crumbs = buildBreadcrumbs("/for-casinos/pricing");
      expect(crumbs).toEqual([
        { label: "Home", href: "/" },
        { label: "For Operators", href: "/for-casinos" },
        { label: "Pricing" },
      ]);
    });
  });

  describe("getRelevantPaymentLinks", () => {
    it("returns payment method slugs", () => {
      const links = getRelevantPaymentLinks([
        { name: "PayPal" },
        { name: "Skrill" },
      ]);
      expect(links).toEqual([
        { name: "PayPal", slug: "paypal" },
        { name: "Skrill", slug: "skrill" },
      ]);
    });

    it("limits to maxLinks", () => {
      const links = getRelevantPaymentLinks(
        [
          { name: "PayPal" },
          { name: "Skrill" },
          { name: "Neteller" },
          { name: "Visa" },
        ],
        2
      );
      expect(links).toHaveLength(2);
    });

    it("returns empty for no payment methods", () => {
      const links = getRelevantPaymentLinks([]);
      expect(links).toEqual([]);
    });
  });

  describe("getRelevantGeoLinks", () => {
    it("returns matching GEO pages", () => {
      const links = getRelevantGeoLinks(["DE", "NL"]);
      expect(links).toEqual([
        { code: "de", name: "Germany", flag: "🇩🇪" },
        { code: "nl", name: "Netherlands", flag: "🇳🇱" },
      ]);
    });

    it("filters out unmatched GEOs", () => {
      const links = getRelevantGeoLinks(["DE", "XX"]);
      expect(links).toHaveLength(1);
      expect(links[0].code).toBe("de");
    });

    it("handles case insensitivity", () => {
      const links = getRelevantGeoLinks(["de"]);
      expect(links).toHaveLength(1);
      expect(links[0].code).toBe("de");
    });

    it("returns empty for no countries", () => {
      const links = getRelevantGeoLinks([]);
      expect(links).toEqual([]);
    });
  });

  describe("getRelevantGuideLinks", () => {
    it("returns always-relevant guides", () => {
      const links = getRelevantGuideLinks({
        paymentMethods: [],
        bonuses: [],
        licenses: [],
      });
      const slugs = links.map((l) => l.slug);
      expect(slugs).toContain("online-casino-basics");
      expect(slugs).toContain("responsible-gambling-tips");
    });

    it("adds payment guide when casino has payment methods", () => {
      const links = getRelevantGuideLinks({
        paymentMethods: [{ name: "PayPal" }],
        bonuses: [],
        licenses: [],
      });
      const slugs = links.map((l) => l.slug);
      expect(slugs).toContain("payment-methods-guide");
    });

    it("adds bonus guides when casino has bonuses", () => {
      const links = getRelevantGuideLinks(
        {
          paymentMethods: [],
          bonuses: [{ type: "welcome" }],
          licenses: [],
        },
        6
      );
      const slugs = links.map((l) => l.slug);
      expect(slugs).toContain("casino-bonuses-explained");
      expect(slugs).toContain("understanding-wagering-requirements");
    });

    it("adds licensing guide when casino has licenses", () => {
      const links = getRelevantGuideLinks({
        paymentMethods: [],
        bonuses: [],
        licenses: [{ issuer: "MGA" }],
      });
      const slugs = links.map((l) => l.slug);
      expect(slugs).toContain("casino-licensing-guide");
    });

    it("respects maxLinks limit", () => {
      const links = getRelevantGuideLinks(
        {
          paymentMethods: [{ name: "PayPal" }],
          bonuses: [{ type: "welcome" }],
          licenses: [{ issuer: "MGA" }],
        },
        2
      );
      expect(links).toHaveLength(2);
    });
  });

  describe("limitLinks", () => {
    it("truncates to max", () => {
      const links = [1, 2, 3, 4, 5];
      expect(limitLinks(links, 3)).toEqual([1, 2, 3]);
    });

    it("returns all if under limit", () => {
      const links = [1, 2];
      expect(limitLinks(links, 5)).toEqual([1, 2]);
    });

    it("uses default MAX_LINKS_PER_SECTION", () => {
      const links = Array.from({ length: 100 }, (_, i) => i);
      expect(limitLinks(links)).toHaveLength(MAX_LINKS_PER_SECTION);
    });
  });

  describe("paymentSlug", () => {
    it("converts simple names", () => {
      expect(paymentSlug("PayPal")).toBe("paypal");
    });

    it("handles special characters", () => {
      expect(paymentSlug("SOFORT/Klarna")).toBe("sofort-klarna");
    });

    it("handles spaces", () => {
      expect(paymentSlug("Bank Transfer")).toBe("bank-transfer");
    });

    it("removes leading/trailing hyphens", () => {
      expect(paymentSlug("--test--")).toBe("test");
    });
  });

  describe("PUBLIC_ROUTES", () => {
    it("includes all required top-level pages", () => {
      const paths = PUBLIC_ROUTES.map((r) => r.path);
      expect(paths).toContain("/");
      expect(paths).toContain("/casinos");
      expect(paths).toContain("/compare");
      expect(paths).toContain("/payments");
      expect(paths).toContain("/guides");
      expect(paths).toContain("/methodology");
      expect(paths).toContain("/about");
      expect(paths).toContain("/responsible-gambling");
    });

    it("includes all 12 GEO pages", () => {
      const paths = PUBLIC_ROUTES.map((r) => r.path);
      for (const geo of PUBLIC_GEOS) {
        expect(paths).toContain(`/${geo.code}`);
      }
    });
  });
});
