import { MetadataRoute } from "next";
import { casinoDb } from "@/lib/data/accessor";
import { getAllGuides } from "@/lib/data/guides";
import { SITE_URL } from "@/lib/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const casinos = casinoDb.getAllCasinos();
  const guides = getAllGuides();
  const buildDate = new Date().toISOString().split("T")[0];

  const staticPages = [
    { url: SITE_URL, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${SITE_URL}/casinos`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/ai-casino-match`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/compare`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/methodology`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/responsible-gambling`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${SITE_URL}/guides`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${SITE_URL}/affiliate-disclosure`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.3 },
    // B2B pages
    { url: `${SITE_URL}/for-casinos`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${SITE_URL}/for-casinos/pricing`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/for-casinos/list-your-casino`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/for-casinos/contact`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.3 },
    // GEO hub pages
    { url: `${SITE_URL}/de`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/fr`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/nl`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/be`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/at`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/it`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/ch`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/ie`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.9 },
    // Germany sub-pages
    { url: `${SITE_URL}/de/casinos`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/de/best-casinos`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/de/compare`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/de/guides`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const casinoPages = casinos.map((casino) => ({
    url: `${SITE_URL}/casino-reviews/${casino.slug}`,
    lastModified: casino.lastVerifiedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const guidePages = guides.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: guide.lastUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const deCasinoPages = casinos
    .filter(c => c.countries.includes("DE"))
    .map((casino) => ({
      url: `${SITE_URL}/de/casino-reviews/${casino.slug}`,
      lastModified: casino.lastVerifiedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const deGuidePages = guides.map((guide) => ({
    url: `${SITE_URL}/de/guides/${guide.slug}`,
    lastModified: guide.lastUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...casinoPages, ...guidePages, ...deCasinoPages, ...deGuidePages];
}
