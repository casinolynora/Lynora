import { formatDate, formatRelativeDate } from "@/lib/utils/format";

type DataFreshnessProps = {
  lastVerifiedAt: string;
  className?: string;
};

export function DataFreshness({ lastVerifiedAt, className }: DataFreshnessProps) {
  return (
    <div className={`text-sm text-muted ${className ?? ""}`}>
      Last verified: <time dateTime={lastVerifiedAt}>{formatDate(lastVerifiedAt)}</time>
      <span className="text-muted/60"> ({formatRelativeDate(lastVerifiedAt)})</span>
    </div>
  );
}
