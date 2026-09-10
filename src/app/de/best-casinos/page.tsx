import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CasinoGrid } from "@/components/casino/CasinoGrid";
import { createGermanyProvider } from "@/lib/data/germany-provider";

export const metadata: Metadata = {
  title: "Best Online Casinos in Germany — Top Rated 2026 | CasinoLynora",
  description: "Discover the best online casinos in Germany. Expert-rated reviews, verified bonuses, and secure payment methods.",
  alternates: {
    canonical: "https://casinolynora.com/de/best-casinos",
  },
  openGraph: {
    title: "Best Online Casinos in Germany — CasinoLynora",
    description: "Discover the best online casinos in Germany. Expert-rated reviews, verified bonuses, and secure payment methods.",
  },
  twitter: {
    card: "summary",
    title: "Best Online Casinos in Germany — CasinoLynora",
    description: "Discover the best online casinos in Germany. Expert-rated reviews, verified bonuses, and secure payment methods.",
  },
};

export default function GermanyBestCasinosPage() {
  const provider = createGermanyProvider();
  const casinos = provider.getAllCasinos();

  return (
    <Container className="py-12 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Best Online Casinos in Germany
        </h1>

        <p className="text-lg text-muted mb-8">
          Expert-rated and verified online casinos for German players.
        </p>
      </div>

      {casinos.length > 0 ? (
        <div className="max-w-5xl mx-auto">
          <CasinoGrid casinos={casinos} baseUrl="/de" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-surface-elevated rounded-2xl border border-border p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Rankings Coming Soon</h2>
            <p className="text-muted mb-4">
              Our expert rankings for German casinos are being prepared.
              We rate casinos based on verified data including:
            </p>
            <ul className="text-muted text-left max-w-md mx-auto space-y-1 mb-6">
              <li>• License validity and regulation</li>
              <li>• Game variety and software providers</li>
              <li>• Bonus value and fairness</li>
              <li>• Payment speed and methods</li>
              <li>• Customer support quality</li>
              <li>• Responsible gambling features</li>
            </ul>
            <Button href="/ai-casino-match" variant="primary">
              Try AI Matchmaker Instead
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
