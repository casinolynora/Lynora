import { Casino } from "@/lib/types";
import { ProsCons } from "./ProsCons";
import { KeyFacts } from "./KeyFacts";
import { FAQSection } from "./FAQSection";
import { TrustBadge } from "./TrustBadge";
import { AffiliateCTA } from "./AffiliateCTA";
import { AffiliateDisclosure } from "./AffiliateDisclosure";

type CasinoReviewPageProps = {
  casino: Casino;
  geo?: string;
};

export function CasinoReviewPage({ casino, geo = "INT" }: CasinoReviewPageProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{casino.name}</h1>
          {casino.tagline && (
            <p className="text-muted text-lg mb-4">{casino.tagline}</p>
          )}
          <TrustBadge
            verificationStatus={casino.verificationStatus}
            lastVerifiedAt={casino.lastVerifiedAt}
          />
        </div>

        {/* Overview */}
        <section>
          <h2 className="text-xl font-bold mb-3">Overview</h2>
          <p className="text-muted leading-relaxed">{casino.review.overview}</p>
        </section>

        {/* Pros & Cons */}
        <section>
          <h2 className="text-xl font-bold mb-3">Pros & Cons</h2>
          <ProsCons pros={casino.review.pros} cons={casino.review.cons} />
        </section>

        {/* Verdict */}
        <section className="bg-surface-elevated rounded-xl border border-border p-6">
          <h2 className="text-xl font-bold mb-3">Verdict</h2>
          <p className="text-muted leading-relaxed">{casino.review.verdict}</p>
        </section>

        {/* FAQ */}
        {casino.review.faq && casino.review.faq.length > 0 && (
          <FAQSection faqs={casino.review.faq} />
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* CTA */}
        <div className="bg-surface-elevated rounded-xl border border-border p-6 sticky top-24">
          <div className="text-center mb-4">
            {casino.rating !== null ? (
              <>
                <div className="text-3xl font-bold text-primary mb-1">{casino.rating}/100</div>
                <div className="text-sm text-muted">Expert Rating</div>
              </>
            ) : (
              <div className="text-sm text-muted">Rating pending verification</div>
            )}
          </div>
          <AffiliateCTA
            affiliateOffers={casino.affiliateOffers}
            geo={geo}
            fullWidth
            size="lg"
          />
          <AffiliateDisclosure variant="inline" className="mt-4" />
        </div>

        {/* Key Facts */}
        <KeyFacts casino={casino} />
      </div>
    </div>
  );
}
