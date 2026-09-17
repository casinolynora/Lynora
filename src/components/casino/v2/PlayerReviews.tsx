import { cn } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";

type PlayerReview = {
  id: string;
  title: string;
  body: string;
  rating: number;
  publishedAt: string | null;
  createdAt: string;
  verificationStatus: "unverified" | "verified";
  locale: string | null;
};

type PlayerReviewsProps = {
  reviews: PlayerReview[];
  ratingSummary?: {
    average: number | null;
    count: number;
    distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  } | null;
  className?: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(
            "w-4 h-4",
            star <= rating ? "text-amber-400 fill-current" : "text-gray-200 fill-current"
          )}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function PlayerReviews({ reviews, ratingSummary, className }: PlayerReviewsProps) {
  return (
    <section className={cn("mb-8", className)} aria-labelledby="player-reviews-title">
      <h2
        id="player-reviews-title"
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
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        Player Reviews
      </h2>

      {/* Rating Summary */}
      {ratingSummary && ratingSummary.count > 0 && (
        <div className="card-static p-6 mb-6">
          <div className="flex items-center gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {ratingSummary.average}
              </div>
              <div className="text-sm text-muted">out of 5</div>
              <div className="text-xs text-text-faint mt-1">
                {ratingSummary.count} {ratingSummary.count === 1 ? "review" : "reviews"}
              </div>
            </div>

            {/* Distribution */}
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingSummary.distribution[star as keyof typeof ratingSummary.distribution];
                const percentage = ratingSummary.count > 0 ? (count / ratingSummary.count) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-right text-muted">{star}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-text-faint">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article key={review.id} className="card-static p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-foreground">{review.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={review.rating} />
                    {review.verificationStatus === "verified" && (
                      <Badge variant="success" size="sm">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <time
                  dateTime={review.publishedAt || review.createdAt}
                  className="text-xs text-text-faint"
                >
                  {new Date(review.publishedAt || review.createdAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <p className="text-sm text-muted leading-relaxed">{review.body}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="card-static p-6 text-center">
          <p className="text-sm text-muted">No player reviews yet.</p>
        </div>
      )}
    </section>
  );
}
