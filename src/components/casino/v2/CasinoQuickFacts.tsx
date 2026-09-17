import { cn } from "@/lib/utils/format";
import type { Casino } from "@/lib/types";

type CasinoQuickFactsProps = {
  casino: Pick<
    Casino,
    | "founded"
    | "owner"
    | "licenses"
    | "countries"
    | "languages"
    | "currencies"
    | "minDeposit"
    | "maxDeposit"
    | "minWithdrawal"
    | "withdrawalProcessingTime"
    | "paymentMethods"
    | "hasLiveCasino"
    | "hasSportsBetting"
    | "hasCrypto"
    | "hasMobile"
    | "minAge"
    | "kycRequired"
    | "games"
  >;
  className?: string;
};

interface Fact {
  label: string;
  value: string | number | null;
}

export function CasinoQuickFacts({ casino, className }: CasinoQuickFactsProps) {
  const facts: Fact[] = [
    { label: "Established", value: casino.founded ?? null },
    { label: "Operator", value: casino.owner ?? null },
    {
      label: "License",
      value: casino.licenses[0]
        ? `${casino.licenses[0].issuer} (${casino.licenses[0].jurisdiction})`
        : null,
    },
    {
      label: "Available In",
      value: casino.countries.length > 0 ? casino.countries.join(", ") : null,
    },
    { label: "Languages", value: casino.languages.length > 0 ? casino.languages.join(", ") : null },
    { label: "Currencies", value: casino.currencies.length > 0 ? casino.currencies.join(", ") : null },
    { label: "Min Deposit", value: casino.minDeposit != null ? `€${casino.minDeposit}` : null },
    {
      label: "Max Deposit",
      value: casino.maxDeposit != null ? `€${casino.maxDeposit.toLocaleString()}` : null,
    },
    { label: "Min Withdrawal", value: casino.minWithdrawal != null ? `€${casino.minWithdrawal}` : null },
    { label: "Withdrawal Speed", value: casino.withdrawalProcessingTime ?? null },
    {
      label: "Payment Methods",
      value:
        casino.paymentMethods.length > 0
          ? casino.paymentMethods.map((pm) => pm.name).join(", ")
          : null,
    },
    { label: "Live Casino", value: casino.hasLiveCasino ? "Yes" : "No" },
    { label: "Sports Betting", value: casino.hasSportsBetting ? "Yes" : "No" },
    { label: "Crypto", value: casino.hasCrypto ? "Yes" : "No" },
    { label: "Mobile", value: casino.hasMobile ? "Yes" : "No" },
    { label: "Min Age", value: `${casino.minAge}+` },
    { label: "KYC Required", value: casino.kycRequired ? "Yes" : "No" },
    {
      label: "Game Categories",
      value:
        casino.games.filter((g) => g.available).length > 0
          ? casino.games
              .filter((g) => g.available)
              .map((g) => g.name)
              .join(", ")
          : null,
    },
  ];

  // Filter out null values
  const visibleFacts = facts.filter((f) => f.value !== null && f.value !== undefined);

  if (visibleFacts.length === 0) return null;

  return (
    <div className={cn("card-static p-5", className)}>
      <h2 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
        Quick Facts
      </h2>
      <dl className="space-y-3">
        {visibleFacts.map((fact) => (
          <div key={fact.label} className="flex items-center justify-between text-sm gap-4">
            <dt className="text-muted flex-shrink-0">{fact.label}</dt>
            <dd className="font-medium text-foreground text-right">{String(fact.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
