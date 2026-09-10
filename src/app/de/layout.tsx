import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Germany — Best Online Casinos | CasinoLynora",
  description: "Find the best online casinos in Germany with CasinoLynora's AI-powered matching. Personalized recommendations for German players.",
  alternates: {
    canonical: "https://casinolynora.com/de",
    languages: {
      "en": "https://casinolynora.com/de",
      "de": "https://casinolynora.com/de",
    },
  },
  openGraph: {
    title: "Germany — Best Online Casinos | CasinoLynora",
    description: "AI-powered casino matching for German players.",
  },
};

export default function GermanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Germany-specific navigation */}
      <div className="bg-surface-elevated border-b border-border">
        <Container className="py-3">
          <nav className="flex items-center gap-4 text-sm overflow-x-auto" aria-label="Germany pages">
            <Link href="/de" className="text-foreground font-medium whitespace-nowrap hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/de/casinos" className="text-muted whitespace-nowrap hover:text-primary transition-colors">
              Casinos
            </Link>
            <Link href="/de/best-casinos" className="text-muted whitespace-nowrap hover:text-primary transition-colors">
              Best Casinos
            </Link>
            <Link href="/de/guides" className="text-muted whitespace-nowrap hover:text-primary transition-colors">
              Guides
            </Link>
            <Link href="/ai-casino-match" className="text-muted whitespace-nowrap hover:text-primary transition-colors">
              AI Matchmaker
            </Link>
          </nav>
        </Container>
      </div>
      {children}
    </div>
  );
}
