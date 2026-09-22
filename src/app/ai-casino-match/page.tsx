import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { SITE_URL } from "@/lib/config/site";

const MatchmakerFlow = dynamic(
  () => import("@/components/matchmaker/MatchmakerFlow").then((mod) => mod.MatchmakerFlow),
  {
    loading: () => (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted">Loading matchmaker...</p>
        </div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "AI Casino Matchmaker — Find Your Perfect Casino",
  description:
    "Answer a few questions about your preferences. BeInCasinos matches you with verified casinos using structured data and a transparent scoring algorithm.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "AI Casino Matchmaker — BeInCasinos",
    description: "Answer a few questions and find your ideal casino match.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Casino Matchmaker — BeInCasinos",
    description: "Answer a few questions and find your ideal casino match.",
  },
  alternates: {
    canonical: "/ai-casino-match",
  },
};

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BeInCasinos AI Casino Matchmaker",
  url: `${SITE_URL}/ai-casino-match`,
  applicationCategory: "UtilityApplication",
  description:
    "Answer a few questions about your preferences. BeInCasinos matches you with verified casinos using structured data and a transparent scoring algorithm.",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function AiCasinoMatchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
      />
      <MatchmakerFlow />
    </>
  );
}
