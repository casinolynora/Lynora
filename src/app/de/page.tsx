import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CasinoGrid } from "@/components/casino/CasinoGrid";
import { createGermanyProvider } from "@/lib/data/germany-provider";

export const metadata: Metadata = {
  title: "Online Casinos in Germany — CasinoLynora",
  description: "Browse GGL-licensed online casinos available in Germany. Verified data on licenses, payment methods, and responsible gambling features.",
  alternates: {
    canonical: "https://casinolynora.com/de",
  },
  openGraph: {
    title: "Online Casinos in Germany — CasinoLynora",
    description: "GGL-licensed online casinos with verified data for German players.",
  },
  twitter: {
    card: "summary",
    title: "Online Casinos in Germany — CasinoLynora",
    description: "GGL-licensed online casinos with verified data for German players.",
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
            <h1 className="text-3xl sm:text-4xl font-bold">Online Casinos in Germany</h1>
          </div>
          <p className="text-lg text-muted leading-relaxed">
            Browse GGL-licensed online casinos available to German players.
            Every listing includes verified data on licenses, payment methods, and responsible gambling features.
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
              <h2 className="text-xl font-bold mb-2">Casino Listings Coming Soon</h2>
              <p className="text-muted mb-6">
                We are preparing verified casino profiles for the German market.
                Each listing will include verified information about GGL licenses,
                payment methods, and responsible gambling features.
              </p>
              <Button href="/ai-casino-match" variant="primary">
                Try AI Matchmaker Instead
              </Button>
            </div>
          </div>
        )}

        {/* SEO content */}
        <div className="max-w-3xl mt-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">Online Gambling in Germany</h2>
              <p className="text-muted leading-relaxed">
                Online gambling in Germany is regulated by the Gemeinsame Glücksspielbehörde (GGL),
                the joint gambling authority. Casinos must hold a valid GGL license to operate legally.
                CasinoLynora only lists casinos that are licensed and available to German players.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">How We Match Casinos</h2>
              <p className="text-muted leading-relaxed">
                Our AI-powered matching system considers GGL licensing, payment methods popular
                in Germany (PayPal, Klarna, Sofort), Euro currency support, German language
                support, and your personal preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Responsible Gambling</h2>
              <p className="text-muted leading-relaxed">
                Gambling should be entertaining, not a way to make money. Never bet more than you
                can afford to lose. Visit our{" "}
                <Link href="/responsible-gambling" className="text-brand-700 font-medium hover:underline">
                  responsible gambling page
                </Link>{" "}
                for resources and support.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
