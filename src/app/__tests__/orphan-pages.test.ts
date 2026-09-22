import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Orphan Page Detection Tests
 *
 * Scans the codebase to ensure every public route has at least one
 * inbound internal link from another page. Pages with zero inbound
 * links are orphans — they cannot be discovered by crawlers or users.
 *
 * NOTE: These tests scan source files for href patterns, not rendered HTML.
 * They catch the most common orphans: routes not referenced anywhere in src/app/.
 */

type RouteInfo = {
  path: string;
  label: string;
};

const PUBLIC_ROUTES: RouteInfo[] = [
  { path: "/", label: "Home" },
  { path: "/casinos", label: "All Casinos" },
  { path: "/compare", label: "Compare Casinos" },
  { path: "/ai-casino-match", label: "AI Matchmaker" },
  { path: "/guides", label: "Guides" },
  { path: "/payments", label: "Payment Methods" },
  { path: "/methodology", label: "Our Methodology" },
  { path: "/about", label: "About Us" },
  { path: "/responsible-gambling", label: "Responsible Gambling" },
  { path: "/contact", label: "Contact" },
  { path: "/affiliate-disclosure", label: "Affiliate Disclosure" },
  { path: "/privacy-policy", label: "Privacy Policy" },
  { path: "/terms", label: "Terms of Use" },
  { path: "/de", label: "Germany" },
  { path: "/fr", label: "France" },
  { path: "/nl", label: "Netherlands" },
  { path: "/be", label: "Belgium" },
  { path: "/at", label: "Austria" },
  { path: "/it", label: "Italy" },
  { path: "/ch", label: "Switzerland" },
  { path: "/ie", label: "Ireland" },
  { path: "/gb", label: "Great Britain" },
  { path: "/se", label: "Sweden" },
  { path: "/fi", label: "Finland" },
  { path: "/no", label: "Norway" },
];

/**
 * Scan all .tsx/.ts files in src/ for href references to a given path.
 * Returns true if the path is referenced at least once.
 */
function findInboundLinks(path: string): string[] {
  const srcDir = resolve(__dirname, "../../..");
  const files: string[] = [];

  function walkDir(dir: string) {
    const entries = require("fs").readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== "__tests__" && entry.name !== ".next") {
        walkDir(fullPath);
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) &&
        !entry.name.endsWith(".test.ts") &&
        !entry.name.endsWith(".test.tsx") &&
        !entry.name.endsWith(".d.ts")
      ) {
        files.push(fullPath);
      }
    }
  }

  walkDir(srcDir);

  const inboundFiles: string[] = [];
  for (const file of files) {
    try {
      const content = require("fs").readFileSync(file, "utf-8");
      // Match href="/path" or href={`/path`} or href={`\${...}/path`}
      const patterns = [
        new RegExp(`href=["']${escapeRegex(path)}["']`),
        new RegExp(`href=\{[\`"'].*${escapeRegex(path)}[\`"']\}`),
        new RegExp(`href=["']${escapeRegex(path)}\\/`),
        new RegExp(`href=\{[\`"'].*${escapeRegex(path)}\\/`),
        // Also match path used in buildComparisonUrl, buildPaymentEntityMap, etc.
        new RegExp(`["']${escapeRegex(path)}["']`),
      ];

      for (const pattern of patterns) {
        if (pattern.test(content)) {
          inboundFiles.push(file.replace(srcDir + "\\", "").replace(srcDir + "/", ""));
          break;
        }
      }
    } catch {
      // Skip unreadable files
    }
  }

  return inboundFiles;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

describe("Orphan Page Detection", () => {
  for (const route of PUBLIC_ROUTES) {
    it(`Route "${route.path}" (${route.label}) has at least one inbound link`, () => {
      const inboundFiles = findInboundLinks(route.path);
      expect(
        inboundFiles.length,
        `Route "${route.path}" is an orphan — no inbound links found in codebase. ` +
          `Add at least one link from another page.`
      ).toBeGreaterThan(0);
    });
  }
});

describe("Link Count Safety", () => {
  it("No page exceeds 50 internal links in source", () => {
    const srcDir = resolve(__dirname, "../../..");
    const files: string[] = [];

    function walkDir(dir: string) {
      const entries = require("fs").readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = resolve(dir, entry.name);
        if (entry.isDirectory() && !["node_modules", "__tests__", ".next"].includes(entry.name)) {
          walkDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
          files.push(fullPath);
        }
      }
    }

    walkDir(srcDir);

    const violations: Array<{ file: string; count: number }> = [];
    for (const file of files) {
      try {
        const content = require("fs").readFileSync(file, "utf-8");
        const linkCount = (content.match(/href=/g) || []).length;
        if (linkCount > 50) {
          violations.push({
            file: file.replace(srcDir + "\\", "").replace(srcDir + "/", ""),
            count: linkCount,
          });
        }
      } catch {
        // Skip
      }
    }

    expect(
      violations,
      `Files with >50 internal links: ${violations.map((v) => `${v.file} (${v.count})`).join(", ")}`
    ).toHaveLength(0);
  });
});
