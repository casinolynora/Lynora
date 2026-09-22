import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { casinoDb } from "@/lib/data/accessor";
import { SITE_URL } from "@/lib/config/site";
import {
  validateComparisonSlugs,
  toComparisonCasino,
  MAX_COMPARECasinos,
} from "@/lib/compare";
import type { ComparisonCasino } from "@/lib/compare";
import { ComparisonPageClient } from "./ComparisonPageClient";

type Props = {
  searchParams: Promise<{ casinos?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const allSlugs = casinoDb.getAllCasinos().map((c) => c.slug);
  const slugs = validateComparisonSlugs(params.casinos, allSlugs);

  // Dynamic ad-hoc comparisons: noindex
  // Future curated comparisons would override this
  if (slugs.length >= 2) {
    const names = slugs
      .map((s) => casinoDb.getCasinoBySlug(s)?.name)
      .filter(Boolean);
    return {
      title: `Compare ${names.join(" vs ")} — BeInCasinos`,
      description: `Compare ${names.join(", ")} side-by-side. View verified data on licenses, payment methods, games, and features.`,
      robots: { index: false, follow: true },
      alternates: { canonical: "/compare" },
    };
  }

  return {
    title: "Compare Casinos — BeInCasinos",
    description:
      "Compare online casinos side-by-side. View verified data on licenses, payment methods, games, and features.",
    alternates: { canonical: "/compare" },
    openGraph: {
      title: "Compare Casinos — BeInCasinos",
      description: "Compare online casinos side-by-side.",
    },
    twitter: {
      card: "summary",
      title: "Compare Casinos — BeInCasinos",
      description: "Compare online casinos side-by-side.",
    },
  };
}

export default async function ComparePage({ searchParams }: Props) {
  const params = await searchParams;
  const allCasinos = casinoDb.getAllCasinos();
  const allSlugs = allCasinos.map((c) => c.slug);
  const slugs = validateComparisonSlugs(params.casinos, allSlugs);

  // Transform to comparison view model (filter nulls)
  const comparisonCasinos = slugs
    .map((slug) => {
      const casino = casinoDb.getCasinoBySlug(slug);
      if (!casino) return null;
      return toComparisonCasino(casino);
    })
    .filter((c): c is ComparisonCasino => c !== null);

  // Default selection if no valid slugs
  const defaultSlugs = comparisonCasinos.length >= 2
    ? slugs
    : allCasinos.slice(0, 3).map((c) => c.slug);

  // Breadcrumb schema
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
        name: "Compare Casinos",
        item: `${SITE_URL}/compare`,
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
          <div className="max-w-3xl mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Compare Casinos</h1>
            <p className="text-lg text-muted">
              Compare casinos side-by-side to make informed decisions.
              Select up to {MAX_COMPARECasinos} casinos and compare their verified features.
            </p>
          </div>

          <div className="max-w-6xl">
            {allCasinos.length > 0 ? (
              <ComparisonPageClient
                allCasinos={allCasinos}
                initialSlugs={slugs.length >= 2 ? slugs : defaultSlugs}
              />
            ) : (
              <div className="card-static p-8 text-center">
                <h2 className="text-xl font-bold mb-2">No Casinos Available</h2>
                <p className="text-muted">
                  Casino data is being prepared. Check back soon.
                </p>
              </div>
            )}
          </div>
        </Container>
      </main>
    </>
  );
}
