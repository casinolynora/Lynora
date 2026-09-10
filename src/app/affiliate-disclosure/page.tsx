import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "CasinoLynora affiliate disclosure. Learn how affiliate relationships work and how they affect our recommendations.",
  alternates: { canonical: "https://casinolynora.com/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <Container className="py-12 lg:py-20 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Affiliate Disclosure</h1>
      <p className="text-sm text-muted mb-8">Last updated: September 2026</p>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-3">What Are Affiliate Links?</h2>
          <p className="text-muted leading-relaxed">
            CasinoLynora contains affiliate links to online casino websites. When you click
            on a &quot;Visit Casino&quot; or similar button and subsequently register an account with
            that casino, CasinoLynora may receive a commission from the casino operator.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">How This Affects You</h2>
          <ul className="list-disc list-inside text-muted space-y-2">
            <li><strong>Cost to you:</strong> Using our affiliate links does not cost you anything extra. The price you pay at the casino is the same whether you come through our link or directly.</li>
            <li><strong>Our recommendations:</strong> Affiliate relationships do not determine our matching scores or recommendations. Our AI-powered matching engine uses deterministic scoring based on structured casino data (licensing, payment methods, game availability, bonus terms, etc.).</li>
            <li><strong>Rating independence:</strong> Casino ratings on CasinoLynora are based on verified data, not commercial relationships.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">How We Identify Affiliate Links</h2>
          <p className="text-muted leading-relaxed">
            All affiliate links on CasinoLynora are clearly identified:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>Buttons containing affiliate links have <code>rel=&quot;sponsored&quot;</code> attributes</li>
            <li>Disclosure text appears near affiliate links stating that CasinoLynora may earn a commission</li>
            <li>This Affiliate Disclosure page is linked from our footer and casino review pages</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Our Matching Methodology</h2>
          <p className="text-muted leading-relaxed">
            CasinoLynora&apos;s matching algorithm scores casinos based on:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>Country availability and licensing</li>
            <li>Payment method support</li>
            <li>Minimum and maximum deposit limits</li>
            <li>Game variety and availability</li>
            <li>Live casino and sports betting options</li>
            <li>Bonus terms and value</li>
            <li>Withdrawal processing speed</li>
          </ul>
          <p className="text-muted leading-relaxed">
            Affiliate relationships are never a factor in these scores. A casino with no affiliate
            program can score just as highly as one with an affiliate program, if the structured
            data warrants it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Casino Information</h2>
          <p className="text-muted leading-relaxed">
            Casino information on CasinoLynora is sourced from verified data and editorial review.
            We clearly display a &quot;Last Verified&quot; date on every casino profile. However:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>Casino terms and conditions can change without notice</li>
            <li>Bonus offers may have expired or changed</li>
            <li>Country availability may vary</li>
            <li>Always verify current terms directly with the casino before registering</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Commercial Availability</h2>
          <p className="text-muted leading-relaxed">
            Casino availability and affiliate offers vary by country (GEO). We only display
            affiliate offers for casinos that are licensed and available in your region.
            When no valid affiliate offer exists for your country, we will not show an affiliate link.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Contact</h2>
          <p className="text-muted leading-relaxed">
            For questions about our affiliate relationships, please contact us through our
            <Link href="/contact" className="text-primary hover:underline"> contact page</Link>.
          </p>
        </section>
      </div>
    </Container>
  );
}
