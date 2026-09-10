"use client";

import { useState, useMemo } from "react";
import { CasinoListItem } from "@/lib/types";
import { CasinoGrid } from "@/components/casino/CasinoGrid";
import { SearchBar } from "@/components/casino/SearchBar";
import { cn } from "@/lib/utils/format";

type CasinoListSearchProps = {
  casinos: CasinoListItem[];
};

const filters = [
  { key: "all", label: "All" },
  { key: "live-casino", label: "Live Casino" },
  { key: "sports", label: "Sports Betting" },
  { key: "fast-withdrawal", label: "Fast Withdrawal" },
] as const;

type FilterKey = typeof filters[number]["key"];

export function CasinoListSearch({ casinos }: CasinoListSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filteredCasinos = useMemo(() => {
    let result = casinos;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.features.some(f => f.toLowerCase().includes(q))
      );
    }

    switch (activeFilter) {
      case "live-casino":
        result = result.filter(c => c.hasLiveCasino);
        break;
      case "sports":
        result = result.filter(c => c.hasSportsBetting);
        break;
      case "fast-withdrawal":
        result = result.filter(c => {
          const time = c.paymentMethods.some(pm => {
            const t = pm.withdrawalTime?.toLowerCase() ?? "";
            return t.includes("instant") || t.includes("1 hour") || t.includes("2 hour");
          });
          return time;
        });
        break;
    }

    return result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [casinos, searchQuery, activeFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar onSearch={setSearchQuery} placeholder="Search casinos..." />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(filter => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            aria-pressed={activeFilter === filter.key}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeFilter === filter.key
                ? "gradient-primary text-white shadow-md"
                : "bg-surface-elevated text-muted hover:text-foreground border border-border hover:border-primary/30",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div aria-live="polite">
      {filteredCasinos.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted text-lg mb-2">No casinos found</p>
          <p className="text-sm text-muted">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <CasinoGrid casinos={filteredCasinos} showFullInfo />
      )}
      </div>
    </div>
  );
}
