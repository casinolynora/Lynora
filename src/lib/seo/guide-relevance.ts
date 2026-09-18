import { getAllGuides, type Guide } from "@/lib/data/guides";

/**
 * Determine which guides are relevant to a casino based on its attributes.
 *
 * Rules:
 * - "online-casino-basics": always relevant (general onboarding guide)
 * - "payment-methods-guide": relevant if casino has payment methods
 * - "casino-bonuses-explained": relevant if casino has bonuses
 *
 * Returns max 2 most relevant guides to avoid link spam.
 */
export function getRelevantGuides(casino: {
  paymentMethods: Array<{ name: string }>;
  bonuses: Array<{ type: string }>;
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
    .slice(0, 2)
    .map(({ title, slug, description }) => ({ title, slug, description }));
}
