import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  PRICING_TIERS,
  formatPrice,
  PLACEMENT_TRANSPARENCY_STATEMENT,
} from "@/lib/b2b/pricing";

export const metadata: Metadata = {
  title: "Casino Listing & Featured Placement Pricing",
  description:
    "Review CasinoLynora's transparent pricing for casino listings, verified profiles, featured placement, and premium B2B packages.",
  alternates: { canonical: "/for-casinos/pricing" },
};

export default function PricingPage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Casino Listing &amp; Featured Placement Pricing
          </h1>
          <p className="text-muted leading-relaxed">
            Choose the plan that fits your visibility goals. All plans require
            manual approval — pricing is subject to change.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={
                tier.highlighted
                  ? "card-premium p-6 flex flex-col border-2 border-brand-400"
                  : "card-static p-6 flex flex-col"
              }
            >
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-bold">{tier.name}</h2>
                {tier.highlighted && (
                  <Badge variant="primary" size="sm">
                    Highlighted
                  </Badge>
                )}
              </div>

              <p className="text-2xl font-bold text-brand-700 mb-3">
                {formatPrice(tier.monthlyPrice)}
              </p>

              <p className="text-sm text-muted leading-relaxed mb-5">
                {tier.description}
              </p>

              <ul className="space-y-2.5 mb-6 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <span className="text-brand-600 mt-0.5 shrink-0">✓</span>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                href={`/for-casinos/list-your-casino?plan=${tier.id}`}
                variant={tier.highlighted ? "brand" : "primary"}
                size="md"
                fullWidth
              >
                {tier.ctaText}
              </Button>
            </div>
          ))}
        </div>

        <section className="mt-12 max-w-3xl mx-auto space-y-6">
          <div className="card-static p-6">
            <h2 className="text-lg font-bold mb-2">Placement Transparency</h2>
            <p className="text-sm text-muted leading-relaxed">
              {PLACEMENT_TRANSPARENCY_STATEMENT}
            </p>
          </div>

          <p className="text-xs text-muted text-center">
            Pricing is subject to change. All plans require manual approval
            before activation.
          </p>
        </section>
      </Container>
    </main>
  );
}
