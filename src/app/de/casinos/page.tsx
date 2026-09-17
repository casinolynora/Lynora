import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CasinoGrid } from "@/components/casino/CasinoGrid";
import { createGermanyProvider } from "@/lib/data/germany-provider";

export const metadata: Metadata = {
  title: "Deutsche Online Casinos — Verfügbare Anbieter | CasinoLynora",
  description: "Alle verfügbaren Online-Casinos für deutsche Spieler. Filtern Sie nach Zahlungsmethoden, Spielen und Lizenzen.",
  alternates: { canonical: "/de/casinos" },
  openGraph: {
    title: "Deutsche Online Casinos — Verfügbare Anbieter | CasinoLynora",
    description: "Alle verfügbaren Online-Casinos für deutsche Spieler.",
  },
  twitter: {
    card: "summary",
    title: "Deutsche Online Casinos — Verfügbare Anbieter | CasinoLynora",
    description: "Alle verfügbaren Online-Casinos für deutsche Spieler.",
  },
};

export default function GermanyCasinosPage() {
  const provider = createGermanyProvider();
  const casinos = provider.getAllCasinos();

  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🇩🇪</span>
            <h1 className="text-3xl sm:text-4xl font-bold">Deutsche Online Casinos</h1>
          </div>
          <p className="text-lg text-muted leading-relaxed">
            Entdecken Sie alle verfügbaren Online-Casinos für deutsche Spieler.
            Jedes Profil enthält verifizierte Daten zu Lizenzen, Zahlungsmethoden und verantwortungsbewusstem Spielen.
          </p>
        </div>

        {/* Casino directory */}
        {casinos.length > 0 ? (
          <div className="max-w-5xl">
            <CasinoGrid casinos={casinos} baseUrl="/de" />
          </div>
        ) : (
          <div className="max-w-3xl">
            <div className="card-static p-8 text-center">
              <h2 className="text-xl font-bold mb-2">Casino-Profile werden vorbereitet</h2>
              <p className="text-muted mb-6">
                Wir erstellen verifizierte Casino-Profile für den deutschen Markt.
                Jedes Profil wird aktuelle Daten zu GGL-Lizenzen, Zahlungsmethoden und Spielfunktionen enthalten.
              </p>
              <Button href="/ai-casino-match" variant="primary">KI-Matchmaker testen</Button>
            </div>
          </div>
        )}

        {/* Contextual content */}
        <div className="max-w-3xl mt-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">GGL-Lizenz und Rechtslage</h2>
              <p className="text-muted leading-relaxed">
                Online-Glücksspiel in Deutschland wird von der Gemeinsamen Glücksspielbehörde der Länder (GGL) reguliert.
                Casinos benötigen eine gültige GGL-Lizenz, um legal in Deutschland zu operieren.
                CasinoLynora listet ausschließlich Casinos auf, die über eine relevante Lizenz verfügen und für deutsche Spieler verfügbar sind.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Beliebte Zahlungsmethoden in Deutschland</h2>
              <p className="text-muted leading-relaxed">
                Deutsche Spieler nutzen bevorzugt Zahlungsmethoden wie PayPal, Klarna, SOFORT und Banküberweisungen.
                Alle in unseren Profilen aufgeführten Casinos unterstützen Euro-Zahlungen und bieten passende Einzahlungs- und Auszahlungsoptionen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Weitere Schritte</h2>
              <p className="text-muted leading-relaxed">
                Nutzen Sie unseren{" "}
                <Link href="/de/compare" className="text-brand-700 font-medium hover:underline">
                  Vergleich
                </Link>
                , um Casinos direkt gegenüberzustellen, oder probieren Sie den{" "}
                <Link href="/ai-casino-match" className="text-brand-700 font-medium hover:underline">
                  KI-Matchmaker
                </Link>
                , um ein Casino nach Ihren persönlichen Vorlieben zu finden.
                Lesen Sie auch unsere{" "}
                <Link href="/de/guides" className="text-brand-700 font-medium hover:underline">
                  Deutschland-Guides
                </Link>
                {" "}für weiterführende Informationen.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
