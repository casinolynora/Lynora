import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CasinoCard } from "@/components/casino/CasinoCard";
import { casinoDb } from "@/lib/data/accessor";

export const metadata: Metadata = {
  title: "BeInCasinos — Independent Casino Reviews & Comparisons",
  description:
    "Independent casino reviews and comparisons for European players. Structured, verified data on licenses, payment methods, and responsible gambling features for transparent decision-making.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "BeInCasinos — Independent Casino Reviews & Comparisons",
    description: "Independent casino reviews and comparisons for European players.",
  },
};

export default function HomePage() {
  const featuredCasinos = casinoDb.getFeaturedCasinos();

  return (
    <main id="main-content">
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <Container className="relative z-10 py-16 sm:py-20 lg:py-28">
          <div className="max-w-3xl">
            <Badge variant="primary" size="md" className="mb-6 border-brand-600/30 bg-brand-400/10 text-brand-200">
              <span className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse-subtle" />
              Independent Casino Reviews & Comparisons
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 text-balance">
              Find your casino.
              <br />
              <span className="text-slate-300">Based on data, not hype.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300/90 max-w-2xl mb-10 leading-relaxed">
              BeInCasinos matches you with licensed European casinos using structured, verified data
              and a transparent scoring algorithm. No fake reviews. No guesswork.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button href="/ai-casino-match" variant="brand" size="lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Matching
              </Button>
              <Button href="/casinos" variant="ghost" size="lg" className="text-slate-300 hover:text-white hover:bg-white/10 border border-white/10">
                Explore Casinos
              </Button>
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Verified data only</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Transparent scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>No fake reviews</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white border-b border-border">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-accent-600 uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Three steps to your match</h2>
            <p className="text-muted text-lg">
              Our algorithm analyzes structured casino data against your preferences with transparent scoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Tell us what you want",
                description: "Answer questions about your country, budget, preferred payment methods, and favorite games.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "We analyze the data",
                description: "Our engine scores casinos across multiple dimensions using verified, structured data — not opinions.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Get a personalized match",
                description: "Receive casinos ranked by fit, with clear explanations of why each one matches your preferences.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-brand-50 text-brand-700 border border-brand-200">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-text-faint tracking-wider">STEP {item.step}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Featured Casinos ──────────────────────────────────────── */}
      {featuredCasinos.length > 0 && (
        <section className="py-16 lg:py-24 bg-bg">
          <Container>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-sm font-semibold text-accent-600 uppercase tracking-wider mb-2">Featured</p>
                <h2 className="text-3xl font-bold">Verified Casinos</h2>
              </div>
              <Link
                href="/casinos"
                className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors"
              >
                View all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredCasinos.map((casino) => (
                <CasinoCard key={casino.id} casino={casino} showFullInfo />
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Button href="/casinos" variant="secondary" size="sm">
                View All Casinos
              </Button>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Why BeInCasinos ──────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white border-y border-border">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-accent-600 uppercase tracking-wider mb-3">Why BeInCasinos</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built on transparency</h2>
            <p className="text-muted text-lg">
              We are not another review site. We are a data-driven discovery platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Structured Data",
                description: "Every casino profile is built from verified, structured data — licensing, payments, games, and more.",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                  </svg>
                ),
              },
              {
                title: "Deterministic Matching",
                description: "Our scoring algorithm is based on weighted data points, not subjective opinions or affiliate incentives.",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                ),
              },
              {
                title: "No Fake Reviews",
                description: "We never publish fabricated user reviews, fake testimonials, or unverifiable claims.",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                ),
              },
              {
                title: "Responsible Gambling",
                description: "We promote safe play and never encourage excessive gambling. 18+ only.",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-[var(--radius-xl)] border border-border bg-bg-subtle hover:bg-white hover:border-brand-200 hover:shadow-md transition-all duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-brand-50 text-brand-700 border border-brand-100 mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── GEO Hub Links ────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-white border-t border-border">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Casinos by Country</h2>
            <p className="text-muted leading-relaxed">
              Browse casino information and guides for your country.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { href: "/de", flag: "🇩🇪", name: "Germany" },
              { href: "/gb", flag: "🇬🇧", name: "Great Britain" },
              { href: "/nl", flag: "🇳🇱", name: "Netherlands" },
              { href: "/be", flag: "🇧🇪", name: "Belgium" },
              { href: "/fr", flag: "🇫🇷", name: "France" },
              { href: "/at", flag: "🇦🇹", name: "Austria" },
              { href: "/it", flag: "🇮🇹", name: "Italy" },
              { href: "/ch", flag: "🇨🇭", name: "Switzerland" },
              { href: "/ie", flag: "🇮🇪", name: "Ireland" },
              { href: "/se", flag: "🇸🇪", name: "Sweden" },
              { href: "/fi", flag: "🇫🇮", name: "Finland" },
              { href: "/no", flag: "🇳🇴", name: "Norway" },
            ].map((geo) => (
              <Link
                key={geo.href}
                href={geo.href}
                className="flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border border-border bg-bg-subtle hover:bg-white hover:border-brand-200 hover:shadow-sm transition-all"
              >
                <span className="text-2xl">{geo.flag}</span>
                <span className="font-medium text-sm">{geo.name}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/guides" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
              Browse all guides →
            </Link>
            <Link href="/compare" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
              Compare casinos →
            </Link>
            <Link href="/payments" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
              Payment methods →
            </Link>
            <Link href="/methodology" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
              How we review →
            </Link>
          </div>
        </Container>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-bg">
        <Container>
          <div className="relative overflow-hidden rounded-[var(--radius-2xl)] gradient-brand p-8 sm:p-12 lg:p-16 text-center">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")" }} />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to find your match?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Answer a few questions and let our algorithm find casinos that fit your preferences.
              </p>
              <Button href="/ai-casino-match" variant="secondary" size="lg" className="bg-white text-brand-800 hover:bg-slate-50 border-0">
                Start the Matchmaker
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Responsible Gambling ──────────────────────────────────── */}
      <section className="py-12 lg:py-16 bg-white border-t border-border">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200 mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Play Responsibly</h3>
            <p className="text-muted leading-relaxed mb-4">
              Gambling should be entertaining, not a way to make money. Never bet more than you can
              afford to lose. If you need help, visit{" "}
              <Link href="/responsible-gambling" className="text-brand-700 font-medium hover:underline">
                our responsible gambling page
              </Link>{" "}
              for resources and support.
            </p>
            <p className="text-sm text-text-faint">Must be 18+ to play.</p>
          </div>
        </Container>
      </section>
    </main>
  );
}
