"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { AffiliateCTA } from "@/components/casino/AffiliateCTA";
import { AffiliateDisclosure } from "@/components/casino/AffiliateDisclosure";
import { DataFreshness } from "@/components/casino/DataFreshness";
import type { MatchResult, Casino } from "@/lib/types";

type MatchResultsProps = {
  results: MatchResult[];
  casinos: Casino[];
  country?: string;
  baseUrl?: string;
};

export function MatchResults({ results, casinos, country = "INT", baseUrl = "" }: MatchResultsProps) {
  const getCasino = (id: string) => casinos.find((c) => c.id === id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Your Matches</h2>
        <p className="text-sm text-muted">{results.length} casino{results.length !== 1 ? "s" : ""} found</p>
      </div>

      {results.map((result, index) => {
        const casino = getCasino(result.casinoId);
        if (!casino) return null;

        return (
          <div
            key={result.casinoId}
            className="card-premium p-6 animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {index < 3 && (
                    <Badge variant={index === 0 ? "brand" : "primary"} size="sm">
                      #{index + 1}
                    </Badge>
                  )}
                  <Link
                    href={`${baseUrl}/casino-reviews/${casino.slug}`}
                    className="text-lg font-bold text-foreground hover:text-brand-700 transition-colors"
                  >
                    {casino.name}
                  </Link>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {casino.licenses?.slice(0, 2).map((l) => (
                    <Badge key={l.issuer} variant="primary" size="sm">{l.issuer}</Badge>
                  ))}
                  <DataFreshness lastVerifiedAt={casino.lastVerifiedAt} />
                </div>
              </div>

              {/* Match score */}
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold gradient-brand-text">
                  {Math.round(result.matchPercentage)}%
                </div>
                <p className="text-xs text-text-faint">match</p>
              </div>
            </div>

            {/* AI Headline */}
            {result.aiExplanation && (
              <div className="card-static p-4 mb-4 border-l-4 border-l-brand-400">
                <p className="text-sm font-medium text-foreground">{result.aiExplanation}</p>
              </div>
            )}

            {/* Matching reasons */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-text-faint uppercase tracking-wider mb-2">Why this matches</h4>
              <div className="flex flex-wrap gap-1.5">
                {result.reasons.filter((r) => r.met).map((reason, i) => (
                  <Badge key={i} variant="success" size="sm">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {reason.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Unmet reasons */}
            {result.reasons.some((r) => !r.met) && (
              <details className="mb-4">
                <summary className="text-xs text-text-faint cursor-pointer hover:text-muted transition-colors">
                  Show limitations ({result.reasons.filter((r) => !r.met).length})
                </summary>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {result.reasons.filter((r) => !r.met).map((reason, i) => (
                    <Badge key={i} variant="warning" size="sm">
                      {reason.label}
                    </Badge>
                  ))}
                </div>
              </details>
            )}

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-[var(--radius-lg)] p-3 mb-4">
                {result.warnings.map((warning, i) => (
                  <p key={i} className="text-xs text-amber-700 flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {warning}
                  </p>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
              <Link
                href={`${baseUrl}/casino-reviews/${casino.slug}`}
                className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors"
              >
                Read Full Review →
              </Link>
              <AffiliateCTA
                affiliateOffers={casino.affiliateOffers}
                geo={country}
                size="sm"
              />
            </div>
          </div>
        );
      })}

      <AffiliateDisclosure variant="inline" className="mt-4" />
    </div>
  );
}
