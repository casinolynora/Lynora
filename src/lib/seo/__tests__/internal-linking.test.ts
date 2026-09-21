import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const srcDir = path.resolve(__dirname, "../../../app");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(srcDir, relPath), "utf-8");
}

describe("Phase 30C-R — Internal Linking Cleanup", () => {
  describe("Dead-end pages have outbound internal links", () => {
    it("/responsible-gambling has Link import and body links", () => {
      const content = readFile("responsible-gambling/page.tsx");
      expect(content).toContain('import Link from "next/link"');
      expect(content).toContain('href="/guides/responsible-gambling-tips"');
    });

    it("/methodology has links to /compare, /casinos, and /guides", () => {
      const content = readFile("methodology/page.tsx");
      expect(content).toContain('href="/compare"');
      expect(content).toContain('href="/casinos"');
      expect(content).toContain('href="/guides/casino-licensing-guide"');
    });

    it("/affiliate-disclosure has Link import and body links", () => {
      const content = readFile("affiliate-disclosure/page.tsx");
      expect(content).toContain('import Link from "next/link"');
      expect(content).toContain('href="/about"');
      expect(content).toContain('href="/methodology"');
    });

    it("/contact has Link import and uses Link for internal links", () => {
      const content = readFile("contact/page.tsx");
      expect(content).toContain('import Link from "next/link"');
      expect(content).toContain('href="/responsible-gambling"');
      expect(content).not.toMatch(/<a\s+href="\/responsible-gambling"/);
    });
  });

  describe("Homepage has /payments link", () => {
    it("homepage includes link to /payments", () => {
      const content = readFile("page.tsx");
      expect(content).toContain('href="/payments"');
    });
  });

  describe("No raw <a> tags for internal navigation", () => {
    it("/about uses <Link> for internal navigation", () => {
      const content = readFile("about/page.tsx");
      const mailtoCount = (content.match(/<a\s+href="mailto:/g) || []).length;
      const linkCount = (content.match(/<Link\s+href="/g) || []).length;
      expect(linkCount).toBeGreaterThanOrEqual(5);
      // All internal <a> href should now be <Link>
      const internalAnchors = content.match(/<a\s+href="(?!mailto:)[^"]+"/g) || [];
      expect(internalAnchors.length).toBe(0);
    });
  });
});
