import { cn } from "@/lib/utils/format";

type ProsConsProps = {
  pros: string[];
  cons: string[];
  className?: string;
};

export function ProsCons({ pros, cons, className }: ProsConsProps) {
  if (pros.length === 0 && cons.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
      {pros.length > 0 && (
        <div className="card-static p-5">
          <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Pros
          </h3>
          <ul className="space-y-2">
            {pros.map((pro, i) => (
              <li key={i} className="text-sm text-muted flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">+</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
      )}
      {cons.length > 0 && (
        <div className="card-static p-5">
          <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cons
          </h3>
          <ul className="space-y-2">
            {cons.map((con, i) => (
              <li key={i} className="text-sm text-muted flex items-start gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">−</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
