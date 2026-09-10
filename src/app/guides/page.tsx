import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { getAllGuides } from "@/lib/data/guides";

export const metadata: Metadata = {
  title: "Casino Guides — Tips & Information for European Players",
  description:
    "Helpful guides for online casino players. Learn about payment methods, bonuses, responsible gambling, and more.",
  openGraph: {
    title: "Casino Guides — CasinoLynora",
    description: "Helpful guides for online casino players. Learn about payment methods, bonuses, and more.",
  },
  twitter: {
    card: "summary",
    title: "Casino Guides — CasinoLynora",
    description: "Helpful guides for online casino players.",
  },
  alternates: { canonical: "https://casinolynora.com/guides" },
};

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <Container className="py-12 lg:py-20">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Casino Guides</h1>
        <p className="text-muted max-w-2xl">
          Helpful guides and information for online casino players.
          Learn about payment methods, bonuses, responsible gambling, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group bg-surface rounded-2xl border border-border p-6 card-hover"
          >
            <Badge variant="primary" size="sm" className="mb-3">{guide.category}</Badge>
            <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{guide.title}</h2>
            <p className="text-sm text-muted">{guide.description}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
