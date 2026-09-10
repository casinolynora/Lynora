import Link from "next/link";
import { CasinoListItem } from "@/lib/types";
import { RatingDisplay } from "./RatingDisplay";
import { AffiliateCTA } from "./AffiliateCTA";
import { Badge } from "@/components/ui/Badge";

type CasinoCardProps = {
  casino: CasinoListItem;
  showFullInfo?: boolean;
  baseUrl?: string;
};

export function CasinoCard({ casino, showFullInfo = false, baseUrl = "" }: CasinoCardProps) {
  const displayBonus = casino.bonuses.find(b => b.type === "welcome") ?? casino.bonuses[0];
  const reviewUrl = `${baseUrl}/casino-reviews/${casino.slug}`;

  return (
    <div className="group relative bg-surface rounded-2xl border border-border p-6 card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <Link href={reviewUrl} className="text-lg font-bold hover:text-primary transition-colors">
              {casino.name}
            </Link>
            {casino.trustScore && casino.trustScore >= 90 && (
              <Badge variant="success" size="sm">Top Rated</Badge>
            )}
          </div>
          {casino.tagline && (
            <p className="text-sm text-muted mb-3 line-clamp-1">{casino.tagline}</p>
          )}
          <div className="flex flex-wrap gap-2 mb-3">
            {casino.licenses.slice(0, 3).map((license) => (
              <Badge key={license.issuer} variant="info" size="sm">{license.issuer}</Badge>
            ))}
            {casino.hasLiveCasino && <Badge variant="default" size="sm">Live Casino</Badge>}
            {casino.hasSportsBetting && <Badge variant="default" size="sm">Sports</Badge>}
          </div>
          {showFullInfo && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted mb-3">
              <span>Min deposit: €{casino.minDeposit}</span>
              <span>Payment: {casino.paymentMethods.slice(0, 3).map(p => p.name).join(", ")}</span>
              <span>Games: {casino.games.filter(g => g.available).length} categories</span>
              {displayBonus && <span>Bonus: {displayBonus.title}</span>}
            </div>
          )}
        </div>
        <RatingDisplay rating={casino.rating} size="md" showLabel={false} />
      </div>

      <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
        <Link
          href={reviewUrl}
          className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
        >
          Read Review
        </Link>
        <AffiliateCTA affiliateOffers={casino.affiliateOffers} size="sm" />
      </div>
    </div>
  );
}
