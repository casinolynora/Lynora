import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { getAllGuides } from "@/lib/data/guides";
import { SITE_URL } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Casino Guides — BeInCasinos",
  description: "Expert guides on casino bonuses, payment methods, responsible gambling, and more for European players.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Casino Guides — BeInCasinos",
    description: "Expert guides on casino bonuses, payment methods, and more.",
  },
  twitter: {
    card: "summary",
    title: "Casino Guides — BeInCasinos",
    description: "Expert guides on casino bonuses, payment methods, and more.",
  },
};

export default function GuidesPage() {
  const guides = getAllGuides();

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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main id="main-content">
        <Container className="py-12 lg:py-20">
          <nav className="flex items-center gap-2 text-sm text-muted mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground font-medium">Guides</span>
          </nav>
          <div className="max-w-3xl mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Casino Guides</h1>
            <p className="text-lg text-muted">
              Expert guides on payment methods, bonuses, responsible gambling, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="card-premium p-6 group"
              >
                <Badge variant="primary" size="sm" className="mb-3">{guide.category}</Badge>
                <h2 className="text-lg font-bold mb-2 group-hover:text-brand-700 transition-colors">
                  {guide.title}
                </h2>
                <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                  {guide.description}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
