import { Casino } from "@/lib/types";

type KeyFactsProps = {
  casino: Pick<Casino, "minDeposit" | "maxDeposit" | "withdrawalProcessingTime" | "licenses" | "hasLiveCasino" | "hasSportsBetting" | "hasCrypto" | "hasMobile" | "minAge" | "kycRequired">;
  className?: string;
};

export function KeyFacts({ casino, className = "" }: KeyFactsProps) {
  const facts = [
    { label: "Min Deposit", value: casino.minDeposit ? `€${casino.minDeposit}` : "Not specified" },
    { label: "Max Deposit", value: casino.maxDeposit ? `€${casino.maxDeposit}` : "Not specified" },
    { label: "Withdrawal", value: casino.withdrawalProcessingTime ?? "Not specified" },
    { label: "License", value: casino.licenses[0]?.issuer ?? "Not specified" },
    { label: "Live Casino", value: casino.hasLiveCasino ? "Yes" : "No" },
    { label: "Sports", value: casino.hasSportsBetting ? "Yes" : "No" },
    { label: "Crypto", value: casino.hasCrypto ? "Yes" : "No" },
    { label: "Mobile", value: casino.hasMobile ? "Yes" : "No" },
    { label: "Min Age", value: `${casino.minAge}+` },
    { label: "KYC", value: casino.kycRequired ? "Required" : "Not required" },
  ];

  return (
    <div className={`bg-surface-elevated rounded-xl border border-border p-4 ${className}`}>
      <h3 className="text-sm font-semibold mb-3">Key Facts</h3>
      <dl className="space-y-2">
        {facts.map((fact) => (
          <div key={fact.label} className="flex justify-between text-sm">
            <dt className="text-muted">{fact.label}</dt>
            <dd className="font-medium">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
