import { cn } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";

type PaymentOverlapProps = {
  common: string[];
  unique: Array<{ casinoId: string; casinoName: string; methods: string[] }>;
  className?: string;
};

export function PaymentOverlap({ common, unique, className }: PaymentOverlapProps) {
  // Only show if there are common methods or unique methods
  const hasUnique = unique.some((u) => u.methods.length > 0);
  if (common.length === 0 && !hasUnique) return null;

  return (
    <section className={cn("mb-8", className)} aria-labelledby="payment-overlap-title">
      <h2 id="payment-overlap-title" className="text-xl font-bold mb-4">
        Payment Method Comparison
      </h2>
      <div className="card-static p-6">
        {/* Common Methods */}
        {common.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
              Common Payment Methods
            </h3>
            <div className="flex flex-wrap gap-2">
              {common.map((method) => (
                <Badge key={method} variant="success" size="sm">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Unique Methods per Casino */}
        {hasUnique && (
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
              Additional Methods
            </h3>
            <div className="space-y-2">
              {unique
                .filter((u) => u.methods.length > 0)
                .map((u) => (
                  <div key={u.casinoId} className="flex items-start gap-2">
                    <span className="text-sm text-muted min-w-[120px]">{u.casinoName}:</span>
                    <div className="flex flex-wrap gap-1">
                      {u.methods.map((method) => (
                        <Badge key={method} variant="default" size="sm">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
