import Link from "next/link";
import { cn } from "@/lib/utils/format";

type CasinoCompareCTAProps = {
  casinoSlug: string;
  casinoName: string;
  relatedSlugs?: string[];
  className?: string;
};

export function CasinoCompareCTA({
  casinoSlug,
  casinoName,
  relatedSlugs = [],
  className,
}: CasinoCompareCTAProps) {
  // Build comparison URL with this casino + up to 2 related casinos
  const compareSlugs = [casinoSlug, ...relatedSlugs.slice(0, 2)];
  const compareUrl = `/compare?casinos=${compareSlugs.join(",")}`;

  return (
    <section className={cn("mb-8", className)} aria-labelledby="compare-cta-title">
      <div className="card-static p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="compare-cta-title"
              className="text-lg font-bold mb-1"
            >
              Compare {casinoName}
            </h2>
            <p className="text-sm text-muted">
              See how {casinoName} compares to other casinos on licensing, payments, games, and features.
            </p>
          </div>
          <Link
            href={compareUrl}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-lg hover:bg-brand-100 transition-colors flex-shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
            Compare
          </Link>
        </div>
      </div>
    </section>
  );
}
