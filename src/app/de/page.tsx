import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CasinoGrid } from "@/components/casino/CasinoGrid";
import { createGermanyProvider } from "@/lib/data/germany-provider";

export const metadata: Metadata = {
  title: "Best Online Casinos in Germany — CasinoLynora",
  description: "Find the best online casinos in Germany with CasinoLynora's AI-powered matching. Personalized recommendations for German players.",
  alternates: {
    canonical: "https://casinolynora.com/de",
    languages: {
      "en": "https://casinolynora.com/de",
    },
  },
  openGraph: {
    title: "Best Online Casinos in Germany — CasinoLynora",
    description: "AI-powered casino matching for German players.",
  },
  twitter: {
    card: "summary",
    title: "Best Online Casinos in Germany — CasinoLynora",
    description: "AI-powered casino matching for German players.",
  },
};

export default function GermanyPage() {
  const provider = createGermanyProvider();
  const casinos = provider.getAllCasinos();

  return (
    <Container className="py-12 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🇩🇪</span>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Best Online Casinos in Germany
          </h1>
        </div>

        <p className="text-lg text-muted mb-8">
          Find the best online casinos available in Germany with CasinoLynora&apos;s
          AI-powered matching system. Answer a few questions and get personalized
          recommendations based on your preferences.
        </p>
      </div>

      {casinos.length > 0 ? (
        <div className="max-w-5xl mx-auto mb-12">
          <CasinoGrid casinos={casinos} baseUrl="/de" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-surface-elevated rounded-2xl border border-border p-8 text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">We&apos;re Preparing Verified Casino Data</h2>
            <p className="text-muted mb-4">
              Our team is building verified casino profiles for German players.
              We only list casinos that are licensed and regulated for the German market.
            </p>
            <p className="text-sm text-muted mb-6">
              Every casino recommendation will include verified information about
              licenses, payment methods, bonuses, and responsible gambling features.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button href="/ai-casino-match" variant="primary">
                Try AI Matchmaker
              </Button>
              <Button href="/responsible-gambling" variant="outline">
                Responsible Gambling
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-3">Online Gambling in Germany</h2>
            <p className="text-muted leading-relaxed">
              Online gambling regulations in Germany require casinos to hold valid
              licenses from the Gemeinsame Glücksspielbehörde der Deutschen (GGL),
              the joint gambling authority responsible for regulation. CasinoLynora only
              lists casinos that are GGL-licensed and available to players in Germany.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">How We Match Casinos for Germany</h2>
            <p className="text-muted leading-relaxed">
              Our AI-powered matching system considers:
            </p>
            <ul className="list-disc list-inside text-muted space-y-1">
              <li>GGL-licensed casinos verified for the German market</li>
              <li>Payment methods popular in Germany (PayPal, Klarna, Sofort, etc.)</li>
              <li>Euro (EUR) currency support</li>
              <li>German language support</li>
              <li>Your personal preferences for games, bonuses, and more</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Responsible Gambling</h2>
            <p className="text-muted leading-relaxed">
              Gambling should be entertaining. Never bet more than you can afford to lose.
              If you need help, visit our{' '}
              <Link href="/responsible-gambling" className="text-primary hover:underline">
                Responsible Gambling
              </Link>{' '}
              page for resources and support.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
