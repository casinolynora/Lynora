import { cn } from "@/lib/utils/format";

type RatingDisplayProps = {
  rating: number | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

export function RatingDisplay({ rating, size = "md", showLabel = true }: RatingDisplayProps) {
  const sizes = {
    sm: { outer: "w-10 h-10", text: "text-xs" },
    md: { outer: "w-14 h-14", text: "text-sm" },
    lg: { outer: "w-18 h-18", text: "text-base" },
  };

  if (rating === null) {
    return (
      <div className={cn("flex items-center gap-2", size === "lg" && "flex-col gap-1")}>
        <div className={cn("relative flex items-center justify-center rounded-full bg-gray-100", sizes[size].outer)}>
          <span className={cn("font-bold text-muted", sizes[size].text)}>—</span>
        </div>
        {showLabel && size !== "lg" && (
          <div className="flex flex-col">
            <span className="text-xs text-muted">Rating</span>
            <span className="text-sm font-semibold">N/A</span>
          </div>
        )}
      </div>
    );
  }

  const clampedRating = Math.min(100, Math.max(0, rating));
  const RADIUS = 20;
  const STROKE = 3;
  const VIEWBOX = 48;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const offset = CIRCUMFERENCE - (CIRCUMFERENCE * clampedRating) / 100;

  const s = sizes[size];
  const color = clampedRating >= 90 ? "#059669" : clampedRating >= 80 ? "#16a34a" : clampedRating >= 70 ? "#ca8a04" : "#ea580c";

  return (
    <div className={cn("flex items-center gap-2", size === "lg" && "flex-col gap-1")}>
      <div className={cn("relative flex items-center justify-center", s.outer)} role="img" aria-label={`Rating: ${clampedRating} out of 100`}>
        <svg className="absolute inset-0" viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
          <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="#e5e7eb" strokeWidth={STROKE} />
          <circle
            cx="24"
            cy="24"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <span className={cn("font-bold z-10", s.text)} style={{ color }}>{clampedRating}</span>
      </div>
      {showLabel && size !== "lg" && (
        <div className="flex flex-col">
          <span className="text-xs text-muted">Rating</span>
          <span className="text-sm font-semibold">out of 100</span>
        </div>
      )}
    </div>
  );
}
