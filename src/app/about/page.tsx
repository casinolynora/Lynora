import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About CasinoLynora — Our Mission & Methodology",
  description:
    "Learn about CasinoLynora's mission to bring transparency to online casino comparison. We use structured, verified data and AI-powered matching.",
  openGraph: {
    title: "About CasinoLynora — Our Mission & Methodology",
    description: "Learn about CasinoLynora's mission to bring transparency to online casino comparison.",
  },
  twitter: {
    card: "summary",
    title: "About CasinoLynora",
    description: "Learn about CasinoLynora's mission to bring transparency to online casino comparison.",
  },
  alternates: { canonical: "https://casinolynora.com/about" },
};

export default function AboutPage() {
  return (
    <Container className="py-12 lg:py-20 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">About CasinoLynora</h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
          <p className="text-muted leading-relaxed">
            CasinoLynora was created to bring transparency and trust to the online casino comparison space.
            We believe players deserve honest, data-driven recommendations — not manipulated reviews
            or misleading affiliate tactics.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">How We Are Different</h2>
          <p className="text-muted leading-relaxed">
            Unlike traditional casino review sites that rely on subjective scoring and potentially
            biased reviews, CasinoLynora uses a structured data approach. Every casino profile is
            built from verified information including licensing, payment methods, game availability,
            bonus terms, and withdrawal processing times.
          </p>
          <p className="text-muted leading-relaxed">
            Our AI-powered matching system uses deterministic scoring to match players with casinos
            based on their personal preferences. The scoring methodology is transparent and configurable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Our Scoring Methodology</h2>
          <p className="text-muted leading-relaxed">
            Casino scores are calculated using a weighted algorithm that considers:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>License quality and jurisdiction (25%)</li>
            <li>Payment method availability and variety (20%)</li>
            <li>Minimum deposit requirements (10%)</li>
            <li>Game variety and quality (15%)</li>
            <li>Withdrawal processing speed (10%)</li>
            <li>Bonus value and fairness (10%)</li>
            <li>Trust indicators and track record (10%)</li>
          </ul>
        </section>

        <section id="affiliate">
          <h2 className="text-2xl font-bold mb-3">Affiliate Disclosure</h2>
          <p className="text-muted leading-relaxed">
            CasinoLynora earns commissions through affiliate links. When you click on a &quot;Visit Casino&quot;
            link and sign up, we may receive a commission from the casino. This does not affect our
            ratings, reviews, or recommendations. Our scoring is based entirely on structured data
            and our proprietary algorithm.
          </p>
          <p className="text-muted leading-relaxed">
            We clearly label all affiliate links and relationships. Our editorial content is
            independent from our commercial relationships.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Data Verification</h2>
          <p className="text-muted leading-relaxed">
            We verify casino data regularly and display the &quot;Last Verified&quot; date on every casino
            profile. We strive to keep information current, but casino terms and conditions can
            change. Always verify current terms directly with the casino before signing up.
          </p>
        </section>

        <section id="privacy">
          <h2 className="text-2xl font-bold mb-3">Privacy Policy</h2>
          <p className="text-muted leading-relaxed">
            We respect your privacy. We do not sell personal data to third parties. Our website
            uses cookies for basic analytics and functionality. Affiliate tracking is handled
            through standard industry practices.
          </p>
        </section>

        <section id="terms">
          <h2 className="text-2xl font-bold mb-3">Terms of Use</h2>
          <p className="text-muted leading-relaxed">
            The information on CasinoLynora is provided for informational purposes only.
            We are not a casino operator and do not provide gambling services.
            Users must be 18 years or older to use this site. Gambling laws vary by jurisdiction —
            ensure you are legally permitted to gamble in your region.
          </p>
        </section>
      </div>
    </Container>
  );
}
