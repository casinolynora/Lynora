import { Casino } from "@/lib/types";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { toComparisonCasino } from "@/lib/compare";

type CasinoComparisonPageProps = {
  casinos: Casino[];
};

export function CasinoComparisonPage({ casinos }: CasinoComparisonPageProps) {
  if (casinos.length < 2) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Select at least 2 casinos to compare.</p>
      </div>
    );
  }

  const comparisonCasinos = casinos.map((c) => toComparisonCasino(c));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Casino Comparison</h2>
      <ComparisonTable
        casinos={comparisonCasinos}
      />
    </div>
  );
}
