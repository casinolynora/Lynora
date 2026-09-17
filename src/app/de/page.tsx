import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CasinoGrid } from "@/components/casino/CasinoGrid";
import { createGermanyProvider } from "@/lib/data/germany-provider";

export const metadata: Metadata = {
  title: "Online-Casinos in Deutschland — CasinoLynora",
  description: "GGL-lizenzierte Online-Casinos für deutsche Spieler. Verifizierte Daten zu Lizenzen, Zahlungsmethoden und verantwortungsbewusstem Spielen.",
  alternates: {
    canonical: "/de",
  },
  openGraph: {
    title: "Online-Casinos in Deutschland — CasinoLynora",
    description: "GGL-lizenzierte Online-Casinos mit verifizierten Daten für deutsche Spieler.",
  },
  twitter: {
    card: "summary",
    title: "Online-Casinos in Deutschland — CasinoLynora",
    description: "GGL-lizenzierte Online-Casinos mit verifizierten Daten für deutsche Spieler.",
  },
};

export default function GermanyPage() {
  const provider = createGermanyProvider();
  const casinos = provider.getAllCasinos();

  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🇩🇪</span>
            <h1 className="text-3xl sm:text-4xl font-bold">Online-Casinos in Deutschland</h1>
          </div>
          <p className="text-lg text-muted leading-relaxed">
            Entdecken Sie GGL-lizenzierte Online-Casinos, die für deutsche Spieler verfügbar sind.
            Jedes Profil enthält verifizierte Daten zu Lizenzen, Zahlungsmethoden und verantwortungsbewusstem Spielen.
          </p>
        </div>

        {/* Casino grid */}
        {casinos.length > 0 ? (
          <div className="max-w-5xl">
            <CasinoGrid casinos={casinos} baseUrl="/de" />
          </div>
        ) : (
          <div className="max-w-3xl">
            <div className="card-static p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-subtle mx-auto mb-4">
                <svg className="w-7 h-7 text-text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Casino-Profile werden vorbereitet</h2>
              <p className="text-muted mb-6">
                Wir erstellen verifizierte Casino-Profile für den deutschen Markt.
                Jedes Profil wird aktuelle Daten zu GGL-Lizenzen, Zahlungsmethoden und verantwortungsbewusstem Spielen enthalten.
              </p>
              <Button href="/ai-casino-match" variant="primary">
                KI-Matchmaker stattdessen testen
              </Button>
            </div>
          </div>
        )}

        {/* SEO content with internal links */}
        <div className="max-w-3xl mt-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">Online-Glücksspiel in Deutschland</h2>
              <p className="text-muted leading-relaxed">
                Online-Glücksspiel in Deutschland wird von der Gemeinsamen Glücksspielbehörde der Länder (GGL) reguliert.
                Casinos benötigen eine gültige GGL-Lizenz, um legal zu operieren.
                CasinoLynora listet ausschließlich Casinos auf, die über eine relevante Lizenz verfügen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">So funktioniert unser Vergleich</h2>
              <p className="text-muted leading-relaxed">
                Unser Algorithmus analysiert strukturierte Casino-Daten — GGL-Lizenz, Zahlungsmethoden (PayPal, Klarna, SOFORT),
                Euro-Unterstützung, deutsche Sprache und Ihre persönlichen Vorlieben.
                Erfahren Sie mehr über unsere{" "}
                <Link href="/de/best-casinos" className="text-brand-700 font-medium hover:underline">
                  Bewertungsmethodik
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Verantwortungsbewusstes Spielen</h2>
              <p className="text-muted leading-relaxed">
                Glücksspiel sollte unterhaltsam bleiben, nicht als Einkommensquelle dienen.
                Setzen Sie sich feste Limits und hören Sie auf, wenn das Vergnügen aufhört.
                Besuchen Sie unsere{" "}
                <Link href="/responsible-gambling" className="text-brand-700 font-medium hover:underline">
                  Seite zum verantwortungsbewussten Spielen
                </Link>
                {" "}für Ressourcen und Unterstützung.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
