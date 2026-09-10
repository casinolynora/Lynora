import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { getGuideBySlug, getGuideSlugs } from "@/lib/data/guides";
import { FAQSection } from "@/components/casino/FAQSection";

type GermanyGuidePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GermanyGuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    openGraph: {
      title: `${guide.title} | CasinoLynora Germany`,
      description: guide.description,
    },
    twitter: {
      card: "summary",
      title: `${guide.title} | CasinoLynora Germany`,
      description: guide.description,
    },
    alternates: {
      canonical: `https://casinolynora.com/de/guides/${guide.slug}`,
    },
  };
}

export default async function GermanyGuidePage({ params }: GermanyGuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <Container className="py-12 lg:py-20">
      <nav className="text-sm text-muted mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link href="/de" className="hover:text-primary transition-colors">Germany</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/de/guides" className="hover:text-primary transition-colors">Guides</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground font-medium">{guide.title}</li>
        </ol>
      </nav>

      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <Badge variant="primary" size="sm" className="mb-3">{guide.category}</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{guide.title}</h1>
          <p className="text-lg text-muted mb-4">{guide.description}</p>
          <p className="text-sm text-muted">Last updated: {guide.lastUpdated}</p>
        </header>

        <div className="prose prose-sm max-w-none text-foreground">
          <p className="text-lg leading-relaxed mb-8">{guide.content.intro}</p>

          {guide.content.sections.map((section, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-xl font-bold mb-3">{section.heading}</h2>
              <p className="leading-relaxed text-muted">{section.body}</p>
            </section>
          ))}

          <section className="mb-8 p-6 bg-surface-elevated rounded-2xl border border-border">
            <h2 className="text-xl font-bold mb-3">Summary</h2>
            <p className="leading-relaxed text-muted">{guide.content.conclusion}</p>
          </section>
        </div>

        {guide.faq.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <FAQSection
              faqs={guide.faq.map(f => ({ question: f.question, answer: f.answer }))}
              title="Frequently Asked Questions"
            />
          </section>
        )}

        <div className="mt-12 p-6 bg-surface rounded-2xl border border-border">
          <h3 className="font-bold mb-2">Disclaimer</h3>
          <p className="text-sm text-muted">
            This guide is for informational purposes only. Gambling laws vary by jurisdiction.
            Always check the laws in your country before gambling online. Gambling should be treated
            as entertainment, not a way to make money. If you or someone you know has a gambling
            problem, please seek help from a responsible gambling organization.
          </p>
        </div>
      </article>
    </Container>
  );
}
