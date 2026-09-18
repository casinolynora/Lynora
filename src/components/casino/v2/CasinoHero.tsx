import { Badge } from "@/components/ui/Badge";
import { AffiliateCTA } from "@/components/casino/AffiliateCTA";
import { TrustBadge } from "@/components/casino/TrustBadge";
import { cn } from "@/lib/utils/format";
import type { Casino } from "@/lib/types";

type CasinoHeroProps = {
  casino: Casino;
  playerRating?: { average: number | null; count: number } | null;
  className?: string;
};

export function CasinoHero({ casino, playerRating, className }: CasinoHeroProps) {
  return (
    <section className={cn("mb-8", className)} aria-labelledby="casino-hero-title">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
        {/* Left: Casino info */}
        <div className="flex-1 min-w-0">
          <h1
            id="casino-hero-title"
            className="text-3xl sm:text-4xl font-bold text-foreground mb-2"
          >
            {casino.name}
          </h1>

          {casino.tagline && (
            <p className="text-lg text-muted mb-3">{casino.tagline}</p>
          )}

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <TrustBadge
              verificationStatus={casino.verificationStatus}
              lastVerifiedAt={casino.lastVerifiedAt}
            />
            {casino.trustScore && casino.trustScore >= 90 && (
              <Badge variant="success">Top Rated</Badge>
            )}
          </div>

          {/* License badges */}
          {casino.licenses.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {casino.licenses.map((l) => (
                <Badge key={l.issuer} variant="info" size="sm">
                  {l.issuer} — {l.jurisdiction}
                </Badge>
              ))}
            </div>
          )}

          {/* Quick stats row */}
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            {casino.minDeposit != null && (
              <span>
                <span className="font-medium text-foreground">Min Deposit:</span>{" "}
                €{casino.minDeposit}
              </span>
            )}
            {casino.countries.length > 0 && (
              <span>
                <span className="font-medium text-foreground">Available in:</span>{" "}
                {casino.countries.join(", ")}
              </span>
            )}
            {casino.hasMobile && (
              <span className="text-emerald-600 font-medium">Mobile Friendly</span>
            )}
          </div>
        </div>

        {/* Right: Rating + CTA */}
        <div className="flex flex-col items-center gap-4 lg:min-w-[240px]">
          {/* Editorial Rating */}
          <div className="text-center">
            <div className="text-xs text-text-faint uppercase tracking-wider mb-1">
              BeInCasinos Rating
            </div>
            {casino.rating !== null ? (
              <div className="text-4xl font-bold text-foreground">
                {casino.rating}
                <span className="text-lg text-muted font-normal">/100</span>
              </div>
            ) : (
              <div className="text-4xl font-bold text-text-faint">—</div>
            )}
          </div>

          {/* Player Rating (separate, clearly labeled) */}
          {playerRating && playerRating.average !== null && playerRating.count > 0 && (
            <div className="text-center border-t border-border pt-3">
              <div className="text-xs text-text-faint uppercase tracking-wider mb-1">
                Player Rating
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-xl font-bold text-foreground">
                  {playerRating.average}
                </span>
                <span className="text-sm text-muted">/5</span>
              </div>
              <div className="text-xs text-text-faint">
                Based on {playerRating.count} {playerRating.count === 1 ? "review" : "reviews"}
              </div>
            </div>
          )}

          <AffiliateCTA
            affiliateOffers={casino.affiliateOffers}
            size="lg"
            fullWidth
          />
        </div>
      </div>
    </section>
  );
}
