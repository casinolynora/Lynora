import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CONTACT_EMAILS } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — BeInCasinos",
  description: "How BeInCasinos uses affiliate links and how this affects our recommendations.",
  alternates: { canonical: "/affiliate-disclosure" },
  openGraph: {
    title: "Affiliate Disclosure — BeInCasinos",
    description: "How BeInCasinos uses affiliate links.",
  },
  twitter: {
    card: "summary",
    title: "Affiliate Disclosure — BeInCasinos",
    description: "How BeInCasinos uses affiliate links.",
  },
};

export default function AffiliateDisclosurePage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Affiliate Disclosure</h1>

          <div className="space-y-8 text-muted leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">What Are Affiliate Links</h2>
              <p>When you click a &quot;Visit Casino&quot; link on BeInCasinos and sign up, we may receive a commission from the casino operator.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">How This Affects You</h2>
              <p>Affiliate relationships do not affect our data, scoring, or matching algorithm. Our recommendations are based entirely on structured, verified casino data. Learn more about how we work on our <Link href="/about" className="text-brand-700 font-medium hover:underline">about page</Link>.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">Current Status</h2>
              <p>BeInCasinos may earn commissions through affiliate links when monetization is enabled. If no affiliate links are active, no commissions are earned.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">Matching Methodology</h2>
              <p>Our scoring algorithm uses weighted data points (country availability, payment methods, games, deposit limits, etc.) — never affiliate commission rates. See our full <Link href="/methodology" className="text-brand-700 font-medium hover:underline">methodology</Link> for details.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">Contact</h2>
              <p>Questions? <a href={`mailto:${CONTACT_EMAILS.affiliates}`} className="text-brand-700 hover:underline">{CONTACT_EMAILS.affiliates}</a></p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
