import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CONTACT_EMAILS, SITE_URL } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "About — BeInCasinos",
  description:
    "Learn about BeInCasinos' mission, methodology, and commitment to transparent, data-driven casino discovery.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — BeInCasinos",
    description: "BeInCasinos' mission and methodology for transparent casino discovery.",
  },
  twitter: {
    card: "summary",
    title: "About — BeInCasinos",
    description: "BeInCasinos' mission and methodology for transparent casino discovery.",
  },
};

export default function AboutPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: `${SITE_URL}/about`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main id="main-content">
        <Container className="py-12 lg:py-20">
          <div className="max-w-3xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-muted mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground font-medium">About</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold mb-8">
              About BeInCasinos
            </h1>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4">What We Do</h2>
              <p className="text-muted leading-relaxed">
                BeInCasinos is an independent casino comparison and matching
                platform built for European players. Instead of relying on
                editorial opinions or paid placements, we use AI-powered
                analysis over structured, verified data to help you find
                casinos that genuinely fit your preferences — whether that
                means a specific payment method, game catalogue, licence
                jurisdiction, or bonus structure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Our Approach</h2>
              <p className="text-muted leading-relaxed mb-4">
                Every recommendation on BeInCasinos is the output of a
                deterministic scoring algorithm applied to structured data.
                We do not assign ratings by hand, and we do not accept payment
                to alter a score. Our approach rests on three pillars:
              </p>
              <ul className="space-y-3 text-muted leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-brand-600 mt-1">•</span>
                  <span>
                    <strong className="text-foreground">
                      Structured Data:
                    </strong>{" "}
                    Every casino profile is built from machine-readable,
                    versioned data — licence numbers, supported currencies,
                    withdrawal limits, game providers, and more. Nothing is
                    guessed or paraphrased from marketing copy.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-600 mt-1">•</span>
                  <span>
                    <strong className="text-foreground">
                      Transparent Algorithms:
                    </strong>{" "}
                    Our matching engine uses configurable weights and a
                    transparent scoring formula. The full methodology is
                    published on our{" "}
                    <Link
                      href="/methodology"
                      className="text-brand-700 font-medium hover:underline"
                    >
                      methodology page
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-600 mt-1">•</span>
                  <span>
                    <strong className="text-foreground">
                      No Fabricated Content:
                    </strong>{" "}
                    We never publish fake reviews, manufactured testimonials,
                    or unverifiable claims. If we do not have verified data
                    for a field, we say so.
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How We Verify Data</h2>
              <p className="text-muted leading-relaxed">
                Accuracy is the foundation of trust. Our data team sources
                information from official licence registries, casino websites,
                and regulatory bodies. Every data point carries provenance
                metadata — when it was last verified, by what source, and by
                what method. When a casino updates its offering or a licence
                expires, our data reflects that. We publish data-correction
                policies and accept reports from users and operators alike at{" "}
                <a
                  href={`mailto:${CONTACT_EMAILS.data}`}
                  className="text-brand-700 font-medium hover:underline"
                >
                  {CONTACT_EMAILS.data}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Affiliate Relationships</h2>
              <p className="text-muted leading-relaxed">
                BeInCasinos may earn commissions when you click an affiliate
                link and sign up at a casino. This is how we fund operations.
                However, affiliate relationships never influence our scoring,
                data collection, or editorial decisions. A casino does not
                rank higher because it pays a commission. Our scoring is based
                entirely on structured casino data and your stated
                preferences. Full details are available on our{" "}
                <Link
                  href="/affiliate-disclosure"
                  className="text-brand-700 font-medium hover:underline"
                >
                  affiliate disclosure page
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">What We Don't Do</h2>
              <ul className="space-y-3 text-muted leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-brand-600 mt-1">•</span>
                  <span>
                    <strong className="text-foreground">
                      We don't operate casinos.
                    </strong>{" "}
                    We are an independent comparison platform with no ownership
                    or operational stake in any gambling operator.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-600 mt-1">•</span>
                  <span>
                    <strong className="text-foreground">
                      We don't fabricate data.
                    </strong>{" "}
                    Every piece of information on this site is sourced,
                    versioned, and attributable. We do not invent bonuses,
                    game catalogues, or licence details.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-600 mt-1">•</span>
                  <span>
                    <strong className="text-foreground">
                      We don't sell user data.
                    </strong>{" "}
                    Your preferences and browsing behaviour on this site are
                    not sold to third parties.
                  </span>
                </li>
              </ul>
            </section>

            <section className="card-static p-6">
              <p className="text-sm text-muted">
                For questions, feedback, or partnership inquiries, contact us
                at{" "}
                <a
                  href={`mailto:${CONTACT_EMAILS.general}`}
                  className="text-brand-700 font-medium hover:underline"
                >
                  {CONTACT_EMAILS.general}
                </a>
                . You can also read more about our{" "}
                <Link
                  href="/methodology"
                  className="text-brand-700 font-medium hover:underline"
                >
                  methodology
                </Link>
                ,{" "}
                <Link
                  href="/responsible-gambling"
                  className="text-brand-700 font-medium hover:underline"
                >
                  responsible gambling resources
                </Link>
                , and{" "}
                <Link
                  href="/affiliate-disclosure"
                  className="text-brand-700 font-medium hover:underline"
                >
                  affiliate disclosure
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
    </>
  );
}
