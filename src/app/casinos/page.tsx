import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CasinoListSearch } from "./CasinoListSearch";
import { casinoDb } from "@/lib/data/accessor";

export const metadata: Metadata = {
  title: "All Casinos — BeInCasinos",
  description: "Browse all verified online casinos. Search and filter by payment methods, games, and features.",
  alternates: { canonical: "/casinos" },
  openGraph: {
    title: "All Casinos — BeInCasinos",
    description: "Browse all verified online casinos.",
  },
  twitter: {
    card: "summary",
    title: "All Casinos — BeInCasinos",
    description: "Browse all verified online casinos.",
  },
};

export default function CasinosPage() {
  const casinos = casinoDb.getAllCasinos();
  const items = casinos.map((c) => casinoDb.selectCasinoListItem(c));

  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">All Casinos</h1>
          <p className="text-lg text-muted">
            Browse and search {items.length} verified casino{items.length !== 1 ? "s" : ""}.
          </p>
        </div>

        <div className="max-w-5xl">
          <CasinoListSearch casinos={items} />
        </div>
      </Container>
    </main>
  );
}
