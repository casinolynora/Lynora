import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Online Casinos Vergleich — Germany | CasinoLynora",
  description: "Compare verified online casinos available to German players. Side-by-side comparison of bonuses, payment methods, and game selections.",
  alternates: {
    canonical: "https://casinolynora.com/de/compare",
  },
};

export default function GermanyComparePage() {
  return (
    <Container className="py-12 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Compare Online Casinos in Germany
        </h1>

        <p className="text-lg text-muted mb-8">
          Compare verified online casinos available to German players.
        </p>

        <div className="bg-surface-elevated rounded-2xl border border-border p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Comparison Coming Soon</h2>
          <p className="text-muted mb-4">
            We are building verified casino profiles for the German market.
            Once available, you will be able to compare casinos side-by-side.
          </p>
          <p className="text-sm text-muted mb-6">
            Our comparison tool analyzes verified data including ratings, payment
            methods, bonuses, and withdrawal speeds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/ai-casino-match" variant="primary">
              Try AI Matchmaker
            </Button>
            <Button href="/de/casinos" variant="secondary">
              Browse Germany Casinos
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
