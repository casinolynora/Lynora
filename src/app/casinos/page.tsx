import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { casinoDb } from "@/lib/data/accessor";
import { CasinoListSearch } from "./CasinoListSearch";

export const metadata: Metadata = {
  title: "All Casinos — Verified European Casino Directory",
  description:
    "Browse our complete directory of verified European online casinos. Filter by country, payment methods, games, and more.",
  openGraph: {
    title: "All Casinos — CasinoLynora",
    description: "Browse our complete directory of verified European online casinos.",
  },
  twitter: {
    card: "summary",
    title: "All Casinos — CasinoLynora",
    description: "Browse our complete directory of verified European online casinos.",
  },
  alternates: {
    canonical: "https://casinolynora.com/casinos",
  },
};

export default function CasinosPage() {
  const casinos = casinoDb.getAllCasinos().map(c => casinoDb.selectCasinoListItem(c));

  return (
    <Container className="py-12 lg:py-20">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">All Casinos</h1>
        <p className="text-muted max-w-2xl">
          Browse our complete directory of verified European online casinos.
          Each profile is built from structured, verified data.
        </p>
      </div>

      <CasinoListSearch casinos={casinos} />

      <div className="mt-8 text-sm text-muted">
        <p>Showing {casinos.length} verified casinos. All data is sourced from verified information.</p>
      </div>
    </Container>
  );
}
