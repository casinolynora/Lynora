import type { Metadata } from "next";
import { MatchmakerFlow } from "@/components/matchmaker/MatchmakerFlow";

export const metadata: Metadata = {
  title: "AI Casino Matchmaker — Find Your Perfect Casino",
  description:
    "Answer a few questions about your preferences. CasinoLynora matches you with verified casinos using structured data and a transparent scoring algorithm.",
  openGraph: {
    title: "AI Casino Matchmaker — CasinoLynora",
    description: "Answer a few questions and find your ideal casino match.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Casino Matchmaker — CasinoLynora",
    description: "Answer a few questions and find your ideal casino match.",
  },
  alternates: {
    canonical: "https://casinolynora.com/ai-casino-match",
  },
};

export default function AiCasinoMatchPage() {
  return <MatchmakerFlow />;
}
