import type { ListingPlan } from "./types";

export interface PricingTier {
  id: ListingPlan;
  name: string;
  monthlyPrice: number | null;
  ctaText: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    ctaText: "Request a Listing",
    description: "Basic casino listing with essential information visible to players.",
    features: [
      "Basic casino listing",
      "Basic profile information",
      "GEO/category placement",
      "Request profile updates",
    ],
  },
  {
    id: "verified",
    name: "Verified",
    monthlyPrice: 99,
    ctaText: "Request This Plan",
    description: "Verified operator profile with expanded information and priority support.",
    features: [
      "Verified operator profile",
      "Verification badge",
      "Expanded profile details",
      "Priority profile updates",
      "Quarterly data review",
    ],
    highlighted: true,
  },
  {
    id: "featured",
    name: "Featured",
    monthlyPrice: 299,
    ctaText: "Request This Plan",
    description: "Featured placement with higher visibility within eligible category and GEO pages.",
    features: [
      "Everything in Verified",
      "Featured placement in GEO pages",
      "Featured badge",
      "Higher visibility in category listings",
      "Monthly profile optimization",
      "Dedicated account contact",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 599,
    ctaText: "Request This Plan",
    description: "Premium placement with maximum visibility and featured content opportunities.",
    features: [
      "Everything in Featured",
      "Premium placement on homepage",
      "Premium badge",
      "Featured content opportunities",
      "Weekly profile optimization",
      "Priority support channel",
      "Custom promotional placements",
    ],
  },
  {
    id: "custom",
    name: "Custom",
    monthlyPrice: null,
    ctaText: "Contact Sales",
    description: "Tailored packages for multi-GEO campaigns and enterprise arrangements.",
    features: [
      "Multi-GEO campaigns",
      "Custom sponsorship packages",
      "Tailored visibility packages",
      "Enterprise arrangements",
      "Dedicated account management",
      "Custom reporting",
    ],
  },
];

export function getPricingTier(plan: ListingPlan): PricingTier | undefined {
  return PRICING_TIERS.find((t) => t.id === plan);
}

export function formatPrice(price: number | null): string {
  if (price === null) return "Custom";
  if (price === 0) return "€0";
  return `€${price}/month`;
}

export const PLACEMENT_TRANSPARENCY_STATEMENT =
  "Paid placement may affect visibility or placement, but it does not determine editorial scores. Casino ratings are based on structured data analysis, not commercial relationships.";
