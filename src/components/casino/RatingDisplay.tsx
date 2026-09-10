import { cn } from "@/lib/utils/format";

type RatingDisplayProps = {
  rating: number | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

const sizes = {
  sm: { outer: "w-10 h-10", text: "text-xs", ring: 16, stroke: 2.5 },
  md: { outer: "w-14 h-14", text: "text-sm", ring: 20, stroke: 3 },
  lg: { outer: "w-20 h-20", text: "text-base", ring: 28, stroke: 3.5 },
};

export function RatingDisplay({ rating, size = "md", showLabel = true }: RatingDisplayProps) {
  const s = sizes[size];

  if (rating === null) {
    return (
      <div className={cn("flex items-center gap-2", size === "lg" && "flex-col gap-1.5")}>
        <div className={cn("relative flex items-center justify-center rounded-full bg-slate-100 border border-slate-200", s.outer)}>
          <span className={cn("font-semibold text-text-faint", s.text)}>—</span>
        </div>
        {showLabel && size !== "lg" && (
          <div className="flex flex-col">
            <span className="text-xs text-text-faint">Rating</span>
            <span className="text-sm font-medium text-muted">N/A</span>
          </div>
        )}
      </div>
    );
  }

  const clampedRating = Math.min(100, Math.max(0, rating));
  const circumference = 2 * Math.PI * s.ring;
  const offset = circumference - (circumference * clampedRating) / 100;

  const color =
    clampedRating >= 90 ? "#059669" :
    clampedRating >= 80 ? "#10b981" :
    clampedRating >= 70 ? "#d97706" :
    "#dc2626";

  return (
    <div className={cn("flex items-center gap-2", size === "lg" && "flex-col gap-1.5")}>
      <div
        className={cn("relative flex items-center justify-center", s.outer)}
        role="img"
        aria-label={`Rating: ${clampedRating} out of 100`}
      >
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox={`0 0 ${(s.ring + s.stroke) * 2} ${(s.ring + s.stroke) * 2}`}
        >
          <circle
            cx={s.ring + s.stroke}
            cy={s.ring + s.stroke}
            r={s.ring}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={s.stroke}
          />
          <circle
            cx={s.ring + s.stroke}
            cy={s.ring + s.stroke}
            r={s.ring}
            fill="none"
            stroke={color}
            strokeWidth={s.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className={cn("font-bold z-10", s.text)} style={{ color }}>
          {clampedRating}
        </span>
      </div>
      {showLabel && size !== "lg" && (
        <div className="flex flex-col">
          <span className="text-xs text-text-faint">Rating</span>
          <span className="text-sm font-medium text-foreground">out of 100</span>
        </div>
      )}
    </div>
  );
}
