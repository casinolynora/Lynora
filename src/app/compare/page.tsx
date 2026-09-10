import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { casinoDb } from "@/lib/data/accessor";

export const metadata: Metadata = {
  title: "Compare Casinos — Side-by-Side Casino Comparison",
  description:
    "Compare online casinos side-by-side. Compare ratings, bonuses, payment methods, withdrawal speeds, and more to find the best casino for you.",
  openGraph: {
    title: "Compare Casinos — CasinoLynora",
    description: "Compare online casinos side-by-side to find the best option.",
  },
  twitter: {
    card: "summary",
    title: "Compare Casinos — CasinoLynora",
    description: "Compare online casinos side-by-side.",
  },
  alternates: {
    canonical: "https://casinolynora.com/compare",
  },
};

export default function ComparePage() {
  const casinos = casinoDb.getAllCasinos();

  return (
    <Container className="py-12 lg:py-20">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Compare Casinos</h1>
        <p className="text-muted max-w-2xl">
          Compare casinos side-by-side to make informed decisions.
          Select up to 4 casinos and compare their features.
        </p>
      </div>

      {casinos.length === 0 ? (
        <div className="bg-surface-elevated rounded-2xl border border-border p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Casinos Coming Soon</h2>
          <p className="text-muted mb-4">
            We are building verified casino profiles. Once available, you will be
            able to compare casinos side-by-side.
          </p>
          <p className="text-sm text-muted mb-6">
            Our comparison tool analyzes verified data including ratings, payment
            methods, bonuses, and withdrawal speeds.
          </p>
          <Button href="/ai-casino-match" variant="primary">
            Try AI Matchmaker Instead
          </Button>
        </div>
      ) : (
        <ComparisonTable casinos={casinos} />
      )}
    </Container>
  );
}
