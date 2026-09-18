import { cn } from "@/lib/utils/format";

type AffiliateDisclosureProps = {
  className?: string;
  variant?: "inline" | "banner";
};

export function AffiliateDisclosure({ className, variant = "inline" }: AffiliateDisclosureProps) {
  if (variant === "banner") {
    return (
      <div className={cn("card-static p-5", className)}>
        <h3 className="text-sm font-bold mb-2">Affiliate Disclosure</h3>
        <p className="text-xs text-muted leading-relaxed">
          BeInCasinos earns commissions through affiliate links when monetization is enabled.
          This does not affect our data, matching algorithm, or recommendations.
          Our scoring is based entirely on structured, verified casino data.
        </p>
      </div>
    );
  }

  return (
    <p className={cn("text-[11px] text-text-faint leading-relaxed", className)}>
      Affiliate disclosure: BeInCasinos may earn a commission if you sign up through our links
      when monetization is enabled. This does not affect our recommendations.
    </p>
  );
}
