import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CasinoGrid } from "@/components/casino/CasinoGrid";
import { createGermanyProvider } from "@/lib/data/germany-provider";

export const metadata: Metadata = {
  title: "Verified Casinos in Germany — CasinoLynora",
  description: "GGL-verified online casinos for German players. Structured data on licensing, payments, and responsible gambling.",
  alternates: { canonical: "https://casinolynora.com/de/best-casinos" },
};

export default function GermanyBestCasinosPage() {
  const provider = createGermanyProvider();
  const casinos = provider.getAllCasinos();

  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Verified Casinos in Germany</h1>
          <p className="text-lg text-muted">
            GGL-verified online casinos with structured data for German players.
          </p>
        </div>

        {casinos.length > 0 ? (
          <div className="max-w-5xl">
            <CasinoGrid casinos={casinos} baseUrl="/de" showFullInfo />
          </div>
        ) : (
          <div className="max-w-3xl">
            <div className="card-static p-8 text-center">
              <h2 className="text-xl font-bold mb-2">Verified Casinos Coming Soon</h2>
              <p className="text-muted mb-6">
                We are building verified casino profiles for the German market.
              </p>
              <Button href="/ai-casino-match" variant="primary">Try AI Matchmaker</Button>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
