import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const SUPPORTED_GEOS = ["de", "fr", "nl", "be", "at", "it", "ch"] as const;
type Geo = typeof SUPPORTED_GEOS[number];

const geoConfig: Record<Geo, { name: string; flag: string; language: string }> = {
  de: { name: "Germany", flag: "🇩🇪", language: "de" },
  fr: { name: "France", flag: "🇫🇷", language: "fr" },
  nl: { name: "Netherlands", flag: "🇳🇱", language: "nl" },
  be: { name: "Belgium", flag: "🇧🇪", language: "nl" },
  at: { name: "Austria", flag: "🇦🇹", language: "de" },
  it: { name: "Italy", flag: "🇮🇹", language: "it" },
  ch: { name: "Switzerland", flag: "🇨🇭", language: "de" },
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
    title: `Best Online Casinos in ${config.name} — CasinoLynora`,
    description: `Find the best online casinos in ${config.name} with CasinoLynora's AI-powered matching. Personalized recommendations for ${config.name} players.`,
    alternates: {
      canonical: `https://casinolynora.com/${geo}`,
      languages: {
        "en": `https://casinolynora.com/${geo}`,
      },
    },
    openGraph: {
      title: `Best Online Casinos in ${config.name} — CasinoLynora`,
      description: `AI-powered casino matching for ${config.name} players.`,
    },
  };
}

export default async function GeoPage({ params }: Props) {
  const { geo } = await params;
  const config = geoConfig[geo as Geo];

  if (!config) notFound();

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
          Find the best online casinos available in {config.name} with CasinoLynora&apos;s
          AI-powered matching system. Answer a few questions and get personalized
          recommendations based on your preferences.
        </p>

        {/* Placeholder — requires real casino data */}
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
