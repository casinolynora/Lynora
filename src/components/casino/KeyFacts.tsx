import { cn } from "@/lib/utils/format";
import type { Casino } from "@/lib/types";

type KeyFactsProps = {
  casino: Pick<Casino, "minDeposit" | "maxDeposit" | "minWithdrawal" | "withdrawalProcessingTime" | "licenses" | "hasLiveCasino" | "hasSportsBetting" | "hasCrypto" | "hasMobile" | "minAge" | "kycRequired">;
  className?: string;
};

export function KeyFacts({ casino, className }: KeyFactsProps) {
  const facts = [
    { label: "Min Deposit", value: casino.minDeposit != null ? `€${casino.minDeposit}` : null },
    { label: "Max Deposit", value: casino.maxDeposit != null ? `€${casino.maxDeposit.toLocaleString()}` : null },
    { label: "Min Withdrawal", value: casino.minWithdrawal != null ? `€${casino.minWithdrawal}` : null },
    { label: "Withdrawal Speed", value: casino.withdrawalProcessingTime },
    { label: "License", value: casino.licenses?.[0]?.issuer },
    { label: "Live Casino", value: casino.hasLiveCasino ? "Yes" : "No" },
    { label: "Sports Betting", value: casino.hasSportsBetting ? "Yes" : "No" },
    { label: "Crypto", value: casino.hasCrypto ? "Yes" : "No" },
    { label: "Mobile", value: casino.hasMobile ? "Yes" : "No" },
    { label: "Min Age", value: `${casino.minAge}+` },
    { label: "KYC Required", value: casino.kycRequired ? "Yes" : "No" },
  ];

  return (
    <div className={cn("card-static p-5", className)}>
      <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Key Facts</h3>
      <dl className="space-y-3">
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-center justify-between text-sm">
            <dt className="text-muted">{fact.label}</dt>
            <dd className="font-medium text-foreground">
              {fact.value ?? <span className="text-text-faint">—</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
