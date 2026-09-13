import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { getAllGuides } from "@/lib/data/guides";

export const metadata: Metadata = {
  title: "Germany Gambling Guides — CasinoLynora",
  description: "Expert guides for online gambling in Germany. Payment methods, bonuses, responsible gambling, and more.",
  alternates: { canonical: "/de/guides" },
};

export default function GermanyGuidesPage() {
  const guides = getAllGuides();

  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Germany Gambling Guides</h1>
          <p className="text-lg text-muted">
            Expert guides for online gambling in Germany.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/de/guides/${guide.slug}`}
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

        <div className="mt-8">
          <Link
            href="/de"
            className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors"
          >
            ← Back to Germany Home
          </Link>
        </div>
      </Container>
    </main>
  );
}
