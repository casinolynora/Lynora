import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Online Casinos in Ireland — BeInCasinos",
  description:
    "Discover regulated online casinos in Ireland. BeInCasinos provides transparent, data-driven guidance for Irish players.",
  alternates: { canonical: "/ie" },
  openGraph: {
    title: "Online Casinos in Ireland — BeInCasinos",
    description: "Data-driven casino guidance for Irish players.",
  },
  twitter: {
    card: "summary",
    title: "Online Casinos in Ireland — BeInCasinos",
    description: "Data-driven casino guidance for Irish players.",
  },
};

export default function IrelandPage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🇮🇪</span>
            <h1 className="text-3xl sm:text-4xl font-bold">Online Casinos in Ireland</h1>
          </div>
          <p className="text-lg text-muted leading-relaxed">
            BeInCasinos helps Irish players find regulated online casinos using transparent,
            data-driven matching. We verify licensing, payment methods, and responsible gambling
            features so you can make informed decisions.
          </p>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mb-16">
          <div className="card-static p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Find Your Casino Match</h2>
            <p className="text-muted mb-6">
              Answer a few questions about your preferences. Our AI-powered matchmaker
              analyses verified casino data to find options that suit you.
            </p>
            <Button href="/ai-casino-match" variant="primary">
              Try AI Matchmaker
            </Button>
          </div>
        </div>

        {/* SEO content */}
        <div className="max-w-3xl">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">Online Gambling Regulation in Ireland</h2>
              <p className="text-muted leading-relaxed">
                Online gambling in Ireland is regulated under the Gaming and Lotteries Act 1956
                (as amended) and the Betting Act 1958. The Irish government has been working on
                updated regulatory frameworks to address the modern online gambling landscape.
                Players should ensure any casino they use holds appropriate licensing and operates
                legally within Irish jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">What to Look for in an Irish Casino</h2>
              <p className="text-muted leading-relaxed">
                When choosing an online casino, Irish players should consider several factors:
                valid licensing from recognised regulatory bodies, support for Euro (EUR) transactions,
                payment methods popular in Ireland (such as Visa, Mastercard, PayPal, and Revolut),
                responsible gambling tools, and clear terms and conditions. BeInCasinos&apos; matching
                algorithm evaluates these factors to help you find suitable options.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">How BeInCasinos Works</h2>
              <p className="text-muted leading-relaxed">
                BeInCasinos does not directly accept bets or facilitate gambling. Instead, we
                aggregate and verify publicly available information about licensed online casinos.
                Our AI-powered matching engine analyses this structured data against your stated
                preferences to provide transparent, data-driven recommendations. We earn revenue
                through affiliate partnerships when users choose to visit casino sites through
                our links.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Responsible Gambling</h2>
              <p className="text-muted leading-relaxed">
                Gambling involves financial risk and should never be seen as a way to make money.
                Only gamble where it is legal for you to do so, never bet more than you can afford
                to lose, and avoid chasing losses. If gambling stops being enjoyable, seek help.
              </p>
              <p className="text-muted leading-relaxed mt-3">
                Visit our{" "}
                <Link href="/responsible-gambling" className="text-brand-700 font-medium hover:underline">
                  responsible gambling page
                </Link>{" "}
                for support resources and practical tips for safe play.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Important Notices</h2>
              <p className="text-muted leading-relaxed">
                You must be of legal gambling age in your jurisdiction to use this website.
                BeInCasinos provides information for educational and comparison purposes.
                We do not guarantee the accuracy of third-party information and encourage
                players to verify details directly with casino operators. Always read the
                terms and conditions of any casino before creating an account or depositing
                funds.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
