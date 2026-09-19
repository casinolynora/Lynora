import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FAQSection } from "@/components/casino/FAQSection";
import { getGuideBySlug, getAllGuides } from "@/lib/data/guides";
import { casinoDb } from "@/lib/data/accessor";
import { getCasinosForGuide } from "@/lib/seo/guide-relevance";
import { SITE_URL } from "@/lib/config/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const guides = getAllGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };

  return {
    title: `${guide.title} — BeInCasinos`,
    description: guide.description,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: {
      title: `${guide.title} — BeInCasinos`,
      description: guide.description,
    },
    twitter: {
      card: "summary",
      title: `${guide.title} — BeInCasinos`,
      description: guide.description,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: `${SITE_URL}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: `${SITE_URL}/guides/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main id="main-content">
        <Container className="py-12 lg:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/guides" className="hover:text-primary transition-colors">Guides</Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground font-medium">{guide.title}</span>
            </nav>

          {/* Header */}
          <div className="mb-8">
            <Badge variant="primary" size="sm" className="mb-3">{guide.category}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{guide.title}</h1>
            <p className="text-lg text-muted leading-relaxed">{guide.description}</p>
            {guide.lastUpdated && (
              <p className="text-sm text-text-faint mt-3">
                Last updated: {new Date(guide.lastUpdated).toLocaleDateString("en-GB", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            )}
          </div>

          {/* Content */}
          <article className="prose prose-gray max-w-none">
            <p className="text-muted leading-relaxed mb-6">{guide.content.intro}</p>
            {guide.content.sections.map((section, i) => (
              <section key={i} className="mb-8">
                <h2 className="text-xl font-bold mb-3">{section.heading}</h2>
                <p className="text-muted leading-relaxed">{section.body}</p>
              </section>
            ))}
            <p className="text-muted leading-relaxed mt-6">{guide.content.conclusion}</p>
          </article>

          {/* FAQ */}
          {guide.faq && guide.faq.length > 0 && (
            <div className="mt-12">
              <FAQSection faqs={guide.faq} />
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-12 card-static p-5 text-sm text-muted">
            <p>
              This guide is for informational purposes only. Gambling can be addictive.
              Please play responsibly. Must be 18+ to play.
            </p>
          </div>

          {/* Related guides */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">More Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getAllGuides()
                .filter((g) => g.slug !== slug)
                .slice(0, 2)
                .map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="card-static p-4 hover:border-brand-200 transition-colors group"
                  >
                    <Badge variant="default" size="sm" className="mb-2">{g.category}</Badge>
                    <h3 className="font-bold text-sm group-hover:text-brand-700 transition-colors">{g.title}</h3>
                  </Link>
                ))}
            </div>
          </div>

          {/* Relevant Casinos */}
          {(() => {
            const allCasinos = casinoDb.getAllCasinos().map(casinoDb.selectCasinoListItem);
            const relevantCasinos = getCasinosForGuide(slug, allCasinos);
            if (relevantCasinos.length === 0) return null;
            return (
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Top Casinos for This Guide</h2>
                <div className="space-y-3">
                  {relevantCasinos.map((casino) => (
                    <Link
                      key={casino.slug}
                      href={`/casino-reviews/${casino.slug}`}
                      className="block bg-surface-elevated rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{casino.name}</h3>
                          <p className="text-sm text-muted mt-0.5">{casino.tagline}</p>
                        </div>
                        {casino.rating !== null && (
                          <span className="text-sm font-semibold text-primary">{casino.rating}/10</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </Container>
    </main>
    </>
  );
}
