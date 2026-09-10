import { cn } from "@/lib/utils/format";
import { DataFreshness } from "./DataFreshness";

type TrustBadgeProps = {
  verificationStatus: string;
  lastVerifiedAt: string;
  className?: string;
};

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  verified: {
    label: "Verified",
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  draft: {
    label: "Draft",
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  needs_review: {
    label: "Needs Review",
    bg: "bg-orange-50 border-orange-200",
    text: "text-orange-700",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  demo: {
    label: "Demo",
    bg: "bg-slate-100 border-slate-200",
    text: "text-slate-600",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  archived: {
    label: "Archived",
    bg: "bg-slate-100 border-slate-200",
    text: "text-slate-500",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
};

export function TrustBadge({ verificationStatus, lastVerifiedAt, className }: TrustBadgeProps) {
  const config = statusConfig[verificationStatus] || statusConfig.demo;

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border",
          config.bg,
          config.text
        )}
      >
        {config.icon}
        {config.label}
      </span>
      <DataFreshness lastVerifiedAt={lastVerifiedAt} />
    </div>
  );
}
