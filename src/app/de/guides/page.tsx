import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { getAllGuides } from "@/lib/data/guides";

export const metadata: Metadata = {
  title: "Glücksspiel-Guides für Deutschland — BeInCasinos",
  description: "Praktische Guides für Online-Glücksspiel in Deutschland: Zahlungsmethoden, Boni, verantwortungsbewusstes Spielen und mehr.",
  alternates: { canonical: "/de/guides" },
  openGraph: {
    title: "Glücksspiel-Guides für Deutschland — BeInCasinos",
    description: "Praktische Guides für Online-Glücksspiel in Deutschland.",
  },
  twitter: {
    card: "summary",
    title: "Glücksspiel-Guides für Deutschland — BeInCasinos",
    description: "Praktische Guides für Online-Glücksspiel in Deutschland.",
  },
};

export default function GermanyGuidesPage() {
  const guides = getAllGuides();

  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Glücksspiel-Guides für Deutschland</h1>
          <p className="text-lg text-muted leading-relaxed">
            Praktische Informationen für deutsche Spieler: Zahlungsmethoden, Bonusbedingungen,
            Casino-Lizenzen und Tipps für verantwortungsbewusstes Spielen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {guides.map((guide) => {
            const deTitle = guide.de?.title || guide.title;
            const deDesc = guide.de?.description || guide.description;
            const deCategory = guide.de?.category || guide.category;
            return (
              <Link
                key={guide.slug}
                href={`/de/guides/${guide.slug}`}
                className="card-premium p-6 group"
              >
                <Badge variant="primary" size="sm" className="mb-3">{deCategory}</Badge>
                <h2 className="text-lg font-bold mb-2 group-hover:text-brand-700 transition-colors">
                  {deTitle}
                </h2>
                <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                  {deDesc}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Internal links */}
        <div className="mt-12 space-y-4">
          <h2 className="text-xl font-bold">Mehr zu Online-Glücksspiel in Deutschland</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/de/casinos" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
              Deutsche Casinos entdecken
            </Link>
            <Link href="/de/best-casinos" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
              Bewertungsmethodik
            </Link>
            <Link href="/de/compare" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
              Casinos vergleichen
            </Link>
            <Link href="/ai-casino-match" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
              KI-Matchmaker
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/de"
            className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors"
          >
            ← Zurück zur Deutschland-Startseite
          </Link>
        </div>
      </Container>
    </main>
  );
}
