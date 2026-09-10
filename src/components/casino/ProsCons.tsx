type ProsConsProps = {
  pros: string[];
  cons: string[];
  className?: string;
};

export function ProsCons({ pros, cons, className = "" }: ProsConsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${className}`}>
      {pros.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 uppercase tracking-wide">
            Pros
          </h3>
          <ul className="space-y-2">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {pro}
              </li>
            ))}
          </ul>
        </div>
      )}
      {cons.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 uppercase tracking-wide">
            Cons
          </h3>
          <ul className="space-y-2">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {con}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
