import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { createGermanyProvider } from "@/lib/data/germany-provider";

export const metadata: Metadata = {
  title: "Compare Casinos in Germany — CasinoLynora",
  description: "Compare verified online casinos in Germany side-by-side.",
  alternates: { canonical: "/de/compare" },
};

export default function GermanyComparePage() {
  const provider = createGermanyProvider();
  const casinos = provider.getAllCasinos();

  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Compare Casinos in Germany</h1>
          <p className="text-lg text-muted">
            Compare verified online casinos available to German players.
          </p>
        </div>

        <div className="max-w-5xl">
          {casinos.length > 0 ? (
            <ComparisonTable casinos={casinos} />
          ) : (
            <div className="card-static p-8 text-center">
              <h2 className="text-xl font-bold mb-2">Comparison Coming Soon</h2>
              <p className="text-muted">
                Verified casino data for Germany is being prepared.
              </p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
