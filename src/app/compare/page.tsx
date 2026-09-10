import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { casinoDb } from "@/lib/data/accessor";

export const metadata: Metadata = {
  title: "Compare Casinos — CasinoLynora",
  description: "Compare online casinos side-by-side. View verified data on licenses, payment methods, games, and features.",
  alternates: { canonical: "https://casinolynora.com/compare" },
};

export default function ComparePage() {
  const casinos = casinoDb.getAllCasinos();

  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Compare Casinos</h1>
          <p className="text-lg text-muted">
            Compare casinos side-by-side to make informed decisions.
            Select up to 4 casinos and compare their verified features.
          </p>
        </div>

        <div className="max-w-5xl">
          {casinos.length > 0 ? (
            <ComparisonTable casinos={casinos} />
          ) : (
            <div className="card-static p-8 text-center">
              <h2 className="text-xl font-bold mb-2">No Casinos Available</h2>
              <p className="text-muted">
                Casino data is being prepared. Check back soon.
              </p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
