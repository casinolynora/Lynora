import type { Casino } from "@/lib/types";

type CasinoForFAQ = Pick<Casino, "name" | "review" | "licenses" | "paymentMethods" | "minDeposit" | "hasMobile" | "games" | "countries">;

/**
 * Generate FAQ items from actual casino data.
 * Only generates questions supported by real data.
 * Shared between the CasinoFAQ component and the FAQPage JSON-LD schema.
 */
export function generateCasinoFAQs(casino: CasinoForFAQ): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];

  // License question
  if (casino.licenses.length > 0) {
    const primaryLicense = casino.licenses[0];
    faqs.push({
      question: `Is ${casino.name} licensed?`,
      answer: `Yes, ${casino.name} holds a license from ${primaryLicense.issuer} (${primaryLicense.jurisdiction}).${primaryLicense.licenseNumber ? ` License number: ${primaryLicense.licenseNumber}.` : ""}`,
    });
  }

  // Payment methods question
  if (casino.paymentMethods.length > 0) {
    const methodNames = casino.paymentMethods.map((pm) => pm.name).join(", ");
    faqs.push({
      question: `What payment methods does ${casino.name} accept?`,
      answer: `${casino.name} accepts the following payment methods: ${methodNames}.`,
    });
  }

  // Minimum deposit question
  if (casino.minDeposit != null) {
    faqs.push({
      question: `What is the minimum deposit at ${casino.name}?`,
      answer: `The minimum deposit at ${casino.name} is €${casino.minDeposit}.`,
    });
  }

  // Mobile question
  if (casino.hasMobile) {
    faqs.push({
      question: `Does ${casino.name} support mobile?`,
      answer: `Yes, ${casino.name} supports mobile play. You can access it from your mobile browser.`,
    });
  }

  // Games question
  const availableGames = casino.games.filter((g) => g.available);
  if (availableGames.length > 0) {
    const gameNames = availableGames.map((g) => g.name).join(", ");
    faqs.push({
      question: `What games are available at ${casino.name}?`,
      answer: `${casino.name} offers the following game categories: ${gameNames}.`,
    });
  }

  // GEO question
  if (casino.countries.length > 0) {
    faqs.push({
      question: `Which countries does ${casino.name} support?`,
      answer: `${casino.name} is available in: ${casino.countries.join(", ")}.`,
    });
  }

  // Merge with any existing FAQ items from the database
  const existingFAQs = casino.review.faq ?? [];
  return [...faqs, ...existingFAQs];
}
