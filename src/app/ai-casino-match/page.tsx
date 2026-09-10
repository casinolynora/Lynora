import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MatchmakerFlow } from "@/components/matchmaker/MatchmakerFlow";

export const metadata: Metadata = {
  title: "AI Casino Matchmaker — Find Your Perfect Casino",
  description:
    "Answer a few questions and let our AI matchmaker find the best online casino for your preferences. Data-driven, transparent recommendations.",
  openGraph: {
    title: "AI Casino Matchmaker — CasinoLynora",
    description: "Answer a few questions and find your perfect casino match.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Casino Matchmaker — CasinoLynora",
    description: "Answer a few questions and find your perfect casino match.",
  },
  alternates: {
    canonical: "https://casinolynora.com/ai-casino-match",
  },
};

export default function AiCasinoMatchPage() {
  return (
    <>
      <MatchmakerFlow />

      {/* Static SEO content below the interactive matchmaker */}
      <section className="py-16 lg:py-24 bg-surface border-t border-border">
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">How the AI Casino Matchmaker Works</h2>

          <div className="prose prose-gray max-w-none space-y-6 text-muted">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Data-Driven Recommendations</h3>
              <p>
                CasinoLynora&apos;s AI Casino Matchmaker uses a deterministic scoring algorithm to match
                your personal preferences with our database of verified casino profiles. Every recommendation
                is based on structured, verified data — not subjective opinions or affiliate commissions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">How We Calculate Scores</h3>
              <p>
                Your match score is calculated using a weighted algorithm that considers multiple factors:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Country availability (25%) — Is the casino licensed to operate in your region?</li>
                <li>Payment method compatibility (20%) — Does it support your preferred payment method?</li>
                <li>Game variety match (15%) — Does it offer the games you enjoy?</li>
                <li>Minimum deposit (10%) — Does the minimum deposit fit your budget?</li>
                <li>Bonus preferences (10%) — Does it offer the type of bonus you want?</li>
                <li>Live casino, sports betting, and withdrawal speed (15% combined)</li>
              </ul>
              <p className="mt-2">
                The AI explanation layer adds natural-language context to these scored results, helping you
                understand why each casino is recommended. The AI never modifies the match score — it only
                explains the existing data.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Transparency First</h3>
              <p>
                Every casino profile on CasinoLynora is built from verified data. We clearly show when
                information was last verified, and we distinguish between editorial content and affiliate
                relationships. Our AI explains both why a casino matches your preferences and where it
                falls short.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Affiliate Relationships</h3>
              <p>
                CasinoLynora earns commissions through affiliate links. When you click &quot;Visit Casino&quot;
                and sign up, we may receive a commission. This does not affect our match scores or
                recommendations. Our scoring algorithm is based entirely on structured data, not commercial
                relationships.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Responsible Gambling</h3>
              <p>
                Gambling should be entertaining, not a way to make money. Never bet more than you can afford
                to lose. If you need help, visit{' '}
                <a href="https://www.begambleaware.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  BeGambleAware
                </a>.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
