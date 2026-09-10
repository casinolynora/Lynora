import { AffiliateOffer } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { resolveOffer } from "@/lib/ai/affiliate-utils";

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
  geo = "INT",
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  disclosureText = "Affiliate link. CasinoLynora may earn a commission if you sign up. This does not affect our recommendations.",
}: AffiliateCTAProps) {
  if (!affiliateOffers || affiliateOffers.length === 0) return null;

  const offer = resolveOffer(affiliateOffers, geo);
  if (!offer) return null;

  return (
    <div className={className}>
      <Button
        href={offer.trackingUrl}
        variant={variant}
        size={size}
        className={fullWidth ? "w-full" : ""}
        target="_blank"
        rel="noopener noreferrer sponsored"
      >
        {offer.ctaText}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </Button>
      <p className="mt-1.5 text-[11px] text-muted text-center">
        {disclosureText}
      </p>
    </div>
  );
}
