import { MatchResult, Casino } from "@/lib/types";
import { AIExplanationResponse } from "@/lib/ai/provider";
import { RatingDisplay } from "@/components/casino/RatingDisplay";
import { AffiliateCTA } from "@/components/casino/AffiliateCTA";
import { DataFreshness } from "@/components/casino/DataFreshness";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/format";
import Link from "next/link";

type MatchResultsProps = {
  results: (MatchResult & { aiExplanation?: AIExplanationResponse })[];
  casinos: Casino[];
  country?: string;
  baseUrl?: string;
};

export function MatchResults({ results, casinos, country = "INT", baseUrl = "" }: MatchResultsProps) {
  return (
    <div className="space-y-6">
      {results.map((result, index) => {
        const casino = casinos.find(c => c.id === result.casinoId);
        if (!casino) return null;

        const metReasons = result.reasons.filter(r => r.met);
        const unmetReasons = result.reasons.filter(r => !r.met);
        const rank = index + 1;
        const ai = result.aiExplanation;

        return (
          <div
            key={result.casinoId}
            className={cn(
              "bg-surface rounded-2xl border overflow-hidden card-hover animate-fade-in-up",
              rank === 1 ? "border-primary/30 ring-1 ring-primary/10" : "border-border",
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-1">
                    {rank <= 3 && (
                      <Badge variant={rank === 1 ? "primary" : rank === 2 ? "info" : "default"}>
                        #{rank} Match
                      </Badge>
                    )}
                    <span className="text-2xl font-bold">{result.matchPercentage}% Match</span>
                  </div>

                  <Link href={`${baseUrl}/casino-reviews/${casino.slug}`} className="text-xl font-bold hover:text-primary transition-colors">
                    {casino.name}
                  </Link>

                  <div className="flex flex-wrap gap-2 mt-2 mb-4">
                    {casino.licenses.slice(0, 2).map(l => (
                      <Badge key={l.issuer} variant="info" size="sm">{l.issuer}</Badge>
                    ))}
                  </div>

                  {/* Data Freshness */}
                  <DataFreshness lastVerifiedAt={casino.lastVerifiedAt} className="mb-3" />

                  {/* AI Headline */}
                  {ai?.headline && (
                    <p className="text-sm font-medium text-foreground mb-3 bg-surface-elevated rounded-lg px-3 py-2 border border-border/50">
                      {ai.headline}
                    </p>
                  )}

                  {/* AI Summary */}
                  {ai?.summary && (
                    <p className="text-sm text-muted mb-4 leading-relaxed">
                      {ai.summary}
                    </p>
                  )}

                  {/* Why this matches you */}
                  {ai?.matchingReasons && ai.matchingReasons.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Why this matches you</h4>
                      <div className="space-y-1.5">
                        {ai.matchingReasons.map((reason, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-500 mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                            <span className="text-foreground">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fallback: deterministic reasons if no AI */}
                  {!ai && metReasons.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Why it matches you</h4>
                      <div className="space-y-1.5">
                        {metReasons.slice(0, 5).map((reason, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-500 mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                            <span className="text-foreground">{reason.label}</span>
                            {reason.detail && <span className="text-muted">— {reason.detail}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Limitations */}
                  {ai?.limitations && ai.limitations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-amber-700 mb-2">What doesn&apos;t match</h4>
                      <div className="space-y-1.5">
                        {ai.limitations.map((limitation, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-amber-500 mt-0.5 flex-shrink-0" aria-hidden="true">⚠</span>
                            <span className="text-muted">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Important Notes / Warnings */}
                  {result.warnings.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-amber-800 font-medium mb-1">Important</p>
                      {result.warnings.map((w, i) => (
                        <p key={i} className="text-sm text-amber-700">{w}</p>
                      ))}
                    </div>
                  )}

                  {/* Unmet reasons (fallback when no AI) */}
                  {!ai && unmetReasons.length > 0 && (
                    <details className="text-sm text-muted">
                      <summary className="cursor-pointer hover:text-foreground transition-colors">
                        View details ({unmetReasons.length} criteria not met)
                      </summary>
                      <div className="mt-2 space-y-1">
                        {unmetReasons.map((reason, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true">✗</span>
                            <span>{reason.label}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>

                {/* Sidebar: Rating + CTA */}
                <div className="flex flex-col items-center gap-4 lg:min-w-[200px]">
                  <RatingDisplay rating={casino.rating} size="lg" />
                  <div className="flex flex-col gap-2 w-full">
                    <AffiliateCTA affiliateOffers={casino.affiliateOffers} geo={country} size="md" fullWidth />
                    <Link
                      href={`${baseUrl}/casino-reviews/${casino.slug}`}
                      className="text-center text-sm font-medium text-primary hover:text-primary-light transition-colors"
                    >
                      Full Review →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Pros & Cons */}
            {casino.review.pros.length > 0 && (
              <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1.5">Pros</h5>
                    <ul className="space-y-1">
                      {casino.review.pros.slice(0, 3).map((pro, i) => (
                        <li key={i} className="text-sm text-muted flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5" aria-hidden="true">+</span> {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1.5">Cons</h5>
                    <ul className="space-y-1">
                      {casino.review.cons.slice(0, 3).map((con, i) => (
                        <li key={i} className="text-sm text-muted flex items-start gap-1.5">
                          <span className="text-red-400 mt-0.5" aria-hidden="true">-</span> {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
