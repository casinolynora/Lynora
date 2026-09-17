"use client";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/format";
import { MAX_COMPARECasinos } from "@/lib/compare";

type CasinoSelectorProps = {
  selected: Array<{ id: string; name: string }>;
  available: Array<{ id: string; name: string }>;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  maxCasinos?: number;
  className?: string;
};

export function CasinoSelector({
  selected,
  available,
  onAdd,
  onRemove,
  maxCasinos = MAX_COMPARECasinos,
  className,
}: CasinoSelectorProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {selected.map((c) => (
        <Badge key={c.id} variant="primary" size="md" className="gap-1.5 pr-1.5">
          {c.name}
          <button
            onClick={() => onRemove(c.id)}
            className="ml-1 w-7 h-7 rounded-full bg-brand-200 hover:bg-brand-300 flex items-center justify-center transition-colors"
            aria-label={`Remove ${c.name} from comparison`}
          >
            <svg
              className="w-3.5 h-3.5 text-brand-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </Badge>
      ))}
      {available.length > 0 && selected.length < maxCasinos && (
        <select
          onChange={(e) => {
            if (e.target.value) {
              onAdd(e.target.value);
              e.target.value = "";
            }
          }}
          className="rounded-full border border-border bg-white px-3 py-1.5 text-sm text-muted focus:outline-none focus:ring-2 focus:ring-brand-400"
          aria-label="Add casino to comparison"
        >
          <option value="">+ Add casino</option>
          {available.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}
      {selected.length >= maxCasinos && (
        <span className="text-xs text-text-faint">Max {maxCasinos} casinos</span>
      )}
    </div>
  );
}
