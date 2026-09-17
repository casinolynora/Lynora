import { cn } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import type { Casino } from "@/lib/types";

type BonusSectionProps = {
  bonuses: Casino["bonuses"];
  className?: string;
};

export function BonusSection({ bonuses, className }: BonusSectionProps) {
  if (bonuses.length === 0) {
    return (
      <section className={cn("mb-8", className)} aria-labelledby="bonus-section-title">
        <h2
          id="bonus-section-title"
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
              d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          Bonuses &amp; Promotions
        </h2>
        <div className="card-static p-6">
          <p className="text-sm text-muted">
            Bonus information is not currently available for this casino.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("mb-8", className)} aria-labelledby="bonus-section-title">
      <h2
        id="bonus-section-title"
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
            d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
        Bonuses &amp; Promotions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bonuses.map((bonus, i) => (
          <div key={i} className="card-static p-5">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" size="sm">
                {bonus.type}
              </Badge>
              {bonus.amount && (
                <span className="text-sm font-bold text-foreground">{bonus.amount}</span>
              )}
            </div>
            <h3 className="font-bold text-foreground mb-1">{bonus.title}</h3>
            <p className="text-sm text-muted mb-3">{bonus.description}</p>
            <div className="space-y-1 text-xs text-text-faint">
              {bonus.wageringRequirement && (
                <div>
                  <span className="font-medium">Wagering:</span> {bonus.wageringRequirement}
                </div>
              )}
              {bonus.minDeposit && (
                <div>
                  <span className="font-medium">Min Deposit:</span> €{bonus.minDeposit}
                </div>
              )}
              {bonus.maxBet && (
                <div>
                  <span className="font-medium">Max Bet:</span> {bonus.maxBet}
                </div>
              )}
              {bonus.expiresIn && (
                <div>
                  <span className="font-medium">Expires:</span> {bonus.expiresIn}
                </div>
              )}
            </div>
            {bonus.termsUrl && (
              <a
                href={bonus.termsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs text-brand-600 hover:underline"
              >
                Full Terms &amp; Conditions
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
