import { FAQSection } from "@/components/casino/FAQSection";
import { generateCasinoFAQs } from "@/lib/seo/casino-faq";
import type { Casino } from "@/lib/types";

type CasinoFAQProps = {
  casino: Pick<Casino, "name" | "review" | "licenses" | "paymentMethods" | "minDeposit" | "hasMobile" | "games" | "countries">;
  className?: string;
};

export function CasinoFAQ({ casino, className }: CasinoFAQProps) {
  const faqs = generateCasinoFAQs(casino);

  if (faqs.length === 0) return null;

  return <FAQSection faqs={faqs} title={`${casino.name} — Frequently Asked Questions`} className={className} />;
}
