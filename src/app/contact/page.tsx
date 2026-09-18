import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CONTACT_EMAILS } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contact — BeInCasinos",
  description:
    "Get in touch with the BeInCasinos team for general inquiries, partnership opportunities, or data correction reports.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — BeInCasinos",
    description: "Get in touch with the BeInCasinos team.",
  },
  twitter: {
    card: "summary",
    title: "Contact — BeInCasinos",
    description: "Get in touch with the BeInCasinos team.",
  },
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Contact</h1>
          <p className="text-lg text-muted mb-4">
            We welcome inquiries about our data, methodology, and partnership
            opportunities. Choose the address that best matches your question
            so we can route it to the right person.
          </p>

          <p className="text-sm text-muted mb-10">
            We aim to respond within <strong>5 business days</strong>.
            Response times may be longer during periods of high volume.
          </p>

          <div className="space-y-4">
            {[
              {
                label: "General Inquiries",
                email: CONTACT_EMAILS.general,
                description:
                  "General questions, feedback, and anything that doesn't fit below.",
              },
              {
                label: "Affiliate Partnerships",
                email: CONTACT_EMAILS.affiliates,
                description:
                  "Partnership proposals, affiliate programme questions, and commercial inquiries.",
              },
              {
                label: "Data Corrections",
                email: CONTACT_EMAILS.data,
                description:
                  "Report incorrect or outdated casino data, licence information, or bonus details.",
              },
              {
                label: "Responsible Gambling Support",
                email: CONTACT_EMAILS.support,
                description:
                  "Gambling-related support inquiries and responsible gambling resources.",
              },
            ].map((item) => (
              <a
                key={item.email}
                href={`mailto:${item.email}`}
                className="card-static p-5 flex items-center justify-between hover:border-brand-200 transition-colors group"
              >
                <div>
                  <h3 className="font-bold text-sm group-hover:text-brand-700 transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-xs text-muted">{item.description}</p>
                </div>
                <span className="text-sm text-brand-700 font-medium">
                  {item.email}
                </span>
              </a>
            ))}
          </div>

          <div className="mt-10 space-y-6">
            <section className="card-static p-6">
              <h2 className="font-bold text-sm mb-2">
                We Cannot Provide
              </h2>
              <ul className="text-sm text-muted space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5">•</span>
                  <span>
                    Gambling advice or recommendations on how to bet or spend
                    money at casinos.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5">•</span>
                  <span>
                    Customer support for casino accounts, deposits,
                    withdrawals, or technical issues. Please contact the
                    casino directly for these matters.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5">•</span>
                  <span>
                    Legal or financial advice related to gambling.
                  </span>
                </li>
              </ul>
            </section>

            <p className="text-sm text-muted">
              If you or someone you know is struggling with gambling, visit our{" "}
              <a
                href="/responsible-gambling"
                className="text-brand-700 font-medium hover:underline"
              >
                responsible gambling page
              </a>{" "}
              for support resources and self-exclusion options.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
