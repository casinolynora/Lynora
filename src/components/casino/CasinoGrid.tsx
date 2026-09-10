import { CasinoCard } from "./CasinoCard";
import type { CasinoListItem } from "@/lib/types";

type CasinoGridProps = {
  casinos: CasinoListItem[];
  showFullInfo?: boolean;
  baseUrl?: string;
};

export function CasinoGrid({ casinos, showFullInfo, baseUrl }: CasinoGridProps) {
  if (casinos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-subtle mx-auto mb-4">
          <svg className="w-7 h-7 text-text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <p className="text-muted font-medium">No casinos found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {casinos.map((casino) => (
        <CasinoCard
          key={casino.id}
          casino={casino}
          showFullInfo={showFullInfo}
          baseUrl={baseUrl}
        />
      ))}
    </div>
  );
}
