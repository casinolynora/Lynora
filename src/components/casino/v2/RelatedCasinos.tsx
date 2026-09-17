import Link from "next/link";
import { cn } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import type { CasinoListItem } from "@/lib/types";

type RelatedCasinosProps = {
  casinos: CasinoListItem[];
  title?: string;
  className?: string;
};

export function RelatedCasinos({
  casinos,
  title = "Related Casinos",
  className,
}: RelatedCasinosProps) {
  if (casinos.length === 0) return null;

  return (
    <section className={cn("mb-8", className)} aria-labelledby="related-casinos-title">
      <h2 id="related-casinos-title" className="text-xl font-bold mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {casinos.map((casino) => (
          <Link
            key={casino.id}
            href={`/casino-reviews/${casino.slug}`}
            className="card-static p-4 hover:border-brand-300 transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-foreground group-hover:text-brand-600 transition-colors">
                {casino.name}
              </h3>
              {casino.rating !== null && (
                <span className="text-sm font-bold text-foreground">{casino.rating}</span>
              )}
            </div>
            {casino.tagline && (
              <p className="text-xs text-muted mb-2 line-clamp-2">{casino.tagline}</p>
            )}
            <div className="flex flex-wrap gap-1">
              {casino.licenses.slice(0, 2).map((l) => (
                <Badge key={l.issuer} variant="info" size="sm">
                  {l.issuer}
                </Badge>
              ))}
              {casino.minDeposit != null && (
                <Badge variant="default" size="sm">
                  Min: €{casino.minDeposit}
                </Badge>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
