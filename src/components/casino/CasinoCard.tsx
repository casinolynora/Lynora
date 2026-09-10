import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { AffiliateCTA } from "./AffiliateCTA";
import type { CasinoListItem } from "@/lib/types";

type CasinoCardProps = {
  casino: CasinoListItem;
  showFullInfo?: boolean;
  baseUrl?: string;
};

export function CasinoCard({ casino, showFullInfo, baseUrl = "" }: CasinoCardProps) {
  const reviewHref = `${baseUrl}/casino-reviews/${casino.slug}`;
  const welcomeBonus = casino.bonuses?.find((b) => b.type === "welcome");

  return (
    <article className="card-premium p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <Link
            href={reviewHref}
            className="text-lg font-bold text-foreground hover:text-brand-700 transition-colors leading-tight"
          >
            {casino.name}
          </Link>
          {casino.tagline && (
            <p className="text-sm text-muted mt-0.5 line-clamp-1">{casino.tagline}</p>
          )}
        </div>
      </div>

      {/* Verification badge */}
      <div className="mb-4">
        <Badge
          variant={casino.verificationStatus === "verified" ? "success" : "default"}
          size="sm"
        >
          {casino.verificationStatus === "verified" ? "Verified" : casino.verificationStatus}
        </Badge>
      </div>

      {/* Key highlights */}
      <div className="flex flex-wrap gap-2 mb-4">
        {casino.licenses?.slice(0, 2).map((license) => (
          <Badge key={license.issuer} variant="primary" size="sm">
            {license.issuer}
          </Badge>
        ))}
        {casino.hasLiveCasino && (
          <Badge variant="default" size="sm">Live Casino</Badge>
        )}
        {casino.hasSportsBetting && (
          <Badge variant="default" size="sm">Sports</Badge>
        )}
      </div>

      {/* Info grid */}
      {showFullInfo && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm mb-5 flex-1">
          <div>
            <span className="text-text-faint text-xs uppercase tracking-wider block mb-0.5">Min Deposit</span>
            <span className="font-medium text-foreground">
              {casino.minDeposit != null ? `€${casino.minDeposit}` : "—"}
            </span>
          </div>
          <div>
            <span className="text-text-faint text-xs uppercase tracking-wider block mb-0.5">Payments</span>
            <span className="font-medium text-foreground">
              {casino.paymentMethods?.length > 0 ? `${casino.paymentMethods.length} methods` : "—"}
            </span>
          </div>
          <div>
            <span className="text-text-faint text-xs uppercase tracking-wider block mb-0.5">Games</span>
            <span className="font-medium text-foreground">
              {casino.games?.length > 0 ? `${casino.games.length} categories` : "—"}
            </span>
          </div>
          <div>
            <span className="text-text-faint text-xs uppercase tracking-wider block mb-0.5">Bonus</span>
            <span className="font-medium text-foreground">
              {welcomeBonus ? welcomeBonus.title : "—"}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border-subtle mt-auto">
        <Link
          href={reviewHref}
          className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors flex items-center gap-1"
        >
          Read Review
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <AffiliateCTA
          affiliateOffers={casino.affiliateOffers}
          size="sm"
          variant="outline"
        />
      </div>
    </article>
  );
}
