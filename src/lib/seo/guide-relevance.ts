import { getAllGuides } from "@/lib/data/guides";

/**
 * Determine which guides are relevant to a casino based on its attributes.
 *
 * Rules:
 * - "online-casino-basics": always relevant (general onboarding guide)
 * - "payment-methods-guide": relevant if casino has payment methods
 * - "casino-bonuses-explained": relevant if casino has bonuses
 * - "casino-licensing-guide": relevant if casino has licenses
 * - "responsible-gambling-tips": always relevant (responsible gambling)
 * - "understanding-wagering-requirements": relevant if casino has bonuses
 *
 * Returns max 3 most relevant guides to avoid link spam.
 */
export function getRelevantGuides(casino: {
  paymentMethods: Array<{ name: string }>;
  bonuses: Array<{ type: string }>;
  licenses: Array<{ issuer: string }>;
}): Array<{ title: string; slug: string; description: string }> {
  const allGuides = getAllGuides();
  const relevant: Array<{ title: string; slug: string; description: string; priority: number }> = [];

  for (const guide of allGuides) {
    let priority = 0;

    switch (guide.slug) {
      case "online-casino-basics":
        // Always relevant — general onboarding
        priority = 1;
        break;
      case "payment-methods-guide":
        // Relevant if casino has payment methods
        if (casino.paymentMethods.length > 0) {
          priority = 2;
        }
        break;
      case "casino-bonuses-explained":
        // Relevant if casino has bonuses
        if (casino.bonuses.length > 0) {
          priority = 2;
        }
        break;
      case "casino-licensing-guide":
        // Relevant if casino has licenses
        if (casino.licenses.length > 0) {
          priority = 2;
        }
        break;
      case "responsible-gambling-tips":
        // Always relevant — responsible gambling is universally important
        priority = 1;
        break;
      case "understanding-wagering-requirements":
        // Relevant if casino has bonuses (wagering context)
        if (casino.bonuses.length > 0) {
          priority = 1;
        }
        break;
    }

    if (priority > 0) {
      relevant.push({
        title: guide.title,
        slug: guide.slug,
        description: guide.description,
        priority,
      });
    }
  }

  // Sort by priority (higher = more relevant), then by slug for determinism
  return relevant
    .sort((a, b) => b.priority - a.priority || a.slug.localeCompare(b.slug))
    .slice(0, 3)
    .map(({ title, slug, description }) => ({ title, slug, description }));
}

export type CasinoForGuide = {
  slug: string;
  name: string;
  tagline?: string;
  rating?: number | null;
};

type CasinoInput = {
  slug: string;
  name: string;
  tagline?: string;
  rating?: number | null;
  paymentMethods: Array<{ name: string }>;
  bonuses: Array<{ type: string }>;
  licenses: Array<{ issuer: string }>;
  trustScore?: number | null;
};

/**
 * Get relevant casinos to show on a guide page.
 *
 * Rules:
 * - "online-casino-basics": top 3 by rating (general onboarding)
 * - "payment-methods-guide": top 3 by payment method count
 * - "casino-bonuses-explained": top 3 by bonus count
 * - "casino-licensing-guide": top 3 by license count
 * - "responsible-gambling-tips": top 3 by responsible gambling features
 * - "understanding-wagering-requirements": top 3 with bonuses (wagering context)
 *
 * Returns max 3 casinos to avoid link spam.
 */
export function getCasinosForGuide(
  guideSlug: string,
  casinos: CasinoInput[]
): CasinoForGuide[] {
  if (casinos.length === 0) return [];

  const pick = (c: CasinoInput): CasinoForGuide => ({
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    rating: c.rating,
  });

  switch (guideSlug) {
    case "online-casino-basics":
      return [...casinos]
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 3)
        .map(pick);

    case "payment-methods-guide":
      return [...casinos]
        .sort((a, b) => b.paymentMethods.length - a.paymentMethods.length)
        .slice(0, 3)
        .map(pick);

    case "casino-bonuses-explained":
      return [...casinos]
        .sort((a, b) => b.bonuses.length - a.bonuses.length)
        .slice(0, 3)
        .map(pick);

    case "casino-licensing-guide":
      return [...casinos]
        .sort((a, b) => b.licenses.length - a.licenses.length)
        .slice(0, 3)
        .map(pick);

    case "responsible-gambling-tips":
      return [...casinos]
        .sort((a, b) => (b.trustScore ?? 0) - (a.trustScore ?? 0))
        .slice(0, 3)
        .map(pick);

    case "understanding-wagering-requirements":
      return [...casinos]
        .filter((c) => c.bonuses.length > 0)
        .sort((a, b) => b.bonuses.length - a.bonuses.length)
        .slice(0, 3)
        .map(pick);

    default:
      return [...casinos]
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 3)
        .map(pick);
  }
}
