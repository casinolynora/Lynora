import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { toComparisonCasino } from "@/lib/compare";
import { createGermanyProvider } from "@/lib/data/germany-provider";

export const metadata: Metadata = {
  title: "Casinos in Deutschland vergleichen — CasinoLynora",
  description: "Vergleichen Sie Online-Casinos für deutsche Spieler Seite an Seite. Strukturierte Daten zu Lizenzen, Zahlungsmethoden und Spielfunktionen.",
  alternates: { canonical: "/de/compare" },
  openGraph: {
    title: "Casinos in Deutschland vergleichen — CasinoLynora",
    description: "Online-Casinos für deutsche Spieler vergleichen.",
  },
  twitter: {
    card: "summary",
    title: "Casinos in Deutschland vergleichen — CasinoLynora",
    description: "Online-Casinos für deutsche Spieler vergleichen.",
  },
};

export default function GermanyComparePage() {
  const provider = createGermanyProvider();
  const casinos = provider.getAllCasinos();
  const comparisonCasinos = casinos.map((c) => toComparisonCasino(c));

  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Casinos in Deutschland vergleichen</h1>
          <p className="text-lg text-muted leading-relaxed">
            Stellen Sie Online-Casinos für deutsche Spieler gegenüber.
            Nutzen Sie strukturierte Daten, um fundierte Entscheidungen zu treffen.
          </p>
        </div>

        <div className="max-w-5xl">
          {comparisonCasinos.length > 0 ? (
            <ComparisonTable
              casinos={comparisonCasinos}
            />
          ) : (
            <div className="card-static p-8 text-center">
              <h2 className="text-xl font-bold mb-2">Vergleich wird vorbereitet</h2>
              <p className="text-muted">
                Verifizierte Casino-Daten für Deutschland werden gerade zusammengestellt.
              </p>
            </div>
          )}
        </div>

        {/* Internal links */}
        <div className="max-w-3xl mt-12">
          <div className="flex flex-wrap gap-4">
            <Link href="/de/casinos" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
              Alle Casinos ansehen
            </Link>
            <Link href="/de/best-casinos" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
              Bewertungsmethodik
            </Link>
            <Link href="/ai-casino-match" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
              KI-Matchmaker
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
