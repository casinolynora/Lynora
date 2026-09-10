import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CasinoGrid } from "@/components/casino/CasinoGrid";
import { createGermanyProvider } from "@/lib/data/germany-provider";

export const metadata: Metadata = {
  title: "Casinos in Germany — CasinoLynora",
  description: "Browse verified online casinos available in Germany. Compare payment methods, games, and responsible gambling features.",
  alternates: { canonical: "https://casinolynora.com/de/casinos" },
};

export default function GermanyCasinosPage() {
  const provider = createGermanyProvider();
  const casinos = provider.getAllCasinos();

  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Casinos in Germany</h1>
          <p className="text-lg text-muted">
            Browse verified online casinos available to German players.
          </p>
        </div>

        {casinos.length > 0 ? (
          <div className="max-w-5xl">
            <CasinoGrid casinos={casinos} baseUrl="/de" />
          </div>
        ) : (
          <div className="max-w-3xl">
            <div className="card-static p-8 text-center">
              <h2 className="text-xl font-bold mb-2">Listings Coming Soon</h2>
              <p className="text-muted mb-6">
                We are preparing verified casino profiles for the German market.
              </p>
              <Button href="/ai-casino-match" variant="primary">Try AI Matchmaker</Button>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
