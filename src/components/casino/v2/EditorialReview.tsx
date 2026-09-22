import { cn } from "@/lib/utils/format";
import type { Casino } from "@/lib/types";

type EditorialReviewProps = {
  casino: Pick<Casino, "review" | "lastVerifiedAt">;
  className?: string;
};

export function EditorialReview({ casino, className }: EditorialReviewProps) {
  const { review } = casino;

  return (
    <section className={cn("mb-8", className)} aria-labelledby="editorial-review-title">
      <h2
        id="editorial-review-title"
        className="text-xl font-bold mb-4 flex items-center gap-2"
      >
        <svg
          className="w-5 h-5 text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
        Our Editorial Review
      </h2>

      {/* Overview */}
      <div className="card-static p-6 mb-6">
        <p className="text-muted leading-relaxed">{review.overview}</p>
      </div>

      {/* Score Breakdown */}
      {review.scoreBreakdown && Object.keys(review.scoreBreakdown).length > 0 && (
        <div className="card-static p-6 mb-6">
          <h3 className="font-bold mb-4">Score Breakdown</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(review.scoreBreakdown).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-muted capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full"
                      style={{ width: `${(value / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{value}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pros & Cons */}
      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {review.pros.length > 0 && (
            <div className="card-static p-5">
              <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-2">
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
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                Pros
              </h3>
              <ul className="space-y-2">
                {review.pros.map((pro, i) => (
                  <li key={i} className="text-sm text-muted flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons.length > 0 && (
            <div className="card-static p-5">
              <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cons
              </h3>
              <ul className="space-y-2">
                {review.cons.map((con, i) => (
                  <li key={i} className="text-sm text-muted flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">−</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Verdict */}
      <div className="card-static p-6 border-l-4 border-l-brand-600">
        <h3 className="font-bold mb-2">Verdict</h3>
        <p className="text-foreground leading-relaxed">{review.verdict}</p>
      </div>
    </section>
  );
}
