import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CasinoCard } from "@/components/casino/CasinoCard";
import { Badge } from "@/components/ui/Badge";
import { casinoDb } from "@/lib/data/accessor";

export default function HomePage() {
  const featuredCasinos = casinoDb.getFeaturedCasinos();
  const latestCasinos = casinoDb.getLatestCasinos();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCA0MGwyMC0yME0yMCAyMGwyMCAyME00MCAyMGwtMjAtMjBNMjAgMGwyMCAyME0wIDIwbDIwIDIwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-30" />
        <Container className="relative py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="default" size="md" className="bg-white/10 text-white border-white/20 mb-6">
              AI-Powered Casino Matching
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Find the casino that fits you.
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Answer a few questions and let CasinoLynora match you with casinos based on your preferences.
              No guesswork. No fake reviews. Just transparent, data-driven recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/ai-casino-match" variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Find My Casino
              </Button>
              <Button href="/casinos" variant="ghost" size="lg" className="text-white border border-white/30 hover:bg-white/10">
                Explore Casinos
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-surface">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted max-w-lg mx-auto">
              Three simple steps to find your perfect casino match.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Answer Questions",
                description: "Tell us about your preferences — country, budget, payment methods, favorite games.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "AI Analysis",
                description: "Our engine analyzes structured casino data against your preferences with transparent scoring.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Get Matched",
                description: "Receive personalized recommendations with clear explanations of why each casino fits you.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-surface-elevated rounded-2xl p-8 border border-border text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary text-white font-bold text-lg mb-4">
                  {item.step}
                </div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Casinos */}
      <section className="py-16 lg:py-24 bg-background">
        <Container>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Top Rated Casinos</h2>
              <p className="text-muted">Our highest-rated casinos based on verified data.</p>
            </div>
            <Link href="/casinos" className="hidden sm:inline-flex text-sm font-medium text-primary hover:text-primary-light transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredCasinos.map((casino) => (
              <CasinoCard key={casino.id} casino={casino} showFullInfo />
            ))}
          </div>
          <div className="sm:hidden mt-6 text-center">
            <Button href="/casinos" variant="secondary" size="sm">View All Casinos</Button>
          </div>
        </Container>
      </section>

      {/* Why CasinoLynora */}
      <section className="py-16 lg:py-24 bg-surface-elevated">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why CasinoLynora</h2>
            <p className="text-muted max-w-lg mx-auto">
              We are different from typical casino review sites.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Transparent Data",
                description: "Every casino profile is built from structured, verified data. We show you exactly what we know.",
                icon: "🔍",
              },
              {
                title: "AI-Powered Matching",
                description: "Our recommendation engine uses deterministic scoring, not subjective opinions.",
                icon: "🧠",
              },
              {
                title: "No Fake Reviews",
                description: "We do not publish fabricated user reviews or testimonials. All data is editorial and verified.",
                icon: "✓",
              },
              {
                title: "Responsible Gambling",
                description: "We promote responsible gambling and never encourage harmful behavior.",
                icon: "🛡",
              },
            ].map((item) => (
              <div key={item.title} className="bg-surface rounded-2xl p-6 border border-border">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Comparison Preview */}
      <section className="py-16 lg:py-24 bg-background">
        <Container>
          <div className="bg-surface rounded-2xl border border-border p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-3">Compare Casinos Side-by-Side</h2>
                <p className="text-muted mb-6 max-w-lg">
                  Make informed decisions. Compare ratings, bonuses, payment methods, withdrawal times, and more.
                </p>
                <Button href="/compare" variant="primary">
                  Start Comparing
                </Button>
              </div>
              <div className="flex-1 bg-surface-elevated rounded-xl p-6 border border-border/50">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Side-by-side feature comparison</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Ratings, bonuses, and payment methods</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Instant comparison — no sign-up required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Latest Reviews */}
      <section className="py-16 lg:py-24 bg-surface-elevated">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Latest Casino Reviews</h2>
            <p className="text-muted">Independently reviewed and verified casino profiles.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestCasinos.slice(0, 6).map((casino) => (
              <CasinoCard key={casino.id} casino={casino} />
            ))}
          </div>
        </Container>
      </section>

      {/* Responsible Gambling */}
      <section className="py-16 lg:py-24 bg-background">
        <Container>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-border p-8 lg:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Play Responsibly</h2>
            <p className="text-muted max-w-2xl mx-auto mb-6">
              Gambling should be entertaining, not a way to make money. Never bet more than you can afford to lose.
              If you or someone you know has a gambling problem, seek help immediately.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/responsible-gambling" variant="secondary">
                Responsible Gambling Guide
              </Button>
              <a
                href="https://www.begambleaware.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-primary transition-colors"
              >
                Get Help →
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* SEO Content */}
      <section className="py-16 lg:py-24 bg-surface">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">About CasinoLynora</h2>
            <div className="prose prose-sm text-muted space-y-4">
              <p>
                CasinoLynora is an independent casino comparison platform designed for European players.
                Unlike traditional casino review sites, we use a data-driven approach to help you find casinos
                that match your specific preferences.
              </p>
              <p>
                Our AI-powered matching system analyzes structured casino data including licensing, payment methods,
                game availability, bonus terms, and withdrawal processing times to generate personalized recommendations.
                Every piece of information is sourced from verified data, and we clearly indicate when information
                has been last verified.
              </p>
              <p>
                We believe in transparency. Every casino profile on CasinoLynora includes our scoring methodology,
                affiliate disclosure, and the date when information was last verified. We never publish fake reviews
                or fabricated testimonials.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
