import { resolveOffer } from "@/lib/ai/affiliate-utils";
import { Button } from "@/components/ui/Button";
import type { AffiliateOffer } from "@/lib/types";

type AffiliateCTAProps = {
  affiliateOffers: AffiliateOffer[];
  geo?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  disclosureText?: string;
};

export function AffiliateCTA({
  affiliateOffers,
  geo,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  disclosureText,
}: AffiliateCTAProps) {
  const offer = resolveOffer(affiliateOffers, geo || "INT");

  if (!offer) return null;

  return (
    <div className={className}>
      <Button
        href={offer.trackingUrl}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        target="_blank"
        rel="noopener noreferrer sponsored"
      >
        {offer.ctaText || "Visit Casino"}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </Button>
      <p className="text-[11px] text-text-faint mt-1.5 text-center">
        {disclosureText || "Affiliate link. Terms apply."}
      </p>
    </div>
  );
}
