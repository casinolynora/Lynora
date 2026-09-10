import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Use — CasinoLynora",
  description: "CasinoLynora terms of use. Rules and responsibilities for using our platform.",
  alternates: { canonical: "https://casinolynora.com/terms" },
};

export default function TermsPage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Terms of Use</h1>
          <p className="text-sm text-muted mb-8">Last updated: September 2026</p>

          <div className="space-y-8 text-muted leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">1. Acceptance</h2>
              <p>By using CasinoLynora, you agree to these terms.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">2. Eligibility</h2>
              <p>You must be 18+ (or legal gambling age in your jurisdiction) to use this service.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">3. About CasinoLynora</h2>
              <p>An independent casino comparison platform using structured, verified data. We are not a casino operator.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">4. Affiliate Relationships</h2>
              <p>CasinoLynora may earn commissions through affiliate links when monetization is enabled. This does not affect our data or recommendations.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">5. No Warranties</h2>
              <p>We provide information &quot;as is&quot; without warranties. Casino availability and terms may change.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">6. Responsible Gambling</h2>
              <p>Gambling can be addictive. Please play responsibly. Visit <Link href="/responsible-gambling" className="text-brand-700 hover:underline">our responsible gambling page</Link> for resources.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">7. Contact</h2>
              <p>Questions? <a href="mailto:hello@casinolynora.com" className="text-brand-700 hover:underline">hello@casinolynora.com</a></p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
