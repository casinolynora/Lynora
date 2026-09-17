import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CasinoGrid } from "@/components/casino/CasinoGrid";
import { createGermanyProvider } from "@/lib/data/germany-provider";

export const metadata: Metadata = {
  title: "So finden Sie das richtige Online Casino in Deutschland | CasinoLynora",
  description: "Erfahren Sie, wie CasinoLynora Online-Casinos für deutsche Spieler bewertet. Transparente Kriterien, GGL-Lizenz, Zahlungsmethoden und verantwortungsbewusstes Spielen.",
  alternates: { canonical: "/de/best-casinos" },
  openGraph: {
    title: "So finden Sie das richtige Online Casino in Deutschland | CasinoLynora",
    description: "Transparente Bewertungskriterien für Online-Casinos in Deutschland.",
  },
  twitter: {
    card: "summary",
    title: "So finden Sie das richtige Online Casino in Deutschland | CasinoLynora",
    description: "Transparente Bewertungskriterien für Online-Casinos in Deutschland.",
  },
};

export default function GermanyBestCasinosPage() {
  const provider = createGermanyProvider();
  const casinos = provider.getAllCasinos();

  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        {/* Header — different from /de/casinos */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🇩🇪</span>
            <h1 className="text-3xl sm:text-4xl font-bold">So finden Sie das richtige Online Casino</h1>
          </div>
          <p className="text-lg text-muted leading-relaxed">
            CasinoLynora bewertet Online-Casinos anhand definierter Kriterien — nicht nach Meinungen oder Werbeeinflüssen.
            Erfahren Sie, wie unser Vergleich funktioniert und worauf Sie achten sollten.
          </p>
        </div>

        {/* Methodology sections */}
        <div className="max-w-3xl mb-16">
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-3">Unsere Bewertungskriterien</h2>
              <p className="text-muted leading-relaxed mb-4">
                CasinoLynora nutzt einen deterministischen Algorithmus, der strukturierte Casino-Daten gegen Ihre persönlichen Vorlieben bewertet.
                Die Bewertung basiert auf gewichteten Datenpunkten — nicht auf subjektiven Meinungen.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Lizenz & Regulierung", desc: "GGL, MGA und andere relevante Lizenzen" },
                  { label: "Zahlungsmethoden", desc: "Verfügbare Ein- und Auszahlungsoptionen" },
                  { label: "Spielauswahl", desc: "Anbieter, Spielkategorien und Qualität" },
                  { label: "Einzahlungsgrenzen", desc: "Minimale und maximale Einzahlungsbeträge" },
                  { label: "Verantwortungsbewusstes Spielen", desc: "Verfügbare Schutzmaßnahmen" },
                  { label: "Live-Casino & Sportwetten", desc: "Zusätzliche Produktkategorien" },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-[var(--radius-lg)] border border-border bg-bg-subtle">
                    <p className="font-semibold text-sm mb-1">{item.label}</p>
                    <p className="text-xs text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">GGL-Lizenz — Was bedeutet das?</h2>
              <p className="text-muted leading-relaxed">
                Die Gemeinsame Glücksspielbehörde der Länder (GGL) ist die zentrale Aufsichtsbehörde für Online-Glücksspiel in Deutschland.
                Casinos mit GGL-Lizenz müssen strenge Anforderungen erfüllen: getrennte Spielerkonten, verifizierbare Zufallsgeneratoren,
                Pflichtangebote zum verantwortungsbewussten Spielen und regelmäßige Kontrollen.
                CasinoLynora berücksichtigt die GGL-Lizenz als wichtigstes Kriterium für die Bewertung deutscher Casinos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Transparente Methodik</h2>
              <p className="text-muted leading-relaxed">
                Unser Algorithmus ist öffentlich dokumentiert. CasinoLynora verkauft keine Bewertungen und akzeptiert keine Zahlungen,
                die die redaktionelle Bewertung beeinflussen. Bezahlte Platzierungen werden klar als solche gekennzeichnet
                und verändern nicht die Ergebnisse unseres Vergleichsalgorithmus.
              </p>
              <div className="mt-4 p-4 rounded-[var(--radius-lg)] border border-brand-200 bg-brand-50">
                <p className="text-sm text-brand-800 leading-relaxed">
                  <strong>Hinweis:</strong> „Beste Casinos" bedeutet nicht, dass CasinoLynora ein objektiv bestes Casino identifiziert hat.
                  Die Bewertung hängt von Ihren individuellen Vorlieben ab. Nutzen Sie unseren{" "}
                  <Link href="/ai-casino-match" className="text-brand-700 font-medium hover:underline">
                    KI-Matchmaker
                  </Link>
                  {" "}für eine persönliche Empfehlung.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Verantwortungsbewusstes Spielen</h2>
              <p className="text-muted leading-relaxed">
                Glücksspiel sollte unterhaltsam bleiben — kein Weg, Geld zu verdienen.
                Setzen Sie sich feste Einzahlungs- und Zeitlimits. Nutzen Sie die Selbstsperrungsfunktionen der Casinos.
                Bei Anzeichen von Problematischem Spielen kontaktieren Sie bitte{" "}
                <a href="https://www.check-dein-spiel.de" className="text-brand-700 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
                  Check-dein-Spiel.de
                </a>
                {" "}oder die{" "}
                <a href="https://www.bzga.de" className="text-brand-700 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
                  BZgA-Hotline
                </a>
                .
              </p>
            </section>
          </div>
        </div>

        {/* Casino grid with full info for comparison */}
        {casinos.length > 0 && (
          <div className="max-w-5xl">
            <h2 className="text-2xl font-bold mb-6">Verfügbare Casinos im Vergleich</h2>
            <CasinoGrid casinos={casinos} baseUrl="/de" showFullInfo />
          </div>
        )}

        {/* Internal links */}
        <div className="max-w-3xl mt-12">
          <div className="flex flex-wrap gap-4">
            <Button href="/de/casinos" variant="secondary" size="sm">
              Alle Casinos ansehen
            </Button>
            <Button href="/de/compare" variant="secondary" size="sm">
              Casino-Vergleich
            </Button>
            <Button href="/ai-casino-match" variant="primary" size="sm">
              KI-Matchmaker starten
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
