type AffiliateDisclosureProps = {
  className?: string;
  variant?: "inline" | "banner";
};

export function AffiliateDisclosure({ className, variant = "inline" }: AffiliateDisclosureProps) {
  if (variant === "banner") {
    return (
      <div className={`bg-gray-50 rounded-xl p-6 border border-border ${className ?? ""}`}>
        <h3 className="font-bold mb-2">Affiliate Disclosure</h3>
        <p className="text-sm text-muted leading-relaxed">
          CasinoLynora earns commissions from qualifying registrations through affiliate links.
          Affiliate relationships do not determine our deterministic matching score — recommendations
          are based solely on defined matching criteria. Commercial availability may vary by GEO.
          Information shown has a last verified date displayed on each casino profile.
        </p>
      </div>
    );
  }

  return (
    <p className={`text-xs text-muted ${className ?? ""}`}>
      Affiliate disclosure: CasinoLynora may earn a commission if you sign up through our links. This does not affect our recommendations.
    </p>
  );
}
