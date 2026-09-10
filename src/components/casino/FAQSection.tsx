import { FAQPageSchema } from "@/components/seo/FAQPageSchema";

type FAQItem = { question: string; answer: string };

type FAQSectionProps = {
  faqs: FAQItem[];
  title?: string;
  className?: string;
};

export function FAQSection({ faqs, title = "Frequently Asked Questions", className }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={className}>
      <FAQPageSchema faqs={faqs} />
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
        {title}
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="card-static overflow-hidden group"
          >
            <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-semibold text-foreground hover:bg-surface-hover transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
              {faq.question}
              <svg
                className="w-4 h-4 text-text-faint transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-5 text-sm text-muted leading-relaxed border-t border-border-subtle pt-4">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
