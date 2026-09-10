import { formatDate, formatRelativeDate } from "@/lib/utils/format";

type DataFreshnessProps = {
  lastVerifiedAt: string;
  className?: string;
};

export function DataFreshness({ lastVerifiedAt, className }: DataFreshnessProps) {
  const formatted = formatDate(lastVerifiedAt);
  const relative = formatRelativeDate(lastVerifiedAt);

  return (
    <time
      dateTime={lastVerifiedAt}
      className={`text-xs text-text-faint ${className || ""}`}
      title={`Last verified: ${formatted}`}
    >
      Last verified: {formatted} ({relative})
    </time>
  );
}
