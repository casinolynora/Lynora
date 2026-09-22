import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const srcDir = path.resolve(__dirname, "../../../app/casino-reviews/[slug]");
const componentsDir = path.resolve(__dirname, "../../../components/casino/v2");
const seoDir = path.resolve(__dirname, "../../../lib/seo");

function readFile(relPath: string, base: string = srcDir): string {
  return fs.readFileSync(path.join(base, relPath), "utf-8");
}

describe("Phase 30C-S — Casino Profile Enrichment", () => {
  describe("FAQPage schema uses generated FAQs", () => {
    it("profile page imports generateCasinoFAQs", () => {
      const content = readFile("page.tsx");
      expect(content).toContain('import { generateCasinoFAQs } from "@/lib/seo/casino-faq"');
    });

    it("profile page uses generateCasinoFAQs for faqSchema", () => {
      const content = readFile("page.tsx");
      expect(content).toContain("const generatedFAQs = generateCasinoFAQs(casino)");
      expect(content).toContain("generatedFAQs.length > 0");
    });

    it("CasinoFAQ component imports from shared utility", () => {
      const content = readFile("CasinoFAQ.tsx", componentsDir);
      expect(content).toContain('import { generateCasinoFAQs } from "@/lib/seo/casino-faq"');
    });

    it("shared generateCasinoFAQs function exists", () => {
      const content = fs.readFileSync(path.join(seoDir, "casino-faq.ts"), "utf-8");
      expect(content).toContain("export function generateCasinoFAQs");
      expect(content).toContain("casino.licenses.length > 0");
      expect(content).toContain("casino.paymentMethods.length > 0");
      expect(content).toContain("casino.minDeposit != null");
    });
  });

  describe("Review schema conditionally emitted", () => {
    it("reviewSchema is null when rating is null", () => {
      const content = readFile("page.tsx");
      expect(content).toContain('const reviewSchema = casino.rating !== null ?');
    });

    it("reviewSchema rendering is conditional", () => {
      const content = readFile("page.tsx");
      expect(content).toContain("{reviewSchema && (");
    });
  });

  describe("EditorialReview hides empty sections", () => {
    it("score breakdown checks for empty object", () => {
      const content = readFile("EditorialReview.tsx", componentsDir);
      expect(content).toContain("review.scoreBreakdown && Object.keys(review.scoreBreakdown).length > 0");
    });
  });

  describe("TrustSection shows player requirements", () => {
    it("TrustSection includes minAge and kycRequired", () => {
      const content = readFile("TrustSection.tsx", componentsDir);
      expect(content).toContain('"minAge"');
      expect(content).toContain('"kycRequired"');
      expect(content).toContain("Minimum Age");
      expect(content).toContain("KYC Required");
    });
  });

  describe("No fabricated data introduced", () => {
    it("no fake ratings in profile page", () => {
      const content = readFile("page.tsx");
      // Should not hardcode any rating values
      expect(content).not.toMatch(/rating:\s*\d/);
    });

    it("no fake reviews in profile page", () => {
      const content = readFile("page.tsx");
      // Should not contain fabricated aggregate rating data
      expect(content).not.toContain("aggregateRating");
      expect(content).not.toContain("reviewCount");
      // ratingValue is legitimately present in conditional Review schema
      // but should only appear inside the conditional block
      const ratingValueCount = (content.match(/ratingValue/g) || []).length;
      // Should appear exactly once (in the conditional Review schema)
      expect(ratingValueCount).toBeLessThanOrEqual(1);
    });

    it("no AggregateRating schema", () => {
      const content = readFile("page.tsx");
      expect(content).not.toContain("AggregateRating");
    });
  });
});
