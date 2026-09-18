import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AffiliateDisclosure } from "@/components/casino/AffiliateDisclosure";
import { AffiliateCTA } from "@/components/casino/AffiliateCTA";
import { casinoDb } from "@/lib/data/accessor";
import {
  CasinoHero,
  CasinoQuickFacts,
  EditorialReview,
  TrustSection,
  BonusSection,
  PaymentMethods,
  GamesSection,
  ResponsibleGambling,
  CasinoFAQ,
  RelatedCasinos,
} from "@/components/casino/v2";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const casino = casinoDb.getCasinoBySlug(slug);
  if (!casino) return { title: "Casino Not Found" };

  const ratingText = casino.rating !== null ? `Rating: ${casino.rating}/100.` : "";
  const licenseText =
    casino.licenses.length > 0
      ? ` Licensed by ${casino.licenses[0].issuer}.`
      : "";

  return {
    title: `${casino.name} Review — Is It Worth Playing? | BeInCasinos`,
    description: `${casino.review.overview.slice(0, 150)}${ratingText}${licenseText}`.trim(),
    openGraph: {
      title: `${casino.name} Review — BeInCasinos`,
      description: casino.review.overview.slice(0, 200),
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${casino.name} Review — BeInCasinos`,
      description: casino.review.overview.slice(0, 200),
    },
    alternates: {
      canonical: `/casino-reviews/${slug}`,
    },
  };
}

export default async function CasinoProfileV2({ params }: Props) {
  const { slug } = await params;
  const casino = casinoDb.getCasinoBySlug(slug);
  if (!casino) notFound();

  const relatedCasinos = casinoDb.getRelatedCasinos(casino.id, 4);

  // Schema.org structured data
  const reviewSchema = {
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
    author: { "@type": "Organization", name: "BeInCasinos" },
    datePublished: casino.lastVerifiedAt,
  };

  const faqSchema =
    casino.review.faq && casino.review.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: casino.review.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://casinolynora.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Casinos",
        item: "https://casinolynora.com/casinos",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: casino.name,
        item: `https://casinolynora.com/casino-reviews/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Container className="py-8 lg:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/casinos" className="hover:text-primary transition-colors">
            Casinos
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground font-medium">{casino.name}</span>
        </nav>

        {/* Hero Section */}
        <CasinoHero casino={casino} />

        {/* Main Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <EditorialReview casino={casino} />
            <TrustSection casino={casino} />
            <BonusSection bonuses={casino.bonuses} />
            <PaymentMethods
              paymentMethods={casino.paymentMethods}
              withdrawalMethods={casino.withdrawalMethods}
            />
            <GamesSection games={casino.games} />
            <ResponsibleGambling responsibleGambling={casino.responsibleGambling} />
            <CasinoFAQ casino={casino} />

            {/* Methodology */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Our Methodology</h2>
              <div className="card-static p-6 text-sm text-muted leading-relaxed space-y-3">
                <p>
                  Every BeInCasinos profile is built from structured, verified data. Our scoring
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
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sticky CTA Card */}
            <div className="card-static p-6 sticky top-24">
              <AffiliateCTA affiliateOffers={casino.affiliateOffers} size="lg" fullWidth />
              <AffiliateDisclosure variant="inline" className="mt-4" />
            </div>

            {/* Quick Facts */}
            <CasinoQuickFacts casino={casino} />
          </div>
        </div>

        {/* Affiliate Disclosure (full width) */}
        <AffiliateDisclosure variant="banner" className="mb-12" />

        {/* Related Casinos */}
        {relatedCasinos.length > 0 && (
          <RelatedCasinos casinos={relatedCasinos} />
        )}
      </Container>
    </>
  );
}
