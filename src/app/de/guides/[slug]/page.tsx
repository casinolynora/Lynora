import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FAQSection } from "@/components/casino/FAQSection";
import { getGuideBySlug, getAllGuides } from "@/lib/data/guides";

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
    title: `${guide.title} — Germany | CasinoLynora`,
    description: guide.description,
    alternates: { canonical: `/de/guides/${slug}` },
  };
}

export default async function GermanyGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <main id="main-content">
      <Container className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted mb-6" aria-label="Breadcrumb">
            <Link href="/de" className="hover:text-brand-700 transition-colors">Germany</Link>
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

          <div className="mt-12">
            <Link
              href="/de"
              className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors"
            >
              ← Back to Germany Home
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
