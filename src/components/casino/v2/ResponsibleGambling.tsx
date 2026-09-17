import { cn } from "@/lib/utils/format";
import type { Casino } from "@/lib/types";

type ResponsibleGamblingProps = {
  responsibleGambling: Casino["responsibleGambling"];
  className?: string;
};

export function ResponsibleGambling({ responsibleGambling, className }: ResponsibleGamblingProps) {
  const features = [
    { label: "Self-Exclusion", available: responsibleGambling.selfExclusion },
    { label: "Deposit Limits", available: responsibleGambling.depositLimits },
    { label: "Session Limits", available: responsibleGambling.sessionLimits },
    { label: "Reality Check", available: responsibleGambling.realityCheck },
    { label: "Cooling-Off Period", available: responsibleGambling.coolingOffPeriod },
  ];

  return (
    <section className={cn("mb-8", className)} aria-labelledby="rg-title">
      <h2
        id="rg-title"
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
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        Responsible Gambling
      </h2>

      <div className="card-static p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-4">
          {features.map((feature) => (
            <div key={feature.label} className="flex items-center gap-2">
              {feature.available ? (
                <svg
                  className="w-4 h-4 text-emerald-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-slate-300 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                  />
                </svg>
              )}
              <span className={feature.available ? "text-foreground" : "text-text-faint"}>
                {feature.label}
              </span>
            </div>
          ))}
        </div>

        {/* External Links */}
        {responsibleGambling.links && responsibleGambling.links.length > 0 && (
          <div className="border-t border-border-subtle pt-4 mt-4">
            <div className="flex flex-wrap gap-3">
              {responsibleGambling.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-600 hover:underline"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* General Advice */}
        <div className="border-t border-border-subtle pt-4 mt-4">
          <p className="text-sm text-muted">
            Gambling should be entertaining. Never bet more than you can afford to lose. If you need
            help, visit{" "}
            <a
              href="https://www.begambleaware.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              BeGambleAware
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
