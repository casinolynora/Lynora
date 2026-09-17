import { cn } from "@/lib/utils/format";
import type { DifferenceHighlight } from "@/lib/compare";

type DifferenceHighlightsProps = {
  differences: DifferenceHighlight[];
  className?: string;
};

export function DifferenceHighlights({ differences, className }: DifferenceHighlightsProps) {
  if (differences.length === 0) return null;

  return (
    <section className={cn("mb-8", className)} aria-labelledby="differences-title">
      <h2 id="differences-title" className="text-xl font-bold mb-4">
        Key Differences
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {differences.map((diff) => (
          <div key={diff.field} className="card-static p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">{diff.label}</h3>
            <div className="space-y-1">
              {diff.values.map((v) => (
                <div key={v.casinoId} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{v.casinoName}</span>
                  <span className="font-medium text-foreground">{v.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
