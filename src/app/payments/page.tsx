import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SITE_URL } from "@/lib/config/site";
import { getFullDatasetCasinos } from "@/lib/seo/payment-data";
import { buildPaymentEntityMap, classifyAllEntities } from "@/lib/seo/payment-entities";

export const metadata: Metadata = {
  title: "Payment Methods at Online Casinos | BeInCasinos",
  description:
    "Compare payment methods accepted at verified online casinos. Deposits, withdrawals, processing times, and availability across European markets.",
  alternates: { canonical: "/payments" },
  openGraph: {
    title: "Payment Methods at Online Casinos | BeInCasinos",
    description:
      "Compare payment methods accepted at verified online casinos across Europe.",
  },
  twitter: {
    card: "summary",
    title: "Payment Methods at Online Casinos | BeInCasinos",
    description:
      "Compare payment methods accepted at verified online casinos across Europe.",
  },
};

export default function PaymentsIndexPage() {
  const casinos = getFullDatasetCasinos();
  const entityMap = buildPaymentEntityMap(casinos);
  const tiers = classifyAllEntities(entityMap);
  const tierA = tiers.find((t) => t.tier === "A");
  const tierB = tiers.find((t) => t.tier === "B");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Payment Methods", item: `${SITE_URL}/payments` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-muted mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground font-medium">Payment Methods</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Casino Payment Methods
          </h1>
          <p className="text-lg text-muted mb-8">
            Compare payment methods accepted at verified online casinos on BeInCasinos.
            Each method listed below is backed by verified casino data across multiple European markets.
          </p>

          <div className="bg-surface-elevated rounded-2xl border border-border p-6 mb-10">
            <h2 className="text-lg font-semibold mb-2">How We Verify Payment Data</h2>
            <p className="text-sm text-muted leading-relaxed">
              Payment method availability is verified through our casino data import process.
              Each casino profile includes only payment methods confirmed on the operator&apos;s official website.
              We do not infer availability from logos, advertisements, or third-party directories.
            </p>
          </div>

          {tierA && tierA.entities.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Major Payment Methods</h2>
              <p className="text-muted mb-4">
                Payment methods available at 10+ verified casinos across 2+ European markets.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {tierA.entities.map((e) => (
                  <Link
                    key={e.entity.slug}
                    href={`/payments/${e.entity.slug}`}
                    className="block bg-surface-elevated rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{e.entity.canonicalName}</h3>
                      <span className="text-xs bg-surface-hover text-muted px-2 py-0.5 rounded-full">{e.entity.type}</span>
                    </div>
                    <p className="text-sm text-muted">
                      {e.entity.casinoCount} casinos · {e.entity.geoCount} markets
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {tierB && tierB.entities.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Regional Payment Methods</h2>
              <p className="text-muted mb-4">
                Payment methods with strong regional presence at verified casinos.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {tierB.entities.map((e) => (
                  <Link
                    key={e.entity.slug}
                    href={`/payments/${e.entity.slug}`}
                    className="block bg-surface-elevated rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{e.entity.canonicalName}</h3>
                      <span className="text-xs bg-surface-hover text-muted px-2 py-0.5 rounded-full">{e.entity.type}</span>
                    </div>
                    <p className="text-sm text-muted">
                      {e.entity.casinoCount} casinos · {e.entity.geoCount} markets
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-3">Choosing a Payment Method</h2>
            <p className="text-muted leading-relaxed mb-4">
              The best payment method depends on your priorities — whether that is speed, security,
              privacy, or availability in your country. Consider processing times, fees, and whether
              the method qualifies for casino bonuses.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/guides/payment-methods-guide" variant="secondary">
                Payment Methods Guide
              </Button>
              <Button href="/compare" variant="secondary">
                Compare Casinos
              </Button>
            </div>
          </section>

          <section>
            <p className="text-sm text-muted leading-relaxed">
              Learn more about how we evaluate casinos and payment methods in our{" "}
              <Link href="/methodology" className="text-primary hover:underline">Methodology</Link>.
              Gambling should be entertaining — visit our{" "}
              <Link href="/responsible-gambling" className="text-primary hover:underline">Responsible Gambling</Link>{" "}
              page for support.
            </p>
          </section>
        </div>
      </Container>
    </>
  );
}
