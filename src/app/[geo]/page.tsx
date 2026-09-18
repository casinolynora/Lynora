import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { casinoDb } from "@/lib/data/accessor";

const SUPPORTED_GEOS = ["de", "fr", "nl", "be", "at", "it", "ch", "ie"] as const;
type Geo = typeof SUPPORTED_GEOS[number];

const geoConfig: Record<Geo, {
  name: string;
  flag: string;
  language: string;
  hasCasinoData: boolean;
  legalNote?: string;
}> = {
  de: { name: "Germany", flag: "🇩🇪", language: "de", hasCasinoData: true },
  fr: {
    name: "France",
    flag: "🇫🇷",
    language: "fr",
    hasCasinoData: false,
    legalNote: "Online casino games (slots, roulette, blackjack) are not permitted in France under ANJ regulations. Only sports betting, horse racing, and poker are licensed.",
  },
  nl: { name: "Netherlands", flag: "🇳🇱", language: "nl", hasCasinoData: true },
  be: { name: "Belgium", flag: "🇧🇪", language: "nl", hasCasinoData: true },
  at: { name: "Austria", flag: "🇦🇹", language: "de", hasCasinoData: false },
  it: { name: "Italy", flag: "🇮🇹", language: "it", hasCasinoData: false },
  ch: { name: "Switzerland", flag: "🇨🇭", language: "de", hasCasinoData: false },
  ie: { name: "Ireland", flag: "🇮🇪", language: "en", hasCasinoData: false },
};

type Props = {
  params: Promise<{ geo: string }>;
};

export function generateStaticParams() {
  return SUPPORTED_GEOS.map((geo) => ({ geo }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { geo } = await params;
  const config = geoConfig[geo as Geo];
  if (!config) return {};

  return {
    title: `Best Online Casinos in ${config.name} — BeInCasinos`,
    description: `Find the best online casinos in ${config.name} with BeInCasinos' independent reviews and comparisons. Personalized recommendations for ${config.name} players.`,
    alternates: {
      canonical: `/${geo}`,
      languages: {
        "en": `/${geo}`,
      },
    },
    openGraph: {
      title: `Best Online Casinos in ${config.name} — BeInCasinos`,
      description: `Independent casino reviews for ${config.name} players.`,
    },
  };
}

export default async function GeoPage({ params }: Props) {
  const { geo } = await params;
  const config = geoConfig[geo as Geo];

  if (!config) notFound();

  const casinos = config.hasCasinoData
    ? casinoDb.getCasinosByGeo(geo.toUpperCase())
    : [];

  return (
    <Container className="py-12 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{config.flag}</span>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Best Online Casinos in {config.name}
          </h1>
        </div>

        <p className="text-lg text-muted mb-8">
          Find the best online casinos available in {config.name} with BeInCasinos&apos;
          independent reviews and comparisons. Get personalized
          recommendations based on your preferences.
        </p>

        {/* France legal notice */}
        {config.legalNote && (
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 p-8 text-center mb-8">
            <p className="text-amber-800 dark:text-amber-200 font-semibold mb-2">
              Regulatory Notice
            </p>
            <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
              {config.legalNote}
            </p>
            <Button href="/ai-casino-match" variant="primary">
              Try AI Matchmaker
            </Button>
          </div>
        )}

        {/* Casino list for GEOs with data */}
        {config.hasCasinoData && casinos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              Licensed Casinos in {config.name} ({casinos.length})
            </h2>
            <div className="space-y-3">
              {casinos.map((casino) => (
                <Link
                  key={casino.id}
                  href={`/${geo}/${casino.slug}`}
                  className="block bg-surface-elevated rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{casino.name}</h3>
                      <p className="text-sm text-muted mt-0.5">{casino.tagline}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {casino.licenses.map((license, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-xs bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full"
                          >
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            {license.issuer} Licensed
                          </span>
                        ))}
                        {casino.hasLiveCasino && (
                          <span className="text-xs bg-surface-hover text-muted px-2 py-0.5 rounded-full">
                            Live Casino
                          </span>
                        )}
                        {casino.hasSportsBetting && (
                          <span className="text-xs bg-surface-hover text-muted px-2 py-0.5 rounded-full">
                            Sports
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {casino.minDeposit !== null && (
                        <p className="text-sm text-muted">
                          Min: <span className="font-semibold text-foreground">€{casino.minDeposit}</span>
                        </p>
                      )}
                      <p className="text-xs text-muted mt-1">
                        {casino.paymentMethods.slice(0, 3).map(pm => pm.name).join(", ")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder for GEOs without data */}
        {config.hasCasinoData && casinos.length === 0 && (
          <div className="bg-surface-elevated rounded-2xl border border-border p-8 text-center mb-8">
            <p className="text-muted mb-4">
              Casino data for {config.name} is being prepared.
            </p>
            <p className="text-sm text-muted mb-6">
              We are building verified casino profiles for {config.name} players.
              Check back soon for personalized recommendations.
            </p>
            <Button href="/ai-casino-match" variant="primary">
              Try AI Matchmaker
            </Button>
          </div>
        )}

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-3">Online Gambling in {config.name}</h2>
            <p className="text-muted leading-relaxed">
              Online gambling regulations in {config.name} require casinos to hold valid
              licenses. CasinoLynora only lists casinos that are licensed and available
              to players in {config.name}.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">How We Match Casinos for {config.name}</h2>
            <p className="text-muted leading-relaxed">
              Our AI-powered matching system considers:
            </p>
            <ul className="list-disc list-inside text-muted space-y-1">
              <li>Casinos licensed to operate in {config.name}</li>
              <li>Payment methods popular in {config.name}</li>
              <li>Currencies and languages used in {config.name}</li>
              <li>Your personal preferences for games, bonuses, and more</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Responsible Gambling</h2>
            <p className="text-muted leading-relaxed">
              Gambling should be entertaining. Never bet more than you can afford to lose.
              If you need help, visit our{' '}
              <Link href="/responsible-gambling" className="text-primary hover:underline">
                Responsible Gambling
              </Link>{' '}
              page for resources and support.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
