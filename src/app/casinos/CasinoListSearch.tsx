"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils/format";
import { SearchBar } from "@/components/casino/SearchBar";
import { CasinoGrid } from "@/components/casino/CasinoGrid";
import type { CasinoListItem } from "@/lib/types";

type CasinoListSearchProps = {
  casinos: CasinoListItem[];
};

const filters = [
  { key: "all", label: "All" },
  { key: "live", label: "Live Casino" },
  { key: "sports", label: "Sports Betting" },
  { key: "mobile", label: "Mobile" },
];

export function CasinoListSearch({ casinos }: CasinoListSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = useMemo(() => {
    let result = [...casinos];

    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.tagline?.toLowerCase().includes(lower)
      );
    }

    switch (activeFilter) {
      case "live":
        result = result.filter((c) => c.hasLiveCasino);
        break;
      case "sports":
        result = result.filter((c) => c.hasSportsBetting);
        break;
      case "mobile":
        result = result.filter((c) => c.games?.some((g) => g.available));
        break;
    }

    return result;
  }, [casinos, searchQuery, activeFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar onSearch={setSearchQuery} placeholder="Search casinos..." />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeFilter === filter.key
                ? "bg-brand-800 text-white shadow-sm"
                : "bg-slate-100 text-muted hover:bg-slate-200"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        <CasinoGrid casinos={filtered} />
      </div>

      {filtered.length === 0 && casinos.length > 0 && (
        <p className="text-center text-muted mt-4">
          No casinos found. Try adjusting your search or filters.
        </p>
      )}
    </div>
  );
}
