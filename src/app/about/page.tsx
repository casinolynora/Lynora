import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About — CasinoLynora",
  description: "Learn about CasinoLynora's mission, methodology, and commitment to transparent, data-driven casino discovery.",
  alternates: { canonical: "https://casinolynora.com/about" },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">About CasinoLynora</h1>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted leading-relaxed">
                CasinoLynora is an independent casino discovery platform designed for European players.
                Unlike traditional review sites, we use structured, verified data to help you find
                casinos that match your specific preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How We Are Different</h2>
              <ul className="space-y-3 text-muted leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-brand-600 mt-1">•</span>
                  <span><strong className="text-foreground">Structured Data:</strong> Every casino profile is built from verified data, not opinions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-600 mt-1">•</span>
                  <span><strong className="text-foreground">Deterministic Matching:</strong> Our scoring algorithm is transparent and reproducible.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-600 mt-1">•</span>
                  <span><strong className="text-foreground">No Fake Reviews:</strong> We never publish fabricated testimonials or unverifiable claims.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-600 mt-1">•</span>
                  <span><strong className="text-foreground">Data Provenance:</strong> We track where every piece of information comes from.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Affiliate Disclosure</h2>
              <p className="text-muted leading-relaxed">
                CasinoLynora may earn commissions through affiliate links when monetization is enabled.
                This does not affect our data, matching algorithm, or recommendations.
                Our scoring is based entirely on structured casino data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Data Verification</h2>
              <p className="text-muted leading-relaxed">
                We verify casino data against official sources including license registries,
                casino websites, and regulatory bodies. Each data point includes provenance
                information indicating when it was last verified and by what method.
              </p>
            </section>

            <section className="card-static p-6">
              <p className="text-sm text-muted">
                For questions, contact us at{" "}
                <a href="mailto:hello@casinolynora.com" className="text-brand-700 font-medium hover:underline">
                  hello@casinolynora.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
