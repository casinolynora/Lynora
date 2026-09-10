import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { getAllGuides } from "@/lib/data/guides";

export const metadata: Metadata = {
  title: "Germany Gambling Guides — CasinoLynora",
  description: "Expert guides for online gambling in Germany. Learn about regulations, payment methods, and responsible gambling.",
  alternates: {
    canonical: "https://casinolynora.com/de/guides",
  },
  openGraph: {
    title: "Germany Gambling Guides — CasinoLynora",
    description: "Expert guides for online gambling in Germany.",
  },
  twitter: {
    card: "summary",
    title: "Germany Gambling Guides — CasinoLynora",
    description: "Expert guides for online gambling in Germany.",
  },
};

export default function GermanyGuidesPage() {
  const guides = getAllGuides();

  return (
    <Container className="py-12 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Germany Gambling Guides
        </h1>

        <p className="text-lg text-muted mb-8">
          Expert guides for online gambling in Germany.
        </p>

        <div className="grid gap-6 mb-12">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/de/guides/${guide.slug}`}
              className="group block bg-surface-elevated rounded-2xl border border-border p-6 card-hover"
            >
              <Badge variant="primary" size="sm" className="mb-3">{guide.category}</Badge>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{guide.title}</h2>
              <p className="text-muted mb-4">{guide.description}</p>
              <p className="text-sm text-primary font-medium">Read guide →</p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/de" className="text-primary hover:underline">
            ← Back to Germany Home
          </Link>
        </div>
      </div>
    </Container>
  );
}
