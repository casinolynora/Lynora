import type { CasinoListing, ListingPlan } from "./types";

const PLAN_PRIORITY: Record<ListingPlan, number> = {
  premium: 400,
  featured: 300,
  verified: 200,
  custom: 250,
  free: 100,
};

export function getCasinoListingPriority(listing: CasinoListing): number {
  const { listing: meta } = listing;
  let score = PLAN_PRIORITY[meta.listingPlan] ?? 0;
  score += meta.adminPriority;
  if (meta.featured) score += 50;
  if (meta.premium) score += 100;
  if (meta.sponsored) score += 25;
  return score;
}

export function sortCasinoListings(listings: CasinoListing[]): CasinoListing[] {
  return [...listings].sort((a, b) => {
    const priorityA = getCasinoListingPriority(a);
    const priorityB = getCasinoListingPriority(b);
    if (priorityB !== priorityA) return priorityB - priorityA;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function isProductionVisible(listing: CasinoListing): boolean {
  return (
    listing.listing.listingStatus === "approved" &&
    listing.listing.listingVisibility === "published"
  );
}

export function canDisplayBadge(listing: CasinoListing, badge: "verified" | "featured" | "premium" | "sponsored"): boolean {
  if (!isProductionVisible(listing)) return false;
  switch (badge) {
    case "verified":
      return listing.listing.listingPlan === "verified" || listing.listing.listingPlan === "featured" || listing.listing.listingPlan === "premium";
    case "featured":
      return listing.listing.featured || listing.listing.listingPlan === "featured" || listing.listing.listingPlan === "premium";
    case "premium":
      return listing.listing.premium || listing.listing.listingPlan === "premium";
    case "sponsored":
      return listing.listing.sponsored;
    default:
      return false;
  }
}

export function isEditorialIndependent(listing: CasinoListing): boolean {
  return !listing.listing.sponsored && listing.listing.listingPlan === "free";
}
