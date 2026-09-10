import { FAQPageSchema } from "@/components/seo/FAQPageSchema";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  faqs: FAQItem[];
  title?: string;
  className?: string;
};

export function FAQSection({ faqs, title = "Frequently Asked Questions", className = "" }: FAQSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group border border-border rounded-lg">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium hover:bg-surface-elevated transition-colors">
              {faq.question}
              <svg className="w-5 h-5 text-muted group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 pb-4 text-muted text-sm leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
      <FAQPageSchema faqs={faqs} />
    </section>
  );
}
