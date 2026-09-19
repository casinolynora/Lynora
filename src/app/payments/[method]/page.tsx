import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SITE_URL } from "@/lib/config/site";
import { getFullDatasetCasinos } from "@/lib/seo/payment-data";
import {
  buildPaymentEntityMap,
  getPaymentToCasinos,
  getPaymentToGuides,
  assessPageEligibility,
  type PaymentEntity,
} from "@/lib/seo/payment-entities";

type Props = {
  params: Promise<{ method: string }>;
};

export function generateStaticParams() {
  const casinos = getFullDatasetCasinos();
  const entityMap = buildPaymentEntityMap(casinos);
  const params: { method: string }[] = [];
  for (const [, entity] of entityMap) {
    const result = assessPageEligibility(entity);
    if (result.eligible) {
      params.push({ method: entity.slug });
    }
  }
  return params;
}

function getEntity(method: string): PaymentEntity | null {
  const casinos = getFullDatasetCasinos();
  const entityMap = buildPaymentEntityMap(casinos);
  // Try exact slug match first, then try by canonical name
  for (const [, entity] of entityMap) {
    if (entity.slug === method) return entity;
  }
  // Try case-insensitive
  const lower = method.toLowerCase();
  for (const [, entity] of entityMap) {
    if (entity.slug.toLowerCase() === lower) return entity;
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { method } = await params;
  const entity = getEntity(method);
  if (!entity) return { title: "Payment Method Not Found" };

  const title = `${entity.canonicalName} Casinos: Deposits, Withdrawals & Supported Casinos | BeInCasinos`;
  const description = `Find verified online casinos that accept ${entity.canonicalName}. Compare ${entity.casinoCount}+ casinos with ${entity.canonicalName} deposits and withdrawals across ${entity.geoCount} European markets.`;

  return {
    title,
    description,
    alternates: { canonical: `/payments/${entity.slug}` },
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export default async function PaymentDetailPage({ params }: Props) {
  const { method } = await params;
  const entity = getEntity(method);
  if (!entity) notFound();

  const casinos = getFullDatasetCasinos();
  const entityMap = buildPaymentEntityMap(casinos);
  const supportingCasinos = getPaymentToCasinos(entityMap, entity.canonicalName, casinos);
  const relatedGuides = getPaymentToGuides(entity.type);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Payment Methods", item: `${SITE_URL}/payments` },
      { "@type": "ListItem", position: 3, name: entity.canonicalName, item: `${SITE_URL}/payments/${entity.slug}` },
    ],
  };

  const faqItems = [
    {
      question: `What is ${entity.canonicalName}?`,
      answer: `${entity.canonicalName} is a ${entity.type} payment method accepted at ${entity.casinoCount} verified online casinos across ${entity.geoCount} European markets.`,
    },
    {
      question: `Can I use ${entity.canonicalName} to deposit at online casinos?`,
      answer: `Yes. ${entity.canonicalName} is accepted as a deposit method at ${entity.casinoCount} verified casinos on BeInCasinos. Availability may vary by casino and jurisdiction.`,
    },
    {
      question: `Can I withdraw with ${entity.canonicalName}?`,
      answer: entity.hasWithdrawals
        ? `${entity.canonicalName} supports withdrawals at some verified casinos. Check individual casino profiles for specific withdrawal availability.`
        : `Withdrawal availability for ${entity.canonicalName} varies by casino. Check individual casino profiles for details.`,
    },
    {
      question: `Is ${entity.canonicalName} safe for casino deposits?`,
      answer: `${entity.canonicalName} is a established ${entity.type} payment method. All casinos listed on BeInCasinos are independently verified and licensed. Always gamble responsibly.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const TYPE_LABELS: Record<string, string> = {
    "e-wallet": "E-Wallet",
    "card": "Card",
    "bank-transfer": "Bank Transfer",
    "crypto": "Cryptocurrency",
    "prepaid": "Prepaid",
    "mobile": "Mobile Payment",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/payments" className="hover:text-primary transition-colors">Payment Methods</Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground font-medium">{entity.canonicalName}</span>
          </nav>

          {/* Hero */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {entity.canonicalName} Casino Deposits &amp; Withdrawals
          </h1>
          <p className="text-lg text-muted mb-6">
            Find verified online casinos that accept {entity.canonicalName}.
            Availability varies by casino and jurisdiction.
          </p>

          {/* Quick Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            <div className="bg-surface-elevated rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted mb-1">Type</p>
              <p className="font-semibold text-foreground text-sm">{TYPE_LABELS[entity.type] ?? entity.type}</p>
            </div>
            <div className="bg-surface-elevated rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted mb-1">Casinos</p>
              <p className="font-semibold text-foreground text-sm">{entity.casinoCount}</p>
            </div>
            <div className="bg-surface-elevated rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted mb-1">Markets</p>
              <p className="font-semibold text-foreground text-sm">{entity.geoCount}</p>
            </div>
            <div className="bg-surface-elevated rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted mb-1">Records</p>
              <p className="font-semibold text-foreground text-sm">{entity.totalRecords}</p>
            </div>
          </div>

          {/* GEO Coverage */}
          {entity.geos.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-3">GEO Coverage</h2>
              <div className="flex flex-wrap gap-2">
                {entity.geos.map((geo) => (
                  <Link
                    key={geo}
                    href={`/${geo.toLowerCase()}`}
                    className="text-xs bg-surface-elevated text-muted px-3 py-1 rounded-full border border-border hover:border-primary/30 transition-colors"
                  >
                    {geo}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Casinos Supporting This Payment */}
          {supportingCasinos.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">
                Casinos Accepting {entity.canonicalName} ({supportingCasinos.length})
              </h2>
              <div className="space-y-3">
                {supportingCasinos.slice(0, 20).map((casino) => (
                  <Link
                    key={casino.slug}
                    href={`/casino-reviews/${casino.slug}`}
                    className="block bg-surface-elevated rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{casino.name}</h3>
                        {casino.tagline && (
                          <p className="text-sm text-muted mt-0.5">{casino.tagline}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {casino.countries.slice(0, 3).map((c) => (
                            <span key={c} className="text-xs bg-surface-hover text-muted px-2 py-0.5 rounded-full">{c}</span>
                          ))}
                        </div>
                      </div>
                      {casino.rating !== null && (
                        <span className="text-sm font-semibold text-primary">{casino.rating}/10</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              {supportingCasinos.length > 20 && (
                <p className="text-sm text-muted mt-4">
                  And {supportingCasinos.length - 20} more verified casinos.
                </p>
              )}
            </section>
          )}

          {/* How It Works */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">How {entity.canonicalName} Works at Casinos</h2>
            <p className="text-muted leading-relaxed">
              {entity.canonicalName} is a {TYPE_LABELS[entity.type]?.toLowerCase() ?? entity.type} payment method
              used for deposits and withdrawals at online casinos. To use {entity.canonicalName}, select it
              at the casino cashier, enter your details, and confirm the transaction. Processing times
              and limits vary by casino.
            </p>
          </section>

          {/* Pros / Considerations */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">Things to Know</h2>
            <ul className="list-disc list-inside text-muted space-y-1">
              <li>Available at {entity.casinoCount} verified casinos</li>
              <li>Coverage across {entity.geoCount} European market{entity.geoCount !== 1 ? "s" : ""}</li>
              <li>{entity.hasDeposits ? "Supported for deposits" : "Deposit availability varies by casino"}</li>
              <li>{entity.hasWithdrawals ? "Supported for withdrawals at some casinos" : "Withdrawal availability varies by casino"}</li>
              <li>Always check individual casino terms for fees and processing times</li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((faq, i) => (
                <div key={i} className="bg-surface-elevated rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Content */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">Related Content</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="block bg-surface-elevated rounded-xl border border-border p-4 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
                  <p className="text-xs text-muted mt-1">{guide.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Footer links */}
          <section>
            <p className="text-sm text-muted leading-relaxed">
              Learn more about our data verification in our{" "}
              <Link href="/methodology" className="text-primary hover:underline">Methodology</Link>.
              Compare casinos side-by-side at our{" "}
              <Link href="/compare" className="text-primary hover:underline">Comparison Tool</Link>.
            </p>
          </section>
        </div>
      </Container>
    </>
  );
}
