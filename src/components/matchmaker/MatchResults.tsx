"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AffiliateCTA } from "@/components/casino/AffiliateCTA";
import { AffiliateDisclosure } from "@/components/casino/AffiliateDisclosure";
import { DataFreshness } from "@/components/casino/DataFreshness";
import { cn } from "@/lib/utils/format";
import type { MatchResult, Casino } from "@/lib/types";

type MatchResultsProps = {
  results: MatchResult[];
  casinos: Casino[];
  country?: string;
  baseUrl?: string;
};

function ScoreRing({ percentage }: { percentage: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const color = percentage >= 80 ? "#10b981" : percentage >= 60 ? "#3b82f6" : percentage >= 40 ? "#d97706" : "#ef4444";

  return (
    <div className="relative w-20 h-20 flex-shrink-0" role="img" aria-label={`${percentage}% preference match`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle
          cx="40" cy="40" r={radius} fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="animate-score-fill"
          style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-white leading-none">{percentage}</span>
        <span className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">%</span>
      </div>
    </div>
  );
}

export function MatchResults({ results, casinos, country = "INT", baseUrl = "" }: MatchResultsProps) {
  const getCasino = (id: string) => casinos.find((c) => c.id === id);

  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      {results.map((result, index) => {
        const casino = getCasino(result.casinoId);
        if (!casino) return null;

        const metReasons = result.reasons.filter((r) => r.met);
        const unmetReasons = result.reasons.filter((r) => !r.met);

        return (
          <div
            key={result.casinoId}
            className="p-5 sm:p-6 rounded-[var(--radius-xl)] border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Header: Score + Name + Rank */}
            <div className="flex items-start gap-4 mb-5">
              <ScoreRing percentage={result.matchPercentage} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {index < 3 && (
                    <span className={cn(
                      "inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold flex-shrink-0",
                      index === 0 ? "bg-accent-500 text-white" : "bg-white/10 text-slate-300"
                    )}>
                      {index + 1}
                    </span>
                  )}
                  <Link
                    href={`${baseUrl}/casino-reviews/${casino.slug}`}
                    className="text-lg font-bold text-white hover:text-accent-400 transition-colors truncate"
                  >
                    {casino.name}
                  </Link>
                </div>

                <div className="flex items-center gap-2 flex-wrap mt-1">
                  {casino.licenses?.slice(0, 2).map((l) => (
                    <span key={l.issuer} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-white/[0.06] text-slate-300 border border-white/[0.06]">
                      {l.issuer}
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-500">&middot;</span>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wide">Preference match</span>
                </div>
              </div>
            </div>

            {/* AI Headline */}
            {result.aiExplanation && (
              <div className="mb-5 p-4 rounded-[var(--radius-lg)] border-l-[3px] border-l-accent-500 bg-accent-500/[0.06]">
                <p className="text-sm font-medium text-white/90 leading-relaxed">
                  {typeof result.aiExplanation === "string"
                    ? result.aiExplanation
                    : (result.aiExplanation as { summary?: string; headline?: string }).summary
                      || (result.aiExplanation as { headline?: string }).headline
                      || ""}
                </p>
              </div>
            )}

            {/* Why this matches */}
            {metReasons.length > 0 && (
              <div className="mb-5">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Why it matches you</h4>
                <div className="flex flex-wrap gap-1.5">
                  {metReasons.map((reason, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-accent-500/10 text-accent-300 border border-accent-500/20"
                    >
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {reason.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Limitations */}
            {unmetReasons.length > 0 && (
              <div className="mb-5">
                <details>
                  <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">
                    {unmetReasons.length} limitation{unmetReasons.length !== 1 ? "s" : ""}
                  </summary>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {unmetReasons.map((reason, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] text-slate-400 border border-white/[0.06]"
                      >
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                        </svg>
                        {reason.label}
                      </span>
                    ))}
                  </div>
                </details>
              </div>
            )}

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <div className="mb-5 p-3 rounded-[var(--radius-lg)] bg-amber-500/[0.06] border border-amber-500/20">
                {result.warnings.map((warning, i) => (
                  <p key={i} className="text-xs text-amber-300/90 flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {warning}
                  </p>
                ))}
              </div>
            )}

            {/* Data freshness */}
            <div className="mb-4">
              <DataFreshness lastVerifiedAt={casino.lastVerifiedAt} className="text-slate-500" />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-white/[0.06]">
              <Link
                href={`${baseUrl}/casino-reviews/${casino.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-400 hover:text-accent-300 transition-colors"
              >
                Read Full Review
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </Link>
              <AffiliateCTA
                affiliateOffers={casino.affiliateOffers}
                geo={country}
                size="sm"
                variant="outline"
              />
            </div>
          </div>
        );
      })}

      {/* Compare CTA */}
      {results.length >= 2 && (
        <div className="text-center pt-4">
          <Button href="/compare" variant="secondary" size="sm" className="border-white/10 text-white hover:bg-white/10">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            Compare Matches
          </Button>
        </div>
      )}

      <AffiliateDisclosure variant="inline" className="mt-4" />
    </div>
  );
}
