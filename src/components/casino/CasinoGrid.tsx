import { CasinoListItem } from "@/lib/types";
import { CasinoCard } from "./CasinoCard";

type CasinoGridProps = {
  casinos: CasinoListItem[];
  showFullInfo?: boolean;
  baseUrl?: string;
};

export function CasinoGrid({ casinos, showFullInfo = false, baseUrl = "" }: CasinoGridProps) {
  if (casinos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted text-lg">No casinos found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {casinos.map((casino) => (
        <CasinoCard key={casino.id} casino={casino} showFullInfo={showFullInfo} baseUrl={baseUrl} />
      ))}
    </div>
  );
}
