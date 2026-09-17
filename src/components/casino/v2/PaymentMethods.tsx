import { cn } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import type { Casino } from "@/lib/types";

type PaymentMethodsProps = {
  paymentMethods: Casino["paymentMethods"];
  withdrawalMethods?: string[];
  className?: string;
};

export function PaymentMethods({ paymentMethods, withdrawalMethods, className }: PaymentMethodsProps) {
  if (paymentMethods.length === 0 && (!withdrawalMethods || withdrawalMethods.length === 0)) {
    return null;
  }

  return (
    <section className={cn("mb-8", className)} aria-labelledby="payment-section-title">
      <h2
        id="payment-section-title"
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
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
          />
        </svg>
        Payment Methods
      </h2>

      <div className="card-static p-6">
        {/* Deposit Methods */}
        {paymentMethods.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
              Deposit Methods
            </h3>
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.name}
                  className="flex items-center justify-between p-2 bg-surface rounded border border-border-subtle"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="default" size="sm">
                      {pm.name}
                    </Badge>
                    <span className="text-xs text-text-faint capitalize">{pm.type}</span>
                  </div>
                  <div className="text-xs text-muted text-right">
                    {pm.minDeposit != null && <span>Min: €{pm.minDeposit}</span>}
                    {pm.maxDeposit != null && <span> | Max: €{pm.maxDeposit.toLocaleString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Withdrawal Methods */}
        {withdrawalMethods && withdrawalMethods.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
              Withdrawal Methods
            </h3>
            <div className="flex flex-wrap gap-2">
              {withdrawalMethods.map((method) => (
                <Badge key={method} variant="default" size="sm">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
