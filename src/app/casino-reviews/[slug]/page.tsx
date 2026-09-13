import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { RatingDisplay } from "@/components/casino/RatingDisplay";
import { AffiliateCTA } from "@/components/casino/AffiliateCTA";
import { DataFreshness } from "@/components/casino/DataFreshness";
import { AffiliateDisclosure } from "@/components/casino/AffiliateDisclosure";
import { Badge } from "@/components/ui/Badge";
import { CasinoGrid } from "@/components/casino/CasinoGrid";
import { casinoDb } from "@/lib/data/accessor";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const casino = casinoDb.getCasinoBySlug(slug);
  if (!casino) return { title: "Casino Not Found" };

  const ratingText = casino.rating !== null ? `Rating: ${casino.rating}/100.` : "";
  return {
    title: `${casino.name} Review — Is It Worth Playing? | CasinoLynora`,
    description: `${casino.review.overview.slice(0, 150)} ${ratingText}`.trim(),
    openGraph: {
      title: `${casino.name} Review — CasinoLynora`,
      description: casino.review.overview.slice(0, 200),
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${casino.name} Review — CasinoLynora`,
      description: casino.review.overview.slice(0, 200),
    },
    alternates: {
      canonical: `/casino-reviews/${slug}`,
    },
  };
}

export default async function CasinoReviewPage({ params }: Props) {
  const { slug } = await params;
  const casino = casinoDb.getCasinoBySlug(slug);
  if (!casino) notFound();

  const relatedCasinos = casinoDb.getRelatedCasinos(casino.id, 4);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: casino.name,
      description: casino.review.overview,
      brand: { "@type": "Organization", name: casino.owner || casino.name },
    },
    ...(casino.rating !== null && {
      reviewRating: {
        "@type": "Rating",
        ratingValue: casino.rating,
        bestRating: 100,
      },
    }),
    author: { "@type": "Organization", name: "CasinoLynora" },
    datePublished: casino.lastVerifiedAt,
  };

  const faqSchema = casino.review.faq && casino.review.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: casino.review.faq.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Container className="py-8 lg:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/casinos" className="hover:text-primary transition-colors">Casinos</Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground font-medium">{casino.name}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-bold">{casino.name}</h1>
              {casino.trustScore && casino.trustScore >= 90 && (
                <Badge variant="success">Top Rated</Badge>
              )}
            </div>
            {casino.tagline && (
              <p className="text-lg text-muted mb-4">{casino.tagline}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {casino.licenses.map(l => (
                <Badge key={l.issuer} variant="info">{l.issuer} — {l.jurisdiction}</Badge>
              ))}
            </div>
            <div className="text-sm text-muted">
              <DataFreshness lastVerifiedAt={casino.lastVerifiedAt} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 lg:min-w-[220px]">
            <RatingDisplay rating={casino.rating} size="lg" />
            <AffiliateCTA affiliateOffers={casino.affiliateOffers} size="lg" fullWidth />
          </div>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted leading-relaxed mb-6">{casino.review.overview}</p>

            {/* Score Breakdown */}
            {casino.review.scoreBreakdown && (
              <div className="bg-surface-elevated rounded-xl p-6 border border-border mb-6">
                <h3 className="font-bold mb-4">Score Breakdown</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(casino.review.scoreBreakdown).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-muted capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full gradient-primary rounded-full"
                            style={{ width: `${(value / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{value}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            <div className="bg-surface-elevated rounded-xl p-6 border border-border">
              <h3 className="font-bold mb-4">Quick Facts</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Min Deposit</dt>
                  <dd className="font-medium">€{casino.minDeposit}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Max Deposit</dt>
                  <dd className="font-medium">{casino.maxDeposit ? `€${casino.maxDeposit.toLocaleString()}` : "N/A"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Min Withdrawal</dt>
                  <dd className="font-medium">{casino.minWithdrawal ? `€${casino.minWithdrawal}` : "N/A"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Withdrawal Speed</dt>
                  <dd className="font-medium">{casino.withdrawalProcessingTime ?? "N/A"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Live Casino</dt>
                  <dd className="font-medium">{casino.hasLiveCasino ? "Yes" : "No"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Sports Betting</dt>
                  <dd className="font-medium">{casino.hasSportsBetting ? "Yes" : "No"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">KYC Required</dt>
                  <dd className="font-medium">{casino.kycRequired ? "Yes" : "No"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Countries</dt>
                  <dd className="font-medium">{casino.countries.length} available</dd>
                </div>
              </dl>
            </div>

            <div className="bg-surface-elevated rounded-xl p-6 border border-border">
              <h3 className="font-bold mb-3">Payment Methods</h3>
              <div className="flex flex-wrap gap-2">
                {casino.paymentMethods.map(pm => (
                  <Badge key={pm.name} variant="default" size="sm">{pm.name}</Badge>
                ))}
              </div>
            </div>

            <div className="bg-surface-elevated rounded-xl p-6 border border-border">
              <h3 className="font-bold mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {casino.languages.map(lang => (
                  <Badge key={lang} variant="default" size="sm">{lang}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bonuses */}
        {casino.bonuses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Bonuses & Promotions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {casino.bonuses.map((bonus, i) => (
                <div key={i} className="bg-surface-elevated rounded-xl p-5 border border-border">
                  <Badge variant="primary" size="sm" className="mb-2">{bonus.type}</Badge>
                  <h3 className="font-bold mb-1">{bonus.title}</h3>
                  <p className="text-sm text-muted mb-2">{bonus.description}</p>
                  {bonus.wageringRequirement && (
                    <p className="text-xs text-muted">Wagering: {bonus.wageringRequirement}</p>
                  )}
                  {bonus.minDeposit && (
                    <p className="text-xs text-muted">Min deposit: €{bonus.minDeposit}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Games */}
        {casino.games.filter(g => g.available).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Available Games</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {casino.games.filter(g => g.available).map((game) => (
                <div key={game.name} className="bg-surface-elevated rounded-xl p-4 border border-border text-center">
                  <div className="text-sm font-medium">{game.name}</div>
                  {game.count && <div className="text-xs text-muted mt-1">{game.count}+ games</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
            <h3 className="font-bold text-emerald-800 mb-3">Pros</h3>
            <ul className="space-y-2">
              {casino.review.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span> {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <h3 className="font-bold text-red-800 mb-3">Cons</h3>
            <ul className="space-y-2">
              {casino.review.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">-</span> {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Verdict */}
        <div className="bg-surface-elevated rounded-2xl p-8 border border-border mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Verdict</h2>
          <p className="text-muted leading-relaxed mb-6">{casino.review.verdict}</p>
          <AffiliateCTA affiliateOffers={casino.affiliateOffers} size="lg" />
        </div>

        {/* FAQ */}
        {casino.review.faq && casino.review.faq.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {casino.review.faq.map((item, i) => (
                <details key={i} className="bg-surface-elevated rounded-xl border border-border overflow-hidden">
                  <summary className="px-6 py-4 font-medium cursor-pointer hover:bg-surface transition-colors">
                    {item.question}
                  </summary>
                  <div className="px-6 pb-4 text-sm text-muted leading-relaxed">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Methodology & Trust */}
        <div className="mb-12 bg-surface rounded-2xl border border-border p-6 lg:p-8">
          <h2 className="text-2xl font-bold mb-4">Our Methodology</h2>
          <div className="prose prose-sm text-muted space-y-4">
            <p>
              Every CasinoLynora profile is built from structured, verified data. Our scoring
              system analyzes {casino.review.scoreBreakdown ? Object.keys(casino.review.scoreBreakdown).length : 6} categories
              including licensing, payment methods, game selection, bonus terms, and withdrawal
              processing times.
            </p>
            <p>
              We do not publish fabricated reviews, fake testimonials, or unverifiable claims.
              Every piece of information is sourced from verified data, and we clearly indicate
              when information has been last verified.
            </p>
            <p>
              This profile was last verified on <strong>{casino.lastVerifiedAt}</strong>.
              Casino availability, bonuses, and terms may change. Always verify current
              information on the casino&apos;s official website before playing.
            </p>
          </div>
        </div>

        {/* Responsible Gambling Note */}
        <div className="bg-gray-50 rounded-xl p-6 border border-border mb-12">
          <h3 className="font-bold mb-2">Responsible Gambling</h3>
          <p className="text-sm text-muted">
            Gambling should be entertaining. Never bet more than you can afford to lose.
            If you need help, visit{' '}
            <a href="https://www.begambleaware.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              BeGambleAware
            </a>.
          </p>
        </div>

        {/* Affiliate Disclosure */}
        <AffiliateDisclosure variant="banner" className="mb-12" />

        {/* Related Casinos */}
        {relatedCasinos.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Casinos</h2>
            <CasinoGrid casinos={relatedCasinos} />
          </div>
        )}
      </Container>
    </>
  );
}
