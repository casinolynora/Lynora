import { MetadataRoute } from "next";
import { casinoDb } from "@/lib/data/accessor";
import { getAllGuides } from "@/lib/data/guides";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casinolynora.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const casinos = casinoDb.getAllCasinos();
  const guides = getAllGuides();
  const buildDate = new Date().toISOString().split("T")[0];

  const staticPages = [
    { url: BASE_URL, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/casinos`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/ai-casino-match`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/methodology`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/responsible-gambling`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/guides`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/affiliate-disclosure`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.3 },
    // Germany pages
    { url: `${BASE_URL}/de`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/de/casinos`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/de/best-casinos`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/de/guides`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/de/compare`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.7 },
    // Netherlands pages
    { url: `${BASE_URL}/nl`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.9 },
    // Belgium pages
    { url: `${BASE_URL}/be`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.9 },
    // France page (regulatory notice)
    { url: `${BASE_URL}/fr`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const casinoPages = casinos.map((casino) => ({
    url: `${BASE_URL}/casino-reviews/${casino.slug}`,
    lastModified: casino.lastVerifiedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const guidePages = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: guide.lastUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const deCasinoPages = casinos
    .filter(c => c.countries.includes("DE"))
    .map((casino) => ({
      url: `${BASE_URL}/de/casino-reviews/${casino.slug}`,
      lastModified: casino.lastVerifiedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const nlCasinoPages = casinos
    .filter(c => c.countries.includes("NL"))
    .map((casino) => ({
      url: `${BASE_URL}/nl/casino-reviews/${casino.slug}`,
      lastModified: casino.lastVerifiedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const beCasinoPages = casinos
    .filter(c => c.countries.includes("BE"))
    .map((casino) => ({
      url: `${BASE_URL}/be/casino-reviews/${casino.slug}`,
      lastModified: casino.lastVerifiedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const deGuidePages = guides.map((guide) => ({
    url: `${BASE_URL}/de/guides/${guide.slug}`,
    lastModified: guide.lastUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...casinoPages, ...guidePages, ...deCasinoPages, ...nlCasinoPages, ...beCasinoPages, ...deGuidePages];
}
