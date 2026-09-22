import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FAQSection } from "@/components/casino/FAQSection";
import { getGuideBySlug, getAllGuides, getGermanGuideBySlug } from "@/lib/data/guides";
import { getFullDatasetCasinos } from "@/lib/seo/payment-data";
import { getCasinosForGuide } from "@/lib/seo/guide-relevance";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const guides = getAllGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const germanGuide = getGermanGuideBySlug(slug);

  if (germanGuide) {
    const { de } = germanGuide;
    return {
      title: `${de.title} — Deutschland | BeInCasinos`,
      description: de.description,
      alternates: { canonical: `/de/guides/${slug}` },
      openGraph: {
        title: `${de.title} — Deutschland | BeInCasinos`,
        description: de.description,
      },
      twitter: {
        card: "summary",
        title: `${de.title} — Deutschland | BeInCasinos`,
        description: de.description,
      },
    };
  }

  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };

  return {
    title: `${guide.title} — Deutschland | BeInCasinos`,
    description: guide.description,
    alternates: { canonical: `/de/guides/${slug}` },
    openGraph: {
      title: `${guide.title} — Deutschland | BeInCasinos`,
      description: guide.description,
    },
    twitter: {
      card: "summary",
      title: `${guide.title} — Deutschland | BeInCasinos`,
      description: guide.description,
    },
  };
}

export default async function GermanyGuidePage({ params }: Props) {
  const { slug } = await params;
  const germanGuide = getGermanGuideBySlug(slug);

  if (germanGuide) {
    const { guide, de } = germanGuide;
    return (
      <main id="main-content">
        <Container className="py-12 lg:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted mb-6" aria-label="Breadcrumb">
              <Link href="/de" className="hover:text-brand-700 transition-colors">Deutschland</Link>
              <span className="mx-2 text-text-faint">/</span>
              <Link href="/de/guides" className="hover:text-brand-700 transition-colors">Guides</Link>
              <span className="mx-2 text-text-faint">/</span>
              <span className="text-foreground font-medium">{de.title}</span>
            </nav>

            <div className="mb-8">
              <Badge variant="primary" size="sm" className="mb-3">{de.category}</Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{de.title}</h1>
              <p className="text-lg text-muted leading-relaxed">{de.description}</p>
            </div>

            <article className="space-y-8">
              <p className="text-muted leading-relaxed">{de.intro}</p>
              {de.sections.map((section, i) => (
                <section key={i}>
                  <h2 className="text-xl font-bold mb-3">{section.heading}</h2>
                  <p className="text-muted leading-relaxed">{section.body}</p>
                </section>
              ))}
              <p className="text-muted leading-relaxed">{de.conclusion}</p>
            </article>

            {de.faq && de.faq.length > 0 && (
              <div className="mt-12">
                <FAQSection faqs={de.faq} />
              </div>
            )}

            {/* Relevant Casinos */}
            {(() => {
              const allCasinos = getFullDatasetCasinos();
              const relevantCasinos = getCasinosForGuide(slug, allCasinos);
              if (relevantCasinos.length === 0) return null;
              return (
                <div className="mt-12">
                  <h2 className="text-xl font-bold mb-4">Top-Casinos für diesen Guide</h2>
                  <div className="space-y-3">
                    {relevantCasinos.map((casino) => (
                      <Link
                        key={casino.slug}
                        href={`/de/casino-reviews/${casino.slug}`}
                        className="block bg-surface-elevated rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{casino.name}</h3>
                            {casino.tagline && (
                              <p className="text-sm text-muted mt-0.5">{casino.tagline}</p>
                            )}
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

            {/* Payment Methods Link */}
            {slug === "payment-methods-guide" && (
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Zahlungsmethoden-Seiten</h2>
                <p className="text-muted text-sm mb-4">
                  Durchstetailedte Seiten zu einzelnen Zahlungsmethoden mit verifizierter Casino-Verfügbarkeit und GEO-Abdeckung.
                </p>
                <Link
                  href="/payments"
                  className="inline-block bg-surface-elevated rounded-xl border border-border p-4 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-foreground">Alle Zahlungsmethoden</h3>
                  <p className="text-sm text-muted mt-1">Einzahlungen, Auszahlungen und Casino-Verfügbarkeit vergleichen.</p>
                </Link>
              </div>
            )}

            {/* Internal links */}
            <div className="mt-12 space-y-4">
              <h3 className="text-lg font-bold">Weiterführende Informationen</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/de/best-casinos" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
                  Casino-Bewertungsmethodik
                </Link>
                <Link href="/de/casinos" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
                  Alle Casinos
                </Link>
                <Link href="/de/compare" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
                  Casino-Vergleich
                </Link>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/de"
                className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors"
              >
                ← Zurück zur Deutschland-Startseite
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  // Fallback: English guide with German page wrapper
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <main id="main-content">
      <Container className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted mb-6" aria-label="Breadcrumb">
            <Link href="/de" className="hover:text-brand-700 transition-colors">Deutschland</Link>
            <span className="mx-2 text-text-faint">/</span>
            <Link href="/de/guides" className="hover:text-brand-700 transition-colors">Guides</Link>
            <span className="mx-2 text-text-faint">/</span>
            <span className="text-foreground font-medium">{guide.title}</span>
          </nav>

          <div className="mb-8">
            <Badge variant="primary" size="sm" className="mb-3">{guide.category}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{guide.title}</h1>
            <p className="text-lg text-muted leading-relaxed">{guide.description}</p>
          </div>

          <article className="space-y-8">
            <p className="text-muted leading-relaxed">{guide.content.intro}</p>
            {guide.content.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-xl font-bold mb-3">{section.heading}</h2>
                <p className="text-muted leading-relaxed">{section.body}</p>
              </section>
            ))}
            <p className="text-muted leading-relaxed">{guide.content.conclusion}</p>
          </article>

          {guide.faq && guide.faq.length > 0 && (
            <div className="mt-12">
              <FAQSection faqs={guide.faq} />
            </div>
          )}

          {/* Relevant Casinos */}
          {(() => {
            const allCasinos = getFullDatasetCasinos();
            const relevantCasinos = getCasinosForGuide(slug, allCasinos);
            if (relevantCasinos.length === 0) return null;
            return (
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Top-Casinos für diesen Guide</h2>
                <div className="space-y-3">
                  {relevantCasinos.map((casino) => (
                    <Link
                      key={casino.slug}
                      href={`/de/casino-reviews/${casino.slug}`}
                      className="block bg-surface-elevated rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{casino.name}</h3>
                          {casino.tagline && (
                            <p className="text-sm text-muted mt-0.5">{casino.tagline}</p>
                          )}
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

          {/* Payment Methods Link */}
          {slug === "payment-methods-guide" && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-4">Zahlungsmethoden-Seiten</h2>
              <p className="text-muted text-sm mb-4">
                Durchstetailedte Seiten zu einzelnen Zahlungsmethoden mit verifizierter Casino-Verfügbarkeit und GEO-Abdeckung.
              </p>
              <Link
                href="/payments"
                className="inline-block bg-surface-elevated rounded-xl border border-border p-4 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-foreground">Alle Zahlungsmethoden</h3>
                <p className="text-sm text-muted mt-1">Einzahlungen, Auszahlungen und Casino-Verfügbarkeit vergleichen.</p>
              </Link>
            </div>
          )}

          <div className="mt-12">
            <Link
              href="/de"
              className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors"
            >
              ← Zurück zur Deutschland-Startseite
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
