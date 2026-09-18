import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PLACEMENT_TRANSPARENCY_STATEMENT } from "@/lib/b2b/pricing";

export const metadata: Metadata = {
  title: "List Your Casino on BeInCasinos",
  description:
    "Join BeInCasinos' transparent casino comparison platform. Get your operator listed and discovered by European players across multiple GEOs.",
  alternates: { canonical: "/for-casinos" },
  openGraph: {
    title: "List Your Casino on BeInCasinos",
    description: "Get your operator listed and discovered by European players.",
  },
  twitter: {
    card: "summary",
    title: "List Your Casino on BeInCasinos",
    description: "Get your operator listed and discovered by European players.",
  },
};

const EU_GEOS = [
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Submit your application",
    description:
      "Fill out a brief form with your casino details, target GEOs, and preferred listing plan.",
  },
  {
    step: 2,
    title: "We review and verify",
    description:
      "Our team verifies licence information, operational status, and data accuracy against regulatory sources.",
  },
  {
    step: 3,
    title: "Your profile goes live",
    description:
      "Once approved, your casino profile is published with structured data, licence details, and verified information.",
  },
  {
    step: 4,
    title: "Players discover your casino",
    description:
      "European players searching for casinos that match their preferences can find and compare your offering.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How much does it cost to list my casino?",
    answer:
      "We offer multiple listing tiers to fit different needs. A basic listing is free. Verified, Featured, and Premium plans provide additional visibility and profile features at transparent monthly rates. Full pricing details are available on our pricing page.",
  },
  {
    question: "What information do you need to list a casino?",
    answer:
      "We require official website URL, operator name, licence information, target GEOs, and a business contact. All data is verified against official licence registries and regulatory sources before publication.",
  },
  {
    question: "Can I control what information appears on my profile?",
    answer:
      "Yes. Submitted data is structured and machine-readable. You can request profile updates at any time, and verified operators have priority for data corrections. All profile data includes provenance metadata.",
  },
  {
    question: "Does paying for a higher plan improve my casino's rating?",
    answer:
      "No. BeInCasinos ratings are based entirely on structured data analysis and transparent scoring algorithms. Paid placement may affect visibility or positioning on pages, but it never determines editorial scores or ratings.",
  },
];

export default function ForCasinosPage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        {/* Hero */}
        <section className="max-w-3xl mx-auto text-center mb-16 lg:mb-24">
          <Badge variant="brand" size="md" className="mb-6">
            For Casino Operators
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Get your casino discovered by European players
          </h1>
          <p className="text-lg text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
            BeInCasinos is a transparent comparison platform that helps players
            find casinos matching their preferences — using structured data, not
            editorial opinions. List your casino to reach players across multiple
            European markets.
          </p>
          <Button
            href="/for-casinos/list-your-casino"
            variant="brand"
            size="lg"
          >
            List Your Casino
          </Button>
        </section>

        {/* Why List Your Casino */}
        <section className="mb-16 lg:mb-24">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Why List on BeInCasinos?
            </h2>
            <p className="text-muted leading-relaxed">
              Reach players who are actively comparing casinos across multiple
              criteria — and let structured data speak for your offering.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                title: "Dedicated Casino Profile",
                description:
                  "A structured, machine-readable profile with licence details, payment methods, game providers, and verified data points.",
              },
              {
                title: "EU GEO Visibility",
                description:
                  "Reach players across Germany, Ireland, Netherlands, Belgium, France, Italy, Austria, and Switzerland.",
              },
              {
                title: "Comparison Exposure",
                description:
                  "Appear alongside verified operators in transparent comparison results driven by structured data, not editorial bias.",
              },
              {
                title: "Featured Placement",
                description:
                  "Optional Featured and Premium plans offer higher visibility within eligible category and GEO pages.",
              },
              {
                title: "Editorial Transparency",
                description:
                  "Your profile is built from verified data with full provenance. We never fabricate reviews, ratings, or testimonials.",
              },
              {
                title: "Structured Data Advantage",
                description:
                  "Machine-readable profiles that are indexed and compared against real player preferences by our matching engine.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card-static p-5 hover:border-brand-200 transition-colors"
              >
                <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16 lg:mb-24">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted leading-relaxed">
              A straightforward process from application to live profile.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full gradient-brand text-white font-bold text-sm mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* GEO Visibility */}
        <section className="mb-16 lg:mb-24">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              EU GEO Visibility
            </h2>
            <p className="text-muted leading-relaxed">
              Your casino profile is visible to players searching from these
              European markets.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {EU_GEOS.map((geo) => (
              <div
                key={geo.code}
                className="card-static p-4 flex items-center gap-3 justify-center hover:border-brand-200 transition-colors"
              >
                <span className="text-2xl">{geo.flag}</span>
                <div>
                  <p className="font-bold text-sm">{geo.name}</p>
                  <p className="text-xs text-muted">{geo.code}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Placement */}
        <section className="mb-16 lg:mb-24">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Featured Placement
            </h2>
            <p className="text-muted leading-relaxed">
              Upgrade your visibility with placement options that go beyond a
              basic listing.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                name: "Verified",
                description:
                  "Verified operator profile with badge and expanded details. Quarterly data reviews and priority support.",
              },
              {
                name: "Featured",
                description:
                  "Featured placement within eligible category and GEO pages. Higher visibility and monthly profile optimization.",
                featured: true,
              },
              {
                name: "Premium",
                description:
                  "Premium placement on high-traffic pages with featured content opportunities and dedicated account support.",
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`card-static p-6 ${
                  tier.featured ? "border-brand-300" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold">{tier.name}</h3>
                  {tier.featured && (
                    <Badge variant="brand" size="sm">
                      Popular
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Transparency Statement */}
        <section className="mb-16 lg:mb-24">
          <div className="max-w-3xl mx-auto">
            <div className="card-static p-6">
              <h2 className="font-bold text-sm mb-3">Placement Transparency</h2>
              <p className="text-sm text-muted leading-relaxed">
                {PLACEMENT_TRANSPARENCY_STATEMENT}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16 lg:mb-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question} className="card-static p-6">
                  <h3 className="font-bold text-sm mb-2">{item.question}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-3xl mx-auto text-center">
          <div className="gradient-brand-subtle rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to get listed?
            </h2>
            <p className="text-muted leading-relaxed mb-8 max-w-xl mx-auto">
              Submit your application and join operators reaching European
              players through transparent, data-driven casino comparison.
            </p>
            <Button
              href="/for-casinos/list-your-casino"
              variant="brand"
              size="lg"
            >
              List Your Casino
            </Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
