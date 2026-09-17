"use client";

import { cn } from "@/lib/utils/format";
import type { SortField, SortDirection } from "@/lib/compare";

type SortControlsProps = {
  currentField: SortField;
  currentDirection: SortDirection;
  onSort: (field: SortField, direction: SortDirection) => void;
  className?: string;
};

const SORT_OPTIONS: Array<{ field: SortField; label: string }> = [
  { field: "editorialScore", label: "Editorial Score" },
  { field: "playerRating", label: "Player Rating" },
  { field: "minDeposit", label: "Min Deposit" },
  { field: "verificationStatus", label: "Verification" },
  { field: "name", label: "Name" },
];

export function SortControls({
  currentField,
  currentDirection,
  onSort,
  className,
}: SortControlsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm font-medium text-muted">Sort by:</span>
      {SORT_OPTIONS.map((option) => {
        const isActive = currentField === option.field;
        const isDesc = currentDirection === "desc";

        return (
          <button
            key={option.field}
            onClick={() =>
              onSort(
                option.field,
                isActive && isDesc ? "asc" : "desc"
              )
            }
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full border transition-colors",
              isActive
                ? "bg-brand-50 text-brand-700 border-brand-200"
                : "bg-white text-muted border-border hover:border-brand-200 hover:text-foreground"
            )}
            aria-pressed={isActive}
            aria-label={`Sort by ${option.label}${isActive ? ` (currently ${isDesc ? "descending" : "ascending"})` : ""}`}
          >
            {option.label}
            {isActive && (
              <svg
                className={cn("w-3 h-3 transition-transform", isDesc ? "" : "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
