import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CasinoGrid } from "@/components/casino/CasinoGrid";
import { createGermanyProvider } from "@/lib/data/germany-provider";

export const metadata: Metadata = {
  title: "Online Casinos in Germany — CasinoLynora",
  description: "Browse verified online casinos available in Germany. Compare bonuses, payment methods, and game selections.",
  alternates: {
    canonical: "https://casinolynora.com/de/casinos",
  },
  openGraph: {
    title: "Online Casinos in Germany — CasinoLynora",
    description: "Browse verified online casinos available in Germany.",
  },
  twitter: {
    card: "summary",
    title: "Online Casinos in Germany — CasinoLynora",
    description: "Browse verified online casinos available in Germany.",
  },
};

export default function GermanyCasinosPage() {
  const provider = createGermanyProvider();
  const casinos = provider.getAllCasinos();

  return (
    <Container className="py-12 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Online Casinos in Germany
        </h1>

        <p className="text-lg text-muted mb-8">
          Browse verified online casinos available to German players.
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Casino Listings Coming Soon</h2>
            <p className="text-muted mb-4">
              We are preparing verified casino profiles for the German market.
              Each listing will include verified information about licenses,
              payment methods, bonuses, and responsible gambling features.
            </p>
            <p className="text-sm text-muted mb-6">
              Our team verifies every casino before it appears on this page.
              We do not list unlicensed or unverified casinos.
            </p>
            <Button href="/ai-casino-match" variant="primary">
              Try AI Matchmaker Instead
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
