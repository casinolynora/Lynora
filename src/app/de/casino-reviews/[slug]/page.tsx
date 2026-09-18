import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CasinoReviewPage } from "@/components/casino/CasinoReviewPage";
import { createGermanyProvider } from "@/lib/data/germany-provider";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const provider = createGermanyProvider();
  const casino = provider.getCasinoBySlug(slug);

  if (!casino) {
    return { title: `${slug} Review — Germany | BeInCasinos` };
  }

  return {
    title: `${casino.name} Review — Germany | BeInCasinos`,
    description: `Detailed review of ${casino.name} for German players. Verified information about games, bonuses, and payment methods.`,
    alternates: {
      canonical: `/de/casino-reviews/${slug}`,
    },
    openGraph: {
      title: `${casino.name} Review — Germany | BeInCasinos`,
      description: `Detailed review of ${casino.name} for German players.`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${casino.name} Review — Germany | BeInCasinos`,
      description: `Detailed review of ${casino.name} for German players.`,
    },
  };
}

export default async function GermanyCasinoReviewPage({ params }: Props) {
  const { slug } = await params;
  const provider = createGermanyProvider();
  const casino = provider.getCasinoBySlug(slug);

  if (!casino) notFound();

  return <CasinoReviewPage casino={casino} geo="DE" />;
}
